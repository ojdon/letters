import { useState } from 'react'
import { getColor } from './data/colors'
import { useProfile } from './hooks/useProfile'
import GameScreen from './components/GameScreen'
import Onboarding from './components/Onboarding'

export default function App() {
  const {
    profile,
    startProfile,
    updateSettings,
    recordSolved,
    resetProgress,
  } = useProfile()
  const [editingProfile, setEditingProfile] = useState(false)

  if (!profile || editingProfile) {
    return (
      <Onboarding
        initialProfile={profile}
        onComplete={(values) => {
          startProfile(values)
          setEditingProfile(false)
        }}
        onCancel={profile ? () => setEditingProfile(false) : undefined}
      />
    )
  }

  const color = getColor(profile.colorId)

  return (
    <div
      style={{
        '--accent': color.accent,
        '--accent-deep': color.deep,
        '--accent-soft': color.soft,
        '--accent-ink': color.ink,
      }}
    >
      <GameScreen
        profile={profile}
        onRecordSolved={recordSolved}
        onUpdateSettings={updateSettings}
        onEditProfile={() => setEditingProfile(true)}
        onResetProgress={resetProgress}
      />
    </div>
  )
}
