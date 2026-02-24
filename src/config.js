export const AUTOBLOGGER_URL = 'https://autoblogger-238692725328.europe-west1.run.app'

export const COMPANY_CONFIG = {
  eneza: { name: 'Eneza', tagline: 'WhatsApp Status Ads Platform', primaryColor: '#25D366', logo: '📱', domain: 'blog.eneza.app' },
  yebolink: { name: 'YeboLink', tagline: 'Communications API for Africa', primaryColor: '#6366f1', logo: '🔗', domain: 'blog.yebolink.com' },
  vavu: { name: 'Vavu', tagline: "Africa's Classifieds Marketplace", primaryColor: '#f97316', logo: '🛒', domain: 'blog.vavu.app' },
  yebojobs: { name: 'YeboJobs', tagline: 'Jobs Platform for Africa', primaryColor: '#3b82f6', logo: '💼', domain: 'blog.yebojobs.com' },
  bamzu: { name: 'Bamzu', tagline: "Africa's Car Marketplace", primaryColor: '#ef4444', logo: '🚗', domain: 'blog.bamzu.app' },
  yebona: { name: 'Yebona', tagline: 'Africa-China Trade Services', primaryColor: '#f59e0b', logo: '🌏', domain: 'blog.yebona.com' },
  yebolearn: { name: 'YeboLearn', tagline: 'Education Platform for Africa', primaryColor: '#8b5cf6', logo: '📚', domain: 'blog.yebolearn.com' },
  yebomart: { name: 'YeboMart', tagline: 'AI-Powered Shop Management', primaryColor: '#10b981', logo: '🏪', domain: 'blog.yebomart.com' },
}

export function detectCompany() {
  const hostname = window.location.hostname
  for (const [key, config] of Object.entries(COMPANY_CONFIG)) {
    if (hostname === config.domain || hostname === `blog.${key}.app` || hostname === `blog.${key}.com`) {
      return key
    }
  }
  // Check URL params for localhost/dev
  const params = new URLSearchParams(window.location.search)
  return params.get('company') || null
}
