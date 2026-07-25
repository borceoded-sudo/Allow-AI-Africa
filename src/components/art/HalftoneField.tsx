"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's animated halftone field: a dot-matrix whose dot radius is driven
 * by a slowly drifting interference pattern, so the surface reads as a
 * continuously moving teal gradient rendered in dots.
 *
 * Draws on a DPR-scaled canvas, pauses when scrolled out of view, and falls
 * back to a static single frame when the user prefers reduced motion.
 */
export function HalftoneField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;

      // Base wash: a teal radial that the dots are punched out of
      const wash = ctx.createLinearGradient(0, 0, width, height);
      wash.addColorStop(0, "#0a1517");
      wash.addColorStop(0.45, "#12312e");
      wash.addColorStop(1, "#060d0e");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(
        width * (0.5 + Math.sin(t * 0.09) * 0.12),
        height * (0.4 + Math.cos(t * 0.07) * 0.14),
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.75,
      );
      glow.addColorStop(0, "rgba(126, 208, 189, 0.42)");
      glow.addColorStop(0.55, "rgba(47, 127, 112, 0.16)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Halftone layer
      const spacing = width < 640 ? 9 : 11;
      const maxR = spacing * 0.46;
      ctx.fillStyle = "#020606";

      for (let y = 0; y < height + spacing; y += spacing) {
        for (let x = 0; x < width + spacing; x += spacing) {
          const nx = x / width;
          const ny = y / height;

          // Two drifting interference waves + a diagonal ridge
          const a = Math.sin((nx * 7.5 + t * 0.16) * Math.PI);
          const b = Math.cos((ny * 5.2 - t * 0.11) * Math.PI);
          const c = Math.sin(((nx + ny) * 4.1 + t * 0.07) * Math.PI);
          const field = (a * b + c) * 0.5;

          // field in roughly [-1, 1] -> ink coverage
          const coverage = Math.min(1, Math.max(0, 0.52 - field * 0.46));
          const r = coverage * maxR;
          if (r < 0.35) continue;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Vignette so the panel edges settle into the page background
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.25,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.78,
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, "rgba(4, 10, 11, 0.72)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();

    if (reduceMotion) {
      draw(start);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (reduceMotion) draw(start);
    };
    window.addEventListener("resize", onResize);

    // Stop burning frames once the hero has scrolled away
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      // Static gradient stands in until the first frame paints
      style={{
        background:
          "linear-gradient(135deg, #0a1517 0%, #12312e 45%, #060d0e 100%)",
      }}
    />
  );
}
