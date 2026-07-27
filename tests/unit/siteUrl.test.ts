import { test, describe, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getSiteUrl, isProduction } from "../../src/lib/siteUrl.ts";

const KEYS = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_VERCEL_URL",
  "VERCEL_URL",
  "VERCEL_ENV",
] as const;

const original = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const key of KEYS) {
    if (original[key] === undefined) delete process.env[key];
    else process.env[key] = original[key];
  }
});

function clear() {
  for (const key of KEYS) delete process.env[key];
}

describe("getSiteUrl", () => {
  test("prefers an explicit NEXT_PUBLIC_SITE_URL", () => {
    clear();
    process.env.NEXT_PUBLIC_SITE_URL = "https://allowai.africa";
    process.env.VERCEL_URL = "preview.vercel.app";
    assert.equal(getSiteUrl(), "https://allowai.africa");
  });

  test("strips a trailing slash so URLs never double up", () => {
    clear();
    process.env.NEXT_PUBLIC_SITE_URL = "https://allowai.africa/";
    assert.equal(getSiteUrl(), "https://allowai.africa");
  });

  /**
   * Without this fallback every preview deployment would advertise the
   * production domain as its canonical URL and compete with the real site.
   */
  test("falls back to the deployment's own Vercel URL", () => {
    clear();
    process.env.VERCEL_URL = "allow-ai-africa-git-abc.vercel.app";
    assert.equal(getSiteUrl(), "https://allow-ai-africa-git-abc.vercel.app");
  });

  test("falls back to the production domain when nothing is set", () => {
    clear();
    assert.equal(getSiteUrl(), "https://allowai.africa");
  });
});

describe("isProduction", () => {
  test("is true on the production deployment", () => {
    clear();
    process.env.VERCEL_ENV = "production";
    assert.equal(isProduction(), true);
  });

  test("is false on preview deployments, which must not be indexed", () => {
    clear();
    process.env.VERCEL_ENV = "preview";
    assert.equal(isProduction(), false);
  });

  test("is false on development deployments", () => {
    clear();
    process.env.VERCEL_ENV = "development";
    assert.equal(isProduction(), false);
  });

  test("is true off-Vercel, where there is no preview concept", () => {
    clear();
    assert.equal(isProduction(), true);
  });
});
