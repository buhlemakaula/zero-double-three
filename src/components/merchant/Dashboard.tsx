import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, ArrowUpRight, TrendingUp, Car, Bike, Store, Star, Check,
  Package, Timer, Wallet, ChevronRight,
} from 'lucide-react'
import { Logo } from '../Logo'
import { useStore } from '../../store'
import { PRODUCTS, ZAR, vendorById } from '../../data/catalog'
import {
  REVENUE_7D, COMMISSION_RATE, LIVE_ORDERS, MENU_STATUS,
  type LiveOrder, type OrderStatus,
} from '../../data/merchant'
import { RevenueChart } from './RevenueChart'
import { storeStatus } from '../../lib/hours'

const NEXT: Record<OrderStatus, OrderStatus> = {
  new: 'packing',
  packing: 'ready',
  ready: 'handed',
  handed: 'handed',
}
const ACTION: Record<OrderStatus, string> = {
  new: 'Accept order',
  packing: 'Mark ready',
  ready: 'Confirm handover',
  handed: 'Completed',
}
const STATUS_META: Record<OrderStatus, { label: string; cls: string }> = {
  new: { label: 'New', cls: 'bg-champagne-soft text-[#7a5a2a]' },
  packing: { label: 'Packing', cls: 'bg-[#E6EFE9] text-forest' },
  ready: { label: 'Ready', cls: 'bg-[#E3EEF7] text-[#2B597E]' },
  handed: { label: 'Handed over', cls: 'bg-ivory-deep text-mist' },
}

export function Dashboard() {
  const setView = useStore((s) => s.setView)
  const vendor = vendorById('21-ridges')!
  const status = storeStatus()
  const [orders, setOrders] = useState<LiveOrder[]>(LIVE_ORDERS)
  const [menu, setMenu] = useState(MENU_STATUS)

  const totals = useMemo(() => {
    const gross = REVENUE_7D.reduce((n, d) => n + d.curbside + d.delivery, 0)
    const curb = REVENUE_7D.reduce((n, d) => n + d.curbside, 0)
    const deliv = REVENUE_7D.reduce((n, d) => n + d.delivery, 0)
    const today = REVENUE_7D[REVENUE_7D.length - 1]
    const orders7d = 486
    return {
      gross,
      curbShare: Math.round((curb / gross) * 100),
      delivShare: Math.round((deliv / gross) * 100),
      today: today.curbside + today.delivery,
      avg: Math.round(gross / orders7d),
      orders7d,
      commission: gross * COMMISSION_RATE,
      payout: gross * (1 - COMMISSION_RATE),
    }
  }, [])

  const advance = (id: string) =>
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status: NEXT[x.status] } : x)))
  const toggle = (id: string) =>
    setMenu((m) => m.map((x) => (x.id === id ? { ...x, available: !x.available } : x)))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-ivory-deep/40"
    >
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-ivory/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-ivory sm:inline">
              Trader
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-white/60 px-3 py-1.5 text-xs sm:flex">
              <span className={`h-2 w-2 rounded-full ${status.open ? 'bg-forest' : 'bg-mist'}`} />
              <b className="text-ink">{vendor.name}</b>
              <span className="text-mist">{status.open ? 'Accepting orders' : 'Closed'}</span>
            </span>
            <button
              onClick={() => setView('shop')}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/60 px-4 py-2 text-sm font-semibold text-ink-soft hover:border-mist"
            >
              <ArrowLeft size={15} /> Marketplace
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="display-tight text-3xl font-semibold text-ink sm:text-4xl">Good service, {vendor.name.split(' ')[1]}.</h1>
            <p className="mt-1 text-mist">Here’s how your kitchen is trading today.</p>
          </div>
          <span className="hidden items-center gap-1.5 text-sm text-mist sm:flex">
            <Star size={14} className="fill-champagne text-champagne" /> {vendor.rating} · {vendor.reviews.toLocaleString()} reviews
          </span>
        </div>

        {/* KPI row */}
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Revenue today" value={ZAR(totals.today)} delta="+14% vs avg" up />
          <Kpi label="Orders · 7 days" value={totals.orders7d.toString()} delta="+9%" up />
          <Kpi label="Avg basket" value={ZAR(totals.avg)} delta="+R28" up />
          <Kpi label="Curbside share" value={`${totals.curbShare}%`} delta="of all orders" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Revenue chart */}
          <section className="rounded-luxe border border-line bg-white/70 p-6 lg:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">Revenue · last 7 days</h2>
                <p className="text-sm text-mist">Curbside + delivery combined</p>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-semibold text-ink">{ZAR(totals.gross)}</div>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-forest">
                  <TrendingUp size={13} /> +18.4%
                </div>
              </div>
            </div>
            <div className="mt-5">
              <RevenueChart />
            </div>
          </section>

          {/* Fulfilment split — 2 categories, direct-labelled with icons (never colour-alone) */}
          <section className="rounded-luxe border border-line bg-white/70 p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Fulfilment mix</h2>
            <p className="text-sm text-mist">Where your orders go</p>

            <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-ivory-deep">
              <div className="h-full bg-[#2E4A39]" style={{ width: `${totals.curbShare}%` }} />
              <div className="h-full bg-champagne" style={{ width: `${totals.delivShare}%`, marginLeft: 2 }} />
            </div>

            <div className="mt-5 space-y-3">
              <SplitRow icon={<Car size={15} />} color="#2E4A39" label="Curbside" pct={totals.curbShare} />
              <SplitRow icon={<Bike size={15} />} color="#B8935E" label="Delivery" pct={totals.delivShare} />
            </div>

            <div className="mt-5 rounded-2xl bg-ivory-deep/60 p-4 text-sm text-ink-soft">
              <b className="text-ink">Curbside is your edge.</b> {totals.curbShare}% of orders skip
              last-mile fees — protecting your margin.
            </div>
          </section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Live orders */}
          <section className="rounded-luxe border border-line bg-white/70 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">Live orders</h2>
              <span className="inline-flex items-center gap-1.5 text-xs text-mist">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest opacity-60" />
                  <span className="relative h-2 w-2 rounded-full bg-forest" />
                </span>
                Real-time
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <AnimatePresence initial={false}>
                {orders.map((o) => (
                  <OrderCard key={o.id} order={o} onAdvance={() => advance(o.id)} />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Payouts */}
          <section className="rounded-luxe border border-line bg-ink p-6 text-ivory">
            <div className="flex items-center gap-2 text-champagne">
              <Wallet size={16} />
              <h2 className="font-display text-lg font-semibold text-ivory">Payout</h2>
            </div>
            <p className="mt-1 text-sm text-ivory/60">This week · settles Mon 09:00</p>

            <div className="mt-6 space-y-3 text-sm">
              <PayRow k="Gross sales" v={ZAR(totals.gross)} />
              <PayRow k={`Connect commission (${Math.round(COMMISSION_RATE * 100)}%)`} v={`– ${ZAR(totals.commission)}`} muted />
              <div className="h-px bg-ivory/15" />
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-semibold">Net payout</span>
                <span className="font-display text-2xl font-semibold text-champagne">{ZAR(totals.payout)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-ivory/10 bg-ivory/[0.04] p-4 text-xs text-ivory/60">
              Flat <b className="text-ivory">12%</b> — no listing fees, no hidden charges. Incumbents
              charge up to 30%.
            </div>
            <button className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-champagne py-3 text-sm font-semibold text-ink transition-all active:scale-[0.98]">
              View statement
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-ivory/40">Recent payouts</div>
              <div className="mt-3 space-y-2.5">
                {[
                  { d: '30 Jun', v: 108420, s: 'Paid' },
                  { d: '23 Jun', v: 96180, s: 'Paid' },
                  { d: '16 Jun', v: 101540, s: 'Paid' },
                ].map((r) => (
                  <div key={r.d} className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2 text-ivory/70">
                      <Check size={13} className="text-[#8FBFA0]" /> {r.d}
                    </span>
                    <span className="tabular-nums text-ivory/90">{ZAR(r.v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Menu management */}
        <section className="mt-6 rounded-luxe border border-line bg-white/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Menu</h2>
              <p className="text-sm text-mist">Toggle availability in real time · sold today</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {menu.map((m) => {
              const p = PRODUCTS.find((x) => x.id === m.id)!
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
                    m.available ? 'border-line bg-white' : 'border-line bg-ivory-deep/40'
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ivory-deep text-xl">
                    {p.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`truncate text-sm font-semibold ${m.available ? 'text-ink' : 'text-mist line-through'}`}>
                      {p.name}
                    </div>
                    <div className="text-xs text-mist">{ZAR(p.price)} · {m.sold} sold today</div>
                  </div>
                  <button
                    onClick={() => toggle(m.id)}
                    aria-label={`Toggle ${p.name}`}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      m.available ? 'bg-forest' : 'bg-line'
                    }`}
                  >
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${
                        m.available ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-mist">
          Demo trader workspace · data is illustrative · Connect Marketplace (Pty) Ltd
        </p>
      </div>
    </motion.div>
  )
}

function Kpi({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-luxe border border-line bg-white/70 p-5">
      <div className="text-xs font-medium text-mist">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold text-ink">{value}</div>
      <div className={`mt-1 text-xs font-semibold ${up ? 'text-forest' : 'text-mist'}`}>
        {up && '▲ '}{delta}
      </div>
    </div>
  )
}

function SplitRow({ icon, color, label, pct }: { icon: React.ReactNode; color: string; label: string; pct: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="inline-flex items-center gap-2 text-sm text-ink-soft">
        <span className="grid h-6 w-6 place-items-center rounded-md text-ivory" style={{ background: color }}>
          {icon}
        </span>
        {label}
      </span>
      <span className="font-display font-semibold tabular-nums text-ink">{pct}%</span>
    </div>
  )
}

function PayRow({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? 'text-ivory/50' : 'text-ivory/80'}>{k}</span>
      <span className={`tabular-nums ${muted ? 'text-ivory/60' : 'text-ivory'}`}>{v}</span>
    </div>
  )
}

function OrderCard({ order, onAdvance }: { order: LiveOrder; onAdvance: () => void }) {
  const meta = STATUS_META[order.status]
  const Fic = order.fulfilment === 'curbside' ? Car : order.fulfilment === 'delivery' ? Bike : Store
  const done = order.status === 'handed'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-line bg-white p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ivory-deep text-ink-soft">
            <Fic size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-semibold text-ink">{order.id}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.cls}`}>{meta.label}</span>
            </div>
            <div className="text-xs text-mist">
              {order.customer} · <Timer size={10} className="inline" /> {order.placedMinAgo}m ago
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {order.items.map((it, i) => (
                <span key={i} className="rounded-md bg-ivory-deep px-2 py-0.5 text-[11px] text-ink-soft">
                  {it.qty}× {it.name}
                </span>
              ))}
            </div>
            {order.bay && (
              <div className="mt-1.5 text-[11px] text-champagne">
                {order.bay} · {order.vehicle}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display font-semibold text-ink">{ZAR(order.total)}</div>
        </div>
      </div>
      <button
        onClick={onAdvance}
        disabled={done}
        className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-xs font-semibold transition-all active:scale-[0.98] ${
          done ? 'cursor-default bg-ivory-deep text-mist' : 'bg-ink text-ivory hover:shadow-luxe'
        }`}
      >
        {done ? <><Check size={14} /> {ACTION[order.status]}</> : order.status === 'new' ? (
          <><Package size={14} /> {ACTION[order.status]}</>
        ) : (
          <>{ACTION[order.status]} <ChevronRight size={14} /></>
        )}
      </button>
    </motion.div>
  )
}
