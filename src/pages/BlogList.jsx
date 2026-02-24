import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../api'
import { COMPANY_CONFIG } from '../config'
import SEO from '../components/SEO'

export default function BlogList({ company, config }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchPosts(company)
      .then(setPosts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [company])

  const title = config ? `${config.name} Blog` : 'Omevision Blog'
  const description = config ? `Latest articles from ${config.name} — ${config.tagline}` : 'Latest articles from Omevision products'

  if (loading) return (
    <>
      <SEO title={title} description={description} />
      <div className="flex justify-center py-20">
        <div className="animate-pulse text-gray-400">Loading posts...</div>
      </div>
    </>
  )

  if (error) return (
    <>
      <SEO title={title} description={description} />
      <div className="text-center py-20 text-red-500">{error}</div>
    </>
  )

  if (posts.length === 0) return (
    <>
      <SEO title={title} description={description} />
      <div className="text-center py-20">
        <p className="text-4xl mb-4">{config?.logo || '📝'}</p>
        <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
        <p className="text-gray-500">We're working on great content. Check back soon!</p>
      </div>
    </>
  )

  return (
    <>
      <SEO title={title} description={description} />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <PostCard key={post.id || post.slug} post={post} company={company} config={config} />
        ))}
      </div>
    </>
  )
}

function PostCard({ post, company, config }) {
  const postCompany = post.company?.toLowerCase()
  const postConfig = config || COMPANY_CONFIG[postCompany]
  const date = post.publishedAt || post.createdAt
  const slug = post.slug || post.id

  return (
    <Link to={`/${slug}${!company && postCompany ? `?company=${postCompany}` : ''}`} className="group">
      <article className="border border-gray-100 rounded-xl p-6 h-full hover:shadow-lg transition-shadow">
        {postConfig && !config && (
          <span className="text-xs font-medium px-2 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: postConfig.primaryColor + '15', color: postConfig.primaryColor }}>
            {postConfig.logo} {postConfig.name}
          </span>
        )}
        {post.category && (
          <span className="text-xs uppercase tracking-wider text-gray-400 block mb-2">{post.category}</span>
        )}
        <h2 className="text-lg font-semibold mb-2 group-hover:underline leading-snug">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3">{post.excerpt || post.metaDescription || ''}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {date && <time>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>}
        </div>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{tag}</span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
