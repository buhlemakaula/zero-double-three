import { motion } from 'framer-motion'
import { Car, CreditCard, Timer, Leaf } from 'lucide-react'
import { PAYMENT_METHODS } from '../store'

const steps = [
  { icon: <Timer size={18} />, t: 'Order in seconds', d: 'One bag across groceries, cellar and pharmacy. Save it, reorder it, schedule it.' },
  { icon: <Car size={18} />, t: 'We meet your boot', d: 'Pull in, tap “I’m here”. Your runner loads the car — you never leave your seat.' },
  { icon: <CreditCard size={18} />, t: 'Pay your way', d: 'Card, tap, EFT, wallet, split-later or cash. Checkout is one screen, always.' },
  { icon: <Leaf size={18} />, t: 'Handled with care', d: 'Cold-chain pouches, sealed cellar bags, ID & script checks — done right at the car.' },
]

export function Difference() {
  return (
    <section className="border-y border-line bg-ivory-deep/50">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-champagne">
            The curbside difference
          </p>
          <h2 className="display-tight mt-3 text-3xl sm:text-5xl font-semibold text-ink">
            Delivery is table stakes.
            <br />
            <span className="italic text-champagne">The kerb is ours.</span>
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            Sixty60 and Uber race to your door. Connect gives Durban a second lane — collect it
            curbside on your way home, in under three minutes, without parking or queueing.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-luxe border border-line bg-white/70 p-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-ivory">
                {s.icon}
              </div>
              <div className="mt-4 text-xs font-bold text-mist">0{i + 1}</div>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-snug text-mist">{s.d}</p>
            </motion.div>
          ))}
        </div>

        {/* Payment structures strip */}
        <div className="mt-14 rounded-luxe border border-line bg-white/60 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">Every way to pay</h3>
              <p className="mt-1 text-sm text-mist">Built for South Africa. Chosen at checkout in one tap.</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PAYMENT_METHODS.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-line bg-ivory p-3.5 text-center"
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className="mt-1.5 text-[13px] font-semibold text-ink">{m.name}</div>
                {m.badge && <div className="text-[10px] font-medium text-champagne">{m.badge}</div>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
