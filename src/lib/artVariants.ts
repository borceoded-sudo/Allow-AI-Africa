/**
 * Variant selection for the generative dot-matrix artwork.
 *
 * Kept in a plain module rather than alongside the component so the logic can
 * be unit tested — and because picking a pattern is not a rendering concern.
 */

export type Variant = "grid" | "spiral" | "wave" | "lattice";

export const VARIANTS: readonly Variant[] = [
  "grid",
  "spiral",
  "wave",
  "lattice",
];

/**
 * Cycles the four variants across a set so neighbouring cards never share a
 * pattern — deriving the variant from the seed alone bunched them up, which
 * made the first three solution cards render identically.
 */
export function variantForIndex(i: number): Variant {
  return VARIANTS[((i % VARIANTS.length) + VARIANTS.length) % VARIANTS.length];
}
