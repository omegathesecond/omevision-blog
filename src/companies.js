export const COMPANIES = {
  eneza: { name: 'Eneza', desc: 'WhatsApp Status Advertising', color: '#16a34a', logo: '📢' },
  yebolink: { name: 'YeboLink', desc: 'SMS, WhatsApp & Email APIs', color: '#2563eb', logo: '🔗' },
  vavu: { name: 'Vavu', desc: 'African Marketplace', color: '#7c3aed', logo: '🛍️' },
  bamzu: { name: 'Bamzu', desc: 'Car Marketplace Africa', color: '#dc2626', logo: '🚗' },
  yebona: { name: 'Yebona', desc: 'Africa-China Trade Services', color: '#d97706', logo: '🌍' },
  yebojobs: { name: 'YeboJobs', desc: 'Job Matching Platform', color: '#0891b2', logo: '💼' },
  yebolearn: { name: 'YeboLearn', desc: 'Education Platform', color: '#059669', logo: '📚' },
  yebomart: { name: 'YeboMart', desc: 'AI-Powered Shop Management', color: '#f59e0b', logo: '🛒' },
}

export const API_BASE = 'https://autoblogger-238692725328.europe-west1.run.app'

export function getCompany() {
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const params = new URLSearchParams(window.location.search)
    return params.get('company') || 'eneza'
  }
  const parts = hostname.split('.')
  return parts[0] === 'blog' ? parts[1] : parts[0]
}

export function getCompanyInfo(key) {
  return COMPANIES[key] || { name: key, desc: '', color: '#6b7280', logo: '📝' }
}
