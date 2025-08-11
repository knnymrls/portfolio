import Link from 'next/link'
import { getMDXByCategory } from '@/lib/mdx-loader'

export default async function BlogListPage() {
  const posts = await getMDXByCategory('blog')
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="space-y-8">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            style={{
              animationDelay: `${index * 100}ms`
            }}
            className="animate-fade-in-up"
          >
            <Link href={`/content/blog/${post.slug}`}>
              <div 
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                data-highlight-id={`blog-card-${post.slug}`}
              >
                <h2 className="text-2xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-gray-600 mb-4">{post.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {post.date && (
                    <span>{new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  )}
                  {post.readTime && (
                    <span>{post.readTime} min read</span>
                  )}
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}