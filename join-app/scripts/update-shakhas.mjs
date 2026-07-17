import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const outputFile = path.join(projectRoot, 'src', 'shakhaData.ts')

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#038;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function stripTags(value) {
  return normalizeWhitespace(decodeHtml(value.replace(/<[^>]*>/g, ' ')))
}

function parseCity(address) {
  return address.replace(/\s+[A-Z]{2,3}$/u, '').trim() || address.trim()
}

function parseTiming(timing) {
  const normalized = normalizeWhitespace(timing)
  const match = normalized.match(/^(.*?)\s+from\s+(.+)$/i)

  if (!match) {
    return { day: normalized, time: '' }
  }

  return {
    day: match[1].trim(),
    time: match[2].trim(),
  }
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; ShakhaDataUpdater/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }

  return await response.text()
}

function extractStates(html) {
  const optionRegex = /<option value="([^"]+)"\s*>/g
  const states = []

  for (const match of html.matchAll(optionRegex)) {
    const state = normalizeWhitespace(decodeHtml(match[1]))
    if (state && !states.includes(state)) {
      states.push(state)
    }
  }

  return states
}

function extractChapters(html, state) {
  const cardRegex = /<div class="card">[\s\S]*?<a target="_blank" href="([^"]*chapter-detail\/\?username=[^"]+)">[\s\S]*?<div class="c-name">([\s\S]*?)<a class="marker-icon"[\s\S]*?<div class="c-add">([^<]+)<\/div>[\s\S]*?<div class="c-timings">([^<]+)<\/div>/g
  const cityMap = {}

  for (const match of html.matchAll(cardRegex)) {
    const detailUrl = decodeHtml(match[1]).trim()
    const name = stripTags(match[2])
    const address = stripTags(match[3])
    const timing = stripTags(match[4])
    const city = parseCity(address)
    const { day, time } = parseTiming(timing)

    if (!name || !city) {
      continue
    }

    cityMap[city] ??= []
    cityMap[city].push({
      name,
      city,
      state,
      address,
      day,
      time,
      timing,
      detailUrl,
    })
  }

  return Object.fromEntries(
    Object.entries(cityMap)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([city, chapters]) => [
        city,
        chapters.sort((left, right) => left.name.localeCompare(right.name)),
      ]),
  )
}

function buildSource(data) {
  return `export type ShakhaChapter = {
  name: string
  city: string
  state: string
  address: string
  day: string
  time: string
  timing: string
  detailUrl: string
}

export const SHAKHA_DATA: Record<string, Record<string, ShakhaChapter[]>> = ${JSON.stringify(data, null, 2)}

export const US_STATES = Object.keys(SHAKHA_DATA)
`
}

async function main() {
  const baseHtml = await fetchHtml('https://www.hssus.org/chapters/')
  const states = extractStates(baseHtml)
  const shakhaData = {}

  for (const state of states) {
    const stateUrl = `https://www.hssus.org/chapters/?state_name=${encodeURIComponent(state)}`
    const html = await fetchHtml(stateUrl)
    const chapters = extractChapters(html, state)

    if (Object.keys(chapters).length > 0) {
      shakhaData[state] = chapters
    }
  }

  await fs.writeFile(outputFile, buildSource(shakhaData), 'utf8')

  const stateCount = Object.keys(shakhaData).length
  const chapterCount = Object.values(shakhaData)
    .flatMap(cityMap => Object.values(cityMap))
    .reduce((total, chapters) => total + chapters.length, 0)

  console.log(`Generated ${outputFile}`)
  console.log(`States: ${stateCount}`)
  console.log(`Chapters: ${chapterCount}`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})