// Deposit math is always derived from settings — never hardcoded in the UI.
//   deposit = round( servicePrice * rate )
// Rate is 0.5 for everyone, 0.25 once a client earns Trusted status.

export function depositRate(settings, isTrusted) {
  return isTrusted ? settings.trusted_deposit_rate : settings.deposit_rate
}

export function depositFor(price, settings, isTrusted = false) {
  const rate = depositRate(settings, isTrusted)
  return Math.round(price * rate)
}

export function balanceFor(price, settings, isTrusted = false) {
  return price - depositFor(price, settings, isTrusted)
}
