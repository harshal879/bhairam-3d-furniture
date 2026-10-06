import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatINR } from '@/utils/pricing'
import { formatDimensions } from '@/utils/dimensions'
import { getMaterial, getColor, getHandle } from '@/data/materials'
import { Button } from '@/components/ui/Button'

export function Cart() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const subtotal = useCartStore((s) => s.subtotal())

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-24 text-center">
        <ShoppingBag size={40} className="mx-auto text-stone-300 mb-4" />
        <h1 className="font-display text-3xl text-ink mb-2">Your cart is empty</h1>
        <p className="text-stone-500 mb-8">Browse the catalogue and add configured pieces.</p>
        <Link to="/shop">
          <Button size="lg">Explore furniture</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Cart</p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink">
            {items.length} item{items.length === 1 ? '' : 's'}
          </h1>
        </div>
        <button type="button" onClick={clearCart} className="text-sm text-stone-500 hover:text-ink underline">
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <ul className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-4 border border-stone-200 bg-white/50">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-sand"
                style={{ background: `linear-gradient(135deg, #e5dfd4, ${getMaterial(item.materialId).hex})` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${item.productId}`} className="font-medium text-ink hover:text-walnut truncate">
                    {item.name}
                  </Link>
                  <p className="font-medium shrink-0">{formatINR(item.unitPrice * item.quantity)}</p>
                </div>
                <ul className="mt-1.5 text-xs text-stone-500 space-y-0.5">
                  <li>Material: {getMaterial(item.materialId).name}</li>
                  <li>Colour: {getColor(item.colorId).name}</li>
                  {item.handleId && <li>Handle: {getHandle(item.handleId).name}</li>}
                  <li>{formatDimensions(item.dimensions)}</li>
                </ul>
                <div className="mt-3 flex items-center justify-between">
                  <div className="inline-flex items-center border border-stone-300 rounded-sm">
                    <button
                      type="button"
                      className="p-2 hover:bg-stone-100"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="p-2 hover:bg-stone-100"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-stone-400 hover:text-red-700"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-24 self-start border border-stone-200 p-6 bg-sand/40 space-y-4">
          <h2 className="font-display text-xl">Summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Subtotal</span>
            <span className="font-medium">{formatINR(subtotal)}</span>
          </div>
          <p className="text-xs text-stone-500">Shipping & taxes calculated at enquiry. Payment not available in this prototype.</p>
          <Link to="/enquiry" className="block">
            <Button fullWidth size="lg">Request enquiry</Button>
          </Link>
          <Link to="/shop" className="block">
            <Button fullWidth variant="ghost">Continue shopping</Button>
          </Link>
        </aside>
      </div>
    </div>
  )
}
