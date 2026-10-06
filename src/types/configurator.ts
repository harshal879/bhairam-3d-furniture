import type { ColorId, Dimensions, HandleId, MaterialId } from './product'

export type RoomFurnitureType =
  | 'sofa'
  | 'table'
  | 'chair'
  | 'tv-unit'
  | 'cabinet'
  | 'wardrobe'
  | 'bed'
  | 'desk'
  | 'rug'
  | 'lamp'
  | 'plant'

export interface RoomItem {
  id: string
  productId: string | null
  type: RoomFurnitureType
  name: string
  position: [number, number, number]
  rotation: number
  scale: number
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  dimensions: Dimensions
  price: number
}

export interface RoomPreset {
  id: string
  name: string
  description: string
  size: { width: number; depth: number; height: number }
  items: Omit<RoomItem, 'id'>[]
}

export type CameraPreset = 'front' | 'top' | 'perspective' | 'overview'

export interface ConfiguratorState {
  productId: string
  materialId: MaterialId
  colorId: ColorId
  handleId: HandleId
  dimensions: Dimensions
  quantity: number
}
