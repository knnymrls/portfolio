import Link from 'next/link';
import { Github, Linkedin, Instagram, FileText } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-20 border-t border-border bg-background">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Name and copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-surface-secondary">
              © {currentYear} Kenny Morales
            </p>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-2">
            <Link 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-[13px] border border-border bg-surface hover:bg-border/20 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-foreground" />
            </Link>
            <Link 
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-[13px] border border-border bg-surface hover:bg-border/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-foreground" />
            </Link>
            <Link 
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-[13px] border border-border bg-surface hover:bg-border/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-foreground" />
            </Link>
            <Link 
              href="/resume"
              className="p-3.5 rounded-[13px] border border-border bg-surface hover:bg-border/20 transition-colors"
              aria-label="Resume"
            >
              <FileText className="w-5 h-5 text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}