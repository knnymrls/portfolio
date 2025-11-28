"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ease, duration, viewportOnceEarly } from '@/lib/motion';

interface CaseStudyImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
  quality?: number;
  unoptimized?: boolean;
}

const imageReveal = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease },
  },
};

export default function CaseStudyImage({
  src,
  alt,
  caption,
  width,
  height,
  className = '',
  quality = 95,
  unoptimized = false,
}: CaseStudyImageProps) {
  return (
    <motion.figure
      className={`my-12 ${className}`}
      variants={imageReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnceEarly}
    >
      <div className="rounded-2xl border-1 border-border overflow-hidden">
        {width && height ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            quality={quality}
            unoptimized={unoptimized}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
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
    </motion.figure>
  );
}
