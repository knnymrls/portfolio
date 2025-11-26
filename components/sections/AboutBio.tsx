"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const paragraphs = [
  "I'm a designer and developer from Nebraska, passionate about building AI-powered interfaces that make technology more accessible and intuitive.",
  "I believe great design should feel invisible. The best products are the ones that just work. No friction, no confusion, just seamless experiences.",
  "My journey started with curiosity about how things work and evolved into a deep love for creating digital experiences that genuinely help people.",
  "I obsess over the details that most people never notice but everyone feels. That's where the real craft lives.",
];

function ScrollWord({ word }: { word: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);

  return (
    <motion.span
      ref={ref}
      style={{ opacity }}
      className="inline-block mr-[0.3em] text-foreground"
    >
      {word}
    </motion.span>
  );
}

function ScrollParagraph({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <p className="text-2xl md:text-3xl font-medium leading-[1.5] mb-10">
      {words.map((word, i) => (
        <ScrollWord key={i} word={word} />
      ))}
    </p>
  );
}

export default function AboutBio() {
  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-8">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          ABOUT ME
        </h2>

        <div className="max-w-3xl">
          {paragraphs.map((text, idx) => (
            <ScrollParagraph key={idx} text={text} />
          ))}
        </div>
      </div>
    </section>
  );
}
