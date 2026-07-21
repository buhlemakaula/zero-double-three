import { useState, useEffect } from 'react'
import { fetchBookingPublic, submitReview } from '../lib/data.js'
import { prettyDate } from '../lib/format.js'
import { DEFAULT_SETTINGS } from '../lib/settings.js'
import Wordmark from './Wordmark.jsx'

// Post-appointment review page. Doll Up sends this link over WhatsApp after
// marking a booking complete. 4–5 star reviews are offered a one-tap Google
// review link; lower ratings are kept private for Doll Up.
function Stars({ value, onChange }) {
  return (
    <div className="flex justify-center gap-2" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="flex h-12 w-12 items-center justify-center text-3xl leading-none"
        >
          <span className={n <= value ? 'text-ink' : 'text-ink/20'}>★</span>
        </button>
      ))}
    </div>
  )
}

export default function Review({ id }) {
  const [state, setState] = useState({ loading: true })
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null) // { google_review_url }
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    fetchBookingPublic(id)
      .then((d) => alive && setState({ loading: false, data: d }))
      .catch(() => alive && setState({ loading: false, data: { found: false } }))
    return () => {
      alive = false
    }
  }, [id])

  async function submit() {
    if (!rating) return
    setSubmitting(true)
    setError('')
    try {
      const res = await submitReview(id, rating, comment)
      if (res.ok === false) {
        setError(
          res.reason === 'not_completed'
            ? 'Reviews open right after your appointment.'
            : 'We could not find this booking.',
        )
      } else {
        setDone({ google_review_url: res.google_review_url })
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const d = state.data

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-12 text-center">
        <a href="/" aria-label="Doll Up Hair & Nail Art home">
          <Wordmark size="md" />
        </a>

        <div className="mt-10 w-full">
          {state.loading ? (
            <p className="text-sm text-ink/50">Loading…</p>
          ) : !d || !d.found ? (
            <p className="text-sm text-ink/70">This review link looks incorrect or expired.</p>
          ) : done ? (
            <div className="animate-fade-up">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-2xl text-paper">
                ♥
              </div>
              <h1 className="display-title text-4xl">Thank you!</h1>
              {rating >= 4 && done.google_review_url ? (
                <>
                  <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-ink/70">
                    So glad you loved it! Would you share that on Google too? It helps Doll Up more
                    than you know.
                  </p>
                  <a
                    href={done.google_review_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill pill-solid mt-6 px-8"
                  >
                    Leave a Google review
                  </a>
                </>
              ) : (
                <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-ink/70">
                  Your feedback goes straight to Doll Up. Thank you for helping her grow. 💛
                </p>
              )}
              <div>
                <a href="/" className="mt-6 inline-block text-[13px] text-ink/50 underline">
                  Back to the website
                </a>
              </div>
            </div>
          ) : (
            <div className="animate-fade-up">
              <p className="label mb-3">Your visit</p>
              <h1 className="display-title text-3xl sm:text-4xl">How did we do?</h1>
              <p className="mt-3 text-sm text-ink/60">
                {d.service_name}
                {d.date ? ` · ${prettyDate(d.date)}` : ''}
              </p>

              <div className="mt-8">
                <Stars value={rating} onChange={setRating} />
              </div>

              <textarea
                className="input mt-6 min-h-[110px] resize-y text-left"
                placeholder="Tell us about your experience (optional)…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              {error && <p className="mt-3 text-[13px] text-ink">{error}</p>}

              <button
                onClick={submit}
                disabled={!rating || submitting}
                className="pill pill-solid mt-6 w-full disabled:opacity-30"
              >
                {submitting ? 'Sending…' : 'Submit review'}
              </button>
              <p className="mt-4 text-[12px] text-ink/40">
                4 to 5 star reviews may appear on the {DEFAULT_SETTINGS.business.name} website.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
