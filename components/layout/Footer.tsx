import Link from "next/link";
import { Github, Linkedin, Instagram, FileText } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full ">
      <div className="max-w-[1000px] mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - Name and copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm font-medium text-surface-secondary">
              knnymrls - {currentYear}
            </p>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-2">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-foreground" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-foreground" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-foreground" />
            </Link>
            <Link
              href="/resume"
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors"
              aria-label="Resume"
            >
              <FileText className="w-4 h-4 text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
