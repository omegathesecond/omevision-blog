import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCompany, getCompanyInfo, API_BASE } from './companies'

export default function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const company = getCompany()
  const info = getCompanyInfo(company)
  const perPage = 12

  useEffect(() => {
    document.title = `${info.name} Blog — ${info.desc}`
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta')
    meta.name = 'description'
    meta.content = `Read the latest articles from ${info.name}. ${info.desc}`
    if (!meta.parentNode) document.head.appendChild(meta)

    const og = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`) || document.createElement('meta')
      el.setAttribute('property', prop)
      el.content = content
      if (!el.parentNode) document.head.appendChild(el)
    }
    og('og:title', `${info.name} Blog`)
    og('og:description', info.desc)
    og('og:type', 'website')
  }, [info])

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/api/blogs?company=${company}&status=PUBLISHED`)
      .then(r => r.ok ? r.json() : Promise.reject('Failed'))
      .then(data => setPosts(data.blogs || data.data || data || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [company])

  const totalPages = Math.ceil(posts.length / perPage)
  const paginated = posts.slice((page - 1) * perPage, page * perPage)

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header style={{ backgroundColor: info.color }} className="text-white">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{info.logo}</span>
            <h1 className="text-3xl font-extrabold">{info.name} Blog</h1>
          </div>
          <p className="text-white/80 text-lg">{info.desc}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading posts...</div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginated.map(post => (
                <Link
                  key={post.id || post.slug}
                  to={`/posts/${post.slug}`}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featuredImage && (
                    <img src={post.featuredImage} alt={post.title} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.category && (
                        <span style={{ backgroundColor: info.color + '18', color: info.color }}
                          className="text-xs font-medium px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      )}
                      {(post.tags || []).slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{post.title}</h2>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                    <time className="text-xs text-gray-400">{formatDate(post.publishedAt || post.createdAt)}</time>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i + 1); window.scrollTo(0, 0) }}
                    style={page === i + 1 ? { backgroundColor: info.color, color: '#fff' } : {}}
                    className={`w-10 h-10 rounded-lg font-medium text-sm ${page === i + 1 ? '' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {info.name}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
