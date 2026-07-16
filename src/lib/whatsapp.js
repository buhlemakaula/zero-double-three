import { rand, prettyDate } from './format.js'

// Build the prefilled WhatsApp link the confirmation step hands off to.
// Format matches the brief exactly.
export function whatsappBookingLink(booking, settings) {
  const { service, dateIso, time, total, deposit, name } = booking
  const msg =
    `Hi Kwannz! Booking: ${service} on ${prettyDate(dateIso)} at ${time}. ` +
    `Total ${rand(total)}, deposit ${rand(deposit)}. Name: ${name}. POP attached.`
  return `https://wa.me/${settings.business.phone_e164.replace('+', '')}?text=${encodeURIComponent(msg)}`
}

// Generic "start a chat" link used by nav / footer CTAs.
export function whatsappLink(settings, text) {
  const base = `https://wa.me/${settings.business.phone_e164.replace('+', '')}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
