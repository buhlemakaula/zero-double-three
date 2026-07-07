import './style.css'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isTouch = window.matchMedia('(hover: none)').matches

/* ============================================================
   SMOOTH SCROLL (Lenis) synced to ScrollTrigger
   ============================================================ */
let lenis
if (!reduce) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}
function scrollTo(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

/* ============================================================
   SPLIT text into words/lines (lightweight)
   ============================================================ */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/)
  el.innerHTML = words
    .map((w) => `<span class="word-wrap"><span class="word">${w}</span></span>`)
    .join(' ')
  return el.querySelectorAll('.word')
}

/* ============================================================
   PRELOADER
   ============================================================ */
function runLoader(done) {
  const loader = document.getElementById('loader')
  const num = document.getElementById('loaderNum')
  const bar = document.getElementById('loaderBar')
  const words = document.querySelectorAll('.loader__word [data-word]')

  if (reduce) {
    loader.style.display = 'none'
    done()
    return
  }

  const counter = { v: 0 }
  const tl = gsap.timeline()
  tl.to(words, { y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0)
    .to(counter, {
      v: 100, duration: 2, ease: 'power2.inOut',
      onUpdate: () => {
        num.textContent = Math.round(counter.v)
        bar.style.width = counter.v + '%'
      }
    }, 0)
    .to('.loader__inner', { y: -30, opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=0.15')
    .to(loader, {
      clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut',
      onComplete: () => { loader.style.display = 'none' }
    }, '-=0.2')
    .add(done, '-=0.6')
}

/* ============================================================
   HERO intro
   ============================================================ */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
  tl.from('.hero__title .w', { yPercent: 120, duration: 1.1, stagger: 0.09 })
    .from('.hero__eyebrow span', { yPercent: 120, duration: 0.9 }, 0.2)
    .from('.hero__portrait-mask', { clipPath: 'inset(100% 0 0 0)', duration: 1.2 }, 0.35)
    .from('.hero__portrait img', { scale: 1.4, duration: 1.4 }, 0.35)
    .from('.hero__lede span', { yPercent: 120, duration: 0.9, stagger: 0.08 }, 0.5)
    .from('.scrollcue', { opacity: 0, y: 14, duration: 0.8 }, 0.7)
    .from('.hero__portrait figcaption', { opacity: 0, duration: 0.8 }, 0.8)
    .from('.nav', { yPercent: -100, opacity: 0, duration: 0.9 }, 0.3)

  // hero background word drift + portrait parallax
  if (!reduce) {
    gsap.to('.hero__bgtype span', {
      xPercent: -12, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    })
    gsap.to('.hero__title', {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    })
  }
}

/* ============================================================
   Generic scroll reveals
   ============================================================ */
function reveals() {
  // Line masks: .reveal-line > span
  gsap.utils.toArray('.reveal-line').forEach((el) => {
    const inner = el.querySelectorAll('span')
    gsap.from(inner, {
      yPercent: 120, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    })
  })

  // Section titles
  gsap.utils.toArray('.section-head__title span').forEach((el) => {
    gsap.from(el, {
      yPercent: 110, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    })
  })

  // Manifesto — word by word fade
  const manifesto = document.querySelector('.manifesto__text')
  if (manifesto) {
    manifesto.querySelectorAll('.ph').forEach((ph) => {
      const words = splitWords(ph)
      gsap.from(words, {
        opacity: 0.12, duration: 0.6, ease: 'none', stagger: 0.06,
        scrollTrigger: { trigger: ph, start: 'top 85%', end: 'top 40%', scrub: true }
      })
    })
  }

  // Projects reveal
  gsap.utils.toArray('[data-project]').forEach((p) => {
    const media = p.querySelector('.project__media')
    const info = p.querySelectorAll('.project__no, .project__name, .project__desc, .project__tags')
    gsap.from(media, {
      yPercent: 12, opacity: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: p, start: 'top 82%' }
    })
    gsap.from(info, {
      y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: p, start: 'top 78%' }
    })
  })

  // Services rows
  gsap.utils.toArray('[data-svc]').forEach((s) => {
    gsap.from(s, {
      y: 24, opacity: 0, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: s, start: 'top 90%' }
    })
  })

  // About + contact big
  gsap.from('.about__lead, .about__p, .about__row', {
    y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.about', start: 'top 70%' }
  })
  gsap.from('.contact__big .w', {
    yPercent: 120, duration: 1.1, ease: 'expo.out', stagger: 0.09,
    scrollTrigger: { trigger: '.contact', start: 'top 75%' }
  })
  gsap.from('.contact__row', {
    y: 24, opacity: 0, duration: 0.9, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__row', start: 'top 92%' }
  })
}

/* ============================================================
   Parallax on [data-parallax]
   ============================================================ */
function parallax() {
  if (reduce) return
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '-0.1')
    gsap.to(el.querySelector('img') || el, {
      yPercent: speed * 100, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    })
  })
}

/* ============================================================
   Number counters
   ============================================================ */
function counters() {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count)
    const suffix = el.dataset.suffix || ''
    const obj = { v: 0 }
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => { el.innerHTML = Math.round(obj.v) + `<span class="suffix">${suffix}</span>` }
        })
      }
    })
  })
}

/* ============================================================
   Marquees — velocity aware
   ============================================================ */
function marquees() {
  gsap.utils.toArray('[data-marquee]').forEach((m) => {
    const track = m.querySelector('.marquee__track')
    if (!track) return
    const dir = m.dataset.dir === '1' ? 1 : -1
    const width = track.scrollWidth / 2
    const base = 28 // seconds for full loop
    const tween = gsap.to(track, {
      x: dir === -1 ? -width : width,
      duration: base, ease: 'none', repeat: -1,
      modifiers: { x: gsap.utils.unitize((x) => (dir === -1 ? parseFloat(x) % -width : parseFloat(x) % width)) }
    })
    if (dir === 1) gsap.set(track, { x: -width })
    if (!reduce && lenis) {
      lenis.on('scroll', (e) => {
        const v = gsap.utils.clamp(-4, 4, e.velocity || 0)
        tween.timeScale(1 + Math.abs(v) * 0.4)
        gsap.to(tween, { timeScale: 1, duration: 0.8, overwrite: true })
      })
    }
  })
}

/* ============================================================
   Scroll progress bar + nav bg
   ============================================================ */
function progress() {
  const prog = document.getElementById('scrollProg')
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => { prog.style.width = (self.progress * 100).toFixed(2) + '%' }
  })
}

/* ============================================================
   Custom cursor + magnetic buttons
   ============================================================ */
function cursor() {
  if (isTouch) return
  const cur = document.querySelector('.cursor')
  const label = document.querySelector('.cursor__label')
  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const mouse = { x: pos.x, y: pos.y }

  window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })
  gsap.ticker.add(() => {
    pos.x += (mouse.x - pos.x) * 0.2
    pos.y += (mouse.y - pos.y) * 0.2
    gsap.set(cur, { x: pos.x, y: pos.y })
  })

  document.querySelectorAll('a, button, [data-magnetic], [data-project], [data-svc]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cur.classList.add('is-hover')
      if (el.dataset.project !== undefined || el.dataset.svc !== undefined) label.textContent = 'View'
      else if (el.href && el.href.startsWith('mailto')) label.textContent = 'Email'
      else label.textContent = ''
    })
    el.addEventListener('mouseleave', () => { cur.classList.remove('is-hover'); label.textContent = '' })
  })

  // magnetic
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      gsap.to(el, { x: mx * 0.3, y: my * 0.4, duration: 0.6, ease: 'power3.out' })
    })
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }))
  })

  document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'))
  document.addEventListener('mouseenter', () => cur.classList.remove('is-hidden'))
}

/* ============================================================
   Nav interactions
   ============================================================ */
function navigation() {
  const nav = document.getElementById('nav')
  const burger = document.getElementById('burger')
  const menu = document.getElementById('menu')

  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open')
    menu.classList.toggle('is-open', open)
    menu.setAttribute('aria-hidden', String(!open))
    document.body.style.overflow = open ? 'hidden' : ''
    if (lenis) open ? lenis.stop() : lenis.start()
  })

  document.querySelectorAll('[data-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href')
      if (href && href.startsWith('#')) {
        e.preventDefault()
        if (nav.classList.contains('is-open')) burger.click()
        scrollTo(href)
      }
    })
  })

  // social placeholders → gentle nudge (no dead links surprise)
  document.querySelectorAll('[data-social]').forEach((a) => {
    a.addEventListener('click', (e) => { if (a.getAttribute('href') === '#') e.preventDefault() })
  })
}

/* ============================================================
   Swap hero portrait if a real photo is present
   ============================================================ */
function tryRealPortrait() {
  const img = document.getElementById('heroImg')
  const test = new Image()
  test.onload = () => { img.src = './img/buhle.jpg' }
  test.src = './img/buhle.jpg'
}

/* ============================================================
   BOOT
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  if (lenis) lenis.stop()
  tryRealPortrait()

  runLoader(() => {
    if (lenis) lenis.start()
    heroIntro()
    reveals()
    parallax()
    counters()
    marquees()
    progress()
    cursor()
    ScrollTrigger.refresh()
  })

  navigation()
  window.addEventListener('load', () => ScrollTrigger.refresh())
})
