import React, { useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { processImageFiles } from '../../lib/imageUtils';

export const MAX_PHOTOS = 10;

interface PhotoPickerProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export const PhotoPicker: React.FC<PhotoPickerProps> = ({ images, onChange, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const room = MAX_PHOTOS - images.length;

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    const picked = Array.from(files).slice(0, room);
    const { urls, errors } = await processImageFiles(picked);
    if (files.length > room) errors.push(`Only ${MAX_PHOTOS} photos allowed — some were not added.`);
    setProblems(errors);
    if (urls.length) onChange([...images, ...urls]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const makeCover = (index: number) => onChange([images[index], ...images.filter((_, i) => i !== index)]);
  const removeAt = (index: number) => onChange(images.filter((_, i) => i !== index));

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((src, i) => (
          <div key={`${i}-${src.slice(-24)}`} className="relative aspect-[3/4] overflow-hidden rounded-xl bg-soft">
            <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 ? (
              <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1.5 text-center text-xs font-semibold text-white">Cover photo</span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(i)}
                className="absolute inset-x-0 bottom-0 bg-black/55 py-1.5 text-center text-xs font-semibold text-white hover:bg-black/70"
              >
                Make cover
              </button>
            )}
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
              aria-label={`Remove photo ${i + 1}`}
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {room > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className={`flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-canvas p-2 text-center text-sm font-semibold transition-colors hover:border-ink ${
              error ? 'border-sale text-sale' : 'border-line-strong text-ink'
            }`}
          >
            {busy ? <Loader2 size={26} className="animate-spin" /> : <Camera size={26} />}
            {busy ? 'Adding…' : images.length === 0 ? 'Add photos' : 'Add more'}
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
      {problems.map((p) => (
        <p key={p} className="error-text">
          {p}
        </p>
      ))}
      <p className="hint">Take photos with your phone or pick them from your gallery. The first photo is shown in the shop.</p>
    </div>
  );
};
