import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Loader2, RotateCcw, RotateCw, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react'
import { getProductById } from '@/data/products'
import { useConfiguratorStore } from '@/store/configuratorStore'
import { defaultDimensions } from '@/utils/dimensions'
import {
  startRearCamera,
  getCameraErrorMessage,
  isMobileCameraAudience,
  type CameraErrorKind,
} from '@/utils/camera'
import {
  CameraFurnitureCanvas,
  GestureSurface,
  DEFAULT_OVERLAY_TRANSFORM,
  type OverlayTransform,
} from '@/components/ar/CameraFurnitureOverlay'

type Phase = 'desktop' | 'requesting' | 'loading-model' | 'ready' | 'error'

/**
 * Camera-overlay “View in Your Room” demo.
 * Not world-anchored AR — live rear camera with a transparent Three.js furniture overlay.
 * Reuses the same FurnitureModel / product configuration as Explore + 3D Planner.
 */
export function ViewInRoom() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const product = productId ? getProductById(productId) : undefined

  const storeProductId = useConfiguratorStore((s) => s.productId)
  const materialId = useConfiguratorStore((s) => s.materialId)
  const colorId = useConfiguratorStore((s) => s.colorId)
  const handleId = useConfiguratorStore((s) => s.handleId)
  const dimensions = useConfiguratorStore((s) => s.dimensions)
  const initFromProduct = useConfiguratorStore((s) => s.initFromProduct)

  const videoRef = useRef<HTMLVideoElement>(null)
  const stopCameraRef = useRef<(() => void) | null>(null)

  const [phase, setPhase] = useState<Phase>(() => (isMobileCameraAudience() ? 'requesting' : 'desktop'))
  const [errorKind, setErrorKind] = useState<CameraErrorKind | null>(null)
  const [transform, setTransform] = useState<OverlayTransform>({ ...DEFAULT_OVERLAY_TRANSFORM })
  const [modelReady, setModelReady] = useState(false)
  const [forceCamera, setForceCamera] = useState(false)

  useEffect(() => {
    if (productId) initFromProduct(productId)
  }, [productId, initFromProduct])

  const config = useMemo(() => {
    if (!product) return null
    const useStore = storeProductId === product.id
    return {
      type: product.category === 'wardrobes' ? 'wardrobe' : product.category,
      materialId: useStore ? materialId : product.availableOptions.materials[0],
      colorId: useStore ? colorId : product.availableOptions.colors[0],
      handleId: useStore ? handleId : product.availableOptions.handles?.[0],
      dimensions: useStore
        ? dimensions
        : defaultDimensions(product.availableOptions.dimensions, product.dimensions),
    }
  }, [product, storeProductId, materialId, colorId, handleId, dimensions])

  const cleanupCamera = useCallback(() => {
    stopCameraRef.current?.()
    stopCameraRef.current = null
  }, [])

  const startCamera = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    cleanupCamera()
    setErrorKind(null)
    setModelReady(false)
    setPhase('requesting')
    try {
      const { stop } = await startRearCamera(video)
      stopCameraRef.current = stop
      setPhase('loading-model')
    } catch (err) {
      const kind = (err as { kind?: CameraErrorKind }).kind ?? 'unknown'
      setErrorKind(kind)
      setPhase('error')
    }
  }, [cleanupCamera])

  useEffect(() => {
    if (!product?.is3DEnabled) return
    if (phase === 'desktop' && !forceCamera) return
    if (forceCamera || phase === 'requesting') {
      void startCamera()
    }
    return () => {
      cleanupCamera()
    }
    // Intentionally run when entering camera modes / product changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, forceCamera])

  useEffect(() => {
    return () => cleanupCamera()
  }, [cleanupCamera])

  useEffect(() => {
    if (phase === 'loading-model' && modelReady) setPhase('ready')
  }, [phase, modelReady])

  const onBack = () => {
    cleanupCamera()
    if (product) navigate(`/product/${product.id}`)
    else navigate(-1)
  }

  if (!product || !product.is3DEnabled || !config) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
        <AlertTriangle className="text-walnut mb-3" size={28} />
        <h1 className="font-display text-2xl text-ink mb-2">Camera view unavailable</h1>
        <p className="text-sm text-stone-600 mb-6 max-w-sm">
          This product does not have a 3D model enabled for View in Your Room.
        </p>
        <Link to="/shop" className="text-sm underline text-walnut">
          Back to shop
        </Link>
      </div>
    )
  }

  const showDesktopGate = phase === 'desktop' && !forceCamera

  return (
    <div className="fixed inset-0 z-[60] bg-ink text-cream flex flex-col">
      {/* Top bar */}
      <header className="absolute top-0 inset-x-0 z-20 flex items-center gap-3 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 bg-gradient-to-b from-ink/70 to-transparent">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-sm bg-cream/15 hover:bg-cream/25 text-sm"
          aria-label="Back"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wider text-cream/70">View in Your Room</p>
          <p className="text-sm font-medium truncate">{product.name}</p>
        </div>
      </header>

      {/* Desktop gate */}
      {showDesktopGate && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10">
          <Camera size={36} className="mb-4 text-cream/80" />
          <h1 className="font-display text-3xl mb-3">View in Your Room</h1>
          <p className="text-cream/80 max-w-md leading-relaxed mb-2">
            View in Your Room is best experienced on a mobile device.
          </p>
          <p className="text-sm text-cream/55 max-w-md mb-8">
            On your phone, open this page over <strong className="text-cream/80">HTTPS</strong>, allow camera access, and place{' '}
            {product.name} over your live room view. This is a camera-overlay demo — not world-anchored AR.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                setForceCamera(true)
                setPhase('requesting')
              }}
              className="h-11 px-5 rounded-sm bg-cream text-ink text-sm font-medium"
            >
              Try camera anyway
            </button>
            <button type="button" onClick={onBack} className="h-11 px-5 rounded-sm border border-cream/40 text-sm">
              Back to product
            </button>
          </div>
        </div>
      )}

      {/* Camera + overlay stage */}
      {!showDesktopGate && (
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {(phase === 'requesting' || phase === 'loading-model') && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ink/50">
              <Loader2 className="animate-spin" size={28} />
              <p className="text-sm tracking-wide">
                {phase === 'requesting' ? 'Opening camera…' : 'Loading furniture…'}
              </p>
            </div>
          )}

          {phase === 'error' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center bg-ink/80">
              <AlertTriangle size={28} className="mb-3 text-cream/90" />
              <p className="font-medium mb-2">Camera unavailable</p>
              <p className="text-sm text-cream/70 max-w-sm mb-6">
                {getCameraErrorMessage(errorKind ?? 'unknown')}
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => void startCamera()}
                  className="h-11 rounded-sm bg-cream text-ink text-sm font-medium"
                >
                  Try again
                </button>
                <button type="button" onClick={onBack} className="h-11 rounded-sm border border-cream/40 text-sm">
                  Back to product
                </button>
              </div>
            </div>
          )}

          {(phase === 'loading-model' || phase === 'ready') && (
            <GestureSurface
              transform={transform}
              onChange={setTransform}
              disabled={phase !== 'ready'}
            >
              <div className="absolute inset-0">
                <CameraFurnitureCanvas
                  type={config.type}
                  dimensions={config.dimensions}
                  materialId={config.materialId}
                  colorId={config.colorId}
                  handleId={config.handleId}
                  transform={transform}
                  onReady={() => setModelReady(true)}
                />
              </div>
            </GestureSurface>
          )}

          {phase === 'ready' && (
            <>
              <p className="absolute top-20 inset-x-0 z-10 text-center text-[11px] tracking-wide text-cream/85 px-4 pointer-events-none">
                Move the furniture with one finger. Pinch to resize.
              </p>
              <p className="absolute bottom-[5.5rem] inset-x-0 z-10 text-center text-[10px] text-cream/50 px-4 pointer-events-none">
                Camera overlay demo — not world-anchored AR
              </p>
            </>
          )}

          {/* Bottom controls */}
          {(phase === 'ready' || phase === 'loading-model') && (
            <div className="absolute bottom-0 inset-x-0 z-20 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 bg-gradient-to-t from-ink/75 to-transparent">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setTransform({ ...DEFAULT_OVERLAY_TRANSFORM })}
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-sm bg-cream/15 text-xs"
                >
                  <RotateCcw size={14} /> Reset
                </button>
                <button
                  type="button"
                  onClick={() => setTransform((t) => ({ ...t, rotation: t.rotation + Math.PI / 8 }))}
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-sm bg-cream/15 text-xs"
                >
                  <RotateCw size={14} /> Rotate
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTransform((t) => ({ ...t, scale: Math.max(0.35, t.scale - 0.12) }))
                  }
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-sm bg-cream/15 text-xs"
                  aria-label="Scale down"
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTransform((t) => ({ ...t, scale: Math.min(2.6, t.scale + 0.12) }))
                  }
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-sm bg-cream/15 text-xs"
                  aria-label="Scale up"
                >
                  <ZoomIn size={14} /> Scale
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
