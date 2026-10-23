import { useState } from 'react'
import { COLORS, getColor } from '../data/colors'
import { speakPolish } from '../lib/audio'
import { ageWord } from '../lib/game'
import BigButton from './BigButton'
import Icon from './Icon'
import SpeakableText from './SpeakableText'
import Twemoji from './Twemoji'

const AGES = [2, 3, 4, 5, 6, 7, 8]

const STEPS = [
  {
    title: 'Jak się nazywasz?',
    hint: 'Rodzicu, pomóż wpisać imię.',
    speech: 'Cześć! Jak masz na imię?',
  },
  {
    title: 'Ile masz lat?',
    hint: 'Trudność dopasuje się do wieku.',
    speech: 'Ile masz lat?',
  },
  {
    title: 'Jaki lubisz kolor?',
    hint: 'Wybierz swój ulubiony kolor.',
    speech: 'Jaki lubisz kolor?',
  },
]

export default function Onboarding({ initialProfile = null, onComplete, onCancel }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState(initialProfile?.name ?? '')
  const [age, setAge] = useState(initialProfile?.age ?? null)
  const [colorId, setColorId] = useState(initialProfile?.colorId ?? null)

  const color = getColor(colorId)
  const currentStep = STEPS[step]
  const trimmedName = name.replace(/\s+/g, ' ').trim()
  const canContinue = step === 0 ? trimmedName.length > 0 : step === 1 ? age !== null : colorId !== null

  function finish() {
    if (!trimmedName || !age || !colorId) return
    onComplete({ name: trimmedName, age, colorId })
  }

  function advance() {
    if (!canContinue) return
    if (step === 2) {
      finish()
      return
    }
    setStep((current) => current + 1)
  }

  return (
    <div
      className="app-backdrop paper-dots relative flex min-h-dvh flex-col overflow-x-clip"
      style={{
        '--accent': color.accent,
        '--accent-deep': color.deep,
        '--accent-soft': color.soft,
        '--accent-ink': color.ink,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 -top-20 size-64 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 size-72 rounded-full bg-white/50 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-xl items-center justify-between gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          <span className="accent-bg grid size-10 place-items-center rounded-2xl text-xl font-extrabold tile-shadow">
            L
          </span>
          <span className="text-xl font-extrabold tracking-tight">Literki</span>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring rounded-xl px-3 py-2 text-sm font-bold text-[var(--color-muted)]"
          >
            Anuluj
          </button>
        )}
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3">
        <div className="mb-3 flex flex-col items-center text-center">
          <div className="animate-float mb-2 grid size-20 place-items-center rounded-[1.7rem] bg-white/80 p-2 shadow-[0_12px_30px_-16px_rgba(59,46,38,0.5)]">
            <Twemoji codepoint="1f415" emoji="🐕" className="size-full" />
          </div>
          <SpeakableText
            text={currentStep.speech}
            onSpeak={(sentence) => speakPolish(sentence, { rate: 0.8 })}
            className="accent-soft-bg accent-text mb-3 max-w-xs rounded-2xl px-4 py-1.5 text-sm font-bold"
          >
            {currentStep.speech}
          </SpeakableText>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{currentStep.title}</h1>
          <p className="mt-1 text-base text-[var(--color-muted)]">{currentStep.hint}</p>
        </div>

        <div
          key={step}
          className="animate-slide-up rounded-[2rem] border border-white bg-white/85 p-4 card-shadow sm:p-6"
        >
          {step === 0 && (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                advance()
              }}
            >
              <label htmlFor="child-name" className="sr-only">
                Imię
              </label>
              <input
                id="child-name"
                value={name}
                onChange={(event) => setName(event.target.value.slice(0, 20))}
                placeholder="Twoje imię"
                autoComplete="given-name"
                autoCapitalize="words"
                enterKeyHint="done"
                spellCheck="false"
                className="focus-ring min-h-16 w-full rounded-2xl border-4 border-[var(--accent-soft)] bg-white px-4 text-center text-3xl font-bold text-[var(--color-ink)] outline-none transition-colors placeholder:text-[#c7b8ab] focus:border-[var(--accent)]"
              />
              <BigButton
                type="submit"
                size="lg"
                className="mt-5 w-full"
                disabled={!canContinue}
              >
                Dalej
                <Icon name="arrow-right" className="size-6" />
              </BigButton>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {AGES.map((option) => {
                  const selected = age === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAge(option)}
                      aria-pressed={selected}
                      className={`focus-ring flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 px-1 py-2 transition-transform active:scale-95 sm:min-h-20 ${
                        selected
                          ? 'accent-bg scale-[1.03] border-transparent tile-shadow'
                          : 'border-[var(--accent-soft)] bg-white text-[var(--color-ink)] hover:border-[var(--accent)]'
                      }`}
                    >
                      <span className="text-2xl font-extrabold leading-none sm:text-3xl">{option}</span>
                      <span className="mt-1 text-[11px] font-bold opacity-75">{ageWord(option)}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 flex gap-2">
                <BigButton
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(0)}
                >
                  <Icon name="arrow-left" className="size-5" />
                  Wstecz
                </BigButton>
                <BigButton
                  size="lg"
                  className="flex-[1.6]"
                  onClick={advance}
                  disabled={!canContinue}
                >
                  Dalej
                  <Icon name="arrow-right" className="size-5" />
                </BigButton>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {COLORS.map((option) => {
                  const selected = colorId === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setColorId(option.id)}
                      aria-pressed={selected}
                      className={`focus-ring relative flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-1 py-2 transition-transform active:scale-95 ${
                        selected ? 'scale-[1.03] bg-white tile-shadow' : 'border-transparent bg-white/70'
                      }`}
                      style={{
                        borderColor: selected ? option.accent : 'transparent',
                        backgroundColor: selected ? option.soft : undefined,
                      }}
                    >
                      <span
                        className="grid size-10 place-items-center rounded-full border-4 border-white shadow-inner sm:size-12"
                        style={{ backgroundColor: option.accent, color: option.ink }}
                      >
                        {selected && <Icon name="check" className="size-5" />}
                      </span>
                      <span className="text-[11px] font-bold leading-tight sm:text-xs">{option.label}</span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-5 flex gap-2">
                <BigButton
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onClick={() => setStep(1)}
                >
                  <Icon name="arrow-left" className="size-5" />
                  Wstecz
                </BigButton>
                <BigButton
                  size="lg"
                  className="flex-[1.6]"
                  onClick={advance}
                  disabled={!canContinue}
                >
                  Zaczynamy!
                  <Icon name="sparkles" className="size-5" />
                </BigButton>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2" aria-label={`Krok ${step + 1} z 3`}>
          {STEPS.map((item, index) => (
            <span
              key={item.title}
              className={`h-2.5 rounded-full transition-all ${
                index === step
                  ? 'accent-bg w-8'
                  : index < step
                    ? 'accent-bg w-2.5 opacity-45'
                    : 'w-2.5 bg-[#d8c9bc]'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
