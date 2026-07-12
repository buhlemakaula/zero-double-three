/* Misitu — product catalogue (placeholder data, prices in ZAR) */

const WOOD = {
  kiaat:   { light: '#D9A468', mid: '#B97F3E', dark: '#8A5726', shadow: '#5E3A18' },
  walnut:  { light: '#A9764A', mid: '#7C4A24', dark: '#5A3418', shadow: '#3D2210' },
  blackwood:{ light: '#6E5A4B', mid: '#4A3B30', dark: '#2E241D', shadow: '#1B1512' },
  amber:   { light: '#E2B678', mid: '#C08A4E', dark: '#96662F', shadow: '#6B4720' },
  yellowwood:{ light: '#E5C68C', mid: '#C9A05C', dark: '#9C7538', shadow: '#6F5226' }
};

/* Shared SVG helpers ------------------------------------------------- */

function svgOpen(tone, id) {
  return `<svg viewBox="0 0 400 400" role="img" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="w-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${tone.light}"/>
      <stop offset=".55" stop-color="${tone.mid}"/>
      <stop offset="1" stop-color="${tone.dark}"/>
    </linearGradient>
    <linearGradient id="s-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${tone.mid}"/>
      <stop offset="1" stop-color="${tone.shadow}"/>
    </linearGradient>
    <radialGradient id="bg-${id}" cx=".5" cy=".42" r=".75">
      <stop offset="0" stop-color="#FBFAF6"/>
      <stop offset="1" stop-color="#ECE8DF"/>
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg-${id})"/>
  <ellipse cx="200" cy="332" rx="128" ry="14" fill="#1B1917" opacity=".08"/>`;
}
const SVG_CLOSE = `</svg>`;

/* Each drawing lives in a 400×400 frame, furniture resting on y≈330 */

const DRAWINGS = {
  diningChair(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <path d="M136 96 Q200 74 264 96 L258 150 Q200 132 142 150 Z" fill="url(#w-${id})"/>
    <path d="M142 150 Q200 133 258 150 L256 166 Q200 150 144 166 Z" fill="url(#s-${id})"/>
    <rect x="138" y="96" width="10" height="116" rx="5" fill="url(#s-${id})"/>
    <rect x="252" y="96" width="10" height="116" rx="5" fill="url(#s-${id})"/>
    <path d="M126 206 Q200 190 274 206 L268 232 Q200 218 132 232 Z" fill="url(#w-${id})"/>
    <path d="M132 230 L120 330" stroke="url(#s-${id})" stroke-width="11" fill="none"/>
    <path d="M268 230 L280 330" stroke="url(#s-${id})" stroke-width="11" fill="none"/>
    <path d="M150 232 L164 330" stroke="url(#w-${id})" stroke-width="10" fill="none"/>
    <path d="M250 232 L236 330" stroke="url(#w-${id})" stroke-width="10" fill="none"/>
    <path d="M128 282 L272 282" stroke="${t.dark}" stroke-width="6" opacity=".8"/>
    <path d="M152 118 Q200 102 248 118" stroke="${t.shadow}" stroke-width="2" fill="none" opacity=".35"/>
  </g>` + SVG_CLOSE;
  },

  armchair(t, id) {
    return svgOpen(t, id) + `
  <g>
    <path d="M112 128 Q200 96 288 128 L280 226 Q200 202 120 226 Z" fill="url(#w-${id})"/>
    <path d="M120 224 Q200 201 280 224 L278 246 Q200 226 122 246 Z" fill="#1B1917" opacity=".85"/>
    <path d="M96 196 Q88 168 108 162 Q126 158 130 184 L124 250 L100 250 Z" fill="url(#s-${id})"/>
    <path d="M304 196 Q312 168 292 162 Q274 158 270 184 L276 250 L300 250 Z" fill="url(#s-${id})"/>
    <path d="M100 246 Q200 226 300 246 L292 272 Q200 254 108 272 Z" fill="url(#w-${id})"/>
    <path d="M112 270 L104 330" stroke="url(#s-${id})" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M288 270 L296 330" stroke="url(#s-${id})" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M156 268 L160 330" stroke="url(#w-${id})" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M244 268 L240 330" stroke="url(#w-${id})" stroke-width="10" stroke-linecap="round" fill="none"/>
    <path d="M132 148 Q200 122 268 148" stroke="${t.shadow}" stroke-width="2" fill="none" opacity=".3"/>
  </g>` + SVG_CLOSE;
  },

  loungeChair(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <path d="M236 86 L276 102 L192 248 L152 232 Z" fill="#E8CFA4"/>
    <g stroke="${t.dark}" stroke-width="2.2" opacity=".5">
      <path d="M244 100 L252 106 M232 118 L252 126 M222 136 L244 146 M212 154 L234 164 M202 172 L224 182 M192 190 L214 200 M182 208 L204 218 M174 226 L192 234"/>
      <path d="M250 92 L166 238 M264 98 L180 244"/>
    </g>
    <path d="M236 86 L276 102 L192 248 L152 232 Z" fill="none" stroke="url(#w-${id})" stroke-width="10" stroke-linejoin="round"/>
    <path d="M152 230 L308 246 L316 272 L156 256 Z" fill="url(#w-${id})"/>
    <path d="M156 254 L316 270 L314 282 L158 266 Z" fill="url(#s-${id})"/>
    <path d="M300 262 L312 330" stroke="url(#s-${id})" stroke-width="13"/>
    <path d="M168 254 L146 330" stroke="url(#s-${id})" stroke-width="13"/>
    <path d="M236 262 L262 330" stroke="url(#w-${id})" stroke-width="11" opacity=".9"/>
    <path d="M154 300 L306 306" stroke="${t.dark}" stroke-width="6" opacity=".8"/>
    <path d="M276 102 Q322 128 314 178 L302 250" stroke="url(#w-${id})" stroke-width="11" fill="none"/>
  </g>` + SVG_CLOSE;
  },

  diningTable(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <path d="M72 176 Q200 158 328 176 L322 200 Q200 184 78 200 Z" fill="url(#w-${id})"/>
    <path d="M78 198 Q200 183 322 198 L320 210 Q200 196 80 210 Z" fill="url(#s-${id})"/>
    <path d="M98 208 L86 330" stroke="url(#s-${id})" stroke-width="13"/>
    <path d="M302 208 L314 330" stroke="url(#s-${id})" stroke-width="13"/>
    <path d="M150 210 L146 300" stroke="url(#w-${id})" stroke-width="11" opacity=".9"/>
    <path d="M250 210 L254 300" stroke="url(#w-${id})" stroke-width="11" opacity=".9"/>
    <path d="M92 268 L308 268" stroke="${t.dark}" stroke-width="7" opacity=".85"/>
    <path d="M96 186 Q200 172 304 186" stroke="${t.shadow}" stroke-width="2" fill="none" opacity=".35"/>
    <path d="M110 180 Q200 168 290 180" stroke="${t.shadow}" stroke-width="1.4" fill="none" opacity=".25"/>
  </g>` + SVG_CLOSE;
  },

  sideboard(t, id) {
    return svgOpen(t, id) + `
  <g>
    <rect x="76" y="150" width="248" height="132" rx="14" fill="url(#w-${id})"/>
    <rect x="76" y="150" width="248" height="16" rx="8" fill="url(#s-${id})"/>
    <g stroke="${t.shadow}" stroke-width="2.2" opacity=".55">
      ${Array.from({length: 15}, (_, i) => `<path d="M${94 + i * 15} 172 L${94 + i * 15} 276"/>`).join('')}
    </g>
    <line x1="200" y1="168" x2="200" y2="280" stroke="${t.shadow}" stroke-width="4" opacity=".7"/>
    <circle cx="186" cy="220" r="6" fill="#1B1917"/>
    <circle cx="214" cy="220" r="6" fill="#1B1917"/>
    <path d="M100 284 L92 330" stroke="url(#s-${id})" stroke-width="11" stroke-linecap="round" fill="none"/>
    <path d="M300 284 L308 330" stroke="url(#s-${id})" stroke-width="11" stroke-linecap="round" fill="none"/>
  </g>` + SVG_CLOSE;
  },

  bedFrame(t, id) {
    return svgOpen(t, id) + `
  <g>
    <path d="M84 118 Q200 96 316 118 L316 232 L84 232 Z" fill="url(#w-${id})"/>
    <path d="M96 132 Q200 112 304 132 L304 218 L96 218 Z" fill="#F2EEE5"/>
    <path d="M96 176 Q200 158 304 176 L304 218 L96 218 Z" fill="#E4DDCE"/>
    <rect x="104" y="142" width="86" height="26" rx="12" fill="#FBFAF6"/>
    <rect x="210" y="142" width="86" height="26" rx="12" fill="#FBFAF6"/>
    <rect x="72" y="228" width="256" height="42" rx="10" fill="url(#s-${id})"/>
    <path d="M92 270 L88 330" stroke="url(#s-${id})" stroke-width="12" stroke-linecap="round" fill="none"/>
    <path d="M308 270 L312 330" stroke="url(#s-${id})" stroke-width="12" stroke-linecap="round" fill="none"/>
  </g>` + SVG_CLOSE;
  },

  bookshelf(t, id) {
    return svgOpen(t, id) + `
  <g>
    <rect x="108" y="78" width="14" height="252" rx="7" fill="url(#s-${id})"/>
    <rect x="278" y="78" width="14" height="252" rx="7" fill="url(#s-${id})"/>
    <rect x="104" y="106" width="192" height="12" rx="6" fill="url(#w-${id})"/>
    <rect x="104" y="176" width="192" height="12" rx="6" fill="url(#w-${id})"/>
    <rect x="104" y="246" width="192" height="12" rx="6" fill="url(#w-${id})"/>
    <rect x="104" y="316" width="192" height="12" rx="6" fill="url(#w-${id})"/>
    <g opacity=".9">
      <rect x="132" y="128" width="13" height="48" rx="3" fill="${t.dark}"/>
      <rect x="149" y="134" width="12" height="42" rx="3" fill="#6F7352"/>
      <rect x="165" y="126" width="14" height="50" rx="3" fill="${t.mid}"/>
      <rect x="216" y="198" width="13" height="48" rx="3" fill="#6F7352"/>
      <rect x="233" y="204" width="12" height="42" rx="3" fill="${t.dark}"/>
      <rect x="249" y="196" width="14" height="50" rx="3" fill="${t.light}"/>
      <rect x="134" y="270" width="13" height="46" rx="3" fill="${t.mid}"/>
      <rect x="151" y="276" width="12" height="40" rx="3" fill="${t.shadow}"/>
      <circle cx="252" cy="296" r="20" fill="#6F7352" opacity=".85"/>
    </g>
  </g>` + SVG_CLOSE;
  },

  coffeeTable(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <ellipse cx="200" cy="210" rx="126" ry="30" fill="url(#w-${id})"/>
    <path d="M74 210 Q74 228 200 228 Q326 228 326 210 L326 220 Q326 240 200 240 Q74 240 74 220 Z" fill="url(#s-${id})"/>
    <ellipse cx="200" cy="208" rx="104" ry="22" fill="none" stroke="${t.shadow}" stroke-width="1.6" opacity=".3"/>
    <ellipse cx="200" cy="208" rx="78" ry="15" fill="none" stroke="${t.shadow}" stroke-width="1.3" opacity=".22"/>
    <path d="M124 236 L112 330" stroke="url(#s-${id})" stroke-width="12"/>
    <path d="M276 236 L288 330" stroke="url(#s-${id})" stroke-width="12"/>
    <path d="M200 240 L200 322" stroke="url(#w-${id})" stroke-width="11"/>
    <path d="M122 296 L280 296" stroke="${t.dark}" stroke-width="6" opacity=".8"/>
  </g>` + SVG_CLOSE;
  },

  barStool(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <ellipse cx="200" cy="128" rx="66" ry="20" fill="url(#w-${id})"/>
    <path d="M134 128 Q134 142 200 142 Q266 142 266 128 L266 138 Q266 154 200 154 Q134 154 134 138 Z" fill="url(#s-${id})"/>
    <path d="M148 148 L118 330" stroke="url(#s-${id})" stroke-width="11"/>
    <path d="M252 148 L282 330" stroke="url(#s-${id})" stroke-width="11"/>
    <path d="M200 154 L200 330" stroke="url(#w-${id})" stroke-width="10"/>
    <ellipse cx="200" cy="248" rx="72" ry="12" fill="none" stroke="${t.dark}" stroke-width="6" opacity=".85"/>
    <ellipse cx="200" cy="124" rx="48" ry="12" fill="none" stroke="${t.shadow}" stroke-width="1.6" opacity=".3"/>
  </g>` + SVG_CLOSE;
  },

  console(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <path d="M84 168 Q200 152 316 168 L312 188 Q200 174 88 188 Z" fill="url(#w-${id})"/>
    <path d="M88 186 Q200 173 312 186 L311 196 Q200 184 89 196 Z" fill="url(#s-${id})"/>
    <rect x="118" y="200" width="164" height="44" rx="10" fill="url(#w-${id})"/>
    <circle cx="200" cy="222" r="6" fill="#1B1917"/>
    <path d="M104 194 L96 330" stroke="url(#s-${id})" stroke-width="11"/>
    <path d="M296 194 L304 330" stroke="url(#s-${id})" stroke-width="11"/>
    <path d="M104 288 L300 288" stroke="${t.dark}" stroke-width="5" opacity=".8"/>
    <path d="M110 176 Q200 164 290 176" stroke="${t.shadow}" stroke-width="1.6" fill="none" opacity=".3"/>
  </g>` + SVG_CLOSE;
  },

  bench(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <path d="M64 216 Q200 198 336 216 L330 242 Q200 226 70 242 Z" fill="url(#w-${id})"/>
    <path d="M70 240 Q200 225 330 240 L328 252 Q200 238 72 252 Z" fill="url(#s-${id})"/>
    <path d="M100 250 L84 330 M116 250 L134 330" stroke="url(#s-${id})" stroke-width="11" fill="none"/>
    <path d="M300 250 L316 330 M284 250 L266 330" stroke="url(#s-${id})" stroke-width="11" fill="none"/>
    <path d="M90 224 Q200 210 310 224" stroke="${t.shadow}" stroke-width="1.8" fill="none" opacity=".35"/>
    <path d="M104 232 Q200 220 296 232" stroke="${t.shadow}" stroke-width="1.3" fill="none" opacity=".22"/>
  </g>` + SVG_CLOSE;
  },

  sideTable(t, id) {
    return svgOpen(t, id) + `
  <g stroke-linecap="round">
    <ellipse cx="200" cy="168" rx="84" ry="22" fill="url(#w-${id})"/>
    <path d="M116 168 Q116 184 200 184 Q284 184 284 168 L284 178 Q284 196 200 196 Q116 196 116 178 Z" fill="url(#s-${id})"/>
    <path d="M156 192 L136 330" stroke="url(#s-${id})" stroke-width="11"/>
    <path d="M244 192 L264 330" stroke="url(#s-${id})" stroke-width="11"/>
    <path d="M200 196 L200 326" stroke="url(#w-${id})" stroke-width="9" opacity=".9"/>
    <ellipse cx="200" cy="262" rx="56" ry="10" fill="none" stroke="${t.dark}" stroke-width="5" opacity=".8"/>
    <path d="M172 156 Q200 148 228 156" stroke="${t.shadow}" stroke-width="1.6" fill="none" opacity=".3"/>
    <path d="M186 170 Q200 174 214 170" stroke="${t.shadow}" stroke-width="1.3" fill="none" opacity=".25"/>
  </g>` + SVG_CLOSE;
  }
};

/* Catalogue ----------------------------------------------------------- */

const PRODUCTS = [
  {
    id: 'kiaat-curve', name: 'Kiaat Curve', category: 'Dining chairs',
    materials: 'solid kiaat · bouclé fabric · brushed steel accents',
    blurb: 'Sculptural dining chair with soft curves and a lightweight silhouette.',
    price: 4850, tag: 'bestseller', rating: 4.8, tone: 'kiaat', drawing: 'diningChair'
  },
  {
    id: 'blackwood-shell', name: 'Blackwood Shell', category: 'Armchairs',
    materials: 'african blackwood · full-grain leather · matte black hardware',
    blurb: 'Statement armchair with a deep seat and a hand-shaped hardwood shell.',
    price: 12400, tag: 'popular', rating: 5.0, tone: 'blackwood', drawing: 'armchair'
  },
  {
    id: 'amber-karoo', name: 'Amber Karoo', category: 'Lounge chairs',
    materials: 'dark kiaat · woven cane · solid brass details',
    blurb: 'Low-slung lounge chair with a hand-woven cane back on an angled frame.',
    price: 16900, tag: 'premium', rating: 4.9, tone: 'amber', drawing: 'loungeChair'
  },
  {
    id: 'msasa-table', name: 'Msasa Dining Table', category: 'Tables',
    materials: 'bookmatched walnut slab · hand-rubbed oil finish',
    blurb: 'Eight-seater table cut from a single bookmatched slab, finished by hand.',
    price: 28500, tag: 'premium', rating: 4.9, tone: 'walnut', drawing: 'diningTable'
  },
  {
    id: 'knysna-sideboard', name: 'Knysna Sideboard', category: 'Storage',
    materials: 'fluted yellowwood · soft-close brass hinges',
    blurb: 'Fluted-front sideboard with two soft-close doors and adjustable shelving.',
    price: 24750, tag: 'new', rating: 4.7, tone: 'yellowwood', drawing: 'sideboard'
  },
  {
    id: 'miombo-bed', name: 'Miombo Bed Frame', category: 'Bedroom',
    materials: 'solid kiaat frame · upholstered linen headboard',
    blurb: 'Floating platform bed with a wide upholstered headboard and hidden legs.',
    price: 32900, tag: 'premium', rating: 4.8, tone: 'kiaat', drawing: 'bedFrame'
  },
  {
    id: 'fynbos-side', name: 'Fynbos Side Table', category: 'Tables',
    materials: 'turned walnut · natural wax finish',
    blurb: 'Compact turned side table that works beside a sofa, bed or bath.',
    price: 6450, tag: 'bestseller', rating: 4.6, tone: 'walnut', drawing: 'sideTable'
  },
  {
    id: 'baobab-shelf', name: 'Baobab Bookshelf', category: 'Storage',
    materials: 'kiaat uprights · floating amber shelves',
    blurb: 'Open shelving with hand-jointed uprights and four floating shelves.',
    price: 18200, tag: 'new', rating: 4.7, tone: 'amber', drawing: 'bookshelf'
  },
  {
    id: 'cederberg-coffee', name: 'Cederberg Coffee Table', category: 'Tables',
    materials: 'oval yellowwood top · splayed hardwood legs',
    blurb: 'Generous oval coffee table with a low profile and rounded edge detail.',
    price: 9800, tag: 'popular', rating: 4.8, tone: 'yellowwood', drawing: 'coffeeTable'
  },
  {
    id: 'marula-stool', name: 'Marula Bar Stool', category: 'Dining chairs',
    materials: 'solid blackwood · turned legs · footrest ring',
    blurb: 'Counter-height stool with a gently dished seat and turned legs.',
    price: 3950, tag: 'bestseller', rating: 4.5, tone: 'blackwood', drawing: 'barStool'
  },
  {
    id: 'yellowwood-console', name: 'Yellowwood Console', category: 'Storage',
    materials: 'reclaimed yellowwood · single centre drawer',
    blurb: 'Slim entryway console with one hand-cut dovetailed drawer.',
    price: 14600, tag: 'new', rating: 4.9, tone: 'yellowwood', drawing: 'console'
  },
  {
    id: 'tsitsikamma-bench', name: 'Tsitsikamma Bench', category: 'Bedroom',
    materials: 'live-edge walnut · splayed trestle legs',
    blurb: 'Live-edge bench for an entrance hall or the foot of a bed.',
    price: 11250, tag: 'popular', rating: 4.7, tone: 'walnut', drawing: 'bench'
  }
];

function productArt(p) {
  return DRAWINGS[p.drawing](WOOD[p.tone], p.id);
}

const ZAR = new Intl.NumberFormat('en-ZA', {
  style: 'currency', currency: 'ZAR', maximumFractionDigits: 0
});
