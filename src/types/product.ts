/** Units: product dimensions are stored in millimetres (mm).
 * Three.js scene units: 1 unit = 1 metre.
 * Conversion: mm → Three.js = value / 1000
 */
export const MM_TO_METERS = 0.001
export const METERS_TO_MM = 1000

export type ProductCategory =
  | 'sofas'
  | 'beds'
  | 'wardrobes'
  | 'tables'
  | 'chairs'
  | 'storage'
  | 'tv-units'
  | 'office'

export type MaterialId = 'walnut' | 'oak' | 'white' | 'dark-wood' | 'fabric-grey' | 'fabric-beige' | 'fabric-navy'

export type ColorId = 'natural' | 'white' | 'black' | 'warm-oak' | 'soft-grey' | 'navy' | 'beige'

export type HandleId = 'handle-a' | 'handle-b' | 'handle-c'

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface DimensionConstraints {
  width: { min: number; max: number; default: number; step: number }
  height: { min: number; max: number; default: number; step: number }
  depth: { min: number; max: number; default: number; step: number }
}

export interface MaterialOption {
  id: MaterialId
  name: string
  hex: string
  priceDelta: number
  roughness: number
  metalness: number
}

export interface ColorOption {
  id: ColorId
  name: string
  hex: string
  priceDelta: number
}

export interface HandleOption {
  id: HandleId
  name: string
  priceDelta: number
}

export interface ProductOption {
  materials: MaterialId[]
  colors: ColorId[]
  handles?: HandleId[]
  dimensions?: DimensionConstraints
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  description: string
  longDescription: string
  price: number
  dimensions: Dimensions
  materials: MaterialId[]
  colors: ColorId[]
  images: string[]
  modelPath: string | null
  features: string[]
  is3DEnabled: boolean
  availableOptions: ProductOption
  rating: number
  reviewCount: number
  isNew?: boolean
  isFeatured?: boolean
  tags: string[]
  specs: Record<string, string>
  faq: { q: string; a: string }[]
}

export interface CategoryInfo {
  id: ProductCategory | 'all'
  name: string
  description: string
  image: string
  productCount?: number
}

export interface PriceBreakdown {
  base: number
  materialDelta: number
  colorDelta: number
  handleDelta: number
  dimensionDelta: number
  quantity: number
  unitTotal: number
  total: number
}

export interface ProductConfiguration {
  productId: string
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  dimensions: Dimensions
  quantity: number
}
