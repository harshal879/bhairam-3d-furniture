import type { Product } from '@/types/product'
import { getMaterial } from '@/data/materials'

/** Procedural SVG product illustration — no external licensed images required. */
export function ProductImage({ product, className = '' }: { product: Product; className?: string }) {
  const mat = getMaterial(product.materials[0])
  const shapes: Record<string, React.ReactNode> = {
    wardrobes: (
      <>
        <rect x="35" y="15" width="50" height="75" rx="1" fill={mat.hex} />
        <line x1="60" y1="15" x2="60" y2="90" stroke="#00000022" strokeWidth="0.5" />
        <rect x="42" y="48" width="2" height="8" rx="0.5" fill="#c4a574" />
        <rect x="76" y="48" width="2" height="8" rx="0.5" fill="#c4a574" />
      </>
    ),
    sofas: (
      <>
        <rect x="15" y="45" width="70" height="28" rx="3" fill={mat.hex} />
        <rect x="18" y="32" width="64" height="18" rx="2" fill={mat.hex} opacity="0.85" />
        <rect x="18" y="70" width="6" height="8" fill="#5c3d2e" />
        <rect x="76" y="70" width="6" height="8" fill="#5c3d2e" />
      </>
    ),
    beds: (
      <>
        <rect x="20" y="25" width="60" height="20" rx="2" fill={mat.hex} />
        <rect x="22" y="45" width="56" height="35" rx="1" fill={mat.hex} opacity="0.8" />
        <rect x="25" y="48" width="22" height="10" rx="2" fill="#f5f2ed" />
        <rect x="53" y="48" width="22" height="10" rx="2" fill="#f5f2ed" />
      </>
    ),
    tables: (
      <>
        <ellipse cx="50" cy="42" rx="35" ry="12" fill={mat.hex} />
        <rect x="28" y="42" width="4" height="35" fill={mat.hex} opacity="0.7" />
        <rect x="68" y="42" width="4" height="35" fill={mat.hex} opacity="0.7" />
      </>
    ),
    chairs: (
      <>
        <path d="M30 35 Q50 20 70 35 L68 55 L32 55 Z" fill={mat.hex} />
        <rect x="32" y="55" width="36" height="8" rx="1" fill={mat.hex} opacity="0.85" />
        <rect x="34" y="63" width="3" height="20" fill="#5c3d2e" />
        <rect x="63" y="63" width="3" height="20" fill="#5c3d2e" />
      </>
    ),
    storage: (
      <>
        <rect x="25" y="30" width="50" height="50" rx="1" fill={mat.hex} />
        <line x1="42" y1="30" x2="42" y2="80" stroke="#00000018" />
        <line x1="58" y1="30" x2="58" y2="80" stroke="#00000018" />
        <circle cx="38" cy="55" r="1.5" fill="#c4a574" />
        <circle cx="50" cy="55" r="1.5" fill="#c4a574" />
        <circle cx="62" cy="55" r="1.5" fill="#c4a574" />
      </>
    ),
    'tv-units': (
      <>
        <rect x="15" y="50" width="70" height="25" rx="1" fill={mat.hex} />
        <rect x="20" y="55" width="25" height="15" fill="#00000015" />
        <rect x="50" y="55" width="30" height="15" fill="#00000010" />
      </>
    ),
    office: (
      <>
        <rect x="15" y="45" width="70" height="6" rx="1" fill={mat.hex} />
        <rect x="22" y="51" width="4" height="28" fill={mat.hex} opacity="0.7" />
        <rect x="74" y="51" width="4" height="28" fill={mat.hex} opacity="0.7" />
      </>
    ),
  }

  return (
    <div className={`relative bg-gradient-to-br from-stone-100 to-stone-200 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden>
        <rect width="100" height="100" fill="#ebe6dc" />
        {shapes[product.category] ?? shapes.storage}
      </svg>
      <span className="sr-only">{product.name}</span>
    </div>
  )
}
