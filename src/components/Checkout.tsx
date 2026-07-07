import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { X, Check, Car, Bike, Store, ChevronRight, Loader2, MapPin, PartyPopper } from 'lucide-react'
import { PAYMENT_METHODS, useStore, type Fulfilment } from '../store'
import { ZAR } from '../data/catalog'
import { storeStatus } from '../lib/hours'

type Step = 0 | 1 | 2 | 3

const FULFILMENTS: { id: Fulfilment; label: string; detail: string; icon: React.ReactNode; fee: number }[] = [
  { id: 'curbside', label: 'Curbside', detail: 'We load your boot · ~18 min', icon: <Car size={20} />, fee: 0 },
  { id: 'delivery', label: 'Delivery', detail: 'To your door · ~30 min', icon: <Bike size={20} />, fee: 24.9 },
  { id: 'collect', label: 'Collect inside', detail: 'Skip the queue · ~15 min', icon: <Store size={20} />, fee: 0 },
]

export function Checkout() {
  const { checkoutOpen, setCheckoutOpen, lines, clear } = useStore()
  const subtotal = useStore((s) => s.subtotal())
  const [step, setStep] = useState<Step>(0)
  const [fulfilment, setFulfilment] = useState<Fulfilment>('curbside')
  const [payment, setPayment] = useState('card')
  const [processing, setProcessing] = useState(false)
  const status = storeStatus()

  const fee = FULFILMENTS.find((f) => f.id === fulfilment)!.fee
  const wallet = payment === 'wallet' ? -Math.min(50, subtotal * 0.03) : 0
  const total = Math.max(0, subtotal + fee + wallet)

  const orderNo = useMemo(() => 'CN-' + Math.floor(1000 + Math.random() * 8999), [checkoutOpen])

  const close = () => {
    setCheckoutOpen(false)
    setTimeout(() => {
      setStep(0)
      setProcessing(false)
    }, 250)
  }

  const pay = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setStep(3)
      clear()
    }, 1900)
  }

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[60] mx-auto flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-[2rem] bg-ivory shadow-float sm:inset-y-0 sm:my-auto sm:rounded-[2rem]"
          >
            {/* Header + progress */}
            <div className="relative border-b border-line px-6 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {step === 3 ? 'Order confirmed' : 'Checkout'}
                </h2>
                <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ivory-deep">
                  <X size={18} />
                </button>
              </div>
              {step < 3 && (
                <div className="mt-4 flex gap-1.5">
                  {[0, 1, 2].map((s) => (
                    <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                      <motion.div
                        className="h-full rounded-full bg-champagne"
                        initial={false}
                        animate={{ width: step >= s ? '100%' : '0%' }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">
                {/* STEP 0 — Fulfilment */}
                {step === 0 && (
                  <Pane key="s0">
                    {!status.open && (
                      <div className="mb-4 rounded-2xl border border-champagne/40 bg-champagne-soft/40 p-3.5 text-sm text-ink-soft">
                        <b>We’re closed right now.</b> {status.detail}. Your order will be scheduled for
                        06:00.
                      </div>
                    )}
                    <SectionTitle>How would you like it?</SectionTitle>
                    <div className="mt-3 space-y-2.5">
                      {FULFILMENTS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFulfilment(f.id)}
                          className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                            fulfilment === f.id
                              ? 'border-ink bg-white shadow-luxe'
                              : 'border-line bg-white/50 hover:border-mist'
                          }`}
                        >
                          <div
                            className={`grid h-11 w-11 place-items-center rounded-xl ${
                              fulfilment === f.id ? 'bg-ink text-ivory' : 'bg-ivory-deep text-ink-soft'
                            }`}
                          >
                            {f.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 font-display font-semibold text-ink">
                              {f.label}
                              {f.fee === 0 && (
                                <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest">
                                  FREE
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-mist">{f.detail}</div>
                          </div>
                          <Radio on={fulfilment === f.id} />
                        </button>
                      ))}
                    </div>

                    {fulfilment === 'curbside' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 overflow-hidden"
                      >
                        <Field label="Vehicle for the boot-drop" placeholder="e.g. White VW Golf · ND 418-291" />
                        <Field label="Curbside point" placeholder="Gateway, Lower Level · Bay 12" icon={<MapPin size={15} />} />
                      </motion.div>
                    )}
                  </Pane>
                )}

                {/* STEP 1 — Payment */}
                {step === 1 && (
                  <Pane key="s1">
                    <SectionTitle>Choose how to pay</SectionTitle>
                    <div className="mt-3 space-y-2.5">
                      {PAYMENT_METHODS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPayment(m.id)}
                          className={`flex w-full items-center gap-4 rounded-2xl border p-3.5 text-left transition-all ${
                            payment === m.id ? 'border-ink bg-white shadow-luxe' : 'border-line bg-white/50 hover:border-mist'
                          }`}
                        >
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ivory-deep text-xl">
                            {m.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 font-semibold text-ink">
                              {m.name}
                              {m.badge && (
                                <span className="rounded-full bg-champagne-soft px-2 py-0.5 text-[10px] font-bold text-champagne">
                                  {m.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-mist">{m.detail}</div>
                          </div>
                          <Radio on={payment === m.id} />
                        </button>
                      ))}
                    </div>
                  </Pane>
                )}

                {/* STEP 2 — Review */}
                {step === 2 && (
                  <Pane key="s2">
                    <SectionTitle>Review & pay</SectionTitle>
                    <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white/60">
                      {lines.map((l) => (
                        <li key={l.product.id} className="flex items-center gap-3 p-3">
                          <span className="text-2xl">{l.product.emoji}</span>
                          <span className="flex-1 text-sm text-ink">
                            {l.product.name} <span className="text-mist">× {l.qty}</span>
                          </span>
                          <span className="text-sm font-semibold tabular-nums text-ink">
                            {ZAR(l.product.price * l.qty)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 rounded-2xl border border-line bg-white/60 p-4">
                      <SumRow k="Subtotal" v={ZAR(subtotal)} />
                      <SumRow k={FULFILMENTS.find((f) => f.id === fulfilment)!.label} v={fee ? ZAR(fee) : 'Free'} />
                      {wallet < 0 && <SumRow k="Wallet reward (3%)" v={ZAR(wallet)} accent />}
                      <div className="my-2.5 h-px bg-line" />
                      <SumRow k="Total" v={ZAR(total)} big />
                    </div>
                    <p className="mt-3 text-xs text-mist">
                      Paying with {PAYMENT_METHODS.find((m) => m.id === payment)!.name} ·{' '}
                      {FULFILMENTS.find((f) => f.id === fulfilment)!.label.toLowerCase()}
                    </p>
                  </Pane>
                )}

                {/* STEP 3 — Confirmed */}
                {step === 3 && (
                  <Pane key="s3">
                    <div className="grid place-items-center py-6 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                        className="grid h-20 w-20 place-items-center rounded-full bg-forest text-ivory"
                      >
                        <Check size={40} strokeWidth={3} />
                      </motion.div>
                      <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                        You’re all set{' '}
                        <PartyPopper className="inline text-champagne" size={22} />
                      </h3>
                      <p className="mt-1 text-sm text-mist">
                        Order <b className="text-ink">{orderNo}</b> · {status.open ? 'being packed now' : 'scheduled for 06:00'}
                      </p>

                      <div className="mt-6 w-full rounded-2xl border border-line bg-white/60 p-5 text-left">
                        <Track label="Order received" done />
                        <Track label="Trader packing your bag" done={status.open} active={status.open} />
                        <Track label="Runner en route" />
                        <Track label="Curbside handover — tap “I’m here”" last />
                      </div>
                      <button
                        onClick={close}
                        className="mt-6 w-full rounded-full bg-ink py-4 text-sm font-semibold text-ivory transition-all active:scale-[0.98] hover:shadow-float"
                      >
                        Track my order
                      </button>
                    </div>
                  </Pane>
                )}
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            {step < 3 && (
              <div className="border-t border-line bg-white/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  {step > 0 && (
                    <button
                      onClick={() => setStep((step - 1) as Step)}
                      className="rounded-full border border-line px-5 py-3.5 text-sm font-semibold text-ink-soft hover:border-mist"
                    >
                      Back
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      onClick={() => setStep((step + 1) as Step)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-ivory transition-all active:scale-[0.98] hover:shadow-float"
                    >
                      Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={pay}
                      disabled={processing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-ivory transition-all active:scale-[0.98] hover:shadow-float disabled:opacity-80"
                    >
                      {processing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Securing payment…
                        </>
                      ) : (
                        <>Pay {ZAR(total)}</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Pane({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-base font-semibold text-ink">{children}</h3>
}

function Radio({ on }: { on: boolean }) {
  return (
    <span
      className={`grid h-5 w-5 place-items-center rounded-full border-2 transition-colors ${
        on ? 'border-ink bg-ink' : 'border-line'
      }`}
    >
      {on && <span className="h-2 w-2 rounded-full bg-champagne" />}
    </span>
  )
}

function Field({ label, placeholder, icon }: { label: string; placeholder: string; icon?: React.ReactNode }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs font-semibold text-ink-soft">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-3 focus-within:border-ink">
        {icon && <span className="text-mist">{icon}</span>}
        <input
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-mist"
        />
      </div>
    </label>
  )
}

function SumRow({ k, v, big, accent }: { k: string; v: string; big?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className={`text-sm ${big ? 'font-display text-lg font-semibold text-ink' : 'text-ink-soft'}`}>{k}</span>
      <span
        className={`tabular-nums text-sm ${
          big ? 'font-display text-xl font-semibold text-ink' : accent ? 'font-semibold text-forest' : 'text-ink-soft'
        }`}
      >
        {v}
      </span>
    </div>
  )
}

function Track({ label, done, active, last }: { label: string; done?: boolean; active?: boolean; last?: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`grid h-5 w-5 place-items-center rounded-full ${
            done ? 'bg-forest text-ivory' : active ? 'bg-champagne text-ink' : 'bg-line text-mist'
          }`}
        >
          {done ? <Check size={12} strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
        </span>
        {!last && <span className={`my-0.5 h-6 w-0.5 ${done ? 'bg-forest/40' : 'bg-line'}`} />}
      </div>
      <span className={`pt-0.5 text-sm ${done || active ? 'font-medium text-ink' : 'text-mist'}`}>{label}</span>
    </div>
  )
}
