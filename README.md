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
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (or
   `supabase db push` with the CLI).
3. Copy the project URL and keys into `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # optional, server-only
```

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

## Content

All copy lives in `src/lib/content.ts`. Organisations, people, metrics and
testimonials are **placeholder content** for the site build — replace them with
real material before launch.

## Scripts

```bash
npm run dev     # dev server
npm run build   # production build (also runs TypeScript)
npm start       # serve the production build
npm run lint    # eslint
```

## Accessibility & motion

Reduced-motion is respected throughout: reveals render in their final state,
the halftone field paints a single static frame, and the marquee stops. Forms
use real labels, `aria-invalid`/`aria-describedby` on errors and a polite live
region for status. Carousels are native scroll containers so touch, keyboard
and screen readers work without extra wiring.
