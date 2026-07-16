// The logo wordmark: outlined/inline serif caps "KWANNZ." with a letter-spaced
// "GLAMMIFIED BY KWANNZ" beneath.
export default function Wordmark({ className = '', tone = 'ink', size = 'md' }) {
  const color = tone === 'paper' ? 'text-paper' : 'text-ink'
  const sizes = {
    sm: 'text-2xl',
    md: 'text-[28px]',
    lg: 'text-5xl sm:text-6xl',
  }
  const subSizes = {
    sm: 'text-[7px]',
    md: 'text-[8px]',
    lg: 'text-[10px]',
  }
  return (
    <span className={`inline-flex flex-col items-center leading-none ${color} ${className}`}>
      <span
        className={`font-serif font-medium tracking-[0.02em] ${sizes[size]}`}
        style={{ WebkitTextStroke: '0.6px currentColor' }}
      >
        KWANNZ<span className="italic">.</span>
      </span>
      <span className={`mt-1 font-body font-semibold uppercase tracking-[0.34em] ${subSizes[size]} opacity-70`}>
        Glammified&nbsp;by&nbsp;Kwannz
      </span>
    </span>
  )
}
