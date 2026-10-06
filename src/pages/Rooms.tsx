import { Link } from 'react-router-dom'
import { roomPresets, inspirationRooms } from '@/data/rooms'
import { Button } from '@/components/ui/Button'
import { useRoomStore } from '@/store/roomStore'

export function Rooms() {
  const loadPreset = useRoomStore((s) => s.loadPreset)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-xl mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Rooms</p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">Room ideas</h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          Start from a curated layout or an empty studio. Open any room in the 3D planner to rearrange furniture.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomPresets.map((room, i) => (
          <article key={room.id} className="group">
            <div
              className="aspect-[4/3] mb-4 transition-transform duration-500 group-hover:scale-[1.01]"
              style={{
                background: `linear-gradient(145deg, ${['#e8dfd0', '#ddd6cc', '#d4cbb8'][i % 3]}, #c4a57455)`,
              }}
            />
            <h2 className="font-display text-xl text-ink">{room.name}</h2>
            <p className="text-sm text-stone-600 mt-1 mb-4">{room.description}</p>
            <p className="text-xs text-stone-400 mb-4">
              {room.size.width}m × {room.size.depth}m · {room.items.length} starter piece{room.items.length === 1 ? '' : 's'}
            </p>
            <Link
              to="/configurator"
              onClick={() => loadPreset(room.id)}
            >
              <Button variant="outline" size="sm">
                Open in planner
              </Button>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

export function Inspiration() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-xl mb-12">
        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500 mb-2">Inspiration</p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">Spaces worth lingering in</h1>
        <p className="mt-3 text-stone-600 leading-relaxed">
          Mood boards from the FORMA collection — tap through to shop or plan in 3D.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
        {inspirationRooms.map((room) => (
          <Link key={room.id} to="/rooms" className="group block">
            <div
              className="aspect-[16/10] mb-4 transition-transform duration-500 group-hover:scale-[1.01]"
              style={{ backgroundColor: room.tone }}
            />
            <p className="text-[11px] uppercase tracking-wider text-stone-500">{room.category}</p>
            <h2 className="font-display text-2xl text-ink mt-1 group-hover:text-walnut transition-colors">{room.title}</h2>
            <p className="text-sm text-stone-600 mt-1">{room.description}</p>
          </Link>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link to="/configurator">
          <Button size="lg">Try the 3D planner</Button>
        </Link>
      </div>
    </div>
  )
}
