'use client';

import React, { useState } from 'react';
import PressModal from '@/components/ui/PressModal';
import type { PressItem } from "@/lib/content/loader";

interface PressSectionProps {
  items: PressItem[];
}

export default function PressSection({ items }: PressSectionProps) {
  const [selectedItem, setSelectedItem] = useState<PressItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: PressItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-6">
        <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
          ON THE PRESS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((press, index) => (
            <div 
              key={index} 
              className="bg-surface rounded-[20px] border border-border overflow-hidden h-[280px] cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
              onClick={() => handleItemClick(press)}
            >
              <div className="p-5 pb-6 flex flex-col h-full">
                {/* Logo Area */}
                <div className={`flex-1 ${press.backgroundColor} rounded-[20px] overflow-hidden relative flex items-center justify-center mb-4`}>
                  <img 
                    src={press.logoUrl} 
                    alt={`${press.name} logo`}
                    className={`${press.logoClassName} object-contain transform transition-transform duration-500 group-hover:scale-110`}
                  />
                </div>
                
                {/* Name */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {press.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PressModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
      />
    </section>
  );
}
