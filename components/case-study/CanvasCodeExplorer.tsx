"use client";

import React, { useState } from 'react';
import { File, Folder, ChevronRight, X } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
}

interface CanvasCodeExplorerProps {
  data?: FileNode[];
  title?: string;
}

// Only show src directory content
const srcData: FileNode = {
  name: 'src',
  type: 'folder',
  children: [
    {
      name: 'components',
      type: 'folder',
      children: [
        {
          name: 'Button.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  className
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-6 py-3 rounded-lg font-medium transition-all',
        variant === 'primary'
          ? 'bg-foreground text-background hover:opacity-90'
          : 'bg-surface border border-border hover:bg-border',
        className
      )}
    >
      {children}
    </button>
  );
}`
        },
        {
          name: 'Card.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';

interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-surface-secondary mb-4">{description}</p>
      {children}
    </div>
  );
}`
        },
        {
          name: 'Header.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';

export default function Header() {
  return (
    <header className="border-b border-border py-4">
      <nav className="max-w-[1000px] mx-auto px-4">
        <h1 className="text-2xl font-bold">My App</h1>
      </nav>
    </header>
  );
}`
        }
      ]
    },
    {
      name: 'lib',
      type: 'folder',
      children: [
        {
          name: 'utils.ts',
          type: 'file',
          language: 'typescript',
          content: `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}`
        },
        {
          name: 'api.ts',
          type: 'file',
          language: 'typescript',
          content: `export async function fetchData(endpoint: string) {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}`
        }
      ]
    },
    {
      name: 'hooks',
      type: 'folder',
      children: [
        {
          name: 'useDebounce.ts',
          type: 'file',
          language: 'typescript',
          content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`
        }
      ]
    },
    {
      name: 'app',
      type: 'folder',
      children: [
        {
          name: 'page.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-[1000px] mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Welcome</h1>
      </main>
    </>
  );
}`
        }
      ]
    }
  ]
};

// Improved syntax highlighter
function highlightCode(code: string, language: string): string {
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (language === 'typescript' || language === 'javascript') {
    highlighted = highlighted.replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, '<span class="text-[#98c379]">$1$2$1</span>');
    highlighted = highlighted.replace(/\/\/(.*?)$/gm, '<span class="text-[#5c6370] italic">//$1</span>');
    highlighted = highlighted.replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-[#5c6370] italic">/*$1*/</span>');

    const keywords = ['import', 'export', 'default', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'interface', 'type', 'extends', 'from', 'async', 'await'];
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-[#c678dd]">$1</span>');
    });

    highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-[#61afef]">$1</span>');
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-[#d19a66]">$1</span>');
    highlighted = highlighted.replace(/&lt;([a-zA-Z][a-zA-Z0-9]*)/g, '&lt;<span class="text-[#e06c75]">$1</span>');
    highlighted = highlighted.replace(/&lt;\/([a-zA-Z][a-zA-Z0-9]*)&gt;/g, '&lt;/<span class="text-[#e06c75]">$1</span>&gt;');
  }

  return highlighted;
}

interface FileIconProps {
  node: FileNode;
  onDoubleClick: () => void;
  isSelected: boolean;
  onClick: () => void;
}

function FileIcon({ node, onDoubleClick, isSelected, onClick }: FileIconProps) {
  const fileExtension = node.name.split('.').pop();
  const getFileColor = () => {
    if (node.type === 'folder') return 'text-[#53b8f7]';
    switch (fileExtension) {
      case 'tsx':
      case 'ts':
        return 'text-[#3178c6]';
      case 'jsx':
      case 'js':
        return 'text-[#f7df1e]';
      default:
        return 'text-surface-secondary';
    }
  };

  return (
    <div
      className={`
        group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl cursor-pointer
        transition-all duration-300 ease-out
        ${isSelected
          ? 'bg-gradient-to-br from-surface to-surface/50 shadow-lg ring-2 ring-border/50'
          : 'hover:bg-surface/60 hover:shadow-md hover:-translate-y-1'
        }
      `}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
    >
      <div className={`transition-all duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
        {node.type === 'folder' ? (
          <Folder size={56} className={getFileColor()} strokeWidth={1.5} />
        ) : (
          <File size={56} className={getFileColor()} strokeWidth={1.5} />
        )}
      </div>
      <span className={`text-sm text-center max-w-[140px] truncate transition-all duration-200 ${
        isSelected ? 'text-foreground font-semibold' : 'text-surface-secondary font-medium group-hover:text-foreground'
      }`} title={node.name}>
        {node.name}
      </span>
    </div>
  );
}

export default function CanvasCodeExplorer({ title = "src" }: CanvasCodeExplorerProps) {
  const [currentPath, setCurrentPath] = useState<FileNode[]>([srcData]);
  const [previewFile, setPreviewFile] = useState<FileNode | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const currentFolder = currentPath[currentPath.length - 1];
  const items = currentFolder.children || [];

  const handleItemDoubleClick = (item: FileNode) => {
    if (item.type === 'folder') {
      setCurrentPath([...currentPath, item]);
      setSelectedItem(null);
    } else {
      setPreviewFile(item);
    }
  };

  const handleItemClick = (item: FileNode) => {
    setSelectedItem(item.name);
  };

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
    setSelectedItem(null);
  };

  const handleClosePreview = () => {
    setPreviewFile(null);
  };

  return (
    <div className="my-12">
      {/* macOS-style Window */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-gradient-to-b from-surface to-background">
        {/* Title Bar */}
        <div className="bg-surface/80 backdrop-blur-xl border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
            </div>
            <div className="flex items-center gap-2 text-sm ml-4">
              {currentPath.map((folder, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight size={14} className="text-surface-secondary" />}
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className="text-surface-secondary hover:text-foreground transition-colors font-medium"
                  >
                    {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="p-10 min-h-[400px] bg-background/50">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-[350px] text-surface-secondary">
              <p className="text-sm">Empty folder</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item, index) => (
                <FileIcon
                  key={index}
                  node={item}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onClick={() => handleItemClick(item)}
                  isSelected={selectedItem === item.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-surface/50 backdrop-blur-xl border-t border-border px-5 py-2.5">
          <p className="text-xs text-surface-secondary font-medium">
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {selectedItem && ` • ${selectedItem}`}
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={handleClosePreview}
        >
          <div
            className="bg-[#1e1e1e] rounded-2xl border border-white/10 max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#252526] border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File size={18} className="text-gray-400" strokeWidth={2} />
                <span className="font-medium text-gray-200 text-sm">{previewFile.name}</span>
              </div>
              <button
                onClick={handleClosePreview}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Code Content */}
            <div className="p-8 overflow-auto max-h-[calc(85vh-80px)]">
              <pre className="text-[13px] leading-[1.8]">
                <code
                  className="text-gray-300 font-mono"
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(previewFile.content || '', previewFile.language || '')
                  }}
                />
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { srcData as canvasDummyData };
