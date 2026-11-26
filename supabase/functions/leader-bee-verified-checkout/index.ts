const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: cors })

export async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response("ok", { headers: cors })
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405)
  const origin = Deno.env.get("SUPABASE_URL") || ""
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || ""
  const siteUrl = Deno.env.get("LEADER_BEE_SITE_URL") || ""
  if (!origin || !serviceKey || !stripeKey || !siteUrl)
    return json(
      { error: "Secure payment is not configured. Contact your coordinator." },
      503,
    )
  try {
    const authorization = request.headers.get("Authorization") || ""
    if (!authorization.startsWith("Bearer "))
      return json({ error: "Please verify your WhatsApp number first." }, 401)
    const auth = await fetch(`${origin}/auth/v1/user`, {
      headers: { apikey: serviceKey, Authorization: authorization },
    })
    const user = await auth.json()
    if (!auth.ok || !user.id || !user.phone_confirmed_at)
      return json({ error: "A verified parent session is required." }, 401)
    const { registrationId } = await request.json()
    if (
      typeof registrationId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(registrationId)
    )
      return json({ error: "Invalid registration reference." }, 400)
    const headers = {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    }
    const lookup = await fetch(
      `${origin}/rest/v1/leader_bee_registrations?id=eq.${registrationId}&user_id=eq.${encodeURIComponent(user.id)}&select=*`,
      { headers },
    )
    if (!lookup.ok)
      return json({ error: "Unable to look up registration." }, 502)
    const [registration] = await lookup.json()
    if (!registration?.phone_verified_at)
      return json({ error: "Verified registration not found." }, 404)
    if (
      registration.payment_status === "paid" ||
      registration.payment_status === "not_required" ||
      registration.amount_cents === 0
    )
      return json(
        { error: "No outstanding payment for this registration." },
        409,
      )
    if (registration.payment_status === "refunded")
      return json(
        {
          error: "This payment was refunded. Please contact your coordinator.",
        },
        409,
      )
    if (
      !Number.isSafeInteger(registration.amount_cents) ||
      registration.amount_cents < 0
    )
      return json({ error: "Invalid registration amount." }, 400)
    const stripeHeaders = { Authorization: `Bearer ${stripeKey}` }
    if (registration.stripe_checkout_session_id) {
      const previous = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(registration.stripe_checkout_session_id)}`,
        { headers: stripeHeaders },
      )
      if (!previous.ok)
        return json(
          {
            error:
              "Unable to check the previous payment session. Please try again.",
          },
          502,
        )
      const session = await previous.json()
      if (session.status === "open" && session.url)
        return json({ url: session.url })
      if (session.status === "complete")
        return json(
          {
            error: "Your payment is being confirmed. Please do not pay again.",
          },
          409,
        )
    }
    const returnUrl = new URL(
      `${siteUrl.replace(/\/$/, "")}/register-leader-bee`,
    )
    if (returnUrl.protocol !== "https:" && returnUrl.hostname !== "localhost")
      return json({ error: "Invalid payment return configuration." }, 503)
    returnUrl.search = new URLSearchParams({
      shakha: registration.shakha_slug,
      view: "curriculum",
      registration: registration.id,
    }).toString()
    returnUrl.hash = "curriculum"
    const success = new URL(returnUrl)
    success.searchParams.set("payment", "returned")
    const cancel = new URL(returnUrl)
    cancel.searchParams.set("payment", "cancelled")
    const params = new URLSearchParams({
      mode: "payment",
      customer_email: registration.parent_email,
      success_url: success.href,
      cancel_url: cancel.href,
    })
    params.set("line_items[0][price_data][currency]", "usd")
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(registration.amount_cents),
    )
    params.set(
      "line_items[0][price_data][product_data][name]",
      `Leader-BEE · ${registration.shakha_slug}`,
    )
    params.set(
      "line_items[0][price_data][product_data][description]",
      `10-week program · ${registration.participant_count} student(s)`,
    )
    params.set("line_items[0][quantity]", "1")
    params.set("metadata[submission_key]", registration.submission_key)
    params.set("metadata[shakha_slug]", registration.shakha_slug)
    params.set(
      "payment_intent_data[metadata][submission_key]",
      registration.submission_key,
    )
    params.set(
      "payment_intent_data[metadata][shakha_slug]",
      registration.shakha_slug,
    )
    const payment = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        ...stripeHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": `leader-bee:${registration.id}:${registration.stripe_checkout_session_id || "initial"}`,
      },
      body: params,
    })
    const session = await payment.json()
    if (!payment.ok || !session.url || !session.id)
      return json(
        { error: "Unable to create secure checkout. Please try again." },
        502,
      )
    const saved = await fetch(
      `${origin}/rest/v1/leader_bee_registrations?id=eq.${registration.id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ stripe_checkout_session_id: session.id }),
      },
    )
    if (!saved.ok)
      return json(
        { error: "Unable to attach checkout to registration. Please retry." },
        502,
      )
    return json({ url: session.url })
  } catch {
    return json({ error: "Unable to open payment. Please retry." }, 500)
  }
}

if (import.meta.main) Deno.serve(handler)
