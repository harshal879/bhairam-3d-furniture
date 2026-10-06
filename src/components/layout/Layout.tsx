import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { SearchDialog } from '@/components/ui/SearchDialog'

const nav = [
  { to: '/shop', label: 'Shop' },
  { to: '/rooms', label: 'Rooms' },
  { to: '/configurator', label: '3D Planner' },
  { to: '/inspiration', label: 'Inspiration' },
]

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const itemCount = useCartStore((s) => s.itemCount())
  const location = useLocation()
  const isPlanner = location.pathname.startsWith('/configurator')

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
              FORMA <span className="font-sans font-light text-stone-500 text-sm sm:text-base tracking-[0.2em] ml-1">LIVING</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) => (
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
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 hover:bg-stone-100 rounded-sm transition-colors"
              aria-label="Search"
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[80%] max-w-xs bg-cream p-6 animate-fade-up shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl">FORMA</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="p-2" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
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
              ))}
              <NavLink
                to="/enquiry"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 rounded-sm text-base text-stone-700 hover:bg-stone-100"
              >
                Enquiry
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
              <p className="font-display text-2xl text-cream mb-3">FORMA LIVING</p>
              <p className="text-sm leading-relaxed text-stone-400 max-w-xs">
                Design a space that feels like yours. Explore furniture, configure your pieces and create your room.
              </p>
            </div>
            <div>
              <p className="text-cream text-sm font-medium mb-3 tracking-wide">Explore</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" className="hover:text-cream transition-colors">Shop</Link></li>
                <li><Link to="/configurator" className="hover:text-cream transition-colors">3D Room Planner</Link></li>
                <li><Link to="/rooms" className="hover:text-cream transition-colors">Room Ideas</Link></li>
                <li><Link to="/inspiration" className="hover:text-cream transition-colors">Inspiration</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-cream text-sm font-medium mb-3 tracking-wide">Support</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/enquiry" className="hover:text-cream transition-colors">Enquiry</Link></li>
                <li><span className="text-stone-500">Shipping — coming later</span></li>
                <li><span className="text-stone-500">Returns — coming later</span></li>
              </ul>
            </div>
            <div>
              <p className="text-cream text-sm font-medium mb-3 tracking-wide">Prototype</p>
              <p className="text-sm text-stone-400 leading-relaxed">
                Demo catalogue with local data. Prices in INR. 3D models are procedural for licensing safety.
              </p>
            </div>
          </div>
          <div className="border-t border-stone-800 px-4 sm:px-6 py-4 text-xs text-stone-500 text-center">
            © {new Date().getFullYear()} FORMA LIVING — Demo prototype. Not affiliated with any retail brand.
          </div>
        </footer>
      )}
    </div>
  )
}
