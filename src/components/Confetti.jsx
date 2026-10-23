import { useMemo } from 'react'

const CONFETTI_COLORS = ['#e24a4a', '#ed7b2f', '#f0b429', '#3fa65b', '#2f7de1', '#8557d3', '#e8579b', '#ffd66b']

function seededRandom(seed) {
  let value = seed >>> 0
  return function random() {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

export default function Confetti({ burst }) {
  const pieces = useMemo(() => {
    if (!burst) return []
    const random = seededRandom(burst * 7919 + 17)
    return Array.from({ length: 32 }, (_, index) => ({
      id: `${burst}-${index}`,
      left: random() * 100,
      drift: Math.round((random() - 0.5) * 180),
      spin: Math.round(360 + random() * 720),
      delay: random() * 0.35,
      duration: 2.1 + random() * 1.5,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      width: 7 + random() * 7,
      height: 10 + random() * 12,
      round: random() > 0.65,
    }))
  }, [burst])

  if (!burst) return null

  return (
    <div key={burst} className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            backgroundColor: piece.color,
            borderRadius: piece.round ? '999px' : '3px',
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            '--drift': `${piece.drift}px`,
            '--spin': `${piece.spin}deg`,
          }}
        />
      ))}
    </div>
  )
}
