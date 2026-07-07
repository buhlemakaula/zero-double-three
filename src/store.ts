import { create } from 'zustand'
import type { Product } from './data/catalog'

export interface CartLine {
  product: Product
  qty: number
}

export type Fulfilment = 'curbside' | 'delivery' | 'collect'

export interface PaymentMethod {
  id: string
  name: string
  detail: string
  emoji: string
  badge?: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', name: 'Card', detail: 'Visa · Mastercard · Amex · tokenised', emoji: '💳' },
  { id: 'tap', name: 'Tap to Pay', detail: 'Apple Pay · Google Pay · Samsung Pay', emoji: '📱', badge: 'Fast' },
  { id: 'eft', name: 'Instant EFT', detail: 'Capitec · FNB · Standard · Absa · Nedbank', emoji: '🏦' },
  { id: 'wallet', name: 'Connect Wallet', detail: 'Balance R1 240 · earns 3% back', emoji: '✨', badge: 'Rewards' },
  { id: 'split', name: 'Split & Pay Later', detail: '4 interest-free instalments', emoji: '🧩', badge: 'PayJustNow' },
  { id: 'cash', name: 'Cash on Handover', detail: 'Pay the driver curbside', emoji: '💵' },
]

interface State {
  lines: CartLine[]
  cartOpen: boolean
  checkoutOpen: boolean
  activeCategory: string
  add: (p: Product) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
  setCartOpen: (v: boolean) => void
  setCheckoutOpen: (v: boolean) => void
  setActiveCategory: (c: string) => void
  count: () => number
  subtotal: () => number
}

export const useStore = create<State>((set, get) => ({
  lines: [],
  cartOpen: false,
  checkoutOpen: false,
  activeCategory: 'restaurants',

  add: (p) =>
    set((s) => {
      const existing = s.lines.find((l) => l.product.id === p.id)
      if (existing) {
        return {
          lines: s.lines.map((l) =>
            l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l,
          ),
          cartOpen: true,
        }
      }
      return { lines: [...s.lines, { product: p, qty: 1 }], cartOpen: true }
    }),

  remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.product.id !== id) })),

  setQty: (id, qty) =>
    set((s) => ({
      lines:
        qty <= 0
          ? s.lines.filter((l) => l.product.id !== id)
          : s.lines.map((l) => (l.product.id === id ? { ...l, qty } : l)),
    })),

  clear: () => set({ lines: [] }),
  setCartOpen: (v) => set({ cartOpen: v }),
  setCheckoutOpen: (v) => set({ checkoutOpen: v }),
  setActiveCategory: (c) => set({ activeCategory: c }),

  count: () => get().lines.reduce((n, l) => n + l.qty, 0),
  subtotal: () => get().lines.reduce((n, l) => n + l.product.price * l.qty, 0),
}))
