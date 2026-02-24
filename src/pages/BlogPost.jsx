import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Layout from '../components/Layout'
import { getCompany, getCompanyInfo, API_BASE } from '../companies'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function readTime(content) {
  if (!content) return 1
  return Math.max(1, Math.round(content.split(/\s+/).length / 200))
}

// Related posts — same company, different slug
function RelatedPosts({ currentSlug, posts, color }) {
  const related = posts.filter(p => p.slug !== currentSlug).slice(0, 3)
  if (!related.length) return null
  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-5">More articles</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map(post => (
          <Link
            key={post.slug}
            to={`/posts/${post.slug}`}
            className="group block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            onClick={() => window.scrollTo(0, 0)}
          >
            {post.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                {post.category}
              </span>
            )}
            <h4 className="font-semibold text-gray-800 text-sm mt-1 leading-snug group-hover:underline line-clamp-3">
              {post.title}
            </h4>
            <p className="text-xs text-gray-400 mt-2">{readTime(post.content)} min read</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

// CTA banner at the bottom of every post
function CTABanner({ info }) {
  return (
    <div
      className="mt-12 rounded-2xl p-8 text-white text-center"
      style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}
    >
      <div className="text-3xl mb-2">{info.logo}</div>
      <h3 className="text-xl font-black mb-2">{info.tagline}</h3>
      <p className="text-white/80 mb-5 max-w-md mx-auto text-sm">{info.desc}</p>
      <a
        href={info.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        style={{ color: info.color }}
      >
        Visit {info.name} →
      </a>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const company = getCompany()
  const info = getCompanyInfo(company)

  useEffect(() => {
    setLoading(true)
    // Fetch the specific post by slug
    fetch(`${API_BASE}/api/blogs?company=${company}&status=PUBLISHED&limit=100`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const posts = data.blogs || []
        setAllPosts(posts)
        const found = posts.find(p => p.slug === slug)
        if (!found) navigate('/', { replace: true })
        setPost(found || null)
      })
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoading(false))
  }, [slug, company])

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="max-w-2xl mx-auto px-5 py-16 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-4 bg-gray-100 rounded animate-pulse ${i === 1 ? 'w-3/4 h-8 mb-6' : ''}`} />
          ))}
        </div>
      </Layout>
    )
  }

  if (!post) return null

  const mins = readTime(post.content)

  return (
    <Layout
      title={`${post.title} — ${info.name}`}
      description={post.excerpt}
    >
      <article className="max-w-2xl mx-auto px-5 py-10">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors">
          ← {info.name} Blog
        </Link>

        {/* Category */}
        {post.category && (
          <div className="mb-4">
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: info.color, backgroundColor: info.color + '15' }}
            >
              {post.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="text-lg text-gray-500 leading-relaxed mb-6">
          {post.excerpt}
        </p>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 pb-8 mb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <span className="text-base">{info.logo}</span>
            <span className="font-medium text-gray-700">{info.name} Editorial</span>
          </span>
          <span>·</span>
          <time>{formatDate(post.publishedAt || post.createdAt)}</time>
          <span>·</span>
          <span>{mins} min read</span>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
                #{tag.toLowerCase().replace(/\s+/g, '-')}
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="prose max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* CTA Banner */}
        <CTABanner info={info} />

        {/* Related posts */}
        <RelatedPosts currentSlug={slug} posts={allPosts} color={info.color} />
      </article>
    </Layout>
  )
}
