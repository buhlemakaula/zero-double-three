// Row of circular icon buttons directly under the hero. Monochrome line icons
// in greige circles, 44px+ tap targets, label beneath.
const ICONS = {
  about: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0',
  services: 'M4 7h16M4 12h16M4 17h10',
  portfolio: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5',
  faqs: 'M9 9a3 3 0 116 0c0 2-3 2-3 4M12 17h.01',
  testimonials:
    'M12 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.5-.8z',
  contact: 'M4 5h16v14H4zM4 7l8 6 8-6',
}

const ITEMS = [
  ['About', '#about', 'about'],
  ['Services', '#services', 'services'],
  ['Portfolio', '#portfolio', 'portfolio'],
  ['FAQs', '#faqs', 'faqs'],
  ['Reviews', '#testimonials', 'testimonials'],
  ['Contact', '#contact', 'contact'],
]

export default function IconNav() {
  return (
    <nav aria-label="Jump to section" className="border-y hairline bg-paper py-8">
      <div className="shell">
        <ul className="grid grid-cols-3 gap-y-7 sm:grid-cols-6">
          {ITEMS.map(([label, href, icon]) => (
            <li key={href} className="flex justify-center">
              <a
                href={href}
                className="group flex flex-col items-center gap-2.5 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-greige transition-colors group-hover:bg-ink">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 stroke-ink transition-colors group-hover:stroke-paper"
                    fill="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={ICONS[icon]} />
                  </svg>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-ink/70">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
