import { whatsappLink } from '../lib/whatsapp.js'

const HOURS = [
  ['Sun', 'Closed'],
  ['Mon to Wed', '08:00 to 17:00'],
  ['Thursday', '08:00 to 18:00'],
  ['Friday', '07:00 to 19:00'],
  ['Saturday', '07:00 to 16:00'],
]

export default function HoursContact({ settings }) {
  const b = settings.business
  return (
    <section id="contact" className="scroll-mt-20 border-t hairline bg-paper py-20 sm:py-28">
      <div className="shell">
        {/* Two columns split by a thin vertical hairline */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-0">
          {/* Hours */}
          <div className="md:pr-14">
            <p className="label mb-3">When</p>
            <h2 className="display-title mb-8 text-4xl sm:text-5xl">Business hours</h2>
            <dl className="space-y-3">
              {HOURS.map(([day, time]) => (
                <div key={day} className="flex justify-between border-b hairline pb-3 text-sm">
                  <dt className="text-ink/60">{day}</dt>
                  <dd className="font-semibold">{time}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[13px] text-ink/55">
              By appointment only · bookings close 24 hours before each slot.
            </p>
          </div>

          {/* Contact — hairline divider on md+ */}
          <div className="md:border-l md:border-ink/10 md:pl-14">
            <p className="label mb-3">Where &amp; how</p>
            <h2 className="display-title mb-8 text-4xl sm:text-5xl">Get in touch</h2>
            <ul className="space-y-5 text-sm">
              <li>
                <span className="label block">Location</span>
                <span className="mt-1 block text-[15px]">{b.address || b.location}</span>
              </li>
              <li>
                <span className="label block">WhatsApp / Call</span>
                <a
                  href={whatsappLink(settings, 'Hi Doll Up! I’d like to book an appointment.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-[15px] font-semibold underline underline-offset-2"
                >
                  {b.phone_display}
                </a>
              </li>
              <li>
                <span className="label block">Instagram</span>
                <a
                  href={b.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-[15px] font-semibold underline underline-offset-2"
                >
                  @{b.instagram}
                </a>
              </li>
              {b.facebook_url && (
                <li>
                  <span className="label block">Facebook</span>
                  <a
                    href={b.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[15px] font-semibold underline underline-offset-2"
                  >
                    Doll Up Hair &amp; Nail Art
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
