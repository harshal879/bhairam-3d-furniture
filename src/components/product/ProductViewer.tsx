import { Suspense, useState, useCallback, useEffect, Component, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import { Maximize2, Minimize2, RotateCcw, Loader2, AlertTriangle } from 'lucide-react'
import { FurnitureModel } from '@/three/FurnitureModel'
import { SceneEnvironment } from '@/three/Lighting'
import { ProductCameraController } from '@/three/CameraController'
import type { ColorId, Dimensions, HandleId, MaterialId, Product } from '@/types/product'

interface ProductViewerProps {
  product: Product
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  dimensions: Dimensions
  className?: string
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
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

function SceneContent({
  product,
  materialId,
  colorId,
  handleId,
  dimensions,
  resetKey,
}: {
  product: Product
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  dimensions: Dimensions
  resetKey: number
}) {
  const type = product.category === 'wardrobes' ? 'wardrobe' : product.category
  return (
    <>
      <SceneEnvironment />
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
    </>
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
  const [ready, setReady] = useState(false)
  const [noWebGL, setNoWebGL] = useState(false)
  const onError = useCallback(() => setError(true), [])

  useEffect(() => {
    if (!supportsWebGL()) setNoWebGL(true)
  }, [])

  // Safety timeout so loading never sticks forever
  useEffect(() => {
    if (ready || error || noWebGL) return
    const t = window.setTimeout(() => {
      if (!ready) setError(true)
    }, 8000)
    return () => window.clearTimeout(t)
  }, [ready, error, noWebGL])

  const failed = error || noWebGL

  return (
    <div className={`relative bg-gradient-to-b from-stone-100 to-stone-200 ${fullscreen ? 'fixed inset-0 z-50' : 'w-full h-full min-h-[320px]'} ${className}`}>
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-stone-600 p-6 text-center">
          <AlertTriangle size={28} className="text-walnut" />
          <p className="font-medium text-ink">
            {noWebGL ? '3D preview needs WebGL' : 'Unable to load 3D preview'}
          </p>
          <p className="text-sm max-w-xs">
            You can still configure materials, colours and dimensions, then add to cart or enquire.
          </p>
          {!noWebGL && (
            <button
              type="button"
              className="text-sm underline"
              onClick={() => {
                setError(false)
                setReady(false)
              }}
            >
              Try again
            </button>
          )}
        </div>
      ) : (
        <>
          {!ready && (
            <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2 text-stone-600 bg-stone-100/80">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-xs tracking-wide">Loading 3D…</span>
            </div>
          )}
          <ViewerErrorBoundary onError={onError} key={error ? 'err' : 'ok'}>
            <Canvas
              shadows
              dpr={[1, 1.5]}
              gl={{ antialias: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
              camera={{ position: [1.8, 1.4, 2.2], fov: 40, near: 0.1, far: 50 }}
              onCreated={({ gl }) => {
                gl.setClearColor('#ebe6dc')
                setReady(true)
              }}
            >
              <Suspense fallback={null}>
                <SceneContent
                  product={product}
                  materialId={materialId}
                  colorId={colorId}
                  handleId={handleId}
                  dimensions={dimensions}
                  resetKey={resetKey}
                />
              </Suspense>
            </Canvas>
          </ViewerErrorBoundary>
        </>
      )}

      {!failed && (
        <>
          <div className="absolute bottom-3 right-3 flex gap-2 z-[2]">
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
          <p className="absolute bottom-3 left-3 z-[2] text-[10px] uppercase tracking-wider text-stone-500 bg-cream/80 px-2 py-1 rounded-sm">
            Drag to orbit · Scroll to zoom
          </p>
        </>
      )}
    </div>
  )
}
