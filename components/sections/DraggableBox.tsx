"use client";

import React, { useRef, useState } from 'react';
import DraggableItem from '@/components/ui/DraggableItem';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

export default function DraggableBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey(prev => prev + 1);
  };

  return (
    <section className="w-full pb-[108px]">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-base text-surface-secondary tracking-[0.32px] uppercase">
            WHO I AM
          </h2>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 text-sm text-surface-secondary hover:text-foreground transition-colors"
            aria-label="Reset items"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
        
        <div 
          ref={containerRef}
          className="relative w-full h-[600px] bg-surface-secondary/5 rounded-[32px] border border-border overflow-hidden"
        >
          {/* Key forces re-render of all children when changed, effectively resetting them */}
          <div key={resetKey} className="absolute inset-0">
            {/* Scattered Items - Using random positions within the larger container */}
            
            {/* Top Left: Nebraska */}
            <DraggableItem dragConstraints={containerRef} left="8%" top="8%" rotation={-12} className="bg-[#E41937] text-white p-4 rounded-lg font-bold text-lg z-10">
              🌽 Nebraska
            </DraggableItem>

            {/* Bottom Right: Coffee */}
            <DraggableItem dragConstraints={containerRef} left="85%" top="65%" rotation={15} className="bg-[#6F4E37] text-white w-24 h-24 rounded-full flex items-center justify-center border-4 border-white/20 z-20">
              <span className="text-4xl">☕️</span>
            </DraggableItem>

            {/* Center: Polaroid (The centerpiece) */}
            <DraggableItem dragConstraints={containerRef} left="50%" top="35%" rotation={5} className="bg-white p-3 pb-8 shadow-xl rotate-3 z-30 -translate-x-1/2">
              <div className="w-48 h-48 bg-gray-200 relative overflow-hidden pointer-events-none">
                <Image 
                  src="/images/hero-kenny.png" 
                  alt="Kenny" 
                  fill 
                  className="object-cover grayscale hover:grayscale-0 transition-all pointer-events-none"
                  draggable={false}
                />
              </div>
              <div className="text-center font-handwriting mt-3 text-gray-600 text-sm font-medium">
                Kenny M.
              </div>
            </DraggableItem>

            {/* Top Right: Tech Stack */}
            <DraggableItem dragConstraints={containerRef} left="75%" top="12%" rotation={8} className="bg-black text-white px-6 py-3 rounded-full font-mono text-sm border border-white/20 z-10">
              Next.js_Lover
            </DraggableItem>

            {/* Bottom Left: Spotify */}
            <DraggableItem dragConstraints={containerRef} left="12%" top="60%" rotation={-6} className="bg-[#1DB954] text-white w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 z-20">
               <span className="text-4xl">🎵</span>
               <span className="text-xs font-bold">Spotify</span>
            </DraggableItem>

            {/* Random Spot: 100 Emoji */}
            <DraggableItem dragConstraints={containerRef} left="35%" top="75%" rotation={25} className="text-6xl filter drop-shadow-lg z-40 cursor-pointer">
              💯
            </DraggableItem>

            {/* Mid Right: Laptop */}
            <DraggableItem dragConstraints={containerRef} left="80%" top="40%" rotation={-15} className="bg-gray-200 w-48 h-32 rounded-xl border-4 border-gray-400 flex items-center justify-center text-5xl shadow-inner z-10">
              💻
            </DraggableItem>
            
            {/* Extra Items for chaos */}
            <DraggableItem dragConstraints={containerRef} left="25%" top="15%" rotation={45} className="bg-yellow-400 text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-black z-10">
              ?
            </DraggableItem>
            
            <DraggableItem dragConstraints={containerRef} left="60%" top="80%" rotation={-10} className="bg-purple-500 text-white px-4 py-2 rounded-lg transform skew-x-12 z-10">
              Builder
            </DraggableItem>
          </div>

        </div>
        
        <p className="text-center text-surface-secondary text-sm italic">
          Go ahead, make a mess.
        </p>
      </div>
    </section>
  );
}
