import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import { getCompany, getCompanyInfo, API_BASE } from './companies'

export default function PostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const company = getCompany()
  const info = getCompanyInfo(company)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/api/blogs/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => {
        const p = data.blog || data.data || data
        setPost(p)
        document.title = `${p.title} — ${info.name} Blog`
        const setMeta = (prop, content) => {
          let el = document.querySelector(`meta[property="${prop}"]`) || document.createElement('meta')
          el.setAttribute('property', prop)
          el.content = content
          if (!el.parentNode) document.head.appendChild(el)
        }
        setMeta('og:title', p.title)
        setMeta('og:description', p.excerpt || '')
        setMeta('og:type', 'article')
        if (p.featuredImage) setMeta('og:image', p.featuredImage)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug, info])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  if (error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
      <p className="text-xl mb-4">Post not found</p>
      <Link to="/" className="text-blue-600 hover:underline">← Back to blog</Link>
    </div>
  )

  const htmlContent = marked.parse(post.content || '')
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''

  return (
    <div className="min-h-screen bg-gray-50">
      <header style={{ backgroundColor: info.color }} className="text-white">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4">
            <span>←</span> Back to {info.name} Blog
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{info.logo}</span>
            <span className="font-bold text-lg">{info.name} Blog</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {post.featuredImage && (
            <img src={post.featuredImage} alt={post.title} className="w-full h-64 object-cover" />
          )}
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <span style={{ backgroundColor: info.color + '18', color: info.color }}
                  className="text-xs font-medium px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
              )}
              {(post.tags || []).map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{tag}</span>
              ))}
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
            <time className="text-sm text-gray-400 block mb-8">{formatDate(post.publishedAt || post.createdAt)}</time>

            <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link to="/" style={{ color: info.color }} className="font-medium hover:underline">
            ← Back to all posts
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-10">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} {info.name}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
