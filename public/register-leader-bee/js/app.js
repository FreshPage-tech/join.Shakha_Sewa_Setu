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
  const childrenList = document.getElementById('childrenList')
  const addChildButton = document.getElementById('addChildButton')
  const childCountInput = document.getElementById('childCount')
  const registrationTotalInput = document.getElementById('registrationTotal')
  const summaryChildCount = document.getElementById('summaryChildCount')
  const registrationTotalDisplay = document.getElementById('registrationTotalDisplay')
  const successPaymentTotal = document.getElementById('successPaymentTotal')
  const checkoutButtonAmount = document.getElementById('checkoutButtonAmount')
  const stripePaymentButton = document.getElementById('stripePaymentButton')
  const PRICE_PER_CHILD = 10
  const DEFAULT_CHECKOUT_API_URL = 'https://vxznjyhlbirtnrliqunm.supabase.co/functions/v1/create-leader-bee-checkout'
  let childSequence = 0
  let lastCheckoutPayload = null
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

  function setupPaymentReturn() {
    const paymentStatus = new URLSearchParams(window.location.search).get('payment')
    if (!paymentStatus || !registrationPanel || !registrationForm) return

    registrationPanel.classList.remove('d-none')
    if (paymentStatus === 'success' && successPanel) {
      sessionStorage.removeItem('leaderBeeCheckout')
      registrationForm.classList.add('d-none')
      successPanel.classList.remove('d-none')
      const title = successPanel.querySelector('.panel-title')
      const intro = successPanel.querySelector('.success-intro')
      const paymentCard = successPanel.querySelector('.payment-card')
      if (title) title.textContent = 'Payment successful!'
      if (intro) intro.textContent = 'Your children are registered for Leader-BEE. Stripe will email your payment receipt shortly.'
      if (paymentCard) paymentCard.classList.add('d-none')
    } else if (paymentStatus === 'cancelled' && successPanel) {
      try {
        lastCheckoutPayload = JSON.parse(sessionStorage.getItem('leaderBeeCheckout') || 'null')
      } catch {
        lastCheckoutPayload = null
      }
      registrationForm.classList.add('d-none')
      successPanel.classList.remove('d-none')
      const title = successPanel.querySelector('.panel-title')
      const intro = successPanel.querySelector('.success-intro')
      if (title) title.textContent = 'Payment not completed'
      if (intro) intro.textContent = 'Your registration was saved. Use the secure payment button below whenever you are ready.'
      const count = lastCheckoutPayload?.children?.length || 1
      if (successPaymentTotal) successPaymentTotal.textContent = `$${(count * PRICE_PER_CHILD).toFixed(2)}`
      if (!lastCheckoutPayload && stripePaymentButton) stripePaymentButton.disabled = true
    }

    window.setTimeout(() => registrationPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function updateFieldState(field) {
    if (!field || field.disabled) return true

    if (field.id === 'parentPhone') {
      field.setCustomValidity(/^\d{10}$/.test(field.value) ? '' : 'Enter exactly 10 digits.')
    }

    const isValid = field.checkValidity()
    field.classList.toggle('is-valid', isValid)
    field.classList.toggle('is-invalid', !isValid)
    return isValid
  }

  function getCheckoutApiUrl() {
    return window.LEADER_BEE_CONFIG?.checkoutApiUrl || DEFAULT_CHECKOUT_API_URL
  }

  function updateRegistrationTotal() {
    const count = childrenList?.querySelectorAll('.child-entry').length || 1
    const total = count * PRICE_PER_CHILD
    const formattedTotal = `$${total.toFixed(2)}`
    if (childCountInput) childCountInput.value = String(count)
    if (registrationTotalInput) registrationTotalInput.value = formattedTotal
    if (summaryChildCount) summaryChildCount.textContent = `${count} ${count === 1 ? 'child' : 'children'}`
    if (registrationTotalDisplay) registrationTotalDisplay.textContent = formattedTotal
    if (successPaymentTotal) successPaymentTotal.textContent = formattedTotal
    if (checkoutButtonAmount) checkoutButtonAmount.textContent = formattedTotal
  }

  function createChildEntry() {
    if (!childrenList) return
    childSequence += 1
    const entry = document.createElement('div')
    entry.className = 'child-entry'
    entry.dataset.childId = String(childSequence)
    entry.innerHTML = `
      <div class="child-entry-header">
        <strong>Child <span class="child-number"></span></strong>
        <button class="btn-remove-child" type="button" aria-label="Remove this child"><i class="fa-solid fa-trash-can"></i> Remove</button>
      </div>
      <div class="row g-2">
        <div class="col-sm-7">
          <div class="form-floating mb-2">
            <input class="form-control child-name" id="childName${childSequence}" name="childName${childSequence}" placeholder=" " required />
            <label for="childName${childSequence}">Child Name *</label>
            <div class="invalid-feedback">Child name is required.</div>
          </div>
        </div>
        <div class="col-sm-5">
          <div class="form-floating mb-2">
            <select class="form-select child-grade" id="grade${childSequence}" name="grade${childSequence}" required>
              <option value="" selected disabled>Select grade</option>
              <option>Grade 4</option><option>Grade 5</option><option>Grade 6</option><option>Grade 7</option><option>Grade 8</option>
            </select>
            <label for="grade${childSequence}">Grade *</label>
            <div class="invalid-feedback">Choose a grade.</div>
          </div>
        </div>
      </div>`

    entry.querySelector('.btn-remove-child')?.addEventListener('click', () => {
      entry.remove()
      refreshChildEntries()
    })
    entry.querySelectorAll('input, select').forEach(field => {
      field.addEventListener('input', () => updateFieldState(field))
      field.addEventListener('change', () => updateFieldState(field))
      field.addEventListener('blur', () => updateFieldState(field))
    })
    childrenList.appendChild(entry)
    refreshChildEntries()
  }

  function refreshChildEntries() {
    const entries = childrenList?.querySelectorAll('.child-entry') || []
    entries.forEach((entry, index) => {
      const number = entry.querySelector('.child-number')
      const removeButton = entry.querySelector('.btn-remove-child')
      if (number) number.textContent = String(index + 1)
      if (removeButton) removeButton.hidden = entries.length === 1
    })
    updateRegistrationTotal()
  }

  function getChildren() {
    return Array.from(childrenList?.querySelectorAll('.child-entry') || []).map(entry => ({
      name: entry.querySelector('.child-name')?.value.trim() || '',
      grade: entry.querySelector('.child-grade')?.value || '',
    }))
  }

  async function createCheckoutSession(checkoutPayload) {
    const checkoutApiUrl = getCheckoutApiUrl()
    if (!checkoutApiUrl) throw new Error('Stripe Checkout has not been configured yet.')

    const response = await fetch(checkoutApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutPayload),
    })
    const result = await response.json().catch(() => ({}))
    if (!response.ok || !result.url) throw new Error(result.error || 'Unable to start secure checkout.')
    sessionStorage.setItem('leaderBeeCheckout', JSON.stringify(checkoutPayload))
    return result.url
  }

  async function openStripeCheckout() {
    if (!lastCheckoutPayload) return
    const originalLabel = stripePaymentButton?.innerHTML || ''
    if (stripePaymentButton) {
      stripePaymentButton.disabled = true
      stripePaymentButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening secure checkout…'
    }
    try {
      window.location.assign(await createCheckoutSession(lastCheckoutPayload))
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to start secure checkout.')
      if (stripePaymentButton) {
        stripePaymentButton.disabled = false
        stripePaymentButton.innerHTML = originalLabel
      }
    }
  }

  function setupFormValidation() {
    if (!registrationForm) return

    if (childrenList && childrenList.children.length === 0) createChildEntry()
    addChildButton?.addEventListener('click', createChildEntry)
    stripePaymentButton?.addEventListener('click', openStripeCheckout)
    const parentPhone = registrationForm.querySelector('#parentPhone')

    parentPhone?.addEventListener('input', () => {
      parentPhone.value = parentPhone.value.replace(/\D/g, '').slice(0, 10)
    })

    const validateAll = () => {
      let valid = true
      const fields = registrationForm.querySelectorAll('input, select, textarea')
      fields.forEach(field => {
        if (!updateFieldState(field)) valid = false
      })
      return valid
    }

    registrationForm.querySelectorAll('input, select, textarea').forEach(field => {
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
      lastCheckoutPayload = {
        parentEmail,
        parentName,
        parentPhone: formData.get('parentPhone')?.toString() || '',
        children: getChildren(),
      }
      sessionStorage.setItem('leaderBeeCheckout', JSON.stringify(lastCheckoutPayload))
      const payload = new URLSearchParams()

      formData.forEach((value, key) => {
        payload.append(key, value.toString())
      })

      payload.set('email', parentEmail)
      payload.set('_subject', `New Leader-BEE Registration: ${parentName}`)
      payload.set('_cc', 'freshpage.tech@gmail.com')
      payload.set('_template', 'table')
      payload.set('_captcha', 'false')
      payload.set('_autoresponse', `Dear ${parentName}, thank you for registering for the Leader-BEE Workshop. Confirmation has been shared with you and our coordinators. We will contact you soon.`)

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

      if (getCheckoutApiUrl()) {
        if (submitButton) submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening secure checkout…'
        try {
          window.location.assign(await createCheckoutSession(lastCheckoutPayload))
          return
        } catch (error) {
          window.alert(`${error instanceof Error ? error.message : 'Unable to start secure checkout.'} Your registration was saved; please use the payment button to try again.`)
        }
      }

      registrationForm.reset()
      registrationForm.querySelectorAll('input, select, textarea').forEach(field => {
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
        childrenList?.replaceChildren()
        createChildEntry()
        registrationForm.querySelectorAll('input, select, textarea').forEach(field => {
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
    const details = [
      '• Grades: 4–8',
      '• Starts: 13 September 2026',
      '• Time: Every Sunday, 4:00 PM–5:30 PM',
      '• Location: The Dance Spot, Morganville, NJ',
      '• Registration: $10',
      '• Parents: Free',
    ].join('\n')
    const shareText = `*LEADER-BEE – 12 Weeks Workshop*\n\n${details}\n\n${pageUrl}`

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
        const subject = 'Leader-BEE 12 Weeks Leadership Workshop'
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
    setupPaymentReturn()
    setupMobileCollapse()
    setupFormValidation()
    setupSharing()

    window.addEventListener('scroll', handleNavbarState, { passive: true })
    window.addEventListener('resize', handleNavbarState)
  }

  document.addEventListener('DOMContentLoaded', init)
})()
