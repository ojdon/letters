import { useDroppable } from '@dnd-kit/core'

export default function LetterSlot({ index, tile, size, compact, disabled, onRemove }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { kind: 'slot', index },
    disabled,
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => {
        if (tile && !disabled) onRemove(index)
      }}
      disabled={disabled}
      aria-label={tile ? `Usuń literę ${tile.letter}` : `Puste miejsce ${index + 1}`}
      data-over={isOver}
      data-filled={Boolean(tile)}
      style={{ width: size, height: size }}
      className={`drop-slot focus-ring grid shrink-0 place-items-center rounded-xl border-[3px] ${
        tile
          ? 'border-solid border-[var(--accent)] bg-[#fffdf9]'
          : 'border-dashed border-[#d8c9bc] bg-white/60'
      }`}
    >
      {tile ? (
        <span
          className={`font-extrabold leading-none text-[var(--accent-deep)] ${
            compact ? 'text-lg sm:text-3xl' : 'text-2xl sm:text-4xl'
          }`}
        >
          {tile.letter}
        </span>
      ) : (
        <span className="size-1.5 rounded-full bg-[#d8c9bc]" />
      )}
    </button>
  )
}
