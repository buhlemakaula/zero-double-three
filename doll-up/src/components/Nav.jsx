import { useState, useEffect } from 'react'
import Wordmark from './Wordmark.jsx'

const LINKS = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Talk', '#glow'],
  ['Portfolio', '#portfolio'],
  ['FAQs', '#faqs'],
  ['Contact', '#contact'],
]

export default function Nav({ onBook }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/90 backdrop-blur transition-colors ${
        scrolled ? 'hairline' : 'border-transparent'
      }`}
    >
      <div className="shell flex items-center justify-between py-3">
        <a href="#top" className="shrink-0" aria-label="Doll Up Hair & Nail Art home">
          <Wordmark size="sm" />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-[12px] font-semibold uppercase tracking-wide text-ink/70 transition-colors hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button className="pill pill-solid hidden sm:inline-flex" onClick={onBook}>
            Book now
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 h-[2px] w-6 bg-ink transition-all ${
                  open ? 'top-1/2 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[2px] w-6 -translate-y-1/2 bg-ink transition-opacity ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-[2px] w-6 bg-ink transition-all ${
                  open ? 'top-1/2 -rotate-45' : 'bottom-0'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t hairline bg-paper lg:hidden" aria-label="Mobile">
          <div className="shell flex flex-col py-2">
            {LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b hairline py-3 text-sm font-semibold uppercase tracking-wide text-ink/80"
              >
                {label}
              </a>
            ))}
            <button
              className="pill pill-solid mt-4 self-start"
              onClick={() => {
                setOpen(false)
                onBook()
              }}
            >
              Book now
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
