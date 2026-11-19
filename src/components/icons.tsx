import { useId } from "react";

/** [core, body, edge] per streak tier: the base burns pale and hot, the tips take the tier colour. */
const FLAME_COLORS: [string, string, string][] = [
  ["#fff3bf", "#ff922b", "#e8590c"],
  ["#fff9db", "#fcc419", "#e8a317"],
  ["#fff3bf", "#ff922b", "#f2711c"],
  ["#ffe3e3", "#ff6b6b", "#e03131"],
  ["#fff0f6", "#f783ac", "#d6336c"],
  ["#f3f0ff", "#9775fa", "#7048e8"],
  ["#e7f5ff", "#4dabf7", "#1c7ed6"],
];
const FLAME_OFF: [string, string, string] = ["#ecece8", "#cfcfca", "#a3a39e"];

const OUTER =
  "M12 1.8c.7 3.3 2.8 5 4.6 6.9 1.6 1.7 2.7 3.7 2.7 6.1 0 4.2-3.3 7.4-7.3 7.4s-7.3-3.2-7.3-7.4c0-2.4 1.1-4.2 2.5-5.5.3 1.6 1.2 2.8 2.5 3.2C9.4 9.1 10.2 5.1 12 1.8z";
const CORE =
  "M12 12.2c1.7 1.4 3.1 2.8 3.1 4.8 0 1.9-1.4 3.3-3.1 3.3s-3.1-1.4-3.1-3.3c0-1 .4-1.9 1-2.5.2.8.8 1.3 1.4 1.4-.2-1.3.1-2.6.7-3.7z";
/** Ember start points (x, delay in s); higher tiers throw more of them. */
const SPARKS: [number, number][] = [
  [9.5, 0],
  [14.5, 0.55],
  [12, 1.1],
  [7.8, 0.85],
  [16.2, 0.3],
  [10.8, 1.4],
];

/**
 * Streak flame. Grey until the user has done something today, like the TikTok streak.
 * The colour follows the streak tier; when `animated` it burns (layers sway at different speeds),
 * glows and, from tier 2, throws embers. It also grows a little with each tier.
 */
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
  const t = Math.min(Math.max(tier, 0), FLAME_COLORS.length - 1);
  const [core, body, edge] = lit ? FLAME_COLORS[t] : FLAME_OFF;
  const burning = animated && lit;
  const px = Math.round(size * (1 + (lit ? t : 0) * 0.04));
  const sparks = burning && t >= 2 ? SPARKS.slice(0, Math.min(t, SPARKS.length)) : [];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      aria-hidden
      overflow="visible"
      data-burning={burning}
      className={`flame ${className}`}
      style={{ "--flame-edge": edge, "--flame-speed": `${1.5 - t * 0.08}s` } as React.CSSProperties}
    >
      <defs>
        <linearGradient id={`${id}-o`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={edge} />
          <stop offset="70%" stopColor={body} />
          <stop offset="100%" stopColor={body} />
        </linearGradient>
        <linearGradient id={`${id}-m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={body} />
          <stop offset="100%" stopColor={core} />
        </linearGradient>
        <radialGradient id={`${id}-h`} cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor={body} stopOpacity={0.55 + t * 0.05} />
          <stop offset="100%" stopColor={body} stopOpacity="0" />
        </radialGradient>
      </defs>
      {burning && <circle className="flame-halo" cx="12" cy="14.5" r={10 + t * 0.6} fill={`url(#${id}-h)`} />}
      <g className="flame-outer">
        <path d={OUTER} fill={`url(#${id}-o)`} />
      </g>
      <g className="flame-mid">
        <path d={OUTER} transform="translate(12 22.2) scale(0.72) translate(-12 -22.2)" fill={`url(#${id}-m)`} opacity={lit ? 0.9 : 0.5} />
      </g>
      <g className="flame-core">
        <path d={CORE} fill={lit ? core : "#f4f4f1"} opacity={lit ? 0.95 : 0.7} />
      </g>
      {sparks.map(([x, delay], i) => (
        <circle
          key={i}
          className="flame-spark"
          cx={x}
          cy={9 + (i % 3)}
          r={0.75 - (i % 2) * 0.2}
          fill={i % 2 ? core : body}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
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
