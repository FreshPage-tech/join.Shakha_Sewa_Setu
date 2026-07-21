/* ------------------------------------------------------------------
   LEADER-BEE Landing Page
   Interactions and animations
------------------------------------------------------------------ */

(() => {
  'use strict'

  const navbar = document.querySelector('.main-navbar')
  const revealElements = document.querySelectorAll('.reveal-up')
  const navLinks = document.querySelectorAll('.navbar .nav-link')
  const registerButtons = document.querySelectorAll('a[href="#register"]')

  function handleNavbarState() {
    if (!navbar) return
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }
  }

  function setupRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.14,
      },
    )

    revealElements.forEach(el => observer.observe(el))
  }

  function setupActiveNav() {
    const sectionIds = ['about', 'program', 'details', 'benefits', 'register']

    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (sections.length === 0 || !('IntersectionObserver' in window)) return

    const linkMap = new Map()
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || ''
      if (href.startsWith('#')) {
        linkMap.set(href.slice(1), link)
      }
    })

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const id = entry.target.getAttribute('id')
          const link = id ? linkMap.get(id) : null
          if (!link) return

          if (entry.isIntersecting) {
            navLinks.forEach(nav => nav.classList.remove('active'))
            link.classList.add('active')
          }
        })
      },
      {
        threshold: 0.55,
      },
    )

    sections.forEach(section => observer.observe(section))
  }

  function setupButtonRipple() {
    const rippleButtons = document.querySelectorAll('.btn-hero, .btn-register-large')

    rippleButtons.forEach(button => {
      button.addEventListener('click', event => {
        const rect = button.getBoundingClientRect()
        const span = document.createElement('span')
        span.className = 'ripple'

        const size = Math.max(rect.width, rect.height)
        span.style.width = `${size}px`
        span.style.height = `${size}px`
        span.style.left = `${event.clientX - rect.left - size / 2}px`
        span.style.top = `${event.clientY - rect.top - size / 2}px`

        button.appendChild(span)

        window.setTimeout(() => {
          span.remove()
        }, 600)
      })
    })
  }

  function setupRegisterScroll() {
    registerButtons.forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault()
        const target = document.getElementById('register')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })
  }

  function setupMobileCollapse() {
    const navCollapse = document.getElementById('mainNav')
    if (!navCollapse || !window.bootstrap) return

    const collapseInstance = new window.bootstrap.Collapse(navCollapse, {
      toggle: false,
    })

    document.querySelectorAll('.navbar .nav-link, .btn-register').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          collapseInstance.hide()
        }
      })
    })
  }

  function init() {
    handleNavbarState()
    setupRevealObserver()
    setupActiveNav()
    setupButtonRipple()
    setupRegisterScroll()
    setupMobileCollapse()

    window.addEventListener('scroll', handleNavbarState, { passive: true })
    window.addEventListener('resize', handleNavbarState)
  }

  document.addEventListener('DOMContentLoaded', init)
})()
