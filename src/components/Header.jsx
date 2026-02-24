import { Link } from 'react-router-dom'
import { COMPANY_CONFIG } from '../config'

export default function Header({ company, config, onCompanyChange }) {
  return (
    <header className="border-b border-gray-200" style={config ? { borderBottomColor: config.primaryColor } : {}}>
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-3xl">{config?.logo || '📝'}</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={config ? { color: config.primaryColor } : {}}>
              {config ? `${config.name} Blog` : 'Omevision Blog'}
            </h1>
            <p className="text-sm text-gray-500">{config?.tagline || 'Technology for Africa'}</p>
          </div>
        </Link>
        {!company && (
          <select
            className="text-sm border rounded px-2 py-1"
            value=""
            onChange={(e) => onCompanyChange(e.target.value || null)}
          >
            <option value="">All Companies</option>
            {Object.entries(COMPANY_CONFIG).map(([key, c]) => (
              <option key={key} value={key}>{c.logo} {c.name}</option>
            ))}
          </select>
        )}
      </div>
    </header>
  )
}
