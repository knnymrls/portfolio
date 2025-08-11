import { getMDXBySlug, getMDXByCategory } from '@/lib/mdx-loader'
import { notFound } from 'next/navigation'
import MDXContentWrapper from '@/app/components/MDXContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const ventures = await getMDXByCategory('ventures')
  return ventures.map((venture) => ({
    slug: venture.slug,
  }))
}

export default async function VenturePage({ params }: PageProps) {
  const { slug } = await params
  const mdxContent = await getMDXBySlug('ventures', slug)
  
  if (!mdxContent) {
    notFound()
  }
  
  // For now, render the markdown content as HTML
  // In a production app, you'd use MDX compilation here
  const ContentComponent = () => (
    <div className="prose prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(mdxContent.content) }} />
    </div>
  )
  
  return (
    <div data-highlight-id={`venture-${slug}`}>
      <MDXContentWrapper
        metadata={{
          title: mdxContent.title,
          date: mdxContent.date,
          readTime: mdxContent.readTime,
          tags: mdxContent.tags,
        }}
      >
        <ContentComponent />
      </MDXContentWrapper>
    </div>
  )
}

// Simple markdown to HTML converter (for demo purposes)
function convertMarkdownToHtml(markdown: string): string {
  // Basic markdown conversions
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Lists
    .replace(/^\* (.+)$/gim, '<li>$1</li>')
    
  // Wrap list items in ul tags
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>')
  }
    
  return `<p>${html}</p>`
}