# Shakha scraper and Supabase sync

## Setup

1. Install dependencies: `pnpm install`.
2. Install the Chromium runtime once: `pnpm exec playwright install chromium`.
3. Apply `supabase/migrations/20260816_create_shakhas.sql` with the Supabase CLI or SQL editor.
4. Copy `.env.scraper.example` to `.env.scraper` and fill in the service-role credentials. Never expose the service-role key in a `VITE_` variable or commit it.

Node reads the environment file directly, so no dotenv package is required.

## Run

- Preview normalized JSON without writing: `pnpm run scrape:shakhas`
- Scrape and upsert into Supabase: `pnpm run sync:shakhas`
- Type-check the Node pipeline: `pnpm run typecheck:scraper`

The crawler defaults to `https://join.shakhasewasetu.com/shakha`, follows visible Next controls, waits for network idle, de-duplicates records in memory, and upserts in batches. Override `SHAKHA_CARD_SELECTOR` and `SHAKHA_NEXT_SELECTOR` when the target markup uses application-specific selectors.

The migration enables RLS without a public policy. The sync therefore requires `SUPABASE_SERVICE_ROLE_KEY`; the key must only be used in this trusted server-side job.
