import { handler as verifiedCheckout } from "../leader-bee-verified-checkout/index.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Child = { name?: string; grade?: string }
type CheckoutRequest = {
  shakhaSlug?: string
  submissionKey?: string
  parentEmail?: string
  parentName?: string
  parentPhone?: string
  children?: Child[]
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  // One public checkout endpoint for both the published form and verified branch registrations.
  const body = await request.clone().json().catch(() => null)
  if (body && Object.prototype.hasOwnProperty.call(body, 'registrationId')) return verifiedCheckout(request)

  const rawStripeSecret = Deno.env.get('STRIPE_SECRET_KEY') || ''
  const normalizedStripeSecret = rawStripeSecret.trim().replace(/^["']|["']$/g, '')
  const embeddedApiKey = normalizedStripeSecret.match(/(?:sk|rk)_(?:test|live)_[A-Za-z0-9]+/)?.[0]
  const stripeSecretKey = embeddedApiKey || normalizedStripeSecret
  const siteUrl = (Deno.env.get('LEADER_BEE_SITE_URL') || 'https://join.shakhasewasetu.com').replace(/\/$/, '')
  if (!stripeSecretKey) return jsonResponse({ error: 'Stripe is not configured' }, 500)
  if (!/^(sk|rk)_(test|live)_/.test(stripeSecretKey)) {
    const detectedType = stripeSecretKey.startsWith('pk_')
      ? 'publishable key (pk_)'
      : stripeSecretKey.startsWith('smk_')
        ? 'sandbox management key (smk_)'
        : stripeSecretKey.startsWith('whsec_')
          ? 'webhook signing secret (whsec_)'
          : 'unknown key type'
    return jsonResponse(
      { error: `Stripe is configured with a ${detectedType}. Use the server secret from Developers → API keys (sk_test_ or sk_live_).` },
      500,
    )
  }

  let input: CheckoutRequest
  try {
    input = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body' }, 400)
  }

  const parentEmail = input.parentEmail?.trim().toLowerCase() || ''
  const submissionKey = input.submissionKey?.trim() || ''
  const shakhaSlug = String(input.shakhaSlug || 'usa-07751-sri-krishna-shakha').trim()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(shakhaSlug) || shakhaSlug.length > 200) {
    return jsonResponse({ error: 'Invalid Shakha' }, 400)
  }
  const parentName = input.parentName?.trim() || ''
  const parentPhone = input.parentPhone?.replace(/\D/g, '') || ''
  const children = (input.children || [])
    .map(child => ({ name: child.name?.trim() || '', grade: child.grade?.trim() || '' }))
    .filter(child => child.name && /^Grade (?:K|[1-9]|1[0-2])$/.test(child.grade))
  const participatingChildren = children.filter(child => /^Grade (?:K|[1-8])$/.test(child.grade))

  if (!/^[0-9a-f-]{36}$/i.test(submissionKey) || !/^\S+@\S+\.\S+$/.test(parentEmail) || !parentName || !/^\d{10}$/.test(parentPhone)) {
    return jsonResponse({ error: 'Valid parent contact details are required' }, 400)
  }
  if (children.length < 1 || children.length > 10) {
    return jsonResponse({ error: 'Please register between 1 and 10 children' }, 400)
  }
  if (participatingChildren.length < 1) {
    return jsonResponse({ error: 'No payment is required for registrations outside grades K–8' }, 400)
  }

  // This legacy route cannot create or replace registrations in the verified engine.
  const guardUrl = Deno.env.get('SUPABASE_URL') || ''
  const guardKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!guardUrl || !guardKey) return jsonResponse({ error: 'Registration storage is not configured' }, 503)
  const guardHeaders = { apikey: guardKey, Authorization: `Bearer ${guardKey}` }
  const existingResponse = await fetch(`${guardUrl}/rest/v1/leader_bee_registrations?submission_key=eq.${encodeURIComponent(submissionKey)}&select=phone_verified_at`, { headers: guardHeaders })
  const branchResponse = await fetch(`${guardUrl}/rest/v1/leader_bee_branches?slug=eq.${encodeURIComponent(shakhaSlug)}&select=slug`, { headers: guardHeaders })
  if (!existingResponse.ok || !branchResponse.ok) return jsonResponse({ error: 'Unable to validate registration. Please try again.' }, 503)
  const existing = await existingResponse.json()
  const branches = await branchResponse.json()
  if (existing.some((row: { phone_verified_at?: string }) => row.phone_verified_at) || branches.length) {
    return jsonResponse({ error: 'Please use the branch page and verify your WhatsApp number before registration or payment.' }, 403)
  }

  // The price is defined here on the trusted server, never accepted from the browser.
  const params = new URLSearchParams()
  params.set('mode', 'payment')
  params.set('customer_email', parentEmail)
  params.set('success_url', `${siteUrl}/register-leader-bee.html?shakha=${encodeURIComponent(shakhaSlug)}&formOnly=1&payment=success&session_id={CHECKOUT_SESSION_ID}#register`)
  params.set('cancel_url', `${siteUrl}/register-leader-bee.html?shakha=${encodeURIComponent(shakhaSlug)}&formOnly=1&payment=cancelled#register`)
  params.set('line_items[0][price_data][currency]', 'usd')
  params.set('line_items[0][price_data][unit_amount]', '1000')
  params.set('line_items[0][price_data][product_data][name]', 'Leader-BEE Child Registration')
  params.set('line_items[0][price_data][product_data][description]', '10-week leadership programme')
  params.set('line_items[0][quantity]', String(participatingChildren.length))
  params.set('metadata[shakha_slug]', shakhaSlug)
  params.set('payment_intent_data[metadata][shakha_slug]', shakhaSlug)
  params.set('metadata[parent_name]', parentName.slice(0, 500))
  params.set('metadata[submission_key]', submissionKey)
  params.set('metadata[parent_phone]', parentPhone)
  params.set('metadata[child_count]', String(children.length))
  params.set('metadata[participant_count]', String(participatingChildren.length))
  params.set('metadata[children]', children.map(child => `${child.name} (${child.grade})`).join(', ').slice(0, 500))
  params.set('payment_intent_data[metadata][parent_email]', parentEmail)
  params.set('payment_intent_data[metadata][submission_key]', submissionKey)
  params.set('payment_intent_data[metadata][child_count]', String(children.length))
  params.set('payment_intent_data[metadata][participant_count]', String(participatingChildren.length))

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })
  const stripeData = await stripeResponse.json()

  if (!stripeResponse.ok || !stripeData.url) {
    console.error('Stripe Checkout error', stripeData)
    const stripeError = stripeData?.error
    return jsonResponse(
      {
        error: stripeError?.message || 'Unable to create the secure checkout session',
        code: stripeError?.code || stripeError?.type || 'stripe_checkout_error',
      },
      502,
    )
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (supabaseUrl && serviceKey && stripeData.id) {
    const storageResponse = await fetch(
      `${supabaseUrl}/rest/v1/leader_bee_registrations?submission_key=eq.${encodeURIComponent(submissionKey)}`,
      {
        method: 'PATCH',
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ stripe_checkout_session_id: stripeData.id }),
      },
    )
    if (!storageResponse.ok) console.error('Unable to attach Stripe session to registration', await storageResponse.text())
  }

  return jsonResponse({ url: stripeData.url, sessionId: stripeData.id })
}

if (import.meta.main) Deno.serve(handler)
