import React from 'react';
import Image from 'next/image';

interface CaseStudyImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function CaseStudyImage({
  src,
  alt,
  caption,
  width,
  height,
  className = '',
}: CaseStudyImageProps) {
  return (
    <figure className={`my-8 ${className}`}>
      <div className="rounded-xl overflow-hidden border border-border bg-surface">
        {width && height ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
          />
        ) : (
          <img src={src} alt={alt} className="w-full h-auto" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-surface-secondary text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
