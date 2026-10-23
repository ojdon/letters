import { COLORS, DEFAULT_COLOR_ID } from '../data/colors'
import { WORDS } from '../data/words'

const STORAGE_KEY = 'literki:profile:v1'
const DIFFICULTIES = ['auto', 'easy', 'medium', 'hard']

function clampAge(value) {
  const age = Number(value)
  if (!Number.isFinite(age)) return 4
  return Math.min(8, Math.max(2, Math.round(age)))
}

function sanitizeName(value) {
  if (typeof value !== 'string') return ''
  return value.replace(/\s+/g, ' ').trim().slice(0, 20)
}

function sanitizeSolved(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const solved = {}
  for (const word of WORDS) {
    const count = Number(value[word.id])
    if (Number.isFinite(count) && count > 0) {
      solved[word.id] = Math.min(9999, Math.floor(count))
    }
  }
  return solved
}

export function createProfile(values = {}) {
  return {
    version: 1,
    name: sanitizeName(values.name),
    age: clampAge(values.age ?? 4),
    colorId: COLORS.some((color) => color.id === values.colorId) ? values.colorId : DEFAULT_COLOR_ID,
    stars: 0,
    solved: {},
    settings: {
      sound: true,
      difficulty: 'auto',
    },
  }
}

export function loadProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const name = sanitizeName(parsed?.name)
    if (!name) return null

    const stars = Number(parsed?.stars)
    const difficulty = DIFFICULTIES.includes(parsed?.settings?.difficulty)
      ? parsed.settings.difficulty
      : 'auto'

    return {
      version: 1,
      name,
      age: clampAge(parsed?.age),
      colorId: COLORS.some((color) => color.id === parsed?.colorId)
        ? parsed.colorId
        : DEFAULT_COLOR_ID,
      stars: Number.isFinite(stars) && stars > 0 ? Math.min(999999, Math.floor(stars)) : 0,
      solved: sanitizeSolved(parsed?.solved),
      settings: {
        sound: parsed?.settings?.sound !== false,
        difficulty,
      },
    }
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Private browsing or a full disk should not break the game.
  }
}
