"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

interface TocItem {
  id: string;
  title: string;
}

export default function TableOfContents() {
  const [mounted, setMounted] = useState(false);
  const [sections, setSections] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract sections from DOM after a brief delay for MDX to render
  useEffect(() => {
    const timer = setTimeout(() => {
      const sectionElements = document.querySelectorAll("section[id]");
      const items: TocItem[] = [];

      sectionElements.forEach((section) => {
        const id = section.id;
        const h2 = section.querySelector("h2");
        if (h2 && id) {
          items.push({
            id,
            title: h2.textContent || "",
          });
        }
      });

      setSections(items);

      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Track scroll position to determine active section
  const handleScroll = useCallback(() => {
    if (sections.length === 0) return;

    const scrollY = window.scrollY;
    const offset = 150; // Offset from top to trigger active state

    // Find the current section
    let currentId = sections[0]?.id || "";

    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top + scrollY - offset;

        if (scrollY >= top) {
          currentId = section.id;
        }
      }
    }

    setActiveId(currentId);
  }, [sections]);

  useEffect(() => {
    if (sections.length === 0) return;

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, handleScroll]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted || sections.length === 0) return null;

  const tocContent = (
    <nav className="hidden xl:block fixed left-8 top-32 z-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-col gap-1"
      >
        <span className="text-xs font-medium text-surface-secondary uppercase tracking-wider mb-3">
          Contents
        </span>

        {sections.map((section, idx) => {
          const isActive = activeId === section.id;

          return (
            <motion.button
              key={section.id}
              onClick={() => handleClick(section.id)}
              className="group flex items-center gap-3 py-1.5 text-left"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.05 }}
              whileHover={{ x: 4 }}
            >
              {/* Indicator line */}
              <motion.div
                className={`h-[2px] rounded-full transition-colors duration-200 ${
                  isActive ? "bg-foreground" : "bg-surface-secondary/50 group-hover:bg-surface-secondary"
                }`}
                animate={{
                  width: isActive ? 24 : 12,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Label */}
              <span
                className={`text-sm max-w-[140px] truncate transition-colors duration-200 ${
                  isActive ? "text-foreground" : "text-surface-secondary group-hover:text-foreground/70"
                }`}
              >
                {section.title}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </nav>
  );

  return createPortal(tocContent, document.body);
}
