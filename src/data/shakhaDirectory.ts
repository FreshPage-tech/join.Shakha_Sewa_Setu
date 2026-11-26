import type { ShakhaRecord } from "../shakhaTypes"

export type ShakhaTenant = {
  slug: string
  name: string
  address: string
  timing: string
  startDate: string
  coordinatorName: string
  whatsappNumber: string
  email: string
  isDemo: boolean
  registrationEnabled: boolean
  feeCents: number
  shakhaId?: string
  record?: ShakhaRecord
}

// Fictional fixtures, not verified event listings. Live Supabase rows take precedence.
export const shakhaDirectory: ShakhaTenant[] = [
  {
    slug: "morganville-nj",
    name: "Keshav Shakha",
    address: "Sample Community Hall, Morganville, NJ",
    timing: "Sundays, 4:00–5:30 PM (sample)",
    startDate: "2026-10-04",
    coordinatorName: "Morganville Demo Coordinator",
    whatsappNumber: "+12025550101",
    email: "morganville@example.com",
    isDemo: true,
    registrationEnabled: false,
    feeCents: 1000,
  },
  {
    slug: "edison-nj",
    name: "Madhav Shakha",
    address: "Sample Community Hall, Edison, NJ",
    timing: "Saturdays, 10:00–11:30 AM (sample)",
    startDate: "2026-10-03",
    coordinatorName: "Edison Demo Coordinator",
    whatsappNumber: "+12025550102",
    email: "edison@example.com",
    isDemo: true,
    registrationEnabled: false,
    feeCents: 1000,
  },
  {
    slug: "jersey-city-nj",
    name: "Vivekanand Shakha",
    address: "Sample Community Hall, Jersey City, NJ",
    timing: "Sundays, 9:00–10:30 AM (sample)",
    startDate: "2026-10-04",
    coordinatorName: "Jersey City Demo Coordinator",
    whatsappNumber: "+12025550103",
    email: "jersey-city@example.com",
    isDemo: true,
    registrationEnabled: false,
    feeCents: 1000,
  },
]

export function shakhaSlug(record: ShakhaRecord) {
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  const zip =
    record.zipCode.match(/\d{5}/)?.[0] ||
    record.address.match(/\d{5}/)?.[0] ||
    "00000"
  return `${slugify(import.meta.env.VITE_COUNTRY_SLUG ?? "usa")}-${zip}-${slugify(record.name)}`
}

export function tenantFromShakha(record: ShakhaRecord): ShakhaTenant {
  const coordinator =
    record.leaders?.find((leader) => /karyawah|karyavah/i.test(leader.role)) ||
    record.contacts.find((contact) => contact.mobile || contact.email)
  return {
    slug: shakhaSlug(record),
    name: record.name,
    address: record.address,
    timing: [record.day, record.time].filter(Boolean).join(" · "),
    startDate: "",
    coordinatorName: coordinator?.name || "",
    whatsappNumber: coordinator?.mobile || "",
    email: coordinator?.email || "",
    isDemo: false,
    registrationEnabled: false,
    feeCents: 1000,
    shakhaId: record.id,
    record,
  }
}

export const leaderBeePath = (slug?: string) =>
  `${import.meta.env.BASE_URL}register-leader-bee${
    slug ? `?shakha=${encodeURIComponent(slug)}` : ""
  }`

// Existing published Morganville event, transcribed from public/register-leader-bee.html.
// Its Sunday program schedule is independent of Sri Krishna Shakha's Thursday routine.
export const publishedLeaderBeeBranches: ShakhaTenant[] = [{
  slug: 'usa-07751-sri-krishna-shakha',
  name: 'Sri Krishna Shakha',
  shakhaId: 'New Jersey|Morganville|Sri Krishna Shakha',
  address: 'The Dance Spot, 479 Hwy 79 A4, Morganville, NJ 07751',
  timing: 'Every Sunday · 4:00 PM–5:30 PM',
  startDate: '2026-09-13',
  coordinatorName: 'Utkarsh Patel',
  whatsappNumber: '+12018896610',
  email: '',
  isDemo: false,
  registrationEnabled: true,
  feeCents: 1000,
}]
