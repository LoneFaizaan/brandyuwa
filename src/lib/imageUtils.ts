/**
 * Optimizes photos and uploads them to Supabase Storage.
 * - Resizes large photos (down to max 1000x1250) for fast web loading.
 * - Uploads the optimized image to Supabase Storage 'product-images' bucket.
 * - Returns the Supabase CDN public URL, or falls back to data URL if offline.
 */
import { supabase } from './supabase';

const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1250;
const QUALITY = 0.78;

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, mimeType, quality));
}

export async function processImageFile(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error(`"${file.name}" is not a photo.`);
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onerror = () => reject(new Error(`"${file.name}" could not be opened. Try a JPG or PNG photo.`));
    el.onload = () => resolve(el);
    el.src = dataUrl;
  });

  const ratio = Math.min(1, MAX_WIDTH / img.width, MAX_HEIGHT / img.height);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext('2d');
  
  let fallbackDataUrl = dataUrl;
  let uploadBlob: Blob | null = null;
  let fileExt = 'webp';

  if (ctx) {
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    fallbackDataUrl = canvas.toDataURL('image/webp', QUALITY);
    if (!fallbackDataUrl.startsWith('data:image/webp')) {
      fallbackDataUrl = canvas.toDataURL('image/jpeg', QUALITY);
      fileExt = 'jpg';
      uploadBlob = await canvasToBlob(canvas, 'image/jpeg', QUALITY);
    } else {
      uploadBlob = await canvasToBlob(canvas, 'image/webp', QUALITY);
    }
  }

  // Try uploading optimized blob to Supabase Storage
  try {
    const body = uploadBlob || file;
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
    const filePath = `products/${filename}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, body, {
        contentType: fileExt === 'webp' ? 'image/webp' : 'image/jpeg',
        cacheControl: '31536000',
        upsert: false,
      });

    if (!error && data) {
      const { data: pubData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);
      if (pubData?.publicUrl) {
        return pubData.publicUrl;
      }
    }
  } catch (err) {
    console.warn('Supabase image upload failed, falling back to local data URL:', err);
  }

  return fallbackDataUrl;
}

export async function processImageFiles(files: FileList | File[]) {
  const urls: string[] = [];
  const errors: string[] = [];
  for (const file of Array.from(files)) {
    try {
      urls.push(await processImageFile(file));
    } catch (err) {
      errors.push(err instanceof Error ? err.message : `Could not add "${file.name}".`);
    }
  }
  return { urls, errors };
}
