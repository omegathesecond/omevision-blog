import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Layout from '../components/Layout'
import { getCompany, getCompanyInfo, API_BASE } from '../companies'

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
function formatRelative(d) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(d)
}
function readTime(content) {
  if (!content) return 1
  return Math.max(1, Math.round(content.split(/\s+/).length / 200))
}

// ── Share Buttons ─────────────────────────────────────────────────────────────
function ShareBar({ title }) {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(title)
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex items-center gap-3 my-8 py-5 border-y border-gray-100">
      <span className="text-sm font-semibold text-gray-400 mr-1">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
      >
        𝕏 Twitter
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5] text-white text-xs font-semibold hover:bg-[#005f8d] transition-colors"
      >
        in LinkedIn
      </a>
      <a
        href={`https://wa.me/?text=${text}%20${url}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1ebe59] transition-colors"
      >
        WhatsApp
      </a>
      <button
        onClick={copy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors ml-auto"
      >
        {copied ? '✓ Copied!' : '🔗 Copy link'}
      </button>
    </div>
  )
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner({ info }) {
  return (
    <div
      className="mt-12 rounded-2xl p-8 text-white text-center"
      style={{ background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)` }}
    >
      <div className="text-4xl mb-2">{info.logo}</div>
      <h3 className="text-xl font-black mb-2">{info.tagline}</h3>
      <p className="text-white/80 mb-5 max-w-md mx-auto text-sm">{info.desc}</p>
      <a
        href={info.website}
        target="_blank" rel="noopener noreferrer"
        className="inline-block bg-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
        style={{ color: info.color }}
      >
        Visit {info.name} →
      </a>
    </div>
  )
}

// ── Related Posts ─────────────────────────────────────────────────────────────
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
            onClick={() => window.scrollTo(0, 0)}
            className="group block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
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

// ── Comments ──────────────────────────────────────────────────────────────────
function Comments({ slug, color }) {
  const company = getCompany()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', body: '' })

  useEffect(() => {
    fetch(`${API_BASE}/api/blogs/${slug}/comments?company=${company}`)
      .then(r => r.ok ? r.json() : { comments: [] })
      .then(data => setComments(data.comments || []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false))
  }, [slug, company])

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.body.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/blogs/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to post comment')
      setComments(c => [...c, data.comment])
      setForm({ name: '', email: '', body: '' })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        {loading ? 'Comments' : `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`}
      </h3>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-sm mb-8">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="space-y-5 mb-10">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div
                className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: color }}
              >
                {c.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{c.name}</span>
                  <span className="text-xs text-gray-400">{formatRelative(c.createdAt)}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Leave a comment</h4>
        {submitted && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            ✓ Comment posted! Thanks for sharing your thoughts.
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Your name *"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': color }}
            />
            <input
              type="email"
              placeholder="Email (optional, not shown)"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ '--tw-ring-color': color }}
            />
          </div>
          <textarea
            placeholder="Share your thoughts... *"
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            required
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none"
            style={{ '--tw-ring-color': color }}
          />
          <button
            type="submit"
            disabled={submitting || !form.name.trim() || !form.body.trim()}
            className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: color }}
          >
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main Post Page ─────────────────────────────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [allPosts, setAllPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const company = getCompany()
  const info = getCompanyInfo(company)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetch(`${API_BASE}/api/blogs?company=${company}&status=PUBLISHED&limit=200`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const posts = data.blogs || []
        setAllPosts(posts)
        const found = posts.find(p => p.slug === slug)
        if (!found) navigate('/', { replace: true })
        else setPost(found)
      })
      .catch(() => navigate('/', { replace: true }))
      .finally(() => setLoading(false))
  }, [slug, company])

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="max-w-2xl mx-auto px-5 py-16 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`bg-gray-100 rounded animate-pulse ${i === 1 ? 'h-10 w-3/4 mb-4' : 'h-4'}`} />
          ))}
        </div>
      </Layout>
    )
  }

  if (!post) return null

  const mins = readTime(post.content)

  return (
    <Layout title={`${post.title} — ${info.name}`} description={post.excerpt}>
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
        <p className="text-lg text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 pb-6 mb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <span className="text-base">{info.logo}</span>
            <span className="font-medium text-gray-700">{info.name} Editorial</span>
          </span>
          <span>·</span>
          <time>{formatDate(post.publishedAt || post.createdAt)}</time>
          <span>·</span>
          <span>{mins} min read</span>
          {post.targetCountry && (
            <>
              <span>·</span>
              <span className="capitalize">{post.targetCountry}</span>
            </>
          )}
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
        <div className="prose prose-gray max-w-none
          prose-headings:font-black prose-headings:text-gray-900
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
          prose-li:text-gray-600 prose-li:mb-1
          prose-strong:text-gray-800 prose-strong:font-bold
          prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-current
          prose-blockquote:border-l-4 prose-blockquote:text-gray-500 prose-blockquote:not-italic
          prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-800
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Share bar */}
        <ShareBar title={post.title} />

        {/* CTA */}
        <CTABanner info={info} />

        {/* Related posts */}
        <RelatedPosts currentSlug={slug} posts={allPosts} color={info.color} />

        {/* Comments */}
        <Comments slug={slug} color={info.color} />

      </article>
    </Layout>
  )
}
