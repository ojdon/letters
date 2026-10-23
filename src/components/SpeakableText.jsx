import Icon from './Icon'

export default function SpeakableText({ text, onSpeak, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onSpeak?.(text)}
      title="Dotknij, aby posłuchać"
      className={`focus-ring inline-block rounded-lg text-left transition-transform active:scale-[0.98] ${className}`}
    >
      {children}
      <Icon name="speaker" className="ml-1 inline size-4 align-[-3px] opacity-55" />
    </button>
  )
}
