import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Box,
  Palette,
  Rotate3d,
  LayoutTemplate,
  FileText,
  Building2,
  ArrowRight,
} from 'lucide-react'
import { ProductDemo } from '@/components/home/ProductDemo'
import { Button } from '@/components/ui/Button'

const problems = [
  'Customers struggle to visualize furniture before purchasing.',
  'Static product images cannot communicate depth and configuration.',
  'Furniture brands need better digital product experiences.',
  'Traditional catalogs cannot provide interactive visualization.',
]

const features = [
  {
    icon: Box,
    title: '3D Product Visualization',
    text: 'Interactive furniture models directly in the browser.',
    status: 'available' as const,
  },
  {
    icon: Palette,
    title: 'Material & Colour Configuration',
    text: 'Explore different finishes, colours and materials in real time.',
    status: 'available' as const,
  },
  {
    icon: Rotate3d,
    title: 'Interactive Product Experience',
    text: 'Rotate, zoom and inspect furniture from different angles.',
    status: 'available' as const,
  },
  {
    icon: LayoutTemplate,
    title: 'Digital Showroom',
    text: 'Present furniture inside immersive room environments.',
    status: 'available' as const,
  },
  {
    icon: FileText,
    title: 'Product Information',
    text: 'Dimensions, materials, specifications and enquiry flows.',
    status: 'available' as const,
  },
  {
    icon: Building2,
    title: 'Future Business Platform',
    text: 'Tools for furniture companies to manage and showcase their catalogue.',
    status: 'coming' as const,
  },
]

const useCases = [
  { title: 'Furniture Manufacturers', text: 'Present configurable products digitally before production conversations.' },
  { title: 'Furniture Retailers', text: 'Help shoppers explore finishes and layouts without relying on static photos alone.' },
  { title: 'Interior Designers', text: 'Visualize pieces in context while discussing options with clients.' },
  { title: 'Furniture Brands', text: 'Build a modern digital product experience that reflects brand quality.' },
  { title: 'Online Furniture Stores', text: 'Reduce uncertainty in remote buying with interactive 3D viewing.' },
]

const roadmap = [
  { phase: 'Phase 1', title: 'Interactive 3D Furniture Viewer', status: 'available' as const },
  { phase: 'Phase 2', title: 'Furniture Configuration', status: 'available' as const },
  { phase: 'Phase 3', title: 'Digital Furniture Showrooms', status: 'available' as const },
  { phase: 'Phase 4', title: 'Business Product Management', status: 'coming' as const },
  { phase: 'Phase 5', title: 'AI-assisted Furniture Configuration', status: 'coming' as const },
]

export function Home() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [location.hash])

  return (
    <div>
      {/* 1. HERO */}
      <section className="relative min-h-[78vh] flex items-end overflow-hidden bg-stone-900">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 40%, #5c3d2e55 0%, transparent 55%), linear-gradient(165deg, #1a1816 0%, #2c2118 45%, #3a322c 100%)',
          }}
          aria-hidden
        />
        <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 pb-16 sm:pb-24 pt-28">
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400 mb-4 animate-fade-up">
            Bhairam · Early-stage product
          </p>
          <h1 className="max-w-3xl font-display text-cream text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight animate-fade-up-delay-1">
            Experience Furniture in 3D Before You Buy.
          </h1>
          <p className="mt-5 max-w-xl text-stone-300 text-base sm:text-lg leading-relaxed animate-fade-up-delay-2">
            An interactive 3D furniture visualization and configuration platform built for modern furniture businesses.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up-delay-3">
            <a
              href="#demo"
              className="inline-flex items-center justify-center h-12 px-7 rounded-sm text-base font-medium tracking-wide bg-cream text-ink hover:bg-white transition-colors"
            >
              Explore 3D Configurator
            </a>
            <Link
              to="/enquiry"
              className="inline-flex items-center justify-center h-12 px-7 rounded-sm text-base font-medium tracking-wide border border-cream/50 text-cream hover:bg-cream/10 transition-colors"
            >
              Build With Us
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT DEMO — real existing 3D viewer */}
      <section id="demo" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Product</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">See the configurator in action</h2>
          <p className="mt-3 text-stone-600 leading-relaxed">
            This is the live Bhairam 3D Furniture Configurator — not a mockup. Orbit the model, change materials and open the full product experience.
          </p>
        </div>
        <ProductDemo />
      </section>

      {/* 3. PROBLEM */}
      <section className="bg-sand/60 border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Problem</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">Furniture is hard to visualize online</h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {problems.map((p) => (
              <li key={p} className="flex gap-3 text-stone-700 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-walnut shrink-0" aria-hidden />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. SOLUTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Solution</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Interactive 3D for furniture businesses</h2>
          <p className="mt-4 text-stone-600 text-lg leading-relaxed">
            Bhairam is building an interactive 3D platform that helps furniture businesses present their products digitally —
            so customers can explore configuration, materials and context before they decide.
          </p>
          <p className="mt-3 text-stone-500 text-sm leading-relaxed">
            Building the future of furniture visualization.
          </p>
        </div>
      </section>

      {/* 5. FEATURES */}
      <section id="features" className="scroll-mt-20 bg-stone-900 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400 mb-2">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl">What the platform delivers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <article key={f.title} className="border-t border-stone-700 pt-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <f.icon size={20} className="text-stone-300" aria-hidden />
                  {f.status === 'coming' && (
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 border border-stone-600 px-2 py-0.5">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl mb-2">{f.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. USE CASES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Use cases</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Built for the furniture industry</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((u) => (
            <article key={u.title} className="border border-stone-200 p-6 bg-white/40">
              <h3 className="font-display text-xl text-ink mb-2">{u.title}</h3>
              <p className="text-sm text-stone-600 leading-relaxed">{u.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 7. ROADMAP */}
      <section id="roadmap" className="scroll-mt-20 bg-sand/50 border-y border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Roadmap</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink">Where we&apos;re headed</h2>
            <p className="mt-3 text-stone-600 text-sm">Honest staging for an early-stage product.</p>
          </div>
          <ol className="space-y-0 max-w-2xl border-l border-stone-300 ml-2">
            {roadmap.map((r) => (
              <li key={r.phase} className="relative pl-8 pb-8 last:pb-0">
                <span className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-ink" aria-hidden />
                <p className="text-[11px] uppercase tracking-wider text-stone-500">{r.phase}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <h3 className="font-medium text-ink">{r.title}</h3>
                  {r.status === 'coming' ? (
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 border border-stone-300 px-2 py-0.5">
                      Coming soon
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5">
                      In product
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. ABOUT */}
      <section id="about" className="scroll-mt-20 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">About</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Founder-led, early-stage</h2>
          <p className="mt-5 text-stone-600 text-lg leading-relaxed">
            Bhairam is an early-stage technology startup focused on building better digital experiences for the furniture industry.
          </p>
          <p className="mt-6 text-sm text-stone-500">
            Founder · <span className="text-ink font-medium">Harshal Bhairam</span>
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Website ·{' '}
            <a href="https://bhairam.in" className="text-ink underline underline-offset-2 hover:text-walnut">
              bhairam.in
            </a>
          </p>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="bg-stone-900 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Bring Your Furniture Into 3D.</h2>
          <p className="mt-4 text-stone-300 max-w-lg mx-auto leading-relaxed">
            We&apos;re building the next generation of digital furniture experiences.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/enquiry">
              <Button size="lg" className="bg-cream text-ink hover:bg-white">
                Get Early Access
              </Button>
            </Link>
            <Link
              to="/enquiry"
              className="inline-flex items-center justify-center h-12 px-7 rounded-sm text-base font-medium border border-cream/40 text-cream hover:bg-cream/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <Link
            to="/configurator"
            className="inline-flex items-center gap-1 mt-8 text-sm text-stone-400 hover:text-cream transition-colors"
          >
            Or open the live 3D configurator <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  )
}
