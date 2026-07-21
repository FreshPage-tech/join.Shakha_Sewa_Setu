/* ------------------------------------------------------------------
   LEADER-BEE Landing Page
   Interactions and animations
------------------------------------------------------------------ */

(() => {
  'use strict'

  const navbar = document.querySelector('.main-navbar')
  const revealElements = document.querySelectorAll('.reveal-up')
  const navLinks = document.querySelectorAll('.navbar .nav-link')
  const registerButtons = document.querySelectorAll('a[href="#register"], .js-open-registration')
  const registrationPanel = document.getElementById('registration-form-panel')
  const registrationForm = document.getElementById('leaderBeeForm')
  const successPanel = document.getElementById('leaderBeeSuccess')
  const resetButtons = document.querySelectorAll('.js-reset-registration')
  const shareButtons = {
    whatsapp: document.querySelector('.js-share-whatsapp'),
    facebook: document.querySelector('.js-share-facebook'),
    email: document.querySelector('.js-share-email'),
    copy: document.querySelector('.js-copy-link'),
  }

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
        if (registrationPanel) {
          registrationPanel.classList.remove('d-none')
          button.setAttribute('aria-expanded', 'true')
          window.setTimeout(() => {
            registrationPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 50)
        } else {
          const target = document.getElementById('register')
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      })
    })
  }

  function updateFieldState(field) {
    if (!field || field.disabled) return true
    const isValid = field.checkValidity()
    field.classList.toggle('is-valid', isValid)
    field.classList.toggle('is-invalid', !isValid)
    return isValid
  }

  function setupFormValidation() {
    if (!registrationForm) return

    const fields = registrationForm.querySelectorAll('input, select, textarea')
    const validateAll = () => {
      let valid = true
      fields.forEach(field => {
        if (!updateFieldState(field)) valid = false
      })
      return valid
    }

    fields.forEach(field => {
      const validateField = () => updateFieldState(field)
      field.addEventListener('input', validateField)
      field.addEventListener('change', validateField)
      field.addEventListener('blur', validateField)
    })

    registrationForm.addEventListener('submit', async event => {
      event.preventDefault()
      event.stopPropagation()

      registrationForm.classList.add('was-validated')
      const isValid = validateAll()
      if (!isValid) {
        return
      }

      const submitButton = registrationForm.querySelector('button[type="submit"]')
      const submitLabel = submitButton?.innerHTML || ''
      if (submitButton) {
        submitButton.disabled = true
        submitButton.innerHTML = 'Submitting...'
      }

      const formData = new FormData(registrationForm)
      const parentEmail = formData.get('parentEmail')?.toString() || ''
      const parentFirstName = formData.get('parentFirstName')?.toString() || ''
      const parentLastName = formData.get('parentLastName')?.toString() || ''
      const parentName = `${parentFirstName} ${parentLastName}`.trim() || 'Parent / Guardian'
      const payload = new URLSearchParams()

      formData.forEach((value, key) => {
        payload.append(key, value.toString())
      })

      payload.set('email', parentEmail)
      payload.set('_subject', `New Leader-BEE Registration: ${parentName}`)
      payload.set('_template', 'table')
      payload.set('_captcha', 'false')
      payload.set('_autoresponse', `Dear ${parentName}, thank you for registering for the Leader-BEE Workshop. Our coordinators have received your details and will contact you soon.`)

      try {
        const response = await fetch('https://formsubmit.co/ajax/leaderbee@shakhasewasetu.com', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: payload.toString(),
        })

        if (!response.ok) {
          throw new Error('Unable to send registration email notifications.')
        }
      } catch (error) {
        window.alert('Unable to send confirmation emails right now. Please try again in a moment.')
        if (submitButton) {
          submitButton.disabled = false
          submitButton.innerHTML = submitLabel
        }
        return
      }

      registrationForm.reset()
      fields.forEach(field => {
        field.classList.remove('is-valid', 'is-invalid')
      })

      registrationForm.classList.add('d-none')
      if (successPanel) {
        successPanel.classList.remove('d-none')
        successPanel.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      if (submitButton) {
        submitButton.disabled = false
        submitButton.innerHTML = submitLabel
      }
    })

    resetButtons.forEach(button => {
      button.addEventListener('click', () => {
        registrationForm.reset()
        registrationForm.classList.remove('was-validated')
        fields.forEach(field => {
          field.classList.remove('is-valid', 'is-invalid')
        })
        if (successPanel) {
          successPanel.classList.add('d-none')
        }
        registrationForm.classList.remove('d-none')
      })
    })
  }

  function setupSharing() {
    const pageUrl = 'https://join.shakhasewasetu.com/register-leader-bee'
    const message = 'Help us build future leaders. Please share this workshop with your family, friends and community.'
    const shareText = `Leader-BEE 10 Weeks Leadership Workshop\n\n${message}\n\n${pageUrl}`

    if (shareButtons.copy) {
      shareButtons.copy.addEventListener('click', async () => {
        await navigator.clipboard.writeText(shareText)
      })
    }

    if (shareButtons.whatsapp) {
      shareButtons.whatsapp.addEventListener('click', () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer')
      })
    }

    if (shareButtons.facebook) {
      shareButtons.facebook.addEventListener('click', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`, '_blank', 'noopener,noreferrer')
      })
    }

    if (shareButtons.email) {
      shareButtons.email.addEventListener('click', () => {
        const subject = 'Leader-BEE 10 Weeks Leadership Workshop'
        const body = `${message}\n\n${pageUrl}`
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      })
    }
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
    setupFormValidation()
    setupSharing()

    window.addEventListener('scroll', handleNavbarState, { passive: true })
    window.addEventListener('resize', handleNavbarState)
  }

  document.addEventListener('DOMContentLoaded', init)
})()
