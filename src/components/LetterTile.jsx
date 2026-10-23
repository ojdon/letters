import { useDraggable } from '@dnd-kit/core'

const TILE_CLASSES =
  'grid size-[clamp(3.25rem,14vw,4.5rem)] place-items-center rounded-2xl border-2 border-b-[5px] border-[#e8d9c9] border-b-[#d9c4ae] bg-white text-[clamp(1.6rem,6.5vw,2.4rem)] font-extrabold leading-none text-[var(--accent-deep)] tile-shadow'

export function TileFace({ letter, className = '' }) {
  return <span className={`${TILE_CLASSES} ${className}`}>{letter}</span>
}

export default function LetterTile({ tile, onTap, ignoreClickRef, disabled }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tile.id,
    data: { tile, kind: 'bank' },
    disabled,
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={() => {
        if (!ignoreClickRef.current) onTap(tile)
      }}
      aria-label={`Litera ${tile.letter}`}
      className={`${TILE_CLASSES} letter-tile focus-ring transition-opacity ${
        isDragging ? 'opacity-25' : 'opacity-100'
      }`}
    >
      {tile.letter}
    </button>
  )
}
