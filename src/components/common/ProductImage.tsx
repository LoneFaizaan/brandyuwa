import React, { useState } from 'react';
import { Shirt } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

/** Product photo with a neutral placeholder when the photo is missing or fails to load. */
export const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = '', eager }) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return (
      <div className={`flex items-center justify-center bg-soft text-faint ${className}`} role="img" aria-label={alt}>
        <Shirt size={28} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`bg-soft object-cover ${className}`}
    />
  );
};
