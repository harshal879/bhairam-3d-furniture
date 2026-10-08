import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { SearchDialog } from '@/components/ui/SearchDialog'

const nav = [
  { to: '/#demo', label: 'Product', hash: 'demo' },
  { to: '/#features', label: 'Features', hash: 'features' },
  { to: '/#roadmap', label: 'Roadmap', hash: 'roadmap' },
  { to: '/#about', label: 'About', hash: 'about' },
  { to: '/enquiry', label: 'Contact' },
]

function scrollToHash(hash?: string) {
  if (!hash) return
  const el = document.getElementById(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())
  const location = useLocation()
  const isPlanner = location.pathname.startsWith('/configurator')
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <header
        className={[
          'sticky top-0 z-40 border-b border-stone-200/80',
          isPlanner ? 'bg-cream/95 backdrop-blur-sm' : 'bg-cream/90 backdrop-blur-md',
        ].join(' ')}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 hover:bg-stone-100 rounded-sm"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="font-display text-xl sm:text-2xl tracking-tight text-ink">
              Bhairam
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
            {nav.map((item) =>
              item.hash ? (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={(e) => {
                    if (isHome) {
                      e.preventDefault()
                      scrollToHash(item.hash)
                    }
                  }}
                  className="text-sm tracking-wide text-stone-600 hover:text-ink transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'text-sm tracking-wide transition-colors',
                      isActive ? 'text-ink font-medium' : 'text-stone-600 hover:text-ink',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
            <NavLink
              to="/configurator"
              className={({ isActive }) =>
                [
                  'text-sm tracking-wide transition-colors',
                  isActive ? 'text-ink font-medium' : 'text-stone-600 hover:text-ink',
                ].join(' ')
              }
            >
              3D Configurator
            </NavLink>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 hover:bg-stone-100 rounded-sm transition-colors"
              aria-label="Search products"
            >
              <Search size={18} />
            </button>
            <Link
              to="/cart"
              className="relative p-2.5 hover:bg-stone-100 rounded-sm transition-colors"
              aria-label={`Cart, ${itemCount} items`}
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-ink text-cream text-[10px] flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-xs bg-cream p-6 animate-fade-up shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl">Bhairam</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="p-2" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {nav.map((item) =>
                item.hash ? (
                  <a
                    key={item.to}
                    href={item.to}
                    onClick={(e) => {
                      setMobileOpen(false)
                      if (isHome) {
                        e.preventDefault()
                        setTimeout(() => scrollToHash(item.hash), 50)
                      }
                    }}
                    className="px-3 py-3 rounded-sm text-base text-stone-700 hover:bg-stone-100"
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-3 rounded-sm text-base ${isActive ? 'bg-sand text-ink font-medium' : 'text-stone-700 hover:bg-stone-100'}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
              <NavLink
                to="/configurator"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-sm text-base text-stone-700 hover:bg-stone-100"
              >
                3D Configurator
              </NavLink>
              <NavLink
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-sm text-base text-stone-700 hover:bg-stone-100"
              >
                Demo catalogue
              </NavLink>
            </nav>
          </div>
        </div>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <main className="flex-1">
        <Outlet />
      </main>

      {!isPlanner && (
        <footer className="border-t border-stone-200 bg-stone-900 text-stone-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <p className="font-display text-2xl text-cream mb-2">Bhairam</p>
              <p className="text-sm text-stone-400 mb-3">3D Furniture Configurator</p>
              <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
                Building the future of furniture visualization for manufacturers, brands and retailers.
              </p>
            </div>
            <div>
              <p className="text-cream text-sm font-medium mb-3 tracking-wide">Product</p>
              <ul className="space-y-2 text-sm">
                <li><a href="/#demo" className="hover:text-cream transition-colors">Product</a></li>
                <li><a href="/#features" className="hover:text-cream transition-colors">Features</a></li>
                <li><a href="/#roadmap" className="hover:text-cream transition-colors">Roadmap</a></li>
                <li><Link to="/configurator" className="hover:text-cream transition-colors">3D Configurator</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-cream text-sm font-medium mb-3 tracking-wide">Company</p>
              <ul className="space-y-2 text-sm">
                <li><a href="/#about" className="hover:text-cream transition-colors">About</a></li>
                <li><Link to="/enquiry" className="hover:text-cream transition-colors">Contact</Link></li>
                <li><Link to="/shop" className="hover:text-cream transition-colors">Demo catalogue</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-cream text-sm font-medium mb-3 tracking-wide">Web</p>
              <p className="text-sm text-stone-400">
                <a href="https://bhairam.in" className="hover:text-cream transition-colors">bhairam.in</a>
              </p>
              <p className="text-xs text-stone-500 mt-4 leading-relaxed">
                Early-stage product. Demo furniture data is sample content for product showcasing.
              </p>
            </div>
          </div>
          <div className="border-t border-stone-800 px-4 sm:px-6 py-4 text-xs text-stone-500 text-center">
            © {new Date().getFullYear()} Bhairam — Early-stage technology startup.
          </div>
        </footer>
      )}
    </div>
  )
}
