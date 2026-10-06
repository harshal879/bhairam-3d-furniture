import { create } from 'zustand'
import type { ColorId, Dimensions, HandleId, MaterialId } from '@/types/product'
import { getProductById } from '@/data/products'
import { defaultDimensions } from '@/utils/dimensions'

interface ConfiguratorState {
  productId: string | null
  materialId: MaterialId
  colorId: ColorId
  handleId: HandleId
  dimensions: Dimensions
  quantity: number
  initFromProduct: (productId: string) => void
  setMaterial: (id: MaterialId) => void
  setColor: (id: ColorId) => void
  setHandle: (id: HandleId) => void
  setDimensions: (d: Partial<Dimensions>) => void
  setQuantity: (q: number) => void
  reset: () => void
}

const defaults = {
  productId: null as string | null,
  materialId: 'walnut' as MaterialId,
  colorId: 'natural' as ColorId,
  handleId: 'handle-a' as HandleId,
  dimensions: { width: 1800, height: 2100, depth: 600 },
  quantity: 1,
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  ...defaults,
  initFromProduct: (productId) => {
    const product = getProductById(productId)
    if (!product) return
    const opts = product.availableOptions
    set({
      productId,
      materialId: opts.materials[0],
      colorId: opts.colors[0],
      handleId: opts.handles?.[0] ?? 'handle-a',
      dimensions: defaultDimensions(opts.dimensions, product.dimensions),
      quantity: 1,
    })
  },
  setMaterial: (id) => set({ materialId: id }),
  setColor: (id) => set({ colorId: id }),
  setHandle: (id) => set({ handleId: id }),
  setDimensions: (d) => set({ dimensions: { ...get().dimensions, ...d } }),
  setQuantity: (q) => set({ quantity: Math.max(1, Math.min(99, q)) }),
  reset: () => {
    const id = get().productId
    if (id) get().initFromProduct(id)
    else set(defaults)
  },
}))
