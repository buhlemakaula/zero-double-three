import { motion } from 'framer-motion'
import { Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { ZAR, type Product } from '../data/catalog'
import { useStore } from '../store'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useStore((s) => s.add)
  const [added, setAdded] = useState(false)

  const handle = () => {
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-luxe border border-line bg-white/70 p-4 transition-shadow hover:shadow-luxe"
    >
      <div className="relative mb-4 grid h-32 place-items-center overflow-hidden rounded-2xl bg-ivory-deep">
        <span className="text-5xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
          {product.emoji}
        </span>
        {product.tags?.[0] && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ivory">
            {product.tags[0]}
          </span>
        )}
        {(product.age || product.rx) && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-bordeaux px-2 py-1 text-[10px] font-bold text-ivory">
            {product.age ? '18+' : 'Rx'}
          </span>
        )}
      </div>

      <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-ink">
        {product.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-mist">{product.blurb}</p>

      <div className="mt-4 flex items-end justify-between pt-1">
        <div className="leading-none">
          {product.price > 0 ? (
            <>
              <span className="font-display text-xl font-semibold text-ink">{ZAR(product.price)}</span>
              {product.unit && <span className="ml-1 text-xs text-mist">/ {product.unit}</span>}
            </>
          ) : (
            <span className="font-display text-lg font-semibold text-forest">Claim via aid</span>
          )}
        </div>
        <button
          onClick={handle}
          aria-label={`Add ${product.name}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-ink text-ivory transition-all active:scale-90 hover:bg-champagne hover:text-ink"
        >
          <motion.span key={added ? 'y' : 'n'} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
            {added ? <Check size={17} /> : <Plus size={17} />}
          </motion.span>
        </button>
      </div>
    </motion.article>
  )
}
