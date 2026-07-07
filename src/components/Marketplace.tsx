import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, productsByCategory, vendorById, type Category } from '../data/catalog'
import { ProductCard } from './ProductCard'
import { useStore } from '../store'
import { Star } from 'lucide-react'

export function Marketplace() {
  const active = useStore((s) => s.activeCategory) as Category
  const setActive = useStore((s) => s.setActiveCategory)

  const products = productsByCategory(active)
  const cat = CATEGORIES.find((c) => c.id === active)!

  return (
    <section id="shop" className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-champagne">The Marketplace</p>
            <h2 className="display-tight mt-2 text-3xl sm:text-4xl font-semibold text-ink">
              One bag. Every trader.
            </h2>
          </div>
        </div>

        {/* Category tabs */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((c) => {
            const on = c.id === active
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`relative shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  on ? 'border-ink text-ivory' : 'border-line bg-white/60 text-ink-soft hover:border-mist'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="tabpill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <span>{c.emoji}</span>
                  {c.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Vendor strip for the active category (excluding the featured Ridges hero) */}
      <VendorLine cat={active} />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {active === 'medicine' && (
        <p className="mt-6 rounded-2xl border border-line bg-white/60 p-4 text-sm text-mist">
          <span className="font-semibold text-ink-soft">Script pharmacy.</span> Upload a prescription
          at checkout — our pharmacist verifies it and you can claim from your medical aid in real time.
          Cold-chain items travel in insulated curbside pouches.
        </p>
      )}
      {cat.id === 'alcohol' && (
        <p className="mt-6 rounded-2xl border border-line bg-white/60 p-4 text-sm text-mist">
          <span className="font-semibold text-ink-soft">18+ only.</span> Age is verified by ID scan at
          curbside handover, in line with SA liquor regulations. No sales outside trading hours.
        </p>
      )}
    </section>
  )
}

function VendorLine({ cat }: { cat: Category }) {
  const map: Record<Category, string> = {
    restaurants: '21-ridges',
    groceries: 'harbour-grocer',
    alcohol: 'the-cellar',
    medicine: 'meridian-pharmacy',
  }
  const v = vendorById(map[cat])
  if (!v) return null
  return (
    <motion.div
      key={v.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-6 flex items-center gap-4 rounded-2xl border border-line bg-white/50 p-4"
    >
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-ivory-deep text-2xl">{v.emoji}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-semibold text-ink">{v.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs text-mist">
            <Star size={12} className="fill-champagne text-champagne" /> {v.rating}
          </span>
        </div>
        <p className="truncate text-sm text-mist">{v.tagline}</p>
      </div>
      <div className="hidden text-right sm:block">
        <div className="text-sm font-semibold text-ink">{v.etaMin}–{v.etaMax} min</div>
        <div className="text-xs text-mist">{v.area}</div>
      </div>
    </motion.div>
  )
}
