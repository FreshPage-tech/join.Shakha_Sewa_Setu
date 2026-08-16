export type ScrapedShakha = {
  shakha_name: string
  country: string
  state_or_region: string | null
  city: string | null
  address: string | null
  contact_person: string | null
  contact_phone: string | null
  source_url: string | null
}

export type ShakhaRow = ScrapedShakha & {
  updated_at: string
}
