"use client";

import React, { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
}

interface CodeExplorerProps {
  data: FileNode[];
  title?: string;
}

const dummyData: FileNode[] = [
  {
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
          }
        ]
      }
    ]
  },
  {
    name: 'README.md',
    type: 'file',
    language: 'markdown',
    content: `# Project Name

A modern web application built with Next.js and React.

## Features

- 🎨 Beautiful UI components
- ⚡ Fast and responsive
- 🎯 Type-safe with TypeScript
- 🎭 Accessible design

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000 to see the result.`
  },
  {
    name: 'package.json',
    type: 'file',
    language: 'json',
    content: `{
  "name": "project-name",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`
  }
];

// Simple syntax highlighter (basic implementation)
function highlightCode(code: string, language: string): string {
  const keywords = {
    typescript: ['import', 'export', 'default', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'interface', 'type', 'extends', 'from'],
    javascript: ['import', 'export', 'default', 'function', 'const', 'let', 'var', 'return', 'if', 'else', 'from'],
    json: [],
    markdown: []
  };

  let highlighted = code;

  // Escape HTML
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (language === 'typescript' || language === 'javascript') {
    // Highlight strings
    highlighted = highlighted.replace(/(['"`])(.*?)\1/g, '<span class="text-[#98c379]">$1$2$1</span>');

    // Highlight comments
    highlighted = highlighted.replace(/\/\/(.*?)$/gm, '<span class="text-surface-secondary italic">//$1</span>');

    // Highlight keywords
    const langKeywords = keywords[language as keyof typeof keywords] || [];
    langKeywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-[#c678dd]">$1</span>');
    });

    // Highlight function names
    highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, '<span class="text-[#61afef]">$1</span>(');

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-[#d19a66]">$1</span>');
  }

  return highlighted;
}

function FileTree({ node, onSelect, level = 0 }: { node: FileNode; onSelect: (file: FileNode) => void; level?: number }) {
  const [isOpen, setIsOpen] = useState(level === 0);

  if (node.type === 'file') {
    return (
      <div
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-surface rounded cursor-pointer transition-colors"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        <File size={16} className="text-surface-secondary flex-shrink-0" />
        <span className="text-sm">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-surface rounded cursor-pointer transition-colors"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown size={16} className="text-surface-secondary flex-shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-surface-secondary flex-shrink-0" />
        )}
        <Folder size={16} className="text-surface-secondary flex-shrink-0" />
        <span className="text-sm font-medium">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTree key={index} node={child} onSelect={onSelect} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CodeExplorer({ data = dummyData, title = "Project Structure" }: CodeExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  return (
    <div className="my-8 border border-border rounded-xl overflow-hidden bg-surface">
      {title && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] divide-x divide-border">
        {/* File Tree */}
        <div className="bg-background p-4 max-h-[600px] overflow-y-auto scrollbar-hide">
          {data.map((node, index) => (
            <FileTree key={index} node={node} onSelect={setSelectedFile} />
          ))}
        </div>

        {/* Code Viewer */}
        <div className="bg-[#1e1e1e] p-6 max-h-[600px] overflow-auto scrollbar-hide">
          {selectedFile ? (
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
                <File size={16} className="text-surface-secondary" />
                <span className="text-sm font-medium text-gray-300">{selectedFile.name}</span>
              </div>
              <pre className="text-sm leading-relaxed">
                <code
                  className="text-gray-300 font-mono"
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(selectedFile.content || '', selectedFile.language || '')
                  }}
                />
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-surface-secondary">
              <p>Select a file to view its contents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export with dummy data for easy testing
export { dummyData };
