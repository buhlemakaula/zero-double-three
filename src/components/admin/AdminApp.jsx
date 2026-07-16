import { useState, useEffect, useCallback } from 'react'
import { isSupabaseConfigured } from '../../lib/supabase.js'
import {
  adminCheck,
  adminListBookings,
  adminSetStatus,
  adminUpdateSettings,
  adminAddBlackout,
  adminRemoveBlackout,
  adminSetPasscode,
} from '../../lib/admin.js'
import { fetchSettings } from '../../lib/data.js'
import { rand, prettyDate } from '../../lib/format.js'
import { to12h } from '../../lib/availability.js'
import Wordmark from '../Wordmark.jsx'

const DAYS = [
  ['0', 'Sun'],
  ['1', 'Mon'],
  ['2', 'Tue'],
  ['3', 'Wed'],
  ['4', 'Thu'],
  ['5', 'Fri'],
  ['6', 'Sat'],
]

const STATUS_META = {
  pending: { label: 'Pending', tone: 'border-ink/30 text-ink' },
  confirmed: { label: 'Confirmed', tone: 'bg-ink text-paper' },
  completed: { label: 'Completed', tone: 'bg-ink text-paper' },
  client_cancel: { label: 'Cancelled', tone: 'border-ink/20 text-ink/45' },
  late_cancel: { label: 'Late cancel', tone: 'border-ink/20 text-ink/45' },
  late_arrival_cancel: { label: 'No-show', tone: 'border-ink/20 text-ink/45' },
}

// Which actions each status offers.
const ACTIONS = {
  pending: [
    ['confirmed', 'Confirm'],
    ['client_cancel', 'Cancel'],
  ],
  confirmed: [
    ['completed', 'Mark complete'],
    ['late_arrival_cancel', 'No-show / 10-min late'],
    ['client_cancel', 'Cancel'],
  ],
  completed: [],
  client_cancel: [],
  late_cancel: [],
  late_arrival_cancel: [],
}

export default function AdminApp() {
  const [pass, setPass] = useState('')
  const [entered, setEntered] = useState('')
  const [authed, setAuthed] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [tab, setTab] = useState('bookings')

  async function login(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const ok = await adminCheck(entered)
      if (ok) {
        setPass(entered)
        setAuthed(true)
      } else {
        setError('That passcode is not right.')
      }
    } catch (err) {
      setError(err.message || 'Could not reach the server.')
    } finally {
      setBusy(false)
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <Shell>
        <p className="max-w-sm text-center text-sm text-ink/70">
          The admin dashboard needs the database connected. Add your{' '}
          <code className="rounded bg-greige px-1">VITE_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-greige px-1">VITE_SUPABASE_ANON_KEY</code> to go live.
        </p>
      </Shell>
    )
  }

  if (!authed) {
    return (
      <Shell>
        <form onSubmit={login} className="w-full max-w-xs text-center">
          <Wordmark size="md" />
          <p className="label mt-6 mb-2">Studio access</p>
          <input
            type="password"
            className="input text-center"
            placeholder="Passcode"
            value={entered}
            onChange={(e) => setEntered(e.target.value)}
            autoFocus
          />
          {error && <p className="mt-3 text-[13px] text-ink">{error}</p>}
          <button className="pill pill-solid mt-5 w-full" disabled={busy || !entered}>
            {busy ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </Shell>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b hairline bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-3">
          <Wordmark size="sm" />
          <button onClick={() => setAuthed(false)} className="text-[12px] font-semibold uppercase tracking-wide text-ink/50">
            Lock
          </button>
        </div>
        <div className="mx-auto flex max-w-2xl gap-2 px-5 pb-3">
          {[
            ['bookings', 'Bookings'],
            ['settings', 'Availability'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`pill ${tab === id ? 'pill-solid' : 'pill-outline'} px-6`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {tab === 'bookings' ? <Bookings pass={pass} /> : <SettingsPanel pass={pass} />}
      </main>
    </div>
  )
}

function Shell({ children }) {
  return <div className="flex min-h-screen items-center justify-center bg-paper px-6">{children}</div>
}

/* ── Bookings tab ──────────────────────────────────────────────────────── */
function Bookings({ pass }) {
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState(null)

  const today = new Date().toISOString().slice(0, 10)

  const load = useCallback(async () => {
    try {
      setError('')
      const rows = await adminListBookings(pass, today)
      setBookings(rows)
    } catch (err) {
      setError(err.message || 'Could not load bookings.')
    }
  }, [pass, today])

  useEffect(() => {
    load()
  }, [load])

  async function setStatus(id, status) {
    setPendingId(id)
    try {
      await adminSetStatus(pass, id, status)
      await load()
    } catch (err) {
      setError(err.message || 'Could not update.')
    } finally {
      setPendingId(null)
    }
  }

  if (error) return <p className="text-sm text-ink">{error}</p>
  if (!bookings) return <p className="text-sm text-ink/50">Loading…</p>
  if (bookings.length === 0)
    return (
      <div className="py-16 text-center">
        <p className="label mb-2">All clear</p>
        <p className="text-sm text-ink/60">No upcoming bookings yet.</p>
      </div>
    )

  // Group by date.
  const byDate = bookings.reduce((acc, b) => {
    ;(acc[b.date] ||= []).push(b)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(byDate).map(([date, list]) => (
        <section key={date}>
          <h2 className="label mb-3">{prettyDate(date)}</h2>
          <div className="space-y-3">
            {list.map((b) => (
              <BookingCard
                key={b.id}
                b={b}
                busy={pendingId === b.id}
                onSet={(status) => setStatus(b.id, status)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function BookingCard({ b, busy, onSet }) {
  const meta = STATUS_META[b.status] || STATUS_META.pending
  const actions = ACTIONS[b.status] || []
  const wa = `https://wa.me/${(b.client_phone || '').replace(/[^0-9]/g, '').replace(/^0/, '27')}`

  return (
    <article className="rounded-2xl border hairline p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg uppercase leading-none">{b.service_name}</p>
          <p className="mt-1 text-[13px] text-ink/60">
            {to12h(b.time)} · {rand(b.total)} · deposit {rand(b.deposit)}
            {b.is_quiet && ' · quiet 2×'}
            {b.is_callout && b.group_size ? ` · ${b.group_size} people` : ''}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${meta.tone}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3 border-t hairline pt-3 text-[13px]">
        <span className="font-semibold">{b.client_name}</span>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="text-ink/60 underline underline-offset-2">
          {b.client_phone}
        </a>
      </div>
      {b.notes && <p className="mt-2 text-[13px] text-ink/60">“{b.notes}”</p>}

      {actions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map(([status, label]) => (
            <button
              key={status}
              disabled={busy}
              onClick={() => onSet(status)}
              className={`pill px-5 text-[12px] ${
                status === 'completed' || status === 'confirmed' ? 'pill-solid' : 'pill-outline'
              } disabled:opacity-40`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {b.status === 'completed' && (
        <p className="mt-3 text-[12px] text-ink/45">Glam Card stamp issued on completion.</p>
      )}
    </article>
  )
}

/* ── Availability / settings tab ───────────────────────────────────────── */
function SettingsPanel({ pass }) {
  const [s, setS] = useState(null)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')

  useEffect(() => {
    fetchSettings().then(setS)
  }, [])

  if (!s) return <p className="text-sm text-ink/50">Loading…</p>

  const setHours = (day, patch) => {
    const wh = { ...s.working_hours }
    if (patch === null) wh[day] = null
    else wh[day] = { ...(wh[day] || { open: '08:00', close: '17:00' }), ...patch }
    setS({ ...s, working_hours: wh })
  }

  const toggleQuietDay = (day) => {
    const set = new Set(s.quiet?.weekdays || [])
    const n = Number(day)
    set.has(n) ? set.delete(n) : set.add(n)
    setS({ ...s, quiet: { ...s.quiet, weekdays: [...set].sort() } })
  }

  async function save() {
    setSaving(true)
    setError('')
    setNote('')
    try {
      const patch = {
        working_hours: s.working_hours,
        quiet: s.quiet,
        buffer_minutes: Number(s.buffer_minutes),
        slot_interval_minutes: Number(s.slot_interval_minutes),
        max_bookings_per_day: Number(s.max_bookings_per_day),
        min_lead_hours: Number(s.min_lead_hours),
        deposit_rate: Number(s.deposit_rate),
      }
      const updated = await adminUpdateSettings(pass, patch)
      setS((cur) => ({ ...cur, ...updated }))
      setNote('Saved.')
    } catch (err) {
      setError(err.message || 'Could not save.')
    } finally {
      setSaving(false)
    }
  }

  async function addBlackout() {
    if (!newDate) return
    try {
      const updated = await adminAddBlackout(pass, newDate)
      setS((cur) => ({ ...cur, blackout_dates: updated.blackout_dates }))
      setNewDate('')
    } catch (err) {
      setError(err.message)
    }
  }
  async function removeBlackout(d) {
    try {
      const updated = await adminRemoveBlackout(pass, d)
      setS((cur) => ({ ...cur, blackout_dates: updated.blackout_dates }))
    } catch (err) {
      setError(err.message)
    }
  }

  async function changePasscode() {
    setError('')
    setNote('')
    try {
      await adminSetPasscode(oldPass, newPass)
      setOldPass('')
      setNewPass('')
      setNote('Passcode changed.')
    } catch (err) {
      setError(err.message || 'Could not change passcode.')
    }
  }

  return (
    <div className="space-y-10">
      {/* Working hours */}
      <section>
        <h2 className="label mb-4">Working hours</h2>
        <div className="space-y-2">
          {DAYS.map(([day, name]) => {
            const h = s.working_hours[day]
            return (
              <div key={day} className="flex items-center gap-3">
                <span className="w-10 text-[13px] font-semibold">{name}</span>
                {h ? (
                  <>
                    <input
                      type="time"
                      value={h.open}
                      onChange={(e) => setHours(day, { open: e.target.value })}
                      className="input flex-1 py-2"
                    />
                    <input
                      type="time"
                      value={h.close}
                      onChange={(e) => setHours(day, { close: e.target.value })}
                      className="input flex-1 py-2"
                    />
                    <button onClick={() => setHours(day, null)} className="text-[12px] text-ink/50 underline">
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-[13px] text-ink/40">Closed</span>
                    <button onClick={() => setHours(day, {})} className="text-[12px] text-ink underline">
                      Open
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Rules */}
      <section className="grid grid-cols-2 gap-4">
        <NumField label="Buffer (min)" value={s.buffer_minutes} onChange={(v) => setS({ ...s, buffer_minutes: v })} />
        <NumField label="Slot every (min)" value={s.slot_interval_minutes} onChange={(v) => setS({ ...s, slot_interval_minutes: v })} />
        <NumField label="Max / day" value={s.max_bookings_per_day} onChange={(v) => setS({ ...s, max_bookings_per_day: v })} />
        <NumField label="Min lead (hrs)" value={s.min_lead_hours} onChange={(v) => setS({ ...s, min_lead_hours: v })} />
        <NumField
          label="Deposit %"
          value={Math.round(s.deposit_rate * 100)}
          onChange={(v) => setS({ ...s, deposit_rate: Number(v) / 100 })}
        />
      </section>

      {/* Quiet slots */}
      <section>
        <h2 className="label mb-3">Quiet slots (double stamp)</h2>
        <p className="mb-3 text-[13px] text-ink/60">Weekdays and a cut-off time to reward flexible bookings.</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {DAYS.map(([day, name]) => {
            const on = (s.quiet?.weekdays || []).includes(Number(day))
            return (
              <button
                key={day}
                onClick={() => toggleQuietDay(day)}
                className={`pill px-4 text-[12px] ${on ? 'pill-solid' : 'pill-outline'}`}
              >
                {name}
              </button>
            )
          })}
        </div>
        <label className="flex items-center gap-3 text-[13px]">
          <span className="text-ink/60">Slots starting at or before</span>
          <input
            type="time"
            value={s.quiet?.before || '12:00'}
            onChange={(e) => setS({ ...s, quiet: { ...s.quiet, before: e.target.value } })}
            className="input w-32 py-2"
          />
        </label>
      </section>

      <button onClick={save} disabled={saving} className="pill pill-solid w-full disabled:opacity-40">
        {saving ? 'Saving…' : 'Save availability'}
      </button>
      {note && <p className="text-center text-[13px] text-ink">{note}</p>}
      {error && <p className="text-center text-[13px] text-ink">{error}</p>}

      {/* Blackout dates */}
      <section className="border-t hairline pt-8">
        <h2 className="label mb-3">Days off (blackout dates)</h2>
        <div className="mb-3 flex flex-wrap gap-2">
          {(s.blackout_dates || []).length === 0 && (
            <span className="text-[13px] text-ink/40">None set.</span>
          )}
          {(s.blackout_dates || []).map((d) => (
            <span key={d} className="inline-flex items-center gap-2 rounded-full bg-greige px-3 py-1.5 text-[12px]">
              {prettyDate(d)}
              <button onClick={() => removeBlackout(d)} aria-label={`Remove ${d}`} className="text-ink/50">
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="input flex-1 py-2" />
          <button onClick={addBlackout} className="pill pill-outline px-6">
            Add
          </button>
        </div>
      </section>

      {/* Passcode */}
      <section className="border-t hairline pt-8">
        <h2 className="label mb-3">Change passcode</h2>
        <div className="space-y-2">
          <input
            type="password"
            placeholder="Current passcode"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="input py-2"
          />
          <input
            type="password"
            placeholder="New passcode (min 6)"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="input py-2"
          />
          <button
            onClick={changePasscode}
            disabled={!oldPass || newPass.length < 6}
            className="pill pill-outline w-full disabled:opacity-40"
          >
            Update passcode
          </button>
        </div>
      </section>
    </div>
  )
}

function NumField({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="label mb-1.5 block">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input py-2"
      />
    </label>
  )
}
