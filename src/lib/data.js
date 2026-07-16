// Data-access layer. Every read/write goes through here so components never
// care whether they're talking to Supabase or the seeded fallback.
//
// When Supabase is configured, these hit the real tables. When it isn't, they
// resolve against the static seed data (services, portfolio) and record
// bookings into a per-session in-memory store. No localStorage — the store is
// a plain module-level array that lives only for the tab's lifetime.
import { supabase, isSupabaseConfigured } from './supabase.js'
import { SERVICES } from '../data/services.js'
import { PORTFOLIO } from '../data/portfolio.js'

// In-memory booking store for the no-backend fallback.
const memoryBookings = []

export async function fetchServices() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('services').select('*').order('price')
    if (!error && data?.length) return data
  }
  return SERVICES
}

export async function fetchPortfolio() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('portfolio_images')
      .select('*')
      .order('sort')
    if (!error && data?.length) return data
  }
  return PORTFOLIO
}

// Bookings already taken on a date — used to compute open slots.
export async function fetchBookedSlots(dateIso) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('bookings')
      .select('date,time,duration_min')
      .eq('date', dateIso)
      .in('status', ['pending', 'confirmed', 'completed'])
    if (!error && data) return data
  }
  return memoryBookings.filter((b) => b.date === dateIso)
}

// Create a booking in status 'pending' (awaiting deposit / confirmation).
// Stamps are NOT written here — only when status becomes 'completed'.
export async function createBooking(payload) {
  const record = { ...payload, status: 'pending', created_at: new Date().toISOString() }
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('bookings').insert(record).select().single()
    if (!error && data) return data
  }
  const withId = { id: `local-${Date.now()}`, ...record }
  memoryBookings.push(withId)
  return withId
}
