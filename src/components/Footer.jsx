import Wordmark from './Wordmark.jsx'
import { whatsappLink } from '../lib/whatsapp.js'

export default function Footer({ settings, onBook }) {
  const b = settings.business
  return (
    <footer className="bg-paper py-16">
      <div className="shell">
        <div className="flex flex-col items-center gap-8 text-center">
          <Wordmark size="md" />

          <p className="font-serif text-2xl italic text-ink/70">Let your face be my canvas.</p>

          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink(settings, 'Hi Kwannz! I’d like to book an appointment.')}
              target="_blank"
              rel="noopener noreferrer"
              className="pill pill-solid"
            >
              WhatsApp · {b.phone_display}
            </a>
            <a href={b.instagram_url} target="_blank" rel="noopener noreferrer" className="pill pill-outline">
              @{b.instagram}
            </a>
            <button onClick={onBook} className="pill pill-greige">
              Book now
            </button>
          </div>

          <p className="text-[12px] uppercase tracking-wide text-ink/45">
            {b.location} · {b.trader} T/A {b.name}
          </p>
          <p className="text-[11px] text-ink/35">© {new Date().getFullYear()} {b.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
