import { useState, useEffect } from 'react'
import { fetchBookingPublic } from '../lib/data.js'
import { rand, prettyDate } from '../lib/format.js'
import { to12h } from '../lib/availability.js'
import { whatsappLink } from '../lib/whatsapp.js'
import { DEFAULT_SETTINGS } from '../lib/settings.js'
import Wordmark from './Wordmark.jsx'

// Private per-booking page. Doll Up sends the link over WhatsApp once she has
// confirmed. Shows the appointment, the policies, and the studio address —
// the address only arrives from the server once the booking is confirmed.
const POLICIES = [
  {
    t: 'Booking fee',
    b: 'A non-refundable booking fee of 50% of the service total secures your appointment. The balance is paid on the day. A speed point is available.',
  },
  {
    t: 'Late arrivals',
    b: 'After 15 minutes the appointment is cancelled (no extra charge) and the deposit is not refunded. Braiding takes time, so please arrive on time.',
  },
  {
    t: 'Come prepared',
    b: 'Arrive with your hair washed and detangled so we can start right away. Bringing your own braiding hair? Have it ready, or add Wash & treatment when you book.',
  },
  {
    t: 'Little ones',
    b: 'We love styling kids too. Book a kids slot and let us know their age so we can plan enough time and keep it gentle.',
  },
]

export default function Welcome({ id }) {
  const [state, setState] = useState({ loading: true })
  const b = DEFAULT_SETTINGS.business

  useEffect(() => {
    let alive = true
    fetchBookingPublic(id)
      .then((d) => alive && setState({ loading: false, data: d }))
      .catch(() => alive && setState({ loading: false, data: { found: false } }))
    return () => {
      alive = false
    }
  }, [id])

  const back = (
    <a href="/" className="pill pill-outline mt-8 px-8">
      Go to the website
    </a>
  )

  if (state.loading) {
    return (
      <Frame>
        <p className="text-sm text-ink/50">Loading your booking…</p>
      </Frame>
    )
  }

  const d = state.data
  if (!d || !d.found) {
    return (
      <Frame>
        <h1 className="display-title text-4xl">Booking not found</h1>
        <p className="mt-4 max-w-sm text-sm text-ink/70">
          This link may be incorrect or expired. Please check with Doll Up on WhatsApp.
        </p>
        <a
          href={whatsappLink(DEFAULT_SETTINGS, 'Hi Doll Up! I have a question about my booking.')}
          target="_blank"
          rel="noopener noreferrer"
          className="pill pill-solid mt-8 px-8"
        >
          Message Doll Up
        </a>
      </Frame>
    )
  }

  const confirmed = d.status === 'confirmed' || d.status === 'completed'
  const balance = (d.total || 0) - (d.deposit || 0)
  const firstName = (d.client_name || '').split(' ')[0]

  return (
    <Frame>
      <p className="label mb-3">{confirmed ? "You're confirmed" : 'Booking received'}</p>
      <h1 className="display-title text-4xl sm:text-5xl">
        {firstName ? `See you soon, ${firstName}` : 'Your appointment'}
      </h1>

      {/* Booking summary */}
      <div className="mt-8 w-full rounded-2xl border hairline p-5 text-left text-sm">
        <Row k="Service" v={d.service_name} />
        <Row k="Date" v={prettyDate(d.date)} />
        <Row k="Time" v={to12h(d.time)} />
        <div className="my-3 border-t hairline" />
        <Row k="Total" v={rand(d.total)} strong />
        <Row k="Deposit (paid)" v={rand(d.deposit)} />
        <Row k="Balance on the day" v={rand(balance)} />
      </div>

      {/* Address — only present once confirmed */}
      <div className="mt-6 w-full rounded-2xl bg-greige/60 p-5 text-left">
        <p className="label mb-2">Studio address</p>
        {d.address ? (
          <>
            <p className="text-[15px] font-semibold leading-relaxed">{d.address}</p>
            {d.address_note && (
              <p className="mt-2 text-[13px] leading-relaxed text-ink/70">{d.address_note}</p>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-solid mt-4 px-6 text-[12px]"
            >
              Open in Maps
            </a>
          </>
        ) : (
          <p className="text-[13px] leading-relaxed text-ink/60">
            Your studio address will appear here as soon as Doll Up confirms your deposit. Sit
            tight! 💛
          </p>
        )}
      </div>

      {/* Policies */}
      <div className="mt-6 w-full text-left">
        <p className="label mb-3">Good to know</p>
        <div className="space-y-4">
          {POLICIES.map((p) => (
            <div key={p.t}>
              <h3 className="text-sm font-semibold">{p.t}</h3>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink/70">{p.b}</p>
            </div>
          ))}
        </div>
      </div>

      <a
        href={whatsappLink(
          DEFAULT_SETTINGS,
          firstName ? `Hi Doll Up! It's ${firstName}, about my booking.` : 'Hi Doll Up!',
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="pill pill-solid mt-8 px-8"
      >
        Message Doll Up on WhatsApp
      </a>
      {back}
      <p className="mt-6 text-[11px] uppercase tracking-wide text-ink/40">
        {b.name} · {b.location}
      </p>
    </Frame>
  )
}

function Frame({ children }) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center">
        <a href="/" aria-label="Doll Up Hair & Nail Art home">
          <Wordmark size="md" />
        </a>
        <div className="mt-10 flex w-full flex-col items-center">{children}</div>
      </div>
    </div>
  )
}

function Row({ k, v, strong }) {
  return (
    <div className="flex justify-between gap-4 py-0.5">
      <dt className="text-ink/55">{k}</dt>
      <dd className={strong ? 'font-semibold' : 'text-right'}>{v}</dd>
    </div>
  )
}
