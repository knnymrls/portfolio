"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const buttonMotion = {
    whileHover: { scale: 1.08, y: -2 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
  };

  return (
    <footer className="w-full ">
      <div className="max-w-[1000px] mx-auto px-4 py-12">
        <div className="flex flex-row items-center justify-between gap-6">
          {/* Left side - Name and copyright */}
          <div className="text-left">
            <p className="text-sm font-medium text-surface-secondary">
              knnymrls - {currentYear}
            </p>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-2">
            <motion.div {...buttonMotion}>
              <Link
                href="https://github.com/knnymrls"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
                aria-label="GitHub"
              >
                <Image src="/icons/github.svg" alt="" width={20} height={20} className="dark:invert" />
              </Link>
            </motion.div>
            <motion.div {...buttonMotion}>
              <Link
                href="https://www.linkedin.com/in/knnymrls/"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
                aria-label="LinkedIn"
              >
                <Image src="/icons/linkedin.svg" alt="" width={20} height={20} className="dark:invert" />
              </Link>
            </motion.div>
            <motion.div {...buttonMotion}>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
                aria-label="Resume"
              >
                <Image src="/icons/file.svg" alt="" width={20} height={20} className="dark:invert" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
