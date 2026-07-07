// Connect trades 06:00 → 01:00 (next day) in Durban (Africa/Johannesburg, UTC+2).
export const OPEN_HOUR = 6 // 06:00
export const CLOSE_HOUR = 1 // 01:00 next day

function durbanNow(): Date {
  // Africa/Johannesburg has no DST; SAST = UTC+2 year-round.
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + 2 * 3600000)
}

export interface StoreStatus {
  open: boolean
  label: string
  detail: string
}

export function storeStatus(): StoreStatus {
  const d = durbanNow()
  const h = d.getHours()
  const m = d.getMinutes()
  // Open window: [06:00, 24:00) ∪ [00:00, 01:00)
  const open = h >= OPEN_HOUR || h < CLOSE_HOUR

  if (open) {
    // minutes until 01:00
    let closesInMin: number
    if (h < CLOSE_HOUR) closesInMin = (CLOSE_HOUR - h) * 60 - m
    else closesInMin = (24 - h + CLOSE_HOUR) * 60 - m
    const closingSoon = closesInMin <= 45
    return {
      open: true,
      label: closingSoon ? 'Closing soon' : 'Open now',
      detail: closingSoon ? `Last orders in ${closesInMin} min` : 'Curbside & delivery · until 01:00',
    }
  }
  // Closed: opens at 06:00
  const opensInMin = (OPEN_HOUR - h) * 60 - m
  const hrs = Math.floor(opensInMin / 60)
  const mins = opensInMin % 60
  return {
    open: false,
    label: 'Closed',
    detail: `Opens 06:00 · in ${hrs > 0 ? `${hrs}h ` : ''}${mins}m`,
  }
}

export function durbanClock(): string {
  const d = durbanNow()
  return d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false })
}
