const STROKE_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2.2,
}

export default function Icon({ name, className = 'size-6' }) {
  let content = null

  switch (name) {
    case 'star':
      content = (
        <path
          d="M12 3.6l2.44 4.95 5.46.8-3.95 3.85.93 5.44L12 16.07l-4.88 2.57.93-5.44L4.1 9.35l5.46-.8L12 3.6z"
          fill="currentColor"
        />
      )
      break
    case 'settings':
      content = (
        <>
          <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.94a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.06 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.15.62.68 1.06 1.32 1.09H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03z" />
        </>
      )
      break
    case 'sound-on':
      content = (
        <>
          <path d="M11 5L6.5 9H3v6h3.5L11 19V5z" />
          <path d="M15.2 8.6a5 5 0 0 1 0 6.8M18 5.8a9 9 0 0 1 0 12.4" />
        </>
      )
      break
    case 'sound-off':
      content = (
        <>
          <path d="M11 5L6.5 9H3v6h3.5L11 19V5z" />
          <path d="M16 9l5 5m0-5l-5 5" />
        </>
      )
      break
    case 'speaker':
      content = (
        <>
          <path d="M11 5L6.5 9H3v6h3.5L11 19V5z" />
          <path d="M15.2 8.6a5 5 0 0 1 0 6.8" />
          <path d="M18 5.8a9 9 0 0 1 0 12.4" />
        </>
      )
      break
    case 'lightbulb':
      content = (
        <>
          <path d="M9 18h6M10 21h4" />
          <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8.9.9 1.5l.1.6h5l.1-.6c.1-.6.4-1.1.9-1.5A6 6 0 0 0 12 3z" />
        </>
      )
      break
    case 'arrow-left':
      content = <path d="M19 12H5m6-6l-6 6 6 6" />
      break
    case 'arrow-right':
      content = <path d="M5 12h14m-6-6l6 6-6 6" />
      break
    case 'check':
      content = <path d="M4.5 12.5l5 5 10-11" strokeWidth={3} />
      break
    case 'close':
      content = <path d="M6 6l12 12M18 6L6 18" />
      break
    case 'refresh':
      content = (
        <>
          <path d="M20 11a8 8 0 1 0-2.3 5.7" />
          <path d="M20 4v7h-7" />
        </>
      )
      break
    case 'pencil':
      content = (
        <>
          <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4z" />
          <path d="M13.5 6.5l4 4" />
        </>
      )
      break
    case 'sparkles':
      content = (
        <>
          <path d="M12 3l1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3z" fill="currentColor" stroke="none" />
          <path d="M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" fill="currentColor" stroke="none" />
          <path d="M5 13l.7 1.8L7.5 15.5l-1.8.7L5 18l-.7-1.8L2.5 15.5l1.8-.7L5 13z" fill="currentColor" stroke="none" />
        </>
      )
      break
    default:
      content = null
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      focusable="false"
      {...STROKE_PROPS}
    >
      {content}
    </svg>
  )
}
