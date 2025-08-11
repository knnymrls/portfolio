'use client'

import { motion } from 'framer-motion'
import { MDXProvider } from '@mdx-js/react'
import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Custom components for MDX
const components = {
  // Headings with IDs for navigation
  h1: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
    return (
      <h1 id={id} data-highlight-id={`heading-${id}`} className="text-4xl font-bold mt-8 mb-4" {...props}>
        {children}
      </h1>
    )
  },
  h2: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
    return (
      <h2 id={id} data-highlight-id={`heading-${id}`} className="text-3xl font-semibold mt-6 mb-3" {...props}>
        {children}
      </h2>
    )
  },
  h3: ({ children, ...props }: any) => {
    const id = children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || ''
    return (
      <h3 id={id} data-highlight-id={`heading-${id}`} className="text-2xl font-semibold mt-4 mb-2" {...props}>
        {children}
      </h3>
    )
  },
  
  // Paragraph with spacing
  p: ({ children, ...props }: any) => (
    <p className="my-4 leading-relaxed text-gray-700" {...props}>
      {children}
    </p>
  ),
  
  // Lists
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside my-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside my-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  
  // Links
  a: ({ href, children, ...props }: any) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#')
    if (isInternal) {
      return (
        <Link href={href} className="text-blue-600 hover:text-blue-800 underline" {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline" {...props}>
        {children}
      </a>
    )
  },
  
  // Code blocks
  pre: ({ children, ...props }: any) => (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: any) => {
    // Check if it's inline code or code block
    const isInline = !props.className
    if (isInline) {
      return (
        <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm" {...props}>
          {children}
        </code>
      )
    }
    return <code {...props}>{children}</code>
  },
  
  // Images
  img: ({ src, alt, ...props }: any) => (
    <div className="my-6">
      <img src={src} alt={alt} className="rounded-lg shadow-lg w-full" {...props} />
    </div>
  ),
  
  // Blockquote
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600" {...props}>
      {children}
    </blockquote>
  ),
  
  // Tables
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full divide-y divide-gray-200" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" {...props}>
      {children}
    </td>
  ),
  
  // Horizontal rule
  hr: (props: any) => <hr className="my-8 border-gray-200" {...props} />,
}

// Custom components that can be used in MDX files
export const ProjectStats = ({ users, schools, satisfaction }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid grid-cols-3 gap-4 my-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
    data-highlight-id="project-stats"
  >
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-600">{users}</div>
      <div className="text-sm text-gray-600">Users</div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold text-purple-600">{schools}</div>
      <div className="text-sm text-gray-600">Schools</div>
    </div>
    <div className="text-center">
      <div className="text-3xl font-bold text-green-600">{satisfaction}</div>
      <div className="text-sm text-gray-600">Satisfaction</div>
    </div>
  </motion.div>
)

export const CalloutBox = ({ type = 'info', children }: any) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    insight: 'bg-purple-50 border-purple-200 text-purple-800',
  }
  
  return (
    <div className={`p-4 my-4 border-l-4 rounded-r-lg ${styles[type as keyof typeof styles] || styles.info}`}>
      {children}
    </div>
  )
}

export const TechStack = ({ technologies }: { technologies: string[] }) => (
  <div className="flex flex-wrap gap-2 my-4" data-highlight-id="tech-stack">
    {technologies.map((tech) => (
      <span
        key={tech}
        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
        data-highlight-id={`tech-${tech.toLowerCase()}`}
      >
        {tech}
      </span>
    ))}
  </div>
)

interface MDXContentWrapperProps {
  children: ReactNode
  metadata?: {
    title?: string
    date?: string
    readTime?: number
    tags?: string[]
  }
}

export default function MDXContentWrapper({ children, metadata }: MDXContentWrapperProps) {
  return (
    <MDXProvider components={{ ...components, ProjectStats, CalloutBox, TechStack }}>
      <article className="max-w-4xl mx-auto px-6 py-12">
        {metadata && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {metadata.title && (
              <h1 className="text-5xl font-bold mb-4" data-highlight-id="page-title">
                {metadata.title}
              </h1>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {metadata.date && (
                <span>
                  {new Date(metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
              {metadata.readTime && <span>{metadata.readTime} min read</span>}
            </div>
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    data-highlight-id={`tag-${tag.toLowerCase()}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          {children}
        </motion.div>
      </article>
    </MDXProvider>
  )
}