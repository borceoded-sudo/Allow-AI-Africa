import type { NextConfig } from "next";

/**
 * Security headers for a public marketing site. There is no third-party
 * script, iframe or remote asset on the page — all artwork is generated in
 * code and next/font self-hosts the typefaces — so the policy can stay tight
 * without breaking anything.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework version to scanners.
  poweredByHeader: false,

  // Canonical URLs without a trailing slash, matching the metadata in layout.
  trailingSlash: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
