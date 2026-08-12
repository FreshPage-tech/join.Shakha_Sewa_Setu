const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Child = { name?: string; grade?: string }
type CheckoutRequest = {
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

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
  const siteUrl = (Deno.env.get('LEADER_BEE_SITE_URL') || 'https://join.shakhasewasetu.com').replace(/\/$/, '')
  if (!stripeSecretKey) return jsonResponse({ error: 'Stripe is not configured' }, 500)
  if (!/^(sk|rk)_(test|live)_/.test(stripeSecretKey)) {
    return jsonResponse(
      { error: 'Stripe is configured with the wrong key type. Use an sk_test_, sk_live_, or permitted rk_ API key.' },
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
  const parentName = input.parentName?.trim() || ''
  const parentPhone = input.parentPhone?.replace(/\D/g, '') || ''
  const children = (input.children || [])
    .map(child => ({ name: child.name?.trim() || '', grade: child.grade?.trim() || '' }))
    .filter(child => child.name && /^Grade [4-8]$/.test(child.grade))

  if (!/^\S+@\S+\.\S+$/.test(parentEmail) || !parentName || !/^\d{10}$/.test(parentPhone)) {
    return jsonResponse({ error: 'Valid parent contact details are required' }, 400)
  }
  if (children.length < 1 || children.length > 10) {
    return jsonResponse({ error: 'Please register between 1 and 10 children' }, 400)
  }

  // The price is defined here on the trusted server, never accepted from the browser.
  const params = new URLSearchParams()
  params.set('mode', 'payment')
  params.set('customer_email', parentEmail)
  params.set('success_url', `${siteUrl}/register-leader-bee.html?payment=success&session_id={CHECKOUT_SESSION_ID}#register`)
  params.set('cancel_url', `${siteUrl}/register-leader-bee.html?payment=cancelled#register`)
  params.set('line_items[0][price_data][currency]', 'usd')
  params.set('line_items[0][price_data][unit_amount]', '1000')
  params.set('line_items[0][price_data][product_data][name]', 'Leader-BEE Child Registration')
  params.set('line_items[0][price_data][product_data][description]', '12-week leadership programme')
  params.set('line_items[0][quantity]', String(children.length))
  params.set('metadata[parent_name]', parentName.slice(0, 500))
  params.set('metadata[parent_phone]', parentPhone)
  params.set('metadata[child_count]', String(children.length))
  params.set('metadata[children]', children.map(child => `${child.name} (${child.grade})`).join(', ').slice(0, 500))
  params.set('payment_intent_data[metadata][parent_email]', parentEmail)
  params.set('payment_intent_data[metadata][child_count]', String(children.length))

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

  return jsonResponse({ url: stripeData.url })
})
