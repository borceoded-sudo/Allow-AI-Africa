import { mulberry32 } from "@/lib/rng";

export type Variant = "grid" | "spiral" | "wave" | "lattice";

const VARIANTS: Variant[] = ["grid", "spiral", "wave", "lattice"];

/**
 * Cycles the four variants across a set so neighbouring cards never share a
 * pattern — seeds alone bunch up, which made the earlier cards look identical.
 */
export function variantForIndex(i: number): Variant {
  return VARIANTS[i % VARIANTS.length];
}

type Dot = { cx: number; cy: number; r: number; o: number };

/**
 * Seeded dot-matrix artwork. Each solution / case-study card gets its own
 * variant + seed so the set reads as one generative family while every card
 * stays visually distinct — the differentiator used across the reference site.
 *
 * Rendered as inline SVG on the server: no image requests, no layout shift.
 */
function buildDots(seed: number, variant: Variant): Dot[] {
  const rand = mulberry32(seed);
  const dots: Dot[] = [];

  if (variant === "grid") {
    const cols = 22;
    const rows = 12;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        // Diagonal falloff creates the gradient-of-density look
        const t = (x / cols) * 0.6 + (1 - y / rows) * 0.4;
        const jitter = rand();
        if (jitter > t + 0.25) continue;
        dots.push({
          cx: 8 + (x * 384) / cols,
          cy: 8 + (y * 208) / rows,
          r: 1.6 + t * 3.4,
          o: 0.18 + t * 0.62,
        });
      }
    }
    return dots;
  }

  if (variant === "spiral") {
    const arms = 3;
    const total = 320;
    for (let i = 0; i < total; i++) {
      const t = i / total;
      const arm = i % arms;
      const angle = t * Math.PI * 5 + (arm * Math.PI * 2) / arms;
      const radius = 12 + t * 118;
      dots.push({
        cx: 200 + Math.cos(angle) * radius * 1.55,
        cy: 112 + Math.sin(angle) * radius * 0.86,
        r: 1.2 + (1 - t) * 3.6,
        o: 0.15 + (1 - t) * 0.7 * (0.6 + rand() * 0.4),
      });
    }
    return dots;
  }

  if (variant === "wave") {
    const cols = 34;
    const rows = 9;
    const phase = rand() * Math.PI * 2;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const nx = x / cols;
        const offset = Math.sin(nx * Math.PI * 3 + phase) * 26;
        const amp = Math.cos(nx * Math.PI * 2 + phase) * 0.5 + 0.5;
        dots.push({
          cx: 10 + nx * 380,
          cy: 24 + (y * 176) / rows + offset,
          r: 1.1 + amp * 3.2,
          o: 0.12 + amp * 0.6,
        });
      }
    }
    return dots;
  }

  // lattice — concentric rings intersected by a rotating square field
  const rings = 9;
  for (let ring = 1; ring <= rings; ring++) {
    const count = ring * 9;
    const radius = ring * 13;
    const rot = rand() * Math.PI;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rot;
      const t = ring / rings;
      dots.push({
        cx: 200 + Math.cos(angle) * radius * 1.6,
        cy: 112 + Math.sin(angle) * radius * 0.9,
        r: 0.9 + (1 - t) * 2.8,
        o: 0.14 + (1 - t) * 0.66,
      });
    }
  }
  return dots;
}

export function DotMatrix({
  seed,
  variant,
  tone = "dark",
  className,
  idPrefix = "dm",
}: {
  seed: number;
  variant?: Variant;
  tone?: "dark" | "light";
  className?: string;
  /**
   * Namespaces the gradient ids. Required whenever the same seed+variant is
   * rendered more than once on a page (Technology shows each item as both a
   * list icon and the large preview) — duplicate ids are invalid and leave the
   * second instance referencing the first one's gradients.
   */
  idPrefix?: string;
}) {
  const resolved = variant ?? VARIANTS[seed % VARIANTS.length];
  const dots = buildDots(seed, resolved);
  const id = `${idPrefix}-${seed}-${resolved}-${tone}`;
  const dotColor = tone === "dark" ? "#8fd7c6" : "#e8f2ee";

  return (
    <svg
      viewBox="0 0 400 224"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="62%" cy="34%" r="86%">
          <stop
            offset="0%"
            stopColor={tone === "dark" ? "#173a35" : "#2f6f63"}
          />
          <stop
            offset="100%"
            stopColor={tone === "dark" ? "#070c0d" : "#0d2523"}
          />
        </radialGradient>
        <linearGradient id={`${id}-slice`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="224" fill={`url(#${id}-bg)`} />

      {dots.map((d, i) => (
        <circle
          key={i}
          cx={Number(d.cx.toFixed(2))}
          cy={Number(d.cy.toFixed(2))}
          r={Number(d.r.toFixed(2))}
          fill={dotColor}
          opacity={Number(d.o.toFixed(3))}
        />
      ))}

      {/* The diagonal cut that runs across every card in the reference set */}
      <path
        d="M0 224 L400 0 L400 224 Z"
        fill={`url(#${id}-slice)`}
        opacity="0.6"
      />
      <path
        d="M0 224 L400 0"
        stroke="#ffffff"
        strokeOpacity="0.16"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
