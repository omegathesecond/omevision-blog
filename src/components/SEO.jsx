import { useEffect } from 'react'

export default function SEO({ title, description, ogImage, ogUrl }) {
  useEffect(() => {
    document.title = title
    setMeta('description', description)
    setMeta('og:title', title)
    setMeta('og:description', description)
    if (ogImage) setMeta('og:image', ogImage)
    if (ogUrl) setMeta('og:url', ogUrl)
    setMeta('og:type', 'article')
  }, [title, description, ogImage, ogUrl])
  return null
}

function setMeta(name, content) {
  const attr = name.startsWith('og:') ? 'property' : 'name'
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content || '')
}
