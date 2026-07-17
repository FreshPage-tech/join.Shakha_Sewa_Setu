import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const shakhaDataFile = path.join(projectRoot, 'src', 'shakhaData.ts')

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
          name: shakha.name,
          address: shakha.address,
          state,
          city,
          vibhag: null,
          bhag: null,
          zip_code: null,
          map_link: shakha.detailUrl || null,
          day: shakha.day || null,
          time: shakha.time || null,
          contact_1_name: null,
          contact_1_mobile: null,
          contact_1_email: null,
          contact_2_name: null,
          contact_2_mobile: null,
          contact_2_email: null,
          contact_3_name: null,
          contact_3_mobile: null,
          contact_3_email: null,
        })
      }
    }
  }

  return rows
}

async function insertInChunks(supabase, rows, chunkSize = 500) {
  let inserted = 0
  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize)
    const { error } = await supabase.from('shakhas_admin').insert(chunk)
    if (error) {
      throw error
    }
    inserted += chunk.length
    console.log(`Inserted ${inserted}/${rows.length}`)
  }
}

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Missing SUPABASE_URL (or VITE_SUPABASE_URL)')
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  const shouldReplace = !process.argv.includes('--append')

  const fileContent = await fs.readFile(shakhaDataFile, 'utf8')
  const shakhaData = parseShakhaData(fileContent)
  const rows = buildRows(shakhaData)

  if (rows.length === 0) {
    throw new Error('No rows found to seed')
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  if (shouldReplace) {
    console.log('Replacing existing rows in shakhas_admin...')
    const { error } = await supabase.from('shakhas_admin').delete().not('id', 'is', null)
    if (error) {
      throw error
    }
  } else {
    console.log('Appending rows to shakhas_admin...')
  }

  await insertInChunks(supabase, rows)

  console.log('Seeding completed successfully.')
  console.log(`Total rows processed: ${rows.length}`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
