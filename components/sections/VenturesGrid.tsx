"use client";

import { useState } from "react";
import VentureModal from "@/components/ui/VentureModal";
import type { Venture } from "@/lib/content/loader";

interface VenturesGridProps {
  ventures: Venture[];
}

export default function VenturesGrid({ ventures }: VenturesGridProps) {
  const [selectedVenture, setSelectedVenture] = useState<Venture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVentureClick = (venture: Venture) => {
    setSelectedVenture(venture);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full pb-[108px]" data-highlight-section="ventures">
      <div className="flex flex-col gap-6">
        <h2
          className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase"
          data-highlight-id="ventures-title"
        >
          VENTURES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ventures.map((venture, index) => (
            <div
              key={index}
              className="bg-surface rounded-[20px] border border-border overflow-hidden h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              onClick={() => handleVentureClick(venture)}
              data-highlight-id={`venture-${venture.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`}
            >
              <div className="p-5 pb-6 flex flex-col h-full">
                {/* Logo Area */}
                <div
                  className={`h-[189px] ${venture.backgroundColor} rounded-[20px] overflow-hidden relative flex items-center justify-center mb-4`}
                >
                  {venture.logoUrl && (
                    <img
                      src={venture.logoUrl}
                      alt={`${venture.name} logo`}
                      className={`${venture.logoClassName || ''} object-contain`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  {/* Role and Date */}
                  <div className="flex items-start justify-between text-sm text-surface-secondary">
                    <span>{venture.role}</span>
                    <span className="whitespace-nowrap">
                      {venture.dateRange}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {venture.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                    {venture.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VentureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        venture={selectedVenture} 
      />
    </section>
  );
}
