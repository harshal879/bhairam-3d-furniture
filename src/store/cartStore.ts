import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ColorId, Dimensions, HandleId, MaterialId } from '@/types/product'
import { calculatePrice } from '@/utils/pricing'

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  materialId: MaterialId
  colorId: ColorId
  handleId?: HandleId
  dimensions: Dimensions
  quantity: number
  unitPrice: number
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'unitPrice'> & { unitPrice?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

function configKey(item: Pick<CartItem, 'productId' | 'materialId' | 'colorId' | 'handleId' | 'dimensions'>): string {
  return [
    item.productId,
    item.materialId,
    item.colorId,
    item.handleId ?? '',
    item.dimensions.width,
    item.dimensions.height,
    item.dimensions.depth,
  ].join('|')
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const price =
          item.unitPrice ??
          calculatePrice({
            productId: item.productId,
            materialId: item.materialId,
            colorId: item.colorId,
            handleId: item.handleId,
            dimensions: item.dimensions,
            quantity: 1,
          }).unitTotal

        const key = configKey(item)
        const existing = get().items.find((i) => configKey(i) === key)

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          })
          return
        }

        set({
          items: [
            ...get().items,
            {
              ...item,
              id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              unitPrice: price,
            },
          ],
        })
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })
      },
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    }),
    { name: 'forma-cart' },
  ),
)
