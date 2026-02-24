import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { fetchPost, fetchPosts } from '../api'
import SEO from '../components/SEO'

export default function BlogPost({ company, config }) {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const effectiveCompany = company || searchParams.get('company')
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchPost(slug, effectiveCompany)
      .then(data => {
        const p = data.blog || data
        setPost(p)
        // Fetch related
        fetchPosts(effectiveCompany || p.company).then(posts => {
          const arr = Array.isArray(posts) ? posts : []
          setRelated(arr.filter(r => (r.slug || r.id) !== slug).slice(0, 3))
        }).catch(() => {})
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug, effectiveCompany])

  if (loading) return <div className="flex justify-center py-20"><div className="animate-pulse text-gray-400">Loading...</div></div>
  if (error) return <div className="text-center py-20"><p className="text-red-500 mb-4">{error}</p><Link to="/" className="text-blue-500 underline">← Back to blog</Link></div>

  const date = post.publishedAt || post.createdAt
  const title = post.title || 'Blog Post'
  const description = post.excerpt || post.metaDescription || ''

  return (
    <>
      <SEO title={`${title} — ${config?.name || 'Omevision'} Blog`} description={description} />
      <article className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">← Back to blog</Link>
        {post.category && <span className="text-xs uppercase tracking-wider text-gray-400 block mb-2">{post.category}</span>}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b">
          <span>By Omevision Editorial Team</span>
          {date && <time>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>}
        </div>
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </div>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
            {post.tags.map(tag => (
              <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        )}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-bold mb-6">Related Posts</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map(r => (
                <Link key={r.slug || r.id} to={`/${r.slug || r.id}`} className="p-4 border rounded-lg hover:shadow transition-shadow">
                  <h4 className="font-medium text-sm mb-1">{r.title}</h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{r.excerpt || ''}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
