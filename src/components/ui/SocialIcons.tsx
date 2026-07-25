import { site } from "@/lib/content";

const ICONS: Record<string, React.ReactNode> = {
  X: (
    <path
      d="M3.2 3h3.3l3.6 4.9L14.3 3h2.4l-5.2 6.1L17.2 17h-3.3l-3.9-5.3L5.4 17H3l5.5-6.4L3.2 3Z"
      fill="currentColor"
    />
  ),
  LinkedIn: (
    <>
      <path
        d="M4.2 7.3h2.6V17H4.2V7.3ZM5.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
        fill="currentColor"
      />
      <path
        d="M8.8 7.3h2.5v1.3a2.9 2.9 0 0 1 2.5-1.4c2 0 2.9 1.3 2.9 3.5V17h-2.6v-5c0-1.2-.4-1.9-1.4-1.9s-1.4.6-1.4 1.8V17H8.8V7.3Z"
        fill="currentColor"
      />
    </>
  ),
  YouTube: (
    <>
      <rect
        x="2.4"
        y="4.6"
        width="15.2"
        height="10.8"
        rx="3.2"
        fill="currentColor"
      />
      <path d="M8.4 7.8v4.4L12.6 10 8.4 7.8Z" fill="#0b1112" />
    </>
  ),
};

/**
 * The small square social chips that sit in the hero caption bar and the
 * contact card.
 */
export function SocialIcons({
  tone = "onDark",
  className,
}: {
  tone?: "onDark" | "onPaper";
  className?: string;
}) {
  return (
    <ul className={`flex items-center gap-2 ${className ?? ""}`}>
      {site.socials.map((social) => (
        <li key={social.label}>
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${site.name} on ${social.label}`}
            className={[
              "inline-flex h-8 w-8 items-center justify-center rounded-lg",
              "transition-transform duration-300 hover:-translate-y-0.5",
              tone === "onDark"
                ? "bg-white text-ink-dark"
                : "bg-ink-dark text-ink",
            ].join(" ")}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4">
              {ICONS[social.label]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
