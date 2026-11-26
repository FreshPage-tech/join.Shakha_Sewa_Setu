import { hasSupabaseConfig, supabase } from "./supabaseClient"
import {
  shakhaDirectory,
  publishedLeaderBeeBranches,
  tenantFromShakha,
  type ShakhaTenant,
} from "./data/shakhaDirectory"
import { findPublicShakhaById, findPublicShakhaBySlug } from "./publicShakhaApi"

export type CurriculumWeek = {
  week: number
  title: string
  objective: string
  activities: string[]
}
export type RegistrationInput = {
  submissionKey: string
  shakhaSlug: string
  parentName: string
  parentEmail: string
  parentPhone: string
  details: {
    parentFirstName: string
    parentLastName: string
    city: string
    state: string
    notes: string
    parentAttendanceConsent: boolean
  }
  children: {
    name: string
    grade: string
  }[]
}

export async function listLeaderBeeTenants(): Promise<ShakhaTenant[]> {
  const fallback = [...publishedLeaderBeeBranches, ...shakhaDirectory]
  if (!hasSupabaseConfig) return fallback
  const { data, error } = await supabase
    .from("leader_bee_branches")
    .select("*")
    .order("name")
  if (error) return fallback
  const live: ShakhaTenant[] = (data || []).map((row) => ({
    slug: row.slug,
    name: row.name,
    address: row.address,
    timing: row.timing,
    startDate: row.start_date || "",
    coordinatorName: row.coordinator_name,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    isDemo: row.is_demo,
    registrationEnabled: row.registration_enabled,
    feeCents: row.fee_cents,
    shakhaId: row.shakha_id || undefined,
  }))
  return [
    ...live,
    ...fallback.filter(
      (mock) => !live.some((tenant) => tenant.slug === mock.slug),
    ),
  ]
}

export async function resolveLeaderBeeTenant(
  slug: string,
): Promise<ShakhaTenant | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 200) return null
  const directory = await listLeaderBeeTenants()
  const match = directory.find((tenant) => tenant.slug === slug)
  if (match)
    return {
      ...match,
      record: match.shakhaId
        ? (await findPublicShakhaById(match.shakhaId)) || undefined
        : undefined,
    }
  const record = await findPublicShakhaBySlug(slug)
  if (!record) return null
  return {
    ...(directory.find((tenant) => tenant.shakhaId === record.id) ||
      tenantFromShakha(record)),
    record,
  }
}

export const normalizePhone = (phone: string) => `+${phone.replace(/\D/g, "")}`

export async function sendLeaderBeeOtp(phone: string) {
  if (!hasSupabaseConfig)
    throw new Error(
      "Registration is not connected yet. Please contact your coordinator.",
    )
  const { error } = await supabase.auth.signInWithOtp({
    phone: normalizePhone(phone),
    options: { channel: "whatsapp" },
  })
  if (error) throw error
}

export async function verifyLeaderBeeOtp(phone: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: normalizePhone(phone),
    token,
    type: "sms",
  })
  if (error) throw error
  if (!data.session)
    throw new Error("Verification did not create a session. Please try again.")
}

export async function registerLeaderBee(
  input: RegistrationInput,
): Promise<string> {
  const { data, error } = await supabase.rpc("register_leader_bee_verified", {
    p_submission_key: input.submissionKey,
    p_shakha_slug: input.shakhaSlug,
    p_parent_name: input.parentName,
    p_parent_email: input.parentEmail,
    p_parent_phone: normalizePhone(input.parentPhone),
    p_children: input.children,
    p_details: input.details,
  })
  if (error) throw error
  if (!data)
    throw new Error("Registration could not be confirmed. Please try again.")
  return data as string
}

export async function getLeaderBeeCurriculum(
  slug: string,
): Promise<CurriculumWeek[]> {
  if (!hasSupabaseConfig)
    throw new Error(
      "Please register and verify your WhatsApp number to open the curriculum.",
    )
  const { data, error } = await supabase.rpc("get_leader_bee_curriculum", {
    p_shakha_slug: slug,
  })
  if (error) throw error
  return data || []
}

export async function openLeaderBeeCheckout(
  registrationId: string,
): Promise<void> {
  const { data, error } = await supabase.functions.invoke(
    "create-leader-bee-checkout",
    { body: { registrationId } },
  )
  if (error) {
    const details = await error.context?.json?.().catch(() => null)
    throw new Error(
      details?.error || error.message || "Unable to open payment.",
    )
  }
  if (!data?.url)
    throw new Error(data?.error || "Unable to open payment. Please try again.")
  const url = new URL(data.url)
  if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com")
    throw new Error("Invalid payment URL.")
  window.location.assign(url.href)
}

export type LeaderBeePayment = {
  id: string
  payment_status: string
  amount_cents: number
}
export async function getLeaderBeePayment(
  slug: string,
  registrationId: string,
): Promise<LeaderBeePayment | null> {
  const { data, error } = await supabase.rpc(
    "get_leader_bee_registration_status",
    { p_shakha_slug: slug, p_registration_id: registrationId || null },
  )
  if (error) throw error
  return data?.[0] || null
}
