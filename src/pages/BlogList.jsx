import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { getCompany, getCompanyInfo, API_BASE } from '../companies'

const PER_PAGE = 12

function PostCard({ post, color }) {
  const date = post.publishedAt || post.createdAt
  const readTime = post.content ? Math.max(1, Math.round(post.content.split(/\s+/).length / 200)) : 3

  return (
    <Link
      to={`/posts/${post.slug}`}
      className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all flex flex-col overflow-hidden"
    >
      {/* Category pill */}
      <div className="px-5 pt-5 pb-0">
        {post.category && (
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ color, backgroundColor: color + '15' }}
          >
            {post.category}
          </span>
        )}
      </div>

      {/* Title */}
      <div className="px-5 pb-4 flex-1">
        <h2 className="font-bold text-gray-900 text-[1.05rem] leading-snug mb-2 group-hover:underline line-clamp-3">
          {post.title}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              #{tag.toLowerCase().replace(/\s+/g, '-')}
            </span>
          ))}
        </div>
      )}

      {/* Meta bar */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <time>{formatDate(date)}</time>
        <span>{readTime} min read</span>
      </div>
    </Link>
  )
}

function HeroPost({ post, color, logo }) {
  const date = post.publishedAt || post.createdAt
  const readTime = post.content ? Math.max(1, Math.round(post.content.split(/\s+/).length / 200)) : 5

  return (
    <Link
      to={`/posts/${post.slug}`}
      className="group block bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all overflow-hidden mb-8"
    >
      <div className="p-8 md:p-10">
        <div className="flex items-center gap-3 mb-4">
          {post.category && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color, backgroundColor: color + '15' }}
            >
              {post.category}
            </span>
          )}
          <span className="text-xs text-gray-400">Latest</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-3 group-hover:underline">
          {post.title}
        </h2>
        <p className="text-gray-500 leading-relaxed mb-5 max-w-2xl">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <time>{formatDate(date)}</time>
          <span>·</span>
          <span>{readTime} min read</span>
          <span
            className="ml-auto font-semibold text-sm"
            style={{ color }}
          >
            Read article →
          </span>
        </div>
      </div>
    </Link>
  )
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const company = getCompany()
  const info = getCompanyInfo(company)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/api/blogs?company=${company}&status=PUBLISHED&limit=100`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setPosts(data.blogs || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [company])

  const hero = posts[0]
  const rest = posts.slice(1)
  const totalPages = Math.ceil(rest.length / PER_PAGE)
  const paginated = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <Layout
      title={`${info.name} Blog — ${info.tagline}`}
      description={info.desc}
    >
      {/* Hero section */}
      <div style={{ background: `linear-gradient(135deg, ${info.color}08 0%, transparent 60%)` }}>
        <div className="max-w-4xl mx-auto px-5 pt-10 pb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 mb-1">{info.name} Blog</h1>
            <p className="text-gray-500">{info.tagline}</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">{info.logo}</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">Content coming soon</h2>
              <p className="text-gray-400">We're working on great articles. Check back shortly.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {hero && <HeroPost post={hero} color={info.color} logo={info.logo} />}

              {/* Grid */}
              {paginated.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {paginated.map(post => (
                    <PostCard key={post.id || post.slug} post={post} color={info.color} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <button
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0) }}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => { setPage(i + 1); window.scrollTo(0, 0) }}
                      style={page === i + 1 ? { backgroundColor: info.color, color: '#fff', border: 'none' } : {}}
                      className="w-10 h-10 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0) }}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next →
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-gray-300 mt-6">
                {posts.length} article{posts.length !== 1 ? 's' : ''}
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
