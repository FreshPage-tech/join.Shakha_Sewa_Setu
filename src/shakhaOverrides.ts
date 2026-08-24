import overridesData from './shakhaOverrides.json'
import type { ContactDetail, ShakhaLocationIndex, ShakhaRecord, ShakhaShareOverride } from './shakhaTypes'

const DEFAULT_SHARE_MESSAGE = `🚩 Join Sangh Parivar Shakha - Build Yourself, Build Society

Discover a weekly gathering that promotes physical fitness, leadership, Hindu values, discipline, and community service for individuals and families of all ages.

🏃 Physical Fitness • 🧘 Yoga • 🤝 Brotherhood • 🌺 Culture • ❤️ Seva

📍 Find a Sangh Parivar Shakha near you and become part of a growing community.

Strong Individuals • Strong Families • Strong Society

👉 Find Your Nearest Shakha`

const overrides = overridesData as ShakhaShareOverride[]

function normalizeContacts(contacts: ContactDetail[] | undefined): ContactDetail[] {
  const safeContacts = contacts ?? []
  return [0, 1, 2].map(index => ({
    name: safeContacts[index]?.name?.trim() ?? '',
    mobile: safeContacts[index]?.mobile?.trim() ?? '',
    email: safeContacts[index]?.email?.trim() ?? '',
  }))
}

export function buildShakhaId(state: string, city: string, name: string): string {
  return `${state.trim()}|${city.trim()}|${name.trim()}`
}

export function getShakhaOverrideById(id: string): ShakhaShareOverride | undefined {
  return overrides.find(override => override.id === id)
}

export function getShakhaOverride(record: Pick<ShakhaRecord, 'id' | 'state' | 'city' | 'name'>): ShakhaShareOverride | undefined {
  const id = record.id || buildShakhaId(record.state, record.city, record.name)
  return getShakhaOverrideById(id)
}

export function applyShakhaOverride(record: ShakhaRecord): ShakhaRecord {
  const override = getShakhaOverride(record)
  if (!override?.record) {
    return record
  }

  return {
    ...record,
    ...override.record,
    contacts: normalizeContacts(override.record.contacts ?? record.contacts),
  }
}

export function mergeLocationIndexes(...indexes: ShakhaLocationIndex[]): ShakhaLocationIndex {
  const merged: ShakhaLocationIndex = {}

  for (const index of indexes) {
    for (const [state, cities] of Object.entries(index)) {
      merged[state] ??= []
      for (const city of cities) {
        if (!merged[state].includes(city)) {
          merged[state].push(city)
        }
      }
    }
  }

  for (const state of Object.keys(merged)) {
    merged[state].sort((left, right) => left.localeCompare(right))
  }

  return Object.fromEntries(
    Object.entries(merged).sort(([left], [right]) => left.localeCompare(right)),
  )
}

export function mergeShakhaRecords(records: ShakhaRecord[]): ShakhaRecord[] {
  const byId = new Map<string, ShakhaRecord>()

  for (const record of records) {
    const normalized = applyShakhaOverride(record)
    byId.set(normalized.id, normalized)
  }

  return [...byId.values()].sort((left, right) => left.name.localeCompare(right.name))
}

export function getShareMessage(record: ShakhaRecord): string {
  return getShakhaOverride(record)?.shareMessage ?? DEFAULT_SHARE_MESSAGE
}

export function getShareTitle(record: ShakhaRecord): string {
  return getShakhaOverride(record)?.shareTitle ?? `${record.name} | Shakha Sewa Setu`
}

export function getShareDescription(record: ShakhaRecord): string {
  return getShakhaOverride(record)?.shareDescription
    ?? `${record.name} in ${record.city}, ${record.state}. ${record.day || 'Weekly'} at ${record.time || 'Please contact volunteer'}. ${record.address}`
}