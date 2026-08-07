import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const shakhaDataFile = path.join(projectRoot, 'src', 'shakhaData.ts')
const publicDir = path.join(projectRoot, 'public')
const publicDataDir = path.join(publicDir, 'shakha-data')
const socialDir = path.join(publicDir, 'social')
const stateDataDir = path.join(publicDataDir, 'states')
const slugDataDir = path.join(publicDataDir, 'slugs')
const manifestFile = path.join(publicDir, '.generated-shakha-pages.json')
const shakhaOverridesFile = path.join(projectRoot, 'src', 'shakhaOverrides.json')
const siteBannerSource = path.join(projectRoot, 'src', 'imports', '4EC6908E-FA0A-4A98-BEA2-169574B8DF4C.png')
const shakhaBannerSource = path.join(projectRoot, 'src', 'imports', 'DA8EA940-C9A9-4F9C-B405-14103451AAAD.PNG')

const siteUrl = (process.env.SITE_URL ?? 'https://join.shakhasewasetu.com').replace(/\/$/, '')
const countrySlug = slugify(process.env.COUNTRY_SLUG ?? 'usa') || 'usa'

const shareMessage = `🚩 Join HSS Shakha - Build Yourself, Build Society

Discover a weekly gathering that promotes physical fitness, leadership, Hindu values, discipline, and community service for individuals and families of all ages.

🏃 Physical Fitness • 🧘 Yoga • 🤝 Brotherhood • 🌺 Culture • ❤️ Seva

📍 Find an HSS Shakha near you and become part of a growing community.

Strong Individuals • Strong Families • Strong Society

👉 Find Your Nearest Shakha`

function buildShakhaId(state, city, name) {
  return `${String(state).trim()}|${String(city).trim()}|${String(name).trim()}`
}

async function readOverrides() {
  try {
    const raw = await fs.readFile(shakhaOverridesFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getOverride(overrides, state, city, name) {
  const id = buildShakhaId(state, city, name)
  return overrides.find(override => override.id === id)
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function extractZip(address) {
  const match = String(address).match(/\d{5}/)
  return match ? match[0] : '00000'
}

function parseShakhaData(source) {
  const match = source.match(/export const SHAKHA_DATA:[^=]*= (\{[\s\S]*\})\n\nexport const US_STATES/m)
  if (!match) {
    throw new Error('Unable to parse SHAKHA_DATA from src/shakhaData.ts')
  }

  return JSON.parse(match[1])
}

function buildRows(shakhaData) {
  const rows = []
  for (const [state, cityMap] of Object.entries(shakhaData)) {
    for (const [city, shakhas] of Object.entries(cityMap)) {
      for (const shakha of shakhas) {
        rows.push({
          id: buildShakhaId(state, city, shakha.name),
          state,
          city,
          name: shakha.name,
          address: shakha.address,
          day: shakha.day,
          time: shakha.time,
          timing: shakha.timing,
          detailUrl: shakha.detailUrl,
        })
      }
    }
  }
  return rows
}

function buildStaticRecord(state, city, shakha, override) {
  const baseRecord = {
    id: `${state}|${city}|${shakha.name}`,
    name: shakha.name,
    address: shakha.address,
    state,
    city,
    vibhag: '',
    bhag: '',
    zipCode: extractZip(shakha.address),
    mapLink: shakha.detailUrl,
    day: shakha.day,
    time: shakha.time,
    contacts: [
      { name: '', mobile: '', email: '' },
      { name: '', mobile: '', email: '' },
      { name: '', mobile: '', email: '' },
    ],
  }

  return {
    ...baseRecord,
    ...(override?.record ?? {}),
    contacts: override?.record?.contacts ?? baseRecord.contacts,
  }
}

async function writePublicSearchData(shakhaData, overrides) {
  await fs.rm(publicDataDir, { recursive: true, force: true })
  await fs.mkdir(stateDataDir, { recursive: true })
  await fs.mkdir(slugDataDir, { recursive: true })

  const locationIndex = {}
  const usedSlugs = new Set()

  for (const [state, cityMap] of Object.entries(shakhaData)) {
    locationIndex[state] = Object.keys(cityMap).sort((left, right) => left.localeCompare(right))

    const stateDir = path.join(stateDataDir, slugify(state) || 'state')
    await fs.mkdir(stateDir, { recursive: true })

    for (const [city, shakhas] of Object.entries(cityMap)) {
      const records = shakhas.map(shakha => buildStaticRecord(state, city, shakha, getOverride(overrides, state, city, shakha.name)))
      await fs.writeFile(
        path.join(stateDir, `${slugify(city) || 'city'}.json`),
        JSON.stringify(records, null, 2),
        'utf8',
      )

      for (const shakha of shakhas) {
        const zip = extractZip(shakha.address)
        const nameSlug = slugify(shakha.name) || 'shakha'
        const baseSlug = `${countrySlug}-${zip}-${nameSlug}`
        const slug = getUniqueSlug(baseSlug, usedSlugs)
        const override = getOverride(overrides, state, city, shakha.name)

        await fs.writeFile(
          path.join(slugDataDir, `${slug}.json`),
          JSON.stringify(buildStaticRecord(state, city, shakha, override), null, 2),
          'utf8',
        )
      }
    }
  }

  await fs.writeFile(path.join(publicDataDir, 'locations.json'), JSON.stringify(locationIndex, null, 2), 'utf8')
}

function getUniqueSlug(baseSlug, usedSlugs) {
  if (!usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug)
    return baseSlug
  }

  let index = 2
  while (usedSlugs.has(`${baseSlug}-${index}`)) {
    index += 1
  }

  const unique = `${baseSlug}-${index}`
  usedSlugs.add(unique)
  return unique
}

function buildPageHtml(row, slug, override) {
  const url = `${siteUrl}/${slug}`
  const title = override?.shareTitle || `${row.name} | Shakha Sewa Setu`
  const description = override?.shareDescription || `${shareMessage} ${row.city}, ${row.state}.`
  const pageMessage = override?.shareMessage || shareMessage
  const image = `${siteUrl}/assets/usa-07733-sri-krishna-shakha.png`
  const contacts = row.contacts.filter(contact => contact.name || contact.mobile || contact.email)

  const isSpecialShakha = slug === 'usa-07733-sri-krishna-shakha'
  const profileImage = isSpecialShakha ? '/assets/usa-07733-sri-krishna-shakha.png' : ''

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <style>
      :root { --saffron: #d4531a; --saffron-dark: #c2410c; --navy: #1b3a6b; --ink: #132f5d; --muted: #5a6f9a; --bg: #ffffff; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--ink); }
      .wrap { max-width: 1480px; margin: 0 auto; padding: 18px 12px 40px; }
      .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
      .badge { background: rgba(212,83,26,0.14); color: var(--saffron); border: 1px solid rgba(212,83,26,0.34); border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
      .cta { text-decoration: none; background: linear-gradient(135deg, #d4531a, #c2410c); color: #fff; padding: 10px 14px; border-radius: 10px; font-weight: 700; font-size: 14px; }
      .shell { border: 1px solid #e7e9ee; border-radius: 18px; overflow: hidden; background: #fff; }
      .hero-banner { position: relative; background: #fff; border-bottom: 1px solid #eef1f6; }
      .hero-banner img { display: block; width: 100%; max-height: 540px; object-fit: cover; }
      .hero-head { padding: 0 14px 14px; }
      .hero-row { margin-top: -48px; display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px; }
      .profile-wrap { display: flex; align-items: flex-end; gap: 14px; }
      .profile-pic { width: 90px; height: 90px; border-radius: 999px; border: 4px solid #fff; background: #fff; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.12); display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; color: #fff; background-image: linear-gradient(135deg, #D4531A, #c2410c); flex-shrink: 0; }
      .profile-pic img { width: 100%; height: 100%; object-fit: cover; }
      .profile-fallback { pointer-events: none; }
      h1 { margin: 0; font-size: 26px; line-height: 1.12; color: #132f5d; }
      .sub { color: var(--muted); margin: 8px 0 0; font-size: 15px; }
      .actions { display: flex; flex-wrap: wrap; gap: 8px; }
      .action { text-decoration: none; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 700; text-align: center; flex: 1 1 0; min-width: 0; }
      .action-primary { color: #fff; background: linear-gradient(135deg, #D4531A, #c2410c); }
      .action-secondary { color: #1B3A6B; border: 1px solid #1B3A6B; }
      .content { padding: 16px; }
      .layout { display: grid; gap: 14px; grid-template-columns: 1fr; }
      .panel { border: 1px solid #eceff4; border-radius: 14px; background: #fff; padding: 14px; }
      .panel-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; border-bottom: 1px solid #f1f4f8; padding-bottom: 10px; }
      h2 { margin: 0; font-size: 24px; color: #132f5d; }
      .msg { margin-top: 12px; white-space: pre-line; color: #1e3761; line-height: 1.7; font-size: 15px; }
      .grid { margin-top: 10px; display: grid; grid-template-columns: 1fr; gap: 10px; }
      .box { border: 1px solid #eceff4; border-radius: 12px; padding: 12px; background: #fff; }
      .label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6a7da3; font-weight: 700; }
      .value { margin-top: 4px; font-size: 14px; color: #1e3761; line-height: 1.5; }
      .contact-grid { margin-top: 10px; display: grid; gap: 10px; grid-template-columns: 1fr; }
      .footer { margin-top: 16px; color: #7082a8; font-size: 12px; }
      @media (min-width: 780px) {
        .hero-head { padding: 0 18px 16px; }
        .hero-row { margin-top: -60px; gap: 14px; }
        .profile-pic { width: 110px; height: 110px; font-size: 44px; }
        h1 { font-size: 34px; }
        .action { flex: 0 0 auto; }
        .grid { grid-template-columns: repeat(3,minmax(0,1fr)); }
      }
      @media (min-width: 1024px) {
        .hero-row { margin-top: -64px; gap: 16px; }
        .profile-pic { width: 120px; height: 120px; font-size: 48px; }
        h1 { font-size: 40px; }
        .layout { grid-template-columns: 1.45fr 1fr; }
        .content { padding: 18px; }
        .contact-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <div class="top">
        <span class="badge">HSS Shakha Page</span>
        <a class="cta" href="${siteUrl}/register">Register Interest</a>
      </div>

      <section class="shell">
        <div class="hero-banner">
          <img src="/assets/usa-07733-sri-krishna-shakha.png" alt="${escapeHtml(row.name)} banner" />
          <div class="hero-head">
            <div class="hero-row">
              <div class="profile-wrap">
                <div class="profile-pic">
                  ${profileImage
                    ? `<span class="profile-fallback">${escapeHtml(row.name.charAt(0))}</span><img src="${profileImage}" alt="${escapeHtml(row.name)} profile" onload="this.previousElementSibling.style.display='none'" onerror="this.remove()" />`
                    : escapeHtml(row.name.charAt(0))}
                </div>
                <div>
                  <h1>${escapeHtml(row.name)}</h1>
                  <p class="sub">${escapeHtml(row.state)} &gt;&gt; ${escapeHtml(row.city)} &gt;&gt; ${escapeHtml(row.name)}</p>
                </div>
              </div>

              <div class="actions">
                <a class="action action-primary" href="${siteUrl}/register">Register Interest</a>
                ${(row.detailUrl || row.mapLink)
                  ? `<a class="action action-secondary" href="${escapeHtml(row.detailUrl || row.mapLink)}" target="_blank" rel="noreferrer">Open Map Link</a>`
                  : ''}
              </div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="layout">
            <div class="panel">
              <div class="panel-head">
                <h2>Shakha Announcement</h2>
                <span class="badge">Community Update</span>
              </div>
              <div class="msg">${escapeHtml(pageMessage)}</div>
            </div>

            <div>
              <div class="box">
                <div class="label">Address</div>
                <div class="value">${escapeHtml(row.address || 'Not available')}</div>
              </div>
              <div class="box">
                <div class="label">Schedule</div>
                <div class="value">${escapeHtml(row.day || 'Weekly')}<br/>${escapeHtml(row.time || 'Please contact volunteer')}</div>
              </div>
              <div class="box">
                <div class="label">More Details</div>
                <div class="value">${(row.detailUrl || row.mapLink) ? `<a href="${escapeHtml(row.detailUrl || row.mapLink)}" target="_blank" rel="noreferrer">Open map/details</a>` : 'Not available'}</div>
              </div>
            </div>
          </div>

          ${contacts.length > 0 ? `<div class="contact-grid">${contacts.map((contact, index) => `<div class="box"><div class="label">Contact ${index + 1}</div><div class="value">${escapeHtml(contact.name || 'Not provided')}<br/>${escapeHtml(contact.mobile || 'Not provided')}</div></div>`).join('')}</div>` : ''}

          <p class="footer">This page is generated for sharing links in WhatsApp, email, and messages. For full portal experience, use <a href="${siteUrl}/register">${siteUrl}/register</a>.</p>
        </div>
      </section>
    </main>
  </body>
</html>
`
}

async function copySocialImages() {
  await fs.mkdir(socialDir, { recursive: true })
  await fs.copyFile(siteBannerSource, path.join(socialDir, 'site-banner.png'))
  await fs.copyFile(shakhaBannerSource, path.join(socialDir, 'shakha-banner.png'))
}

async function readManifest() {
  try {
    const raw = await fs.readFile(manifestFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed?.slugs) ? parsed.slugs : []
  } catch {
    return []
  }
}

async function cleanOldPages(oldSlugs) {
  for (const slug of oldSlugs) {
    const dirPath = path.join(publicDir, slug)
    await fs.rm(dirPath, { recursive: true, force: true })
  }
}

async function ensureFallbackPage() {
  const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirecting to Register</title>
    <meta http-equiv="refresh" content="0;url=/register" />
    <script>window.location.replace('/register')</script>
  </head>
  <body>
    <p>Redirecting to <a href="/register">/register</a> ...</p>
  </body>
</html>
`

  await fs.writeFile(path.join(publicDir, '404.html'), fallbackHtml, 'utf8')
}

async function main() {
  await fs.mkdir(publicDir, { recursive: true })
  await copySocialImages()

  const source = await fs.readFile(shakhaDataFile, 'utf8')
  const data = parseShakhaData(source)
  const rows = buildRows(data)
  const overrides = await readOverrides()

  await writePublicSearchData(data, overrides)

  const oldSlugs = await readManifest()
  await cleanOldPages(oldSlugs)

  const usedSlugs = new Set()
  const newSlugs = []

  for (const row of rows) {
    const zip = extractZip(row.address)
    const nameSlug = slugify(row.name) || 'shakha'
    const baseSlug = `${countrySlug}-${zip}-${nameSlug}`
    const slug = getUniqueSlug(baseSlug, usedSlugs)
    newSlugs.push(slug)
    const override = getOverride(overrides, row.state, row.city, row.name)
    const pageRow = buildStaticRecord(row.state, row.city, row, override)

    const pageDir = path.join(publicDir, slug)
    await fs.mkdir(pageDir, { recursive: true })
    await fs.writeFile(path.join(pageDir, 'index.html'), buildPageHtml(pageRow, slug, override), 'utf8')
  }

  await fs.writeFile(manifestFile, JSON.stringify({ generatedAt: new Date().toISOString(), slugs: newSlugs }, null, 2), 'utf8')
  await ensureFallbackPage()

  console.log(`Generated ${newSlugs.length} share pages in public/`) 
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
