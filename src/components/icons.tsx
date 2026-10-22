type IconProps = { className?: string };

/** Decorative inline SVG glyphs for each exhibit — no external images. */
export function ExhibitGlyph({
  kind,
  className = "h-10 w-10",
}: IconProps & { kind: "stone" | "gears" | "ice" }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
    focusable: "false" as const,
  };

  if (kind === "stone") {
    return (
      <svg {...common}>
        <path d="M11 9h20l7 8v22a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Z" />
        <path d="M31 9v8h7" />
        <path d="M15 22h18M15 28h18M15 34h11" opacity="0.75" />
      </svg>
    );
  }

  if (kind === "gears") {
    return (
      <svg {...common}>
        <circle cx="19" cy="19" r="6.5" />
        <circle cx="19" cy="19" r="2" />
        <path d="M19 8v3M19 27v3M8 19h3M27 19h3M11.2 11.2l2.1 2.1M24.7 24.7l2.1 2.1M26.8 11.2l-2.1 2.1M13.3 24.7l-2.1 2.1" />
        <circle cx="33" cy="32" r="5" />
        <path d="M33 24.5v2.5M33 37v2.5M25.5 32H28M38 32h2.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M5 35 18 16l7.5 10.5L30 20l13 15" />
      <path d="M5 35h38" opacity="0.7" />
      <path d="M24 6v5M24 41v-3M15 11.5l2.6 2.6M33 11.5l-2.6 2.6" opacity="0.8" />
    </svg>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CrossIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ExternalIcon({ className = "h-3.5 w-3.5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

/** Small brass rule + diamond divider used between exhibit sections. */
export function Rule() {
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-carbon/15" />
      <span className="h-1.5 w-1.5 rotate-45 bg-brass" />
      <span className="h-px flex-1 bg-carbon/15" />
    </div>
  );
}
