import { useState, useEffect } from 'react'
import { TESTIMONIALS } from '../data/testimonials.js'
import { fetchPublicReviews } from '../lib/data.js'

// Show a first name + surname initial, e.g. "Nosipho M."
function shortName(full) {
  const parts = (full || '').trim().split(/\s+/)
  if (parts.length < 2) return parts[0] || 'Client'
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

export default function Testimonials() {
  // Start with the seeded quotes; swap in real reviews once they load.
  const [items, setItems] = useState(
    TESTIMONIALS.map((t) => ({ quote: t.quote, name: t.name, service: t.service, rating: 5 })),
  )

  useEffect(() => {
    let alive = true
    fetchPublicReviews().then((rows) => {
      if (!alive || !rows?.length) return
      setItems(
        rows.map((r) => ({
          quote: r.comment,
          name: shortName(r.client_name),
          service: r.service_name,
          rating: r.rating,
        })),
      )
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <section id="testimonials" className="scroll-mt-20 border-t hairline bg-ink py-20 text-paper sm:py-28">
      <div className="shell">
        <header className="mb-12 text-center">
          <p className="label mb-3 text-paper/60">Kind words</p>
          <h2 className="display-title text-5xl sm:text-6xl">Testimonials</h2>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {items.slice(0, 6).map((t, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-paper/15 p-7">
              <div className="mb-3 text-sm tracking-widest text-paper" aria-label={`${t.rating} out of 5 stars`}>
                {'★'.repeat(t.rating)}
                <span className="text-paper/25">{'★'.repeat(5 - t.rating)}</span>
              </div>
              <blockquote className="font-serif text-xl italic leading-snug text-paper/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-paper/15 pt-4">
                <span className="block text-sm font-semibold">{t.name}</span>
                {t.service && (
                  <span className="text-[12px] uppercase tracking-wide text-paper/50">{t.service}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
