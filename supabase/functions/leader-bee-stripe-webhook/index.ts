async function validSignature(payload: string, header: string, secret: string) {
  const values = Object.fromEntries(header.split(',').map(part => part.split('=', 2)))
  if (!values.t || !values.v1 || Math.abs(Date.now() / 1000 - Number(values.t)) > 300) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${values.t}.${payload}`))
  const expected = Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
  if (expected.length !== values.v1.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i += 1) mismatch |= expected.charCodeAt(i) ^ values.v1.charCodeAt(i)
  return mismatch === 0
}

export async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const payload = await request.text()
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
  if (!secret || !(await validSignature(payload, request.headers.get('stripe-signature') || '', secret))) {
    return new Response('Invalid signature', { status: 400 })
  }

  let event
  try { event = JSON.parse(payload) } catch { return new Response('Invalid event', { status: 400 }) }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
    return Response.json({ received: true })
  }
  const session = event.data?.object || {}
  if (session.payment_status !== 'paid') return Response.json({ received: true })
  const submissionKey = session.metadata?.submission_key || ''
  if (!submissionKey) return new Response('Missing submission key', { status: 400 })

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  const lookup = await fetch(`${supabaseUrl}/rest/v1/leader_bee_registrations?submission_key=eq.${encodeURIComponent(submissionKey)}&select=id,amount_cents,shakha_slug,stripe_checkout_session_id,payment_status`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  })
  if (!lookup.ok) return new Response('Unable to verify registration', { status: 502 })
  const [registration] = await lookup.json()
  if (!registration) return new Response('Registration not found', { status: 404 })
  if (registration.payment_status === 'refunded') return Response.json({ received: true })
  if (session.currency !== 'usd' || session.amount_total !== registration.amount_cents ||
      session.id !== registration.stripe_checkout_session_id ||
      (session.metadata?.shakha_slug && session.metadata.shakha_slug !== registration.shakha_slug)) {
    return new Response('Payment does not match registration', { status: 400 })
  }
  const response = await fetch(`${supabaseUrl}/rest/v1/leader_bee_registrations?submission_key=eq.${encodeURIComponent(submissionKey)}`, {
    method: 'PATCH',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payment_status: 'paid',
      stripe_checkout_session_id: session.id || null,
      stripe_payment_intent_id: session.payment_intent || null,
      paid_at: new Date().toISOString(),
    }),
  })
  if (!response.ok) return new Response('Unable to update registration', { status: 502 })
  return Response.json({ received: true })
}

if (import.meta.main) Deno.serve(handler)
