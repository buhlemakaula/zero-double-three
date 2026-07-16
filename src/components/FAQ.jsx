import { useState } from 'react'
import { FAQS } from '../data/faqs.js'

function Item({ q, a, open, onToggle, id }) {
  return (
    <div className="border-b hairline">
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-${id}`}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="text-[15px] font-semibold sm:text-base">{q}</span>
          <span
            className={`shrink-0 text-2xl leading-none transition-transform ${
              open ? 'rotate-45' : ''
            }`}
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      {open && (
        <p id={`faq-${id}`} className="pb-6 pr-8 text-[14px] leading-relaxed text-ink/70">
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faqs" className="scroll-mt-20 border-t hairline bg-paper py-20 sm:py-28">
      <div className="shell grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
        <header>
          <p className="label mb-3">Good to know</p>
          <h2 className="display-title text-5xl sm:text-6xl">FAQs</h2>
        </header>
        <div>
          {FAQS.map((f, i) => (
            <Item
              key={i}
              id={i}
              q={f.q}
              a={f.a}
              open={open === i}
              onToggle={() => setOpen((cur) => (cur === i ? -1 : i))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
