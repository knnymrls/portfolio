"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SubItem {
  id: string;
  title: string;
}

interface TocItem {
  id: string;
  title: string;
  subItems: SubItem[];
}

export default function TableOfContents() {
  const [mounted, setMounted] = useState(false);
  const [sections, setSections] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract sections and h3 subheadings from DOM
  useEffect(() => {
    const timer = setTimeout(() => {
      const sectionElements = document.querySelectorAll("section[id]");
      const allH3Elements = document.querySelectorAll("h3");
      const items: TocItem[] = [];

      // Build array of sections with their positions
      const sectionData: { id: string; title: string; top: number }[] = [];
      sectionElements.forEach((section) => {
        const id = section.id;
        const h2 = section.querySelector("h2");
        if (h2 && id) {
          sectionData.push({
            id,
            title: h2.textContent || "",
            top: section.getBoundingClientRect().top + window.scrollY,
          });
        }
      });

      // For each section, find h3s that belong to it (between this section and the next)
      sectionData.forEach((section, idx) => {
        const nextSectionTop = idx < sectionData.length - 1
          ? sectionData[idx + 1].top
          : Infinity;

        const subItems: SubItem[] = [];

        allH3Elements.forEach((h3) => {
          const h3Top = h3.getBoundingClientRect().top + window.scrollY;
          // h3 belongs to this section if it's after this section and before the next
          if (h3Top >= section.top && h3Top < nextSectionTop) {
            const h3Text = h3.textContent || "";
            const h3Id = h3Text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            h3.id = h3Id;
            subItems.push({
              id: h3Id,
              title: h3Text,
            });
          }
        });

        items.push({
          id: section.id,
          title: section.title,
          subItems,
        });
      });

      setSections(items);

      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Track scroll position to determine active section or sub-item
  const handleScroll = useCallback(() => {
    if (sections.length === 0) return;

    const scrollY = window.scrollY;
    const offset = 150;

    let currentId = sections[0]?.id || "";

    // Check all sections and their sub-items
    for (const section of sections) {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) {
        const rect = sectionElement.getBoundingClientRect();
        const top = rect.top + scrollY - offset;
        if (scrollY >= top) {
          currentId = section.id;
        }
      }

      // Check sub-items (h3 headings)
      for (const subItem of section.subItems) {
        const subElement = document.getElementById(subItem.id);
        if (subElement) {
          const rect = subElement.getBoundingClientRect();
          const top = rect.top + scrollY - offset;
          if (scrollY >= top) {
            currentId = subItem.id;
          }
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
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!mounted || sections.length === 0) return null;

  // Check if section or any of its sub-items is active
  const isSectionActive = (section: TocItem) => {
    if (activeId === section.id) return true;
    return section.subItems.some((sub) => sub.id === activeId);
  };

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
          const sectionActive = isSectionActive(section);
          const hasSubItems = section.subItems.length > 0;

          return (
            <div key={section.id} className="flex flex-col">
              {/* Main section */}
              <motion.button
                onClick={() => handleClick(section.id)}
                className="group flex items-center gap-3 py-1.5 text-left cursor-pointer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                whileHover={{ x: 4 }}
              >
                {/* Indicator line */}
                <motion.div
                  className={`h-[2px] rounded-full transition-colors duration-200 ${
                    sectionActive ? "bg-foreground" : "bg-surface-secondary/50 group-hover:bg-surface-secondary"
                  }`}
                  animate={{
                    width: sectionActive ? 24 : 12,
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Label */}
                <span
                  className={`text-sm max-w-[160px] leading-tight transition-colors duration-200 ${
                    sectionActive ? "text-foreground" : "text-surface-secondary group-hover:text-foreground"
                  }`}
                >
                  {section.title}
                </span>
              </motion.button>

              {/* Sub-items (h3 headings) - only show when section is active */}
              <AnimatePresence>
                {hasSubItems && sectionActive && (
                  <motion.div
                    className="ml-6 flex flex-col overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {section.subItems.map((subItem, subIdx) => {
                      const isSubActive = activeId === subItem.id;
                      return (
                        <motion.button
                          key={subItem.id}
                          onClick={() => handleClick(subItem.id)}
                          className="group flex items-center gap-2 py-1 text-left cursor-pointer"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIdx * 0.03 }}
                          whileHover={{ x: 4 }}
                        >
                          {/* Small indicator */}
                          <motion.div
                            className={`h-[2px] rounded-full transition-colors duration-200 ${
                              isSubActive ? "bg-foreground" : "bg-surface-secondary/30 group-hover:bg-surface-secondary/50"
                            }`}
                            animate={{
                              width: isSubActive ? 16 : 8,
                            }}
                            transition={{ duration: 0.2 }}
                          />

                          {/* Label */}
                          <span
                            className={`text-xs max-w-[140px] leading-tight transition-colors duration-200 ${
                              isSubActive ? "text-foreground" : "text-surface-secondary/70 group-hover:text-foreground"
                            }`}
                          >
                            {subItem.title}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </nav>
  );

  return createPortal(tocContent, document.body);
}
