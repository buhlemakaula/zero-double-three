// Slot generation, all derived from the settings object the artist controls.
// Nothing here is hardcoded: working hours, buffer, max/day, blackout dates,
// lead time and quiet flags all come from `settings`.
import { isQuietSlot } from './loyalty.js'

const pad = (n) => String(n).padStart(2, '0')

export function toIso(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function minutesOf(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
function toHHMM(mins) {
  return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`
}

// Is a given YYYY-MM-DD bookable at all (open day, not blacked out)?
export function isDateOpen(iso, settings) {
  if (settings.blackout_dates.includes(iso)) return false
  const [y, m, d] = iso.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  return Boolean(settings.working_hours[weekday])
}

// Build the next N selectable days for the date picker.
export function upcomingDays(settings, count = 21, from = new Date()) {
  const days = []
  const cursor = new Date(from)
  cursor.setHours(0, 0, 0, 0)
  let scanned = 0
  while (days.length < count && scanned < count * 3) {
    const iso = toIso(cursor)
    days.push({
      iso,
      open: isDateOpen(iso, settings),
      weekday: cursor.getDay(),
    })
    cursor.setDate(cursor.getDate() + 1)
    scanned += 1
  }
  return days
}

// Generate bookable time slots for a date, honouring service duration, the
// buffer between bookings, the daily ceiling, the minimum lead time and any
// already-booked times.
export function slotsForDate(iso, service, settings, booked = [], now = new Date()) {
  if (!isDateOpen(iso, settings)) return []

  const [y, m, d] = iso.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  const hours = settings.working_hours[weekday]
  if (!hours) return []

  // Daily ceiling already reached?
  const bookedOnDay = booked.filter((b) => b.date === iso)
  if (bookedOnDay.length >= settings.max_bookings_per_day) return []

  const duration = service?.duration_min || 60
  const step = settings.slot_interval_minutes
  const buffer = settings.buffer_minutes
  const open = minutesOf(hours.open)
  const close = minutesOf(hours.close)
  const leadCutoff = new Date(now.getTime() + settings.min_lead_hours * 3600 * 1000)

  const bookedRanges = bookedOnDay.map((b) => {
    const start = minutesOf(b.time)
    return [start - buffer, start + (b.duration_min || duration) + buffer]
  })

  const slots = []
  for (let start = open; start + duration <= close; start += step) {
    const end = start + duration
    // Respect lead time.
    const slotStart = new Date(y, m - 1, d, Math.floor(start / 60), start % 60)
    if (slotStart < leadCutoff) continue
    // Clash with an existing booking (+ buffer)?
    const clash = bookedRanges.some(([bs, be]) => start < be && end > bs)
    if (clash) continue

    const time = toHHMM(start)
    slots.push({
      time,
      label: to12h(time),
      quiet: isQuietSlot(iso, time, settings),
    })
  }
  return slots
}

export function to12h(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${pad(m)} ${period}`
}
