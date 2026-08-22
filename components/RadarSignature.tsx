"use client";

/**
 * Signature visual: an eight-point khatam star lattice, built from the same
 * geometric-tiling tradition as Najdi sadu weaving, doubling as a "radar"
 * for the Regulatory Radar module. Two rings rotate in opposite directions
 * at very different speeds so it reads as alive without being busy.
 */
export function RadarSignature({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square ${className}`} aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-radial-fade" />

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full animate-spin-slow"
      >
        <g stroke="#4FE6C4" strokeWidth="0.6" fill="none" opacity="0.55">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8;
            return (
              <line
                key={i}
                x1="200"
                y1="200"
                x2="200"
                y2="30"
                transform={`rotate(${angle} 200 200)`}
              />
            );
          })}
          <polygon
            points={eightPointStar(200, 200, 150, 65)}
            className="animate-pulse-glow"
          />
        </g>
      </svg>

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full animate-spin-slower"
      >
        <g stroke="#C9A24B" strokeWidth="0.5" fill="none" opacity="0.4">
          <polygon points={eightPointStar(200, 200, 105, 45)} />
          <circle cx="200" cy="200" r="80" strokeDasharray="2 6" />
        </g>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-signal shadow-[0_0_18px_6px_rgba(79,230,196,0.55)]" />
      </div>
    </div>
  );
}

function eightPointStar(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
) {
  const points: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (Math.PI / 8) * i - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ");
}
