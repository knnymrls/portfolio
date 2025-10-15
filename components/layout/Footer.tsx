import Link from "next/link";
import Image from "next/image";

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
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
              aria-label="GitHub"
            >
              <Image src="/icons/github.svg" alt="" width={20} height={20} className="dark:invert" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
              aria-label="LinkedIn"
            >
              <Image src="/icons/linkedin.svg" alt="" width={20} height={20} className="dark:invert" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
              aria-label="Instagram"
            >
              <Image src="/icons/instagram.svg" alt="" width={20} height={20} className="dark:invert" />
            </Link>
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={"/resume" as any}
              className="h-10 w-10 bg-surface rounded-[13px] border border-border flex items-center justify-center hover:bg-border/20 transition-colors text-foreground"
              aria-label="Resume"
            >
              <Image src="/icons/file.svg" alt="" width={20} height={20} className="dark:invert" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
