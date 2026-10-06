import { useMemo } from 'react'
import * as THREE from 'three'

interface RoomShellProps {
  width: number
  depth: number
  height: number
  showGrid?: boolean
}

export function RoomShell({ width, depth, height, showGrid }: RoomShellProps) {
  const wallMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f5f2ed', roughness: 0.9, metalness: 0 }),
    [],
  )
  const floorMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#d4c4a8', roughness: 0.75, metalness: 0.05 }),
    [],
  )
  const trimMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e5dfd4', roughness: 0.8 }),
    [],
  )

  const hw = width / 2
  const hd = depth / 2

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={floorMat}>
        <planeGeometry args={[width, depth]} />
      </mesh>
      {showGrid && (
        <gridHelper args={[Math.max(width, depth), Math.max(width, depth) * 2, '#c4b8a8', '#d9d0c4']} position={[0, 0.002, 0]} />
      )}

      {/* Back wall */}
      <mesh position={[0, height / 2, -hd]} material={wallMat} receiveShadow>
        <planeGeometry args={[width, height]} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-hw, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={wallMat} receiveShadow>
        <planeGeometry args={[depth, height]} />
      </mesh>
      {/* Right wall */}
      <mesh position={[hw, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={wallMat} receiveShadow>
        <planeGeometry args={[depth, height]} />
      </mesh>

      {/* Ceiling (subtle) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} material={trimMat}>
        <planeGeometry args={[width, depth]} />
      </mesh>

      {/* Window on back wall */}
      <group position={[0, height * 0.55, -hd + 0.02]}>
        <mesh material={new THREE.MeshStandardMaterial({ color: '#a8c8e0', roughness: 0.1, metalness: 0.2, transparent: true, opacity: 0.55 })}>
          <planeGeometry args={[1.6, 1.1]} />
        </mesh>
        <mesh position={[0, 0, -0.01]} material={new THREE.MeshStandardMaterial({ color: '#8a7968', roughness: 0.6 })}>
          <planeGeometry args={[1.7, 1.2]} />
        </mesh>
        {/* Cross bars */}
        <mesh position={[0, 0, 0.01]} material={new THREE.MeshStandardMaterial({ color: '#f5f2ed' })}>
          <boxGeometry args={[0.04, 1.1, 0.02]} />
        </mesh>
        <mesh position={[0, 0, 0.01]} material={new THREE.MeshStandardMaterial({ color: '#f5f2ed' })}>
          <boxGeometry args={[1.6, 0.04, 0.02]} />
        </mesh>
      </group>

      {/* Baseboards */}
      <mesh position={[0, 0.05, -hd + 0.02]} material={trimMat}>
        <boxGeometry args={[width, 0.1, 0.02]} />
      </mesh>
    </group>
  )
}
