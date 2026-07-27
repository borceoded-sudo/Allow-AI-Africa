import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { mulberry32 } from "../../src/lib/rng.ts";
import { variantForIndex } from "../../src/lib/artVariants.ts";

describe("mulberry32", () => {
  /**
   * The generative artwork is seeded so the server and client produce
   * identical markup. If this stopped being deterministic every card would
   * flash a different pattern on hydration.
   */
  test("is deterministic for a given seed", () => {
    const a = Array.from({ length: 8 }, mulberry32(42));
    const b = Array.from({ length: 8 }, mulberry32(42));
    assert.deepEqual(a, b);
  });

  test("produces different streams for different seeds", () => {
    const a = Array.from({ length: 8 }, mulberry32(1));
    const b = Array.from({ length: 8 }, mulberry32(2));
    assert.notDeepEqual(a, b);
  });

  test("stays within [0, 1)", () => {
    const next = mulberry32(7);
    for (let i = 0; i < 500; i++) {
      const v = next();
      assert.ok(v >= 0 && v < 1, `out of range: ${v}`);
    }
  });

  test("does not immediately repeat", () => {
    const next = mulberry32(3);
    const seen = new Set(Array.from({ length: 200 }, next));
    assert.ok(seen.size > 190, `too many collisions: ${seen.size}/200`);
  });
});

describe("variantForIndex", () => {
  /**
   * Deriving the variant from the seed alone bunched them up — the first three
   * solution cards all rendered the same pattern. Cycling by position keeps
   * neighbours distinct.
   */
  test("gives neighbouring cards different variants", () => {
    for (let i = 0; i < 12; i++) {
      assert.notEqual(variantForIndex(i), variantForIndex(i + 1));
    }
  });

  test("cycles through all four variants", () => {
    const seen = new Set([0, 1, 2, 3].map(variantForIndex));
    assert.equal(seen.size, 4);
  });

  test("wraps around beyond the variant count", () => {
    assert.equal(variantForIndex(0), variantForIndex(4));
    assert.equal(variantForIndex(1), variantForIndex(5));
  });
});
