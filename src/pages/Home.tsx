import { Link } from 'react-router-dom'
import { ArrowRight, Box, Palette, LayoutGrid, MessageSquare } from 'lucide-react'
import { homeCategories } from '@/data/categories'
import { getFeaturedProducts } from '@/data/products'
import { inspirationRooms } from '@/data/rooms'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'

const steps = [
  { icon: LayoutGrid, title: 'Choose furniture', text: 'Browse curated pieces across living, bedroom, dining and office.' },
  { icon: Palette, title: 'Configure', text: 'Adjust materials, colours, handles and dimensions in real time.' },
  { icon: Box, title: 'Arrange', text: 'Place pieces in the 3D room planner and refine your layout.' },
  { icon: MessageSquare, title: 'Enquire', text: 'Send a configuration summary — no payment required in this demo.' },
]

export function Home() {
  const featured = getFeaturedProducts().slice(0, 8)

  return (
    <div>
      {/* Hero — full-bleed, brand-first */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, #3a322c 0%, #5c3d2e 38%, #8a7968 70%, #c4a574 100%)',
          }}
        />
        {/* Soft furniture silhouette atmosphere */}
        <div className="absolute inset-0 opacity-30" aria-hidden>
          <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 800">
            <rect x="120" y="380" width="420" height="160" rx="8" fill="#1a1816" />
            <rect x="140" y="320" width="380" height="80" rx="6" fill="#241f1b" />
            <ellipse cx="780" cy="480" rx="160" ry="40" fill="#2c2118" />
            <rect x="700" y="420" width="20" height="80" fill="#2c2118" />
            <rect x="840" y="420" width="20" height="80" fill="#2c2118" />
            <rect x="980" y="280" width="140" height="280" rx="2" fill="#1a1816" opacity="0.7" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-transparent" />

        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24 pt-32">
          <p className="font-display text-cream/90 text-3xl sm:text-4xl md:text-5xl tracking-tight animate-fade-up">
            FORMA LIVING
          </p>
          <h1 className="mt-4 max-w-xl font-display text-cream text-3xl sm:text-4xl md:text-5xl leading-tight animate-fade-up-delay-1">
            Design a space that feels like yours.
          </h1>
          <p className="mt-4 max-w-md text-stone-200 text-base sm:text-lg leading-relaxed animate-fade-up-delay-2">
            Explore furniture, configure your pieces and create your room.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-fade-up-delay-3">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center h-12 px-7 rounded-sm text-base font-medium tracking-wide bg-cream text-ink hover:bg-white transition-colors"
            >
              Explore Furniture
            </Link>
            <Link
              to="/configurator"
              className="inline-flex items-center justify-center h-12 px-7 rounded-sm text-base font-medium tracking-wide border border-cream/70 text-cream hover:bg-cream/10 transition-colors"
            >
              Try 3D Room Planner
            </Link>
          </div>
        </div>
      </section>

      {/* Featured categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Collections</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">Featured categories</h2>
          </div>
          <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm text-walnut hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
          {homeCategories.map((cat, i) => (
            <Link
              key={cat.id}
              to={cat.href}
              className="group relative aspect-[3/4] overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 0.05}s`, backgroundColor: cat.tone }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <span className="absolute bottom-4 left-4 right-4 font-display text-lg text-cream">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-sand/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Catalogue</p>
              <h2 className="font-display text-3xl sm:text-4xl text-ink">Featured products</h2>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-1 text-sm text-walnut hover:underline">
              Shop all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Build your room */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-xl mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">How it works</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Build your room</h2>
          <p className="mt-3 text-stone-600 leading-relaxed">
            From discovery to enquiry — configure pieces and arrange them in a living space before you commit.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="w-10 h-10 flex items-center justify-center bg-sand text-ink mb-4">
                <step.icon size={18} />
              </div>
              <p className="text-xs text-stone-400 mb-1">0{i + 1}</p>
              <h3 className="font-display text-xl text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link to="/configurator">
            <Button size="lg">Open 3D Room Planner</Button>
          </Link>
        </div>
      </section>

      {/* Inspiration */}
      <section className="bg-stone-900 text-cream py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-2">Inspiration</p>
              <h2 className="font-display text-3xl sm:text-4xl">Room stories</h2>
            </div>
            <Link to="/inspiration" className="hidden sm:inline-flex items-center gap-1 text-sm text-stone-300 hover:text-cream">
              See more <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {inspirationRooms.map((room) => (
              <Link
                key={room.id}
                to="/rooms"
                className="group block"
              >
                <div className="aspect-[4/5] mb-3 transition-transform duration-500 group-hover:scale-[1.02]" style={{ backgroundColor: room.tone }} />
                <p className="text-[11px] uppercase tracking-wider text-stone-400">{room.category}</p>
                <h3 className="font-display text-lg mt-1 group-hover:text-stone-200 transition-colors">{room.title}</h3>
                <p className="text-sm text-stone-400 mt-1">{room.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
