import { getMDXBySlug, getMDXByCategory } from '@/lib/mdx-loader'
import { notFound } from 'next/navigation'
import MDXContentWrapper from '@/app/components/MDXContent'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const caseStudies = await getMDXByCategory('case-studies')
  return caseStudies.map((study) => ({
    slug: study.slug,
  }))
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const mdxContent = await getMDXBySlug('case-studies', slug)
  
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
    <div data-highlight-id={`case-study-${slug}`}>
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

// Enhanced markdown to HTML converter with section IDs for highlighting
function convertMarkdownToHtml(markdown: string): string {
  // Function to generate ID from heading text
  const generateId = (text: string) => {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim()
  }
  
  // Track sections for wrapping
  let sectionCounter = 0
  let currentSection = ''
  let sections: string[] = []
  
  // Split by lines to process headers and create sections
  const lines = markdown.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Check for headers (h2 creates new sections)
    if (line.startsWith('## ')) {
      // Close previous section if exists
      if (currentSection) {
        sections.push(`</div>`)
      }
      
      const headerText = line.substring(3)
      const sectionId = generateId(headerText)
      
      // Start new section with highlightable ID
      sections.push(`<div id="section-${sectionId}" data-highlight-id="section-${sectionId}" class="mdx-section">`)
      sections.push(`<h2 id="${sectionId}">${headerText}</h2>`)
      currentSection = sectionId
    }
    else if (line.startsWith('### ')) {
      const headerText = line.substring(4)
      const headerId = generateId(headerText)
      sections.push(`<h3 id="${headerId}" data-highlight-id="subsection-${headerId}">${headerText}</h3>`)
    }
    else if (line.startsWith('# ')) {
      const headerText = line.substring(2)
      const headerId = generateId(headerText)
      sections.push(`<h1 id="${headerId}" data-highlight-id="title-${headerId}">${headerText}</h1>`)
    }
    else {
      // Process other markdown elements
      let processedLine = line
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic  
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Lists
        .replace(/^- (.+)$/gim, '<li>$1</li>')
        
      // Handle code blocks
      if (line.startsWith('```')) {
        const codeBlockEnd = lines.indexOf('```', i + 1)
        if (codeBlockEnd > i) {
          const codeLines = lines.slice(i + 1, codeBlockEnd)
          sections.push(`<pre><code>${codeLines.join('\n')}</code></pre>`)
          i = codeBlockEnd
          continue
        }
      }
      
      // Handle paragraphs
      if (processedLine && !processedLine.startsWith('<')) {
        processedLine = `<p>${processedLine}</p>`
      }
      
      if (processedLine) {
        sections.push(processedLine)
      }
    }
  }
  
  // Close last section
  if (currentSection) {
    sections.push(`</div>`)
  }
  
  // Wrap lists in ul tags
  let html = sections.join('\n')
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, '<ul>$&</ul>')
  
  // Add special highlight IDs for common sections
  html = html
    .replace(/<div id="section-results-impact"/g, '<div id="section-results-impact" data-highlight-id="results"')
    .replace(/<div id="section-key-features"/g, '<div id="section-key-features" data-highlight-id="features"')
    .replace(/<div id="section-technical-implementation"/g, '<div id="section-technical-implementation" data-highlight-id="technical"')
    .replace(/<div id="section-the-challenge"/g, '<div id="section-the-challenge" data-highlight-id="challenge"')
    .replace(/<div id="section-our-solution"/g, '<div id="section-our-solution" data-highlight-id="solution"')
  
  return html
}