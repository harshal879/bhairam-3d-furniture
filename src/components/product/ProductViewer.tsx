import { Suspense, useState, useCallback, Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, Html } from '@react-three/drei'
import { Maximize2, Minimize2, RotateCcw, Loader2, AlertTriangle } from 'lucide-react'
import { FurnitureModel } from '@/three/FurnitureModel'
import { SceneEnvironment } from '@/three/Lighting'
import { ProductCameraController } from '@/three/CameraController'
import type { ColorId, Dimensions, HandleId, MaterialId } from '@/types/product'
import type { Product } from '@/types/product'

interface ProductViewerProps {
  product: Product
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  dimensions: Dimensions
  className?: string
}

class ViewerErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}

function LoadingIndicator() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-stone-600">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-xs tracking-wide">Loading 3D…</span>
      </div>
    </Html>
  )
}

export function ProductViewer({
  product,
  materialId,
  colorId,
  handleId,
  dimensions,
  className = '',
}: ProductViewerProps) {
  const [resetKey, setResetKey] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [error, setError] = useState(false)
  const onError = useCallback(() => setError(true), [])

  const type = product.category === 'wardrobes' ? 'wardrobe' : product.category

  const canvas = (
    <div className={`relative bg-gradient-to-b from-stone-100 to-stone-200 ${fullscreen ? 'fixed inset-0 z-50' : 'w-full h-full min-h-[320px]'} ${className}`}>
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-stone-600 p-6 text-center">
          <AlertTriangle size={28} className="text-walnut" />
          <p className="font-medium text-ink">Unable to load 3D model</p>
          <p className="text-sm max-w-xs">The interactive preview failed. You can still configure options and add to cart.</p>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => setError(false)}
          >
            Try again
          </button>
        </div>
      ) : (
        <ViewerErrorBoundary onError={onError} key={error ? 'err' : 'ok'}>
          <Canvas
            shadows
            dpr={[1, 1.75]}
            gl={{ antialias: true, toneMappingExposure: 1.05 }}
            camera={{ position: [1.8, 1.4, 2.2], fov: 40, near: 0.1, far: 50 }}
            onCreated={({ gl }) => {
              gl.setClearColor('#ebe6dc')
            }}
          >
            <Suspense fallback={<LoadingIndicator />}>
              <SceneEnvironment preset="apartment" />
              <ProductCameraController resetKey={resetKey} />
              <Center position={[0, 0, 0]}>
                <FurnitureModel
                  type={type}
                  dimensions={dimensions}
                  materialId={materialId}
                  colorId={colorId}
                  handleId={handleId}
                />
              </Center>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <circleGeometry args={[2.5, 48]} />
                <meshStandardMaterial color="#e5dfd4" roughness={0.9} />
              </mesh>
            </Suspense>
          </Canvas>
        </ViewerErrorBoundary>
      )}

      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={() => setResetKey((k) => k + 1)}
          className="p-2.5 bg-cream/90 hover:bg-cream rounded-sm shadow-sm transition-colors"
          aria-label="Reset camera"
          title="Reset camera"
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          onClick={() => setFullscreen((f) => !f)}
          className="p-2.5 bg-cream/90 hover:bg-cream rounded-sm shadow-sm transition-colors"
          aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
      <p className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider text-stone-500 bg-cream/80 px-2 py-1 rounded-sm">
        Drag to orbit · Scroll to zoom
      </p>
    </div>
  )

  return canvas
}
