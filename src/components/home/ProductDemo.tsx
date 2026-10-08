import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProductById } from '@/data/products'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { ProductViewer } from '@/components/product/ProductViewer'
import { colors, getColor, getMaterial, materials } from '@/data/materials'
import { formatINR } from '@/utils/pricing'
import { calculatePrice } from '@/utils/pricing'
import { formatDimensions } from '@/utils/dimensions'
import type { ColorId, MaterialId } from '@/types/product'

const DEMO_ID = 'aalto-wardrobe'

/** Live demo of the existing 3D configurator — no fake screenshots. */
export function ProductDemo() {
  const product = getProductById(DEMO_ID)
  const initFromProduct = useConfiguratorStore((s) => s.initFromProduct)
  const materialId = useConfiguratorStore((s) => s.materialId)
  const colorId = useConfiguratorStore((s) => s.colorId)
  const handleId = useConfiguratorStore((s) => s.handleId)
  const dimensions = useConfiguratorStore((s) => s.dimensions)
  const setMaterial = useConfiguratorStore((s) => s.setMaterial)
  const setColor = useConfiguratorStore((s) => s.setColor)

  useEffect(() => {
    initFromProduct(DEMO_ID)
  }, [initFromProduct])

  if (!product) return null

  const price = calculatePrice({
    productId: product.id,
    materialId,
    colorId,
    handleId,
    dimensions,
    quantity: 1,
  })

  const availableMaterials = materials.filter((m) => product.availableOptions.materials.includes(m.id))
  const availableColors = colors.filter((c) => product.availableOptions.colors.includes(c.id))

  return (
    <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-stretch">
      <div className="lg:col-span-3 min-h-[360px] sm:min-h-[440px] lg:min-h-[520px] bg-sand overflow-hidden border border-stone-200">
        <ProductViewer
          product={product}
          materialId={materialId}
          colorId={colorId}
          handleId={handleId}
          dimensions={dimensions}
          className="w-full h-full min-h-[360px] sm:min-h-[440px] lg:min-h-[520px]"
        />
      </div>
      <div className="lg:col-span-2 flex flex-col justify-center space-y-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Live product demo</p>
          <h3 className="font-display text-2xl sm:text-3xl text-ink">{product.name}</h3>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">{product.description}</p>
        </div>
        <p className="text-xl font-medium text-ink">{formatINR(price.unitTotal)}</p>
        <p className="text-xs text-stone-500">{formatDimensions(dimensions)}</p>

        <div>
          <p className="text-sm font-medium text-ink mb-2">Material — {getMaterial(materialId).name}</p>
          <div className="flex flex-wrap gap-2">
            {availableMaterials.map((m) => (
              <button
                key={m.id}
                type="button"
                title={m.name}
                aria-label={m.name}
                onClick={() => setMaterial(m.id as MaterialId)}
                className={[
                  'w-9 h-9 rounded-sm border-2 transition-all',
                  materialId === m.id ? 'border-ink scale-105' : 'border-transparent ring-1 ring-stone-300',
                ].join(' ')}
                style={{ backgroundColor: m.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink mb-2">Colour — {getColor(colorId).name}</p>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((c) => (
              <button
                key={c.id}
                type="button"
                title={c.name}
                aria-label={c.name}
                onClick={() => setColor(c.id as ColorId)}
                className={[
                  'w-9 h-9 rounded-sm border-2 transition-all',
                  colorId === c.id ? 'border-ink scale-105' : 'border-transparent ring-1 ring-stone-300',
                ].join(' ')}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center h-11 px-5 rounded-sm bg-ink text-cream text-sm font-medium hover:bg-stone-800 transition-colors"
          >
            Open full configurator
          </Link>
          <Link
            to="/configurator"
            className="inline-flex items-center justify-center h-11 px-5 rounded-sm border border-stone-300 text-ink text-sm font-medium hover:border-ink transition-colors"
          >
            Try 3D room planner
          </Link>
        </div>
        <p className="text-[11px] text-stone-400">
          Drag to orbit · Scroll to zoom · Change materials above — this is the real product viewer.
        </p>
      </div>
    </div>
  )
}
