/* globals: gsap, ScrollTrigger, Lenis, Swiper */

gsap.registerPlugin(ScrollTrigger)

// ── Smooth Scroll ──────────────────────────────────────────────────────────
const lenis = new Lenis({ duration: 1.2 })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href')
    if (href === '#') return
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) lenis.scrollTo(target, { offset: -96, duration: 1.4 })
  })
})

// ── Scroll Progress ────────────────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress')
lenis.on('scroll', ({ progress }) => {
  progressBar.style.width = (progress * 100) + '%'
})

// ── Back to Top ────────────────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top')
lenis.on('scroll', ({ progress }) => {
  backToTop.classList.toggle('visible', progress > 0.15)
})
backToTop.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.6 }))

// ── Navbar Glass Effect ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar')
ScrollTrigger.create({
  start: 'top -60px',
  onEnter: () => navbar.classList.add('nav-scrolled'),
  onLeaveBack: () => navbar.classList.remove('nav-scrolled')
})

// ── Hero Animation ─────────────────────────────────────────────────────────
function splitWords(el) {
  const raw = el.textContent.trim()
  el.innerHTML = raw.split(' ').map(w =>
    `<span class="word-wrap"><span class="word">${w}</span></span>`
  ).join(' ')
}

splitWords(document.getElementById('hero-title'))

gsap.timeline({ defaults: { ease: 'power3.out' } })
  .from('#hero-label',        { opacity: 0, y: 18, duration: 0.8 })
  .from('#hero-title .word',  { y: '110%', opacity: 0, duration: 0.7, stagger: 0.07 }, '-=0.35')
  .from('#hero-body',         { opacity: 0, y: 20, duration: 0.7 }, '-=0.3')
  .from('#hero-ctas',         { opacity: 0, y: 20, duration: 0.7 }, '-=0.45')
  .from('#hero-image',        { opacity: 0, x: 50, scale: 0.97, duration: 1.1 }, '-=0.85')

// Hero parallax
gsap.to('#hero-image', {
  yPercent: -12,
  ease: 'none',
  scrollTrigger: {
    trigger: '#hero-section',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5
  }
})

// ── Stats Count Up (GSAP-powered) ─────────────────────────────────────────
function animateStat(id, end, prefix, suffix) {
  const el = document.getElementById(id)
  const obj = { val: 0 }
  let started = false
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => {
      if (started) return
      started = true
      gsap.to(obj, {
        val: end,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = prefix + Math.round(obj.val) + suffix
        }
      })
    }
  })
}

animateStat('stat-1', 500, '',  '+')
animateStat('stat-2', 25,  '$', 'M+')
animateStat('stat-3', 15,  '',  '+')

// ── Scroll Reveals ─────────────────────────────────────────────────────────
gsap.utils.toArray('[data-reveal]').forEach(el => {
  gsap.from(el, {
    opacity: 0,
    y: 44,
    duration: 0.95,
    ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  })
})

gsap.utils.toArray('[data-reveal-stagger]').forEach(parent => {
  gsap.from(parent.querySelectorAll('[data-item]'), {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.14,
    ease: 'power3.out',
    scrollTrigger: { trigger: parent, start: 'top 82%' }
  })
})

// ── 3D Card Tilt ───────────────────────────────────────────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = card.getBoundingClientRect()
    const x = (e.clientX - left - width  / 2) / (width  / 2)
    const y = (e.clientY - top  - height / 2) / (height / 2)
    gsap.to(card, {
      rotateY: x * 7,
      rotateX: -y * 7,
      transformPerspective: 900,
      ease: 'power2.out',
      duration: 0.4
    })
  })
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.65, ease: 'power2.out' })
  })
})

// ── Magnetic Buttons ───────────────────────────────────────────────────────
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = btn.getBoundingClientRect()
    const x = e.clientX - left - width  / 2
    const y = e.clientY - top  - height / 2
    gsap.to(btn, { x: x * 0.22, y: y * 0.22, ease: 'power2.out', duration: 0.35 })
  })
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, ease: 'elastic.out(1, 0.35)', duration: 0.8 })
  })
})

// ── Modals ─────────────────────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id).classList.add('open')
  document.body.style.overflow = 'hidden'
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open')
  document.body.style.overflow = ''
}

;['modal-privacy','modal-tos','modal-linkedin'].forEach(id => {
  const overlay = document.getElementById(id)
  if (!overlay) return
  overlay.querySelector('.site-modal-close').addEventListener('click', () => closeModal(id))
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(id) })
})

document.getElementById('privacy-link')?.addEventListener('click', (e) => { e.preventDefault(); openModal('modal-privacy') })
document.getElementById('tos-link')?.addEventListener('click', (e) => { e.preventDefault(); openModal('modal-tos') })
document.getElementById('linkedin-link')?.addEventListener('click', (e) => { e.preventDefault(); openModal('modal-linkedin') })

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') ['modal-privacy','modal-tos','modal-linkedin'].forEach(closeModal)
})

// ── View All Results Toggle ────────────────────────────────────────────────
const viewAllResultsBtn  = document.getElementById('view-all-results')
const viewAllResultsIcon = document.getElementById('view-all-results-icon')
const extraResults       = document.getElementById('extra-results')
if (viewAllResultsBtn && extraResults) {
  let open = false
  viewAllResultsBtn.addEventListener('click', () => {
    open = !open
    const cards = extraResults.querySelectorAll('.bg-surface')
    gsap.killTweensOf(cards)
    if (open) {
      extraResults.style.display = 'grid'
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
      )
      viewAllResultsBtn.childNodes[0].textContent = 'Show Less '
      viewAllResultsIcon.textContent = 'expand_less'
    } else {
      gsap.fromTo(cards,
        { opacity: 1, y: 0 },
        { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in',
          onComplete: () => { extraResults.style.display = 'none' }
        }
      )
      viewAllResultsBtn.childNodes[0].textContent = 'View All Results '
      viewAllResultsIcon.textContent = 'expand_more'
    }
  })
}

// ── View All Services Toggle ───────────────────────────────────────────────
const viewAllBtn   = document.getElementById('view-all-services')
const viewAllIcon  = document.getElementById('view-all-icon')
const extraServices = document.getElementById('extra-services')
if (viewAllBtn && extraServices) {
  let open = false
  viewAllBtn.addEventListener('click', () => {
    open = !open
    const cards = extraServices.querySelectorAll('.tilt-card')
    gsap.killTweensOf(cards)
    if (open) {
      extraServices.style.display = 'grid'
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
      )
      viewAllBtn.childNodes[0].textContent = 'Show Less '
      viewAllIcon.textContent = 'expand_less'
    } else {
      gsap.fromTo(cards,
        { opacity: 1, y: 0 },
        { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in',
          onComplete: () => { extraServices.style.display = 'none' }
        }
      )
      viewAllBtn.childNodes[0].textContent = 'View All Services '
      viewAllIcon.textContent = 'expand_more'
    }
  })
}

// ── Infinite Grid ──────────────────────────────────────────────────────────
;(function () {
  const basePat   = document.getElementById('grid-pat-base')
  const brightPat = document.getElementById('grid-pat-bright')
  const brightSvg = document.getElementById('grid-svg-bright')
  if (!basePat || !brightPat || !brightSvg) return

  const CELL = 60
  let ox = 0, oy = 0

  document.addEventListener('mousemove', (e) => {
    const x = e.clientX, y = e.clientY
    brightSvg.style.maskImage       = `radial-gradient(350px circle at ${x}px ${y}px, black, transparent)`
    brightSvg.style.webkitMaskImage = `radial-gradient(350px circle at ${x}px ${y}px, black, transparent)`
  })

  document.addEventListener('mouseleave', () => {
    brightSvg.style.maskImage       = 'radial-gradient(350px circle at -9999px -9999px, black, transparent)'
    brightSvg.style.webkitMaskImage = 'radial-gradient(350px circle at -9999px -9999px, black, transparent)'
  })

  function tick () {
    ox = (ox + 0.18) % CELL
    oy = (oy + 0.10) % CELL
    const x = ox.toFixed(2), y = oy.toFixed(2)
    basePat.setAttribute('x', x)
    basePat.setAttribute('y', y)
    brightPat.setAttribute('x', x)
    brightPat.setAttribute('y', y)
    requestAnimationFrame(tick)
  }
  tick()
})()
