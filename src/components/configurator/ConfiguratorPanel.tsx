import { colors, getColor, getHandle, getMaterial, handles, materials } from '@/data/materials'
import { getProductById } from '@/data/products'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { useCartStore } from '@/store/cartStore'
import { calculatePrice, formatINR } from '@/utils/pricing'
import { clampDimension, formatDimensions } from '@/utils/dimensions'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Box } from 'lucide-react'
import type { ColorId, HandleId, MaterialId } from '@/types/product'

export function ConfiguratorPanel() {
  const {
    productId,
    materialId,
    colorId,
    handleId,
    dimensions,
    quantity,
    setMaterial,
    setColor,
    setHandle,
    setDimensions,
    setQuantity,
  } = useConfiguratorStore()

  const addItem = useCartStore((s) => s.addItem)
  const product = productId ? getProductById(productId) : undefined

  if (!product) {
    return <p className="text-stone-500 text-sm">Select a product to configure.</p>
  }

  const opts = product.availableOptions
  const price = calculatePrice({
    productId: product.id,
    materialId,
    colorId,
    handleId,
    dimensions,
    quantity,
  })

  const availableMaterials = materials.filter((m) => opts.materials.includes(m.id))
  const availableColors = colors.filter((c) => opts.colors.includes(c.id))
  const availableHandles = handles.filter((h) => opts.handles?.includes(h.id))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-stone-500 mb-1">Configuration</p>
        <h2 className="font-display text-2xl text-ink">{product.name}</h2>
        <p className="text-sm text-stone-500 mt-1">{formatDimensions(dimensions)}</p>
      </div>

      <div>
        <p className="text-2xl font-medium text-ink">{formatINR(price.total)}</p>
        {price.quantity > 1 && (
          <p className="text-xs text-stone-500 mt-0.5">{formatINR(price.unitTotal)} each</p>
        )}
        {(price.materialDelta > 0 || price.handleDelta > 0 || price.dimensionDelta > 0 || price.colorDelta > 0) && (
          <ul className="mt-2 text-xs text-stone-500 space-y-0.5">
            <li>Base {formatINR(price.base)}</li>
            {price.materialDelta > 0 && <li>Material +{formatINR(price.materialDelta)}</li>}
            {price.colorDelta > 0 && <li>Colour +{formatINR(price.colorDelta)}</li>}
            {price.handleDelta > 0 && <li>Handle +{formatINR(price.handleDelta)}</li>}
            {price.dimensionDelta > 0 && <li>Size +{formatINR(price.dimensionDelta)}</li>}
          </ul>
        )}
      </div>

      {/* Material */}
      <fieldset>
        <legend className="text-sm font-medium text-ink mb-2">Material — {getMaterial(materialId).name}</legend>
        <div className="flex flex-wrap gap-2">
          {availableMaterials.map((m) => (
            <button
              key={m.id}
              type="button"
              title={m.name}
              onClick={() => setMaterial(m.id as MaterialId)}
              className={[
                'w-9 h-9 rounded-sm border-2 transition-all',
                materialId === m.id ? 'border-ink scale-105' : 'border-transparent ring-1 ring-stone-300',
              ].join(' ')}
              style={{ backgroundColor: m.hex }}
            />
          ))}
        </div>
      </fieldset>

      {/* Color */}
      <fieldset>
        <legend className="text-sm font-medium text-ink mb-2">Colour — {getColor(colorId).name}</legend>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.name}
              onClick={() => setColor(c.id as ColorId)}
              className={[
                'w-9 h-9 rounded-sm border-2 transition-all',
                colorId === c.id ? 'border-ink scale-105' : 'border-transparent ring-1 ring-stone-300',
              ].join(' ')}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </fieldset>

      {/* Handles */}
      {availableHandles.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium text-ink mb-2">Handle — {getHandle(handleId).name}</legend>
          <div className="flex flex-col gap-2">
            {availableHandles.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setHandle(h.id as HandleId)}
                className={[
                  'flex items-center justify-between px-3 py-2.5 rounded-sm border text-sm text-left transition-colors',
                  handleId === h.id ? 'border-ink bg-sand' : 'border-stone-200 hover:border-stone-400',
                ].join(' ')}
              >
                <span>{h.name}</span>
                <span className="text-stone-500">{h.priceDelta > 0 ? `+${formatINR(h.priceDelta)}` : 'Included'}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Dimensions */}
      {opts.dimensions && (
        <fieldset className="space-y-4">
          <legend className="text-sm font-medium text-ink mb-2">Dimensions (mm)</legend>
          {(['width', 'height', 'depth'] as const).map((axis) => {
            const c = opts.dimensions![axis]
            const value = dimensions[axis]
            return (
              <div key={axis}>
                <div className="flex justify-between text-xs text-stone-600 mb-1.5 capitalize">
                  <span>{axis}</span>
                  <span className="font-medium text-ink">{value} mm</span>
                </div>
                <input
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={value}
                  onChange={(e) =>
                    setDimensions({
                      [axis]: clampDimension(Number(e.target.value), axis, opts.dimensions),
                    })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                  <span>{c.min}</span>
                  <span>{c.max}</span>
                </div>
              </div>
            )
          })}
        </fieldset>
      )}

      {/* Quantity */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">Quantity</p>
        <div className="inline-flex items-center border border-stone-300 rounded-sm">
          <button type="button" className="p-2.5 hover:bg-stone-100" onClick={() => setQuantity(quantity - 1)} aria-label="Decrease">
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium">{quantity}</span>
          <button type="button" className="p-2.5 hover:bg-stone-100" onClick={() => setQuantity(quantity + 1)} aria-label="Increase">
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button
          fullWidth
          size="lg"
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              image: product.images[0],
              materialId,
              colorId,
              handleId: opts.handles ? handleId : undefined,
              dimensions,
              quantity,
              unitPrice: price.unitTotal,
            })
          }
        >
          <ShoppingBag size={16} /> Add to cart
        </Button>
        <Link
          to={`/configurator?product=${product.id}`}
          className="inline-flex items-center justify-center gap-2 h-12 px-7 text-base rounded-sm font-medium tracking-wide border border-stone-300 text-ink hover:border-ink hover:bg-stone-50 transition-colors"
        >
          <Box size={16} /> Try in 3D room
        </Link>
        <Link
          to={`/enquiry?product=${product.id}`}
          className="inline-flex items-center justify-center gap-2 h-11 px-5 text-sm rounded-sm font-medium text-ink hover:bg-stone-100 transition-colors"
        >
          Get quote
        </Link>
      </div>
    </div>
  )
}
