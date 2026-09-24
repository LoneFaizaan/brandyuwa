/**
 * Shrinks phone photos before saving so they load fast and fit in browser storage.
 * A 4 MB camera photo becomes roughly 80–150 KB.
 */
const MAX_WIDTH = 1000;
const MAX_HEIGHT = 1250;
const QUALITY = 0.78;

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
  if (ratio === 1 && file.size < 150 * 1024) return dataUrl;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const webp = canvas.toDataURL('image/webp', QUALITY);
  return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', QUALITY);
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
