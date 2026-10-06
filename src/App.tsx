import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Shop } from '@/pages/Shop'
import { Cart } from '@/pages/Cart'
import { Enquiry } from '@/pages/Enquiry'
import { Rooms, Inspiration } from '@/pages/Rooms'

const ProductDetail = lazy(() =>
  import('@/pages/ProductDetail').then((m) => ({ default: m.ProductDetail })),
)
const Configurator = lazy(() =>
  import('@/pages/Configurator').then((m) => ({ default: m.Configurator })),
)

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32 text-stone-500 text-sm tracking-wide">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route
            path="product/:id"
            element={
              <Suspense fallback={<PageLoader />}>
                <ProductDetail />
              </Suspense>
            }
          />
          <Route
            path="configurator"
            element={
              <Suspense fallback={<PageLoader />}>
                <Configurator />
              </Suspense>
            }
          />
          <Route path="cart" element={<Cart />} />
          <Route path="enquiry" element={<Enquiry />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="inspiration" element={<Inspiration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
