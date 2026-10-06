import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import type { CameraPreset } from '@/types/configurator'

const PRESETS: Record<CameraPreset, { position: THREE.Vector3; target: THREE.Vector3 }> = {
  front: { position: new THREE.Vector3(0, 1.4, 4.5), target: new THREE.Vector3(0, 1, 0) },
  top: { position: new THREE.Vector3(0, 7, 0.01), target: new THREE.Vector3(0, 0, 0) },
  perspective: { position: new THREE.Vector3(3.2, 2.4, 3.5), target: new THREE.Vector3(0, 0.8, 0) },
  overview: { position: new THREE.Vector3(5, 4, 5), target: new THREE.Vector3(0, 0.5, 0) },
}

interface CameraControllerProps {
  preset: CameraPreset
  minDistance?: number
  maxDistance?: number
  target?: [number, number, number]
  autoFrame?: boolean
}

export function CameraController({
  preset,
  minDistance = 1.2,
  maxDistance = 10,
  target = [0, 0.8, 0],
}: CameraControllerProps) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()
  const animating = useRef(false)
  const startPos = useRef(new THREE.Vector3())
  const endPos = useRef(new THREE.Vector3())
  const startTarget = useRef(new THREE.Vector3())
  const endTarget = useRef(new THREE.Vector3())
  const progress = useRef(1)

  useEffect(() => {
    const p = PRESETS[preset]
    if (!controls.current) return
    startPos.current.copy(camera.position)
    endPos.current.copy(p.position)
    startTarget.current.copy(controls.current.target)
    endTarget.current.copy(p.target)
    progress.current = 0
    animating.current = true
  }, [preset, camera])

  useFrame((_, delta) => {
    if (!animating.current || !controls.current) return
    progress.current = Math.min(1, progress.current + delta * 1.8)
    const t = 1 - Math.pow(1 - progress.current, 3)
    camera.position.lerpVectors(startPos.current, endPos.current, t)
    controls.current.target.lerpVectors(startTarget.current, endTarget.current, t)
    controls.current.update()
    if (progress.current >= 1) animating.current = false
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={minDistance}
      maxDistance={maxDistance}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={0.15}
      target={target}
      enablePan
    />
  )
}

export function ProductCameraController({ resetKey = 0 }: { resetKey?: number }) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(1.8, 1.4, 2.2)
    if (controls.current) {
      controls.current.target.set(0, 0.9, 0)
      controls.current.update()
    }
  }, [resetKey, camera])

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={1}
      maxDistance={5}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={0.2}
      target={[0, 0.9, 0]}
    />
  )
}
