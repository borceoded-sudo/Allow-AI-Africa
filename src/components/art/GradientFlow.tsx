/**
 * The soft flowing gradient used beside the contact form and on the leadership
 * cards. Pure CSS radial layers with an ambient drift — cheap, and it keeps the
 * site free of external image assets.
 */
export function GradientFlow({
  seed = 0,
  className,
  intensity = 1,
}: {
  seed?: number;
  className?: string;
  intensity?: number;
}) {
  const shift = (seed * 37) % 100;

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden ${className ?? ""}`}
      style={{ backgroundColor: "#050b0c" }}
    >
      <div
        className="animate-drift h-full w-full"
        style={{
          backgroundImage: [
            `radial-gradient(60% 45% at ${20 + shift * 0.3}% 28%, rgba(196, 224, 214, ${0.55 * intensity}) 0%, rgba(196, 224, 214, 0) 62%)`,
            `radial-gradient(52% 60% at ${76 - shift * 0.2}% 68%, rgba(95, 208, 182, ${0.34 * intensity}) 0%, rgba(95, 208, 182, 0) 66%)`,
            `radial-gradient(90% 70% at 50% 118%, rgba(11, 33, 31, 0.95) 0%, rgba(5, 11, 12, 1) 70%)`,
            `linear-gradient(150deg, #0d2422 0%, #050b0c 68%)`,
          ].join(","),
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
