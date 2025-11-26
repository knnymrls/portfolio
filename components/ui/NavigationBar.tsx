"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavigationTab {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  href: any;
}

interface NavigationBarProps {
  tabs: NavigationTab[];
  className?: string;
}

export function NavigationBar({ tabs, className }: NavigationBarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
        "backdrop-blur-[2px] bg-surface",
        "flex gap-2 items-center justify-center",
        "rounded-[12px] border border-border",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        padding: isHovered ? "6px" : "4px",
        opacity: isHovered ? 1 : 0.85,
      }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.href === "/" && pathname === "/") ||
          (tab.href !== "/" && pathname.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex items-center justify-center",
              "px-3 rounded-[12px]",
              "text-base leading-none tracking-[0.32px]",
              "font-['Sora',_sans-serif]",
              "transition-colors duration-200",
              isActive
                ? "text-foreground font-semibold"
                : "text-surface-secondary font-normal hover:text-foreground/70 hover:bg-nav-inactive hover:border-border"
            )}
            style={{
              paddingTop: isHovered ? 12 : 10,
              paddingBottom: isHovered ? 12 : 10,
              width: isHovered ? 103 : 95,
              transition: "padding 0.15s ease-out, width 0.15s ease-out, color 0.2s ease-out, background-color 0.2s ease-out",
            }}
          >
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute inset-0 bg-nav-active rounded-[10px]"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </Link>
        );
      })}
    </motion.div>
  );
}
