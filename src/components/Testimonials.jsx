import { TESTIMONIALS } from '../data/testimonials.js'

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-20 border-t hairline bg-ink py-20 text-paper sm:py-28">
      <div className="shell">
        <header className="mb-12 text-center">
          <p className="label mb-3 text-paper/60">Kind words</p>
          <h2 className="display-title text-5xl sm:text-6xl">Testimonials</h2>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-2xl border border-paper/15 p-7">
              <blockquote className="font-serif text-xl italic leading-snug text-paper/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-paper/15 pt-4">
                <span className="block text-sm font-semibold">{t.name}</span>
                <span className="text-[12px] uppercase tracking-wide text-paper/50">
                  {t.service}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
