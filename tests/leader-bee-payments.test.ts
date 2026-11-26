import { handler as checkout } from "../supabase/functions/create-leader-bee-checkout/index.ts"
import { handler as webhook } from "../supabase/functions/leader-bee-stripe-webhook/index.ts"

function equal(actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) !== JSON.stringify(expected))
    throw new Error(
      `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
    )
}
const originalFetch = globalThis.fetch
const id = "44444444-4444-4444-8444-444444444444"
const saved = {
  id,
  user_id: "parent-a",
  phone_verified_at: "2026-09-09",
  parent_email: "test@example.com",
  submission_key: id,
  shakha_slug: "live-nj",
  amount_cents: 2000,
  participant_count: 2,
  payment_status: "pending",
  stripe_checkout_session_id: null,
}
Deno.env.set("SUPABASE_URL", "https://test.supabase.co")
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-service")
Deno.env.set("STRIPE_SECRET_KEY", "test-stripe")
Deno.env.set("STRIPE_WEBHOOK_SECRET", "test-webhook")
Deno.env.set("LEADER_BEE_SITE_URL", "https://example.com/join")
const request = () =>
  new Request("https://example.com/checkout", {
    method: "POST",
    headers: {
      Authorization: "Bearer verified-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registrationId: id,
      amount_cents: 1,
      shakhaSlug: "wrong-branch",
    }),
  })

Deno.test("checkout rejects missing and invalid sessions", async () => {
  equal(
    (await checkout(new Request("https://example.com", { method: "POST", body: JSON.stringify({ registrationId: id }) })))
      .status,
    401,
  )
  globalThis.fetch = async () =>
    Response.json({ error: "invalid" }, { status: 401 })
  try {
    equal((await checkout(request())).status, 401)
  } finally {
    globalThis.fetch = originalFetch
  }
})
Deno.test("checkout scopes lookup to parent and uses saved amount and tenant in Stripe and return URL", async () => {
  let stripeCalled = false
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    if (url.endsWith("/auth/v1/user"))
      return Response.json({ id: "parent-a", phone_confirmed_at: "2026-09-09" })
    if (
      url.includes("/rest/v1/") &&
      (init as { method?: string } | undefined)?.method !== "PATCH"
    ) {
      equal(new URL(url).searchParams.get("user_id"), "eq.parent-a")
      return Response.json([saved])
    }
    if (url === "https://api.stripe.com/v1/checkout/sessions") {
      stripeCalled = true
      const params = new URLSearchParams(
        String((init as { body?: unknown } | undefined)?.body),
      )
      equal(params.get("line_items[0][price_data][unit_amount]"), "2000")
      equal(params.get("metadata[shakha_slug]"), "live-nj")
      equal(
        new URL(params.get("success_url")!).pathname,
        "/join/register-leader-bee",
      )
      equal(
        new URL(params.get("success_url")!).searchParams.get("shakha"),
        "live-nj",
      )
      equal(
        new URL(params.get("success_url")!).searchParams.get("registration"),
        id,
      )
      return Response.json({
        id: "cs_test",
        url: "https://checkout.stripe.com/test",
      })
    }
    if ((init as { method?: string } | undefined)?.method === "PATCH")
      return new Response(null, { status: 204 })
    throw new Error(`Unexpected request ${url}`)
  }
  try {
    equal((await checkout(request())).status, 200)
    equal(stripeCalled, true)
  } finally {
    globalThis.fetch = originalFetch
  }
})
Deno.test("checkout cannot find another parent registration and rejects paid rows", async () => {
  for (const [rows, status] of [
    [[], 404],
    [[{ ...saved, payment_status: "paid" }], 409],
  ] as const) {
    globalThis.fetch = async (input) =>
      String(input).endsWith("/auth/v1/user")
        ? Response.json({ id: "parent-a", phone_confirmed_at: "2026-09-09" })
        : Response.json(rows)
    try {
      equal((await checkout(request())).status, status)
    } finally {
      globalThis.fetch = originalFetch
    }
  }
})
async function signed(session: Record<string, unknown>) {
  const payload = JSON.stringify({
    type: "checkout.session.completed",
    data: { object: session },
  })
  const timestamp = String(Math.floor(Date.now() / 1000))
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("test-webhook"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signature = Array.from(
    new Uint8Array(
      await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(`${timestamp}.${payload}`),
      ),
    ),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
  return new Request("https://example.com/webhook", {
    method: "POST",
    headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
    body: payload,
  })
}
Deno.test("webhook requires a signature and never marks an unpaid session paid", async () => {
  equal(
    (
      await webhook(
        new Request("https://example.com", { method: "POST", body: "{}" }),
      )
    ).status,
    400,
  )
  globalThis.fetch = async () => {
    throw new Error("No database call expected for unpaid session")
  }
  try {
    equal(
      (await webhook(await signed({ payment_status: "unpaid" }))).status,
      200,
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
Deno.test("webhook checks tenant, amount and session before marking a matched payment paid", async () => {
  const session = {
    id: "cs_test",
    payment_status: "paid",
    currency: "usd",
    amount_total: 2000,
    metadata: { submission_key: id, shakha_slug: "live-nj" },
  }
  for (const [override, expected] of [
    [{ amount_total: 1 }, 400],
    [{ metadata: { submission_key: id, shakha_slug: "other" } }, 400],
    [{ id: "cs_other" }, 400],
    [{}, 200],
  ] as const) {
    let updated = false
    globalThis.fetch = async (_input, init) => {
      if ((init as { method?: string } | undefined)?.method === "PATCH") {
        updated = true
        equal(
          JSON.parse(String((init as { body?: unknown }).body)).payment_status,
          "paid",
        )
        return new Response(null, { status: 204 })
      }
      return Response.json([
        { ...saved, stripe_checkout_session_id: "cs_test" },
      ])
    }
    try {
      equal(
        (await webhook(await signed({ ...session, ...override }))).status,
        expected,
      )
      equal(updated, expected === 200)
    } finally {
      globalThis.fetch = originalFetch
    }
  }
})
