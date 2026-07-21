// Booking policies rendered verbatim in a 4-column icon block with hairline
// separators.
const ICONS = {
  booking: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  late: 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z',
  deposit: 'M3 7h18v12H3zM3 10h18M7 15h4',
  prep: 'M20 6L9 17l-5-5',
}

export default function Policies({ settings }) {
  const bank = settings.business.bank
  const cols = [
    {
      icon: 'booking',
      title: 'Booking',
      body: (
        <>
          A <strong className="font-semibold">non-refundable</strong> booking
          fee secures all appointments. It is <strong className="font-semibold">50%</strong>{' '}
          of the service total. The remaining balance is paid on the day.{' '}
          <strong className="font-semibold">A speed point is available.</strong>
        </>
      ),
    },
    {
      icon: 'late',
      title: 'Late arrivals',
      body: (
        <>
          After <strong className="font-semibold">15 minutes</strong> the
          appointment is cancelled (no additional charges) and the deposit is
          not refunded. Braiding takes time, so please arrive on time.
        </>
      ),
    },
    {
      icon: 'deposit',
      title: 'Deposit payment',
      body: (
        <>
          Bank <strong className="font-semibold">{bank.bank}</strong>
          <br />
          {bank.account_name}
          <br />
          Acc <strong className="font-semibold">{bank.account_number}</strong>
          <br />
          Use your <strong className="font-semibold">name &amp; surname</strong>{' '}
          as reference and send proof of payment.
        </>
      ),
    },
    {
      icon: 'prep',
      title: 'Come prepared',
      body: (
        <>
          Arrive with hair <strong className="font-semibold">washed &amp;
          detangled</strong>. Bringing your own braiding hair? Have it ready, or
          add <strong className="font-semibold">Wash &amp; treatment</strong> and
          we will prep for you.
        </>
      ),
    },
  ]

  return (
    <section className="border-t hairline bg-paper py-20 sm:py-28">
      <div className="shell">
        <header className="mb-12 text-center">
          <p className="label mb-3">The fine print</p>
          <h2 className="display-title text-5xl sm:text-6xl">Booking policies</h2>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((c, i) => (
            <div
              key={c.title}
              className={`px-0 py-6 sm:px-6 lg:py-0 ${
                i > 0 ? 'border-t hairline sm:border-t-0 lg:border-l' : ''
              } ${i === 1 ? 'lg:border-l' : ''}`}
            >
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-greige">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 stroke-ink"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={ICONS[c.icon]} />
                </svg>
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wide">{c.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
