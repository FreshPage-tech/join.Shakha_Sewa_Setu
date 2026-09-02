import { hasSupabaseConfig, supabase } from './supabaseClient'
import { applyShakhaOverride, mergeLocationIndexes, mergeShakhaRecords } from './shakhaOverrides'
import { normalizeShakhaRecord, normalizeShakhaRecords } from './shakhaRuntime'
import type { InterestedPersonRecord, ShakhaLeader, ShakhaLocationIndex, ShakhaRecord } from './shakhaTypes'

type SupabaseShakhaRow = {
  id: string
  name: string
  address: string
  state: string
  city: string
  vibhag: string | null
  bhag: string | null
  zip_code: string | null
  map_link: string | null
  day: string | null
  time: string | null
  banner_url: string | null
  profile_image_url: string | null
  leaders: ShakhaLeader[] | null
  contact_1_name: string | null
  contact_1_mobile: string | null
  contact_1_email: string | null
  contact_2_name: string | null
  contact_2_mobile: string | null
  contact_2_email: string | null
  contact_3_name: string | null
  contact_3_mobile: string | null
  contact_3_email: string | null
}

const SHAKHA_DATA_BASE = `${import.meta.env.BASE_URL}shakha-data`.replace(/\/$/, '')

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getRecordSlug(record: ShakhaRecord): string {
  const zip = record.zipCode.match(/\d{5}/)?.[0] || record.address.match(/\d{5}/)?.[0] || '00000'
  return `${slugify(import.meta.env.VITE_COUNTRY_SLUG ?? 'usa')}-${zip}-${slugify(record.name)}`
}

function mapShakhaRow(row: SupabaseShakhaRow): ShakhaRecord {
  return normalizeShakhaRecord({
    id: row.id,
    name: row.name,
    address: row.address,
    state: row.state,
    city: row.city,
    vibhag: row.vibhag ?? '',
    bhag: row.bhag ?? '',
    zipCode: row.zip_code ?? '',
    mapLink: row.map_link ?? '',
    day: row.day ?? '',
    time: row.time ?? '',
    bannerUrl: row.banner_url ?? '',
    profileImageUrl: row.profile_image_url ?? '',
    contacts: [
      { name: row.contact_1_name ?? '', mobile: row.contact_1_mobile ?? '', email: row.contact_1_email ?? '' },
      { name: row.contact_2_name ?? '', mobile: row.contact_2_mobile ?? '', email: row.contact_2_email ?? '' },
      { name: row.contact_3_name ?? '', mobile: row.contact_3_mobile ?? '', email: row.contact_3_email ?? '' },
    ],
    leaders: Array.isArray(row.leaders) ? row.leaders : [],
  })
}

async function readStaticJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(path)
    if (!response.ok) {
      return fallback
    }

    return (await response.json()) as T
  } catch {
    return fallback
  }
}

function buildLocationIndex(rows: Array<{ state: string; city: string }>): ShakhaLocationIndex {
  const index: ShakhaLocationIndex = {}

  for (const row of rows) {
    const state = row.state.trim()
    const city = row.city.trim()

    if (!state || !city) {
      continue
    }

    index[state] ??= []
    if (!index[state].includes(city)) {
      index[state].push(city)
    }
  }

  for (const state of Object.keys(index)) {
    index[state].sort((left, right) => left.localeCompare(right))
  }

  return Object.fromEntries(
    Object.entries(index).sort(([left], [right]) => left.localeCompare(right)),
  )
}

export async function listPublicShakhaLocations(): Promise<ShakhaLocationIndex> {
  const staticLocations = await readStaticJson<ShakhaLocationIndex>(`${SHAKHA_DATA_BASE}/locations.json`, {})

  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('shakhas_admin')
      .select('state, city')
      .order('state', { ascending: true })
      .order('city', { ascending: true })

    if (!error && data && data.length > 0) {
      return mergeLocationIndexes(buildLocationIndex(data as Array<{ state: string; city: string }>), staticLocations)
    }
  }

  return staticLocations
}

export async function listPublicShakhaRecordsByLocation(state: string, city: string): Promise<ShakhaRecord[]> {
  const fallbackPath = `${SHAKHA_DATA_BASE}/states/${slugify(state)}/${slugify(city)}.json`
  const staticRecords = normalizeShakhaRecords(await readStaticJson<ShakhaRecord[]>(fallbackPath, []))

  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('shakhas_admin')
      .select('*')
      .eq('state', state)
      .eq('city', city)
      .order('name', { ascending: true })

    if (!error && data) {
      return mergeShakhaRecords([
        ...(data as SupabaseShakhaRow[]).map(mapShakhaRow),
        ...staticRecords,
      ])
    }
  }

  return mergeShakhaRecords(staticRecords)
}

export async function findPublicShakhaBySlug(slug: string): Promise<ShakhaRecord | null> {
  const staticRecord = await readStaticJson<ShakhaRecord | null>(`${SHAKHA_DATA_BASE}/slugs/${slug}.json`, null)

  if (hasSupabaseConfig) {
    const { data, error } = await supabase.from('shakhas_admin').select('*')
    if (!error && data) {
      const dynamicRecord = (data as SupabaseShakhaRow[])
        .map(mapShakhaRow)
        .find(record => getRecordSlug(record) === slug)
      if (dynamicRecord) {
        return applyShakhaOverride(dynamicRecord)
      }
    }
  }

  return staticRecord ? applyShakhaOverride(normalizeShakhaRecord(staticRecord)) : null
}

export async function submitInterestedPerson(
  payload: Omit<InterestedPersonRecord, 'id' | 'createdAt'>,
): Promise<void> {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env and restart the app.')
  }

  const { error } = await supabase.from('interested_people').insert({
    first_name: payload.firstName,
    last_name: payload.lastName,
    email: payload.email,
    mobile: payload.mobile,
    age: payload.age || null,
    gender: payload.gender || null,
    occupation: payload.occupation || null,
    state: payload.state,
    city: payload.city,
    zip: payload.zip,
    preferred_distance: payload.preferredDistance || null,
    interests: payload.interests,
    selected_shakha: payload.selectedShakha || null,
    no_shakha_nearby: payload.noShakhaNearby,
    preferred_day: payload.preferredDay || null,
    comments: payload.comments || null,
  })

  if (error) {
    throw error
  }
}
