# Allow AI Africa

Marketing site for **Allow AI Africa** — built with Next.js (App Router) and
Supabase.

The design follows the two site walkthroughs supplied as reference: dark teal
stacked rounded panels, halftone / dot-matrix generative artwork, pill eyebrow
labels, and scroll-driven reveals rather than hard section cuts.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19, Turbopack) |
| Styling | Tailwind CSS v4 (tokens in `src/app/globals.css`) |
| Motion | `motion` (Framer Motion) |
| Backend | Supabase (Postgres + RLS) |
| Validation | Zod, shared by both forms |

There are **no external image or font assets beyond Google Fonts** — every
piece of artwork on the page is generated in code (seeded SVG dot matrices, a
canvas halftone field, CSS gradient flows).

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev                  # http://localhost:3000
```

The site renders fully without Supabase configured. The two forms are the only
thing that needs it — they return a clear "backend not configured" message
instead of failing silently.

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Apply the schema, either way round:

   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```

   or paste `supabase/migrations/0001_init.sql` into the SQL editor.
3. Put the project URL and keys in `.env.local` (gitignored):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # optional, server-only
   ```

4. Confirm the wiring:

   ```bash
   npm run supabase:check              # connectivity, schema, RLS posture
   npm run supabase:check -- --write   # plus a full insert round-trip
   ```

   The read-only run is safe against a live project. `--write` inserts marked
   rows and deletes them again using the service role; without that key it
   tells you which rows to remove by hand.

   The check verifies the security property that matters most: that the anon
   key can insert but **cannot read back** what anyone has submitted. It fails
   loudly if a `SELECT` policy has crept in. It also refuses to report anything
   below connectivity if the project is unreachable — a transport error has no
   Postgres error code, and treating one as "the database refused me" would
   report a broken connection as healthy RLS.

### Data model

Two write-only tables:

| Table | Written by | Purpose |
|---|---|---|
| `contact_submissions` | contact form | Inbound leads |
| `newsletter_subscribers` | footer form | Newsletter signups |

**Row level security is on for both, with an `INSERT` policy only.** There is
no `SELECT`, `UPDATE` or `DELETE` policy, so even with the anon key a visitor
can add a row and nothing more — reading submissions requires the service role
or the Supabase dashboard. Both tables carry `CHECK` constraints on email
shape, message length and status, and `newsletter_subscribers` has a
case-insensitive unique index so `Ada@x.com` and `ada@x.com` are one person.

Writes go through server actions in `src/app/actions.ts`, which use the service
role key when present so server-controlled columns (`source`, `user_agent`)
cannot be forged by the client.

### Anti-spam

Both forms carry an off-screen honeypot field. It is deliberately *not* part of
the Zod schemas: a bot that fills it gets an ordinary success response and
nothing is written, rather than a field-level error that would tell it which
input to skip next time.

## Project structure

```
src/
  app/
    layout.tsx           fonts, metadata, viewport
    page.tsx             composes the panel stack (order = z-order)
    actions.ts           server actions -> Supabase
    globals.css          design tokens + the stacked-panel mechanic
  components/
    art/                 generated artwork (halftone canvas, dot matrix, gradients)
    layout/              Panel shell, nav, StackFit
    motion/              Reveal, LineReveal/WordReveal, CountUp
    sections/            one file per panel
    ui/                  atoms, form field, carousel, social icons
  lib/
    content.ts           all site copy in one place
    rng.ts               seeded PRNG for the generative art
    supabase/server.ts   server client (null when unconfigured)
    validation.ts        Zod schemas
supabase/migrations/     SQL schema + RLS
```

## How the stacked-panel scroll works

Each section is a rounded panel that pins to the top of the viewport while the
next one scrolls up over it, so the page background shows through at the
rounded corners and sections read as cards being dealt.

That only works while a panel fits in one viewport. `StackFit`
(`src/components/layout/StackFit.tsx`) measures every panel and marks any that
are taller, which CSS returns to normal flow — otherwise their lower half would
pin off-screen and be unreachable. Below `md` the pinning is disabled entirely
in favour of a small negative overlap.

Motion note: reveals that translate an element out of its own
`overflow-hidden` box must drive viewport detection from the **parent**, since
an observer on the moved child measures zero intersection and would never
fire. `LineReveal` does this with variants.

## Deploying

**See [`docs/DEPLOY.md`](docs/DEPLOY.md)** for the full runbook with this
project's Supabase ref and Vercel scope already filled in.

The site is a standard Next.js App Router app with no custom server, so it
deploys to Vercel unchanged.

1. **Import the repo** at [vercel.com/new](https://vercel.com/new) and pick the
   `claude/allow-ai-africa-nextjs-mnwjfw` branch (or merge it first). Vercel
   detects Next.js — no build settings to change.
2. **Add environment variables** in *Settings → Environment Variables*:

   | Variable | Scope | Required |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | all | for the forms |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | all | for the forms |
   | `SUPABASE_SERVICE_ROLE_KEY` | all | recommended, server-only |
   | `NEXT_PUBLIC_SITE_URL` | production | recommended |

   The first deploy succeeds with none of these set — the page renders and the
   forms report that the backend is not configured. Add them and redeploy when
   the Supabase project is ready.
3. **Run the migration** (`supabase/migrations/0001_init.sql`) against your
   Supabase project before pointing real traffic at the forms.
4. **Set `NEXT_PUBLIC_SITE_URL`** to the final domain once DNS is attached, so
   the canonical URL, Open Graph tags and sitemap all agree.

### What the deployment already handles

- **Security headers** are set in `next.config.ts` for every route
  (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy`, HSTS), and `X-Powered-By` is suppressed. The policy can
  be strict because the page loads no third-party script, iframe or remote
  asset — the artwork is generated in code and next/font self-hosts the fonts.
- **Preview deployments exclude themselves from search.** On any non-production
  Vercel environment `robots.txt` returns `Disallow: /` and the page carries
  `noindex, nofollow`, and the canonical URL falls back to the deployment's own
  `VERCEL_URL` rather than advertising the production domain.
- **`robots.txt` and `sitemap.xml`** are generated as static routes.
- **A branded 404** replaces the framework default.

Nothing here is Vercel-specific beyond `VERCEL_ENV`/`VERCEL_URL` detection, so
any Node host that runs `next build && next start` works; set
`NEXT_PUBLIC_SITE_URL` explicitly there.

## Continuous integration

`docs/github-actions-ci.yml` runs typecheck, lint, the unit tests and the
end-to-end suite on every push. Copy it into place to enable it:

```bash
mkdir -p .github/workflows
cp docs/github-actions-ci.yml .github/workflows/ci.yml
```

It ships outside `.github/workflows` because creating files there requires a
token with the GitHub `workflow` scope, which the branch push did not have.

The e2e job runs with no Supabase credentials on purpose — that is the state a
first deploy is in, and the site must build and serve without them.

## Content

All copy lives in `src/lib/content.ts`. Organisations, people, metrics and
testimonials are **placeholder content** for the site build — replace them with
real material before launch.

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build (also runs TypeScript)
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # unit tests (Node's built-in runner, no extra deps)
npm run test:e2e   # Playwright end-to-end suite
npm run test:all   # everything above, in order
```

## Tests

**Unit** (`tests/unit`, 27 tests) run on Node's native test runner and type
stripping — no Jest, no Vitest, no transform step. They cover the validation
schemas (including that the honeypot stays *outside* them), the seeded PRNG's
determinism, the artwork variant cycling, and canonical-URL resolution across
production and preview environments.

**End-to-end** (`tests/e2e`, 18 tests) run against a real production build,
because the security headers, the static `robots.txt`/`sitemap.xml` routes and
the genuine 404 status only exist there. They cover the panel stack, both
carousels, the technology selector, the FAQ accordion, the testimonial
swapper, the mega-menu, anchor navigation in both directions, the contact and
newsletter forms, and a small accessibility audit.

Two things about testing this layout are worth knowing before editing the
suite, both of which cost real debugging time:

- **`offsetTop` reflects the sticky shift in Chrome.** A panel already scrolled
  past reports the wrong position, so `scrollToPanel` resets to 0 before
  measuring.
- **Playwright's auto scroll-into-view fights sticky panels.** It moves the
  page off the panel's pinned position, where the next panel covers the target,
  so in-panel controls are clicked at real coordinates via `clickAt`.

The viewport is pinned to 1440x900 inside the project's `use` block. It has to
be set there rather than globally: project-level `use` overrides the global
one, and the `Desktop Chrome` preset carries its own 1280x720 viewport — at
which the Solutions carousel arrows fall below the fold.

## Accessibility & motion

Reduced-motion is respected throughout: reveals render in their final state,
the halftone field paints a single static frame, and the marquee stops. Forms
use real labels, `aria-invalid`/`aria-describedby` on errors and a polite live
region for status. Carousels are native scroll containers so touch, keyboard
and screen readers work without extra wiring.
