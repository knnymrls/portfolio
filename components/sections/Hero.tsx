"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface HeroProps {
  title: string | React.ReactNode;
  imageUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageSrc?: any;
  imageAlt?: string;
  imageSize?: { width: number; height: number };
  mobileImageUrl?: string;
  mobileImageSize?: { width: number; height: number };
}

export default function Hero({
  title,
  imageUrl,
  imageSrc,
  imageAlt = "Hero image",
  imageSize = { width: 315, height: 315 },
  mobileImageUrl,
  mobileImageSize = { width: 88, height: 88 },
}: HeroProps) {
  return (
    <section
      className="w-full pt-[165px] pb-[108px]"
      data-highlight-section="hero"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-start lg:items-center justify-between">
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
            className="flex flex-wrap items-center gap-3"
            data-highlight-id="hero-actions"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/contact"
                className="h-12 bg-foreground text-background px-6 rounded-[13px] flex items-center gap-2 hover:opacity-90 transition-opacity"
                data-highlight-id="cta-contact"
              >
                <motion.div
                  whileHover={{ x: 2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Image src="/icons/send.svg" alt="" width={16} height={16} className="dark:invert" />
                </motion.div>
                <span className="text-lg font-medium tracking-[0.36px]">
                  Reach out
                </span>
              </Link>
            </motion.div>

            <div className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="https://github.com/knnymrls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
                  aria-label="GitHub"
                  data-highlight-id="social-github"
                >
                  <Image src="/icons/github.svg" alt="" width={20} height={20} className="dark:invert" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link
                  href="https://www.linkedin.com/in/knnymrls/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
                  aria-label="LinkedIn"
                  data-highlight-id="social-linkedin"
                >
                  <Image src="/icons/linkedin.svg" alt="" width={20} height={20} className="dark:invert" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
                  aria-label="Resume"
                  data-highlight-id="social-resume"
                >
                  <Image src="/icons/file.svg" alt="" width={20} height={20} className="dark:invert" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right content - Image */}
        <div
          className="shrink-0 order-first lg:order-last"
          data-highlight-id="hero-image"
        >
          {/* Mobile image */}
          {mobileImageUrl && (
            <div
              className="relative lg:hidden"
              style={{
                width: `${mobileImageSize.width}px`,
                height: `${mobileImageSize.height}px`,
              }}
            >
              <img
                src={mobileImageUrl}
                alt={imageAlt}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Image - responsive sizing */}
          <div
            className={`relative mx-auto ${mobileImageUrl ? 'hidden lg:block' : ''} w-[120px] h-[120px] lg:w-[315px] lg:h-[315px]`}
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
