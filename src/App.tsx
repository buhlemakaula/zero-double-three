import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { FeaturedRidges } from './components/FeaturedRidges'
import { Marketplace } from './components/Marketplace'
import { Difference } from './components/Difference'
import { Traders } from './components/Traders'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Checkout } from './components/Checkout'

export default function App() {
  const scrollToShop = () =>
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="min-h-screen bg-ivory text-ink">
      <Header />
      <main>
        <Hero onShop={scrollToShop} />
        <Marketplace />
        <FeaturedRidges />
        <Difference />
        <Traders />
      </main>
      <Footer />
      <CartDrawer />
      <Checkout />
    </div>
  )
}
