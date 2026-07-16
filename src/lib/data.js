// Data-access layer. Every read/write goes through here so components never
// care whether they're talking to Supabase or the seeded fallback.
//
// With Supabase configured, reads hit the tables and writes go through
// SECURITY DEFINER RPCs (book_appointment / booked_slots) so the public site
// never touches client PII directly and clients are de-duped by phone.
//
// Without credentials, everything resolves against the static seed and an
// in-memory booking store that lives only for the tab's lifetime. No
// localStorage.
import { supabase, isSupabaseConfigured } from './supabase.js'
import { SERVICES } from '../data/services.js'
import { PORTFOLIO } from '../data/portfolio.js'
import { DEFAULT_SETTINGS } from './settings.js'

const memoryBookings = []

export async function fetchServices() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('services').select('*').order('sort')
    if (!error && data?.length) return data
  }
  return SERVICES
}

export async function fetchPortfolio() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('portfolio_images').select('*').order('sort')
    if (!error && data?.length) return data
  }
  return PORTFOLIO
}

// Live settings the artist controls. Falls back to defaults if unavailable.
export async function fetchSettings() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single()
    if (!error && data) {
      return {
        ...DEFAULT_SETTINGS,
        ...data,
        // numerics can arrive as strings from PostgREST
        deposit_rate: Number(data.deposit_rate),
        trusted_deposit_rate: Number(data.trusted_deposit_rate),
        // keep the rich business object from defaults if the row's is empty
        business:
          data.business && Object.keys(data.business).length
            ? data.business
            : DEFAULT_SETTINGS.business,
      }
    }
  }
  return DEFAULT_SETTINGS
}

// Bookings already taken on a date (busy ranges only, no PII).
export async function fetchBookedSlots(dateIso) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('booked_slots', { d: dateIso })
    if (!error && data) return data
  }
  return memoryBookings.filter((b) => b.date === dateIso)
}

// Create a pending booking. Returns { booking_id, client_id, referral_code }.
export async function createBooking(payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.rpc('book_appointment', {
      p_service_id: payload.service_id,
      p_service_name: payload.service_name,
      p_addons: payload.addons ?? [],
      p_is_callout: payload.is_callout ?? false,
      p_group_size: payload.group_size ?? null,
      p_date: payload.date,
      p_time: payload.time,
      p_duration_min: payload.duration_min ?? null,
      p_total: payload.total,
      p_deposit: payload.deposit,
      p_is_quiet: payload.is_quiet ?? false,
      p_referral_code: payload.referral_code ?? null,
      p_name: payload.client_name,
      p_phone: payload.client_phone,
      p_email: payload.client_email ?? '',
      p_notes: payload.notes ?? '',
    })
    if (!error && data) return { id: data.booking_id, ...data, ...payload, status: 'pending' }
    if (error) throw error
  }
  const rec = { id: `local-${Date.now()}`, ...payload, status: 'pending' }
  memoryBookings.push(rec)
  return rec
}
