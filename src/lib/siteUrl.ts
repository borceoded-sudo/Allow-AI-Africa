/**
 * Canonical origin for metadata, robots and the sitemap.
 *
 * Prefers an explicit NEXT_PUBLIC_SITE_URL. On Vercel preview and production
 * deployments that variable is often unset, so fall back to the URL Vercel
 * injects — otherwise every preview would advertise the production domain.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "https://allowai.africa";
}

/** True only on the live production deployment, used to gate indexing. */
export function isProduction(): boolean {
  const env = process.env.VERCEL_ENV;
  // Outside Vercel there is no preview concept, so treat a build as production.
  return env === undefined || env === "production";
}
