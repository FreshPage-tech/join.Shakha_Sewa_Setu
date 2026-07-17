import type { Session } from '@supabase/supabase-js'
import { SHAKHA_DATA } from './shakhaData'
import { supabase } from './supabaseClient'
import type { InterestedPersonRecord, ShakhaRecord } from './adminData'

type SupabaseShakhaRow = {
  id: string
  created_at: string
  updated_at: string
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

type SupabaseInterestedRow = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  age: string | null
  gender: string | null
  occupation: string | null
  state: string
  city: string
  zip: string
  preferred_distance: string | null
  interests: string[] | null
  selected_shakha: string | null
  no_shakha_nearby: boolean
  preferred_day: string | null
  comments: string | null
}

function defaultSeedShakhas(): ShakhaRecord[] {
  const rows: ShakhaRecord[] = []
  for (const [state, cityMap] of Object.entries(SHAKHA_DATA)) {
    for (const [city, shakhas] of Object.entries(cityMap)) {
      for (const shakha of shakhas) {
        rows.push({
          id: `${state}|${city}|${shakha.name}`,
          name: shakha.name,
          address: shakha.address,
          state,
          city,
          vibhag: '',
          bhag: '',
          zipCode: '',
          mapLink: shakha.detailUrl,
          day: shakha.day,
          time: shakha.time,
          contacts: [
            { name: '', mobile: '', email: '' },
            { name: '', mobile: '', email: '' },
            { name: '', mobile: '', email: '' },
          ],
        })
      }
    }
  }

  return rows
}

function mapShakhaRow(row: SupabaseShakhaRow): ShakhaRecord {
  return {
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
    contacts: [
      { name: row.contact_1_name ?? '', mobile: row.contact_1_mobile ?? '', email: row.contact_1_email ?? '' },
      { name: row.contact_2_name ?? '', mobile: row.contact_2_mobile ?? '', email: row.contact_2_email ?? '' },
      { name: row.contact_3_name ?? '', mobile: row.contact_3_mobile ?? '', email: row.contact_3_email ?? '' },
    ],
  }
}

function toShakhaRow(record: Omit<ShakhaRecord, 'id'>) {
  return {
    name: record.name,
    address: record.address,
    state: record.state,
    city: record.city,
    vibhag: record.vibhag || null,
    bhag: record.bhag || null,
    zip_code: record.zipCode || null,
    map_link: record.mapLink || null,
    day: record.day || null,
    time: record.time || null,
    contact_1_name: record.contacts[0]?.name || null,
    contact_1_mobile: record.contacts[0]?.mobile || null,
    contact_1_email: record.contacts[0]?.email || null,
    contact_2_name: record.contacts[1]?.name || null,
    contact_2_mobile: record.contacts[1]?.mobile || null,
    contact_2_email: record.contacts[1]?.email || null,
    contact_3_name: record.contacts[2]?.name || null,
    contact_3_mobile: record.contacts[2]?.mobile || null,
    contact_3_email: record.contacts[2]?.email || null,
  }
}

function mapInterestedRow(row: SupabaseInterestedRow): InterestedPersonRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    mobile: row.mobile,
    age: row.age ?? '',
    gender: row.gender ?? '',
    occupation: row.occupation ?? '',
    state: row.state,
    city: row.city,
    zip: row.zip,
    preferredDistance: row.preferred_distance ?? '',
    interests: row.interests ?? [],
    selectedShakha: row.selected_shakha ?? '',
    noShakhaNearby: row.no_shakha_nearby,
    preferredDay: row.preferred_day ?? '',
    comments: row.comments ?? '',
  }
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw error
  }

  return data.session
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw error
  }

  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    await supabase.auth.signOut()
    throw new Error('Authenticated user is not authorized as admin')
  }
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .limit(1)

  if (error) {
    return false
  }

  return (data?.length ?? 0) > 0
}

export async function listInterestedPeople(): Promise<InterestedPersonRecord[]> {
  const { data, error } = await supabase
    .from('interested_people')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data as SupabaseInterestedRow[]).map(mapInterestedRow)
}

export async function submitInterestedPerson(
  payload: Omit<InterestedPersonRecord, 'id' | 'createdAt'>,
): Promise<void> {
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

export async function listShakhaRecordsPublic(): Promise<ShakhaRecord[]> {
  const { data, error } = await supabase
    .from('shakhas_admin')
    .select('*')
    .order('state', { ascending: true })
    .order('city', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    // Fallback for first-time setup where table may be empty or inaccessible.
    return defaultSeedShakhas()
  }

  const rows = data as SupabaseShakhaRow[]
  if (rows.length === 0) {
    return defaultSeedShakhas()
  }

  return rows.map(mapShakhaRow)
}

export async function listShakhaRecordsAdmin(): Promise<ShakhaRecord[]> {
  const { data, error } = await supabase
    .from('shakhas_admin')
    .select('*')
    .order('state', { ascending: true })
    .order('city', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    throw error
  }

  return (data as SupabaseShakhaRow[]).map(mapShakhaRow)
}

export async function createShakha(record: Omit<ShakhaRecord, 'id'>): Promise<ShakhaRecord> {
  const { data, error } = await supabase
    .from('shakhas_admin')
    .insert(toShakhaRow(record))
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapShakhaRow(data as SupabaseShakhaRow)
}

export async function updateShakha(id: string, record: Omit<ShakhaRecord, 'id'>): Promise<ShakhaRecord> {
  const { data, error } = await supabase
    .from('shakhas_admin')
    .update(toShakhaRow(record))
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return mapShakhaRow(data as SupabaseShakhaRow)
}

export async function deleteShakha(id: string): Promise<void> {
  const { error } = await supabase
    .from('shakhas_admin')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
