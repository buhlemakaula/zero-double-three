import './style.css'
import Lenis from 'lenis'
import { gsap } from 'gsap'

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches

/* ---------- smooth scroll ---------- */
let lenis
if (!reduce) {
  lenis = new Lenis({ duration: 1.05, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
}
function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

/* ---------- preloader ---------- */
function runLoader(done) {
  const loader = document.getElementById('loader')
  const num = document.getElementById('loaderNum')
  const bar = document.getElementById('loaderBar')
  if (reduce) { loader.style.display = 'none'; done(); return }
  const c = { v: 0 }
  gsap.timeline()
    .to(c, { v: 100, duration: 1.3, ease: 'power2.inOut',
      onUpdate: () => { num.textContent = Math.round(c.v) + '%'; bar.style.width = c.v + '%' } })
    .to(loader, { yPercent: -100, duration: 0.8, ease: 'expo.inOut',
      onComplete: () => { loader.style.display = 'none' } }, '+=0.15')
    .add(done, '-=0.5')
}

/* ---------- hero intro ---------- */
function heroIntro() {
  if (reduce) return
  gsap.from('.hero__panel > *', { y: 26, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.05 })
  gsap.from('.nav', { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' })
}

/* ---------- scroll reveals (staggered per group) ---------- */
function reveals() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } })
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    // stagger among reveal siblings sharing a parent
    const sibs = [...el.parentElement.querySelectorAll(':scope > [data-reveal]')]
    const i = sibs.indexOf(el)
    if (i > 0) el.style.transitionDelay = (i * 0.07).toFixed(2) + 's'
    io.observe(el)
  })
}

/* ---------- custom cursor + magnetic ---------- */
function cursorFx() {
  if (!fine || reduce) return
  const cur = document.querySelector('.cursor')
  const pos = { x: innerWidth / 2, y: innerHeight / 2 }, mouse = { ...pos }
  addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })
  const tick = () => { pos.x += (mouse.x - pos.x) * 0.25; pos.y += (mouse.y - pos.y) * 0.25
    gsap.set(cur, { x: pos.x, y: pos.y }); requestAnimationFrame(tick) }
  requestAnimationFrame(tick)

  document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', () => cur.classList.add('grow'))
    el.addEventListener('mouseleave', () => cur.classList.remove('grow'))
  })
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect()
      gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * 0.25, y: (e.clientY - (r.top + r.height / 2)) * 0.3,
        duration: 0.5, ease: 'power3.out' })
    })
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }))
  })
}

/* ---------- nav: burger, copy email, links ---------- */
function nav() {
  const navEl = document.getElementById('nav')
  const burger = document.getElementById('burger')
  const menu = document.getElementById('menu')

  burger?.addEventListener('click', () => {
    const open = navEl.classList.toggle('open')
    menu.classList.toggle('open', open)
    menu.setAttribute('aria-hidden', String(!open))
    document.body.style.overflow = open ? 'hidden' : ''
    if (lenis) open ? lenis.stop() : lenis.start()
  })

  document.querySelectorAll('[data-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        if (navEl.classList.contains('open')) burger.click()
        scrollTo(href)
      }
    })
  })

  const copy = document.getElementById('copyEmail')
  copy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('buhlemakaula@gmail.com')
      copy.textContent = 'Copied'; copy.classList.add('copied')
      setTimeout(() => { copy.textContent = 'Copy'; copy.classList.remove('copied') }, 1600)
    } catch { location.href = 'mailto:buhlemakaula@gmail.com' }
  })

  document.querySelectorAll('[data-social]').forEach((a) => {
    a.addEventListener('click', (e) => { if (a.getAttribute('href') === '#') e.preventDefault() })
  })
}

/* ---------- boot ---------- */
addEventListener('DOMContentLoaded', () => {
  if (lenis) lenis.stop()
  nav()
  runLoader(() => {
    if (lenis) lenis.start()
    heroIntro()
    reveals()
    cursorFx()
  })
})
