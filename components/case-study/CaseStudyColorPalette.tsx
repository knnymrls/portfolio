import React from 'react';

interface ColorSwatch {
  name: string;
  hex: string;
  description?: string;
  textColor?: string;
}

interface CaseStudyColorPaletteProps {
  colors: ColorSwatch[];
}

export default function CaseStudyColorPalette({ colors }: CaseStudyColorPaletteProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {colors.map((color, index) => (
        <div key={index} className="flex flex-col group">
          <div 
            className="h-32 w-full rounded-2xl shadow-sm mb-3 relative flex items-end p-4 transition-transform hover:scale-[1.02] duration-300"
            style={{ backgroundColor: color.hex }}
          >
            <div 
              className="text-sm font-medium font-mono"
              style={{ color: color.textColor || (['#ffffff', '#fbfbfb'].includes(color.hex.toLowerCase()) ? '#000' : '#fff') }}
            >
              {color.hex}
            </div>
          </div>
          <div>
            <h4 className="text-base font-semibold text-foreground">{color.name}</h4>
            {color.description && (
              <p className="text-sm text-surface-secondary">{color.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

