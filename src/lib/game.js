import { POLISH_ALPHABET, WORDS } from '../data/words'

let roundCounter = 0
let tileCounter = 0

const DISTRACTORS_BY_TIER = {
  easy: 0,
  medium: 1,
  hard: 2,
}

export function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

export function difficultyForAge(age) {
  if (age <= 4) return 'easy'
  if (age === 5) return 'medium'
  return 'hard'
}

export function resolveDifficulty(preference, age) {
  if (preference === 'easy' || preference === 'medium' || preference === 'hard') {
    return preference
  }
  return difficultyForAge(age)
}

export function pickWord(tier, recentIds = [], solved = {}) {
  const tierWords = WORDS.filter((word) => word.tier === tier)
  let candidates = tierWords.filter((word) => !recentIds.includes(word.id))
  if (candidates.length === 0) candidates = tierWords
  if (candidates.length === 0) return WORDS[0]

  const fewestPlays = Math.min(...candidates.map((word) => solved[word.id] ?? 0))
  const leastPlayed = candidates.filter((word) => (solved[word.id] ?? 0) === fewestPlays)
  return leastPlayed[Math.floor(Math.random() * leastPlayed.length)]
}

export function createRound(word, tier) {
  roundCounter += 1
  const neededLetters = word.word.split('').map((letter) => {
    tileCounter += 1
    return { id: `tile-${tileCounter}`, letter }
  })

  const usedLetters = new Set(word.word.split(''))
  const distractorPool = shuffle(
    POLISH_ALPHABET.filter((letter) => !usedLetters.has(letter)),
  )
  const distractorCount = DISTRACTORS_BY_TIER[tier] ?? 0
  const distractors = distractorPool.slice(0, distractorCount).map((letter) => {
    tileCounter += 1
    return { id: `tile-${tileCounter}`, letter }
  })

  let bank = shuffle([...neededLetters, ...distractors])
  if (bank.length > 1 && bank.map((tile) => tile.letter).join('') === word.word) {
    bank = [...bank.slice(1), bank[0]]
  }

  return {
    roundKey: `round-${roundCounter}`,
    word,
    tier,
    bank,
    slots: Array.from({ length: word.word.length }, () => null),
    phase: 'playing',
    attempts: 0,
    hints: 0,
  }
}

export function isComplete(slots) {
  return slots.length > 0 && slots.every(Boolean)
}

export function isCorrect(slots, word) {
  return slots.map((tile) => tile?.letter ?? '').join('') === word.word
}

export function ageWord(age) {
  if (age === 1) return 'rok'
  if (age >= 2 && age <= 4) return 'lata'
  return 'lat'
}
