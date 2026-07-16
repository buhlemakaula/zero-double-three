import { useState } from 'react'
import { PORTFOLIO } from '../data/portfolio.js'

// Tight asymmetric photo grid, ≤8px gaps. Tap to view larger.
export default function Portfolio() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="portfolio" className="scroll-mt-20 border-t hairline bg-paper py-20 sm:py-28">
      <div className="shell">
        <header className="mb-10 text-center">
          <p className="label mb-3">The work</p>
          <h2 className="display-title text-5xl sm:text-6xl">Portfolio</h2>
        </header>

        <div className="grid auto-rows-[220px] grid-cols-2 gap-2 sm:auto-rows-[300px] sm:grid-cols-4">
          {PORTFOLIO.map((img) => (
            <button
              key={img.id}
              onClick={() => setLightbox(img)}
              className={`group relative overflow-hidden rounded-xl bg-greige ${
                img.span === 'tall' ? 'row-span-2' : ''
              } ${img.span === 'wide' ? 'sm:col-span-2' : ''}`}
              aria-label={`View: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-[13px] text-ink/55">
          More on Instagram:{' '}
          <a
            href="https://instagram.com/Glamified_byKwannz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline underline-offset-2"
          >
            @Glamified_byKwannz
          </a>
        </p>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/90 p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged portfolio image"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center text-3xl text-paper"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </section>
  )
}
