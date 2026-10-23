import { useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import BigButton from './BigButton'
import Icon from './Icon'
import LetterSlot from './LetterSlot'
import LetterTile, { TileFace } from './LetterTile'
import SpeakableText from './SpeakableText'

function slotSizeFor(length) {
  if (length >= 8) return 'clamp(28px, 8.4vw, 50px)'
  if (length >= 6) return 'clamp(31px, 9vw, 58px)'
  if (length >= 5) return 'clamp(38px, 10.5vw, 68px)'
  return 'clamp(48px, 12.5vw, 76px)'
}

export default function SpellingBoard({
  round,
  name,
  feedback,
  milestone,
  onTapTile,
  onDropTile,
  onRemoveSlot,
  onHint,
  onNext,
  onSpeakSentence,
}) {
  const [activeTile, setActiveTile] = useState(null)
  const ignoreClickRef = useRef(false)
  const clickTimerRef = useRef(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  const isPlaying = round.phase === 'playing'
  const slotSize = slotSizeFor(round.word.word.length)

  function finishDrag() {
    setActiveTile(null)
    window.clearTimeout(clickTimerRef.current)
    clickTimerRef.current = window.setTimeout(() => {
      ignoreClickRef.current = false
    }, 180)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={(event) => {
        const tile = event.active.data.current?.tile
        if (!tile) return
        ignoreClickRef.current = true
        setActiveTile(tile)
      }}
      onDragEnd={(event) => {
        const tile = event.active.data.current?.tile
        const index = event.over?.data.current?.index
        if (tile && typeof index === 'number') onDropTile(tile.id, index)
        finishDrag()
      }}
      onDragCancel={finishDrag}
    >
      <section className="rounded-[2rem] border border-white bg-white/90 p-4 card-shadow sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl font-extrabold leading-none sm:text-2xl">Ułóż słowo</h2>
          <button
            type="button"
            onClick={onHint}
            disabled={!isPlaying}
            aria-label="Podpowiedź"
            className="focus-ring accent-soft-bg accent-text flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-extrabold transition-transform active:scale-95 disabled:opacity-35"
          >
            <Icon name="lightbulb" className="size-5" />
            <span className="hidden min-[360px]:inline">Podpowiedź</span>
          </button>
        </div>
        <p className="mt-1 text-sm font-semibold text-[var(--color-muted)]">
          <SpeakableText
            text="Dotknij lub przeciągnij literkę."
            onSpeak={onSpeakSentence}
            className="text-sm font-semibold text-[var(--color-muted)]"
          >
            Dotknij lub przeciągnij literkę.
          </SpeakableText>
        </p>

        <div
          key={`${round.roundKey}-${round.attempts}`}
          className={`mt-4 flex flex-wrap items-center justify-center gap-1 sm:mt-5 sm:gap-2 ${
            round.phase === 'wrong' ? 'animate-wiggle' : ''
          }`}
        >
          {round.slots.map((tile, index) => (
            <LetterSlot
              key={`slot-${index}`}
              index={index}
              tile={tile}
              size={slotSize}
              compact={round.word.word.length >= 6}
              disabled={!isPlaying}
              onRemove={onRemoveSlot}
            />
          ))}
        </div>

        <div className="min-h-8 pt-2 text-center text-sm font-extrabold text-[var(--color-muted)]" aria-live="polite">
          {feedback && (
            <SpeakableText
              text={feedback}
              onSpeak={onSpeakSentence}
              className="text-sm font-extrabold text-[var(--color-muted)]"
            >
              {feedback}
            </SpeakableText>
          )}
        </div>

        {round.phase === 'correct' && (
          <div className="animate-pop accent-soft-bg mt-1 flex flex-col items-center gap-3 rounded-[1.5rem] px-4 py-4">
            <p className="text-3xl font-extrabold tracking-tight text-[var(--accent-deep)] sm:text-4xl">
              {round.word.word}
            </p>
            <SpeakableText
              text={milestone ? 'Pięć gwiazdek! Pięknie!' : `Brawo, ${name}!`}
              onSpeak={onSpeakSentence}
              className="text-base font-extrabold"
            >
              {milestone ? 'Pięć gwiazdek! Pięknie!' : `Brawo, ${name}!`}
            </SpeakableText>
            <BigButton size="lg" onClick={onNext} className="w-full max-w-64">
              Dalej
              <Icon name="arrow-right" className="size-5" />
            </BigButton>
          </div>
        )}

        {round.phase === 'playing' && (
          <>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {round.bank.map((tile) => (
                <LetterTile
                  key={tile.id}
                  tile={tile}
                  onTap={onTapTile}
                  ignoreClickRef={ignoreClickRef}
                  disabled={!isPlaying}
                />
              ))}
            </div>
            <p className="mt-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#b3a294]">
              Przesuń albo dotknij
            </p>
          </>
        )}
      </section>

      <DragOverlay dropAnimation={null} zIndex={50}>
        {activeTile ? (
          <TileFace
            letter={activeTile.letter}
            className="rotate-2 scale-110 border-[var(--accent)] shadow-2xl"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
