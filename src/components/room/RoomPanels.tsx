import { products } from '@/data/products'
import { roomPresets } from '@/data/rooms'
import { colors, materials } from '@/data/materials'
import { useRoomStore } from '@/store/roomStore'
import { formatINR } from '@/utils/pricing'
import type { CameraPreset, RoomFurnitureType } from '@/types/configurator'
import type { ColorId, MaterialId } from '@/types/product'
import {
  Copy,
  RotateCw,
  Trash2,
  Grid3X3,
  RotateCcw,
  Share2,
  Save,
  Sofa,
  Table2,
  Armchair,
  Lamp,
  Flower2,
  Box,
} from 'lucide-react'
import { useState } from 'react'

const quickAdd: { type: RoomFurnitureType; label: string; icon: typeof Sofa }[] = [
  { type: 'sofa', label: 'Sofa', icon: Sofa },
  { type: 'table', label: 'Table', icon: Table2 },
  { type: 'chair', label: 'Chair', icon: Armchair },
  { type: 'tv-unit', label: 'TV Unit', icon: Box },
  { type: 'cabinet', label: 'Cabinet', icon: Box },
  { type: 'lamp', label: 'Lamp', icon: Lamp },
  { type: 'plant', label: 'Plant', icon: Flower2 },
  { type: 'rug', label: 'Rug', icon: Grid3X3 },
]

const cameraPresets: { id: CameraPreset; label: string }[] = [
  { id: 'perspective', label: 'Perspective' },
  { id: 'front', label: 'Front' },
  { id: 'top', label: 'Top' },
  { id: 'overview', label: 'Overview' },
]

export function RoomToolbar() {
  const resetRoom = useRoomStore((s) => s.resetRoom)
  const showGrid = useRoomStore((s) => s.showGrid)
  const setShowGrid = useRoomStore((s) => s.setShowGrid)
  const cameraPreset = useRoomStore((s) => s.cameraPreset)
  const setCameraPreset = useRoomStore((s) => s.setCameraPreset)
  const roomTotal = useRoomStore((s) => s.roomTotal())
  const [saved, setSaved] = useState(false)
  const [shared, setShared] = useState(false)

  return (
    <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
      <div className="flex flex-wrap gap-1.5 pointer-events-auto">
        {cameraPresets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setCameraPreset(p.id)}
            className={[
              'px-3 py-1.5 text-xs rounded-sm bg-cream/95 shadow-sm transition-colors',
              cameraPreset === p.id ? 'text-ink font-medium ring-1 ring-ink' : 'text-stone-600 hover:text-ink',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 pointer-events-auto">
        <span className="hidden sm:inline text-xs bg-cream/95 px-2 py-1.5 rounded-sm shadow-sm text-stone-600">
          Est. {formatINR(roomTotal)}
        </span>
        <button
          type="button"
          title="Toggle grid"
          onClick={() => setShowGrid(!showGrid)}
          className={`p-2 bg-cream/95 rounded-sm shadow-sm ${showGrid ? 'text-ink' : 'text-stone-400'}`}
        >
          <Grid3X3 size={16} />
        </button>
        <button
          type="button"
          title="Save configuration"
          onClick={() => {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
          className="p-2 bg-cream/95 rounded-sm shadow-sm text-stone-700 hover:text-ink"
        >
          <Save size={16} />
        </button>
        <button
          type="button"
          title="Share (copies link)"
          onClick={() => {
            void navigator.clipboard?.writeText(window.location.href)
            setShared(true)
            setTimeout(() => setShared(false), 2000)
          }}
          className="p-2 bg-cream/95 rounded-sm shadow-sm text-stone-700 hover:text-ink"
        >
          <Share2 size={16} />
        </button>
        <button
          type="button"
          title="Reset room"
          onClick={() => resetRoom()}
          className="p-2 bg-cream/95 rounded-sm shadow-sm text-stone-700 hover:text-ink"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      {(saved || shared) && (
        <div className="absolute top-12 right-0 bg-ink text-cream text-xs px-3 py-2 rounded-sm shadow pointer-events-none">
          {saved ? 'Configuration saved locally' : 'Link copied — share concept ready'}
        </div>
      )}
    </div>
  )
}

export function RoomSidePanel() {
  const [tab, setTab] = useState<'furniture' | 'products' | 'rooms'>('furniture')
  const addFurnitureType = useRoomStore((s) => s.addFurnitureType)
  const addProduct = useRoomStore((s) => s.addProduct)
  const loadPreset = useRoomStore((s) => s.loadPreset)
  const roomId = useRoomStore((s) => s.roomId)

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-cream border-r border-stone-200 flex flex-col max-h-[40vh] lg:max-h-none overflow-hidden">
      <div className="flex border-b border-stone-200">
        {(['furniture', 'products', 'rooms'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={[
              'flex-1 py-3 text-xs uppercase tracking-wider transition-colors',
              tab === t ? 'text-ink border-b-2 border-ink font-medium' : 'text-stone-500 hover:text-ink',
            ].join(' ')}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tab === 'furniture' &&
          quickAdd.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => addFurnitureType(type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm hover:bg-sand text-left text-sm transition-colors"
            >
              <Icon size={16} className="text-stone-500" />
              <span>Add {label}</span>
            </button>
          ))}
        {tab === 'products' &&
          products.filter((p) => p.is3DEnabled).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => addProduct(p.id)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-sm hover:bg-sand text-left text-sm transition-colors"
            >
              <span className="truncate">{p.name}</span>
              <span className="text-xs text-stone-500 shrink-0">{formatINR(p.price)}</span>
            </button>
          ))}
        {tab === 'rooms' &&
          roomPresets.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => loadPreset(r.id)}
              className={[
                'w-full text-left px-3 py-3 rounded-sm transition-colors',
                roomId === r.id ? 'bg-sand ring-1 ring-stone-300' : 'hover:bg-stone-100',
              ].join(' ')}
            >
              <p className="text-sm font-medium text-ink">{r.name}</p>
              <p className="text-xs text-stone-500 mt-0.5">{r.description}</p>
            </button>
          ))}
      </div>
    </aside>
  )
}

export function RoomPropertiesPanel() {
  const selectedId = useRoomStore((s) => s.selectedId)
  const items = useRoomStore((s) => s.items)
  const rotateItem = useRoomStore((s) => s.rotateItem)
  const removeItem = useRoomStore((s) => s.removeItem)
  const duplicateItem = useRoomStore((s) => s.duplicateItem)
  const setMaterial = useRoomStore((s) => s.setMaterial)
  const setColor = useRoomStore((s) => s.setColor)

  const item = items.find((i) => i.id === selectedId)

  if (!item) {
    return (
      <aside className="hidden lg:flex w-64 shrink-0 bg-cream border-l border-stone-200 p-5 items-start">
        <p className="text-sm text-stone-500 leading-relaxed">
          Select furniture in the room to edit materials, colour, rotation and more.
        </p>
      </aside>
    )
  }

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-cream border-t lg:border-t-0 lg:border-l border-stone-200 p-4 space-y-4 max-h-[35vh] lg:max-h-none overflow-y-auto">
      <div>
        <p className="text-[11px] uppercase tracking-wider text-stone-500">Selected</p>
        <h3 className="font-display text-lg text-ink mt-0.5">{item.name}</h3>
        <p className="text-sm text-stone-600 mt-1">{formatINR(item.price)}</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => rotateItem(item.id, item.rotation + Math.PI / 4)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-stone-300 rounded-sm hover:bg-stone-50"
        >
          <RotateCw size={14} /> Rotate
        </button>
        <button
          type="button"
          onClick={() => duplicateItem(item.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs border border-stone-300 rounded-sm hover:bg-stone-50"
        >
          <Copy size={14} /> Duplicate
        </button>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="p-2 border border-stone-300 rounded-sm hover:bg-red-50 hover:border-red-300 text-red-700"
          aria-label="Remove"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div>
        <p className="text-xs font-medium text-ink mb-2">Material</p>
        <div className="flex flex-wrap gap-1.5">
          {materials.slice(0, 5).map((m) => (
            <button
              key={m.id}
              type="button"
              title={m.name}
              onClick={() => setMaterial(item.id, m.id as MaterialId)}
              className={`w-7 h-7 rounded-sm border-2 ${item.materialId === m.id ? 'border-ink' : 'border-transparent ring-1 ring-stone-300'}`}
              style={{ backgroundColor: m.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-ink mb-2">Colour</p>
        <div className="flex flex-wrap gap-1.5">
          {colors.slice(0, 5).map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.name}
              onClick={() => setColor(item.id, c.id as ColorId)}
              className={`w-7 h-7 rounded-sm border-2 ${item.colorId === c.id ? 'border-ink' : 'border-transparent ring-1 ring-stone-300'}`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <p className="text-[11px] text-stone-400">
        Drag to move · Stay within room bounds
      </p>
    </aside>
  )
}
