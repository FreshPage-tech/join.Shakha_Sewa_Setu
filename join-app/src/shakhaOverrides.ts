import overridesData from './shakhaOverrides.json'
import type { ContactDetail, ShakhaRecord } from './adminData'

type ShakhaShareOverride = {
  id: string
  record?: Partial<ShakhaRecord>
  shareTitle?: string
  shareDescription?: string
  shareMessage?: string
  shareUrl?: string
  shareImage?: string
  shareImageType?: string
  shareImageWidth?: string
  shareImageHeight?: string
}

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

export function getShakhaOverride(record: Pick<ShakhaRecord, 'id' | 'state' | 'city' | 'name'>): ShakhaShareOverride | undefined {
  const id = record.id || buildShakhaId(record.state, record.city, record.name)
  return overrides.find(override => override.id === id)
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