"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ease, duration, viewportOnceEarly } from '@/lib/motion';

interface CaseStudyVideoProps {
  src: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  poster?: string;
}

const videoReveal = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease },
  },
};

export default function CaseStudyVideo({
  src,
  caption,
  width,
  height,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  playsInline = true,
  poster,
}: CaseStudyVideoProps) {
  return (
    <motion.figure
      className={`my-12 ${className}`}
      variants={videoReveal}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnceEarly}
    >
      <div className="rounded-2xl overflow-hidden bg-surface-secondary/5">
        <video
          src={src}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline={playsInline}
          poster={poster}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-4 text-sm text-surface-secondary text-center">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}



