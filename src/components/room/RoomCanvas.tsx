import { Suspense, useRef, useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Loader2 } from 'lucide-react'
import { FurnitureModel } from '@/three/FurnitureModel'
import { RoomShell } from '@/three/RoomScene'
import { RoomLighting } from '@/three/Lighting'
import { CameraController } from '@/three/CameraController'
import { useRoomStore } from '@/store/roomStore'
import type { RoomItem } from '@/types/configurator'

function DraggableItem({ item }: { item: RoomItem }) {
  const selectedId = useRoomStore((s) => s.selectedId)
  const selectItem = useRoomStore((s) => s.selectItem)
  const moveItem = useRoomStore((s) => s.moveItem)
  const dragging = useRef(false)
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const intersect = useRef(new THREE.Vector3())

  const onPointerDown = useCallback(
    (e: THREE.Event & { stopPropagation: () => void; target: { setPointerCapture: (id: number) => void }; pointerId: number }) => {
      e.stopPropagation()
      selectItem(item.id)
      dragging.current = true
      try {
        e.target.setPointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    },
    [item.id, selectItem],
  )

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  const onPointerMove = useCallback(
    (e: THREE.Event & { stopPropagation: () => void; ray: THREE.Ray }) => {
      if (!dragging.current) return
      e.stopPropagation()
      if (e.ray.intersectPlane(plane.current, intersect.current)) {
        moveItem(item.id, [intersect.current.x, 0, intersect.current.z])
      }
    },
    [item.id, moveItem],
  )

  return (
    <group
      position={item.position}
      rotation={[0, item.rotation, 0]}
      scale={item.scale}
      onPointerDown={onPointerDown as never}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove as never}
    >
      <FurnitureModel
        type={item.type}
        dimensions={item.dimensions}
        materialId={item.materialId}
        colorId={item.colorId}
        handleId={item.handleId}
        selected={selectedId === item.id}
        onSelect={() => selectItem(item.id)}
      />
    </group>
  )
}

function RoomContents() {
  const items = useRoomStore((s) => s.items)
  const roomSize = useRoomStore((s) => s.roomSize)
  const showGrid = useRoomStore((s) => s.showGrid)
  const cameraPreset = useRoomStore((s) => s.cameraPreset)

  return (
    <>
      <RoomLighting />
      <CameraController preset={cameraPreset} minDistance={1.5} maxDistance={12} />
      <RoomShell width={roomSize.width} depth={roomSize.depth} height={roomSize.height} showGrid={showGrid} />
      {items.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </>
  )
}

export function RoomCanvas({ className = '' }: { className?: string }) {
  const [ready, setReady] = useState(false)

  return (
    <div className={`relative w-full h-full bg-stone-200 ${className}`}>
      {!ready && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center gap-2 text-stone-600 text-sm bg-stone-200/80">
          <Loader2 className="animate-spin" size={18} /> Loading room…
        </div>
      )}
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
        camera={{ position: [3.2, 2.4, 3.5], fov: 45, near: 0.1, far: 60 }}
        onPointerMissed={() => useRoomStore.getState().selectItem(null)}
        onCreated={() => setReady(true)}
      >
        <Suspense fallback={null}>
          <RoomContents />
        </Suspense>
      </Canvas>
    </div>
  )
}
