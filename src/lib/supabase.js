import { createClient } from '@supabase/supabase-js'

// Reads Vite env vars. When they are absent (e.g. a preview deploy without a
// project wired yet) the app runs entirely on seeded in-memory data — see
// data.js — so the site is always fully browsable and the booking flow works.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
