import { rand, prettyDate } from './format.js'

// Build the prefilled WhatsApp link the confirmation step hands off to.
// Format matches the brief exactly.
export function whatsappBookingLink(booking, settings) {
  const { service, dateIso, time, total, deposit, name } = booking
  const msg =
    `Hi Doll Up! Booking: ${service} on ${prettyDate(dateIso)} at ${time}. ` +
    `Total ${rand(total)}, deposit ${rand(deposit)}. Name: ${name}. ` +
    `I'm attaching my proof of payment now.`
  return `https://wa.me/${settings.business.phone_e164.replace('+', '')}?text=${encodeURIComponent(msg)}`
}

// Generic "start a chat" link used by nav / footer CTAs.
export function whatsappLink(settings, text) {
  const base = `https://wa.me/${settings.business.phone_e164.replace('+', '')}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

// Normalise a SA phone number to WhatsApp's wa.me format (27XXXXXXXXX).
export function toWaNumber(phone) {
  const digits = (phone || '').replace(/[^0-9]/g, '')
  if (digits.startsWith('0')) return '27' + digits.slice(1)
  if (digits.startsWith('27')) return digits
  return digits
}

// Doll Up -> client: send the "you're confirmed" details link on WhatsApp.
// Zero cost — opens her normal WhatsApp with the message ready to send.
export function whatsappSendDetails(booking, welcomeUrl, settings) {
  const name = (booking.client_name || '').split(' ')[0] || 'there'
  const msg =
    `Hi ${name}! It's Doll Up 👑 Your booking for ${booking.service_name} on ` +
    `${prettyDate(booking.date)} at ${booking.time} is confirmed. ` +
    `Here are your appointment details, the studio address and my policies: ${welcomeUrl}`
  return `https://wa.me/${toWaNumber(booking.client_phone)}?text=${encodeURIComponent(msg)}`
}

// Doll Up -> client: ask for a review after the appointment (Phase 2).
export function whatsappAskReview(booking, reviewUrl) {
  const name = (booking.client_name || '').split(' ')[0] || 'there'
  const msg =
    `Hi ${name}! Thank you for letting us doll you up ✨ We'd love your feedback — ` +
    `it only takes a moment: ${reviewUrl}`
  return `https://wa.me/${toWaNumber(booking.client_phone)}?text=${encodeURIComponent(msg)}`
}
