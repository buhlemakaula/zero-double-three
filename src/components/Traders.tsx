import { motion } from 'framer-motion'
import { TrendingUp, Wallet, Megaphone, ArrowUpRight } from 'lucide-react'
import { useStore } from '../store'

const perks = [
  { icon: <Wallet size={16} />, t: 'Keep more', d: 'Flat, transparent commission — materially below the incumbents. No listing fees to start.' },
  { icon: <TrendingUp size={16} />, t: 'Own your data', d: 'Live sales, repeat-customer insight and demand heat-maps — yours to keep, not locked away.' },
  { icon: <Megaphone size={16} />, t: 'Be discovered', d: 'Editorial placement, launch-partner spotlights and CPG-funded promos put you in front of Durban.' },
]

export function Traders() {
  const setView = useStore((s) => s.setView)
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-luxe border border-line bg-ink p-8 sm:p-14 text-ivory"
      >
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-champagne/15 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="rounded-full border border-ivory/20 px-3 py-1 text-xs font-semibold text-ivory/80">
              For traders
            </span>
            <h2 className="display-tight mt-5 text-3xl sm:text-5xl font-semibold">
              A reason to be
              <br />
              <span className="italic text-champagne">on the app.</span>
            </h2>
            <p className="mt-5 max-w-md text-ivory/70">
              Grocers, cellars, kitchens and pharmacies keep more of every rand, own their customer
              relationship, and reach the curbside crowd the giants overlook.
            </p>
            <button
              onClick={() => setView('merchant')}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3.5 text-sm font-semibold text-ink transition-all active:scale-95 hover:shadow-float"
            >
              Open the trader dashboard
              <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <div className="grid gap-3">
            {perks.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-start gap-4 rounded-2xl border border-ivory/10 bg-ivory/[0.03] p-5"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-champagne text-ink">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">{p.t}</h3>
                  <p className="mt-1 text-sm text-ivory/60">{p.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
