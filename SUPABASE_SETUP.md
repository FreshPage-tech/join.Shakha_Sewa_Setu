# Supabase Security Setup

This app now uses Supabase for real admin protection and data privacy.

## 1. Create Supabase project

1. Create a Supabase project.
2. Copy project URL and anon key.

## 2. Configure frontend env

Create `.env` using `.env.example`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

For one-time seeding script, set these in shell while running it:

```
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

## 3. Run database migration

Run SQL from:

- `supabase/migrations/20260717_admin_secure_setup.sql`

This creates:

- `admin_users`
- `interested_people`
- `shakhas_admin`
- RLS policies (admin-only reads/updates, public registration inserts)

## 4. Create admin auth user

In Supabase Auth:

1. Create user with email/password for admin login.
2. Seed admin mapping by email:

```
pnpm run seed:admin -- --email your-admin-email@example.com --mobile +919825311888
```

If mobile is omitted, default is `+919825311888`.

## 5. Optional: seed shakha table

If `shakhas_admin` has no rows, public UI falls back to bundled shakha list.
To fully manage data in DB, insert rows into `shakhas_admin` once and then maintain from `/admin-join-app`.

One-time seed command (replaces existing rows):

```
pnpm run seed:shakhas
```

To append without deleting existing rows:

```
pnpm run seed:shakhas -- --append
```

## 6. Admin login

Use `/admin-join-app`.

- Login is Supabase email + password (not hardcoded in frontend)
- Access is granted only if user exists in `public.admin_users`

## 7. Reliable WhatsApp / email link previews

This project now pre-generates static share pages for each Shakha in format:

`https://join.shakhasewasetu.com/countryname-zipcode-shakhaname`

By default country prefix is `usa`. To change it for generation:

```
COUNTRY_SLUG=india pnpm run generate:share-pages
```

What happens:

- Script: `scripts/generate-shakha-share-pages.mjs`
- Output: static HTML pages in `public/<slug>/index.html` with crawler-readable meta tags.
- Build runs this automatically via `prebuild`.
- `update:shakhas` also regenerates pages automatically.
- Unknown path fallback page is generated as `public/404.html` and redirects to `/register`.

## Security model

- Interested people data: insert allowed to public, read allowed only to admin users.
- Shakha data in DB: read/write restricted to admin users by RLS.
- No sensitive registration data stored in browser localStorage.
