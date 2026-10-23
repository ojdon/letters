let voicesReady = false
let audioContext = null

function polishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find((voice) => voice.lang?.toLowerCase() === 'pl-pl') ??
    voices.find((voice) => voice.lang?.toLowerCase().startsWith('pl')) ??
    null
  )
}

function primeVoices() {
  if (voicesReady || typeof window === 'undefined' || !window.speechSynthesis) return
  voicesReady = true
  window.speechSynthesis.getVoices()
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices()
  })
}

export function speakPolish(text, { rate = 0.82, pitch = 1.05 } = {}) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return
  primeVoices()
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = polishVoice()
  if (voice) utterance.voice = voice
  utterance.lang = 'pl-PL'
  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = 1
  synth.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}

function getAudioContext() {
  if (typeof window === 'undefined') return null
  const AudioContext = window.AudioContext ?? window.webkitAudioContext
  if (!AudioContext) return null
  if (!audioContext) audioContext = new AudioContext()
  if (audioContext.state === 'suspended') audioContext.resume()
  return audioContext
}

function tone(context, frequency, start, duration, volume = 0.05, type = 'sine') {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = type
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

function glide(context, from, to, start, duration, volume = 0.04, type = 'sine') {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(from, start)
  oscillator.frequency.exponentialRampToValueAtTime(to, start + duration)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

function sparkle(context, start, notes, volume = 0.012) {
  notes.forEach((frequency, index) => {
    tone(context, frequency, start + index * 0.055, 0.12, volume)
  })
}

function playCelebration(context, milestone) {
  const now = context.currentTime
  const notes = milestone
    ? [392, 523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]
    : [392, 523.25, 659.25, 783.99]
  const step = 0.07

  glide(context, 240, 520, now, 0.1, 0.018)
  notes.forEach((frequency, index) => {
    tone(context, frequency, now + index * step, 0.24, 0.032, 'triangle')
  })

  const chordStart = now + notes.length * step
  ;[130.81, 523.25, 659.25, 783.99].forEach((frequency, index) => {
    tone(context, frequency, chordStart, milestone ? 0.8 : 0.55, index === 0 ? 0.016 : 0.018)
  })
  sparkle(
    context,
    chordStart + 0.04,
    milestone ? [1567.98, 2093, 2637, 3136] : [1567.98, 2093, 2637],
  )
}

export function playChime(kind = 'correct') {
  const context = getAudioContext()
  if (!context) return
  const now = context.currentTime

  if (kind === 'correct' || kind === 'milestone') {
    playCelebration(context, kind === 'milestone')
  } else if (kind === 'wrong') {
    tone(context, 330, now, 0.18, 0.028, 'triangle')
    tone(context, 277.18, now + 0.14, 0.24, 0.02)
    glide(context, 220, 180, now + 0.05, 0.2, 0.012)
  } else if (kind === 'pop') {
    glide(context, 440, 660, now, 0.07, 0.016)
  } else if (kind === 'remove') {
    glide(context, 520, 340, now, 0.09, 0.014)
  } else if (kind === 'hint') {
    sparkle(context, now, [880, 1108.73, 1318.51], 0.014)
  } else {
    tone(context, 880, now, 0.08, 0.02)
  }
}
