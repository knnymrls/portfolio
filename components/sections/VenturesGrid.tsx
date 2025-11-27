"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VentureModal from "@/components/ui/VentureModal";
import type { Venture } from "@/lib/content/loader";
import { staggerContainer, staggerItem, fadeUp, viewportOnce } from "@/lib/motion";

interface VenturesGridProps {
  ventures: Venture[];
}

function VentureCardContent({ venture }: { venture: Venture }) {
  return (
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
        <h3 className="text-base font-medium text-foreground transition-colors">
          {venture.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground leading-relaxed line-clamp-2">
          {venture.description}
        </p>
      </div>
    </div>
  );
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
        <motion.h2
          className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase"
          data-highlight-id="ventures-title"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          VENTURES
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {ventures.map((venture, index) => (
            <motion.div
              key={index}
              className="bg-surface rounded-[20px] border border-border overflow-hidden h-full cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-foreground/20"
              onClick={() => handleVentureClick(venture)}
              data-highlight-id={`venture-${venture.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`}
              variants={staggerItem}
            >
              <VentureCardContent venture={venture} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <VentureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        venture={selectedVenture}
      />
    </section>
  );
}
