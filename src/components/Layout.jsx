import { Link } from 'react-router-dom'
import { getCompanyInfo, getCompany } from '../companies'

export default function Layout({ children, title, description, ogImage }) {
  const company = getCompany()
  const info = getCompanyInfo(company)

  // Set document meta
  if (title) document.title = title
  setMeta('description', description || info.tagline)
  setOg('og:title', title || `${info.name} Blog`)
  setOg('og:description', description || info.tagline)
  setOg('og:type', 'website')
  if (ogImage) setOg('og:image', ogImage)

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top nav bar */}
      <div style={{ borderBottom: `3px solid ${info.color}` }} className="bg-white">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl">{info.logo}</span>
            <div>
              <span className="font-black text-gray-900 text-lg tracking-tight group-hover:underline">
                {info.name}
              </span>
              <span className="text-gray-400 font-normal text-lg"> · Blog</span>
            </div>
          </Link>
          <a
            href={info.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: info.color }}
            className="text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Visit {info.name} →
          </a>
        </div>
      </div>

      {/* Page content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-4xl mx-auto px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
          <div>© {new Date().getFullYear()} {info.name}. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href={info.website} className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">
              {info.website.replace('https://', '')}
            </a>
            <span>·</span>
            <a href="https://omevision.com" className="hover:text-gray-700 transition-colors" target="_blank" rel="noopener noreferrer">
              Omevision
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function setMeta(name, content) {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
  el.content = content
}

function setOg(property, content) {
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el) }
  el.content = content
}
