import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, ShieldCheck, Sparkles, Car } from 'lucide-react'
import { storeStatus } from '../lib/hours'

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function Hero({ onShop }: { onShop: () => void }) {
  const status = storeStatus()
  return (
    <section className="wash relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-14 pb-20 sm:pt-20 sm:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
          {/* Left — editorial copy */}
          <div>
            <motion.div variants={fade} custom={0} initial="hidden" animate="show">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-medium text-ink-soft">
                <Sparkles size={13} className="text-champagne" />
                Now serving Durban · uMhlanga · Ballito · Umdloti
              </span>
            </motion.div>

            <motion.h1
              variants={fade}
              custom={1}
              initial="hidden"
              animate="show"
              className="display-tight mt-7 text-[3rem] leading-[0.98] sm:text-[4.6rem] font-semibold text-ink"
            >
              Everything you love,
              <br />
              <span className="italic text-champagne">brought curbside.</span>
            </motion.h1>

            <motion.p
              variants={fade}
              custom={2}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft"
            >
              Groceries, the finest cellar and pharmacy — from Durban’s best traders to your door,
              or to your car. One elegant checkout, from{' '}
              <span className="font-semibold text-ink">06:00 to 01:00</span>, every day.
            </motion.p>

            <motion.div
              variants={fade}
              custom={3}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={onShop}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-ivory transition-all active:scale-95 hover:shadow-float"
              >
                Start an order
                <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-5 py-3.5 text-sm text-ink-soft">
                <span className={`h-2 w-2 rounded-full ${status.open ? 'bg-forest' : 'bg-mist'}`} />
                {status.open ? 'Live now' : status.detail}
              </div>
            </motion.div>
          </div>

          {/* Right — framed real photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-line shadow-float">
              <img
                src="/img/dining.jpg"
                alt="A curated dining spread from a Connect launch partner"
                className="h-[30rem] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
            </div>

            {/* Floating curbside order chip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute -left-6 bottom-8 flex items-center gap-3 rounded-2xl border border-line bg-ivory/95 p-3.5 pr-5 shadow-luxe backdrop-blur"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest text-ivory">
                <Car size={20} />
              </span>
              <div>
                <div className="text-xs text-mist">Curbside · Bay 12</div>
                <div className="font-display text-sm font-semibold text-ink">Runner arriving · 2 min</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          variants={fade}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-luxe border border-line bg-line sm:grid-cols-3"
        >
          <Stat icon={<Clock size={16} />} k="≈ 18 min" v="Median curbside handover" />
          <Stat icon={<ShieldCheck size={16} />} k="Age & script safe" v="Verified at the boot" />
          <Stat icon={<Sparkles size={16} />} k="3% back" v="On every Connect Wallet order" span />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-champagne-soft/50 blur-3xl"
      />
    </section>
  )
}

function Stat({
  icon,
  k,
  v,
  span,
}: {
  icon: React.ReactNode
  k: string
  v: string
  span?: boolean
}) {
  return (
    <div className={`bg-ivory p-5 ${span ? 'col-span-2 sm:col-span-1' : ''}`}>
      <div className="flex items-center gap-2 text-champagne">{icon}</div>
      <div className="mt-3 font-display text-2xl font-semibold text-ink">{k}</div>
      <div className="text-sm text-mist">{v}</div>
    </div>
  )
}
