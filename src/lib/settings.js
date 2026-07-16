// Single source of truth the artist controls.
// In production this mirrors the `settings` row in Supabase; edited from an
// admin surface, never from the client. Deposit math and slot generation both
// derive from here — nothing about money or availability is hardcoded in the UI.
export const DEFAULT_SETTINGS = {
  // Deposit rate applied to a service price to secure a booking.
  // 0.5 = 50% for everyone; Trusted Clients get 0.25 (see loyalty.js).
  deposit_rate: 0.5,
  trusted_deposit_rate: 0.25,

  // Working hours per weekday (0 = Sunday … 6 = Saturday).
  // null = closed that day. Times are 24h "HH:MM" in SAST.
  working_hours: {
    0: null, // Sunday — closed
    1: { open: '08:00', close: '17:00' },
    2: { open: '08:00', close: '17:00' },
    3: { open: '08:00', close: '17:00' },
    4: { open: '08:00', close: '18:00' },
    5: { open: '07:00', close: '19:00' },
    6: { open: '07:00', close: '16:00' },
  },

  slot_interval_minutes: 30, // granularity of the time picker
  buffer_minutes: 30, // gap kept clear between two bookings
  max_bookings_per_day: 4, // one-person business — a hard ceiling
  min_lead_hours: 24, // no same-day surprise bookings

  // Specific dates the artist is unavailable (YYYY-MM-DD).
  blackout_dates: ['2026-12-25', '2026-12-26', '2026-01-01'],

  // Slots the artist wants to fill — weekday mornings. A booking that starts
  // at or before this time on a weekday is flagged "quiet" and earns a double
  // stamp (see loyalty.js). Fills dead hours without discounting the price.
  quiet: {
    weekdays: [1, 2, 3, 4], // Mon–Thu
    before: '12:00', // slots starting at/before noon
  },

  business: {
    name: 'Glammified by Kwannz',
    trader: 'NZ Myeni',
    location: 'Pietermaritzburg, KZN',
    phone_display: '073 808 6990',
    phone_e164: '+27738086990',
    instagram: 'Glamified_byKwannz',
    instagram_url: 'https://instagram.com/Glamified_byKwannz',
    bank: {
      bank: 'FNB',
      account_name: 'NZ Myeni T/A Glamified by Kwannz',
      account_number: '6300 4783 212',
    },
  },
}
