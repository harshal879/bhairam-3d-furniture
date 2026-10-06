import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { getProductById, getRelatedProducts } from '@/data/products'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { ProductViewer } from '@/components/product/ProductViewer'
import { ConfiguratorPanel } from '@/components/configurator/ConfiguratorPanel'
import { ProductCard } from '@/components/product/ProductCard'
import { formatDimensions } from '@/utils/dimensions'
import { getMaterial } from '@/data/materials'

export function ProductDetail() {
  const { id } = useParams()
  const product = id ? getProductById(id) : undefined
  const initFromProduct = useConfiguratorStore((s) => s.initFromProduct)
  const materialId = useConfiguratorStore((s) => s.materialId)
  const colorId = useConfiguratorStore((s) => s.colorId)
  const handleId = useConfiguratorStore((s) => s.handleId)
  const dimensions = useConfiguratorStore((s) => s.dimensions)

  useEffect(() => {
    if (id) initFromProduct(id)
  }, [id, initFromProduct])

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl mb-4">Product not found</h1>
        <Link to="/shop" className="text-walnut underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = getRelatedProducts(product)

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <nav className="text-xs text-stone-500 mb-6">
          <Link to="/shop" className="hover:text-ink">Shop</Link>
          <span className="mx-2">/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-ink capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* LEFT: 3D / visual */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="aspect-square lg:aspect-[4/5] overflow-hidden bg-sand">
              {product.is3DEnabled ? (
                <ProductViewer
                  product={product}
                  materialId={materialId}
                  colorId={colorId}
                  handleId={handleId}
                  dimensions={dimensions}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-500 text-sm p-8 text-center">
                  3D preview coming later for this piece. Configuration options still apply.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: details + config */}
          <div>
            <div className="flex items-center gap-2 text-sm text-stone-600 mb-3">
              <span className="inline-flex items-center gap-0.5 text-walnut">
                <Star size={14} fill="currentColor" />
                {product.rating}
              </span>
              <span>({product.reviewCount} reviews)</span>
            </div>
            <ConfiguratorPanel />
          </div>
        </div>

        {/* Below: description sections */}
        <div className="mt-16 sm:mt-24 grid lg:grid-cols-3 gap-12 border-t border-stone-200 pt-12">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="font-display text-2xl text-ink mb-3">Description</h2>
              <p className="text-stone-600 leading-relaxed">{product.longDescription}</p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {product.features.map((f) => (
                  <li key={f} className="text-sm text-stone-700 flex gap-2">
                    <span className="text-walnut">—</span> {f}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink mb-3">Specifications</h2>
              <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-stone-100 py-2 text-sm">
                    <dt className="text-stone-500">{k}</dt>
                    <dd className="text-ink font-medium text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink mb-3">Materials</h2>
              <div className="flex flex-wrap gap-3">
                {product.materials.map((m) => {
                  const mat = getMaterial(m)
                  return (
                    <div key={m} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-sm border border-stone-300" style={{ backgroundColor: mat.hex }} />
                      {mat.name}
                    </div>
                  )
                })}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink mb-3">Dimensions</h2>
              <p className="text-stone-600 text-sm">{formatDimensions(product.dimensions)} (W × H × D)</p>
              {product.availableOptions.dimensions && (
                <p className="text-xs text-stone-400 mt-2">
                  Configurable range available in the planner above. Scaling is proportional for this prototype —
                  panel-level parametric geometry can replace this later.
                </p>
              )}
            </section>

            <section>
              <h2 className="font-display text-2xl text-ink mb-3">Shipping</h2>
              <p className="text-stone-500 text-sm">Shipping estimates — coming later in a future release.</p>
            </section>

            {product.faq.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-ink mb-3">FAQ</h2>
                <div className="space-y-4">
                  {product.faq.map((item) => (
                    <div key={item.q}>
                      <p className="text-sm font-medium text-ink">{item.q}</p>
                      <p className="text-sm text-stone-600 mt-1">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-16 sm:mt-20">
            <h2 className="font-display text-2xl sm:text-3xl text-ink mb-8">Related products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
