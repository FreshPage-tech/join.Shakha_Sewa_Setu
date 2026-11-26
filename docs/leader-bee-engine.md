# Leader-BEE tenant engine

`/register-leader-bee` stays a common program page. Its **Start close to home** finder searches city, state, ZIP, Shakha, and program names. Matching Shakhas appear in the first row and programs in the second. The same finder is used on the home page, before any registration fields. Unknown slugs show the same picker with a recovery message. `/join/register-leader-bee` is supported as a deployment-base fallback.

A branch link is `/register-leader-bee?shakha=morganville-nj`. Existing Shakha pages link to the engine using their existing `usa-ZIP-name` slug. Set `shakha_id` on a published program branch to the existing Shakha record's `id` to resolve that link to its program configuration. Short, human-readable slugs are the branch share URLs; no external URL-shortening service is involved.

## Data and publishing

- `src/data/shakhaDirectory.ts` contains the three requested fictional fixtures: Keshav / Morganville, Madhav / Edison, and Vivekanand / Jersey City. These do not replace the existing Sri Krishna Shakha record.
- `leader_bee_branches` supplies production configuration and takes precedence over matching fixtures. Its name, address, timing, start date, contact, fee, and registration status are server-owned.
- Sample branches have `is_demo=true` and `registration_enabled=false`. The UI labels them and disables OTP, registration, and direct contact links. Actual event details must be confirmed before setting `is_demo=false` and `registration_enabled=true`.
- Existing Shakhas without program configuration remain discoverable, with registration closed and their real contact details available.
- Only trusted SQL/service-role administration may change branch configuration. Never expose the service-role key in Vite variables.

To publish a real branch, insert or update its `leader_bee_branches` row with confirmed event/contact values, `shakha_id` if applicable, and a fee in cents. Keep the slug stable after registrations exist. The default $10 per child is retained; the database computes the total, not the browser.

## Deployment prerequisites

Apply the existing registration migration and these additional migrations in order:

1. `20260909120000_leader_bee_shakha.sql`
2. `20260909140000_leader_bee_engine.sql`

The second migration adds the branch directory, phone-verification binding, curriculum storage, immutable registration details, and registration/access RPCs. It seeds a starter ten-week national curriculum that coordinators should review. Add rows to `leader_bee_curriculum` with a branch slug and week 1–10 to override individual national weeks for that branch. Dates shown in the viewer advance weekly from the branch start date; holiday changes require coordinator confirmation.

Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the frontend. Enable Supabase phone authentication with **Twilio or Twilio Verify configured for WhatsApp**. This implementation calls `signInWithOtp({ phone, options: { channel: 'whatsapp' } })`, then `verifyOtp({ phone, token, type: 'sms' })`. The latter is the Supabase verification type for phone OTP even when delivery is WhatsApp. Existing custom WhatsApp OTP tables are not used. Provider delivery, templates, rate limits, and any project-level CAPTCHA configuration must be completed in the Supabase/provider settings.

Reference: https://supabase.com/docs/guides/auth/phone-login

Deploy the functions together with the migration:

- `leader-bee-verified-checkout`: authenticated checkout using the saved registration's owner and amount.
- `create-leader-bee-checkout` and `save-leader-bee-registration`: updated legacy endpoints reject engine branches and verified registrations.
- `leader-bee-stripe-webhook`: validates the paid session's amount, currency, session reference, and tenant before updating payment status.

Set backend secrets `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `LEADER_BEE_SITE_URL`. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to deployed functions. `LEADER_BEE_SITE_URL` must include the deployment base, for example `https://shakhasewasetu.com/join`. Configure the Stripe webhook for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.

The checkout function validates the bearer token against Supabase Auth itself. The webhook uses Stripe's signature, not a user token. No live migration, provider setup, function deployment, OTP send, or Stripe charge is performed by the local tests.

## Registration and access

1. Choose a program from the second row and enter student names/grades plus parent name, email, and WhatsApp number with country code.
2. Request and verify the WhatsApp code. Changing the number clears the UI verification state. Provider-side expiry/rate limits remain authoritative.
3. `register_leader_bee_verified` checks `auth.uid()`, the confirmed phone in `auth.users`, the exact parent phone, a live branch, and every child's grade/name. The submission UUID makes retries idempotent. The stored row includes `user_id`, `phone_verified_at`, and `shakha_slug`.
4. The URL changes to the selected branch with `view=curriculum`. `get_leader_bee_curriculum` independently checks enrollment for that branch, including on reload or a manually edited URL. It returns ten weeks with branch overrides. A URL or browser flag alone cannot grant access.
5. Payment is separate from registration. The viewer offers checkout for the saved registration. Checkout uses the persisted price, checks ownership, reuses an open session, and refuses a second payment for paid registrations. Returning from Stripe does not itself mark payment as successful; the signed webhook does that.

Authenticated parents do not gain direct access to registration tables or curriculum tables. The existing admin panel keeps its admin-only read policy and now displays/searches/exports Shakha slugs.

## Validation

- `pnpm exec tsc --noEmit`
- `pnpm exec vite build`
- `node --test tests/leader-bee-db.test.mjs`: migrations execute against isolated PostgreSQL (PGlite), then verify anonymous denial, phone matching, closed/unknown branches, K–8 validation, idempotency, tenant isolation, curriculum overrides, and immutable registration data.
- `node tests/leader-bee-browser.mjs`: temporary Vite server and Chrome; all OTP, registration, curriculum, and payment API responses are mocked. Set `CHROME_PATH` if Chrome is installed elsewhere. No live external writes are made.
- `deno test --allow-env tests/leader-bee-payments.test.ts`: mocked Auth, Stripe, and database requests check checkout ownership, trusted pricing, duplicate-charge protection, and signed webhook validation.
- `deno check supabase/functions/leader-bee-verified-checkout/index.ts supabase/functions/create-leader-bee-checkout/index.ts supabase/functions/save-leader-bee-registration/index.ts supabase/functions/leader-bee-stripe-webhook/index.ts`

## Shared published registration form (2026-09-11)

Every branch uses `LeaderBeeRegistration`: parent first/last name, email, verified WhatsApp phone, children in grades K–12, city/state, optional notes, and required parent attendance consent. The selected branch supplies its name, venue, schedule, and configured fee. Grades K–8 count toward the fee; grades 9–12 join the free host-arranged group. Admin records and CSV include the new family details.

Apply `20260911120000_leader_bee_shared_registration.sql` before releasing this frontend. It adds `registration_details` and a seven-argument registration RPC; the six-argument RPC stays available for older clients. Then deploy `create-leader-bee-checkout`, including its imported verified checkout handler, before the frontend. This is the same central endpoint named in the live page's public config. A `registrationId` request uses authenticated ownership and the saved amount; legacy payload handling remains available for the published form. All branches use the same configured Stripe account, with the branch recorded in metadata and return links.

The form saves once, opens checkout for a paid registration, and offers a retry if checkout fails. Free registrations show confirmation without checkout. The curriculum/payment-status link remains available after saving. The shared confirmation and share-kit text use local branch details. No outgoing email or WhatsApp notification delivery was added; share actions prepare messages for the user to send.
