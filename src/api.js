import { AUTOBLOGGER_URL } from './config'

export async function fetchPosts(company, page = 1, limit = 12) {
  const params = new URLSearchParams({ status: 'PUBLISHED' })
  if (company) params.set('company', company)
  const res = await fetch(`${AUTOBLOGGER_URL}/api/blogs?${params}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  const data = await res.json()
  // API may return array or { blogs: [] }
  const posts = Array.isArray(data) ? data : (data.blogs || [])
  return posts
}

export async function fetchPost(slug, company) {
  const params = company ? `?company=${company}` : ''
  const res = await fetch(`${AUTOBLOGGER_URL}/api/blogs/${slug}${params}`)
  if (!res.ok) throw new Error('Post not found')
  return res.json()
}
