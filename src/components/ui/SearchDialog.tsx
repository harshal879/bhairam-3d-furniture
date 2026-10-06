import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { products } from '@/data/products'
import { formatINR } from '@/utils/pricing'

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  if (!open) return null

  const q = query.trim().toLowerCase()
  const results = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.includes(q) ||
          p.tags.some((t) => t.includes(q)),
      )
    : products.slice(0, 6)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close search" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-cream rounded-sm shadow-xl animate-fade-up overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-stone-200">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search furniture…"
            className="flex-1 h-14 bg-transparent outline-none text-ink placeholder:text-stone-400"
          />
          <button type="button" onClick={onClose} className="p-2 hover:bg-stone-100 rounded-sm" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-stone-500 text-sm">No products found</li>
          )}
          {results.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-100 text-left transition-colors"
                onClick={() => {
                  onClose()
                  navigate(`/product/${p.id}`)
                }}
              >
                <div
                  className="w-12 h-12 rounded-sm shrink-0"
                  style={{ background: `linear-gradient(135deg, #e5dfd4, #c4a574)` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink truncate">{p.name}</p>
                  <p className="text-xs text-stone-500 capitalize">{p.category.replace('-', ' ')}</p>
                </div>
                <span className="text-sm text-stone-700">{formatINR(p.price)}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3 border-t border-stone-200">
          <button
            type="button"
            className="text-sm text-walnut hover:underline"
            onClick={() => {
              onClose()
              navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
            }}
          >
            View all in shop →
          </button>
        </div>
      </div>
    </div>
  )
}
