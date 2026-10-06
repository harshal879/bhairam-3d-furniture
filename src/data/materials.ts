import type { ColorOption, HandleOption, MaterialOption } from '@/types/product'

export const materials: MaterialOption[] = [
  { id: 'walnut', name: 'Walnut', hex: '#5c3d2e', priceDelta: 2000, roughness: 0.55, metalness: 0.05 },
  { id: 'oak', name: 'Oak', hex: '#c4a574', priceDelta: 1500, roughness: 0.6, metalness: 0.02 },
  { id: 'white', name: 'White Lacquer', hex: '#f5f2ed', priceDelta: 0, roughness: 0.35, metalness: 0.1 },
  { id: 'dark-wood', name: 'Dark Wood', hex: '#2c2118', priceDelta: 1800, roughness: 0.5, metalness: 0.08 },
  { id: 'fabric-grey', name: 'Grey Fabric', hex: '#8a8580', priceDelta: 0, roughness: 0.85, metalness: 0 },
  { id: 'fabric-beige', name: 'Beige Fabric', hex: '#d4c4a8', priceDelta: 500, roughness: 0.85, metalness: 0 },
  { id: 'fabric-navy', name: 'Navy Fabric', hex: '#2c3a4a', priceDelta: 800, roughness: 0.85, metalness: 0 },
]

export const colors: ColorOption[] = [
  { id: 'natural', name: 'Natural', hex: '#c4a574', priceDelta: 0 },
  { id: 'white', name: 'White', hex: '#f5f2ed', priceDelta: 0 },
  { id: 'black', name: 'Black', hex: '#1a1816', priceDelta: 400 },
  { id: 'warm-oak', name: 'Warm Oak', hex: '#b8956a', priceDelta: 600 },
  { id: 'soft-grey', name: 'Soft Grey', hex: '#a8a29e', priceDelta: 0 },
  { id: 'navy', name: 'Navy', hex: '#2c3a4a', priceDelta: 800 },
  { id: 'beige', name: 'Beige', hex: '#d4c4a8', priceDelta: 300 },
]

export const handles: HandleOption[] = [
  { id: 'handle-a', name: 'Handle A — Slim Bar', priceDelta: 0 },
  { id: 'handle-b', name: 'Handle B — Round Knob', priceDelta: 400 },
  { id: 'handle-c', name: 'Handle C — Gold Bar', priceDelta: 800 },
]

export function getMaterial(id: string): MaterialOption {
  return materials.find((m) => m.id === id) ?? materials[0]
}

export function getColor(id: string): ColorOption {
  return colors.find((c) => c.id === id) ?? colors[0]
}

export function getHandle(id: string): HandleOption {
  return handles.find((h) => h.id === id) ?? handles[0]
}
