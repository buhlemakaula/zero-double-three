import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { ZAR } from '../data/catalog'

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQty, remove } = useStore()
  const subtotal = useStore((s) => s.subtotal())
  const setCheckoutOpen = useStore((s) => s.setCheckoutOpen)

  const fee = lines.length ? 24.9 : 0
  const total = subtotal + fee

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory shadow-float"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} />
                <h2 className="font-display text-lg font-semibold">Your bag</h2>
                <span className="text-sm text-mist">
                  {lines.reduce((n, l) => n + l.qty, 0)} items
                </span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-ivory-deep"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ivory-deep text-3xl">
                      🛍️
                    </div>
                    <p className="mt-4 font-display text-lg text-ink">Your bag is empty</p>
                    <p className="mt-1 text-sm text-mist">Add a little something from Durban’s best.</p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.product.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-3 rounded-2xl border border-line bg-white/70 p-3"
                      >
                        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-ivory-deep text-3xl">
                          {l.product.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display text-[15px] font-semibold leading-tight text-ink">
                              {l.product.name}
                            </h3>
                            <button
                              onClick={() => remove(l.product.id)}
                              className="text-mist hover:text-bordeaux"
                              aria-label="Remove"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-xs text-mist">{ZAR(l.product.price)}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full border border-line bg-ivory p-0.5">
                              <button
                                onClick={() => setQty(l.product.id, l.qty - 1)}
                                className="grid h-7 w-7 place-items-center rounded-full hover:bg-ivory-deep"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold tabular-nums">
                                {l.qty}
                              </span>
                              <button
                                onClick={() => setQty(l.product.id, l.qty + 1)}
                                className="grid h-7 w-7 place-items-center rounded-full hover:bg-ivory-deep"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <span className="font-display font-semibold text-ink">
                              {ZAR(l.product.price * l.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line bg-white/60 px-6 py-5">
                <Row k="Subtotal" v={ZAR(subtotal)} />
                <Row k="Service & curbside" v={ZAR(fee)} muted />
                <div className="my-3 h-px bg-line" />
                <Row k="Total" v={ZAR(total)} big />
                <button
                  onClick={() => {
                    setCartOpen(false)
                    setCheckoutOpen(true)
                  }}
                  className="mt-4 w-full rounded-full bg-ink py-4 text-sm font-semibold text-ivory transition-all active:scale-[0.98] hover:shadow-float"
                >
                  Checkout · {ZAR(total)}
                </button>
                <p className="mt-2.5 text-center text-xs text-mist">
                  Curbside collection is free · 06:00–01:00
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function Row({ k, v, muted, big }: { k: string; v: string; muted?: boolean; big?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`${big ? 'font-display text-lg font-semibold text-ink' : muted ? 'text-mist' : 'text-ink-soft'} text-sm`}>
        {k}
      </span>
      <span className={`${big ? 'font-display text-xl font-semibold text-ink' : 'text-ink-soft'} tabular-nums text-sm`}>
        {v}
      </span>
    </div>
  )
}
