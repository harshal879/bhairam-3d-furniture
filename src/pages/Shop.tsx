import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { ProductCard } from '@/components/product/ProductCard'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ProductImage } from '@/components/product/ProductImage'
import { Badge } from '@/components/ui/Badge'
import { formatINR } from '@/utils/pricing'
import { formatDimensions } from '@/utils/dimensions'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'
import { Link } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'newest'

export function Shop() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? 'all'
  const q = params.get('q') ?? ''
  const [sort, setSort] = useState<SortKey>('recommended')
  const [priceMax, setPriceMax] = useState(50000)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [quickView, setQuickView] = useState<Product | null>(null)
  const addItem = useCartStore((s) => s.addItem)

  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (q) {
      const query = q.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.includes(query)),
      )
    }
    list = list.filter((p) => p.price <= priceMax)
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating)
    }
    return list
  }, [category, q, sort, priceMax])

  const setCategory = (id: string) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('category')
    else next.set('category', id)
    setParams(next)
  }

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-ink mb-3">Category</p>
        <ul className="space-y-1">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => {
                  setCategory(c.id)
                  setFiltersOpen(false)
                }}
                className={[
                  'w-full text-left px-2 py-1.5 text-sm rounded-sm transition-colors',
                  category === c.id ? 'bg-sand text-ink font-medium' : 'text-stone-600 hover:bg-stone-100',
                ].join(' ')}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-medium text-ink mb-2">Max price — {formatINR(priceMax)}</p>
        <input
          type="range"
          min={5000}
          max={50000}
          step={1000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-ink mb-2">Sort</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="w-full h-10 px-2 border border-stone-300 rounded-sm bg-white text-sm"
        >
          <option value="recommended">Recommended</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="mb-8 sm:mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Shop</p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">Furniture catalogue</h1>
        {q && <p className="mt-2 text-stone-600">Results for “{q}”</p>}
      </div>

      <div className="flex gap-10">
        <aside className="hidden lg:block w-56 shrink-0">{filterPanel}</aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-6">
            <p className="text-sm text-stone-500">{filtered.length} products</p>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="hidden sm:block h-9 px-2 border border-stone-300 rounded-sm bg-white text-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="newest">Newest</option>
              </select>
              <button
                type="button"
                className="lg:hidden inline-flex items-center gap-1.5 h-9 px-3 border border-stone-300 rounded-sm text-sm"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>

          {/* Category chips mobile */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 lg:hidden">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={[
                  'shrink-0 px-3 py-1.5 text-xs rounded-sm border transition-colors',
                  category === c.id ? 'bg-ink text-cream border-ink' : 'border-stone-300 text-stone-600',
                ].join(' ')}
              >
                {c.name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-ink mb-2">No products match</p>
              <p className="text-stone-500 text-sm mb-6">Try adjusting filters or search.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setParams({})
                  setPriceMax(50000)
                  setSort('recommended')
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={setQuickView} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        {filterPanel}
        <Button fullWidth className="mt-6" onClick={() => setFiltersOpen(false)}>
          Show {filtered.length} products
        </Button>
      </Modal>

      {/* Quick view */}
      <Modal open={!!quickView} onClose={() => setQuickView(null)} title={quickView?.name} wide>
        {quickView && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="aspect-square bg-sand overflow-hidden">
              <ProductImage product={quickView} className="w-full h-full" />
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                {quickView.is3DEnabled && <Badge>3D available</Badge>}
                {quickView.isNew && <Badge tone="accent">New</Badge>}
              </div>
              <p className="text-2xl font-medium">{formatINR(quickView.price)}</p>
              <p className="text-sm text-stone-600 leading-relaxed">{quickView.description}</p>
              <p className="text-xs text-stone-500">{formatDimensions(quickView.dimensions)}</p>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  fullWidth
                  onClick={() => {
                    addItem({
                      productId: quickView.id,
                      name: quickView.name,
                      image: quickView.images[0],
                      materialId: quickView.availableOptions.materials[0],
                      colorId: quickView.availableOptions.colors[0],
                      handleId: quickView.availableOptions.handles?.[0],
                      dimensions: quickView.dimensions,
                      quantity: 1,
                    })
                    setQuickView(null)
                  }}
                >
                  Add to cart
                </Button>
                <Link to={`/product/${quickView.id}`} className="w-full" onClick={() => setQuickView(null)}>
                  <Button variant="outline" fullWidth>
                    View details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* unused X import guard - use for clear search if needed */}
      {q && (
        <button
          type="button"
          className="fixed bottom-6 right-6 lg:hidden p-3 bg-ink text-cream rounded-full shadow-lg"
          onClick={() => {
            const next = new URLSearchParams(params)
            next.delete('q')
            setParams(next)
          }}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}
