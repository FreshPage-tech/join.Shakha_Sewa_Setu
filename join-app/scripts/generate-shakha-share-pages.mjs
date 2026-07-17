import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const shakhaDataFile = path.join(projectRoot, 'src', 'shakhaData.ts')
const publicDir = path.join(projectRoot, 'public')
const manifestFile = path.join(publicDir, '.generated-shakha-pages.json')

const siteUrl = (process.env.SITE_URL ?? 'https://join.shakhasewasetu.com').replace(/\/$/, '')
const countrySlug = slugify(process.env.COUNTRY_SLUG ?? 'usa') || 'usa'

const shareMessage = `🚩 Join HSS Shakha - Build Yourself, Build Society

Discover a weekly gathering that promotes physical fitness, leadership, Hindu values, discipline, and community service for individuals and families of all ages.

🏃 Physical Fitness • 🧘 Yoga • 🤝 Brotherhood • 🌺 Culture • ❤️ Seva

📍 Find an HSS Shakha near you and become part of a growing community.

Strong Individuals • Strong Families • Strong Society

👉 Find Your Nearest Shakha`

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

function buildPageHtml(row, slug) {
  const url = `${siteUrl}/${slug}`
  const title = `${row.name} | HSS Shakha`
  const description = `${shareMessage} ${row.city}, ${row.state}.`

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
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <style>
      :root { --saffron: #d4531a; --navy: #1b3a6b; --ink: #0b1a32; --muted: #5a6f9a; --bg: #fdf6ed; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--ink); }
      .wrap { max-width: 980px; margin: 0 auto; padding: 24px 14px 40px; }
      .top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px; }
      .badge { background: rgba(212,83,26,0.14); color: var(--saffron); border: 1px solid rgba(212,83,26,0.34); border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
      .cta { text-decoration: none; background: linear-gradient(135deg, #d4531a, #c2410c); color: #fff; padding: 10px 14px; border-radius: 10px; font-weight: 700; font-size: 14px; }
      .card { background: #fffdf8; border: 1px solid #eadfce; border-radius: 18px; padding: 22px; }
      h1 { margin: 0 0 4px; font-size: 30px; line-height: 1.15; color: #132f5d; }
      .sub { color: var(--muted); margin: 0 0 16px; font-size: 15px; }
      .msg { white-space: pre-line; background: rgba(212,83,26,0.06); border: 1px solid rgba(212,83,26,0.24); border-radius: 14px; padding: 16px; color: #1e3761; line-height: 1.7; }
      .grid { margin-top: 16px; display: grid; grid-template-columns: repeat(1,minmax(0,1fr)); gap: 10px; }
      .box { border: 1px solid #ede5d8; border-radius: 12px; padding: 12px; background: #fff; }
      .label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6a7da3; font-weight: 700; }
      .value { margin-top: 4px; font-size: 14px; color: #1e3761; line-height: 1.5; }
      .footer { margin-top: 16px; color: #7082a8; font-size: 12px; }
      @media (min-width: 780px) { .grid { grid-template-columns: repeat(3,minmax(0,1fr)); } }
    </style>
  </head>
  <body>
    <main class="wrap">
      <div class="top">
        <span class="badge">HSS Shakha Page</span>
        <a class="cta" href="${siteUrl}/register">Register Interest</a>
      </div>

      <section class="card">
        <h1>${escapeHtml(row.name)}</h1>
        <p class="sub">${escapeHtml(row.city)}, ${escapeHtml(row.state)}</p>

        <div class="msg">${escapeHtml(shareMessage)}</div>

        <div class="grid">
          <div class="box">
            <div class="label">Address</div>
            <div class="value">${escapeHtml(row.address || 'Not available')}</div>
          </div>
          <div class="box">
            <div class="label">Day & Time</div>
            <div class="value">${escapeHtml(row.day || 'Weekly')}<br/>${escapeHtml(row.time || 'Please contact volunteer')}</div>
          </div>
          <div class="box">
            <div class="label">More Details</div>
            <div class="value">${row.detailUrl ? `<a href="${escapeHtml(row.detailUrl)}" target="_blank" rel="noreferrer">Open map/details</a>` : 'Not available'}</div>
          </div>
        </div>

        <p class="footer">This page is generated for sharing links in WhatsApp, email, and messages. For full portal experience, use <a href="${siteUrl}/register">${siteUrl}/register</a>.</p>
      </section>
    </main>
  </body>
</html>
`
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

  const source = await fs.readFile(shakhaDataFile, 'utf8')
  const data = parseShakhaData(source)
  const rows = buildRows(data)

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

    const pageDir = path.join(publicDir, slug)
    await fs.mkdir(pageDir, { recursive: true })
    await fs.writeFile(path.join(pageDir, 'index.html'), buildPageHtml(row, slug), 'utf8')
  }

  await fs.writeFile(manifestFile, JSON.stringify({ generatedAt: new Date().toISOString(), slugs: newSlugs }, null, 2), 'utf8')
  await ensureFallbackPage()

  console.log(`Generated ${newSlugs.length} share pages in public/`) 
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
