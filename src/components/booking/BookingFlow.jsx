import { useState, useEffect, useMemo } from 'react'
import { SERVICES, getService } from '../../data/services.js'
import { rand, minutesToLabel, prettyDate } from '../../lib/format.js'
import { depositFor, balanceFor } from '../../lib/deposit.js'
import { upcomingDays, slotsForDate, to12h } from '../../lib/availability.js'
import { isQuietSlot } from '../../lib/loyalty.js'
import { fetchBookedSlots, createBooking } from '../../lib/data.js'
import { whatsappBookingLink } from '../../lib/whatsapp.js'
import Stepper from './Stepper.jsx'

const ADDONS = [
  { id: 'customisation', label: 'Customisation', price: 250, note: 'Bleaching knots + plucking' },
  { id: 'house-call', label: 'Call out (house call)', price: 500, note: 'Minimum 3 people' },
]

const STEPS = ['Service', 'Add-ons', 'Date', 'Time', 'Details', 'Deposit', 'Done']

export default function BookingFlow({ settings, initialServiceId, onClose }) {
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(initialServiceId || null)
  const [addons, setAddons] = useState([])
  const [groupSize, setGroupSize] = useState(3)
  const [dateIso, setDateIso] = useState(null)
  const [time, setTime] = useState(null)
  const [details, setDetails] = useState({ name: '', phone: '', email: '', referral: '', notes: '' })
  const [acknowledged, setAcknowledged] = useState(false)
  const [booked, setBooked] = useState([])
  const [saved, setSaved] = useState(null)

  const service = serviceId ? getService(serviceId) : null

  // If a service was preselected (from the Services section), skip step 0.
  useEffect(() => {
    if (initialServiceId) setStep(1)
  }, [initialServiceId])

  // Pricing — always derived, never hardcoded.
  const addonTotal = addons.reduce((s, id) => s + (ADDONS.find((a) => a.id === id)?.price || 0), 0)
  const basePrice = service?.price || 0
  const isCallout = service?.category === 'callout' || addons.includes('house-call')
  const total = basePrice + addonTotal
  const deposit = depositFor(total, settings)
  const balance = balanceFor(total, settings)
  const quiet = dateIso && time ? isQuietSlot(dateIso, time, settings) : false

  const days = useMemo(() => upcomingDays(settings, 28), [settings])
  const slots = useMemo(
    () => (dateIso ? slotsForDate(dateIso, service, settings, booked) : []),
    [dateIso, service, settings, booked],
  )

  // Load booked slots when a date is chosen.
  useEffect(() => {
    if (!dateIso) return
    let alive = true
    fetchBookedSlots(dateIso).then((b) => alive && setBooked(b))
    return () => {
      alive = false
    }
  }, [dateIso])

  const canNext = {
    0: Boolean(serviceId),
    1: true,
    2: Boolean(dateIso),
    3: Boolean(time),
    4: details.name.trim() && details.phone.trim(),
    5: acknowledged,
  }

  async function confirm() {
    const rec = await createBooking({
      service_id: serviceId,
      service_name: service.name,
      addons,
      group_size: isCallout ? groupSize : null,
      is_callout: isCallout,
      date: dateIso,
      time,
      duration_min: service.duration_min,
      total,
      deposit,
      is_quiet: quiet,
      referral_code: details.referral || null,
      client_name: details.name,
      client_phone: details.phone,
      client_email: details.email || null,
      notes: details.notes || null,
    })
    setSaved(rec)
    setStep(6)
  }

  const waLink = saved
    ? whatsappBookingLink(
        { service: service.name, dateIso, time: to12h(time), total, deposit, name: details.name },
        settings,
      )
    : '#'

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-paper">
      {/* Header */}
      <div className="border-b hairline">
        <div className="shell flex items-center justify-between py-4">
          <span className="label">Book an appointment</span>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-2xl"
            aria-label="Close booking"
          >
            ×
          </button>
        </div>
      </div>

      <Stepper steps={STEPS} current={step} />

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="shell max-w-2xl py-10">
          {step === 0 && (
            <Step title="Choose a service">
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServiceId(s.id)}
                    className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                      serviceId === s.id ? 'border-ink bg-greige/50' : 'border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    <img src={s.photo} alt="" className="h-14 w-14 rounded-full object-cover" />
                    <span>
                      <span className="block text-sm font-semibold">{s.name}</span>
                      <span className="text-[12px] text-ink/55">
                        From {rand(s.price)}
                        {s.duration_min ? ` · ${minutesToLabel(s.duration_min)}` : ''}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step title="Add-ons" subtitle="Optional extras for your appointment.">
              <div className="space-y-3">
                {ADDONS.filter((a) => a.id !== serviceId).map((a) => {
                  const on = addons.includes(a.id)
                  return (
                    <button
                      key={a.id}
                      onClick={() =>
                        setAddons((cur) => (on ? cur.filter((x) => x !== a.id) : [...cur, a.id]))
                      }
                      className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-colors ${
                        on ? 'border-ink bg-greige/50' : 'border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">{a.label}</span>
                        <span className="text-[12px] text-ink/55">{a.note}</span>
                      </span>
                      <span className="text-sm font-semibold">
                        +{rand(a.price)} {on ? '✓' : ''}
                      </span>
                    </button>
                  )
                })}
              </div>

              {isCallout && (
                <div className="mt-6 rounded-2xl bg-greige/50 p-5">
                  <label className="label mb-2 block" htmlFor="group">
                    People in the group (min 3)
                  </label>
                  <input
                    id="group"
                    type="number"
                    min={3}
                    value={groupSize}
                    onChange={(e) => setGroupSize(Math.max(3, Number(e.target.value) || 3))}
                    className="w-28 rounded-xl border border-ink/20 px-4 py-2.5 text-sm"
                  />
                  <p className="mt-2 text-[12px] text-ink/55">
                    Call-outs earn a Glam Card stamp per person, that’s{' '}
                    {Math.max(groupSize, 3)} stamps.
                  </p>
                </div>
              )}
            </Step>
          )}

          {step === 2 && (
            <Step title="Pick a date" subtitle="Bookings close 24 hours before each slot.">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {days.map((d) => (
                  <button
                    key={d.iso}
                    disabled={!d.open}
                    onClick={() => {
                      setDateIso(d.iso)
                      setTime(null)
                    }}
                    className={`rounded-xl border py-3 text-center text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                      dateIso === d.iso ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink/40'
                    }`}
                  >
                    <span className="block font-semibold">{prettyDate(d.iso).split(' ')[0].slice(0, 3)}</span>
                    <span className="block">{d.iso.slice(8)}/{d.iso.slice(5, 7)}</span>
                  </button>
                ))}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step title="Pick a time" subtitle={dateIso ? prettyDate(dateIso) : ''}>
              {slots.length === 0 ? (
                <p className="text-sm text-ink/60">
                  No open slots on this date. Try another day.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      onClick={() => setTime(s.time)}
                      className={`relative rounded-xl border py-3 text-[13px] transition-colors ${
                        time === s.time ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink/40'
                      }`}
                    >
                      {s.label}
                      {s.quiet && (
                        <span
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-paper"
                          title="Quiet slot: earns a double stamp"
                        >
                          2×
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {quiet && (
                <p className="mt-4 text-[13px] font-semibold text-ink">
                  ✦ Quiet slot: this booking earns a double Glam Card stamp.
                </p>
              )}
            </Step>
          )}

          {step === 4 && (
            <Step title="Your details">
              <div className="space-y-4">
                <Field label="Full name" required>
                  <input
                    className="input"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Phone / WhatsApp" required>
                  <input
                    className="input"
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Email (optional)">
                  <input
                    className="input"
                    type="email"
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Referral code (optional)">
                  <input
                    className="input"
                    value={details.referral}
                    onChange={(e) => setDetails({ ...details, referral: e.target.value })}
                    placeholder="A friend’s code, you both earn a stamp"
                  />
                </Field>
                <Field label="Notes (optional)">
                  <textarea
                    className="input min-h-[80px] resize-y"
                    value={details.notes}
                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                    placeholder="Reference look, event, anything I should know"
                  />
                </Field>
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step title="Secure your slot" subtitle="A 50% non-refundable deposit confirms your booking.">
              <Summary
                service={service}
                addons={addons}
                dateIso={dateIso}
                time={time}
                total={total}
                deposit={deposit}
                balance={balance}
              />

              <div className="mt-6 rounded-2xl bg-greige/60 p-5 text-sm">
                <p className="label mb-3">Deposit: pay to</p>
                <dl className="space-y-1.5">
                  <Row k="Bank" v={settings.business.bank.bank} />
                  <Row k="Account name" v={settings.business.bank.account_name} />
                  <Row k="Account number" v={settings.business.bank.account_number} />
                  <Row k="Reference" v="Your name & surname" />
                  <Row k="Amount" v={rand(deposit)} strong />
                </dl>
                <p className="mt-3 text-[12px] text-ink/60">
                  A speed point is available on the day for the remaining {rand(balance)}.
                </p>
              </div>

              <div className="mt-5 rounded-2xl border hairline p-5">
                <p className="label mb-3">How to send your proof of payment</p>
                <ol className="space-y-2 text-[13.5px] leading-relaxed text-ink/75">
                  <li>1. Pay the {rand(deposit)} deposit using the details above.</li>
                  <li>2. Tap Confirm below to open a ready-made WhatsApp message to Kwannz.</li>
                  <li>3. Attach your proof of payment straight to that chat.</li>
                </ol>
                <p className="mt-3 text-[12px] text-ink/50">
                  Your slot is held once Kwannz receives your proof of payment on WhatsApp.
                </p>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13.5px] text-ink/80">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
                />
                <span>
                  I understand the {rand(deposit)} deposit is non-refundable and secures my booking.
                </span>
              </label>
            </Step>
          )}

          {step === 6 && saved && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-2xl text-paper">
                ✓
              </div>
              <h2 className="display-title text-4xl">You’re booked in</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink/70">
                One last step. Open the WhatsApp message below, then attach your
                proof of payment to that chat to lock in your slot.
              </p>
              <div className="mx-auto mt-6 max-w-md">
                <Summary
                  service={service}
                  addons={addons}
                  dateIso={dateIso}
                  time={time}
                  total={total}
                  deposit={deposit}
                  balance={balance}
                />
              </div>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="pill pill-solid mt-8 px-10">
                Send confirmation on WhatsApp
              </a>
              <div>
                <button onClick={onClose} className="mt-4 text-[13px] text-ink/50 underline">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer nav */}
      {step < 6 && (
        <div className="border-t hairline bg-paper">
          <div className="shell flex max-w-2xl items-center justify-between py-4">
            <button
              onClick={() => (step === 0 ? onClose() : setStep((s) => s - 1))}
              className="pill pill-outline px-6"
            >
              {step === 0 ? 'Cancel' : 'Back'}
            </button>

            <div className="flex items-center gap-4">
              {service && <span className="hidden text-sm sm:inline">Total {rand(total)}</span>}
              {step === 5 ? (
                <button disabled={!canNext[5]} onClick={confirm} className="pill pill-solid px-8 disabled:opacity-30">
                  Confirm booking
                </button>
              ) : (
                <button
                  disabled={!canNext[step]}
                  onClick={() => setStep((s) => s + 1)}
                  className="pill pill-solid px-8 disabled:opacity-30"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── small presentational helpers ─────────────────────────────────────── */
function Step({ title, subtitle, children }) {
  return (
    <div className="animate-fade-up">
      <h2 className="display-title text-3xl sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="label mb-2 block">
        {label} {required && <span className="text-ink">*</span>}
      </span>
      {children}
    </label>
  )
}

function Row({ k, v, strong }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink/55">{k}</dt>
      <dd className={strong ? 'font-semibold' : 'text-right'}>{v}</dd>
    </div>
  )
}

function Summary({ service, addons, dateIso, time, total, deposit, balance }) {
  return (
    <div className="rounded-2xl border hairline p-5 text-sm">
      <Row k="Service" v={service?.name} />
      {addons.map((id) => {
        const a = ADDONS.find((x) => x.id === id)
        return a ? <Row key={id} k="Add-on" v={`${a.label} (+${rand(a.price)})`} /> : null
      })}
      {dateIso && <Row k="Date" v={prettyDate(dateIso)} />}
      {time && <Row k="Time" v={to12h(time)} />}
      <div className="my-3 border-t hairline" />
      <Row k="Total" v={rand(total)} strong />
      <Row k="Deposit (50%)" v={rand(deposit)} strong />
      <Row k="Balance on the day" v={rand(balance)} />
    </div>
  )
}
