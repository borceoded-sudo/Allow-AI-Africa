# Go live: Supabase + Vercel

Every command here runs **on your machine**, not in the build sandbox. The
sandbox this project was built in is blocked from reaching `supabase.co` and
`vercel.com` at the network layer (the proxy answers `403` to `CONNECT`), so
the two authenticated steps have to come from you.

Known values, already filled in below:

| | |
|---|---|
| Supabase project ref | `coiogiawfmdxpqzapbae` |
| Supabase URL | `https://coiogiawfmdxpqzapbae.supabase.co` |
| Vercel scope | `youcomevvome-3861s-projects` |

The two API keys are **not** in this repo and must not be committed. Both come
from **Dashboard → Project Settings → API**.

---

## 1. Apply the database schema

```bash
npm i -g supabase
supabase login
supabase link --project-ref coiogiawfmdxpqzapbae
supabase db push
```

`supabase db push` applies `supabase/migrations/0001_init.sql`, creating both
tables with row level security enabled and insert-only policies.

Prefer the browser? Paste that file into **Dashboard → SQL Editor** and run it.
It is idempotent, so running it twice is harmless.

## 2. Wire it up locally and prove it works

```bash
cp .env.example .env.local
```

Fill in the two keys in `.env.local` (already gitignored — never commit it):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://coiogiawfmdxpqzapbae.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Then verify, rather than assume:

```bash
npm run supabase:check              # connectivity, schema, RLS posture
npm run supabase:check -- --write   # full insert round-trip, cleans up after itself
```

A clean run ends with `Supabase is wired up correctly.` The check that matters
most is that the anon key **cannot read back** submissions — if a `SELECT`
policy ever creeps in, this fails loudly.

Now run the site for real:

```bash
npm run dev     # http://localhost:3000
```

Submit the contact form, then confirm the row landed in **Dashboard → Table
Editor → contact_submissions**.

## 3. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel link --scope youcomevvome-3861s-projects
```

Add the environment variables. `vercel env add` reads the value from stdin, so
nothing sensitive ends up in your shell history:

```bash
printf '%s' 'https://coiogiawfmdxpqzapbae.supabase.co' | vercel env add NEXT_PUBLIC_SUPABASE_URL production
printf '%s' '<anon public key>'  | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
printf '%s' '<service_role key>' | vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

Repeat with `preview` in place of `production` if you want preview deployments
to have working forms too.

Ship it:

```bash
vercel deploy --prod
```

Or connect the repo at [vercel.com/new](https://vercel.com/new) and pick the
`claude/allow-ai-africa-nextjs-mnwjfw` branch — Vercel detects Next.js and
needs no build settings.

## 4. After the first deploy

Set the canonical origin to the real domain once DNS is attached, so the
canonical URL, Open Graph tags and sitemap all agree:

```bash
printf '%s' 'https://your-domain.com' | vercel env add NEXT_PUBLIC_SITE_URL production
vercel deploy --prod
```

Then check the deployed site:

```bash
curl -sI https://your-domain.com | grep -iE 'x-frame-options|strict-transport|x-powered-by'
curl -s  https://your-domain.com/robots.txt
```

Expect `X-Frame-Options: DENY`, an HSTS header, **no** `X-Powered-By`, and a
`robots.txt` that allows crawling and points at the sitemap. Preview
deployments should instead return `Disallow: /`.

---

## Notes

- **The first deploy works with no environment variables at all.** The page
  renders fully; only the two forms report that the backend is not configured.
  So you can deploy first and wire Supabase up afterwards.
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY` is meant to be public.** It ships to the
  browser and is governed by RLS — that is why the insert-only policies matter.
- **`SUPABASE_SERVICE_ROLE_KEY` bypasses RLS.** Server-side only. Never prefix
  it with `NEXT_PUBLIC_`, never commit it, and rotate it if it ever leaks.
- **Content is still placeholder.** Everything in `src/lib/content.ts` —
  organisations, people, metrics, testimonials — is invented for the build and
  should be replaced before this is public.
