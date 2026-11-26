import assert from "node:assert/strict"
import { createServer } from "vite"
import { chromium } from "playwright"

const server = await createServer({
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
      "https://leader-bee-test.supabase.co",
    ),
    "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify("test-anon-key"),
  },
  server: { port: 8457, strictPort: true, host: "127.0.0.1" },
})
await server.listen()
let browser
try {
  browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  })
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  })
  page.setDefaultTimeout(15000)
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error" && message.text().includes("same key"))
      errors.push(message.text())
  })
  const calls = { send: 0, verify: 0, registrations: [], payments: [] }
  let verified = false
  let registered = false
  const id = "44444444-4444-4444-8444-444444444444"
  const user = {
    id: "11111111-1111-4111-8111-111111111111",
    aud: "authenticated",
    role: "authenticated",
    phone: "12015550123",
    phone_confirmed_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
  }
  const token = `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" })).toString("base64url")}.signature`
  const live = {
    slug: "live-nj",
    name: "Live Test Shakha",
    address: "Test venue, NJ",
    timing: "Sunday, 4 PM",
    start_date: "2026-10-04",
    coordinator_name: "Test Coordinator",
    whatsapp_number: "+12015550123",
    email: "test@example.com",
    is_demo: false,
    registration_enabled: true,
    fee_cents: 1000,
  }
  await page.route("https://leader-bee-test.supabase.co/**", async (route) => {
    const path = new URL(route.request().url()).pathname
    const body = route.request().postDataJSON()
    const reply = (data, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify(data),
      })
    if (path.endsWith("/leader_bee_branches")) return reply([live])
    if (path.endsWith("/shakhas_admin")) return new URL(route.request().url()).searchParams.has("id") ? reply({ message: "No row" }, 406) : reply([])
    if (path.endsWith("/auth/v1/otp")) {
      calls.send++
      assert.equal(body.channel, "whatsapp")
      return reply({})
    }
    if (path.endsWith("/auth/v1/verify")) {
      calls.verify++
      if (body.token !== "123456")
        return reply(
          { msg: "Invalid or expired code", error_code: "otp_expired" },
          403,
        )
      verified = true
      return reply({
        access_token: token,
        refresh_token: "test-refresh",
        token_type: "bearer",
        expires_in: 3600,
        user,
      })
    }
    if (path.endsWith("/auth/v1/user")) return reply(user)
    if (path.endsWith("/rpc/register_leader_bee_verified")) {
      assert.equal(verified, true)
      calls.registrations.push(body)
      registered = true
      return reply(id)
    }
    if (path.endsWith("/rpc/get_leader_bee_registration_status"))
      return reply(
        registered
          ? [{ id, payment_status: "pending", amount_cents: 1000 }]
          : [],
      )
    if (path.endsWith("/rpc/get_leader_bee_curriculum"))
      return registered
        ? reply(
            Array.from({ length: 10 }, (_, i) => ({
              week: i + 1,
              title: `Lesson ${i + 1}`,
              objective: "Practice teamwork.",
              activities: ["Learn together", "Reflect together"],
            })),
          )
        : reply({ message: "Verified registration required" }, 403)
    if (path.endsWith("/create-leader-bee-checkout")) {
      calls.payments.push(body)
      return reply({ error: "Payment test: no charge created" }, 409)
    }
    return reply([])
  })
  // Do not allow accidental network requests to messaging/payment providers during the test.
  await page.route(/https:\/\/(?!leader-bee-test\.supabase\.co)/, (route) =>
    route.abort(),
  )
  const origin = "http://127.0.0.1:8457"
  await page.goto(`${origin}/`)
  await page.getByRole('heading', { name: 'Find your Shakha / Location / Programme near you', exact: true }).waitFor()
  const search = page.getByRole('searchbox', { name: 'Search Shakhas, locations, and programs' })
  await search.fill('07751')
  const shakhaCard = page.locator('[data-result-type="shakha"]').filter({ hasText: 'Sri Krishna Shakha' })
  const eventCard = page.locator('[data-result-type="branch-program"]').filter({ hasText: 'Sri Krishna Shakha' })
  await shakhaCard.waitFor()
  await eventCard.waitFor()
  assert.equal(await shakhaCard.getAttribute('href'), '/usa-07751-sri-krishna-shakha')
  assert.equal(await eventCard.getAttribute('href'), '/register-leader-bee?shakha=usa-07751-sri-krishna-shakha')
  const programsRow = page.getByRole('region', { name: 'Programs for your family', exact: true })
  assert.equal(await programsRow.locator('[data-result-type]').first().getAttribute('data-result-type'), 'program-overview')
  // Specific program cards go directly to the event, without returning through a Shakha page.
  await eventCard.click()
  await page.getByRole('heading', { name: "Parent and Child Registration" }).waitFor()
  await page.getByText('Every Sunday · 4:00 PM–5:30 PM', { exact: true }).waitFor()
  assert.equal(new URL(page.url()).searchParams.get('shakha'), 'usa-07751-sri-krishna-shakha')
  // A public overview preserves the searched location, then opens registration directly.
  await page.goto(`${origin}/`)
  await search.fill('Morganville')
  await page.locator('[data-result-type="program-overview"]').filter({ hasText: 'Leader-BEE' }).click()
  await page.getByRole('heading', { name: 'Register at your local Leader-BEE program', exact: true }).waitFor()
  assert.equal(new URL(page.url()).searchParams.get('location'), 'Morganville')
  assert.equal(new URL(page.url()).searchParams.get('shakha'), null)
  assert.equal(await page.locator('[data-result-type="shakha"]').count(), 0)
  assert.equal(await page.locator('[data-result-type="program-overview"]').count(), 0)
  const registrationCard = page.locator('[data-result-type="branch-program"]').filter({ hasText: 'Sri Krishna Shakha' })
  assert.ok((await registrationCard.getAttribute('href')).endsWith('#registration'))
  await registrationCard.click()
  await page.getByRole('heading', { name: "Parent and Child Registration" }).waitFor()
  assert.equal(new URL(page.url()).hash, '#registration')
  await page.goBack()
  await page.getByRole('heading', { name: 'Register at your local Leader-BEE program', exact: true }).waitFor()
  // General program pages are independently shareable and never default to Morganville.
  await page.goto(`${origin}/register-leader-bee`)
  assert.equal(new URL(page.url()).search, '')
  await page.getByRole('heading', { name: 'Register at your local Leader-BEE program', exact: true }).waitFor()
  assert.equal(await page.locator('input[name="shakhaSlug"]').count(), 0)
  assert.equal(await page.getByText('Sample program', { exact: true }).count(), 0)
  await page.goto(`${origin}/programs/krishna-my-sharthi`)
  await page.getByRole('heading', { name: 'Krishna My Sharthi', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Copy public program link' }).waitFor()
  assert.ok((await page.locator('meta[property="og:url"]').getAttribute('content')).endsWith('/programs/krishna-my-sharthi'))
  await page.goto(`${origin}/join/programs/krishna-my-sharthi`)
  await page.getByRole('heading', { name: 'Krishna My Sharthi', exact: true }).waitFor()
  // Fixtures remain reachable for preview but do not appear as actual program search results.
  await page.goto(`${origin}/register-leader-bee?shakha=edison-nj`)
  await page
    .getByRole("heading", { name: "Parent and Child Registration" })
    .waitFor()
  assert.equal(await page.locator('button[type="submit"]').isDisabled(), true)
  assert.equal(calls.send, 0)
  await page.getByText("Coordinator & Share Kit", { exact: true }).click()
  assert.ok((await page.locator("details svg").count()) > 0)
  assert.ok(
    (
      await page
        .getByRole("textbox", { name: "Ready-to-share event text" })
        .inputValue()
    ).includes("shakha=edison-nj"),
  )
  const downloadPromise = page.waitForEvent("download")
  await page.getByRole("button", { name: "Download flyer" }).click()
  const download = await downloadPromise
  assert.equal(download.suggestedFilename(), "leader-bee-edison-nj.svg")
  await page.goto(`${origin}/register-leader-bee?shakha=not-found`)
  await page
    .getByText("That branch link was not found.", { exact: false })
    .waitFor()
  assert.equal(await page.locator('input[name="shakhaSlug"]').count(), 0)
  await page.goto(`${origin}/join/register-leader-bee?shakha=jersey-city-nj`)
  await page
    .getByRole("heading", { name: "Parent and Child Registration" })
    .waitFor()
  await page.goto(`${origin}/register-leader-bee?shakha=live-nj`)
  await page
    .getByRole("heading", { name: "Parent and Child Registration" })
    .waitFor()
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  )
  await page.screenshot({
    path: "/private/tmp/leader-bee-mobile.png",
    fullPage: true,
  })
  await page.getByLabel("Student name", { exact: true }).fill("Test Student")
  await page
    .getByRole("combobox", { name: "Grade for student 1", exact: true })
    .selectOption("Grade K")
  await page.getByLabel("Parent First Name").fill("Test")
  await page.getByLabel("Parent Last Name").fill("Parent")
  await page.getByLabel("City", { exact: true }).fill("Edison")
  await page.getByLabel("State", { exact: true }).fill("NJ")
  await page.getByLabel("Additional Notes").fill("Family note")
  await page.getByLabel("At least one parent will attend each session.").check()
  await page.getByRole('button', { name: 'Add another child' }).click()
  await page.getByLabel('Student name', { exact: true }).nth(1).fill('Older Child')
  await page.getByRole('combobox', { name: 'Grade for student 2', exact: true }).selectOption('Grade 12')
  await page.getByRole('button', { name: 'Continue to payment · $10.00', exact: true }).waitFor()
  await page.getByLabel("Email", { exact: true }).fill("test@example.com")
  await page.getByLabel("WhatsApp mobile number").fill("+1 201 555 0123")
  assert.equal(await page.locator('button[type="submit"]').isDisabled(), true)
  await page.getByRole("button", { name: "Send WhatsApp code" }).click()
  await page.getByLabel("Verification code", { exact: true }).fill("000000")
  await page.getByRole("button", { name: "Verify code", exact: true }).click()
  await page.getByRole("alert").waitFor()
  assert.equal(await page.locator('button[type="submit"]').isDisabled(), true)
  await page.getByLabel("Verification code", { exact: true }).fill("123456")
  await page.getByRole("button", { name: "Verify code", exact: true }).click()
  await page.getByText("WhatsApp number verified", { exact: true }).waitFor()
  await page.getByRole("button", { name: "Continue to payment · $10.00" }).click()
  await page.getByRole('heading', { name: 'Thank You for Registering!' }).waitFor()
  await page.getByRole('alert').waitFor()
  assert.equal(calls.payments[0].registrationId, id)
  await page.getByRole('button', { name: 'Open your curriculum & payment status' }).click()
  await page
    .getByRole("heading", { name: "Live Test Shakha curriculum" })
    .waitFor()
  await page.getByRole("button", { name: "Week 10", exact: true }).click()
  await page.getByRole("heading", { name: "Lesson 10" }).waitFor()
  assert.equal(calls.registrations.length, 1)
  assert.equal(calls.registrations[0].p_shakha_slug, "live-nj")
  assert.equal(calls.registrations[0].p_parent_phone, "+12015550123")
  assert.equal(calls.registrations[0].p_children[1].grade, 'Grade 12')
  assert.equal(calls.registrations[0].p_details.city, 'Edison')
  assert.equal(calls.registrations[0].p_details.parentAttendanceConsent, true)
  assert.equal(new URL(page.url()).searchParams.get("view"), "curriculum")
  await page.getByRole("button", { name: "Open secure payment" }).click()
  await page.getByRole("alert").waitFor()
  assert.equal(calls.payments[0].registrationId, id)
  await page.goto(`${origin}/usa-07751-sri-krishna-shakha`)
  await page
    .getByRole("link", { name: "Leader-BEE at Sri Krishna Shakha ↗" })
    .waitFor()
  assert.ok(
    (
      await page
        .getByRole("link", { name: "Leader-BEE at Sri Krishna Shakha ↗" })
        .getAttribute("href")
    ).includes("shakha=usa-07751-sri-krishna-shakha"),
  )
  await page.goto(`${origin}/`)
  await page.getByRole('heading', { name: 'Find your Shakha / Location / Programme near you', exact: true }).waitFor()
  assert.equal(await page.getByRole('heading', { name: 'Select Your Branch / Location', exact: true }).count(), 0)
  await page.getByRole('searchbox', { name: 'Search Shakhas, locations, and programs' }).fill('07751')
  await page.locator('[data-result-type="shakha"]').filter({ hasText: 'Sri Krishna Shakha' }).waitFor()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  await page.locator('#find').screenshot({ path: '/private/tmp/shakha-finder-mobile.png' })
  assert.deepEqual(errors, [])
  console.log(
    "PASS: selector, samples, invalid slug, /join fallback, share kit, flyer download, mobile layout, OTP gate, registration binding, curriculum, payment handoff, and Shakha-page integration.",
  )
} finally {
  await browser?.close()
  await server.close()
}
