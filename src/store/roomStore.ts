import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CameraPreset, RoomFurnitureType, RoomItem } from '@/types/configurator'
import type { ColorId, Dimensions, HandleId, MaterialId } from '@/types/product'
import { roomPresets } from '@/data/rooms'
import { getProductById } from '@/data/products'
import { calculatePrice } from '@/utils/pricing'

interface RoomState {
  roomId: string
  roomSize: { width: number; depth: number; height: number }
  items: RoomItem[]
  selectedId: string | null
  cameraPreset: CameraPreset
  showGrid: boolean
  loadPreset: (presetId: string) => void
  addProduct: (productId: string) => void
  addFurnitureType: (type: RoomFurnitureType, name?: string) => void
  selectItem: (id: string | null) => void
  updateItem: (id: string, patch: Partial<RoomItem>) => void
  moveItem: (id: string, position: [number, number, number]) => void
  rotateItem: (id: string, rotation: number) => void
  removeItem: (id: string) => void
  duplicateItem: (id: string) => void
  setMaterial: (id: string, materialId: MaterialId) => void
  setColor: (id: string, colorId: ColorId) => void
  setHandle: (id: string, handleId: HandleId) => void
  setCameraPreset: (preset: CameraPreset) => void
  setShowGrid: (show: boolean) => void
  resetRoom: () => void
  roomTotal: () => number
}

function uid(): string {
  return `room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function clampToRoom(
  pos: [number, number, number],
  size: { width: number; depth: number },
): [number, number, number] {
  const margin = 0.4
  const halfW = size.width / 2 - margin
  const halfD = size.depth / 2 - margin
  return [
    Math.min(halfW, Math.max(-halfW, pos[0])),
    0,
    Math.min(halfD, Math.max(-halfD, pos[2])),
  ]
}

function typeFromCategory(category: string): RoomFurnitureType {
  const map: Record<string, RoomFurnitureType> = {
    sofas: 'sofa',
    beds: 'bed',
    wardrobes: 'wardrobe',
    tables: 'table',
    chairs: 'chair',
    storage: 'cabinet',
    'tv-units': 'tv-unit',
    office: 'desk',
  }
  return map[category] ?? 'cabinet'
}

const emptyStudio = roomPresets.find((r) => r.id === 'empty-studio')!

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      roomId: emptyStudio.id,
      roomSize: emptyStudio.size,
      items: [],
      selectedId: null,
      cameraPreset: 'perspective',
      showGrid: true,

      loadPreset: (presetId) => {
        const preset = roomPresets.find((r) => r.id === presetId) ?? emptyStudio
        set({
          roomId: preset.id,
          roomSize: preset.size,
          items: preset.items.map((item) => ({ ...item, id: uid() })),
          selectedId: null,
          cameraPreset: 'perspective',
        })
      },

      addProduct: (productId) => {
        const product = getProductById(productId)
        if (!product) return
        const materialId = product.availableOptions.materials[0]
        const colorId = product.availableOptions.colors[0]
        const handleId = product.availableOptions.handles?.[0]
        const price = calculatePrice({
          productId,
          materialId,
          colorId,
          handleId,
          dimensions: product.dimensions,
          quantity: 1,
        }).unitTotal

        const item: RoomItem = {
          id: uid(),
          productId,
          type: typeFromCategory(product.category),
          name: product.name,
          position: clampToRoom([0, 0, 0], get().roomSize),
          rotation: 0,
          scale: 1,
          materialId,
          colorId,
          handleId,
          dimensions: { ...product.dimensions },
          price,
        }
        set({ items: [...get().items, item], selectedId: item.id })
      },

      addFurnitureType: (type, name) => {
        const defaults: Record<RoomFurnitureType, { name: string; dims: Dimensions; materialId: MaterialId; colorId: ColorId; price: number }> = {
          sofa: { name: 'Sofa', dims: { width: 2000, height: 800, depth: 900 }, materialId: 'fabric-grey', colorId: 'soft-grey', price: 35000 },
          table: { name: 'Table', dims: { width: 1200, height: 400, depth: 600 }, materialId: 'oak', colorId: 'natural', price: 12000 },
          chair: { name: 'Chair', dims: { width: 460, height: 820, depth: 520 }, materialId: 'oak', colorId: 'natural', price: 7000 },
          'tv-unit': { name: 'TV Unit', dims: { width: 1600, height: 450, depth: 400 }, materialId: 'walnut', colorId: 'natural', price: 18000 },
          cabinet: { name: 'Cabinet', dims: { width: 900, height: 1200, depth: 400 }, materialId: 'walnut', colorId: 'natural', price: 20000 },
          wardrobe: { name: 'Wardrobe', dims: { width: 1800, height: 2100, depth: 600 }, materialId: 'white', colorId: 'white', price: 24999 },
          bed: { name: 'Bed', dims: { width: 1600, height: 1100, depth: 2100 }, materialId: 'oak', colorId: 'warm-oak', price: 38000 },
          desk: { name: 'Desk', dims: { width: 1400, height: 750, depth: 700 }, materialId: 'oak', colorId: 'natural', price: 16000 },
          rug: { name: 'Rug', dims: { width: 2000, height: 20, depth: 1400 }, materialId: 'fabric-beige', colorId: 'beige', price: 4999 },
          lamp: { name: 'Floor Lamp', dims: { width: 400, height: 1600, depth: 400 }, materialId: 'white', colorId: 'white', price: 3999 },
          plant: { name: 'Plant', dims: { width: 400, height: 900, depth: 400 }, materialId: 'oak', colorId: 'natural', price: 1499 },
        }
        const d = defaults[type]
        const item: RoomItem = {
          id: uid(),
          productId: null,
          type,
          name: name ?? d.name,
          position: clampToRoom([0.5, 0, 0.5], get().roomSize),
          rotation: 0,
          scale: 1,
          materialId: d.materialId,
          colorId: d.colorId,
          dimensions: d.dims,
          price: d.price,
        }
        set({ items: [...get().items, item], selectedId: item.id })
      },

      selectItem: (id) => set({ selectedId: id }),

      updateItem: (id, patch) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        }),

      moveItem: (id, position) => {
        const clamped = clampToRoom(position, get().roomSize)
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, position: clamped } : i)),
        })
      },

      rotateItem: (id, rotation) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, rotation } : i)),
        }),

      removeItem: (id) =>
        set({
          items: get().items.filter((i) => i.id !== id),
          selectedId: get().selectedId === id ? null : get().selectedId,
        }),

      duplicateItem: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (!item) return
        const copy: RoomItem = {
          ...item,
          id: uid(),
          position: clampToRoom([item.position[0] + 0.4, 0, item.position[2] + 0.4], get().roomSize),
        }
        set({ items: [...get().items, copy], selectedId: copy.id })
      },

      setMaterial: (id, materialId) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, materialId } : i)) }),

      setColor: (id, colorId) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, colorId } : i)) }),

      setHandle: (id, handleId) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, handleId } : i)) }),

      setCameraPreset: (preset) => set({ cameraPreset: preset }),
      setShowGrid: (show) => set({ showGrid: show }),

      resetRoom: () => {
        const preset = roomPresets.find((r) => r.id === get().roomId) ?? emptyStudio
        get().loadPreset(preset.id)
      },

      roomTotal: () => get().items.reduce((sum, i) => sum + i.price, 0),
    }),
    {
      name: 'forma-room',
      partialize: (s) => ({
        roomId: s.roomId,
        roomSize: s.roomSize,
        items: s.items,
      }),
    },
  ),
)
