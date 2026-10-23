import { useEffect, useState } from 'react'
import { createProfile, loadProfile, saveProfile } from '../lib/storage'

export function useProfile() {
  const [profile, setProfile] = useState(loadProfile)

  useEffect(() => {
    if (profile) saveProfile(profile)
  }, [profile])

  function startProfile(values) {
    setProfile((current) => {
      if (current) {
        return {
          ...current,
          name: values.name,
          age: values.age,
          colorId: values.colorId,
        }
      }
      return createProfile(values)
    })
  }

  function updateSettings(patch) {
    setProfile((current) =>
      current
        ? {
            ...current,
            settings: {
              ...current.settings,
              ...patch,
            },
          }
        : current,
    )
  }

  function recordSolved(wordId) {
    setProfile((current) => {
      if (!current) return current
      return {
        ...current,
        stars: current.stars + 1,
        solved: {
          ...current.solved,
          [wordId]: (current.solved[wordId] ?? 0) + 1,
        },
      }
    })
  }

  function resetProgress() {
    setProfile((current) => (current ? { ...current, stars: 0, solved: {} } : current))
  }

  return {
    profile,
    startProfile,
    updateSettings,
    recordSolved,
    resetProgress,
  }
}
