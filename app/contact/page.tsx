'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Cal, { getCalApi } from '@calcom/embed-react';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function ContactPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: '30min' });
      cal('ui', { hideEventTypeDetails: false, layout: 'month_view' });
    })();
  }, []);

  return (
    <div className="max-w-[1000px] mx-auto px-4 pt-[165px] pb-[108px]" data-highlight-section="contact">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItem} className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4">
            Let&apos;s chat
          </h1>
          <p className="text-lg text-surface-secondary max-w-md">
            Have a project in mind or just want to connect? Book a time or reach out directly.
          </p>
        </motion.div>

        {/* Contact options */}
        <motion.div
          variants={staggerItem}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10"
        >
          {/* Email */}
          <a
            href="mailto:knnymrls@outlook.com"
            className="group flex items-center gap-3"
          >
            <div className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center group-hover:bg-border/20 transition-colors">
              <Mail size={20} className="text-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-surface-secondary">Email me</span>
              <span className="text-foreground font-medium group-hover:underline">knnymrls@outlook.com</span>
            </div>
          </a>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/knnymrls"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="GitHub"
            >
              <Image src="/icons/github.svg" alt="" width={20} height={20} className="dark:invert" />
            </Link>

            <Link
              href="https://www.linkedin.com/in/knnymrls/"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Image src="/icons/linkedin.svg" alt="" width={20} height={20} className="dark:invert" />
            </Link>

            <Link
              href="https://instagram.com/knnymrls"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="Instagram"
            >
              <Image src="/icons/instagram.svg" alt="" width={20} height={20} className="dark:invert" />
            </Link>
          </div>
        </motion.div>

        {/* Cal.com embed - full width */}
        <motion.div
          variants={staggerItem}
          className="w-full min-h-[700px]"
        >
          <Cal
            namespace="30min"
            calLink="knnymrls/30min"
            style={{ width: '100%', height: '100%', overflow: 'scroll' }}
            config={{ layout: 'month_view' }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}