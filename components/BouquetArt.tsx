import { Bouquet } from '@/lib/bouquets'

// Flower placements inside the 200x250 viewBox — hand-tuned so the
// arrangement reads as a wrapped bouquet rather than a grid of circles.
const FLOWERS = [
  { x: 100, y: 48, r: 21 },
  { x: 62, y: 66, r: 18 },
  { x: 138, y: 66, r: 18 },
  { x: 40, y: 104, r: 15 },
  { x: 160, y: 104, r: 15 },
  { x: 76, y: 100, r: 17 },
  { x: 124, y: 100, r: 17 },
  { x: 100, y: 88, r: 14 },
]

function Petals({ shape, r, fill, stroke }: { shape: Bouquet['shape']; r: number; fill: string; stroke?: string }) {
  const count = shape === 'daisy' ? 10 : shape === 'tulip' ? 5 : 6
  const rx = shape === 'daisy' ? r * 0.22 : shape === 'tulip' ? r * 0.42 : r * 0.55
  const ry = shape === 'daisy' ? r * 0.9 : shape === 'tulip' ? r * 0.8 : r * 0.62
  const cy = shape === 'daisy' ? -r * 0.5 : -r * 0.42

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={fill}
          stroke={stroke}
          strokeWidth={stroke ? 0.8 : 0}
          transform={`rotate(${(360 / count) * i})`}
        />
      ))}
    </>
  )
}

export default function BouquetArt({
  bouquet,
  className,
  animate = false,
}: {
  bouquet: Bouquet
  className?: string
  animate?: boolean
}) {
  return (
    <svg viewBox="0 0 200 250" className={className} role="img" aria-label={`A bouquet of ${bouquet.label}`}>
      {/* Stems */}
      <g stroke={bouquet.stem} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9">
        {FLOWERS.map((f, i) => (
          <path key={i} d={`M ${f.x} ${f.y} Q ${(f.x + 100) / 2} ${(f.y + 170) / 2} 100 172`} />
        ))}
      </g>

      {/* Leaves */}
      <g fill={bouquet.leaf} opacity="0.85">
        <ellipse cx="66" cy="132" rx="22" ry="9" transform="rotate(-28 66 132)" />
        <ellipse cx="134" cy="132" rx="22" ry="9" transform="rotate(28 134 132)" />
        <ellipse cx="100" cy="124" rx="18" ry="7" transform="rotate(-6 100 124)" />
      </g>

      {/* Wrapping paper */}
      <path d="M58 148 L142 148 L118 236 L82 236 Z" fill={bouquet.wrap} />
      <path d="M100 148 L142 148 L118 236 L100 236 Z" fill={bouquet.wrapShade} opacity="0.55" />
      <path d="M58 148 L142 148" stroke={bouquet.wrapShade} strokeWidth="2" />

      {/* Ribbon */}
      <rect x="76" y="178" width="48" height="11" rx="5" fill={bouquet.ribbon} />
      <path d="M76 183 L62 174 L64 194 Z" fill={bouquet.ribbon} opacity="0.85" />
      <path d="M124 183 L138 174 L136 194 Z" fill={bouquet.ribbon} opacity="0.85" />

      {/* Flowers */}
      {FLOWERS.map((f, i) => (
        <g
          key={i}
          transform={`translate(${f.x} ${f.y})`}
          className={animate ? 'bouquet-bloom' : undefined}
          style={animate ? { animationDelay: `${0.08 * i}s`, transformOrigin: `${f.x}px ${f.y}px` } : undefined}
        >
          <Petals
            shape={bouquet.shape}
            r={f.r}
            fill={bouquet.petals[i % bouquet.petals.length]}
            stroke={bouquet.petalStroke}
          />
          <circle cx="0" cy="0" r={f.r * 0.3} fill={bouquet.center} />
        </g>
      ))}
    </svg>
  )
}
