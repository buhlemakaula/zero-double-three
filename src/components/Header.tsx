import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, MapPin } from 'lucide-react'
import { Logo } from './Logo'
import { useStore } from '../store'
import { storeStatus, durbanClock } from '../lib/hours'

export function Header() {
  const count = useStore((s) => s.count())
  const setCartOpen = useStore((s) => s.setCartOpen)
  const setView = useStore((s) => s.setView)
  const [status, setStatus] = useState(storeStatus())
  const [clock, setClock] = useState(durbanClock())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      setStatus(storeStatus())
      setClock(durbanClock())
    }, 15000)
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      clearInterval(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-ivory/80 backdrop-blur-xl border-b border-line'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Logo />
          <div className="hidden md:flex items-center gap-1.5 text-mist text-xs pl-5 border-l border-line">
            <MapPin size={13} className="text-champagne" />
            <span className="text-ink-soft font-medium">Durban</span>
            <span>· uMhlanga · Ballito</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setView('merchant')}
            className="hidden text-sm font-semibold text-ink-soft transition-colors hover:text-ink md:inline"
          >
            Traders
          </button>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/60 border border-line px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              {status.open && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest opacity-60" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  status.open ? 'bg-forest' : 'bg-mist'
                }`}
              />
            </span>
            <span className="text-xs font-semibold text-ink">{status.label}</span>
            <span className="text-[11px] text-mist tabular-nums">{clock}</span>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative group flex items-center gap-2 rounded-full bg-ink text-ivory pl-4 pr-4 py-2 text-sm font-semibold transition-transform active:scale-95 hover:shadow-luxe"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bag</span>
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="min-w-5 h-5 px-1 grid place-items-center rounded-full bg-champagne text-ink text-[11px] font-bold"
              >
                {count}
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  )
}
