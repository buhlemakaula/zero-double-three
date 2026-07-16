// ─────────────────────────────────────────────────────────────────────────
// THE GLAM CARD — loyalty logic
//
// Designed for a one-person business. The enemies are empty weekday slots,
// no-shows / late arrivals, and ad spend. Every rule below targets one of
// those, and every rand of reward is only ever paid out of work that already
// happened.
//
// These are pure functions: given booking history + settings, they compute
// stamps, reward eligibility, and Trusted-Client status. The `stamps` table
// is only ever written when a booking reaches status = 'completed'.
// ─────────────────────────────────────────────────────────────────────────

export const STAMPS_PER_REWARD = 6
export const REWARD_VALUE = 250 // R250 off OR a free customisation (R250 value)
export const TRUSTED_AFTER = 3 // clean completed bookings to earn Trusted status
export const STAMP_TTL_MONTHS = 12

// Reward options a client can spend a full card on. Not stackable.
export const REWARD_OPTIONS = [
  { id: 'discount', label: 'R250 off your next service' },
  { id: 'free-customisation', label: 'A free customisation (R250 value)' },
]

// ── Stamp earning ──────────────────────────────────────────────────────────
// Stamps a single COMPLETED booking is worth. Never call this at booking time
// or payment time — only once the artist marks the appointment complete.
//
//  base            1 stamp per completed, paid booking
//  quiet slot      +1 (total 2) — the load-bearing mechanic: fills dead
//                  weekday hours without discounting the headline price
//  referral        +1 to each side when a referral code is used
//  call-out group  1 stamp PER PERSON in the group (min 3) — rewards the
//                  highest-value, most efficient job: one trip, many faces
export function stampsForBooking(booking) {
  if (booking.status !== 'completed') return 0

  // A call-out is booked once for the whole group; the booker earns a stamp
  // for every face. This dominates the other bonuses and is not stacked on
  // top of them (it already reflects the size of the job).
  if (booking.is_callout) {
    return Math.max(booking.group_size || 3, 3)
  }

  let stamps = 1 // base
  if (booking.is_quiet) stamps += 1 // double stamp on a quiet slot
  if (booking.referral_applied) stamps += 1 // referral bonus for the booker
  return stamps
}

// Is a slot "quiet"? Weekday mornings the artist wants to fill.
// A quiet slot earns the double stamp.
export function isQuietSlot(dateIso, timeHHMM, settings) {
  if (!dateIso || !timeHHMM) return false
  const [y, m, d] = dateIso.split('-').map(Number)
  const weekday = new Date(y, m - 1, d).getDay()
  const q = settings.quiet
  if (!q || !q.weekdays.includes(weekday)) return false
  return timeHHMM <= q.before
}

// ── Card / reward progress ───────────────────────────────────────────────
// Given the client's currently-valid (non-expired) stamp count.
export function cardProgress(validStamps) {
  const total = validStamps % STAMPS_PER_REWARD
  const rewardsAvailable = Math.floor(validStamps / STAMPS_PER_REWARD)
  return {
    filled: rewardsAvailable > 0 ? STAMPS_PER_REWARD : total,
    outOf: STAMPS_PER_REWARD,
    rewardsAvailable,
    canRedeem: rewardsAvailable > 0,
    stampsToNext: rewardsAvailable > 0 ? 0 : STAMPS_PER_REWARD - total,
  }
}

// Count stamps that haven't expired (12-month TTL). Each stamp row carries the
// date it was earned.
export function validStamps(stampRows, now = new Date()) {
  const cutoff = new Date(now)
  cutoff.setMonth(cutoff.getMonth() - STAMP_TTL_MONTHS)
  return stampRows
    .filter((s) => new Date(s.earned_at) >= cutoff)
    .reduce((sum, s) => sum + (s.count || 1), 0)
}

// ── Trusted Client status ────────────────────────────────────────────────
// Reliability, not spend. Earned after 3 completed bookings with NO late
// cancellations and NO 10-minute-late cancellations. Revoked on a single
// late cancellation and must be re-earned from zero.
//
// Perks: deposit drops to 25% (see deposit.js) and priority on the waitlist
// for cancelled peak slots.
//
// `bookings` is the client's full history, oldest→newest.
export function trustedStatus(bookings) {
  let streak = 0
  let trusted = false

  for (const b of bookings) {
    if (b.status === 'late_cancel' || b.status === 'late_arrival_cancel') {
      // One strike resets everything and revokes the badge.
      streak = 0
      trusted = false
      continue
    }
    if (b.status === 'completed') {
      streak += 1
      if (streak >= TRUSTED_AFTER) trusted = true
    }
    // client_cancel with adequate notice is neutral: neither builds nor breaks.
  }

  return {
    trusted,
    cleanStreak: streak,
    toTrusted: trusted ? 0 : Math.max(0, TRUSTED_AFTER - streak),
  }
}

// A late cancellation / 10-min-late cancellation forfeits that booking's stamp.
// (Enforced by only ever issuing stamps for status = 'completed', but exposed
// here so the UI can explain it.)
export function forfeitsStamp(bookingStatus) {
  return bookingStatus === 'late_cancel' || bookingStatus === 'late_arrival_cancel'
}

// ── Full client summary for the Glam Card UI ─────────────────────────────
export function summariseClient({ bookings = [], stamps = [] }, now = new Date()) {
  const valid = validStamps(stamps, now)
  return {
    ...cardProgress(valid),
    validStamps: valid,
    ...trustedStatus(bookings),
    rewardOptions: REWARD_OPTIONS,
    rewardValue: REWARD_VALUE,
  }
}
