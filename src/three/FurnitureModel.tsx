import { getColor, getMaterial } from '@/data/materials'
import type { ColorId, Dimensions, HandleId, MaterialId } from '@/types/product'
import { mmToMeters } from '@/utils/dimensions'
import { useMemo } from 'react'
import * as THREE from 'three'

export function useFurnitureMaterial(materialId: MaterialId, colorId: ColorId) {
  return useMemo(() => {
    const mat = getMaterial(materialId)
    const col = getColor(colorId)
    const isFabric = materialId.startsWith('fabric')
    const hex = isFabric ? mat.hex : col.id === 'natural' || col.id === 'warm-oak' ? mat.hex : col.hex
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(hex),
      roughness: mat.roughness,
      metalness: mat.metalness,
    })
  }, [materialId, colorId])
}

interface FurnitureModelProps {
  type: string
  dimensions: Dimensions
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  selected?: boolean
  onSelect?: () => void
}

/** Procedural furniture geometry — body, doors, shelves, handles as separate meshes. */
export function FurnitureModel({
  type,
  dimensions,
  materialId,
  colorId,
  handleId = 'handle-a',
  selected,
  onSelect,
}: FurnitureModelProps) {
  const material = useFurnitureMaterial(materialId, colorId)
  const w = mmToMeters(dimensions.width)
  const h = mmToMeters(dimensions.height)
  const d = mmToMeters(dimensions.depth)

  const handleMat = useMemo(() => {
    const gold = handleId === 'handle-c'
    return new THREE.MeshStandardMaterial({
      color: gold ? '#c4a35a' : handleId === 'handle-b' ? '#8a7968' : '#5c3d2e',
      metalness: gold ? 0.85 : 0.3,
      roughness: gold ? 0.25 : 0.5,
    })
  }, [handleId])

  const accent = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#1a1816', roughness: 0.6, metalness: 0.1 }),
    [],
  )

  const linen = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#f5f2ed', roughness: 0.9 }),
    [],
  )

  const doorInset = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#00000022', roughness: 1 }),
    [],
  )

  const leaf = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3d5c45', roughness: 0.8 }), [])

  const selectMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#8b5e3c',
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
      }),
    [],
  )

  const onPick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    onSelect?.()
  }

  const kind = type === 'wardrobes' ? 'wardrobe'
    : type === 'sofas' ? 'sofa'
    : type === 'beds' ? 'bed'
    : type === 'tables' || type === 'office' ? 'table'
    : type === 'chairs' ? 'chair'
    : type === 'tv-units' ? 'tv-unit'
    : type === 'storage' ? 'cabinet'
    : type

  if (kind === 'wardrobe') {
    const doorW = w / 2 - 0.01
    return (
      <group position={[0, h / 2, 0]} onClick={onPick}>
        <mesh material={material} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
        </mesh>
        <mesh position={[-doorW / 2 - 0.005, 0, d / 2 + 0.008]} material={material} castShadow>
          <boxGeometry args={[doorW, h - 0.04, 0.02]} />
        </mesh>
        <mesh position={[doorW / 2 + 0.005, 0, d / 2 + 0.008]} material={material} castShadow>
          <boxGeometry args={[doorW, h - 0.04, 0.02]} />
        </mesh>
        {[-0.25, 0, 0.25].map((y) => (
          <mesh key={y} position={[0, y * h, 0]} material={material}>
            <boxGeometry args={[w - 0.04, 0.018, d - 0.04]} />
          </mesh>
        ))}
        <HandleMesh handleId={handleId} material={handleMat} position={[-0.08, 0, d / 2 + 0.025]} />
        <HandleMesh handleId={handleId} material={handleMat} position={[0.08, 0, d / 2 + 0.025]} />
        {selected && (
          <mesh material={selectMat}>
            <boxGeometry args={[w + 0.04, h + 0.04, d + 0.04]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'sofa') {
    return (
      <group onClick={onPick}>
        <mesh position={[0, h * 0.35, 0]} material={material} castShadow receiveShadow>
          <boxGeometry args={[w, h * 0.35, d]} />
        </mesh>
        <mesh position={[0, h * 0.55, -d * 0.35]} material={material} castShadow>
          <boxGeometry args={[w, h * 0.45, d * 0.25]} />
        </mesh>
        <mesh position={[-w * 0.42, h * 0.4, 0]} material={material} castShadow>
          <boxGeometry args={[w * 0.12, h * 0.4, d * 0.9]} />
        </mesh>
        <mesh position={[w * 0.42, h * 0.4, 0]} material={material} castShadow>
          <boxGeometry args={[w * 0.12, h * 0.4, d * 0.9]} />
        </mesh>
        <mesh position={[-w * 0.4, 0.05, d * 0.35]} material={accent}>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
        </mesh>
        <mesh position={[w * 0.4, 0.05, d * 0.35]} material={accent}>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
        </mesh>
        {selected && (
          <mesh position={[0, h / 2, 0]} material={selectMat}>
            <boxGeometry args={[w + 0.05, h + 0.05, d + 0.05]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'bed') {
    return (
      <group onClick={onPick}>
        <mesh position={[0, h * 0.55, -d * 0.42]} material={material} castShadow>
          <boxGeometry args={[w, h * 0.7, 0.08]} />
        </mesh>
        <mesh position={[0, 0.2, 0]} material={material} castShadow receiveShadow>
          <boxGeometry args={[w, 0.25, d]} />
        </mesh>
        <mesh position={[0, 0.38, 0.05]} material={linen} castShadow>
          <boxGeometry args={[w * 0.92, 0.12, d * 0.75]} />
        </mesh>
        {selected && (
          <mesh position={[0, h / 2, 0]} material={selectMat}>
            <boxGeometry args={[w + 0.05, h + 0.05, d + 0.05]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'table' || kind === 'desk') {
    const leg = 0.05
    const topH = 0.04
    return (
      <group onClick={onPick}>
        <mesh position={[0, h - topH / 2, 0]} material={material} castShadow receiveShadow>
          <boxGeometry args={[w, topH, d]} />
        </mesh>
        {[
          [-w / 2 + leg, d / 2 - leg],
          [w / 2 - leg, d / 2 - leg],
          [-w / 2 + leg, -d / 2 + leg],
          [w / 2 - leg, -d / 2 + leg],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, (h - topH) / 2, z]} material={material} castShadow>
            <boxGeometry args={[leg, h - topH, leg]} />
          </mesh>
        ))}
        {selected && (
          <mesh position={[0, h / 2, 0]} material={selectMat}>
            <boxGeometry args={[w + 0.04, h + 0.04, d + 0.04]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'chair') {
    return (
      <group onClick={onPick}>
        <mesh position={[0, h * 0.45, 0]} material={material} castShadow>
          <boxGeometry args={[w, 0.05, d * 0.7]} />
        </mesh>
        <mesh position={[0, h * 0.7, -d * 0.3]} material={material} castShadow>
          <boxGeometry args={[w, h * 0.45, 0.04]} />
        </mesh>
        {[
          [-w / 2 + 0.03, d * 0.25],
          [w / 2 - 0.03, d * 0.25],
          [-w / 2 + 0.03, -d * 0.25],
          [w / 2 - 0.03, -d * 0.25],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, h * 0.22, z]} material={accent} castShadow>
            <cylinderGeometry args={[0.015, 0.015, h * 0.45, 8]} />
          </mesh>
        ))}
        {selected && (
          <mesh position={[0, h / 2, 0]} material={selectMat}>
            <boxGeometry args={[w + 0.04, h + 0.04, d + 0.04]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'tv-unit') {
    return (
      <group position={[0, h / 2, 0]} onClick={onPick}>
        <mesh material={material} castShadow receiveShadow>
          <boxGeometry args={[w, h, d]} />
        </mesh>
        <mesh position={[-w * 0.22, 0, d / 2 + 0.005]} material={doorInset}>
          <boxGeometry args={[w * 0.35, h * 0.7, 0.01]} />
        </mesh>
        <HandleMesh handleId={handleId} material={handleMat} position={[w * 0.25, 0, d / 2 + 0.02]} />
        {selected && (
          <mesh material={selectMat}>
            <boxGeometry args={[w + 0.04, h + 0.04, d + 0.04]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'rug') {
    return (
      <group onClick={onPick}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={material} receiveShadow>
          <planeGeometry args={[w, d]} />
        </mesh>
        {selected && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]} material={selectMat}>
            <planeGeometry args={[w + 0.05, d + 0.05]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'lamp') {
    return (
      <group onClick={onPick}>
        <mesh position={[0, 0.05, 0]} material={accent}>
          <cylinderGeometry args={[0.15, 0.18, 0.05, 16]} />
        </mesh>
        <mesh position={[0, h * 0.4, 0]} material={accent}>
          <cylinderGeometry args={[0.02, 0.02, h * 0.8, 8]} />
        </mesh>
        <mesh position={[0, h * 0.85, 0]} material={material} castShadow>
          <coneGeometry args={[0.2, 0.3, 16]} />
        </mesh>
        {selected && (
          <mesh position={[0, h / 2, 0]} material={selectMat}>
            <boxGeometry args={[0.5, h + 0.1, 0.5]} />
          </mesh>
        )}
      </group>
    )
  }

  if (kind === 'plant') {
    return (
      <group onClick={onPick}>
        <mesh position={[0, 0.1, 0]} material={material}>
          <cylinderGeometry args={[0.12, 0.1, 0.2, 12]} />
        </mesh>
        <mesh position={[0, 0.45, 0]} material={leaf} castShadow>
          <sphereGeometry args={[0.25, 12, 12]} />
        </mesh>
        <mesh position={[0.12, 0.6, 0.05]} material={leaf} castShadow>
          <sphereGeometry args={[0.15, 10, 10]} />
        </mesh>
        {selected && (
          <mesh position={[0, 0.4, 0]} material={selectMat}>
            <boxGeometry args={[0.6, 0.9, 0.6]} />
          </mesh>
        )}
      </group>
    )
  }

  // Default cabinet / storage
  return (
    <group position={[0, h / 2, 0]} onClick={onPick}>
      <mesh material={material} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <HandleMesh handleId={handleId} material={handleMat} position={[0, 0, d / 2 + 0.02]} />
      {selected && (
        <mesh material={selectMat}>
          <boxGeometry args={[w + 0.04, h + 0.04, d + 0.04]} />
        </mesh>
      )}
    </group>
  )
}

function HandleMesh({
  handleId,
  material,
  position,
}: {
  handleId: HandleId
  material: THREE.Material
  position: [number, number, number]
}) {
  if (handleId === 'handle-b') {
    return (
      <mesh position={position} material={material} castShadow>
        <sphereGeometry args={[0.018, 12, 12]} />
      </mesh>
    )
  }
  return (
    <mesh position={position} material={material} castShadow rotation={[0, 0, Math.PI / 2]}>
      <capsuleGeometry args={[0.008, 0.08, 4, 8]} />
    </mesh>
  )
}
