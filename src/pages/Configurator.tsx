import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { RoomCanvas } from '@/components/room/RoomCanvas'
import { RoomToolbar, RoomSidePanel, RoomPropertiesPanel } from '@/components/room/RoomPanels'
import { useRoomStore } from '@/store/roomStore'
import { getProductById } from '@/data/products'
import { formatINR } from '@/utils/pricing'

export function Configurator() {
  const [params] = useSearchParams()
  const productParam = params.get('product')
  const addProduct = useRoomStore((s) => s.addProduct)
  const loadPreset = useRoomStore((s) => s.loadPreset)
  const items = useRoomStore((s) => s.items)
  const roomTotal = useRoomStore((s) => s.roomTotal())

  useEffect(() => {
    // Ensure a room exists
    if (useRoomStore.getState().items.length === 0 && !productParam) {
      // leave empty studio — user can load presets
    }
  }, [productParam])

  useEffect(() => {
    if (productParam && getProductById(productParam)) {
      const exists = useRoomStore.getState().items.some((i) => i.productId === productParam)
      if (!exists) addProduct(productParam)
    }
  }, [productParam, addProduct])

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 4rem)' }}>
      <div className="shrink-0 px-4 sm:px-6 py-3 border-b border-stone-200 bg-cream flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-xl sm:text-2xl text-ink">3D Room Planner</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            {items.length} piece{items.length === 1 ? '' : 's'} · {formatINR(roomTotal)}
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => loadPreset('living-modern')}
            className="px-3 py-1.5 border border-stone-300 rounded-sm hover:bg-stone-50"
          >
            Load living room
          </button>
          <Link to="/enquiry" className="px-3 py-1.5 bg-ink text-cream rounded-sm hover:bg-stone-800">
            Enquire about room
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <RoomSidePanel />
        <div className="flex-1 relative min-h-[45vh] lg:min-h-0">
          <RoomToolbar />
          <RoomCanvas className="absolute inset-0" />
        </div>
        <RoomPropertiesPanel />
      </div>
    </div>
  )
}
