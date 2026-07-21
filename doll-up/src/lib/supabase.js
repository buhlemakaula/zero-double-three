import { createClient } from '@supabase/supabase-js'

// Reads Vite env vars. When they are absent (e.g. a preview deploy without a
// project wired yet) the app runs entirely on seeded in-memory data — see
// data.js — so the site is always fully browsable and the booking flow works.
//
// Values are sanitised: the URL and anon key are pure printable ASCII, but a
// stray whitespace, newline, or invisible unicode char (easy to introduce when
// pasting the key into a hosting dashboard on mobile) would otherwise crash
// every request with "Headers: String contains non ISO-8859-1 code point".
const clean = (v) => (v || '').replace(/[^\x20-\x7E]/g, '').trim()
const url = clean(import.meta.env.VITE_SUPABASE_URL)
const anonKey = clean(import.meta.env.VITE_SUPABASE_ANON_KEY)

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
