import { useCallback } from 'react'
import { playChime, speakPolish, stopSpeaking } from '../lib/audio'

export function useSpeech(enabled) {
  const speak = useCallback(
    (text, options) => {
      if (enabled) speakPolish(text, options)
    },
    [enabled],
  )

  const chime = useCallback(
    (kind) => {
      if (enabled) playChime(kind)
    },
    [enabled],
  )

  const stop = useCallback(() => {
    stopSpeaking()
  }, [])

  return { speak, chime, stop }
}
