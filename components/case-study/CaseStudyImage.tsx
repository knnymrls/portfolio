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
    <figure className={`my-12 ${className}`}>
      <div className="rounded-2xl overflow-hidden">
        {width && height ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="w-full h-auto object-cover" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm text-surface-secondary text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
