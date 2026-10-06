import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { useEnquiryStore } from '@/store/enquiryStore'
import { useCartStore } from '@/store/cartStore'
import { useRoomStore } from '@/store/roomStore'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { getProductById } from '@/data/products'
import { calculatePrice, formatINR } from '@/utils/pricing'
import { formatDimensions } from '@/utils/dimensions'
import { getMaterial, getColor, getHandle } from '@/data/materials'

export function Enquiry() {
  const [params] = useSearchParams()
  const productId = params.get('product')
  const product = productId ? getProductById(productId) : undefined

  const cartItems = useCartStore((s) => s.items)
  const cartTotal = useCartStore((s) => s.subtotal())
  const roomItems = useRoomStore((s) => s.items)
  const roomTotal = useRoomStore((s) => s.roomTotal())
  const config = useConfiguratorStore()
  const submitEnquiry = useEnquiryStore((s) => s.submit)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const configSummary = useMemo(() => {
    if (product && config.productId === product.id) {
      const price = calculatePrice({
        productId: product.id,
        materialId: config.materialId,
        colorId: config.colorId,
        handleId: config.handleId,
        dimensions: config.dimensions,
        quantity: config.quantity,
      })
      return {
        label: product.name,
        detail: [
          getMaterial(config.materialId).name,
          getColor(config.colorId).name,
          config.handleId ? getHandle(config.handleId).name : null,
          formatDimensions(config.dimensions),
        ]
          .filter(Boolean)
          .join(' · '),
        price: price.total,
      }
    }
    if (cartItems.length > 0) {
      return {
        label: `${cartItems.length} cart item(s)`,
        detail: cartItems.map((i) => `${i.name} ×${i.quantity}`).join(', '),
        price: cartTotal,
      }
    }
    if (roomItems.length > 0) {
      return {
        label: `Room with ${roomItems.length} piece(s)`,
        detail: roomItems.map((i) => i.name).join(', '),
        price: roomTotal,
      }
    }
    return { label: 'General enquiry', detail: 'No product selected', price: 0 }
  }, [product, config, cartItems, cartTotal, roomItems, roomTotal])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Valid email is required'
    if (!phone.trim()) next.phone = 'Phone is required'
    if (!message.trim()) next.message = 'Please add a short message'
    setErrors(next)
    if (Object.keys(next).length) return

    submitEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company: company.trim(),
      message: message.trim(),
      productId: product?.id,
      productName: configSummary.label,
      configuration: configSummary.detail,
      estimatedPrice: configSummary.price,
    })
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center animate-fade-up">
        <CheckCircle2 size={48} className="mx-auto text-emerald-700 mb-4" />
        <h1 className="font-display text-3xl text-ink mb-3">Enquiry received</h1>
        <p className="text-stone-600 leading-relaxed mb-2">
          Thank you, {name.split(' ')[0]}. Your enquiry has been stored locally for this demo.
        </p>
        <p className="text-sm text-stone-500 mb-8">
          Estimated total: {configSummary.price > 0 ? formatINR(configSummary.price) : '—'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop">
            <Button>Continue shopping</Button>
          </Link>
          <Button variant="outline" onClick={() => setSuccess(false)}>
            Send another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-2xl mb-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Enquiry</p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">Get a quote</h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          Share your details and configuration. This prototype stores enquiries in your browser — ready to wire to a real API later.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        <form onSubmit={onSubmit} className="lg:col-span-3 space-y-4" noValidate>
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
          <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} required />
          <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" />
          <Textarea
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            error={errors.message}
            placeholder="Tell us about your space, timeline or questions…"
          />
          <Button type="submit" size="lg" fullWidth>
            Submit enquiry
          </Button>
        </form>

        <aside className="lg:col-span-2 border border-stone-200 p-6 bg-sand/40 h-fit space-y-4">
          <h2 className="font-display text-xl">Configuration summary</h2>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-500">Selected</p>
            <p className="font-medium text-ink mt-1">{configSummary.label}</p>
            <p className="text-sm text-stone-600 mt-1">{configSummary.detail}</p>
          </div>
          <div className="border-t border-stone-200 pt-4">
            <p className="text-xs uppercase tracking-wider text-stone-500">Estimated price</p>
            <p className="text-2xl font-medium mt-1">
              {configSummary.price > 0 ? formatINR(configSummary.price) : '—'}
            </p>
          </div>
          {product && (
            <Link to={`/product/${product.id}`} className="text-sm text-walnut hover:underline">
              Edit configuration →
            </Link>
          )}
        </aside>
      </div>
    </div>
  )
}
