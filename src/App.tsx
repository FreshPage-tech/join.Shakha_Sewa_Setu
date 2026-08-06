import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import familyImg from './imports/4EC6908E-FA0A-4A98-BEA2-169574B8DF4C.png'
import sssLogo from './imports/SSS_logo.png'
import type { ShakhaChapter } from './shakhaData'
import {
  findPublicShakhaBySlug,
  listPublicShakhaLocations,
  listPublicShakhaRecordsByLocation,
  submitInterestedPerson,
} from './publicShakhaApi'
import { getShareDescription, getShareMessage, getShareTitle } from './shakhaOverrides'
import { buildShakhaDataMap } from './shakhaRuntime'
import type { ShakhaLocationIndex, ShakhaRecord } from './shakhaTypes'

const AdminPanel = lazy(() => import('./AdminPanel'))

// ─── Data ────────────────────────────────────────────────────────────────────

const BENEFITS = [
  { icon: 'run', title: 'Physical Fitness', desc: 'Regular exercises and drills keep your body strong, agile, and energized.' },
  { icon: 'yoga', title: 'Yoga & Well-being', desc: 'Pranayama, asanas, and meditation nurture mental clarity and inner peace.' },
  { icon: 'book', title: 'Cultural Education', desc: 'Learn about Hindu heritage, history, and values through engaging discussions.' },
  { icon: 'leadership', title: 'Leadership Development', desc: 'Take on responsibilities, build confidence, and develop life skills.' },
  { icon: 'service', title: 'Seva — Community Service', desc: 'Serve society through organized seva programs and charitable initiatives.' },
  { icon: 'family', title: 'Family Bonding', desc: 'Strengthen family ties as multiple generations participate together.' },
  { icon: 'discipline', title: 'Discipline & Character', desc: 'Develop discipline, friendships and a strong support network.' },
]

const TIMELINE = [
  { icon: 'flag', title: 'Opening Prayer', desc: 'Begin with the Prarthana, invoking blessings for the nation and society.' },
  { icon: 'run', title: 'Games & Physical Activities', desc: 'Energizing group games build teamwork, agility, and camaraderie.' },
  { icon: 'yoga', title: 'Yoga & Exercises', desc: 'Structured yoga sequences and physical drills for health and discipline.' },
  { icon: 'group', title: 'Group Activities', desc: 'Patriotic songs, cultural programs, and skill-building exercises.' },
  { icon: 'baudhik', title: 'Baudhik — Discussion', desc: 'Thought-provoking talks on Hindu values, history, and current affairs.' },
  { icon: 'prayer', title: 'Closing Prayer', desc: 'Conclude with the Ekatmata Stotra, reaffirming our collective purpose.' },
]

const WHO_CAN_JOIN = [
  { group: 'Kids', age: '5–12 years', icon: '🧒' },
  { group: 'Teens', age: '13–17 years', icon: '👦' },
  { group: 'College Students', age: '18–22 years', icon: '🎓' },
  { group: 'Professionals', age: '23–45 years', icon: '💼' },
  { group: 'Parents', age: 'All ages', icon: '👨‍👩‍👧‍👦' },
  { group: 'Seniors', age: '60+ years', icon: '👴' },
]

const FAQS = [
  { q: 'What is HSS (Hindu Swayamsevak Sangh)?', a: 'HSS is the overseas wing of the Rashtriya Swayamsevak Sangh (RSS), a Hindu cultural and service organization. It promotes Hindu values, physical fitness, leadership, and community service among the Hindu diaspora worldwide.' },
  { q: 'Is there any membership fee?', a: 'No. Shakha is completely free and open to all. There are no fees or formal memberships required to participate. Our Shakhas run on volunteer effort and community support.' },
  { q: 'Can women join Shakha?', a: "Yes! HSS organizes Shakhas for women through the Sadhvi Shakti program and family Shakhas where everyone is welcome. Contact your local coordinator to find women's or family Shakha in your area." },
  { q: 'Can children attend Shakha?', a: 'Absolutely. Children are the heart of Shakha. Bala Gokulam programs are specifically designed for children aged 5–12, with age-appropriate games, stories, and cultural learning.' },
  { q: 'How long is a typical Shakha?', a: 'A typical Shakha session lasts 60–90 minutes, covering prayers, physical activities, yoga, group exercises, and a brief discussion (Baudhik). Times vary by location.' },
  { q: 'Do I need prior experience to join?', a: 'No experience is needed at all. Shakha is open to everyone regardless of their physical fitness level, cultural knowledge, or background. You will learn everything together as a community.' },
  { q: 'Can I visit once before committing to join?', a: 'Of course! You are always welcome to visit any Shakha as a guest. Observe, participate at your comfort level, and decide at your own pace. Our volunteers will be happy to guide you.' },
  { q: 'What language is Shakha conducted in?', a: 'Most Shakhas in the US are conducted primarily in English with some Sanskrit shlokas and prayers. The goal is inclusivity — no prior knowledge of Sanskrit or Hindi is required.' },
]

const DEFAULT_COUNTRY_SLUG = (import.meta.env.VITE_COUNTRY_SLUG ?? 'usa').toLowerCase()
const SITE_SHARE_IMAGE = '/social/site-banner.png'
const SHAKHA_PAGE_BANNER_IMAGE = '/assets/usa-07733-sri-krishna-shakha.png'
const SHAKHA_PROFILE_IMAGE = '/assets/usa_07733.png'
const SHAKHA_SHARE_IMAGE = SHAKHA_PAGE_BANNER_IMAGE

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizePathname(path: string): string {
  if (!path || path === '/') {
    return '/'
  }
  return path.endsWith('/') ? path.replace(/\/+$/, '') || '/' : path
}

function extractZip(record: ShakhaRecord): string {
  const fromZipField = (record.zipCode || '').trim().match(/\d{5}/)?.[0]
  if (fromZipField) {
    return fromZipField
  }

  const fromAddress = (record.address || '').match(/\d{5}/)?.[0]
  if (fromAddress) {
    return fromAddress
  }

  return '00000'
}

function getShakhaRoute(record: ShakhaRecord): string {
  const country = slugify(DEFAULT_COUNTRY_SLUG)
  const zip = extractZip(record)
  const name = slugify(record.name)
  return `/${country}-${zip}-${name}`
}

function setMetaTagByName(name: string, content: string) {
  let tag = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setMetaTagByProperty(property: string, content: string) {
  let tag = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function getWhatsAppPhone(value: string): string | null {
  const cleaned = value.replace(/[^\d+]/g, '')
  if (!cleaned) {
    return null
  }

  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1).replace(/\D/g, '')
    return digits.length >= 8 ? digits : null
  }

  const digitsOnly = cleaned.replace(/\D/g, '')
  return digitsOnly.length >= 8 ? digitsOnly : null
}

function buildWhatsAppLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

function ShakhaSharePage({
  record,
  onBack,
}: {
  record: ShakhaRecord
  onBack: () => void
}) {
  const shareUrl = `${window.location.origin}${getShakhaRoute(record)}`
  const shareMessage = getShareMessage(record)
  const announcementLines = shareMessage
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
  const contactEntries = record.contacts.filter(contact => contact.name || contact.mobile || contact.email)
  const stateName = record.state?.trim() || 'State'
  const cityName = record.city?.trim() || 'City'
  const whatsappMessage = `Namaste, I'm interested to join ${record.name} Shakha.`
  const whatsappTargets = record.contacts
    .map(contact => {
      const phone = getWhatsAppPhone(contact.mobile || '')
      return {
        name: contact.name?.trim() || 'Shakha Volunteer',
        phone,
      }
    })
    .filter(target => Boolean(target.phone))
    .slice(0, 2)

  const copyShareText = async () => {
    const details = [record.mapLink ? `Map: ${record.mapLink}` : '', `Shakha page: ${shareUrl}`]
      .filter(Boolean)
      .join('\n')
    await navigator.clipboard.writeText(`${shareMessage}\n\n${details}`)
  }

  return (
    <div className="min-h-screen" style={{ background: '#ffffff' }}>
      <section className="pt-24 pb-10 lg:pt-28">
        <div className="mx-auto w-full max-w-[92rem] px-2 sm:px-3 lg:px-4">
          <button
            onClick={onBack}
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: '#1B3A6B' }}
          >
            <span>←</span>
            <span>Back to Register</span>
          </button>

          <div className="overflow-hidden rounded-2xl border" style={{ background: '#ffffff', borderColor: '#e7e9ee' }}>
            <div className="overflow-hidden border-b" style={{ borderColor: '#eef1f6', background: '#ffffff' }}>
              <div className="relative bg-white flex items-center justify-center px-2 py-2 lg:py-3">
                <img src={SHAKHA_PAGE_BANNER_IMAGE} alt="Shakha banner" className="block w-full h-auto lg:w-auto lg:max-h-[540px]" />
              </div>

              <div className="relative px-4 pb-4 sm:px-6">
                <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] sm:h-36 sm:w-36">
                      <img src={SHAKHA_PROFILE_IMAGE} alt="Shakha profile" className="h-full w-full object-cover" />
                    </div>

                    <div className="sm:pb-2">
                      <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: '#132f5d' }}>
                        {record.name}
                      </h1>
                      <p className="mt-1 text-sm sm:text-base" style={{ color: '#5a6f9a' }}>
                        {stateName} &gt;&gt; {cityName} &gt;&gt; {record.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 lg:pb-2">
                    {[0, 1].map(index => {
                      const target = whatsappTargets[index]
                      const isActive = Boolean(target?.phone)
                      const label = target ? `WhatsApp ${index + 1}: ${target.name}` : `WhatsApp ${index + 1}`
                      const href = target?.phone ? buildWhatsAppLink(target.phone, whatsappMessage) : '#'

                      return (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
                          style={{
                            background: isActive ? 'linear-gradient(135deg, #25d366, #128c7e)' : '#9ca3af',
                            pointerEvents: isActive ? 'auto' : 'none',
                            opacity: isActive ? 1 : 0.65,
                          }}
                        >
                          {isActive ? label : `${label} (Not Available)`}
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 lg:p-6">
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_1fr]">
                <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: '#eceff4', background: '#ffffff' }}>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: '#f1f4f8' }}>
                    <h2 className="font-display text-xl sm:text-2xl font-bold" style={{ color: '#132f5d' }}>
                      Shakha Announcement
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => void copyShareText()}
                        className="rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)' }}
                      >
                        Copy Share Message
                      </button>
                      <a
                        href={record.mapLink || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border px-4 py-2 text-xs sm:text-sm font-semibold"
                        style={{ borderColor: '#1B3A6B', color: '#1B3A6B', pointerEvents: record.mapLink ? 'auto' : 'none', opacity: record.mapLink ? 1 : 0.5 }}
                      >
                        Open Map Link
                      </a>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {announcementLines.map((line, index) => (
                      <p
                        key={`${line}-${index}`}
                        className="text-sm sm:text-[15px] leading-6"
                        style={{ color: '#1e3761' }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border p-4" style={{ borderColor: '#eceff4', background: '#ffffff' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#6a7da3' }}>Address</h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: '#1e3761' }}>{record.address || 'Not available'}</p>
                  </div>

                  <div className="rounded-2xl border p-4" style={{ borderColor: '#eceff4', background: '#ffffff' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#6a7da3' }}>Schedule</h3>
                    <p className="mt-2 text-sm" style={{ color: '#1e3761' }}>{record.day || 'Weekly'}</p>
                    <p className="text-sm" style={{ color: '#1e3761' }}>{record.time || 'Please contact volunteer'}</p>
                  </div>

                  <div className="rounded-2xl border p-4" style={{ borderColor: '#eceff4', background: '#ffffff' }}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#6a7da3' }}>Classification</h3>
                    <p className="mt-2 text-sm" style={{ color: '#1e3761' }}>Vibhag: {record.vibhag || 'Not set'}</p>
                    <p className="text-sm" style={{ color: '#1e3761' }}>Bhag: {record.bhag || 'Not set'}</p>
                    <p className="text-sm" style={{ color: '#1e3761' }}>Zip: {extractZip(record)}</p>
                  </div>

                  <div className="rounded-2xl border p-4" style={{ borderColor: '#eceff4', background: '#ffffff' }}>
                    <h3 className="font-display text-lg font-semibold" style={{ color: '#132f5d' }}>Contact Details</h3>
                    <div className="mt-3 space-y-2.5">
                      {contactEntries.map((contact, index) => {
                        const phone = getWhatsAppPhone(contact.mobile || '')
                        return (
                          <div key={`${contact.name || 'contact'}-${index}`} className="rounded-xl border p-3" style={{ borderColor: '#f0f3f8' }}>
                            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6a7da3' }}>Contact {index + 1}</p>
                            <p className="mt-1 text-sm font-semibold" style={{ color: '#1e3761' }}>{contact.name || 'Not provided'}</p>
                            <p className="text-sm" style={{ color: '#1e3761' }}>{contact.mobile || 'Not provided'}</p>
                            <p className="text-xs break-all" style={{ color: '#6a7da3' }}>{contact.email || 'Not provided'}</p>
                            {phone ? (
                              <a
                                href={buildWhatsAppLink(phone, whatsappMessage)}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-flex rounded-md px-3 py-1.5 text-xs font-semibold text-white"
                                style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}
                              >
                                Message on WhatsApp
                              </a>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Components ──────────────────────────────────────────────────────────────


function Navbar({ onNav, disclaimerVisible }: { onNav: (id: string) => void; disclaimerVisible: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false,
  )

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    setIsDesktop(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const links = [
    { label: 'Home', id: 'home' },
    { label: 'About Shakha', id: 'about' },
    { label: 'Why Join', id: 'benefits' },
    { label: 'Activities', id: 'timeline' },
    { label: 'Find Shakha', id: 'find' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <nav
      className="fixed left-0 right-0 z-50 transition-all duration-300"
      style={{
        top: disclaimerVisible ? '40px' : '0',
        background: isDesktop
          ? scrolled
            ? 'linear-gradient(90deg, rgba(255,246,237,0.99) 0%, rgba(255,246,237,0.84) 36%, rgba(255,246,237,0.42) 58%, rgba(255,246,237,0.14) 76%, rgba(255,246,237,0) 100%)'
            : 'linear-gradient(90deg, rgba(255,246,237,0.95) 0%, rgba(255,246,237,0.72) 34%, rgba(255,246,237,0.28) 56%, rgba(255,246,237,0.08) 74%, rgba(255,246,237,0) 100%)'
          : scrolled
            ? 'rgba(255, 246, 237, 0.96)'
            : 'rgba(255, 246, 237, 0.86)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 10px 35px rgba(11,26,50,0.1)' : 'none',
      }}
    >
      <div className="max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={sssLogo}
              alt="Shakha Sewa Setu logo"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              style={{ boxShadow: '0 0 0 2px rgba(27,58,107,0.15)' }}
            />
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm sm:text-base font-bold tracking-wide" style={{ color: '#1B3A6B' }}>
                Shakha Sewa Setu
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase hidden sm:block" style={{ color: '#6f7f9e' }}>
                HSS Shakha Outreach
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => onNav(l.id)}
                className="text-sm font-medium transition-colors"
                style={{ color: '#304a78' }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => onNav('register')}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)' }}
            >
              Register Interest
            </button>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2" style={{ color: '#1B3A6B' }} onClick={() => setOpen(!open)}>
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="lg:hidden border-t border-white/10 py-4 px-4"
          style={{ background: 'rgba(255, 246, 237, 0.98)' }}
        >
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => { onNav(l.id); setOpen(false) }}
              className="block w-full text-left py-3 text-sm font-medium border-b"
              style={{ color: '#304a78', borderColor: 'rgba(27,58,107,0.1)' }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { onNav('register'); setOpen(false) }}
            className="mt-4 w-full px-5 py-3 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)' }}
          >
            Register Your Interest
          </button>
        </div>
      )}
    </nav>
  )
}

function Hero({ onNav }: { onNav: (id: string) => void }) {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <img
        src={familyImg}
        alt="Families playing games at Shakha with the Bhagwa Dhwaj"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(95deg, rgba(255,248,240,0.95) 0%, rgba(255,248,240,0.78) 44%, rgba(11,26,50,0.22) 100%)',
        }}
      />
      {/* Saffron accent bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #D4531A, #e87c3e, #D4531A)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4 pt-24 pb-24 lg:pb-32 w-full">
        <div>
          <h1
            className="font-display text-[2.2rem] sm:text-[2.7rem] lg:text-[3.35rem] xl:text-[3.8rem] font-bold leading-[1.08] mb-4"
            style={{ color: '#112646' }}
          >
            <span className="block">Transform Yourself.</span>
            <span className="block" style={{ color: '#D4531A' }}>Build Yourself, Build Society</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed mb-10" style={{ color: '#344c74' }}>
            Shakha is a weekly gathering that promotes physical fitness, leadership, cultural values, discipline, and community service — for people of all ages.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onNav('find')}
              className="px-8 py-4 rounded-lg font-semibold text-base transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #D4531A, #c2410c)',
                color: '#fff',
                boxShadow: '0 10px 30px rgba(212,83,26,0.28)',
              }}
            >
              Find Nearest Shakha
            </button>
            <button
              onClick={() => onNav('register')}
              className="px-8 py-4 rounded-lg font-semibold text-base transition-all hover:scale-105"
              style={{
                background: 'rgba(17,38,70,0.95)',
                border: '1.5px solid rgba(17,38,70,0.95)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
              }}
            >
              Register Your Interest
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { n: '200+', label: 'Shakhas Nationwide' },
              { n: '50K+', label: 'Swayamsevaks' },
              { n: '40+', label: 'Years of Service' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold" style={{ color: '#D4531A' }}>
                  {s.n}
                </div>
                <div className="text-xs sm:text-sm mt-1" style={{ color: '#4f648f' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <svg className="w-6 h-6" style={{ color: '#4f648f' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

function About() {
  const highlights = [
    'Physical fitness, yoga and games',
    'Leadership development',
    'Hindu values and cultural education',
    'Patriotism and national pride',
    'Community service and social responsibility',
    'Friendship, discipline and character building',
  ]

  const cards = [
    { icon: 'all-ages', title: 'For All Ages', desc: 'Children, youth, adults and seniors - everyone is welcome.' },
    { icon: 'families', title: 'For Families', desc: 'A great way for families to grow together and build strong bonds.' },
    { icon: 'values', title: 'Hindu Values', desc: 'Rooted in our heritage, focused on building a better society.' },
    { icon: 'service', title: 'Service to Society', desc: 'Working together for a stronger, harmonious and selfless society.' },
  ]

  const renderGlyph = (icon: string) => {
    const common = 'w-8 h-8'
    const stroke = '#1B3A6B'
    switch (icon) {
      case 'all-ages':
        return (
          <svg viewBox="0 0 48 48" className={common} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 28c0-4 2.7-7 6.2-7s6.3 3 6.3 7v6h-12.5z" fill="#1B3A6B" opacity="0.15" />
            <path d="M28 26c0-4.2 2.8-7.3 6.5-7.3 3.8 0 6.5 3 6.5 7.3V34H28z" fill="#1B3A6B" opacity="0.15" />
            <circle cx="20.2" cy="16" r="4" fill="#1B3A6B" opacity="0.12" />
            <circle cx="34.5" cy="13.8" r="3.7" fill="#1B3A6B" opacity="0.12" />
            <circle cx="11" cy="17.5" r="2.8" fill="#1B3A6B" opacity="0.12" />
            <path d="M6.5 34.5h35" />
            <path d="M11 20.5v3.2" />
            <path d="M34.5 17.5v3" />
          </svg>
        )
      case 'families':
        return (
          <svg viewBox="0 0 48 48" className={common} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 21.5 24 8l18 13.5" />
            <path d="M10.5 20.2V40h27V20.2" />
            <path d="M19 40V28h10v12" fill="#1B3A6B" opacity="0.12" />
            <path d="M17 24h.01M24 24h.01M31 24h.01" />
          </svg>
        )
      case 'values':
        return (
          <svg viewBox="0 0 48 48" className={common} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M24 39s-12.5-6.9-12.5-17.3A7 7 0 0 1 24 17.2a7 7 0 0 1 12.5 4.5C36.5 32 24 39 24 39Z" fill="#1B3A6B" opacity="0.12" />
            <path d="M24 17.2V10" />
            <path d="M20.3 13.4h7.4" />
          </svg>
        )
      default:
        return (
          <svg viewBox="0 0 48 48" className={common} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="12" y="16" width="24" height="20" rx="4" fill="#1B3A6B" opacity="0.1" />
            <path d="M24 12v6" />
            <path d="M18 22h12" />
            <path d="M18 27h9" />
            <path d="M18 32h7" />
          </svg>
        )
    }
  }
  return (
    <section
      id="about"
      className="relative z-20 -mt-20 lg:-mt-28 pt-16 lg:pt-20 pb-16 lg:pb-[4.5rem]"
      style={{
        background: 'linear-gradient(to bottom, rgba(253,246,237,0) 0%, rgba(253,246,237,0.01) 24%, rgba(253,246,237,0.2) 46%, rgba(253,246,237,0.62) 70%, #FDF6ED 88%, #FDF6ED 100%)',
      }}
    >
      <div className="max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4">
        <div className="rounded-2xl border p-4 sm:p-5 lg:p-6" style={{ background: 'rgba(255, 251, 245, 0.95)', borderColor: '#eadfce', boxShadow: '0 4px 14px rgba(11,26,50,0.04)' }}>
          <div className="grid lg:grid-cols-[1.38fr_2.1fr] gap-4 lg:gap-4 items-stretch">
            <div className="pr-0 lg:pr-2">
              <h2 className="font-display text-[2.2rem] sm:text-[2.4rem] lg:text-[2.65rem] font-bold leading-tight mb-2" style={{ color: '#132f5d' }}>What is Shakha?</h2>
              <p className="text-[14px] lg:text-[15px] leading-6 mb-3" style={{ color: '#2f4671' }}>
                A Shakha is a weekly gathering organized by Hindu Swayamsevak Sangh (HSS), where individuals and families come together for:
              </p>
              <div className="space-y-1">
                {highlights.map(item => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="inline-flex mt-1">
                      <svg viewBox="0 0 20 20" className="w-[14px] h-[14px]" fill="none" aria-hidden="true">
                        <circle cx="10" cy="10" r="9" fill="#D4531A" />
                        <path d="M6 10.2l2.2 2.2L14 6.9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[14px] lg:text-[14.5px] leading-6" style={{ color: '#1e3761' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {cards.map(card => (
                <div key={card.title} className="rounded-2xl border px-3 py-4 lg:py-5 text-center flex flex-col items-center min-h-[220px] lg:min-h-[238px]" style={{ background: '#fffdf8', borderColor: '#ece2d3' }}>
                  <div className="mb-3" style={{ color: '#132f5d' }}>{renderGlyph(card.icon)}</div>
                  <h3 className="font-semibold text-[1.05rem] lg:text-[1.12rem] mb-2 leading-6 min-h-[3rem] flex items-center justify-center" style={{ color: '#D4531A' }}>{card.title}</h3>
                  <p className="text-[13px] leading-[1.62] max-w-[10.5rem] mx-auto" style={{ color: '#24406d' }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const renderBenefitGlyph = (icon: string) => {
    if (icon === 'run') {
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="17.2" cy="5.1" r="2.1" />
          <path d="M10.9 9l2.2-2.1 2.3 2.2 2.2.1" />
          <path d="M13.1 10.8l-2.1 2.6-3.8 1.5" />
          <path d="M12.9 11l2.2 2.9 3.7 1.1" />
          <path d="M10.8 14l-2.1 4" />
          <path d="M15.3 14l2.8 3.2" />
        </svg>
      )
    }

    if (icon === 'yoga') {
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="5" r="2.2" />
          <path d="M8.1 13.6h7.8" />
          <path d="M12 7.8l2.9 4.7" />
          <path d="M12 7.8l-2.9 4.7" />
          <path d="M6.2 19.2c1.2-2 3.1-3.1 5.8-3.1s4.6 1.1 5.8 3.1" />
        </svg>
      )
    }

    if (icon === 'book') {
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 6.1a2.1 2.1 0 0 1 2.1-2.1h4.8a3 3 0 0 1 2.6 1.5A3 3 0 0 1 16.6 4h4.8v14.4h-4.8a3 3 0 0 0-2.6 1.5 3 3 0 0 0-2.6-1.5H6.6a2.1 2.1 0 0 1-2.1-2.1z" />
          <path d="M14 5.5v14" />
        </svg>
      )
    }

    if (icon === 'leadership' || icon === 'group' || icon === 'family') {
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="7" cy="7.4" r="2.1" />
          <circle cx="12" cy="6" r="2.4" />
          <circle cx="17" cy="7.4" r="2.1" />
          <path d="M4.7 16c0-2 1.6-3.6 3.6-3.6S11.9 14 11.9 16" />
          <path d="M8.4 17.6h7.2" />
          <path d="M12 16c0-2.2 1.8-4 4-4s4 1.8 4 4" />
        </svg>
      )
    }

    if (icon === 'service') {
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 8c1.2-1.8 3.7-2.2 5.4-.8 1.7 1.3 1.8 3.9.2 5.4L12 17.8l-5.6-5.2c-1.6-1.5-1.5-4.1.2-5.4C8.3 5.8 10.8 6.2 12 8z" />
          <path d="M4.8 17c1.3-2 3.3-3 5.9-3h2.6c2.6 0 4.6 1 5.9 3" />
        </svg>
      )
    }

    if (icon === 'discipline') {
      return (
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 4.2l6.7 2.3v4.8c0 3.5-2.4 6.8-6.7 7.9-4.3-1.1-6.7-4.4-6.7-7.9V6.5L12 4.2z" />
          <path d="M8.6 12.1l2.1 2.1 4.7-4.7" />
        </svg>
      )
    }

    if (icon === 'shield') {
      return (
        <svg viewBox="0 0 24 24" className="w-16 h-16" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5l8.2 2.9v6.2c0 4.6-3.2 8.8-8.2 10-5-1.2-8.2-5.4-8.2-10V5.4L12 2.5z" />
          <path d="M12 7.1l1.2 2.4 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4L12 7.1z" fill="#fff" />
        </svg>
      )
    }

    if (icon === 'values') {
      return (
        <svg viewBox="0 0 24 24" className="w-16 h-16" fill="currentColor" aria-hidden="true">
          <path d="M12 2.5c2.5 2.9 3.8 5.2 3.8 7 0 2.1-1.7 3.7-3.8 3.7s-3.8-1.6-3.8-3.7c0-1.8 1.3-4.1 3.8-7z" />
          <path d="M5.2 6.5c2.8 1.2 4.7 2.7 5.5 4.3.8 1.9-.2 4.1-2.1 4.9-1.9.8-4.1-.2-4.9-2.1-.8-1.7-.2-4 1.5-7.1z" />
          <path d="M18.8 6.5c1.7 3.1 2.3 5.4 1.5 7.1-.8 1.9-3 2.9-4.9 2.1-1.9-.8-2.9-3-2.1-4.9.8-1.6 2.7-3.1 5.5-4.3z" />
          <path d="M12 12.5c3.4 0 6.1 1 7.6 2.7 1.5 1.8 1.2 4.4-.6 5.9s-4.4 1.2-5.9-.6c-.5-.6-.8-1.3-1.1-2-.3.7-.6 1.4-1.1 2-1.5 1.8-4.1 2.1-5.9.6s-2.1-4.1-.6-5.9c1.5-1.7 4.2-2.7 7.6-2.7z" />
        </svg>
      )
    }

    return (
      <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 8c1.2-1.8 3.7-2.2 5.4-.8 1.7 1.3 1.8 3.9.2 5.4L12 17.8l-5.6-5.2c-1.6-1.5-1.5-4.1.2-5.4C8.3 5.8 10.8 6.2 12 8z" />
      </svg>
    )
  }

  return (
    <section id="benefits" className="py-16 lg:py-20" style={{ background: '#FDF6ED' }}>
      <div className="max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4">
        <div className="text-center mb-10 lg:mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-20" style={{ background: 'rgba(212,83,26,0.5)' }} />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight" style={{ color: '#132f5d' }}>
              Why Join Shakha?
            </h2>
            <div className="h-px w-20" style={{ background: 'rgba(212,83,26,0.5)' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 border-y" style={{ borderColor: '#e7dccb' }}>
          {BENEFITS.map((b, i) => (
            <div
              key={i}
              className="group px-3 py-5 lg:py-6 text-center"
              style={{ borderRight: i !== BENEFITS.length - 1 ? '1px solid #e7dccb' : 'none' }}
            >
              <div className="mb-2.5 flex justify-center" style={{ color: '#D4531A' }}>{renderBenefitGlyph(b.icon)}</div>
              <h3
                className="font-display text-[1.35rem] font-semibold mb-1.5 leading-7 min-h-[3.4rem]"
                style={{ color: '#132f5d' }}
              >
                {b.title}
              </h3>
              <p className="text-[0.98rem] leading-7 max-w-[11rem] mx-auto" style={{ color: '#1f3760' }}>
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Timeline() {
  const renderTimelineGlyph = (icon: string) => {
    if (icon === 'flag') {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <rect x="5" y="2.5" width="2.4" height="19" rx="1" />
          <path d="M7.4 4.2h10.1c.9 0 1.2 1.1.5 1.6l-2 1.5 2 1.5c.7.5.4 1.6-.5 1.6H7.4V4.2z" />
        </svg>
      )
    }

    if (icon === 'run') {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <circle cx="17.4" cy="4.8" r="2.4" />
          <path d="M10.7 8.8l2.3-2.1c.8-.7 2.1-.7 2.8.1l1.6 1.7c.4.4.3 1-.1 1.4-.4.4-1 .3-1.4-.1l-1-1-1.6 1.4 1.4 2.7 3.5-.3c.6-.1 1 .4 1.1.9.1.6-.4 1-.9 1.1l-4.6.4-2-3.7-1.9 2-4.1 1.2c-.5.2-1.1-.1-1.2-.7-.2-.5.1-1.1.7-1.2l3.4-1 2-2.1z" />
        </svg>
      )
    }

    if (icon === 'yoga') {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4.7" r="2.5" />
          <path d="M12 8.2c2.7 0 4.9 2.2 4.9 4.9v1.5c0 .6-.4 1-1 1h-7.8c-.6 0-1-.4-1-1v-1.5c0-2.7 2.2-4.9 4.9-4.9z" />
          <path d="M5.3 19.9c0-.6.4-1 1-1h11.4c.6 0 1 .4 1 1s-.4 1-1 1H6.3c-.6 0-1-.4-1-1z" />
        </svg>
      )
    }

    if (icon === 'group') {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <circle cx="7" cy="7.2" r="2.4" />
          <circle cx="12" cy="5.8" r="2.7" />
          <circle cx="17" cy="7.2" r="2.4" />
          <rect x="4.6" y="11" width="4.8" height="7.8" rx="2" />
          <rect x="9.2" y="9.7" width="5.6" height="9.2" rx="2.2" />
          <rect x="14.6" y="11" width="4.8" height="7.8" rx="2" />
        </svg>
      )
    }

    if (icon === 'baudhik') {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <circle cx="8.2" cy="8.3" r="3.4" />
          <rect x="4.4" y="12" width="7.6" height="6.8" rx="2.4" />
          <path d="M14.2 7.2h4.2c1 0 1.8.8 1.8 1.8v2.1c0 1-.8 1.8-1.8 1.8h-1.2l-1.6 1.8c-.3.3-.8.1-.8-.3v-1.5h-.6c-1 0-1.8-.8-1.8-1.8V9c0-1 .8-1.8 1.8-1.8z" />
        </svg>
      )
    }

    if (icon === 'prayer') {
      return (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
          <path d="M9.6 4.2c-1.2 1.8-2.1 4.4-2.1 7.1 0 3.6 1.6 6.6 4.5 8.5V4.2H9.6z" />
          <path d="M14.4 4.2c1.2 1.8 2.1 4.4 2.1 7.1 0 3.6-1.6 6.6-4.5 8.5V4.2h2.4z" />
        </svg>
      )
    }

    return (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden="true">
        <path d="M12 2.7l2.1 6.1h6.5l-5 4 1.9 6.5L12 15.2l-5.5 4.1 1.9-6.5-5-4h6.5L12 2.7z" />
      </svg>
    )
  }

  return (
    <section id="timeline" className="py-16 lg:py-20" style={{ background: '#FDF6ED' }}>
      <div className="max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4">
        <div className="text-center mb-10 lg:mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-20" style={{ background: 'rgba(212,83,26,0.5)' }} />
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold" style={{ color: '#132f5d' }}>
              What Happens in a Shakha?
            </h2>
            <div className="h-px w-20" style={{ background: 'rgba(212,83,26,0.5)' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-y" style={{ borderColor: '#e7dccb' }}>
          {TIMELINE.map((t, i) => (
            <div
              key={t.title}
              className="group px-3 py-5 lg:py-6 text-center"
              style={{ borderRight: i !== TIMELINE.length - 1 ? '1px solid #e7dccb' : 'none' }}
            >
              <div
                className="w-[4.1rem] h-[4.1rem] mb-2.5 mx-auto rounded-full border flex items-center justify-center"
                style={{ borderColor: '#e6d8c6', color: t.icon === 'flag' ? '#D4531A' : '#0a2f73', background: '#fff' }}
              >
                {renderTimelineGlyph(t.icon)}
              </div>
              <h4 className="font-display text-[1.15rem] font-semibold mb-1.5 leading-6 min-h-[3.2rem]" style={{ color: '#132f5d' }}>
                {t.title}
              </h4>
              <p className="text-[0.95rem] leading-6 max-w-[11rem] mx-auto" style={{ color: '#1f3760' }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhoCanJoin() {
  return (
    <section id="who" className="py-20 lg:py-24" style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #0b1a32 100%)' }}>
      <div className="max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8" style={{ background: '#D4531A' }} />
          <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#fb923c' }}>
            Who Can Join?
          </span>
          <div className="h-px w-8" style={{ background: '#D4531A' }} />
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          Everyone is Welcome
        </h2>
        <p className="text-white/60 text-base max-w-lg mx-auto mb-12">
          Shakha is for all ages and backgrounds. No prior experience, no requirements — just an open heart and willingness to grow.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {WHO_CAN_JOIN.map((w, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl text-center transition-all hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="text-3xl mb-3">{w.icon}</div>
              <div className="font-semibold text-white text-sm mb-1">{w.group}</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{w.age}</div>
            </div>
          ))}
        </div>

        <div
          className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium"
          style={{ background: 'rgba(212,83,26,0.18)', border: '1px solid rgba(212,83,26,0.35)', color: '#fb923c' }}
        >
          <span>✓</span>
          <span>No prior experience needed · Open to all · Free to join · No membership required</span>
        </div>
      </div>
    </section>
  )
}

function FindShakha({
  standalone = true,
  locationIndex,
  onOpenShakhaPage,
  onSearchLocation,
}: {
  standalone?: boolean
  locationIndex: ShakhaLocationIndex
  onOpenShakhaPage: (chapter: ShakhaChapter) => void
  onSearchLocation: (state: string, city: string) => Promise<ShakhaChapter[]>
}) {
  const [mode, setMode] = useState<'dropdown' | 'zip'>('dropdown')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [zip, setZip] = useState('')
  const [radius, setRadius] = useState('10')
  const [results, setResults] = useState<ShakhaChapter[]>([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)

  const usStates = useMemo(() => Object.keys(locationIndex), [locationIndex])
  const cities = state ? (locationIndex[state] ?? []) : []

  const handleSearch = async () => {
    if (mode === 'dropdown' && state && city) {
      setSearching(true)
      try {
        setResults(await onSearchLocation(state, city))
        setSearched(true)
      } finally {
        setSearching(false)
      }
    } else if (mode === 'zip') {
      // Mock: show results for any valid-looking ZIP
      if (zip.length >= 5) {
        setResults([
          {
            name: 'Vivekananda Shakha',
            day: 'Every Saturday',
            time: '8:00 AM',
            city: 'Nearby Area',
            state: state || 'USA',
            address: 'Nearby Area',
            timing: 'Every Saturday from 8:00 AM',
            detailUrl: '',
          },
          {
            name: 'Bharata Shakha',
            day: 'Every Sunday',
            time: '7:30 AM',
            city: 'Nearby Area',
            state: state || 'USA',
            address: 'Nearby Area',
            timing: 'Every Sunday from 7:30 AM',
            detailUrl: '',
          },
        ])
        setSearched(true)
      }
    }
  }

  const content = (
    <div className={standalone ? 'max-w-[82rem] mx-auto px-2 sm:px-3 lg:px-4' : ''}>
      <div className={standalone ? 'text-center mb-12' : 'mb-8'}>
        <div className={`flex items-center ${standalone ? 'justify-center' : ''} gap-2 mb-4`}>
          <div className="h-px w-8" style={{ background: '#D4531A' }} />
          <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#D4531A' }}>
            {standalone ? 'Find a Shakha' : 'Search Shakha'}
          </span>
          <div className="h-px w-8" style={{ background: '#D4531A' }} />
        </div>
        <h2 className={`font-display font-bold ${standalone ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`} style={{ color: '#0b1a32' }}>
          {standalone ? 'Discover a Shakha Near You' : 'Find a Shakha Near You'}
        </h2>
        <p className="mt-3 text-base" style={{ color: '#5a6f9a' }}>
          Search by location or ZIP code to find the nearest HSS Shakha in your area.
        </p>
      </div>

        {/* Toggle mode */}
        <div className="flex rounded-full overflow-hidden mb-8 mx-auto w-fit border" style={{ borderColor: '#ddd6c8' }}>
          {[{ key: 'dropdown', label: 'Search by Location' }, { key: 'zip', label: 'Search by ZIP Code' }].map(m => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key as 'dropdown' | 'zip'); setSearched(false); setResults([]) }}
              className="px-5 py-2.5 text-sm font-medium transition-all"
              style={{
                background: mode === m.key ? '#1B3A6B' : 'transparent',
                color: mode === m.key ? '#fff' : '#5a6f9a',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Search card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 lg:p-8" style={{ borderColor: '#ede5d8' }}>
          {mode === 'dropdown' ? (
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1B3A6B' }}>State</label>
                <select
                  value={state}
                  onChange={e => { setState(e.target.value); setCity(''); setResults([]); setSearched(false) }}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2"
                  style={{ borderColor: '#ddd6c8', color: '#0b1a32', focusRingColor: '#D4531A' } as React.CSSProperties}
                >
                  <option value="">Select State</option>
                  {usStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1B3A6B' }}>City</label>
                <select
                  value={city}
                  onChange={e => { setCity(e.target.value); setResults([]); setSearched(false) }}
                  disabled={!state}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none disabled:opacity-50"
                  style={{ borderColor: '#ddd6c8', color: '#0b1a32' }}
                >
                  <option value="">Select City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1B3A6B' }}>ZIP Code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={e => setZip(e.target.value)}
                  placeholder="Enter ZIP code (e.g. 07733)"
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#ddd6c8', color: '#0b1a32' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#1B3A6B' }}>Radius</label>
                <select
                  value={radius}
                  onChange={e => setRadius(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ borderColor: '#ddd6c8', color: '#0b1a32' }}
                >
                  <option value="5">5 Miles</option>
                  <option value="10">10 Miles</option>
                  <option value="20">20 Miles</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={() => void handleSearch()}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)' }}
          >
            {searching ? 'Searching...' : 'Search Shakhas'}
          </button>
        </div>

        {/* Results */}
        {searched && (
          <div className="mt-8">
            {results.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm font-medium" style={{ color: '#5a6f9a' }}>
                  Found {results.length} Shakha{results.length !== 1 ? 's' : ''} near you
                </p>
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{ borderColor: '#ede5d8' }}
                  >
                    <div className="flex gap-4 items-start">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg"
                        style={{ background: 'linear-gradient(135deg, #D4531A, #e87c3e)' }}
                      >
                        🙏
                      </div>
                      <div>
                        <h4 className="font-semibold text-base" style={{ color: '#0b1a32' }}>{r.name}</h4>
                        <div className="flex flex-wrap gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#5a6f9a' }}>
                            📅 {r.day}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#5a6f9a' }}>
                            🕐 {r.time}
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#5a6f9a' }}>
                            📍 {r.city}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onOpenShakhaPage(r)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
                        style={{ background: '#1B3A6B' }}
                      >
                        Open Shakha Page
                      </button>
                      <a
                        href={r.detailUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg text-xs font-semibold border"
                        style={{ borderColor: '#D4531A', color: '#D4531A', pointerEvents: r.detailUrl ? 'auto' : 'none', opacity: r.detailUrl ? 1 : 0.5 }}
                      >
                        Get Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl border p-8 text-center"
                style={{ background: 'rgba(212,83,26,0.04)', borderColor: 'rgba(212,83,26,0.2)' }}
              >
                <div className="text-3xl mb-3">🔍</div>
                <p className="font-medium" style={{ color: '#0b1a32' }}>No Shakhas found in this area yet.</p>
                <p className="text-sm mt-1" style={{ color: '#5a6f9a' }}>
                  Register your interest below — our volunteers will reach out to help start or connect you with a nearby Shakha.
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  )

  if (!standalone) {
    return content
  }

  return (
    <section id="find" className="py-20 lg:py-28" style={{ background: '#FDF6ED' }}>
      {content}
    </section>
  )
}

type FormData = {
  firstName: string; lastName: string; email: string; mobile: string;
  age: string; gender: string; occupation: string;
  state: string; city: string; zip: string; preferredDistance: string;
  interests: string[]; selectedShakha: string; noShakhaNearby: boolean;
  preferredDay: string; comments: string;
}

function RegisterForm({
  standalone = true,
  locationIndex,
  onRegister,
  loadLocationShakhas,
}: {
  standalone?: boolean
  locationIndex: ShakhaLocationIndex
  onRegister: (data: FormData) => Promise<void>
  loadLocationShakhas: (state: string, city: string) => Promise<ShakhaChapter[]>
}) {
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', mobile: '',
    age: '', gender: '', occupation: '',
    state: '', city: '', zip: '', preferredDistance: '10',
    interests: [], selectedShakha: '', noShakhaNearby: false,
    preferredDay: '', comments: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [shakhas, setShakhas] = useState<ShakhaChapter[]>([])
  const [loadingShakhas, setLoadingShakhas] = useState(false)

  const usStates = useMemo(() => Object.keys(locationIndex), [locationIndex])
  const cities = form.state ? (locationIndex[form.state] ?? []) : []

  useEffect(() => {
    const shouldLoad = form.state && form.city && form.state !== 'other' && form.city !== 'other'
    if (!shouldLoad) {
      setShakhas([])
      setLoadingShakhas(false)
      return
    }

    let cancelled = false

    const load = async () => {
      setLoadingShakhas(true)

      try {
        const nextShakhas = await loadLocationShakhas(form.state, form.city)
        if (!cancelled) {
          setShakhas(nextShakhas)
        }
      } finally {
        if (!cancelled) {
          setLoadingShakhas(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [form.city, form.state, loadLocationShakhas])

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }))

  const toggleInterest = (interest: string) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (!form.mobile.match(/^\+?[\d\s\-()]{10,}$/)) e.mobile = 'Valid phone required'
    if (!form.state) e.state = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (!form.zip.match(/^\d{5}$/)) e.zip = '5-digit ZIP required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setSubmitting(true)
      setSubmitError('')
      try {
        await onRegister(form)
        setSubmitted(true)
      } catch {
        setSubmitError('Unable to submit right now. Please try again in a moment.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  const inputClass = (field: keyof FormData) =>
    `w-full ${standalone ? 'px-4 py-3 rounded-xl text-sm' : 'px-3.5 py-2.5 rounded-lg text-[13px]'} border outline-none transition-all ${errors[field] ? 'border-red-400' : 'focus:border-orange-400'}`

  const inputStyle = { borderColor: '#ddd6c8', color: '#0b1a32' }

  if (submitted) {
    const submittedContent = (
      <div className={standalone ? 'max-w-2xl mx-auto px-4 text-center' : 'text-center'}>
          <div className="text-6xl mb-6">🙏</div>
          <h2 className="font-display text-3xl font-bold mb-4" style={{ color: '#132f5d' }}>
            Jai Hind! Thank You, {form.firstName}!
          </h2>
          <p className="text-base mb-6 leading-relaxed" style={{ color: '#2f4671' }}>
            Your interest has been registered. Our local volunteers will contact you shortly and help connect you with the nearest HSS Shakha. We look forward to welcoming you to our community!
          </p>
          <div
            className="inline-block px-6 py-3 rounded-full text-sm font-medium"
            style={{ background: 'rgba(212,83,26,0.2)', border: '1px solid rgba(212,83,26,0.4)', color: '#fb923c' }}
          >
            Confirmation will be sent to: {form.email}
          </div>
          <button
            onClick={() => { setSubmitted(false); setForm(prev => ({ ...prev, firstName: '' })) }}
            className="block mx-auto mt-6 text-sm underline transition-colors"
            style={{ color: '#49608a' }}
          >
            Register another person
          </button>
        </div>
    )

    if (!standalone) {
      return submittedContent
    }

    return (
      <section id="register" className="py-20 lg:py-24" style={{ background: '#FDF6ED' }}>
        {submittedContent}
      </section>
    )
  }

  const INTERESTS = [
    'Family Shakha', 'Bala Gokulam', 'Youth Activities', 'Volunteering',
    'Seva', 'Leadership Programs', 'Yoga', 'Physical Activities',
  ]

  const formContent = (
      <div className={standalone ? 'max-w-3xl mx-auto px-2 sm:px-3' : ''}>
        <div className={standalone ? 'text-center mb-12' : 'text-center mb-8'}>
          <div className={`flex items-center justify-center gap-2 ${standalone ? 'mb-4' : 'mb-3'}`}>
            <div className="h-px w-8" style={{ background: '#D4531A' }} />
            <span className={`${standalone ? 'text-sm' : 'text-[11px]'} font-semibold uppercase tracking-widest`} style={{ color: '#D4531A' }}>
              Join Us
            </span>
            <div className="h-px w-8" style={{ background: '#D4531A' }} />
          </div>
          <h2 className={`font-display font-bold ${standalone ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-[2rem]'}`} style={{ color: '#132f5d' }}>
            Register Your Interest
          </h2>
          <p className={`mt-3 max-w-lg mx-auto ${standalone ? 'text-base' : 'text-sm leading-6'}`} style={{ color: '#5a6f9a' }}>
            Fill in your details and our local volunteers will connect you with the nearest HSS Shakha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={standalone ? 'space-y-8' : 'space-y-5'}>
          {/* Personal Details */}
          <div className={`${standalone ? 'rounded-2xl p-6 lg:p-8' : 'rounded-[1.35rem] p-5 lg:p-6'}`} style={{ background: '#fffdf8', border: '1px solid #eadfce' }}>
            <h3 className={`font-display ${standalone ? 'text-lg mb-6' : 'text-base mb-5'} font-semibold flex items-center gap-2`} style={{ color: '#132f5d' }}>
              <span style={{ color: '#D4531A' }}>01</span> Personal Details
            </h3>
            <div className={`grid sm:grid-cols-2 ${standalone ? 'gap-4' : 'gap-3.5'}`}>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>First Name *</label>
                <input className={inputClass('firstName')} style={inputStyle} value={form.firstName}
                  onChange={e => set('firstName', e.target.value)} placeholder="Arjun" />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Last Name *</label>
                <input className={inputClass('lastName')} style={inputStyle} value={form.lastName}
                  onChange={e => set('lastName', e.target.value)} placeholder="Sharma" />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Email *</label>
                <input type="email" className={inputClass('email')} style={inputStyle} value={form.email}
                  onChange={e => set('email', e.target.value)} placeholder="arjun@email.com" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Mobile *</label>
                <input type="tel" className={inputClass('mobile')} style={inputStyle} value={form.mobile}
                  onChange={e => set('mobile', e.target.value)} placeholder="+1 (555) 000-0000" />
                {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Age</label>
                <input type="number" className={inputClass('age')} style={inputStyle} value={form.age}
                  onChange={e => set('age', e.target.value)} placeholder="35" min="5" max="100" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Gender</label>
                <select className={inputClass('gender')} style={inputStyle} value={form.gender}
                  onChange={e => set('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Occupation</label>
                <input className={inputClass('occupation')} style={inputStyle} value={form.occupation}
                  onChange={e => set('occupation', e.target.value)} placeholder="Software Engineer" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className={`${standalone ? 'rounded-2xl p-6 lg:p-8' : 'rounded-[1.35rem] p-5 lg:p-6'}`} style={{ background: '#fffdf8', border: '1px solid #eadfce' }}>
            <h3 className={`font-display ${standalone ? 'text-lg mb-6' : 'text-base mb-5'} font-semibold flex items-center gap-2`} style={{ color: '#132f5d' }}>
              <span style={{ color: '#D4531A' }}>02</span> Location
            </h3>
            <div className={`grid sm:grid-cols-2 ${standalone ? 'gap-4' : 'gap-3.5'}`}>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>State *</label>
                <select className={inputClass('state')} style={inputStyle} value={form.state}
                  onChange={e => { set('state', e.target.value); set('city', ''); set('selectedShakha', '') }}>
                  <option value="">Select State</option>
                  {usStates.map(s => <option key={s}>{s}</option>)}
                  <option value="other">Other State</option>
                </select>
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>City *</label>
                {cities.length > 0 ? (
                  <select className={inputClass('city')} style={inputStyle} value={form.city}
                    onChange={e => { set('city', e.target.value); set('selectedShakha', '') }}>
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c}>{c}</option>)}
                    <option value="other">Other City</option>
                  </select>
                ) : (
                  <input className={inputClass('city')} style={inputStyle} value={form.city}
                    onChange={e => set('city', e.target.value)} placeholder="Your City" />
                )}
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>ZIP Code *</label>
                <input maxLength={5} className={inputClass('zip')} style={inputStyle} value={form.zip}
                  onChange={e => set('zip', e.target.value)} placeholder="07733" />
                {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Preferred Distance</label>
                <select className={inputClass('preferredDistance')} style={inputStyle} value={form.preferredDistance}
                  onChange={e => set('preferredDistance', e.target.value)}>
                  <option value="5">5 Miles</option>
                  <option value="10">10 Miles</option>
                  <option value="20">20 Miles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className={`${standalone ? 'rounded-2xl p-6 lg:p-8' : 'rounded-[1.35rem] p-5 lg:p-6'}`} style={{ background: '#fffdf8', border: '1px solid #eadfce' }}>
            <h3 className={`font-display ${standalone ? 'text-lg mb-6' : 'text-base mb-5'} font-semibold flex items-center gap-2`} style={{ color: '#132f5d' }}>
              <span style={{ color: '#D4531A' }}>03</span> Interested In
            </h3>
            <div className={`grid grid-cols-2 sm:grid-cols-4 ${standalone ? 'gap-3' : 'gap-2.5'}`}>
              {INTERESTS.map(interest => {
                const checked = form.interests.includes(interest)
                return (
                  <label key={interest} className="flex items-center gap-2.5 cursor-pointer group">
                    <div
                      onClick={() => toggleInterest(interest)}
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all border cursor-pointer"
                      style={{
                        background: checked ? '#D4531A' : 'transparent',
                        borderColor: checked ? '#D4531A' : 'rgba(255,255,255,0.25)',
                      }}
                    >
                      {checked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-sm cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                      style={{ color: checked ? '#D4531A' : '#5a6f9a' }}
                    >
                      {interest}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Nearest Shakha */}
          <div className={`${standalone ? 'rounded-2xl p-6 lg:p-8' : 'rounded-[1.35rem] p-5 lg:p-6'}`} style={{ background: '#fffdf8', border: '1px solid #eadfce' }}>
            <h3 className={`font-display ${standalone ? 'text-lg mb-6' : 'text-base mb-5'} font-semibold flex items-center gap-2`} style={{ color: '#132f5d' }}>
              <span style={{ color: '#D4531A' }}>04</span> Find Nearest Shakha
            </h3>

            {shakhas.length > 0 ? (
              <div>
                <label className="block text-sm font-medium mb-1.5 text-white/70">Select Nearby Shakha</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
                  style={{ ...inputStyle, borderColor: '#ddd6c8' }}
                  value={form.selectedShakha}
                  onChange={e => { set('selectedShakha', e.target.value); set('noShakhaNearby', 'false') }}
                >
                  <option value="">Choose a Shakha</option>
                  {shakhas.map(s => (
                    <option key={s.name} value={s.name}>{s.name} — {s.day} {s.time}</option>
                  ))}
                </select>
              </div>
            ) : loadingShakhas ? (
              <p className="text-sm mb-4" style={{ color: '#5a6f9a' }}>Loading Shakhas for {form.city}, {form.state}...</p>
            ) : (
              <p className="text-sm mb-4" style={{ color: '#5a6f9a' }}>Select your state and city above to find nearby Shakhas.</p>
            )}

            <label className="flex items-center gap-2.5 mt-4 cursor-pointer">
              <div
                onClick={() => set('noShakhaNearby', !form.noShakhaNearby as unknown as string)}
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all border cursor-pointer"
                style={{
                  background: form.noShakhaNearby ? '#D4531A' : 'transparent',
                  borderColor: form.noShakhaNearby ? '#D4531A' : 'rgba(255,255,255,0.25)',
                }}
              >
                {form.noShakhaNearby && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm" style={{ color: '#5a6f9a' }}>I couldn&apos;t find a nearby Shakha</span>
            </label>

            {form.noShakhaNearby && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1.5" style={{ color: '#2f4671' }}>Preferred Session Time</label>
                <div className="flex flex-wrap gap-2">
                  {['Morning', 'Evening', 'Weekend'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => set('preferredDay', day)}
                      className="px-4 py-2 rounded-full text-sm font-medium transition-all border"
                      style={{
                        background: form.preferredDay === day ? '#D4531A' : 'transparent',
                        borderColor: form.preferredDay === day ? '#D4531A' : '#d7c8b3',
                        color: form.preferredDay === day ? '#fff' : '#5a6f9a',
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className={`${standalone ? 'rounded-2xl p-6 lg:p-8' : 'rounded-[1.35rem] p-5 lg:p-6'}`} style={{ background: '#fffdf8', border: '1px solid #eadfce' }}>
            <h3 className={`font-display ${standalone ? 'text-lg mb-6' : 'text-base mb-5'} font-semibold flex items-center gap-2`} style={{ color: '#132f5d' }}>
              <span style={{ color: '#D4531A' }}>05</span> Additional Comments
            </h3>
            <textarea
              rows={4}
              className={`w-full ${standalone ? 'px-4 py-3 rounded-xl text-sm' : 'px-3.5 py-2.5 rounded-lg text-[13px]'} border outline-none resize-none`}
              style={inputStyle}
              value={form.comments}
              onChange={e => set('comments', e.target.value)}
              placeholder="Any questions or specific requirements? Let us know..."
            />
          </div>

          {/* Info note */}
          <div
            className={`flex gap-3 items-start ${standalone ? 'px-5 py-4 rounded-xl' : 'px-4 py-3 rounded-lg'}`}
            style={{ background: 'rgba(212,83,26,0.1)', border: '1px solid rgba(212,83,26,0.25)' }}
          >
            <span className="text-lg flex-shrink-0">ℹ️</span>
            <p className={`${standalone ? 'text-sm' : 'text-[13px]'} leading-relaxed`} style={{ color: '#2f4671' }}>
              Our local volunteers will contact you and help connect you with the nearest HSS Shakha. Your information is kept private and used only for this purpose.
            </p>
          </div>

          {submitError && (
            <p className="text-sm" style={{ color: '#c2410c' }}>{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full ${standalone ? 'py-4 rounded-xl text-base' : 'py-3.5 rounded-lg text-sm'} font-semibold text-white transition-all hover:scale-[1.01] hover:shadow-xl`}
            style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)' }}
          >
            {submitting ? 'Submitting...' : 'Register My Interest 🙏'}
          </button>
        </form>
      </div>
  )

  if (!standalone) {
    return formContent
  }

  return (
    <section id="register" className="py-16 lg:py-20" style={{ background: '#FDF6ED' }}>
      {formContent}
    </section>
  )
}

function FAQ({ standalone = true }: { standalone?: boolean }) {
  const [open, setOpen] = useState<number | null>(null)

  const content = (
    <div className={standalone ? 'max-w-[78rem] mx-auto px-2 sm:px-3' : ''}>
      <div className={standalone ? 'text-center mb-12' : 'mb-8'}>
        <div className={`flex items-center ${standalone ? 'justify-center' : ''} gap-2 mb-4`}>
          <div className="h-px w-8" style={{ background: '#D4531A' }} />
          <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#D4531A' }}>
            FAQ
          </span>
          <div className="h-px w-8" style={{ background: '#D4531A' }} />
        </div>
        <h2 className={`font-display font-bold ${standalone ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`} style={{ color: '#0b1a32' }}>
          Frequently Asked Questions
        </h2>
      </div>

      <div>
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="border-b transition-all"
            style={{ borderColor: open === i ? 'rgba(212,83,26,0.55)' : '#eadfce' }}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left py-4 flex items-center justify-between gap-4"
            >
              <span className="font-medium text-base" style={{ color: '#0b1a32' }}>{faq.q}</span>
              <svg
                className="w-5 h-5 flex-shrink-0 transition-transform duration-200"
                style={{ color: '#D4531A', transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.25}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="pb-4">
                <p className="text-sm leading-relaxed" style={{ color: '#5a6f9a' }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  if (!standalone) {
    return content
  }

  return (
    <section id="faq" className="py-20 lg:py-28" style={{ background: '#FDF6ED' }}>
      {content}
    </section>
  )
}

function FindFaqSideBySide({
  locationIndex,
  onOpenShakhaPage,
  onSearchLocation,
}: {
  locationIndex: ShakhaLocationIndex
  onOpenShakhaPage: (chapter: ShakhaChapter) => void
  onSearchLocation: (state: string, city: string) => Promise<ShakhaChapter[]>
}) {
  return (
    <section className="py-20 lg:py-24" style={{ background: '#FDF6ED' }}>
      <div className="max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8" style={{ background: '#D4531A' }} />
            <span className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#D4531A' }}>
              Shakha Support
            </span>
            <div className="h-px w-8" style={{ background: '#D4531A' }} />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold" style={{ color: '#0b1a32' }}>
            Search Shakha & Common Questions
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div id="find" className="rounded-3xl p-6 sm:p-8 border bg-white" style={{ borderColor: '#eadfce' }}>
            <FindShakha
              standalone={false}
              locationIndex={locationIndex}
              onOpenShakhaPage={onOpenShakhaPage}
              onSearchLocation={onSearchLocation}
            />
          </div>

          <div id="faq" className="rounded-3xl p-6 sm:p-8 border bg-white" style={{ borderColor: '#eadfce' }}>
            <FAQ standalone={false} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact({ standalone = true }: { standalone?: boolean }) {
  const contactMethods = [
    { icon: '📧', label: 'Email', value: 'info@hssus.org', sub: 'Replies within 24 hours' },
    { icon: '📞', label: 'Phone', value: '+1 (800) HSS-USA0', sub: 'Mon–Sat, 9am–6pm ET' },
    { icon: '🌐', label: 'Website', value: 'www.hssus.org', sub: 'National portal and updates' },
  ]

  const socialLinks = [
    { icon: '📘', name: 'Facebook', handle: '/HSSUSA' },
    { icon: '📷', name: 'Instagram', handle: '@hss_usa' },
    { icon: '🐦', name: 'Twitter / X', handle: '@HSSUSA' },
    { icon: '▶️', name: 'YouTube', handle: 'HSS USA' },
  ]

  if (!standalone) {
    return (
      <div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ background: 'rgba(212,83,26,0.16)', color: '#fb923c' }}>
            Need Help?
          </div>
          <h2 className="mt-4 font-display text-[1.9rem] leading-tight font-bold text-white">
            Get in Touch
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/68">
            Reach our volunteer team directly while you fill out the form. We can help you find the right Shakha, timing, or family program.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {['Quick reply', 'Family friendly', 'Volunteer led'].map(item => (
            <div
              key={item}
              className="rounded-xl px-2.5 py-2 text-center text-[11px] font-medium"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.78)' }}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-5">
          {contactMethods.map(method => (
            <div
              key={method.label}
              className="rounded-2xl p-4"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 100%)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: 'rgba(212,83,26,0.18)' }}
                >
                  {method.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: '#fb923c' }}>
                    {method.label}
                  </div>
                  <div className="text-sm font-semibold text-white break-all">{method.value}</div>
                  <div className="text-xs mt-1 text-white/48">{method.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {socialLinks.map(link => (
            <div
              key={link.name}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.74)' }}
            >
              <span>{link.icon}</span>
              <span>{link.handle}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a
            href="mailto:info@hssus.org"
            className="rounded-xl px-4 py-3 text-center text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)', color: '#fff' }}
          >
            Email Team
          </a>
          <a
            href="https://www.hssus.org"
            className="rounded-xl px-4 py-3 text-center text-sm font-semibold border"
            style={{ borderColor: 'rgba(255,255,255,0.16)', color: '#fff' }}
          >
            Visit Website
          </a>
        </div>
      </div>
    )
  }

  const content = (
      <div className={standalone ? 'max-w-[82rem] mx-auto px-2 sm:px-3 lg:px-4' : ''}>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Get in Touch
          </h2>
          <p className="text-white/60 text-base">
            Reach out to our national team — we're here to guide you.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {contactMethods.map(c => (
            <div
              key={c.label}
              className="rounded-2xl p-6 text-center"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#fb923c' }}>
                {c.label}
              </div>
              <div className="font-semibold text-white text-sm mb-1">{c.value}</div>
              <div className="text-xs text-white/45">{c.sub}</div>
            </div>
          ))}
        </div>

        {/* Social media */}
        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map(s => (
            <div
              key={s.name}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}
            >
              <span>{s.icon}</span>
              <span>{s.handle}</span>
            </div>
          ))}
        </div>
      </div>
  )

  if (!standalone) {
    return content
  }

  return (
    <section id="contact" className="py-20 lg:py-24" style={{ background: '#1B3A6B' }}>
      {content}
    </section>
  )
}

function LeaderBeePage() {
  const learnItems = [
    { icon: '🏆', label: 'Leadership' },
    { icon: '🤝', label: 'Teamwork' },
    { icon: '🎯', label: 'Goal Setting' },
    { icon: '🧠', label: 'Problem Solving' },
    { icon: '💬', label: 'Communication' },
    { icon: '❤️', label: 'Character Building' },
    { icon: '🏃', label: 'Physical Fitness' },
    { icon: '🧘', label: 'Yoga & Wellness' },
    { icon: '🌺', label: 'Hindu Values' },
  ]

  const parentReasons = [
    'Participate with your child',
    'Learn leadership together',
    'Strengthen family bonding',
    'Encourage confidence',
    'Support long-term growth',
  ]

  const highlights = [
    'Fun Team Games',
    'Public Speaking',
    'Leadership Activities',
    'Outdoor Challenges',
    'Yoga',
    'Value-Based Discussions',
    'Creative Projects',
    'Group Presentations',
  ]

  const registrationUrl = 'https://join.shakhasewasetu.com/register-leader-bee'

  return (
    <div className="min-h-screen" style={{ background: '#FFF7ED', color: '#1F2937' }}>
      <section className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-4 pb-16">
        <div className="rounded-[2rem] border overflow-hidden shadow-[0_16px_48px_rgba(30,58,138,0.12)]" style={{ background: '#fffdf9', borderColor: '#fde2c5' }}>
          <div className="px-6 pt-5 pb-2 border-b" style={{ borderColor: '#f3ddc3' }}>
            <div className="flex flex-wrap items-center justify-end gap-4 text-xs sm:text-sm font-semibold" style={{ color: '#1E3A8A' }}>
              {['About', 'Program', 'Details', 'Benefits', 'Register'].map(item => (
                <a key={item} href={item === 'Register' ? '#leader-bee-register' : '#leader-bee-program'} className="hover:opacity-80 transition-opacity">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.06fr_0.94fr] gap-6 p-6 sm:p-8 lg:p-10">
            <div className="pt-2">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#F97316' }}>Leader-BEE</p>
              <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-black leading-[0.95]" style={{ color: '#1E3A8A' }}>
                LEADER-<span style={{ color: '#F97316' }}>BEE</span>
              </h1>
              <div className="inline-flex mt-4 rounded-md px-4 py-2 text-white text-lg sm:text-xl font-bold" style={{ background: '#1E3A8A' }}>
                10 WEEKS WORKSHOP
              </div>
              <p className="mt-6 text-3xl sm:text-4xl italic font-semibold leading-tight" style={{ color: '#1E3A8A' }}>
                Unleash the <span style={{ color: '#F97316' }}>Leader</span>
                <br />
                among you this summer!
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: '#fde2c5', background: '#fff4ea' }}>
                <span className="rounded-md px-2 py-1 text-xs font-extrabold text-white" style={{ background: '#F97316' }}>FREE</span>
                <span className="text-sm sm:text-base font-semibold" style={{ color: '#1E3A8A' }}>Leadership Development Program</span>
              </div>

              <p className="mt-4 inline-block rounded-lg px-3 py-2 text-sm sm:text-base font-bold text-white" style={{ background: '#1E3A8A' }}>
                For Students in <span style={{ color: '#FACC15' }}>Grade 4 – Grade 8</span>
              </p>

              <p className="mt-4 text-sm sm:text-base font-semibold" style={{ color: '#1E3A8A' }}>
                Build Confidence • Leadership • Discipline • Teamwork
              </p>

              <a
                href="#leader-bee-register"
                className="mt-6 inline-flex items-center justify-center rounded-2xl px-8 py-3 text-lg font-extrabold text-white shadow-[0_14px_24px_rgba(249,115,22,0.35)] transition-transform hover:scale-[1.03]"
                style={{ background: 'linear-gradient(120deg, #fb923c, #f97316)' }}
              >
                REGISTER NOW
              </a>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem]" style={{ background: 'radial-gradient(circle at 65% 35%, rgba(249,115,22,0.95) 0%, rgba(249,115,22,0.82) 42%, rgba(249,115,22,0.15) 78%, rgba(249,115,22,0) 100%)' }} />
              <div className="absolute top-4 right-4 z-20 rounded-xl px-4 py-3 text-white text-sm sm:text-base font-extrabold shadow-lg" style={{ background: '#1E3A8A' }}>
                EVERY THURSDAY
                <br />
                <span className="font-bold text-orange-200">6:00 PM – 7:30 PM</span>
              </div>
              <div className="absolute top-4 left-4 z-20 grid grid-cols-2 gap-2 text-[11px] sm:text-xs font-bold text-white/95">
                {['Leadership', 'Teamwork', 'Goal Setting', 'Values'].map(item => (
                  <span key={item} className="rounded-md px-2 py-1" style={{ background: 'rgba(30,58,138,0.8)' }}>
                    {item}
                  </span>
                ))}
              </div>
              <img src={familyImg} alt="Leader-BEE students" className="relative z-10 w-full h-full object-cover rounded-[2rem]" />
            </div>
          </div>
        </div>
      </section>

      <section id="leader-bee-program" className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pb-6">
        <div className="rounded-3xl border p-5 sm:p-6" style={{ background: '#fffdfa', borderColor: '#f3ddc3' }}>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold" style={{ color: '#1E3A8A' }}>PROGRAM DETAILS</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border p-5 text-center" style={{ borderColor: '#f5d7b8', background: '#ffffff' }}>
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white" style={{ background: '#F97316' }}>📅</div>
              <p className="mt-3 text-lg font-extrabold" style={{ color: '#F97316' }}>WHEN</p>
              <p className="mt-2 text-base font-semibold" style={{ color: '#1E3A8A' }}>July 30th</p>
              <p className="text-base font-semibold" style={{ color: '#1E3A8A' }}>to 10 Weeks</p>
              <p className="mt-1 text-base font-semibold" style={{ color: '#1E3A8A' }}>Every Thursday</p>
              <p className="text-base font-semibold" style={{ color: '#1E3A8A' }}>6:00 PM – 7:30 PM</p>
            </div>

            <div className="rounded-2xl border p-5 text-center" style={{ borderColor: '#f5d7b8', background: '#ffffff' }}>
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white" style={{ background: '#1E3A8A' }}>👨‍👩‍👧</div>
              <p className="mt-3 text-lg font-extrabold" style={{ color: '#1E3A8A' }}>WHO CAN ATTEND?</p>
              <p className="mt-2 text-base font-semibold" style={{ color: '#1E3A8A' }}>Grade 4th to Grade 8th</p>
              <p className="mt-2 text-xl font-black" style={{ color: '#F97316' }}>+ </p>
              <p className="text-base font-bold" style={{ color: '#F97316' }}>At least ONE parent must attend</p>
            </div>

            <div className="rounded-2xl border p-5 text-center" style={{ borderColor: '#f5d7b8', background: '#ffffff' }}>
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white" style={{ background: '#F97316' }}>📍</div>
              <p className="mt-3 text-lg font-extrabold" style={{ color: '#F97316' }}>WHERE</p>
              <p className="mt-2 text-[1.35rem] font-extrabold" style={{ color: '#1E3A8A' }}>Holmdel Park</p>
              <p className="text-xl font-extrabold" style={{ color: '#1E3A8A' }}>or nearby location</p>
              <p className="mt-2 text-base font-semibold" style={{ color: '#1E3A8A' }}>Final location will be shared after registration</p>
            </div>

            <div className="rounded-2xl border p-5 text-center" style={{ borderColor: '#f5d7b8', background: '#ffffff' }}>
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl text-white" style={{ background: '#1E3A8A' }}>🧑‍🤝‍🧑</div>
              <p className="mt-3 text-lg font-extrabold" style={{ color: '#1E3A8A' }}>REMARKS</p>
              <p className="mt-2 text-[1.12rem] font-bold leading-8" style={{ color: '#1E3A8A' }}>At least one parent must attend each session.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-3 pb-6">
        <div className="rounded-3xl border p-5 sm:p-6" style={{ background: '#fffdfa', borderColor: '#f3ddc3' }}>
          <h2 className="text-center text-2xl sm:text-3xl font-extrabold" style={{ color: '#1E3A8A' }}>WHAT STUDENTS WILL LEARN</h2>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
            {learnItems.map(item => (
              <div key={item.label} className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: '#fef0e2' }}>{item.icon}</div>
                <p className="mt-2 text-sm font-bold leading-5" style={{ color: '#1E3A8A' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-3 pb-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border p-6" style={{ background: '#fffdfa', borderColor: '#f3ddc3' }}>
            <h2 className="text-3xl font-black" style={{ color: '#F97316' }}>WHY PARENTS SHOULD JOIN</h2>
            <ul className="mt-4 space-y-3 text-lg font-semibold" style={{ color: '#1E3A8A' }}>
              {parentReasons.map(reason => (
                <li key={reason}>● {reason}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border p-6" style={{ background: '#fffdfa', borderColor: '#f3ddc3' }}>
            <h2 className="text-3xl font-black" style={{ color: '#1E3A8A' }}>WORKSHOP HIGHLIGHTS</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-y-3 gap-x-4 text-lg font-semibold" style={{ color: '#1E3A8A' }}>
              {highlights.map(item => (
                <li key={item}>● {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="leader-bee-register" className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-3 pb-6">
        <div className="rounded-3xl overflow-hidden border" style={{ borderColor: '#f3ddc3' }}>
          <div className="grid md:grid-cols-[1fr_auto] gap-4 px-6 py-6" style={{ background: '#1E3A8A' }}>
            <div>
              <h2 className="text-4xl font-black text-white">READY TO BEGIN?</h2>
              <p className="mt-1 text-3xl font-extrabold text-white">Registration is <span style={{ color: '#FACC15' }}>FREE</span></p>
            </div>
            <a
              href={registrationUrl}
              className="inline-flex items-center justify-center rounded-2xl px-10 py-4 text-3xl font-black text-white shadow-[0_10px_24px_rgba(249,115,22,0.4)]"
              style={{ background: '#F97316' }}
            >
              REGISTER NOW →
            </a>
          </div>
          <div className="px-6 py-4 text-lg font-bold break-all" style={{ background: '#fffdfa', color: '#1E3A8A' }}>
            REGISTRATION LINK: <span style={{ color: '#F97316' }}>{registrationUrl}</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-3 pb-8">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border p-6" style={{ background: '#fffdfa', borderColor: '#f3ddc3' }}>
            <h2 className="text-3xl font-black text-center" style={{ color: '#1E3A8A' }}>IMPORTANT NOTES</h2>
            <div className="mt-5 grid sm:grid-cols-3 gap-3 text-center">
              <p className="text-lg font-bold" style={{ color: '#1E3A8A' }}>📌<br />At least one parent must attend each session.</p>
              <p className="text-lg font-bold" style={{ color: '#1E3A8A' }}>📌<br />Limited seats available.</p>
              <p className="text-lg font-bold" style={{ color: '#1E3A8A' }}>📌<br />Registration required.</p>
            </div>
          </div>

          <div className="rounded-3xl border p-6" style={{ background: '#fffdfa', borderColor: '#f3ddc3' }}>
            <h2 className="text-3xl font-black text-center" style={{ color: '#1E3A8A' }}>KNOW A FAMILY WITH CHILDREN IN GRADES 4–8?</h2>
            <p className="mt-4 text-lg font-semibold text-center" style={{ color: '#1E3A8A' }}>
              Please share this program with your friends, relatives, neighbors, and community.
            </p>
            <p className="mt-3 text-2xl font-black text-center" style={{ color: '#F97316' }}>Together, let's nurture tomorrow's leaders.</p>
          </div>
        </div>
      </section>

      <footer className="py-7" style={{ background: 'linear-gradient(120deg, #0c2e70, #102b5f 58%, #0a2452)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-orange-200 text-sm">Hosted by</p>
            <p className="mt-1 text-white text-2xl font-black">Hindu Swayamsevak Sangh (HSS)</p>
            <p className="mt-1 text-orange-200 text-sm font-semibold">SANGATHAN • SANSKAR • SEVA • SAMARPAN</p>
          </div>
          <div className="flex items-center gap-3">
            {['f', 'ig', 'yt', 'www'].map(item => (
              <span key={item} className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: '#F97316' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

function Footer({ onNav }: { onNav: (id: string) => void }) {
  return (
    <footer style={{ background: '#071020' }}>
      <div className="max-w-[90rem] mx-auto px-2 sm:px-3 lg:px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={sssLogo}
                alt="Shakha Sewa Setu logo"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-white font-display font-semibold">Shakha Sewa Setu</span>
                <span className="text-white/40 text-xs">Community Initiative</span>
              </div>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-3">
              A community-run portal helping individuals and families connect with nearby HSS Shakhas across the USA.
            </p>
            <div
              className="px-3 py-2.5 rounded-lg text-xs leading-relaxed"
              style={{ background: 'rgba(212,83,26,0.12)', border: '1px solid rgba(212,83,26,0.22)', color: 'rgba(255,180,100,0.8)' }}
            >
              <span className="font-semibold">⚠ Disclaimer:</span> This is not an official HSS website. Run by a member in individual capacity.
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: 'About Shakha', id: 'about' },
                { label: 'Benefits', id: 'benefits' },
                { label: 'Find a Shakha', id: 'find' },
                { label: 'Register Interest', id: 'register' },
              ].map(l => (
                <button
                  key={l.id}
                  onClick={() => onNav(l.id)}
                  className="block text-sm text-white/45 hover:text-white/80 transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Programs</h4>
            <div className="space-y-2 text-sm text-white/45">
              {['Bala Gokulam', 'Sadhvi Shakti', 'Yuva Shakha', 'Seva Programs', 'Leadership Training'].map(p => (
                <div key={p}>{p}</div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Resources</h4>
            <div className="space-y-2 text-sm text-white/45">
              {['News & Events', 'Publications', 'Volunteer', 'Donate', 'Contact Us'].map(r => (
                <div key={r}>{r}</div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs text-white/30">
            © 2025 Hindu Swayamsevak Sangh USA. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            A non-profit cultural organization dedicated to Hindu values & community service.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [locationIndex, setLocationIndex] = useState<ShakhaLocationIndex>({})
  const [loadedLocationRecords, setLoadedLocationRecords] = useState<Record<string, ShakhaRecord[]>>({})
  const [adminShakhaRecords, setAdminShakhaRecords] = useState<ShakhaRecord[]>([])
  const [activeShakha, setActiveShakha] = useState<ShakhaRecord | null>(null)
  const [pathname, setPathname] = useState(() =>
    typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/',
  )
  const [loadingLocationIndex, setLoadingLocationIndex] = useState(true)
  const [loadingSharePage, setLoadingSharePage] = useState(false)
  const [loadingAdminShakhas, setLoadingAdminShakhas] = useState(false)
  const [disclaimerVisible, setDisclaimerVisible] = useState(true)
  const [activePage, setActivePage] = useState<'home' | 'register' | 'leader-bee'>(() => {
    if (typeof window === 'undefined') {
      return 'home'
    }

    const currentPath = normalizePathname(window.location.pathname)
    if (currentPath === '/register') {
      return 'register'
    }
    if (currentPath === '/register-leader-bee') {
      return 'leader-bee'
    }
    return 'home'
  })
  const [pendingScrollTarget, setPendingScrollTarget] = useState<string | null>(null)

  const publicShakhaRecords = useMemo(
    () => Object.values(loadedLocationRecords).flat(),
    [loadedLocationRecords],
  )
  const isAdminPath = pathname === '/admin-join-app'
  const isLeaderBeePath = pathname === '/register-leader-bee'
  const isKnownPath = pathname === '/' || pathname === '/register' || isLeaderBeePath || isAdminPath
  const isLoading = isAdminPath
    ? loadingAdminShakhas
    : loadingLocationIndex || loadingSharePage

  const loadLocationRecords = useCallback(async (state: string, city: string) => {
    const cacheKey = `${state}::${city}`
    const cached = loadedLocationRecords[cacheKey]
    if (cached) {
      return cached
    }

    const records = await listPublicShakhaRecordsByLocation(state, city)
    setLoadedLocationRecords(prev => {
      if (prev[cacheKey]) {
        return prev
      }

      return {
        ...prev,
        [cacheKey]: records,
      }
    })

    return records
  }, [loadedLocationRecords])

  const searchLocation = useCallback(async (state: string, city: string) => {
    const records = await loadLocationRecords(state, city)
    return buildShakhaDataMap(records)[state]?.[city] ?? []
  }, [loadLocationRecords])

  const navigateToPage = (page: 'home' | 'register' | 'leader-bee') => {
    const targetPath = page === 'register' ? '/register' : page === 'leader-bee' ? '/register-leader-bee' : '/'
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
    }
    setPathname(targetPath)
    setActiveShakha(null)
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLocationIndex(await listPublicShakhaLocations())
      } finally {
        setLoadingLocationIndex(false)
      }
    }

    void loadLocations()
  }, [])

  useEffect(() => {
    if (!isAdminPath) {
      setLoadingAdminShakhas(false)
      return
    }

    let cancelled = false

    const loadAdminShakhas = async () => {
      setLoadingAdminShakhas(true)

      try {
        const { listShakhaRecordsAdmin } = await import('./adminApi')
        const records = await listShakhaRecordsAdmin()
        if (!cancelled) {
          setAdminShakhaRecords(records)
        }
      } finally {
        if (!cancelled) {
          setLoadingAdminShakhas(false)
        }
      }
    }

    void loadAdminShakhas()

    return () => {
      cancelled = true
    }
  }, [isAdminPath])

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = normalizePathname(window.location.pathname)
      setPathname(currentPath)
      if (currentPath === '/register') {
        setActivePage('register')
      } else if (currentPath === '/register-leader-bee') {
        setActivePage('leader-bee')
      } else {
        setActivePage('home')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (isAdminPath || isKnownPath) {
      setLoadingSharePage(false)
      if (isKnownPath) {
        setActiveShakha(null)
      }
      return
    }

    let cancelled = false

    const loadSharePage = async () => {
      setLoadingSharePage(true)

      try {
        const record = await findPublicShakhaBySlug(pathname.slice(1).trim().toLowerCase())
        if (cancelled) {
          return
        }

        if (record) {
          setActiveShakha(record)
          return
        }

        window.history.replaceState({}, '', '/register')
        setPathname('/register')
        setActivePage('register')
      } finally {
        if (!cancelled) {
          setLoadingSharePage(false)
        }
      }
    }

    void loadSharePage()

    return () => {
      cancelled = true
    }
  }, [isAdminPath, isKnownPath, pathname])

  useEffect(() => {
    if (isLeaderBeePath) {
      setMetaTagByName('description', 'Leader-BEE is a free 10-week leadership workshop for Grade 4 to Grade 8 students with parent participation.')
      setMetaTagByProperty('og:title', 'Leader-BEE - 10 Weeks Leadership Workshop')
      setMetaTagByProperty('og:type', 'website')
      setMetaTagByProperty('og:description', 'Free summer leadership workshop for students in Grade 4 to Grade 8. Limited seats available.')
      setMetaTagByProperty('og:url', `${window.location.origin}${pathname}`)
      setMetaTagByProperty('og:image', `${window.location.origin}${SITE_SHARE_IMAGE}`)
      setMetaTagByName('twitter:card', 'summary_large_image')
      setMetaTagByName('twitter:title', 'Leader-BEE - 10 Weeks Leadership Workshop')
      setMetaTagByName('twitter:description', 'Free leadership development program for Grade 4 to Grade 8 students with parent participation.')
      setMetaTagByName('twitter:image', `${window.location.origin}${SITE_SHARE_IMAGE}`)
      document.title = 'Leader-BEE | Join Shakha Sewa Setu'
      return
    }

    if (!activeShakha) {
      setMetaTagByName('description', 'Find and join the nearest HSS Shakha in your area. Register your interest and connect with local volunteers.')
      setMetaTagByProperty('og:title', 'Shakha Sewa Setu - Join HSS Shakha')
      setMetaTagByProperty('og:type', 'website')
      setMetaTagByProperty('og:description', 'Find your nearest HSS Shakha and register your interest.')
      setMetaTagByProperty('og:url', `${window.location.origin}${pathname}`)
      setMetaTagByProperty('og:image', `${window.location.origin}${SITE_SHARE_IMAGE}`)
      setMetaTagByName('twitter:card', 'summary_large_image')
      setMetaTagByName('twitter:title', 'Shakha Sewa Setu - Join HSS Shakha')
      setMetaTagByName('twitter:description', 'Find your nearest HSS Shakha and register your interest.')
      setMetaTagByName('twitter:image', `${window.location.origin}${SITE_SHARE_IMAGE}`)
      document.title = 'Shakha Sewa Setu - Join HSS Shakha'
      return
    }

    const title = getShareTitle(activeShakha)
    const description = getShareDescription(activeShakha)
    const url = `${window.location.origin}${getShakhaRoute(activeShakha)}`

    document.title = title
    setMetaTagByName('description', description)
    setMetaTagByProperty('og:type', 'website')
    setMetaTagByProperty('og:title', title)
    setMetaTagByProperty('og:description', description)
    setMetaTagByProperty('og:url', url)
    setMetaTagByProperty('og:image', `${window.location.origin}${SHAKHA_SHARE_IMAGE}`)
    setMetaTagByName('twitter:card', 'summary_large_image')
    setMetaTagByName('twitter:title', title)
    setMetaTagByName('twitter:description', description)
    setMetaTagByName('twitter:image', `${window.location.origin}${SHAKHA_SHARE_IMAGE}`)
  }, [activeShakha, isLeaderBeePath, pathname])

  useEffect(() => {
    if (activePage === 'home' && pendingScrollTarget) {
      requestAnimationFrame(() => {
        const el = document.getElementById(pendingScrollTarget)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
      setPendingScrollTarget(null)
    }
  }, [activePage, pendingScrollTarget])

  const scrollTo = (id: string) => {
    if (id === 'register') {
      navigateToPage('register')
      return
    }

    if (activePage === 'register') {
      navigateToPage('home')
      if (id !== 'home') {
        setPendingScrollTarget(id)
      }
      return
    }

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleInterestRegister = async (data: FormData) => {
    await submitInterestedPerson({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobile: data.mobile,
      age: data.age,
      gender: data.gender,
      occupation: data.occupation,
      state: data.state,
      city: data.city,
      zip: data.zip,
      preferredDistance: data.preferredDistance,
      interests: data.interests,
      selectedShakha: data.selectedShakha,
      noShakhaNearby: data.noShakhaNearby,
      preferredDay: data.preferredDay,
      comments: data.comments,
    })
  }

  const refreshShakhas = useCallback(async () => {
    const { listShakhaRecordsAdmin } = await import('./adminApi')
    const records = await listShakhaRecordsAdmin()
    setAdminShakhaRecords(records)
  }, [])

  const openShakhaPage = (chapter: ShakhaChapter) => {
    const record = publicShakhaRecords.find(item => (
      item.name === chapter.name &&
      item.city === chapter.city &&
      item.state === chapter.state
    ))

    if (!record) {
      navigateToPage('register')
      return
    }

    const targetPath = getShakhaRoute(record)
    window.history.pushState({}, '', targetPath)
    setActiveShakha(record)
    setPathname(targetPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isAdminPath) {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF6ED' }}>
            <p className="text-sm" style={{ color: '#5a6f9a' }}>Loading admin panel...</p>
          </div>
        }
      >
        <AdminPanel shakhaRecords={adminShakhaRecords} refreshShakhas={refreshShakhas} />
      </Suspense>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDF6ED' }}>
        <p className="text-sm" style={{ color: '#5a6f9a' }}>Loading Shakha data...</p>
      </div>
    )
  }

  if (activeShakha) {
    return <ShakhaSharePage record={activeShakha} onBack={() => navigateToPage('register')} />
  }

  if (activePage === 'leader-bee') {
    return <LeaderBeePage />
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      {/* Disclaimer sits above the fixed navbar */}
      <div className="fixed top-0 left-0 right-0 z-[60]">
        {disclaimerVisible && (
          <div
            className="flex items-center justify-center gap-3 px-4 py-2.5 text-center"
            style={{ background: '#1B3A6B', borderBottom: '1px solid rgba(212,83,26,0.35)' }}
          >
            <span className="text-xs sm:text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>
              <span className="font-semibold" style={{ color: '#fb923c' }}>⚠ Disclaimer:</span>{' '}
              This is <span className="font-semibold text-white">not an official HSS website</span>. It is run by one of the members in their individual capacity to help the community.
            </span>
            <button
              onClick={() => setDisclaimerVisible(false)}
              className="flex-shrink-0 hover:opacity-80 transition-opacity ml-2"
              style={{ color: 'rgba(255,255,255,0.45)' }}
              aria-label="Dismiss disclaimer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <Navbar onNav={scrollTo} disclaimerVisible={disclaimerVisible} />
      {activePage === 'home' ? (
        <>
          <Hero onNav={scrollTo} />
          <About />
          <Benefits />
          <Timeline />
          <FindFaqSideBySide
            locationIndex={locationIndex}
            onOpenShakhaPage={openShakhaPage}
            onSearchLocation={searchLocation}
          />
          <WhoCanJoin />
          <Contact />
        </>
      ) : (
        <>
          <section className="pt-24 pb-6 lg:pt-28" style={{ background: '#FDF6ED' }}>
            <div className="max-w-[86rem] mx-auto px-2 sm:px-3 lg:px-4">
              <button
                onClick={() => scrollTo('home')}
                className="mb-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: '#1B3A6B' }}
              >
                <span>←</span>
                <span>Back to Home</span>
              </button>
              <h1 className="font-display text-[2rem] sm:text-[2.5rem] lg:text-[2.9rem] font-bold" style={{ color: '#0b1a32' }}>
                Register Your Interest
              </h1>
              <p className="mt-3 text-sm sm:text-base max-w-2xl leading-6" style={{ color: '#5a6f9a' }}>
                Complete this form and local volunteers will connect you with the nearest HSS Shakha.
              </p>
            </div>
          </section>
          <section id="register" className="py-16 lg:py-20" style={{ background: '#FDF6ED' }}>
            <div className="max-w-[86rem] mx-auto px-2 sm:px-3 lg:px-4">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,0.9fr)] items-start">
                <div className="rounded-[1.75rem] border p-5 sm:p-6 lg:p-7 bg-white/50" style={{ borderColor: '#eadfce' }}>
                  <RegisterForm
                    standalone={false}
                    locationIndex={locationIndex}
                    onRegister={handleInterestRegister}
                    loadLocationShakhas={searchLocation}
                  />
                </div>
                <aside className="rounded-[1.75rem] p-5 sm:p-6 lg:sticky lg:top-24" style={{ background: '#1B3A6B' }}>
                  <Contact standalone={false} />
                </aside>
              </div>
            </div>
          </section>
        </>
      )}
      <Footer onNav={scrollTo} />
    </div>
  )
}
