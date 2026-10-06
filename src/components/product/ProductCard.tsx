import { Link } from 'react-router-dom'
import { Box, Eye, Plus } from 'lucide-react'
import type { Product } from '@/types/product'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatINR } from '@/utils/pricing'
import { formatDimensionShort } from '@/utils/dimensions'
import { getColor } from '@/data/materials'
import { useCartStore } from '@/store/cartStore'
import { ProductImage } from '@/components/product/ProductImage'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <article className="group flex flex-col">
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden bg-sand aspect-[4/5] mb-3">
        <ProductImage product={product} className="w-full h-full transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <Badge tone="accent">New</Badge>}
          {product.is3DEnabled && (
            <Badge>
              <span className="inline-flex items-center gap-1"><Box size={10} /> 3D</span>
            </Badge>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 max-sm:opacity-100 max-sm:translate-y-0">
          {onQuickView && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-cream/95"
              onClick={(e) => {
                e.preventDefault()
                onQuickView(product)
              }}
            >
              <Eye size={14} /> Quick view
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault()
              addItem({
                productId: product.id,
                name: product.name,
                image: product.images[0],
                materialId: product.availableOptions.materials[0],
                colorId: product.availableOptions.colors[0],
                handleId: product.availableOptions.handles?.[0],
                dimensions: product.dimensions,
                quantity: 1,
              })
            }}
          >
            <Plus size={14} /> Add
          </Button>
        </div>
      </Link>
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-stone-500 capitalize">
          {product.category.replace('-', ' ')}
        </p>
        <Link to={`/product/${product.id}`} className="font-medium text-ink hover:text-walnut transition-colors">
          {product.name}
        </Link>
        <p className="text-sm text-stone-600">{formatINR(product.price)}</p>
        <p className="text-xs text-stone-400">{formatDimensionShort(product.dimensions)}</p>
        <div className="flex gap-1.5 mt-1">
          {product.colors.slice(0, 5).map((c) => {
            const color = getColor(c)
            return (
              <span
                key={c}
                title={color.name}
                className="w-3.5 h-3.5 rounded-full border border-stone-300"
                style={{ backgroundColor: color.hex }}
              />
            )
          })}
        </div>
      </div>
    </article>
  )
}
