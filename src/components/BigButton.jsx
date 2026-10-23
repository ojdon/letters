const VARIANTS = {
  primary: 'accent-bg tile-shadow',
  secondary:
    'bg-white text-[var(--accent-deep)] border-2 border-[var(--accent)] shadow-[0_4px_0_rgba(59,46,38,0.12)]',
  soft: 'accent-soft-bg accent-text border-2 border-transparent',
  ghost: 'bg-transparent text-[var(--color-muted)]',
  danger: 'bg-[#fdeaea] text-[#b52f2f] border-2 border-[#e24a4a]',
}

const SIZES = {
  md: 'min-h-12 px-5 py-2.5 text-lg',
  lg: 'min-h-14 px-7 py-3 text-xl',
  xl: 'min-h-16 px-8 py-4 text-2xl',
  sm: 'min-h-10 px-3 py-1.5 text-base',
}

export default function BigButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold transition-transform duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
