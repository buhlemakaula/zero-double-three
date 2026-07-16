import {
  STAMPS_PER_REWARD,
  REWARD_VALUE,
  TRUSTED_AFTER,
} from '../lib/loyalty.js'
import { rand } from '../lib/format.js'

// Monochrome 6-circle stamp row. Filled = solid ink, empty = hairline outline.
function StampRow({ filled = 0, total = STAMPS_PER_REWARD }) {
  return (
    <div className="flex items-center justify-center gap-3" aria-label={`${filled} of ${total} stamps`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold ${
            i < filled ? 'bg-ink text-paper' : 'border border-ink/30 text-ink/40'
          }`}
        >
          {i + 1}
        </span>
      ))}
    </div>
  )
}

const PERKS = [
  {
    title: 'Stamp per booking',
    body: `Every completed, paid booking earns a stamp. ${STAMPS_PER_REWARD} stamps = ${rand(
      REWARD_VALUE,
    )} off or a free customisation, your pick.`,
  },
  {
    title: 'Double on quiet slots',
    body: 'Book a flagged weekday-morning slot and earn 2 stamps. Same price, more reward for being flexible.',
  },
  {
    title: 'Referral stamp',
    body: 'Share your code. When a friend books with it, you both earn a stamp.',
  },
  {
    title: 'Group bonus',
    body: 'Call-outs earn a stamp for every person in the group. One trip, many faces.',
  },
]

export default function GlamCard() {
  return (
    <section className="scroll-mt-20 border-t hairline bg-paper py-20 sm:py-28">
      <div className="shell">
        <header className="mb-12 text-center">
          <p className="label mb-3">Rewards</p>
          <h2 className="display-title text-5xl sm:text-6xl">The Glam Card</h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">
            One card, one simple rule. Collect {STAMPS_PER_REWARD} stamps and
            claim {rand(REWARD_VALUE)} off or a free customisation.
          </p>
        </header>

        {/* The card */}
        <div className="mx-auto max-w-xl rounded-[28px] border hairline bg-greige/50 p-8 sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <span className="label">Glam Card</span>
            <span className="font-serif text-lg italic text-ink/70">Kwannz.</span>
          </div>
          <StampRow filled={0} />
          <p className="mt-6 text-center text-[13px] text-ink/60">
            {STAMPS_PER_REWARD} stamps → {rand(REWARD_VALUE)} off or a free customisation
          </p>
        </div>

        {/* Perks */}
        <div className="mx-auto mt-14 grid max-w-3xl gap-x-10 gap-y-8 sm:grid-cols-2">
          {PERKS.map((p) => (
            <div key={p.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/70">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Trusted Client */}
        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border hairline p-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
            Trusted Client
          </span>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-ink/75">
            Show up {TRUSTED_AFTER} times with no late cancellations and no
            10-minute-late arrivals to unlock Trusted Client status. Your
            deposit drops to <strong className="font-semibold">25%</strong> and
            you get priority on the waitlist for cancelled peak slots.
          </p>
          <p className="mt-3 text-[12px] text-ink/50">
            Stamps expire after 12 months · rewards aren’t stackable · status is
            revoked on a late cancellation.
          </p>
        </div>
      </div>
    </section>
  )
}
