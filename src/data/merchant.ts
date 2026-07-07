// Demo merchant analytics for 21 Ridges (the embedded launch partner).
// Static seed data powering the trader dashboard.

export interface DayRevenue {
  day: string
  curbside: number
  delivery: number
}

// Last 7 trading days (ZAR)
export const REVENUE_7D: DayRevenue[] = [
  { day: 'Mon', curbside: 8420, delivery: 4130 },
  { day: 'Tue', curbside: 9110, delivery: 3980 },
  { day: 'Wed', curbside: 10240, delivery: 4620 },
  { day: 'Thu', curbside: 12880, delivery: 5210 },
  { day: 'Fri', curbside: 18640, delivery: 7480 },
  { day: 'Sat', curbside: 21230, delivery: 8090 },
  { day: 'Sun', curbside: 15870, delivery: 6240 },
]

export const COMMISSION_RATE = 0.12 // flat 12% — below incumbent norm

export type OrderStatus = 'new' | 'packing' | 'ready' | 'handed'

export interface LiveOrder {
  id: string
  customer: string
  items: { name: string; qty: number }[]
  total: number
  fulfilment: 'curbside' | 'delivery' | 'collect'
  bay?: string
  vehicle?: string
  placedMinAgo: number
  status: OrderStatus
}

export const LIVE_ORDERS: LiveOrder[] = [
  {
    id: 'CN-4188',
    customer: 'Naledi M.',
    items: [
      { name: 'Butter-Poached Lobster', qty: 1 },
      { name: 'Ridges Espresso Martini', qty: 2 },
    ],
    total: 659,
    fulfilment: 'curbside',
    bay: 'Bay 12',
    vehicle: 'White VW Golf · ND 418-291',
    placedMinAgo: 2,
    status: 'new',
  },
  {
    id: 'CN-4187',
    customer: 'Sipho D.',
    items: [
      { name: 'Wagyu Short Rib', qty: 2 },
      { name: 'Heirloom & Burrata', qty: 1 },
    ],
    total: 895,
    fulfilment: 'curbside',
    bay: 'Bay 07',
    vehicle: 'Grey Fortuner · ND 902-114',
    placedMinAgo: 6,
    status: 'packing',
  },
  {
    id: 'CN-4186',
    customer: 'Aisha K.',
    items: [
      { name: 'Bora Bora Roll', qty: 3 },
      { name: 'Tasting Platter', qty: 1 },
    ],
    total: 914,
    fulfilment: 'delivery',
    placedMinAgo: 11,
    status: 'ready',
  },
  {
    id: 'CN-4185',
    customer: 'Thabo N.',
    items: [{ name: 'Chilli Garlic Prawns', qty: 2 }],
    total: 570,
    fulfilment: 'collect',
    placedMinAgo: 18,
    status: 'handed',
  },
]

export const MENU_STATUS: { id: string; available: boolean; sold: number }[] = [
  { id: 'r-lobster', available: true, sold: 34 },
  { id: 'r-wagyu', available: true, sold: 41 },
  { id: 'r-sushi', available: true, sold: 58 },
  { id: 'r-sashimi', available: true, sold: 22 },
  { id: 'r-tuna', available: false, sold: 12 },
  { id: 'r-prawn', available: true, sold: 29 },
  { id: 'r-burrata', available: true, sold: 26 },
  { id: 'r-choc', available: true, sold: 37 },
  { id: 'r-martini', available: true, sold: 44 },
]
