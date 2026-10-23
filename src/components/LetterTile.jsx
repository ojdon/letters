import { useDraggable } from '@dnd-kit/core'

const TILE_CLASSES =
  'grid size-[clamp(3.75rem,19vw,5rem)] place-items-center rounded-[1.35rem] border-2 border-b-[6px] border-[#e8d9c9] border-b-[#d9c4ae] bg-white tile-shadow'

const TILE_TEXT = 'text-[clamp(2.25rem,10vw,3.25rem)] font-extrabold leading-none text-[var(--accent-deep)]'

export function TileFace({ letter, className = '' }) {
  return (
    <span className={`${TILE_CLASSES} ${className}`}>
      <span className={TILE_TEXT}>{letter}</span>
    </span>
  )
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
      <span className={TILE_TEXT}>{tile.letter}</span>
    </button>
  )
}
