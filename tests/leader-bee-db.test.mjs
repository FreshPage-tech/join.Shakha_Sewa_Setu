import { test, before, after } from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { PGlite } from "@electric-sql/pglite"

const db = new PGlite()
const userA = "11111111-1111-4111-8111-111111111111"
const userB = "22222222-2222-4222-8222-222222222222"
const submission = "33333333-3333-4333-8333-333333333333"
const login = async (id) => {
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [
    id || "",
  ])
}
const register = (
  slug = "live-nj",
  phone = "+12015550123",
  key = submission,
  children = [{ name: "Test Student", grade: "Grade K" }],
) =>
  db.query(
    "select public.register_leader_bee_verified($1::uuid,$2,$3,$4,$5,$6::jsonb) as id",
    [
      key,
      slug,
      "Test Parent",
      "test@example.com",
      phone,
      JSON.stringify(children),
    ],
  )

before(async () => {
  await db.exec(`create role anon; create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key, phone text, phone_confirmed_at timestamptz);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
    create table public.admin_users (user_id uuid);
    create function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;`)
  for (const path of [
    "20260831_create_leader_bee_registrations.sql",
    "20260909120000_leader_bee_shakha.sql",
    "20260909140000_leader_bee_engine.sql",
    "20260911120000_leader_bee_shared_registration.sql",
  ])
    await db.exec(
      await readFile(
        new URL(`../supabase/migrations/${path}`, import.meta.url),
        "utf8",
      ),
    )
  await db.query(
    "insert into auth.users values ($1,'12015550123',now()),($2,'12015550456',now())",
    [userA, userB],
  )
  await db.exec(
    "insert into public.leader_bee_branches(slug,name,address,timing,registration_enabled) values ('live-nj','Live Shakha','Test venue','Sunday',true),('other-nj','Other Shakha','Other venue','Saturday',true)",
  )
})
after(async () => db.close())

test("anonymous registration is denied", async () => {
  await login("")
  await assert.rejects(register(), /Verify your WhatsApp/)
})
test("confirmed phone must match parent phone", async () => {
  await login(userA)
  await assert.rejects(register("live-nj", "+12015550999"), /must match/)
})
test("unknown and sample branches cannot accept registration", async () => {
  await login(userA)
  await assert.rejects(register("missing"), /not open/)
  await assert.rejects(register("morganville-nj"), /not open/)
})
test("invalid students are rejected rather than silently removed", async () => {
  await login(userA)
  await assert.rejects(
    register("live-nj", "+12015550123", submission, [
      { name: "Student", grade: "Grade 9" },
    ]),
    /grade K/,
  )
  await assert.rejects(
    register("live-nj", "+12015550123", submission, []),
    /between 1 and 10/,
  )
})
test("verified registration stores tenant, user, phone and trusted price; retry is idempotent", async () => {
  await login(userA)
  const first = await register()
  const second = await register()
  assert.equal(first.rows[0].id, second.rows[0].id)
  const { rows } = await db.query(
    "select * from public.leader_bee_registrations where submission_key=$1",
    [submission],
  )
  assert.equal(rows.length, 1)
  assert.equal(rows[0].shakha_slug, "live-nj")
  assert.equal(rows[0].user_id, userA)
  assert.equal(rows[0].amount_cents, 1000)
  assert.ok(rows[0].phone_verified_at)
})
test("curriculum requires enrollment for the selected branch and supports branch overrides", async () => {
  await login(userA)
  const result = await db.query(
    "select * from public.get_leader_bee_curriculum('live-nj')",
  )
  assert.equal(result.rows.length, 10)
  await assert.rejects(
    db.query("select * from public.get_leader_bee_curriculum('other-nj')"),
    /Register with a verified/,
  )
  await db.exec(
    "insert into public.leader_bee_curriculum values ('live-nj',1,'Local welcome','Local objective','[\"Local activity\"]')",
  )
  const overridden = await db.query(
    "select * from public.get_leader_bee_curriculum('live-nj')",
  )
  assert.equal(overridden.rows.length, 10)
  assert.equal(overridden.rows[0].title, "Local welcome")
})
test("another verified user cannot read curriculum or reuse a submission ID", async () => {
  await login(userB)
  await assert.rejects(
    db.query("select * from public.get_leader_bee_curriculum('live-nj')"),
    /Register with a verified/,
  )
  await assert.rejects(register("live-nj", "+12015550456"), /already in use/)
})
test("legacy updates cannot replace verified tenant, parent, student or price", async () => {
  await assert.rejects(
    db.query(
      "update public.leader_bee_registrations set shakha_slug=$1 where submission_key=$2",
      ["other-nj", submission],
    ),
    /cannot be replaced/,
  )
  await assert.rejects(
    db.query(
      "update public.leader_bee_registrations set amount_cents=1 where submission_key=$1",
      [submission],
    ),
    /cannot be replaced/,
  )
  await db.query(
    "update public.leader_bee_registrations set payment_status='paid' where submission_key=$1",
    [submission],
  )
})
test("anonymous and authenticated roles cannot read curriculum directly or write branch data", async () => {
  await db.exec("set role anon")
  await assert.rejects(
    db.query("select * from public.leader_bee_curriculum"),
    /permission denied/,
  )
  await assert.rejects(
    db.query("update public.leader_bee_branches set registration_enabled=true"),
    /permission denied/,
  )
  await db.exec("reset role; set role authenticated")
  await assert.rejects(
    db.query("select * from public.leader_bee_curriculum"),
    /permission denied/,
  )
  await db.exec("reset role")
})

test("payment status is visible only to the registered parent and selected tenant", async () => {
  await login(userA)
  const own = await db.query(
    "select * from public.get_leader_bee_registration_status('live-nj')",
  )
  assert.equal(own.rows.length, 1)
  assert.equal(own.rows[0].payment_status, "paid")
  assert.equal(own.rows[0].amount_cents, 1000)
  const otherTenant = await db.query(
    "select * from public.get_leader_bee_registration_status('other-nj')",
  )
  assert.equal(otherTenant.rows.length, 0)
  await login(userB)
  const otherParent = await db.query(
    "select * from public.get_leader_bee_registration_status('live-nj')",
  )
  assert.equal(otherParent.rows.length, 0)
})

const details = { parentFirstName: 'Test', parentLastName: 'Parent', city: 'Edison', state: 'NJ', notes: 'Family note', parentAttendanceConsent: true }
const registerFamily = (children, extra = details, key = crypto.randomUUID()) => db.query(
  'select public.register_leader_bee_verified($1::uuid,$2,$3,$4,$5,$6::jsonb,$7::jsonb) as id',
  [key, 'other-nj', 'Test Parent', 'test@example.com', '+12015550123', JSON.stringify(children), JSON.stringify(extra)],
)
test('shared form stores family fields and charges only K–8 children', async () => {
  await login(userA)
  const key = crypto.randomUUID()
  const children = [{ name: 'Younger Child', grade: 'Grade K' }, { name: 'Older Child', grade: 'Grade 12' }]
  const result = await registerFamily(children, details, key)
  const retry = await registerFamily(children, details, key)
  assert.equal(result.rows[0].id, retry.rows[0].id)
  const { rows: [row] } = await db.query('select * from leader_bee_registrations where id=$1', [result.rows[0].id])
  assert.equal(row.child_count, 2)
  assert.equal(row.participant_count, 1)
  assert.equal(row.amount_cents, 1000)
  assert.equal(row.payment_status, 'pending')
  assert.equal(row.shakha_slug, 'other-nj')
  assert.deepEqual(row.registration_details, details)
  await assert.rejects(db.query("update leader_bee_registrations set registration_details='{}' where id=$1", [row.id]), /cannot be replaced/)
})
test('grades 9–12 family requires no payment', async () => {
  await login(userA)
  const result = await registerFamily([{ name: 'Older Child', grade: 'Grade 9' }])
  const { rows: [row] } = await db.query('select * from leader_bee_registrations where id=$1', [result.rows[0].id])
  assert.equal(row.amount_cents, 0)
  assert.equal(row.participant_count, 0)
  assert.equal(row.payment_status, 'not_required')
})
test('shared form enforces attendance, location, valid grades and verified phone', async () => {
  await login(userA)
  const children = [{ name: 'Child Name', grade: 'Grade 8' }]
  await assert.rejects(registerFamily(children, { ...details, parentAttendanceConsent: false }), /confirm parent attendance/)
  await assert.rejects(registerFamily(children, { ...details, city: '' }), /city/)
  await assert.rejects(registerFamily([{ name: 'Child Name', grade: 'Grade 13' }]), /grade K–12/)
  await login(userB)
  await assert.rejects(registerFamily(children), /must match/)
})
