import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_SETTINGS } from './lib/settings.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import IconNav from './components/IconNav.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import BookWithUs from './components/BookWithUs.jsx'
import GlamCard from './components/GlamCard.jsx'
import Portfolio from './components/Portfolio.jsx'
import HoursContact from './components/HoursContact.jsx'
import Policies from './components/Policies.jsx'
import FAQ from './components/FAQ.jsx'
import Testimonials from './components/Testimonials.jsx'
import Footer from './components/Footer.jsx'
import BookingFlow from './components/booking/BookingFlow.jsx'

export default function App() {
  const settings = DEFAULT_SETTINGS
  const [booking, setBooking] = useState(null) // null | { serviceId }

  // Lightweight routing: the /book route (or #book hash) opens the flow.
  const openBooking = useCallback((serviceId = null) => {
    setBooking({ serviceId: typeof serviceId === 'string' ? serviceId : null })
    if (window.location.pathname !== '/book') {
      window.history.pushState({}, '', '/book')
    }
  }, [])

  const closeBooking = useCallback(() => {
    setBooking(null)
    if (window.location.pathname === '/book') {
      window.history.pushState({}, '', '/')
    }
  }, [])

  // Honour deep links to /book and browser back/forward.
  useEffect(() => {
    if (window.location.pathname === '/book') setBooking({ serviceId: null })
    const onPop = () => setBooking(window.location.pathname === '/book' ? { serviceId: null } : null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Lock body scroll while the flow is open.
  useEffect(() => {
    document.body.style.overflow = booking ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [booking])

  return (
    <>
      <Nav onBook={() => openBooking()} />
      <main>
        <Hero onBook={() => openBooking()} />
        <IconNav />
        <About />
        <Services settings={settings} onBook={openBooking} />
        <BookWithUs onBook={() => openBooking()} />
        <GlamCard />
        <Portfolio />
        <HoursContact settings={settings} />
        <Policies settings={settings} />
        <FAQ />
        <Testimonials />
      </main>
      <Footer settings={settings} onBook={() => openBooking()} />

      {booking && (
        <BookingFlow
          settings={settings}
          initialServiceId={booking.serviceId}
          onClose={closeBooking}
        />
      )}
    </>
  )
}
