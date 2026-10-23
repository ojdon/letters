import { useCallback, useEffect, useRef, useState } from 'react'
import { getColor } from '../data/colors'
import { createRound, difficultyForAge, isComplete, isCorrect, pickWord, resolveDifficulty, shuffle } from '../lib/game'
import { useSpeech } from '../hooks/useSpeech'
import Confetti from './Confetti'
import Icon from './Icon'
import ParentMenu from './ParentMenu'
import PictureCard from './PictureCard'
import SpellingBoard from './SpellingBoard'

export default function GameScreen({
  profile,
  onRecordSolved,
  onUpdateSettings,
  onEditProfile,
  onResetProgress,
}) {
  const color = getColor(profile.colorId)
  const tier = resolveDifficulty(profile.settings.difficulty, profile.age)
  const autoTier = difficultyForAge(profile.age)
  const { speak, chime, stop } = useSpeech(profile.settings.sound)

  const [round, setRound] = useState(() => createRound(pickWord(tier, [], profile.solved), tier))
  const [feedback, setFeedback] = useState('')
  const [milestone, setMilestone] = useState(false)
  const [burst, setBurst] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const recentRef = useRef([])
  const solvedRoundRef = useRef(null)
  const wrongRoundRef = useRef(null)
  const tierRef = useRef(tier)

  const nextRound = useCallback(
    (fromWordId) => {
      if (fromWordId) {
        recentRef.current = [...recentRef.current, fromWordId].slice(-4)
      }
      const nextWord = pickWord(tier, recentRef.current, profile.solved)
      setRound(createRound(nextWord, tier))
      setFeedback('')
      setMilestone(false)
    },
    [tier, profile.solved],
  )

  const latest = useRef({})

  useEffect(() => {
    latest.current = { speak, chime, nextRound, onRecordSolved, stars: profile.stars }
  }, [speak, chime, nextRound, onRecordSolved, profile.stars])

  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  const placeTile = useCallback((tileId, targetIndex) => {
    setRound((previous) => {
      if (previous.phase !== 'playing') return previous
      const tile = previous.bank.find((item) => item.id === tileId)
      if (!tile) return previous

      const index =
        typeof targetIndex === 'number'
          ? targetIndex
          : previous.slots.findIndex((item) => item === null)

      if (index < 0 || index >= previous.slots.length || previous.slots[index]) {
        return previous
      }

      const slots = [...previous.slots]
      slots[index] = tile
      const bank = previous.bank.filter((item) => item.id !== tile.id)
      const complete = isComplete(slots)
      const correct = complete && isCorrect(slots, previous.word)

      return {
        ...previous,
        bank,
        slots,
        phase: complete ? (correct ? 'correct' : 'wrong') : 'playing',
        attempts: complete && !correct ? previous.attempts + 1 : previous.attempts,
      }
    })
  }, [])

  const removeFromSlot = useCallback((index) => {
    setRound((previous) => {
      if (previous.phase !== 'playing') return previous
      const tile = previous.slots[index]
      if (!tile) return previous
      const slots = [...previous.slots]
      slots[index] = null
      return {
        ...previous,
        slots,
        bank: [...previous.bank, tile],
      }
    })
  }, [])

  function handleTapTile(tile) {
    placeTile(tile.id)
    chime('pop')
    speak(tile.letter, { rate: 0.9 })
  }

  function handleDropTile(tileId, index) {
    if (round.slots[index]) return
    const tile = round.bank.find((item) => item.id === tileId)
    if (!tile) return
    placeTile(tileId, index)
    chime('pop')
    speak(tile.letter, { rate: 0.9 })
  }

  function handleHint() {
    if (round.phase !== 'playing') return
    for (let index = 0; index < round.slots.length; index += 1) {
      if (round.slots[index]) continue
      const nextLetter = round.word.word[index]
      const tile = round.bank.find((item) => item.letter === nextLetter)
      if (!tile) continue
      placeTile(tile.id, index)
      chime('hint')
      speak(nextLetter, { rate: 0.8 })
      return
    }
  }

  function handleRemoveSlot(index) {
    if (!round.slots[index]) return
    chime('remove')
    removeFromSlot(index)
  }

  function handleListen() {
    speak(round.word.word, { rate: 0.78 })
  }

  function handleSpeakSentence(sentence) {
    speak(sentence, { rate: 0.8 })
  }

  useEffect(() => {
    if (tierRef.current === tier) return
    tierRef.current = tier
    recentRef.current = []
    solvedRoundRef.current = null
    wrongRoundRef.current = null
    setRound(createRound(pickWord(tier, [], profile.solved), tier))
    setFeedback('')
    setMilestone(false)
  }, [tier, profile.solved])

  useEffect(() => {
    if (round.phase !== 'correct') return undefined
    if (solvedRoundRef.current === round.roundKey) return undefined
    solvedRoundRef.current = round.roundKey

    const { onRecordSolved: recordSolved, chime: playChime, speak: say, stars } = latest.current
    const isMilestone = (stars + 1) % 5 === 0
    recordSolved(round.word.id)
    playChime(isMilestone ? 'milestone' : 'correct')
    setMilestone(isMilestone)
    setBurst((value) => value + 1)
    setFeedback('Następne słowo za chwilę…')

    const praise = isMilestone
      ? `Pięć gwiazdek! Brawo, ${profile.name}!`
      : `Brawo, ${profile.name}!`
    const timer = window.setTimeout(() => {
      say(`${praise} ${round.word.word}!`, { rate: 0.78 })
    }, 280)
    return () => window.clearTimeout(timer)
  }, [round.phase, round.roundKey, round.word, profile.name, settingsOpen])

  useEffect(() => {
    if (round.phase !== 'correct' || settingsOpen) return undefined
    const timer = window.setTimeout(() => {
      latest.current.nextRound(round.word.id)
    }, 6000)
    return () => window.clearTimeout(timer)
  }, [round.phase, round.roundKey, round.word.id, settingsOpen])

  useEffect(() => {
    if (round.phase !== 'wrong') return undefined

    const attemptKey = `${round.roundKey}-${round.attempts}`
    if (wrongRoundRef.current !== attemptKey) {
      wrongRoundRef.current = attemptKey
      latest.current.chime('wrong')
      setFeedback(
        round.attempts >= 2 ? 'Prawie! Użyj podpowiedzi.' : 'Prawie! Spróbuj jeszcze raz.',
      )
    }

    const timer = window.setTimeout(() => {
      setRound((previous) => {
        if (previous.roundKey !== round.roundKey || previous.phase !== 'wrong') return previous
        const allTiles = [...previous.bank, ...previous.slots.filter(Boolean)]
        return {
          ...previous,
          phase: 'playing',
          slots: Array.from({ length: previous.slots.length }, () => null),
          bank: shuffle(allTiles),
        }
      })
      setFeedback('')
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [round.phase, round.roundKey, round.attempts])

  useEffect(() => {
    if (settingsOpen) return undefined
    const timer = window.setTimeout(() => {
      latest.current.speak(round.word.word, { rate: 0.78 })
    }, 500)
    return () => window.clearTimeout(timer)
  }, [round.roundKey, round.word, settingsOpen])

  useEffect(() => {
    function handleKeyDown(event) {
      if (settingsOpen || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'Backspace') {
        const index = round.slots.findLastIndex(Boolean)
        if (index >= 0) {
          event.preventDefault()
          removeFromSlot(index)
        }
        return
      }
      if (event.key.length === 1) {
        const letter = event.key.toLocaleLowerCase('pl-PL')
        const tile = round.bank.find((item) => item.letter === letter)
        if (tile) {
          placeTile(tile.id)
          speak(letter, { rate: 0.9 })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [round, settingsOpen, placeTile, removeFromSlot, speak])

  useEffect(() => {
    return () => stop()
  }, [stop])

  function toggleSound() {
    if (profile.settings.sound) stop()
    onUpdateSettings({ sound: !profile.settings.sound })
  }

  return (
    <div className="app-backdrop relative min-h-dvh overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-24 top-24 size-64 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-72 rounded-full bg-white/40 blur-3xl" />
      </div>

      <header className="game-header relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="accent-bg grid size-10 shrink-0 place-items-center rounded-2xl text-xl font-extrabold tile-shadow">
            L
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Literki
            </p>
            <p className="truncate text-lg font-extrabold leading-tight sm:text-xl">
              Cześć, {profile.name}!
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            className="flex min-h-11 items-center gap-1.5 rounded-2xl border-2 border-[#f3e4cf] bg-white px-2.5 font-extrabold text-[#a97608]"
            aria-label={`Gwiazdki: ${profile.stars}`}
          >
            <Icon name="star" className="size-5 text-[#f0b429]" />
            <span key={profile.stars} className="animate-star min-w-4 text-center tabular-nums">
              {profile.stars}
            </span>
          </div>

          <button
            type="button"
            onClick={toggleSound}
            aria-label={profile.settings.sound ? 'Wyłącz dźwięk' : 'Włącz dźwięk'}
            aria-pressed={profile.settings.sound}
            className="focus-ring hidden size-11 place-items-center rounded-2xl border-2 border-[#f3e4cf] bg-white text-[var(--color-ink)] min-[380px]:grid"
          >
            <Icon name={profile.settings.sound ? 'sound-on' : 'sound-off'} className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              stop()
              setSettingsOpen(true)
            }}
            aria-label="Ustawienia dla rodziców"
            className="focus-ring grid size-11 place-items-center rounded-2xl border-2 border-[#f3e4cf] bg-white text-[var(--color-ink)]"
          >
            <Icon name="settings" className="size-5" />
          </button>
        </div>
      </header>

      <main className="game-main relative z-10 mx-auto grid w-full max-w-5xl gap-3 px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:gap-4 sm:px-5 sm:pt-4 md:grid-cols-[0.92fr_1.08fr] md:items-start lg:gap-5">
        <PictureCard
          word={round.word}
          onListen={handleListen}
          onSpeakSentence={handleSpeakSentence}
        />
        <SpellingBoard
          round={round}
          name={profile.name}
          feedback={feedback}
          milestone={milestone}
          onTapTile={handleTapTile}
          onDropTile={handleDropTile}
          onRemoveSlot={handleRemoveSlot}
          onHint={handleHint}
          onNext={() => nextRound(round.word.id)}
          onSpeakSentence={handleSpeakSentence}
        />
      </main>

      {round.phase === 'correct' && <Confetti burst={burst} />}

      <ParentMenu
        open={settingsOpen}
        profile={profile}
        color={color}
        autoTier={autoTier}
        onClose={closeSettings}
        onUpdateSettings={onUpdateSettings}
        onEditProfile={() => {
          setSettingsOpen(false)
          onEditProfile()
        }}
        onResetProgress={onResetProgress}
      />
    </div>
  )
}
