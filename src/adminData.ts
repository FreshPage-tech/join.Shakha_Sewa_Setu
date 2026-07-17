import { SHAKHA_DATA, type ShakhaChapter } from './shakhaData'

export type ContactDetail = {
  name: string
  mobile: string
  email: string
}

export type ShakhaRecord = {
  id: string
  name: string
  address: string
  state: string
  city: string
  vibhag: string
  bhag: string
  zipCode: string
  mapLink: string
  day: string
  time: string
  contacts: ContactDetail[]
}

export type InterestedPersonRecord = {
  id: string
  createdAt: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  age: string
  gender: string
  occupation: string
  state: string
  city: string
  zip: string
  preferredDistance: string
  interests: string[]
  selectedShakha: string
  noShakhaNearby: boolean
  preferredDay: string
  comments: string
}

function createBlankContacts(): ContactDetail[] {
  return [
    { name: '', mobile: '', email: '' },
    { name: '', mobile: '', email: '' },
    { name: '', mobile: '', email: '' },
  ]
}

export function getDefaultShakhaRecords(): ShakhaRecord[] {
  const records: ShakhaRecord[] = []

  for (const [state, cityMap] of Object.entries(SHAKHA_DATA)) {
    for (const [city, shakhas] of Object.entries(cityMap)) {
      for (const shakha of shakhas) {
        records.push({
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
          contacts: createBlankContacts(),
        })
      }
    }
  }

  return records
}

function normalizeContacts(contacts: ContactDetail[] | undefined): ContactDetail[] {
  const safeContacts = contacts ?? []
  const normalized: ContactDetail[] = [0, 1, 2].map(index => {
    const contact = safeContacts[index]
    return {
      name: contact?.name?.trim() ?? '',
      mobile: contact?.mobile?.trim() ?? '',
      email: contact?.email?.trim() ?? '',
    }
  })

  return normalized
}

function normalizeShakha(record: ShakhaRecord): ShakhaRecord {
  return {
    ...record,
    name: record.name.trim(),
    address: record.address.trim(),
    state: record.state.trim(),
    city: record.city.trim(),
    vibhag: record.vibhag.trim(),
    bhag: record.bhag.trim(),
    zipCode: record.zipCode.trim(),
    mapLink: record.mapLink.trim(),
    day: record.day.trim(),
    time: record.time.trim(),
    contacts: normalizeContacts(record.contacts),
  }
}

export function normalizeShakhaRecords(records: ShakhaRecord[]): ShakhaRecord[] {
  return records.map(normalizeShakha)
}

export function buildShakhaDataMap(records: ShakhaRecord[]): Record<string, Record<string, ShakhaChapter[]>> {
  const map: Record<string, Record<string, ShakhaChapter[]>> = {}

  for (const record of records) {
    if (!record.state || !record.city || !record.name) {
      continue
    }

    map[record.state] ??= {}
    map[record.state][record.city] ??= []

    const detailUrl = record.mapLink || 'https://join.shakhasewasetu.com'
    const day = record.day || 'Weekly'
    const time = record.time || 'Please contact volunteer'

    map[record.state][record.city].push({
      name: record.name,
      city: record.city,
      state: record.state,
      address: record.address || `${record.city} ${record.state}`,
      day,
      time,
      timing: `${day} from ${time}`,
      detailUrl,
    })
  }

  for (const cityMap of Object.values(map)) {
    for (const city of Object.keys(cityMap)) {
      cityMap[city] = [...cityMap[city]].sort((left, right) => left.name.localeCompare(right.name))
    }
  }

  return map
}
