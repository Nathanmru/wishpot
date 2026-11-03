import { useId } from "react";

/**
 * Jauge signature : une fenêtre arrondie qui se remplit.
 * Maison = noyer → lin, voyage = indigo → abricot (coucher de soleil).
 */
export default function Jar({
  progress,
  kind,
  className = "",
  label,
}: {
  progress: number;
  kind: "home" | "travel";
  className?: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  const p = Math.max(0, Math.min(1, progress || 0));
  const top = 8 + (1 - p) * 184; // zone utile y=8..192
  const colors =
    kind === "travel"
      ? ["#F2A65A", "#E0704C", "#8C3F6E", "#2E3270"]
      : ["#E9D3B6", "#C79A6B", "#9A6234", "#5C3519"];

  return (
    <svg
      viewBox="0 0 120 200"
      className={className}
      role="img"
      aria-label={label ?? `${Math.round(p * 100)} %`}
    >
      <defs>
        <clipPath id={`c${id}`}>
          <path d="M8 60 A52 52 0 0 1 112 60 V184 a8 8 0 0 1 -8 8 H16 a8 8 0 0 1 -8 -8 Z" />
        </clipPath>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="0.35" stopColor={colors[1]} />
          <stop offset="0.7" stopColor={colors[2]} />
          <stop offset="1" stopColor={colors[3]} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <rect x="0" y="0" width="120" height="200" fill="#F1EEE8" />
        <g style={{ transform: `translateY(${top}px)`, transition: "transform 1.2s cubic-bezier(.2,.8,.2,1)" }}>
          <path
            d="M0 6 C20 0 40 12 60 6 S100 0 120 6 V200 H0 Z"
            fill={`url(#g${id})`}
          />
          {kind === "travel" && p > 0.08 && <circle cx="84" cy="22" r="9" fill="#FFE9C2" opacity="0.9" />}
        </g>
      </g>
      {/* montant central de la fenêtre */}
      <path d="M60 10 V192" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" />
      <path
        d="M8 60 A52 52 0 0 1 112 60 V184 a8 8 0 0 1 -8 8 H16 a8 8 0 0 1 -8 -8 Z"
        fill="none"
        stroke="#1A1F2B"
        strokeOpacity="0.12"
        strokeWidth="2"
      />
    </svg>
  );
}
