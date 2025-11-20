'use client';

import React, { useState } from 'react';
import PressModal from '@/components/ui/PressModal';

const imgImage13 = "/figma-assets/a0d2865fff9d77a7f3b389745ae464f0b8b246a3.png";
const imgImage14 = "/figma-assets/778cd92189b051f83d245401eada88227bd8b23f.png";
const imgImage15 = "/figma-assets/4dcee9d4caa19b2b19013c2b54a754d5acc12d3b.png";
const imgImage17 = "/figma-assets/1db2cfac7bec21c6d3051fdc52267ec049527503.png";
const imgImage18 = "/figma-assets/eebc416a56e9c6422d1994d359becce58e8b37cc.png";
const imgImage19 = "/figma-assets/5aaaebbbbab89cd3d1705a752e12a7e5824f7b1d.png";

interface PressItem {
  name: string;
  backgroundColor: string;
  logoUrl: string;
  logoClassName: string;
  title?: string;
  description?: string;
  date?: string;
  articleUrl?: string;
}

const pressItems: PressItem[] = [
  {
    name: 'Silicon Prairie News',
    backgroundColor: 'bg-[#f59222]',
    logoUrl: imgImage13,
    logoClassName: 'w-[121px] h-[121px]',
    title: 'FindU named Top Startup in the Prairie',
    description: 'Silicon Prairie News covers the rapid growth of FindU and its impact on high school education across the Midwest region.',
    date: 'October 2024',
    articleUrl: '#'
  },
  {
    name: 'NPSA',
    backgroundColor: 'bg-[#a5a7a9]',
    logoUrl: imgImage18,
    logoClassName: 'w-[101px] h-[105px]',
    title: 'Innovation Award Winner 2024',
    description: 'Recognized for outstanding contribution to student success technologies and educational accessibility.',
    date: 'September 2024',
    articleUrl: '#'
  },
  {
    name: 'New York Post',
    backgroundColor: 'bg-[#cb0000]',
    logoUrl: imgImage15,
    logoClassName: 'w-[150px] h-[150px]',
    title: 'Gen Z Founders Changing EdTech',
    description: 'A feature story on how young entrepreneurs are reshaping the educational landscape for their peers.',
    date: 'August 2024',
    articleUrl: '#'
  },
  {
    name: 'Fox Business',
    backgroundColor: 'bg-neutral-100',
    logoUrl: imgImage17,
    logoClassName: 'w-[124px] h-[62px]',
    title: 'The Future of Career Counseling',
    description: 'Discussing the shift from traditional guidance counselors to AI-driven personalized support systems.',
    date: 'July 2024',
    articleUrl: '#'
  },
  {
    name: 'Business Insider',
    backgroundColor: 'bg-[#002aff]',
    logoUrl: imgImage14,
    logoClassName: 'w-[156px] h-[53px]',
    title: '30 Under 30: Education Tech',
    description: 'Highlighted as one of the most promising new startups in the educational technology sector.',
    date: 'June 2024',
    articleUrl: '#'
  },
  {
    name: 'University of Nebraska-Lincoln',
    backgroundColor: 'bg-neutral-100',
    logoUrl: imgImage19,
    logoClassName: 'w-[96px] h-[96px]',
    title: 'Student Spotlight: Kenny Morales',
    description: 'University profile on balancing full-time studies with building a venture-backed startup.',
    date: 'May 2024',
    articleUrl: '#'
  }
];

export default function PressSection() {
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
          {pressItems.map((press, index) => (
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
