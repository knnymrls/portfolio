"use client";

interface ContentCreationItemProps {
  title: string;
  description: string;
  ctaText: string;
  videoCount?: number;
  videoFormat?: "portrait" | "landscape";
}

function ContentCreationItem({
  title,
  description,
  ctaText,
  videoCount = 3,
  videoFormat = "portrait",
}: ContentCreationItemProps) {
  const isLandscape = videoFormat === "landscape";

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center">
      <div className="flex flex-col gap-8 w-full lg:w-[268px]">
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-medium text-foreground">{title}</h3>
          <p className="text-base text-surface-secondary leading-relaxed">
            {description}
          </p>
        </div>
        <button className="bg-foreground text-background px-4 py-2 rounded-[13px] flex items-center justify-center hover:opacity-90 transition-opacity w-fit">
          <span className="text-base font-medium tracking-[0.36px]">
            {ctaText}
          </span>
        </button>
      </div>
      <div
        className={`flex-1 grid gap-4 ${
          isLandscape
            ? "grid-cols-1"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {Array.from({ length: videoCount }, (_, i) => (
          <div
            key={i}
            className={`bg-surface rounded-[20px] border border-border ${
              isLandscape ? "h-[280px] lg:h-[360px]" : "h-[405px]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ContentCreationSection() {
  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          CONTENT CREATION
        </h2>
        <div className="flex flex-col gap-10">
          <ContentCreationItem
            title="Tiktok/Instagram"
            description="I make tech/startup related content about things I enjoy. This spans things from design, coding, and just the market and trends."
            ctaText="Watch"
            videoCount={3}
            videoFormat="portrait"
          />
          <ContentCreationItem
            title="Youtube"
            description="I post long form videos on what I'm doing on a weekly basis and will occasionally do a tutorial of some sort"
            ctaText="Watch"
            videoCount={1}
            videoFormat="landscape"
          />
        </div>
      </div>
    </section>
  );
}
