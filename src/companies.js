import { AUTOBLOGGER_URL } from './config.js'
export const COMPANIES = {
  eneza: {
    name: 'Eneza',
    tagline: 'WhatsApp Status Advertising',
    desc: 'Reach thousands of customers through authentic WhatsApp Status ads',
    website: 'https://eneza.app',
    color: '#25D366',
    logo: '📱',
  },
  yebolink: {
    name: 'YeboLink',
    tagline: 'Communications API for Africa',
    desc: 'SMS, WhatsApp, Email & Voice APIs for African businesses',
    website: 'https://yebolink.com',
    color: '#6366f1',
    logo: '🔗',
  },
  yeboshops: {
    name: 'YeboShops',
    tagline: 'Africa\'s Classifieds Marketplace',
    desc: 'Buy and sell anything across Africa with AI-powered listings',
    website: 'https://yeboshops.com',
    color: '#f97316',
    logo: '🛒',
  },
  bamzu: {
    name: 'Bamzu',
    tagline: 'Africa\'s Car Marketplace',
    desc: 'Find new and used cars across Africa',
    website: 'https://bamzu.app',
    color: '#ef4444',
    logo: '🚗',
  },
  yebona: {
    name: 'Yebona',
    tagline: 'Africa-China Trade Services',
    desc: 'Verified sourcing agents, freight, currency exchange & more',
    website: 'https://yebona.com',
    color: '#f59e0b',
    logo: '🌏',
  },
  yebojobs: {
    name: 'YeboJobs',
    tagline: 'Jobs Platform for Africa',
    desc: 'AI-powered job matching for African job seekers and employers',
    website: 'https://yebojobs.com',
    color: '#3b82f6',
    logo: '💼',
  },
  yebolearn: {
    name: 'YeboLearn',
    tagline: 'Online Education for Africa',
    desc: 'Courses, certifications, and learning paths built for Africa',
    website: 'https://yebolearn.com',
    color: '#8b5cf6',
    logo: '📚',
  },
  yebomart: {
    name: 'YeboMart',
    tagline: 'AI Shop Management',
    desc: 'Point-of-sale and inventory management for African shops',
    website: 'https://yebomart.com',
    color: '#10b981',
    logo: '🏪',
  },
}

export const API_BASE = AUTOBLOGGER_URL

export function getCompany() {
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const params = new URLSearchParams(window.location.search)
    return params.get('company') || 'eneza'
  }
  // blog.yebolink.com → yebolink | blog.eneza.app → eneza
  const parts = hostname.split('.')
  return parts[0] === 'blog' ? parts[1] : parts[0]
}

export function getCompanyInfo(key) {
  return COMPANIES[key] || { name: key, tagline: '', desc: '', website: '#', color: '#6b7280', logo: '📝' }
}
