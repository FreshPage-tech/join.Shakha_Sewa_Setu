export type ContactDetail = {
  name: string
  mobile: string
  email: string
}

export type ShakhaLeader = {
  role: string
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
  bannerUrl?: string
  profileImageUrl?: string
  contacts: ContactDetail[]
  leaders?: ShakhaLeader[]
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

export type LeaderBeeRegistration = {
  id: string
  createdAt: string
  parentName: string
  parentEmail: string
  parentPhone: string
  children: { name: string; grade: string }[]
  childCount: number
  participantCount: number
  amountCents: number
  paymentStatus: 'not_required' | 'pending' | 'paid' | 'failed' | 'refunded'
  stripeCheckoutSessionId: string
  paidAt: string
}

export type ShakhaLocationIndex = Record<string, string[]>

export type ShakhaShareOverride = {
  id: string
  record?: Partial<ShakhaRecord>
  shareTitle?: string
  shareDescription?: string
  shareMessage?: string
}
