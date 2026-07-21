import { useState } from 'react'
import { submitEnquiry } from '../lib/data.js'
import { whatsappLink } from '../lib/whatsapp.js'

const WINDOWS = ['ASAP', 'This morning', 'This afternoon', 'This evening', 'Tomorrow']

// "The Glow Line" — a warm, low-pressure way to ask Doll Up to call. Turns
// hesitant browsers into a conversation (her superpower) instead of a bounce.
export default function GlowLine({ settings }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '', preferred: '' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const tel = `tel:${settings.business.phone_e164}`

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return
    setBusy(true)
    setError('')
    try {
      await submitEnquiry(form)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try calling instead.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="glow" className="scroll-mt-20 border-t hairline bg-paper py-20 sm:py-28">
      <div className="shell grid items-center gap-12 md:grid-cols-2">
        {/* Pitch */}
        <div>
          <p className="label mb-3">The Glow Line</p>
          <h2 className="display-title text-5xl sm:text-6xl">
            Rather
            <br />
            talk it
            <br />
            through?
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/70">
            Not sure which look is you, planning a big day, or booking for a group? Leave your
            number and <strong className="font-semibold">Doll Up will call you</strong>. No pressure,
            just a friendly chat to get it perfect.
          </p>
          <a href={tel} className="pill pill-outline mt-6 px-8">
            Or call now · {settings.business.phone_display}
          </a>
        </div>

        {/* Form / success */}
        <div className="rounded-[28px] border hairline bg-greige/40 p-6 sm:p-8">
          {done ? (
            <div className="py-8 text-center animate-fade-up">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ink text-2xl text-paper">
                ✓
              </div>
              <h3 className="display-title text-3xl">She’ll call you</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink/70">
                Doll Up has your details and will be in touch{form.preferred ? ` ${form.preferred.toLowerCase()}` : ' soon'}. 💛
              </p>
              <a
                href={whatsappLink(settings, `Hi Doll Up! It's ${form.name.split(' ')[0]}, I just asked for a call.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-outline mt-6 px-6 text-[12px]"
              >
                Message on WhatsApp instead
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <label className="block">
                <span className="label mb-1.5 block">Your name *</span>
                <input className="input" value={form.name} onChange={set('name')} autoComplete="name" />
              </label>
              <label className="block">
                <span className="label mb-1.5 block">Phone number *</span>
                <input
                  className="input"
                  value={form.phone}
                  onChange={set('phone')}
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>
              <label className="block">
                <span className="label mb-1.5 block">What’s it about? (optional)</span>
                <textarea
                  className="input min-h-[70px] resize-y"
                  value={form.message}
                  onChange={set('message')}
                  placeholder="e.g. braids for a wedding, a group of 4, not sure what suits me…"
                />
              </label>
              <div>
                <span className="label mb-2 block">Best time to call</span>
                <div className="flex flex-wrap gap-2">
                  {WINDOWS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setForm({ ...form, preferred: form.preferred === w ? '' : w })}
                      className={`pill px-4 text-[12px] ${form.preferred === w ? 'pill-solid' : 'pill-outline'}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-[13px] text-ink">{error}</p>}
              <button
                disabled={busy || !form.name.trim() || !form.phone.trim()}
                className="pill pill-solid w-full disabled:opacity-30"
              >
                {busy ? 'Sending…' : 'Ask Doll Up to call me'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
