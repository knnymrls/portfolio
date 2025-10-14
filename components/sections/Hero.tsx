"use client";

import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  title: string | React.ReactNode;
  imageUrl?: string;
  imageSrc?: unknown;
  imageAlt?: string;
  imageSize?: { width: number; height: number };
}

export default function Hero({
  title,
  imageUrl,
  imageSrc,
  imageAlt = "Hero image",
  imageSize = { width: 315, height: 315 },
}: HeroProps) {
  return (
    <section
      className="w-full pt-[165px] pb-[108px]"
      data-highlight-section="hero"
    >
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
        {/* Left content */}
        <div className="flex flex-col gap-9 flex-1">
          <h1
            className="text-3xl lg:text-4xl font-semibold text-foreground leading-[1.5] max-w-[650px]"
            data-highlight-id="hero-title"
          >
            {title}
          </h1>

          {/* CTA and social links */}
          <div
            className="flex items-center gap-3 flex-wrap"
            data-highlight-id="hero-actions"
          >
            <Link
              href="/contact"
              className="h-12 bg-foreground text-background px-6 rounded-[13px] flex items-center gap-2 hover:opacity-90 transition-opacity"
              data-highlight-id="cta-contact"
            >
              <Image src="/icons/send.svg" alt="" width={16} height={16} />
              <span className="text-lg font-medium tracking-[0.36px]">
                Reach out
              </span>
            </Link>

            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="GitHub"
              data-highlight-id="social-github"
            >
              <Image src="/icons/github.svg" alt="" width={20} height={20} />
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="LinkedIn"
              data-highlight-id="social-linkedin"
            >
              <Image src="/icons/linkedin.svg" alt="" width={20} height={20} />
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="Instagram"
              data-highlight-id="social-instagram"
            >
              <Image src="/icons/instagram.svg" alt="" width={20} height={20} />
            </Link>

            <Link
              href="/resume"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="Resume"
              data-highlight-id="social-resume"
            >
              <Image src="/icons/file.svg" alt="" width={20} height={20} />
            </Link>
          </div>
        </div>

        {/* Right content - Image */}
        <div
          className="shrink-0 order-first lg:order-last"
          data-highlight-id="hero-image"
        >
          <div
            className="relative mx-auto"
            style={{
              width: `${imageSize.width}px`,
              height: `${imageSize.height}px`,
            }}
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
