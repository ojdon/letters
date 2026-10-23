import { useEffect, useRef, useState } from 'react'
import { TIER_LABELS } from '../data/words'
import { ageWord } from '../lib/game'
import BigButton from './BigButton'
import Icon from './Icon'

const DIFFICULTY_OPTIONS = [
  { value: 'auto', label: 'Automatyczny' },
  { value: 'easy', label: 'Łatwy' },
  { value: 'medium', label: 'Średni' },
  { value: 'hard', label: 'Trudny' },
]

function solvedWordsLabel(count) {
  if (count === 1) return '1 poznane słowo'
  const last = count % 10
  const lastTwo = count % 100
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `${count} poznane słowa`
  }
  return `${count} poznanych słów`
}

export default function ParentMenu({ open, profile, ...props }) {
  if (!open || !profile) return null
  return <ParentMenuDialog profile={profile} {...props} />
}

function ParentMenuDialog({
  profile,
  color,
  autoTier,
  onClose,
  onUpdateSettings,
  onEditProfile,
  onResetProgress,
}) {
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const closeRef = useRef(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [onClose])

  useEffect(() => {
    if (!resetDone) return
    const timer = window.setTimeout(() => setResetDone(false), 2200)
    return () => window.clearTimeout(timer)
  }, [resetDone])

  const soundOn = profile.settings.sound
  const difficulty = profile.settings.difficulty

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#3b2e26]/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onTouchStart={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-title"
        className="animate-slide-up max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[#fffdf9] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-[2rem] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Ustawienia
            </p>
            <h2 id="parent-title" className="text-2xl font-extrabold">
              Dla rodziców
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Zamknij ustawienia"
            className="focus-ring grid size-11 shrink-0 place-items-center rounded-xl bg-[#f5ece5] text-[var(--color-ink)]"
          >
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 tile-shadow">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-full border-4 border-white text-lg font-extrabold text-white shadow-inner"
            style={{ backgroundColor: color.accent }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-extrabold leading-tight">{profile.name}</p>
            <p className="text-sm font-semibold text-[var(--color-muted)]">
              {profile.age} {ageWord(profile.age)} · {color.label}
            </p>
          </div>
          <button
            type="button"
            onClick={onEditProfile}
            className="focus-ring accent-soft-bg accent-text flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-extrabold"
          >
            <Icon name="pencil" className="size-4" />
            Zmień
          </button>
        </div>

        <section className="mt-4">
          <h3 className="text-base font-extrabold">Trudność</h3>
          <p className="text-sm font-semibold text-[var(--color-muted)]">
            Automatyczny wybiera poziom według wieku: {TIER_LABELS[autoTier]}.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {DIFFICULTY_OPTIONS.map((option) => {
              const selected = difficulty === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdateSettings({ difficulty: option.value })}
                  aria-pressed={selected}
                  className={`focus-ring min-h-12 rounded-xl border-2 px-2 text-sm font-extrabold transition-transform active:scale-[0.97] ${
                    selected
                      ? 'accent-bg border-transparent tile-shadow'
                      : 'border-[#eadbcd] bg-white text-[var(--color-ink)]'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border-2 border-[#f0e5da] bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-extrabold">Dźwięk i mowa</h3>
              <p className="text-sm font-semibold text-[var(--color-muted)]">
                Czytanie słów i literek oraz efekty dźwiękowe.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={soundOn}
              aria-label="Dźwięk i mowa"
              onClick={() => onUpdateSettings({ sound: !soundOn })}
              className={`focus-ring relative h-9 w-16 shrink-0 rounded-full transition-colors ${
                soundOn ? 'accent-bg' : 'bg-[#ded0c3]'
              }`}
            >
              <span
                className={`absolute top-1 size-7 rounded-full bg-white shadow-md transition-all ${
                  soundOn ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-[#9b897b]">
            Głos zależy od syntezatora w urządzeniu. Najlepiej działa z zainstalowanym polskim
            głosem.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-base font-extrabold">Postępy</h3>
          <div className="mt-2 flex items-center gap-4 rounded-2xl bg-[#fbf3e8] px-4 py-3">
            <span className="accent-text flex items-center gap-1.5 text-2xl font-extrabold">
              <Icon name="star" className="size-6" />
              {profile.stars}
            </span>
            <span className="text-sm font-semibold text-[var(--color-muted)]">
              {solvedWordsLabel(Object.keys(profile.solved).length)}
            </span>
          </div>

          {resetDone ? (
            <p className="mt-3 text-sm font-extrabold text-[#277a3e]">Postępy zostały wyczyszczone.</p>
          ) : confirmReset ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold">Na pewno wyczyścić gwiazdki?</span>
              <BigButton
                variant="danger"
                size="sm"
                onClick={() => {
                  onResetProgress()
                  setConfirmReset(false)
                  setResetDone(true)
                }}
              >
                Tak, wyczyść
              </BigButton>
              <BigButton variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>
                Nie
              </BigButton>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="focus-ring mt-3 flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-extrabold text-[#b52f2f]"
            >
              <Icon name="refresh" className="size-4" />
              Wyczyść gwiazdki i postępy
            </button>
          )}
        </section>

        <footer className="mt-4 border-t-2 border-[#f3e9de] pt-3 text-xs font-semibold leading-relaxed text-[#a39183]">
          <p>
            Obrazki: Twemoji, licencja{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2"
            >
              CC BY 4.0
            </a>
            . Dziękujemy twórcom Twemoji.
          </p>
        </footer>

        <BigButton size="lg" className="mt-4 w-full" onClick={onClose}>
          Gotowe
        </BigButton>
      </div>
    </div>
  )
}
