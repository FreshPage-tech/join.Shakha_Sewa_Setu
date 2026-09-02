import type { ShakhaChapter } from './shakhaData'
import type { ContactDetail, ShakhaLeader, ShakhaRecord } from './shakhaTypes'

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

function normalizeLeaders(leaders: ShakhaLeader[] | undefined): ShakhaLeader[] {
  return (leaders ?? [])
    .map(leader => ({
      role: leader.role?.trim() ?? '',
      name: leader.name?.trim() ?? '',
      mobile: leader.mobile?.trim() ?? '',
      email: leader.email?.trim() ?? '',
    }))
    .filter(leader => leader.role || leader.name || leader.mobile || leader.email)
}

export function normalizeShakhaRecord(record: ShakhaRecord): ShakhaRecord {
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
    bannerUrl: record.bannerUrl?.trim() ?? '',
    profileImageUrl: record.profileImageUrl?.trim() ?? '',
    contacts: normalizeContacts(record.contacts),
    leaders: normalizeLeaders(record.leaders),
  }
}

export function normalizeShakhaRecords(records: ShakhaRecord[]): ShakhaRecord[] {
  return records.map(normalizeShakhaRecord)
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
