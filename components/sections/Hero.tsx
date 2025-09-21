'use client';

import Link from 'next/link';
import { Send, Github, Linkedin, Instagram, FileText } from 'lucide-react';
import Image from 'next/image';

interface HeroProps {
  title: string | React.ReactNode;
  imageUrl?: string;
  imageSrc?: any;
  imageAlt?: string;
  imageSize?: { width: number; height: number };
}

export default function Hero({ 
  title, 
  imageUrl, 
  imageSrc,
  imageAlt = "Hero image",
  imageSize = { width: 315, height: 315 }
}: HeroProps) {
  return (
    <section className="w-full pt-[165px] pb-[108px]">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
        {/* Left content */}
        <div className="flex flex-col gap-9 flex-1">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground leading-[1.5] max-w-[618px]">
            {title}
          </h1>
          
          {/* CTA and social links */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link 
              href="/contact"
              className="h-12 bg-foreground text-background px-6 rounded-[13px] flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              <span className="text-lg font-medium tracking-[0.36px]">Reach out</span>
            </Link>
            
            <Link 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-foreground" />
            </Link>
            
            <Link 
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-foreground" />
            </Link>
            
            <Link 
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-foreground" />
            </Link>
            
            <Link 
              href="/resume"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="Resume"
            >
              <FileText className="w-5 h-5 text-foreground" />
            </Link>
          </div>
        </div>

        {/* Right content - Image */}
        <div className="shrink-0 order-first lg:order-last">
          <div 
            className="relative mx-auto"
            style={{ width: `${imageSize.width}px`, height: `${imageSize.height}px` }}
          >
            {imageSrc ? (
              <Image 
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-contain"
              />
            ) : imageUrl ? (
              <img 
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-contain"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}