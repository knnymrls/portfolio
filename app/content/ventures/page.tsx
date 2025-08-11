import Link from 'next/link'
import { getMDXByCategory } from '@/lib/mdx-loader'

export default async function VenturesListPage() {
  const ventures = await getMDXByCategory('ventures')
  
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Ventures</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ventures.map((venture, index) => (
          <div
            key={venture.slug}
            style={{ animationDelay: `${index * 100}ms` }}
            className="animate-fade-in-up"
          >
            <Link href={`/content/ventures/${venture.slug}`}>
              <div 
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                data-highlight-id={`venture-card-${venture.slug}`}
              >
                <h2 className="text-2xl font-semibold mb-2">{venture.title}</h2>
                {venture.description && (
                  <p className="text-gray-600 mb-4">{venture.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  {venture.date && (
                    <span>{new Date(venture.date).toLocaleDateString()}</span>
                  )}
                  {venture.readTime && (
                    <span>{venture.readTime} min read</span>
                  )}
                </div>
                {venture.tags && venture.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {venture.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
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