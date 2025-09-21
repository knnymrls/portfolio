"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavigationTab {
  label: string;
  href: string;
}

interface NavigationBarProps {
  tabs: NavigationTab[];
  className?: string;
}

export function NavigationBar({ tabs, className }: NavigationBarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50",
        "backdrop-blur-[2px] bg-surface",
        "flex gap-2 items-center justify-center p-1.5",
        "rounded-[12px] border border-border",
        className
      )}
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
              "flex items-center justify-center",
              "px-3 py-3 rounded-[12px]",
              "text-base leading-none tracking-[0.32px]",
              "transition-all duration-200",
              "w-[103px]",
              "font-['Sora',_sans-serif]",
              "border border-transparent",
              isActive
                ? "bg-nav-active text-foreground font-semibold"
                : "text-surface-secondary font-normal hover:bg-nav-inactive hover:border-border"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
