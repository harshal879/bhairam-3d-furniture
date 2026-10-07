import { Suspense, useEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { FurnitureModel } from '@/three/FurnitureModel'
import type { ColorId, Dimensions, HandleId, MaterialId } from '@/types/product'

export interface OverlayTransform {
  x: number
  y: number
  rotation: number
  scale: number
}

export const DEFAULT_OVERLAY_TRANSFORM: OverlayTransform = {
  x: 0,
  y: -0.15,
  rotation: 0.35,
  scale: 1,
}

interface CameraFurnitureSceneProps {
  type: string
  dimensions: Dimensions
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  transform: OverlayTransform
}

function LightweightLights() {
  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[2, 4, 3]} intensity={0.9} />
    </>
  )
}

function FitCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.position.set(0, 1.1, 3.2)
    camera.lookAt(0, 0.7, 0)
    camera.updateProjectionMatrix()
  }, [camera, size.width, size.height])
  return null
}

function FurnitureOverlay({ type, dimensions, materialId, colorId, handleId, transform }: CameraFurnitureSceneProps) {
  return (
    <group
      position={[transform.x, transform.y, 0]}
      rotation={[0, transform.rotation, 0]}
      scale={transform.scale}
    >
      <FurnitureModel
        type={type}
        dimensions={dimensions}
        materialId={materialId}
        colorId={colorId}
        handleId={handleId}
      />
    </group>
  )
}

interface GestureSurfaceProps {
  transform: OverlayTransform
  onChange: (next: OverlayTransform) => void
  children: React.ReactNode
  disabled?: boolean
}

/** One-finger drag + two-finger pinch/rotate — no extra gesture library. */
export function GestureSurface({ transform, onChange, children, disabled }: GestureSurfaceProps) {
  const transformRef = useRef(transform)
  transformRef.current = transform

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const mode = useRef<'none' | 'drag' | 'pinch'>('none')
  const dragLast = useRef<{ x: number; y: number } | null>(null)
  const pinchStart = useRef<{ dist: number; angle: number; scale: number; rotation: number } | null>(null)

  const syncPointers = (e: ReactPointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
  }

  const clearPointer = (e: ReactPointerEvent) => {
    pointers.current.delete(e.pointerId)
    if (pointers.current.size === 0) {
      mode.current = 'none'
      dragLast.current = null
      pinchStart.current = null
    } else if (pointers.current.size === 1) {
      mode.current = 'drag'
      pinchStart.current = null
      const only = [...pointers.current.values()][0]
      dragLast.current = { x: only.x, y: only.y }
    }
  }

  const onPointerDown = (e: ReactPointerEvent) => {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    syncPointers(e)
    if (pointers.current.size === 1) {
      mode.current = 'drag'
      dragLast.current = { x: e.clientX, y: e.clientY }
    } else if (pointers.current.size === 2) {
      mode.current = 'pinch'
      dragLast.current = null
      const [a, b] = [...pointers.current.values()]
      const dx = b.x - a.x
      const dy = b.y - a.y
      pinchStart.current = {
        dist: Math.hypot(dx, dy) || 1,
        angle: Math.atan2(dy, dx),
        scale: transformRef.current.scale,
        rotation: transformRef.current.rotation,
      }
    }
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (disabled || !pointers.current.has(e.pointerId)) return
    syncPointers(e)
    const t = transformRef.current

    if (mode.current === 'drag' && pointers.current.size === 1 && dragLast.current) {
      const dx = e.clientX - dragLast.current.x
      const dy = e.clientY - dragLast.current.y
      dragLast.current = { x: e.clientX, y: e.clientY }
      // Convert pixels → world units (tuned for phone height)
      const k = 0.0035
      onChange({
        ...t,
        x: Math.max(-1.8, Math.min(1.8, t.x + dx * k)),
        y: Math.max(-1.4, Math.min(1.4, t.y - dy * k)),
      })
      return
    }

    if (mode.current === 'pinch' && pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 1
      const angle = Math.atan2(dy, dx)
      const scaleFactor = dist / pinchStart.current.dist
      const nextScale = Math.max(0.35, Math.min(2.6, pinchStart.current.scale * scaleFactor))
      const nextRot = pinchStart.current.rotation + (angle - pinchStart.current.angle)
      onChange({ ...t, scale: nextScale, rotation: nextRot })
    }
  }

  return (
    <div
      className="absolute inset-0 touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={clearPointer}
      onPointerCancel={clearPointer}
      style={{ touchAction: 'none' }}
    >
      {children}
    </div>
  )
}

interface CameraFurnitureCanvasProps {
  type: string
  dimensions: Dimensions
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  transform: OverlayTransform
  onReady?: () => void
}

export function CameraFurnitureCanvas({
  type,
  dimensions,
  materialId,
  colorId,
  handleId,
  transform,
  onReady,
}: CameraFurnitureCanvasProps) {
  const sceneKey = useMemo(
    () => `${type}-${dimensions.width}-${dimensions.height}-${dimensions.depth}-${materialId}-${colorId}-${handleId ?? ''}`,
    [type, dimensions, materialId, colorId, handleId],
  )

  return (
    <Canvas
      key={sceneKey}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{ position: [0, 1.1, 3.2], fov: 42, near: 0.1, far: 40 }}
      style={{ background: 'transparent', pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        onReady?.()
      }}
    >
      <Suspense fallback={null}>
        <FitCamera />
        <LightweightLights />
        <FurnitureOverlay
          type={type}
          dimensions={dimensions}
          materialId={materialId}
          colorId={colorId}
          handleId={handleId}
          transform={transform}
        />
      </Suspense>
    </Canvas>
  )
}
