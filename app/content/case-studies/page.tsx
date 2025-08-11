import Link from 'next/link'
import { getMDXByCategory } from '@/lib/mdx-loader'

export default async function CaseStudiesListPage() {
  const caseStudies = await getMDXByCategory('case-studies')
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Case Studies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((study, index) => (
          <div
            key={study.slug}
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-fade-in-up"
          >
            <Link href={`/content/case-studies/${study.slug}`}>
              <div 
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                data-highlight-id={`case-study-card-${study.slug}`}
              >
                <h2 className="text-2xl font-semibold mb-2">{study.title}</h2>
                {study.description && (
                  <p className="text-gray-600 mb-4">{study.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  {study.date && (
                    <span>{new Date(study.date).toLocaleDateString()}</span>
                  )}
                  {study.readTime && (
                    <span>{study.readTime} min read</span>
                  )}
                </div>
                {study.tags && study.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {study.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}