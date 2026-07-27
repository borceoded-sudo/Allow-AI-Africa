/**
 * Verifies that this app is correctly wired to a Supabase project.
 *
 *   npm run supabase:check          # read-only: connectivity, schema, RLS posture
 *   npm run supabase:check -- --write   # also does a full insert round-trip
 *
 * Read-only by default because the write path puts real rows in your table.
 * The --write run marks its rows and deletes them again with the service role.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const WRITE = process.argv.includes("--write");
const MARKER = `check+${Date.now()}@allowai.invalid`;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let failures = 0;

function pass(msg: string) {
  console.log(`  \x1b[32mPASS\x1b[0m  ${msg}`);
}
function fail(msg: string, detail?: string) {
  failures++;
  console.log(`  \x1b[31mFAIL\x1b[0m  ${msg}`);
  if (detail) console.log(`        ${detail}`);
}
function info(msg: string) {
  console.log(`  \x1b[90m....\x1b[0m  ${msg}`);
}

function heading(msg: string) {
  console.log(`\n\x1b[1m${msg}\x1b[0m`);
}

if (!url || !anonKey) {
  console.error(
    "\nMissing credentials. Set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (see .env.example), " +
      "then run this again.\n",
  );
  process.exit(1);
}

const anon = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const admin: SupabaseClient | null = serviceKey
  ? createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;

console.log(`\nChecking ${url}`);

/**
 * A transport failure has no Postgres error code. Distinguishing it matters:
 * an unreachable project must never be mistaken for "the database refused me",
 * which would report a broken connection as healthy RLS.
 */
function isTransportError(error: { code?: string; message: string } | null) {
  return Boolean(error && !error.code);
}

// ---------------------------------------------------------------------------
heading("Connectivity");

{
  const { error } = await anon
    .from("contact_submissions")
    .select("id", { head: true })
    .limit(1);

  if (isTransportError(error)) {
    fail(
      "cannot reach the Supabase project",
      `${error!.message} — check NEXT_PUBLIC_SUPABASE_URL and your network.`,
    );
    console.log(
      "\n\x1b[31mAborting: nothing below this can be trusted " +
        "while the project is unreachable.\x1b[0m\n",
    );
    process.exit(1);
  }
  pass("project is reachable");
}

// ---------------------------------------------------------------------------
heading("Schema");

for (const table of ["contact_submissions", "newsletter_subscribers"] as const) {
  const { error } = await anon.from(table).select("id").limit(1);

  if (!error) {
    pass(`${table} exists and is readable without error`);
  } else if (error.code === "42P01") {
    fail(
      `${table} does not exist`,
      "Run supabase/migrations/0001_init.sql against this project.",
    );
  } else {
    fail(`${table} returned ${error.code ?? "an error"}`, error.message);
  }
}

// ---------------------------------------------------------------------------
heading("Row level security");

/*
 * The anon role has INSERT and nothing else. A select must therefore come back
 * empty even when the table has rows — if it returns any, a SELECT policy has
 * been added and submissions are publicly readable.
 */
for (const table of ["contact_submissions", "newsletter_subscribers"] as const) {
  const { data, error } = await anon.from(table).select("id").limit(5);

  if (isTransportError(error)) {
    fail(`${table} check could not complete`, error!.message);
  } else if (error && error.code === "42P01") {
    fail(`${table} does not exist`, "Run the migration first.");
  } else if (error) {
    pass(`${table} blocks anonymous reads (${error.code})`);
  } else if ((data?.length ?? 0) === 0) {
    pass(`${table} returns no rows to the anon key`);
  } else {
    fail(
      `${table} leaked ${data!.length} row(s) to the anon key`,
      "A SELECT policy exists. Submissions should not be publicly readable.",
    );
  }
}

if (admin) {
  const { count, error } = await admin
    .from("contact_submissions")
    .select("id", { count: "exact", head: true });
  if (error) fail("service role cannot read contact_submissions", error.message);
  else pass(`service role reads contact_submissions (${count ?? 0} row(s))`);
} else {
  info("SUPABASE_SERVICE_ROLE_KEY not set — skipping service-role checks");
}

// ---------------------------------------------------------------------------
heading("Write round-trip");

if (!WRITE) {
  info("skipped (pass --write to run it)");
} else {
  const { error: contactError } = await anon.from("contact_submissions").insert({
    first_name: "Connection",
    last_name: "Check",
    email: MARKER,
    message: "Automated connection check. Safe to delete.",
    source: "check-script",
  });

  if (contactError) fail("anon insert into contact_submissions", contactError.message);
  else pass("anon insert into contact_submissions");

  const { error: subError } = await anon
    .from("newsletter_subscribers")
    .insert({ email: MARKER, source: "check-script" });

  if (subError) fail("anon insert into newsletter_subscribers", subError.message);
  else pass("anon insert into newsletter_subscribers");

  // Re-subscribing must collide on the case-insensitive unique index.
  const { error: dupError } = await anon
    .from("newsletter_subscribers")
    .insert({ email: MARKER.toUpperCase(), source: "check-script" });

  if (dupError?.code === "23505")
    pass("duplicate subscriber rejected case-insensitively");
  else if (dupError) fail("duplicate subscriber gave an unexpected error", dupError.message);
  else fail("duplicate subscriber was accepted", "The unique index is missing.");

  // A malformed email must be rejected by the CHECK constraint.
  const { error: badEmail } = await anon
    .from("contact_submissions")
    .insert({ first_name: "X", email: "not-an-email", message: "long enough" });

  if (badEmail) pass("malformed email rejected by the CHECK constraint");
  else fail("malformed email was accepted", "The email CHECK constraint is missing.");

  if (admin) {
    await admin.from("contact_submissions").delete().eq("email", MARKER);
    await admin.from("contact_submissions").delete().eq("email", "not-an-email");
    await admin.from("newsletter_subscribers").delete().eq("email", MARKER);
    pass("test rows cleaned up");
  } else {
    info(`leftover test rows use the email ${MARKER} — delete them manually`);
  }
}

// ---------------------------------------------------------------------------
console.log(
  failures === 0
    ? "\n\x1b[32mSupabase is wired up correctly.\x1b[0m\n"
    : `\n\x1b[31m${failures} check(s) failed.\x1b[0m\n`,
);

process.exit(failures === 0 ? 0 : 1);
