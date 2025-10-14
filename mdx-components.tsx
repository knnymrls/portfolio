import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl font-semibold mt-12 mb-6 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-foreground">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-relaxed mb-4 text-foreground">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-base leading-relaxed ml-4">{children}</li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 italic my-6 text-surface-secondary">
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-foreground underline hover:text-surface-secondary transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    ...components,
  };
}
