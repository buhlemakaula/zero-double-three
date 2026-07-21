// Thin wrappers over the passcode-gated admin RPCs. The passcode is passed on
// every call and is held only in React state for the session — never stored.
import { supabase, isSupabaseConfigured } from './supabase.js'

function assertConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('The admin dashboard needs Supabase connected (set the VITE_SUPABASE_* env vars).')
  }
}

export async function adminCheck(pass) {
  assertConfigured()
  const { data, error } = await supabase.rpc('admin_check', { pass })
  if (error) throw error
  return data === true
}

export async function adminListBookings(pass, fromDate) {
  assertConfigured()
  const { data, error } = await supabase.rpc('admin_list_bookings', { pass, from_date: fromDate })
  if (error) throw error
  return data || []
}

export async function adminSetStatus(pass, bookingId, status) {
  const { data, error } = await supabase.rpc('admin_set_status', {
    pass,
    b_id: bookingId,
    new_status: status,
  })
  if (error) throw error
  return data
}

export async function adminUpdateSettings(pass, patch) {
  const { data, error } = await supabase.rpc('admin_update_settings', { pass, patch })
  if (error) throw error
  return data
}

export async function adminAddBlackout(pass, d) {
  const { data, error } = await supabase.rpc('admin_add_blackout', { pass, d })
  if (error) throw error
  return data
}

export async function adminRemoveBlackout(pass, d) {
  const { data, error } = await supabase.rpc('admin_remove_blackout', { pass, d })
  if (error) throw error
  return data
}

export async function adminSetPasscode(oldPass, newPass) {
  const { data, error } = await supabase.rpc('admin_set_passcode', {
    pass_old: oldPass,
    pass_new: newPass,
  })
  if (error) throw error
  return data
}

export async function adminGetStudio(pass) {
  const { data, error } = await supabase.rpc('admin_get_studio', { pass })
  if (error) throw error
  return data || {}
}

export async function adminSetStudio(pass, address, note) {
  const { data, error } = await supabase.rpc('admin_set_studio', {
    pass,
    p_address: address,
    p_note: note,
  })
  if (error) throw error
  return data
}

export async function adminSetGoogleReview(pass, url) {
  const { data, error } = await supabase.rpc('admin_set_google_review', { pass, url })
  if (error) throw error
  return data
}

export async function adminListReviews(pass) {
  const { data, error } = await supabase.rpc('admin_list_reviews', { pass })
  if (error) throw error
  return data || []
}

export async function adminAddPush(pass, sub) {
  const { data, error } = await supabase.rpc('add_push_subscription', { pass, sub })
  if (error) throw error
  return data
}

export async function adminListEnquiries(pass) {
  const { data, error } = await supabase.rpc('admin_list_enquiries', { pass })
  if (error) throw error
  return data || []
}

export async function adminSetEnquiryStatus(pass, id, status) {
  const { data, error } = await supabase.rpc('admin_set_enquiry_status', {
    pass,
    e_id: id,
    new_status: status,
  })
  if (error) throw error
  return data
}
