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

export type ShakhaLocationIndex = Record<string, string[]>

export type ShakhaShareOverride = {
  id: string
  record?: Partial<ShakhaRecord>
  shareTitle?: string
  shareDescription?: string
  shareMessage?: string
}