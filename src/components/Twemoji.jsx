const modules = import.meta.glob('../assets/twemoji/*.svg', {
  eager: true,
  import: 'default',
})

const assets = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => {
    const match = path.match(/([0-9a-f-]+)\.svg$/)
    return [match?.[1] ?? path, url]
  }),
)

export default function Twemoji({ codepoint, emoji, alt = '', className = '' }) {
  const source = assets[codepoint?.toLowerCase()]

  if (!source) {
    return (
      <span role={alt ? 'img' : undefined} aria-label={alt || undefined} className={className}>
        {emoji}
      </span>
    )
  }

  return <img src={source} alt={alt} draggable="false" className={className} />
}
