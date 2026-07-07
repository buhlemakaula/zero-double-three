import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-line bg-ivory">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-mist">
              Curbside, elevated. Groceries, cellar and pharmacy across greater Durban, 06:00–01:00,
              every day.
            </p>
          </div>
          <FooterCol title="Shop" items={['Restaurants', 'Groceries', 'Cellar', 'Pharmacy', 'Connect Wallet']} />
          <FooterCol title="Company" items={['For traders', 'Careers', 'Curbside zones', 'Press', 'Contact']} />
          <FooterCol title="Trust" items={['Age & liquor policy', 'Pharmacy & scripts', 'Privacy', 'Terms', 'POPIA']} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Connect Marketplace (Pty) Ltd · Durban, South Africa</span>
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-forest" /> Trading 06:00–01:00 SAST
            </span>
            <span>·</span>
            <span>Drink responsibly. Not for sale to persons under 18.</span>
          </span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-ink">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i}>
            <a className="text-sm text-mist transition-colors hover:text-ink" href="#">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
