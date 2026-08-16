import { chromium, type Locator, type Page } from 'playwright'
import type { ScrapedShakha } from './shakhaScraperTypes.js'

const DEFAULT_SOURCE_URL = 'https://join.shakhasewasetu.com/shakha'
const DEFAULT_CARD_SELECTORS = [
  '[data-shakha-card]',
  '.shakha-card',
  '.chapter-card',
  'article',
  '.directory-listing',
]

const FIELD_SELECTORS = {
  shakha_name: ['[data-field="shakha-name"]', '.shakha-name', '.chapter-name', 'h2', 'h3'],
  state_or_region: ['[data-field="state"]', '.state', '.region'],
  city: ['[data-field="city"]', '.city'],
  address: ['[data-field="address"]', '.address', 'address'],
  contact_person: ['[data-field="contact-person"]', '.contact-person', '.contact-name'],
  contact_phone: ['[data-field="phone"]', '.phone', 'a[href^="tel:"]'],
} as const

const LABELS = {
  state_or_region: ['state', 'region'],
  city: ['city'],
  address: ['address', 'location'],
  contact_person: ['contact person', 'contact', 'coordinator'],
  contact_phone: ['phone', 'mobile', 'telephone'],
} as const

export type ScraperOptions = {
  sourceUrl?: string
  cardSelector?: string
  nextSelector?: string
  country?: string
  maxPages?: number
  navigationTimeoutMs?: number
  headless?: boolean
}

export function cleanText(value: string | null | undefined): string | null {
  const cleaned = value?.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned || null
}

export function cleanPhone(value: string | null | undefined): string | null {
  const text = cleanText(value)
  if (!text) return null

  const extension = text.match(/(?:ext\.?|x)\s*(\d+)\b/i)?.[1]
  const hasLeadingPlus = /^\s*\+/.test(text)
  const digits = text.replace(/(?:ext\.?|x)\s*\d+\b/i, '').replace(/\D/g, '')
  if (digits.length < 7) return null

  return `${hasLeadingPlus ? '+' : ''}${digits}${extension ? ` x${extension}` : ''}`
}

async function safeText(root: Locator, selectors: readonly string[]): Promise<string | null> {
  for (const selector of selectors) {
    try {
      const element = root.locator(selector).first()
      if ((await element.count()) > 0) {
        const value = selector.includes('href^="tel:"')
          ? (await element.getAttribute('href'))?.replace(/^tel:/i, '')
          : await element.textContent({ timeout: 2_000 })
        const cleaned = cleanText(value)
        if (cleaned) return cleaned
      }
    } catch (error) {
      console.warn(`[scraper] Optional selector ${selector} failed:`, error)
    }
  }
  return null
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function labeledValue(rawText: string, labels: readonly string[]): string | null {
  const allLabels = Object.values(LABELS).flat()
  const nextLabel = allLabels.map(escapeRegExp).join('|')
  for (const label of labels) {
    const pattern = new RegExp(
      `(?:^|[\\n|])\\s*${escapeRegExp(label)}\\s*:?\\s*(.+?)(?=[\\n|]\\s*(?:${nextLabel})\\s*:|$)`,
      'i',
    )
    const match = rawText.match(pattern)
    const value = cleanText(match?.[1])
    if (value) return value
  }
  return null
}

async function extractCard(card: Locator, page: Page, country: string): Promise<ScrapedShakha | null> {
  try {
    const rawText = (await card.innerText({ timeout: 5_000 })).replace(/\r/g, '')
    const shakhaName = await safeText(card, FIELD_SELECTORS.shakha_name)
    if (!shakhaName) {
      console.warn('[scraper] Skipping a card without a shakha name')
      return null
    }

    const href = await card.locator('a[href]').first().getAttribute('href').catch(() => null)
    const sourceUrl = href ? new URL(href, page.url()).toString() : page.url()
    const state = (await safeText(card, FIELD_SELECTORS.state_or_region)) ?? labeledValue(rawText, LABELS.state_or_region)
    const city = (await safeText(card, FIELD_SELECTORS.city)) ?? labeledValue(rawText, LABELS.city)
    const address = (await safeText(card, FIELD_SELECTORS.address)) ?? labeledValue(rawText, LABELS.address)
    const contactPerson =
      (await safeText(card, FIELD_SELECTORS.contact_person)) ?? labeledValue(rawText, LABELS.contact_person)
    const phoneText =
      (await safeText(card, FIELD_SELECTORS.contact_phone)) ?? labeledValue(rawText, LABELS.contact_phone)

    return {
      shakha_name: shakhaName,
      country,
      state_or_region: state,
      city,
      address,
      contact_person: contactPerson,
      contact_phone: cleanPhone(phoneText),
      source_url: sourceUrl,
    }
  } catch (error) {
    console.warn('[scraper] Skipping an unreadable card:', error)
    return null
  }
}

async function resolveCardSelector(page: Page, configured?: string): Promise<string> {
  const selectors = configured ? [configured] : DEFAULT_CARD_SELECTORS
  for (const selector of selectors) {
    try {
      if ((await page.locator(selector).count()) > 0) return selector
    } catch (error) {
      console.warn(`[scraper] Card selector ${selector} failed:`, error)
    }
  }
  throw new Error(`No directory cards found. Set SHAKHA_CARD_SELECTOR for this site's markup.`)
}

async function goToNextPage(page: Page, configuredSelector?: string): Promise<boolean> {
  const candidates = configuredSelector
    ? [page.locator(configuredSelector).first()]
    : [
        page.getByRole('link', { name: /next/i }).first(),
        page.getByRole('button', { name: /next/i }).first(),
        page.locator('a[rel="next"], [aria-label*="next" i], .pagination .next').first(),
      ]

  for (const next of candidates) {
    try {
      if ((await next.count()) === 0 || !(await next.isVisible()) || !(await next.isEnabled())) continue
      const disabled = (await next.getAttribute('aria-disabled')) === 'true' || (await next.getAttribute('disabled')) !== null
      if (disabled) return false

      const oldUrl = page.url()
      const oldBody = await page.locator('body').innerText()
      await next.click()
      await page
        .waitForFunction(
          ({ previousUrl, previousBody }) => location.href !== previousUrl || document.body.innerText !== previousBody,
          { previousUrl: oldUrl, previousBody: oldBody },
          { timeout: 30_000 },
        )
        .catch(() => undefined)
      await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => undefined)
      return true
    } catch (error) {
      console.warn('[scraper] A pagination control failed; trying another:', error)
    }
  }
  return false
}

export async function scrapeShakhas(options: ScraperOptions = {}): Promise<ScrapedShakha[]> {
  const sourceUrl = options.sourceUrl ?? process.env.SHAKHA_SOURCE_URL ?? DEFAULT_SOURCE_URL
  const country = cleanText(options.country ?? process.env.SHAKHA_DEFAULT_COUNTRY) ?? 'USA'
  const maxPages = options.maxPages ?? Number(process.env.SHAKHA_MAX_PAGES ?? 100)
  if (!Number.isInteger(maxPages) || maxPages < 1) throw new Error('SHAKHA_MAX_PAGES must be a positive integer')

  const browser = await chromium.launch({ headless: options.headless ?? process.env.HEADLESS !== 'false' })
  const records = new Map<string, ScrapedShakha>()
  try {
    const context = await browser.newContext({ userAgent: 'ShakhaDirectorySync/1.0 (+directory data sync)' })
    const page = await context.newPage()
    page.setDefaultTimeout(options.navigationTimeoutMs ?? 30_000)
    await page.goto(sourceUrl, { waitUntil: 'networkidle', timeout: options.navigationTimeoutMs ?? 60_000 })

    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
      const cardSelector = await resolveCardSelector(page, options.cardSelector ?? process.env.SHAKHA_CARD_SELECTOR)
      await page.locator(cardSelector).first().waitFor({ state: 'visible' })
      const cards = page.locator(cardSelector)
      const count = await cards.count()
      console.log(`[scraper] Page ${pageNumber}: found ${count} candidate records`)

      for (let index = 0; index < count; index += 1) {
        const record = await extractCard(cards.nth(index), page, country)
        if (!record) continue
        const key = [record.shakha_name, record.city ?? '', record.country].map(value => value.toLocaleLowerCase()).join('\u0000')
        records.set(key, record)
      }

      if (pageNumber === maxPages || !(await goToNextPage(page, options.nextSelector ?? process.env.SHAKHA_NEXT_SELECTOR))) break
    }
  } finally {
    await browser.close()
  }

  const result = [...records.values()]
  console.log(`[scraper] Parsed ${result.length} unique records`)
  return result
}

async function main(): Promise<void> {
  const records = await scrapeShakhas()
  console.log(JSON.stringify(records, null, 2))
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('[scraper] Fatal error:', error)
    process.exitCode = 1
  })
}
