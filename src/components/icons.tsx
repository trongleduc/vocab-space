import { useId } from "react";

const FLAME_COLORS: [string, string][] = [
  ["#ffc078", "#f2711c"],
  ["#ffe066", "#e8a317"],
  ["#ffc078", "#f2711c"],
  ["#ffa8a8", "#e03131"],
  ["#faa2c1", "#d6336c"],
  ["#d0bfff", "#7048e8"],
  ["#a5d8ff", "#1c7ed6"],
];

/** Streak flame. Grey until the user has done something today, like the TikTok streak. */
export function FlameIcon({
  tier = 0,
  lit = true,
  size = 24,
  animated = false,
  className = "",
}: {
  tier?: number;
  lit?: boolean;
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  const id = useId();
  const [light, deep] = FLAME_COLORS[Math.min(tier, FLAME_COLORS.length - 1)];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      className={`${animated && lit ? "animate-flicker" : ""} ${className}`}
    >
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lit ? light : "#cfcfca"} />
          <stop offset="100%" stopColor={lit ? deep : "#a3a39e"} />
        </linearGradient>
      </defs>
      <path
        d="M12 1.8c.7 3.3 2.8 5 4.6 6.9 1.6 1.7 2.7 3.7 2.7 6.1 0 4.2-3.3 7.4-7.3 7.4s-7.3-3.2-7.3-7.4c0-2.4 1.1-4.2 2.5-5.5.3 1.6 1.2 2.8 2.5 3.2C9.4 9.1 10.2 5.1 12 1.8z"
        fill={`url(#${id}-g)`}
      />
      <path
        d="M12 12.2c1.7 1.4 3.1 2.8 3.1 4.8 0 1.9-1.4 3.3-3.1 3.3s-3.1-1.4-3.1-3.3c0-1 .4-1.9 1-2.5.2.8.8 1.3 1.4 1.4-.2-1.3.1-2.6.7-3.7z"
        fill={lit ? "#fff7e6" : "#ecece8"}
        opacity={lit ? 0.9 : 0.7}
      />
    </svg>
  );
}

/** Knight helmet badge; metal colour and plume reflect the rank. */
export function KnightIcon({
  color,
  index = 0,
  size = 32,
  className = "",
}: {
  color: string;
  index?: number;
  size?: number;
  className?: string;
}) {
  const id = useId();
  const plume = index >= 2;
  const crown = index >= 6;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className}>
      <defs>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.75" />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      {plume && (
        <path
          d="M16 6c1.5-3 5-4.4 8.5-3.8-1.4 1-2.3 2.2-2.7 3.6"
          fill="none"
          stroke={index >= 4 ? "#e03131" : "#868e96"}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}
      {crown && <path d="M10 5.5l2 2.2 2-3 2 3 2-3 2 3 2-2.2-.8 3.5H10.8z" fill="#fcc419" />}
      <path
        d="M16 6.5c-5.5 0-9.5 4-9.5 9.5v6.6c0 1 .6 2 1.5 2.4L16 28.5l8-3.5c.9-.4 1.5-1.4 1.5-2.4V16c0-5.5-4-9.5-9.5-9.5z"
        fill={`url(#${id}-m)`}
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="1"
      />
      <path d="M16 7v21" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <rect x="9" y="14.5" width="14" height="2.6" rx="1.3" fill="rgba(0,0,0,0.65)" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={12.4 + i * 3} y="19.5" width="1.3" height="4.5" rx="0.65" fill="rgba(0,0,0,0.45)" />
      ))}
    </svg>
  );
}
