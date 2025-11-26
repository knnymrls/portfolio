"use client";

import React from "react";
import Link from "next/link";

interface FindUHeroProps {
  title: string;
  description: string;
  role: string;
  timeline: string;
  tags: string[];
}

export default function FindUHero({
  title,
}: FindUHeroProps) {
  return (
    <section className="w-full pt-[100px] pb-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-surface-secondary hover:text-foreground transition-colors mb-12"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="rotate-180">
          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm font-medium">Back</span>
      </Link>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-semibold text-foreground leading-[1.2] mb-4">
        {title} Case Study
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-surface-secondary max-w-2xl">
        Helping the next generation of students figure out their next steps after high school.
      </p>
    </section>
  );
}

