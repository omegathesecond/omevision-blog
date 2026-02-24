export default function Footer({ company, config }) {
  return (
    <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
      <p>© {new Date().getFullYear()} {config?.name || 'Omevision'}. All rights reserved.</p>
      <p className="mt-1">Part of the <a href="https://omevision.com" className="underline hover:text-gray-600">Omevision</a> family.</p>
    </footer>
  )
}
