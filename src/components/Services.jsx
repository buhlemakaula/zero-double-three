import { useState } from 'react'
import { SERVICE_TABS, makeupServices, hairServices, calloutServices } from '../data/services.js'
import { rand, minutesToLabel } from '../lib/format.js'
import { depositFor } from '../lib/deposit.js'

function ServiceCard({ service, settings, expanded, onToggle, onBook }) {
  const deposit = depositFor(service.price, settings)
  return (
    <div className="flex flex-col items-center text-center">
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="group flex flex-col items-center"
      >
        <span className="relative block h-32 w-32 overflow-hidden rounded-full bg-greige sm:h-36 sm:w-36">
          <img
            src={service.photo}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </span>
        <span className="mt-4 font-display text-lg uppercase leading-none tracking-tight">
          {service.name}
        </span>
        <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink/55">
          From {rand(service.price)}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 w-full max-w-xs rounded-2xl bg-greige/60 p-5 text-left animate-fade-up">
          <p className="text-[13.5px] leading-relaxed text-ink/80">{service.description}</p>
          {service.highlight && (
            <p className="mt-2 text-[13px] font-semibold text-ink">{service.highlight}</p>
          )}
          {service.caption && (
            <p className="mt-2 font-serif text-base italic text-ink/70">{service.caption}</p>
          )}

          <dl className="mt-4 space-y-1.5 border-t hairline pt-4 text-[12px] uppercase tracking-wide">
            <div className="flex justify-between">
              <dt className="text-ink/55">Price</dt>
              <dd className="font-semibold">{rand(service.price)}</dd>
            </div>
            {service.duration_min && (
              <div className="flex justify-between">
                <dt className="text-ink/55">Duration</dt>
                <dd className="font-semibold">{minutesToLabel(service.duration_min)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/55">Deposit (50%)</dt>
              <dd className="font-semibold">{rand(deposit)}</dd>
            </div>
          </dl>

          <button className="pill pill-solid mt-4 w-full" onClick={() => onBook(service.id)}>
            Secure with {rand(deposit)}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Services({ settings, onBook }) {
  const [tab, setTab] = useState('makeup')
  const [openId, setOpenId] = useState(null)

  const list = tab === 'makeup' ? makeupServices() : hairServices()
  const callouts = calloutServices()

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id))

  return (
    <section id="services" className="scroll-mt-20 border-t hairline bg-paper py-20 sm:py-28">
      <div className="shell">
        <header className="mb-12 text-center">
          <p className="label mb-3">The menu</p>
          <h2 className="display-title text-5xl sm:text-6xl">Services</h2>
        </header>

        {/* Tabs */}
        <div className="mb-14 flex justify-center gap-2" role="tablist" aria-label="Service categories">
          {SERVICE_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id)
                setOpenId(null)
              }}
              className={`pill ${tab === t.id ? 'pill-solid' : 'pill-outline'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:gap-x-10">
          {list.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              settings={settings}
              expanded={openId === s.id}
              onToggle={() => toggle(s.id)}
              onBook={onBook}
            />
          ))}
        </div>

        {/* CALL OUTS divider card */}
        <div className="mt-20">
          <div className="mb-10 flex items-center gap-5">
            <span className="h-px flex-1 bg-ink/15" />
            <h3 className="font-display text-3xl uppercase tracking-tight sm:text-4xl">Call outs.</h3>
            <span className="h-px flex-1 bg-ink/15" />
          </div>
          <div className="mx-auto grid max-w-md grid-cols-1 gap-y-12">
            {callouts.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                settings={settings}
                expanded={openId === s.id}
                onToggle={() => toggle(s.id)}
                onBook={onBook}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
