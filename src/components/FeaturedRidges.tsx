import { motion } from 'framer-motion'
import { Star, Clock, BadgeCheck } from 'lucide-react'
import { productsByVendor, vendorById } from '../data/catalog'
import { ProductCard } from './ProductCard'

export function FeaturedRidges() {
  const vendor = vendorById('21-ridges')!
  const menu = productsByVendor('21-ridges')

  return (
    <section id="ridges" className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-luxe p-8 sm:p-12 text-ivory"
        style={{ background: 'linear-gradient(135deg,#1B2C22 0%,#223B2E 55%,#2C4A38 100%)' }}
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-champagne/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
              <BadgeCheck size={13} /> Launch Partner
            </span>
            <h2 className="display-tight mt-5 text-4xl sm:text-6xl font-semibold">{vendor.name}</h2>
            <p className="mt-3 max-w-md text-ivory/70">{vendor.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <Star size={15} className="fill-champagne text-champagne" />
              <b>{vendor.rating}</b>
              <span className="text-ivory/50">({vendor.reviews.toLocaleString()})</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-ivory/70">
              <Clock size={15} /> {vendor.etaMin}–{vendor.etaMax} min
            </span>
            <span className="rounded-full border border-ivory/25 px-3 py-1 text-ivory/80">
              Free delivery
            </span>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold text-ink">The menu</h3>
        <span className="text-sm text-mist">Curated for Connect · live preview</span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {menu.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  )
}
