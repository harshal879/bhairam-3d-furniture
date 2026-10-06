import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Component, type ReactNode } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Shop } from '@/pages/Shop'
import { ProductDetail } from '@/pages/ProductDetail'
import { Configurator } from '@/pages/Configurator'
import { Cart } from '@/pages/Cart'
import { Enquiry } from '@/pages/Enquiry'
import { Rooms, Inspiration } from '@/pages/Rooms'

class AppErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 48, fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '10vh auto' }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h1>
          <p style={{ color: '#666', marginBottom: 16 }}>The page failed to render. Try refreshing.</p>
          <pre style={{ fontSize: 12, background: '#f5f5f5', padding: 12, overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            style={{ marginTop: 16, padding: '10px 16px', cursor: 'pointer' }}
          >
            Go home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="configurator" element={<Configurator />} />
            <Route path="cart" element={<Cart />} />
            <Route path="enquiry" element={<Enquiry />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="inspiration" element={<Inspiration />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  )
}
