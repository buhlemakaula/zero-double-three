// ZAR formatting — "R650", "R1,000". No decimals for whole-rand prices.
export function rand(amount) {
  if (amount == null || isNaN(amount)) return ''
  const rounded = Math.round(amount)
  return 'R' + rounded.toLocaleString('en-ZA')
}

export function minutesToLabel(min) {
  if (min == null) return null
  const h = Math.floor(min / 60)
  const m = min % 60
  const parts = []
  if (h) parts.push(`${h} hour${h > 1 ? 's' : ''}`)
  if (m) parts.push(`${m} minutes`)
  return parts.join(' ')
}

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Format a YYYY-MM-DD string without timezone drift.
export function prettyDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${WEEKDAY[dt.getDay()]} ${d} ${MONTH[m - 1]} ${y}`
}

export function shortDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTH[m - 1].slice(0, 3)}`
}
