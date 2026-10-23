import BigButton from './BigButton'
import Icon from './Icon'
import SpeakableText from './SpeakableText'
import Twemoji from './Twemoji'

export default function PictureCard({ word, onListen, onSpeakSentence }) {
  return (
    <section aria-label="Obrazek do odgadnięcia" className="rounded-[2rem] border border-white bg-white/85 p-3 card-shadow sm:p-4">
      <div className="relative overflow-hidden rounded-[1.5rem] bg-[var(--accent-soft)]">
        <div className="accent-bg absolute -right-6 -top-6 size-16 rounded-full opacity-15" />
        <div className="accent-bg absolute -bottom-8 -left-6 size-24 rounded-full opacity-10" />
        <Icon
          name="sparkles"
          className="accent-text absolute left-4 top-4 size-6 opacity-40 sm:size-8"
        />
        <button
          type="button"
          onClick={onListen}
          aria-label="Posłuchaj słowa"
          className="picture-stage focus-ring relative z-10 flex h-40 w-full items-center justify-center rounded-[1.5rem] p-3 sm:h-56 lg:h-64"
        >
          <span
            key={word.id}
            className="picture-emoji animate-pop block h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52"
          >
            <Twemoji
              codepoint={word.codepoint}
              emoji={word.emoji}
              alt={word.word}
              className="animate-float h-full w-full drop-shadow-[0_18px_16px_rgba(59,46,38,0.16)]"
            />
          </span>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Co to jest?
          </p>
          <SpeakableText
            text="Co to jest? Posłuchaj i ułóż słowo."
            onSpeak={onSpeakSentence}
            className="max-w-full text-sm font-semibold text-[var(--color-muted)]"
          >
            Posłuchaj i ułóż słowo
          </SpeakableText>
        </div>
        <BigButton variant="primary" size="md" onClick={onListen} className="shrink-0 px-4">
          <Icon name="speaker" className="size-5" />
          <span className="hidden min-[380px]:inline">Posłuchaj</span>
        </BigButton>
      </div>
    </section>
  )
}
