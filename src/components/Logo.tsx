// The CONNECT wordmark — the double-N renders as a connecting wave, echoing the brand mark.
export function Logo({ className = '', onDark = false }: { className?: string; onDark?: boolean }) {
  const ink = onDark ? '#FAFAF7' : '#0A0A0A'
  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden className="shrink-0">
        <path
          d="M16 40 C16 26, 34 26, 34 34 C34 42, 48 42, 48 28"
          fill="none"
          stroke={ink}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <circle cx="48" cy="24" r="3.6" fill="#B8935E" />
      </svg>
      <span
        className="font-display text-[1.35rem] leading-none tracking-tight"
        style={{ color: ink, fontWeight: 600 }}
      >
        Connect
        <sup className="font-sans text-[0.5rem] align-super ml-0.5" style={{ color: '#B8935E' }}>
          ®
        </sup>
      </span>
    </span>
  )
}
