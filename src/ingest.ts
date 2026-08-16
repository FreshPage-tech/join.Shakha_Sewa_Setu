import { createClient } from '@supabase/supabase-js'
import { scrapeShakhas } from './scraper.js'
import type { ScrapedShakha, ShakhaRow } from './shakhaScraperTypes.js'

const DEFAULT_BATCH_SIZE = 500

function requiredEnvironment(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

function chunks<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) =>
    items.slice(index * size, (index + 1) * size),
  )
}

export async function ingestShakhas(records: ScrapedShakha[]): Promise<number> {
  if (records.length === 0) {
    console.log('[ingest] No records to save')
    return 0
  }

  const batchSize = Number(process.env.SUPABASE_BATCH_SIZE ?? DEFAULT_BATCH_SIZE)
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 1_000) {
    throw new Error('SUPABASE_BATCH_SIZE must be an integer between 1 and 1000')
  }

  const supabase = createClient(requiredEnvironment('SUPABASE_URL'), requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const updatedAt = new Date().toISOString()
  const rows: ShakhaRow[] = records.map(record => ({ ...record, updated_at: updatedAt }))
  let saved = 0

  for (const [index, batch] of chunks(rows, batchSize).entries()) {
    const { data, error } = await supabase
      .from('shakhas')
      .upsert(batch, { onConflict: 'shakha_name,city,country', ignoreDuplicates: false })
      .select('id')

    if (error) throw new Error(`Batch ${index + 1} failed: ${error.message}`)
    saved += data.length
    console.log(`[ingest] Batch ${index + 1}: saved ${data.length} records (${saved}/${records.length})`)
  }

  console.log(`[ingest] Parsed ${records.length} records; saved ${saved} records`)
  return saved
}

async function main(): Promise<void> {
  const records = await scrapeShakhas()
  await ingestShakhas(records)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('[ingest] Fatal error:', error)
    process.exitCode = 1
  })
}
