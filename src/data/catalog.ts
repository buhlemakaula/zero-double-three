// Connect — catalog data.
// Demo/seed data. 21 Ridges is embedded as the launch ("first & demo") merchant.
// Prices in ZAR.

export type Category = 'restaurants' | 'groceries' | 'alcohol' | 'medicine'

export interface Product {
  id: string
  name: string
  blurb: string
  price: number
  unit?: string
  category: Category
  vendorId: string
  tags?: string[]
  rx?: boolean // requires prescription upload
  age?: boolean // age-restricted (18+)
  emoji: string
  image?: string // real product photography (served from /public); emoji tile is the fallback
}

export interface Vendor {
  id: string
  name: string
  category: Category
  tagline: string
  area: string
  rating: number
  reviews: number
  etaMin: number
  etaMax: number
  fee: number
  featured?: boolean
  accent?: string
  emoji: string
}

export const CATEGORIES: {
  id: Category
  label: string
  sub: string
  emoji: string
}[] = [
  { id: 'restaurants', label: 'Restaurants', sub: 'Chef-led kitchens', emoji: '🍽️' },
  { id: 'groceries', label: 'Groceries', sub: 'Daily essentials', emoji: '🧺' },
  { id: 'alcohol', label: 'Cellar', sub: 'Wine, spirits & more', emoji: '🥂' },
  { id: 'medicine', label: 'Pharmacy', sub: 'Care, delivered', emoji: '💊' },
]

export const VENDORS: Vendor[] = [
  {
    id: '21-ridges',
    name: '21 Ridges',
    category: 'restaurants',
    tagline: 'Contemporary fine dining · Umhlanga Ridge',
    area: 'Umhlanga',
    rating: 4.9,
    reviews: 1284,
    etaMin: 25,
    etaMax: 40,
    fee: 0,
    featured: true,
    accent: '#223B2E',
    emoji: '🌿',
  },
  {
    id: 'harbour-grocer',
    name: 'Harbour & Vine',
    category: 'groceries',
    tagline: 'Curated grocer & deli',
    area: 'Morningside',
    rating: 4.8,
    reviews: 642,
    etaMin: 20,
    etaMax: 35,
    fee: 24.9,
    emoji: '🧺',
  },
  {
    id: 'the-cellar',
    name: 'The Ridge Cellar',
    category: 'alcohol',
    tagline: 'Fine wine & rare spirits',
    area: 'uMhlanga',
    rating: 4.9,
    reviews: 908,
    etaMin: 30,
    etaMax: 45,
    fee: 29.9,
    accent: '#6E2233',
    emoji: '🍷',
  },
  {
    id: 'meridian-pharmacy',
    name: 'Meridian Pharmacy',
    category: 'medicine',
    tagline: 'Script & wellness · Berea',
    area: 'Berea',
    rating: 4.9,
    reviews: 501,
    etaMin: 20,
    etaMax: 35,
    fee: 19.9,
    emoji: '⚕️',
  },
]

// --- 21 Ridges menu (embedded demo merchant) ---
const ridges = (
  id: string,
  name: string,
  blurb: string,
  price: number,
  emoji: string,
  tags: string[] = [],
  image?: string,
): Product => ({
  id,
  name,
  blurb,
  price,
  category: 'restaurants',
  vendorId: '21-ridges',
  emoji,
  tags,
  image,
})

export const PRODUCTS: Product[] = [
  // 21 RIDGES — signature menu
  ridges('r-lobster', 'Butter-Poached Lobster', 'Truffle tagliatelle, bisque emulsion, micro herbs', 389, '🦞', ['Signature', 'Chef’s pick'], '/img/dining.jpg'),
  ridges('r-tuna', 'Seared Tuna Tataki', 'Avocado rose, ponzu pearls, sesame crisp', 245, '🥑', ['Fresh']),
  ridges('r-sushi', 'Bora Bora Roll', 'Salmon, tobiko, avocado, micro shiso', 198, '🍣', ['Signature'], '/img/sushi-roll.jpg'),
  ridges('r-sashimi', 'Tasting Platter', 'Salmon, tuna, prawn nigiri · chef’s selection of ten', 320, '🍱', ['To share'], '/img/sushi-platter.jpg'),
  ridges('r-wagyu', 'Wagyu Short Rib', '48-hour braise, burnt honey glaze, pommes purée', 365, '🥩', ['Chef’s pick']),
  ridges('r-burrata', 'Heirloom & Burrata', 'Basil oil, aged balsamic, sourdough shard', 165, '🍅', ['Vegetarian']),
  ridges('r-prawn', 'Chilli Garlic Prawns', 'Flame-grilled tiger prawns, lemon butter, herb crumb', 285, '🦐', ['Fresh']),
  ridges('r-choc', 'Valrhona Soufflé', 'Dark chocolate, salted caramel, gold leaf', 145, '🍫', ['Dessert']),
  ridges('r-martini', 'Ridges Espresso Martini', 'Don Julio, cold brew, vanilla · 18+', 135, '🍸', ['Bar', '18+']),

  // GROCERIES — Harbour & Vine
  { id: 'g-eggs', name: 'Free-Range Eggs', blurb: 'Pasture-raised · tray of 12', price: 62.9, unit: '12s', category: 'groceries', vendorId: 'harbour-grocer', emoji: '🥚', tags: ['Everyday'] },
  { id: 'g-milk', name: 'Jersey Full-Cream Milk', blurb: 'Non-homogenised · 2L', price: 44.9, unit: '2L', category: 'groceries', vendorId: 'harbour-grocer', emoji: '🥛' },
  { id: 'g-bread', name: 'Sourdough Boule', blurb: 'Stone-baked daily · 700g', price: 58.0, unit: 'loaf', category: 'groceries', vendorId: 'harbour-grocer', emoji: '🍞', tags: ['Fresh'] },
  { id: 'g-avo', name: 'Ripe Hass Avocados', blurb: 'Ready to eat · net of 4', price: 49.9, unit: '4s', category: 'groceries', vendorId: 'harbour-grocer', emoji: '🥑' },
  { id: 'g-coffee', name: 'Single-Origin Beans', blurb: 'Ethiopia Yirgacheffe · 250g', price: 129.0, unit: '250g', category: 'groceries', vendorId: 'harbour-grocer', emoji: '☕', tags: ['Barista'] },
  { id: 'g-berries', name: 'Blueberry Punnet', blurb: 'Sweet & firm · 125g', price: 39.9, unit: '125g', category: 'groceries', vendorId: 'harbour-grocer', emoji: '🫐' },
  { id: 'g-salmon', name: 'Norwegian Salmon Fillet', blurb: 'Skin-on, deboned · 300g', price: 149.0, unit: '300g', category: 'groceries', vendorId: 'harbour-grocer', emoji: '🐟', tags: ['Fresh'] },
  { id: 'g-olive', name: 'Estate Olive Oil', blurb: 'Extra virgin, cold-pressed · 500ml', price: 189.0, unit: '500ml', category: 'groceries', vendorId: 'harbour-grocer', emoji: '🫒' },

  // ALCOHOL — The Ridge Cellar (18+)
  { id: 'a-donjulio', name: 'Don Julio Reposado', blurb: '100% agave · aged 8 months · 750ml', price: 899.0, unit: '750ml', category: 'alcohol', vendorId: 'the-cellar', emoji: '🍾', age: true, tags: ['Premium', '18+'], image: '/img/donjulio.jpg' },
  { id: 'a-hennessy', name: 'Hennessy V.S', blurb: 'Very Special cognac · 750ml', price: 549.0, unit: '750ml', category: 'alcohol', vendorId: 'the-cellar', emoji: '🥃', age: true, tags: ['18+'], image: '/img/hennessy.jpg' },
  { id: 'a-mcc', name: 'Graham Beck Brut MCC', blurb: 'Méthode Cap Classique · 750ml', price: 219.0, unit: '750ml', category: 'alcohol', vendorId: 'the-cellar', emoji: '🍾', age: true, tags: ['Local', '18+'] },
  { id: 'a-pinot', name: 'Hamilton Russell Pinot', blurb: 'Hemel-en-Aarde · 2022 · 750ml', price: 645.0, unit: '750ml', category: 'alcohol', vendorId: 'the-cellar', emoji: '🍷', age: true, tags: ['Cellar', '18+'] },
  { id: 'a-gin', name: 'Inverroche Amber Gin', blurb: 'Fynbos-infused · 750ml', price: 389.0, unit: '750ml', category: 'alcohol', vendorId: 'the-cellar', emoji: '🍸', age: true, tags: ['Local', '18+'] },
  { id: 'a-savanna', name: 'Savanna Dry', blurb: 'Premium cider · 6 × 330ml', price: 129.9, unit: '6-pack', category: 'alcohol', vendorId: 'the-cellar', emoji: '🍺', age: true, tags: ['18+'] },

  // MEDICINE — Meridian Pharmacy
  { id: 'm-panado', name: 'Panado Paracetamol', blurb: 'Fast-acting · 500mg · 24 tablets', price: 39.9, unit: '24s', category: 'medicine', vendorId: 'meridian-pharmacy', emoji: '💊', tags: ['OTC'] },
  { id: 'm-allergex', name: 'Allergex Antihistamine', blurb: 'Allergy relief · 30 tablets', price: 54.9, unit: '30s', category: 'medicine', vendorId: 'meridian-pharmacy', emoji: '🤧', tags: ['OTC'] },
  { id: 'm-vitc', name: 'Vitamin C 1000mg', blurb: 'Immune support · effervescent · 20s', price: 79.9, unit: '20s', category: 'medicine', vendorId: 'meridian-pharmacy', emoji: '🍊', tags: ['Wellness'] },
  { id: 'm-plaster', name: 'First-Aid Essentials', blurb: 'Plasters, antiseptic & gauze kit', price: 119.0, unit: 'kit', category: 'medicine', vendorId: 'meridian-pharmacy', emoji: '🩹', tags: ['Home'] },
  { id: 'm-script', name: 'Chronic Script Refill', blurb: 'Upload script · claim from medical aid', price: 0, unit: 'script', category: 'medicine', vendorId: 'meridian-pharmacy', emoji: '📋', rx: true, tags: ['Prescription'] },
  { id: 'm-probiotic', name: 'Daily Probiotic', blurb: 'Gut health · 30 capsules', price: 189.0, unit: '30s', category: 'medicine', vendorId: 'meridian-pharmacy', emoji: '🦠', tags: ['Wellness'] },
]

export function vendorById(id: string): Vendor | undefined {
  return VENDORS.find((v) => v.id === id)
}

export function productsByVendor(id: string): Product[] {
  return PRODUCTS.filter((p) => p.vendorId === id)
}

export function productsByCategory(cat: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === cat)
}

export const ZAR = (n: number) =>
  'R' + n.toLocaleString('en-ZA', { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })
