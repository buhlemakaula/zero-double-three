import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_SETTINGS } from './lib/settings.js'
import { fetchSettings } from './lib/data.js'
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
import AdminApp from './components/admin/AdminApp.jsx'

export default function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [booking, setBooking] = useState(null) // null | { serviceId }
  const [isAdmin, setIsAdmin] = useState(window.location.pathname.startsWith('/admin'))

  // Live settings from Supabase (falls back to defaults with no backend).
  useEffect(() => {
    let alive = true
    fetchSettings().then((s) => alive && s && setSettings(s))
    return () => {
      alive = false
    }
  }, [])

  const openBooking = useCallback((serviceId = null) => {
    setBooking({ serviceId: typeof serviceId === 'string' ? serviceId : null })
    if (window.location.pathname !== '/book') window.history.pushState({}, '', '/book')
  }, [])

  const closeBooking = useCallback(() => {
    setBooking(null)
    if (window.location.pathname === '/book') window.history.pushState({}, '', '/')
  }, [])

  // Routing: /admin → dashboard, /book → booking overlay, else the site.
  useEffect(() => {
    const sync = () => {
      const path = window.location.pathname
      setIsAdmin(path.startsWith('/admin'))
      setBooking(path === '/book' ? { serviceId: null } : null)
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  useEffect(() => {
    document.body.style.overflow = booking ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [booking])

  if (isAdmin) return <AdminApp />

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
        <BookingFlow settings={settings} initialServiceId={booking.serviceId} onClose={closeBooking} />
      )}
    </>
  )
}
