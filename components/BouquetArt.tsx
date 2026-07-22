import { Bouquet } from '@/lib/bouquets'

// Hand-drawn SVG bouquets in a shared 200x250 viewBox. Each flower head is
// built from layered shapes so it reads unmistakably as its flower type.
// Composition: a loose dome of 7 heads above a paper cone; every stem
// converges into the cone mouth; ribbon bow with two loops + two tails.

// Dome positions shared by all bouquets except lavender (which is stem-based).
const HEADS = [
  { x: 100, y: 44, r: 20 },
  { x: 64, y: 58, r: 17 },
  { x: 136, y: 58, r: 17 },
  { x: 44, y: 90, r: 14 },
  { x: 156, y: 90, r: 14 },
  { x: 78, y: 96, r: 15 },
  { x: 122, y: 96, r: 15 },
]

const CONE_MOUTH_Y = 150

function bloomProps(animate: boolean, i: number, x: number, y: number) {
  return animate
    ? {
        className: 'bouquet-bloom',
        style: { animationDelay: `${0.08 * i}s`, transformOrigin: `${x}px ${y}px` },
      }
    : {}
}

/* ---------- Flower heads (drawn at local origin, radius r) ---------- */

// Spiral rose seen from above: concentric circles + spiral arcs.
function RoseHead({ r }: { r: number }) {
  return (
    <>
      <circle r={r} fill="#e11d48" />
      <circle r={r * 0.66} fill="#be123c" />
      <circle r={r * 0.34} fill="#9f1239" />
      <g stroke="#9f1239" strokeWidth={r * 0.09} fill="none" opacity="0.7" strokeLinecap="round">
        <path d={`M ${-r * 0.9} 0 A ${r * 0.9} ${r * 0.9} 0 0 1 ${r * 0.55} ${-r * 0.7}`} />
        <path d={`M ${r * 0.55} ${r * 0.15} A ${r * 0.55} ${r * 0.55} 0 0 1 ${-r * 0.35} ${r * 0.42}`} />
        <path d={`M 0 ${-r * 0.28} A ${r * 0.28} ${r * 0.28} 0 1 0 ${r * 0.2} ${r * 0.2}`} stroke="#fda4af" opacity="0.8" />
      </g>
    </>
  )
}

// Peony: two rings of overlapping rounded petals around a small center.
function PeonyHead({ r }: { r: number }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse key={`o${i}`} cx={0} cy={-r * 0.58} rx={r * 0.42} ry={r * 0.55} fill="#fda4af" transform={`rotate(${45 * i})`} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse key={`n${i}`} cx={0} cy={-r * 0.34} rx={r * 0.32} ry={r * 0.42} fill="#fb7185" transform={`rotate(${60 * i + 30})`} />
      ))}
      <circle r={r * 0.22} fill="#f43f5e" />
      <circle r={r * 0.1} fill="#fff1f2" />
    </>
  )
}

// Sunflower: ring of pointed yellow petals around a big dotted brown center.
function SunflowerHead({ r }: { r: number }) {
  const petal = `M 0 ${-r * 0.32} C ${r * 0.16} ${-r * 0.5} ${r * 0.13} ${-r * 0.82} 0 ${-r * 1.05} C ${-r * 0.13} ${-r * 0.82} ${-r * 0.16} ${-r * 0.5} 0 ${-r * 0.32} Z`
  return (
    <>
      {Array.from({ length: 14 }).map((_, i) => (
        <path key={i} d={petal} fill={i % 2 ? '#facc15' : '#eab308'} transform={`rotate(${(360 / 14) * i})`} />
      ))}
      <circle r={r * 0.45} fill="#78350f" />
      <g fill="#451a03">
        <circle cx={-r * 0.18} cy={-r * 0.1} r={r * 0.05} />
        <circle cx={r * 0.14} cy={-r * 0.18} r={r * 0.05} />
        <circle cx={r * 0.2} cy={r * 0.12} r={r * 0.05} />
        <circle cx={-r * 0.08} cy={r * 0.2} r={r * 0.05} />
        <circle cx={0} cy={0} r={r * 0.05} />
      </g>
    </>
  )
}

// Lily: six elongated pointed petals, pink tips, yellow stamens.
function LilyHead({ r }: { r: number }) {
  const petal = `M 0 ${-r * 0.1} C ${r * 0.3} ${-r * 0.35} ${r * 0.24} ${-r * 0.78} 0 ${-r * 1.05} C ${-r * 0.24} ${-r * 0.78} ${-r * 0.3} ${-r * 0.35} 0 ${-r * 0.1} Z`
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} transform={`rotate(${60 * i})`}>
          <path d={petal} fill="#fffbf5" stroke="#f1e4da" strokeWidth={0.6} />
          <ellipse cx={0} cy={-r * 0.88} rx={r * 0.12} ry={r * 0.18} fill="#fecdd3" />
        </g>
      ))}
      <g stroke="#eab308" strokeWidth={r * 0.06} strokeLinecap="round">
        <line x1={0} y1={0} x2={-r * 0.2} y2={-r * 0.26} />
        <line x1={0} y1={0} x2={r * 0.22} y2={-r * 0.22} />
        <line x1={0} y1={0} x2={0} y2={-r * 0.32} />
      </g>
      <g fill="#f59e0b">
        <circle cx={-r * 0.2} cy={-r * 0.26} r={r * 0.08} />
        <circle cx={r * 0.22} cy={-r * 0.22} r={r * 0.08} />
        <circle cx={0} cy={-r * 0.32} r={r * 0.08} />
      </g>
    </>
  )
}

// Wildflowers mix: daisy / purple five-petal / tiny yellow buds, by index.
function WildflowerHead({ r, i }: { r: number; i: number }) {
  const kind = i % 3
  if (kind === 0) {
    // Daisy: white petals + yellow center
    return (
      <>
        {Array.from({ length: 10 }).map((_, k) => (
          <ellipse key={k} cx={0} cy={-r * 0.55} rx={r * 0.2} ry={r * 0.5} fill="#ffffff" stroke="#e7e5e4" strokeWidth={0.5} transform={`rotate(${36 * k})`} />
        ))}
        <circle r={r * 0.32} fill="#fbbf24" />
      </>
    )
  }
  if (kind === 1) {
    // Small purple five-petal
    return (
      <>
        {Array.from({ length: 5 }).map((_, k) => (
          <ellipse key={k} cx={0} cy={-r * 0.48} rx={r * 0.34} ry={r * 0.5} fill="#a78bfa" transform={`rotate(${72 * k})`} />
        ))}
        <circle r={r * 0.24} fill="#fde68a" />
      </>
    )
  }
  // Cluster of tiny yellow buds
  return (
    <>
      <circle cx={-r * 0.35} cy={r * 0.1} r={r * 0.3} fill="#fbbf24" />
      <circle cx={r * 0.3} cy={-r * 0.05} r={r * 0.34} fill="#facc15" />
      <circle cx={-r * 0.05} cy={-r * 0.4} r={r * 0.28} fill="#fbbf24" />
      <circle cx={r * 0.3} cy={-r * 0.05} r={r * 0.12} fill="#b45309" opacity="0.5" />
      <circle cx={-r * 0.35} cy={r * 0.1} r={r * 0.1} fill="#b45309" opacity="0.5" />
    </>
  )
}

/* ---------- Shared bouquet furniture ---------- */

function StemsAndLeaves({ bouquet }: { bouquet: Bouquet }) {
  return (
    <>
      <g stroke={bouquet.stem} strokeWidth="2.6" strokeLinecap="round" fill="none" opacity="0.95">
        {HEADS.map((f, i) => (
          <path
            key={i}
            d={`M ${f.x} ${f.y + f.r * 0.4} C ${f.x} ${(f.y + CONE_MOUTH_Y) / 2} ${(f.x + 100) / 2} ${CONE_MOUTH_Y - 20} ${88 + (i % 4) * 8} ${CONE_MOUTH_Y + 12}`}
          />
        ))}
      </g>
      <g fill={bouquet.leaf} opacity="0.9">
        <ellipse cx="58" cy="126" rx="16" ry="6.5" transform="rotate(-32 58 126)" />
        <ellipse cx="142" cy="126" rx="16" ry="6.5" transform="rotate(32 142 126)" />
        <ellipse cx="82" cy="136" rx="13" ry="5.5" transform="rotate(-16 82 136)" />
        <ellipse cx="118" cy="136" rx="13" ry="5.5" transform="rotate(16 118 136)" />
        <ellipse cx="36" cy="112" rx="13" ry="5" transform="rotate(-55 36 112)" />
        <ellipse cx="164" cy="112" rx="13" ry="5" transform="rotate(55 164 112)" />
      </g>
    </>
  )
}

function ConeAndRibbon({ bouquet }: { bouquet: Bouquet }) {
  return (
    <>
      {/* Paper cone: flared top edge, tapering trapezoid, soft center crease */}
      <path
        d={`M 54 ${CONE_MOUTH_Y - 4} L 146 ${CONE_MOUTH_Y - 4} L 150 ${CONE_MOUTH_Y + 4} L 116 236 L 84 236 L 50 ${CONE_MOUTH_Y + 4} Z`}
        fill={bouquet.wrap}
        stroke={bouquet.wrapShade}
        strokeWidth="1"
      />
      {/* right-side shade panel */}
      <path d={`M 100 ${CONE_MOUTH_Y - 4} L 146 ${CONE_MOUTH_Y - 4} L 150 ${CONE_MOUTH_Y + 4} L 116 236 L 100 236 Z`} fill={bouquet.wrapShade} opacity="0.4" />
      {/* vertical center crease */}
      <path d={`M 100 ${CONE_MOUTH_Y - 2} L 100 234`} stroke={bouquet.wrapShade} strokeWidth="1.4" opacity="0.8" />
      {/* flared inner lip */}
      <path d={`M 54 ${CONE_MOUTH_Y - 4} Q 100 ${CONE_MOUTH_Y + 4} 146 ${CONE_MOUTH_Y - 4}`} fill="none" stroke={bouquet.wrapShade} strokeWidth="1.6" />

      {/* Ribbon: band + two loops + two hanging tails */}
      <g fill={bouquet.ribbon}>
        <rect x="70" y="176" width="60" height="9" rx="4.5" opacity="0.95" />
        {/* loops */}
        <path d="M 100 180 C 84 168 70 170 72 180 C 74 189 90 187 100 180 Z" opacity="0.9" />
        <path d="M 100 180 C 116 168 130 170 128 180 C 126 189 110 187 100 180 Z" opacity="0.9" />
        {/* knot */}
        <circle cx="100" cy="180" r="4.5" />
        {/* tails */}
        <path d="M 97 183 C 92 196 94 206 89 214 L 95 215 C 99 205 99 194 101 184 Z" opacity="0.85" />
        <path d="M 103 183 C 108 196 106 208 112 216 L 106 217 C 101 206 101 194 99 184 Z" opacity="0.85" />
      </g>
    </>
  )
}

/* ---------- Lavender: upright floret-column stems ---------- */

function LavenderContent({ bouquet, animate }: { bouquet: Bouquet; animate: boolean }) {
  // Each stem: base near cone mouth, tip high above; florets taper to the tip.
  const stems = [
    { bx: 96, tx: 100, ty: 32 },
    { bx: 88, tx: 74, ty: 44 },
    { bx: 106, tx: 126, ty: 44 },
    { bx: 84, tx: 52, ty: 62 },
    { bx: 110, tx: 148, ty: 62 },
    { bx: 92, tx: 62, ty: 84 },
    { bx: 104, tx: 138, ty: 84 },
  ]
  return (
    <>
      {stems.map((s, i) => {
        const by = CONE_MOUTH_Y + 10
        const midX = (s.bx + s.tx) / 2
        const midY = (by + s.ty) / 2 + 14
        // florets along the top 55% of the stem, tapering
        const florets = Array.from({ length: 7 }).map((_, k) => {
          const t = k / 6 // 0 at tip, 1 at lowest floret
          const fy = s.ty + t * (midY - s.ty) * 0.85
          const fx = s.tx + (midX - s.tx) * t * 0.5
          const size = 2.2 + t * 2.2
          return { fx, fy, size, k }
        })
        return (
          <g key={i} {...bloomProps(animate, i, s.tx, midY)}>
            <path d={`M ${s.bx} ${by} Q ${midX} ${midY} ${s.tx} ${s.ty}`} stroke="#8a9a7b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            {/* thin gray-green leaves low on the stem */}
            <ellipse cx={s.bx + (midX - s.bx) * 0.5 - 5} cy={by - 22} rx={8} ry={2.2} fill="#9caf88" transform={`rotate(-40 ${s.bx - 5} ${by - 22})`} />
            <ellipse cx={s.bx + (midX - s.bx) * 0.5 + 5} cy={by - 30} rx={8} ry={2.2} fill="#9caf88" transform={`rotate(40 ${s.bx + 5} ${by - 30})`} />
            {florets.map(f => (
              <g key={f.k}>
                <ellipse cx={f.fx - f.size * 0.8} cy={f.fy} rx={f.size} ry={f.size * 0.62} fill={f.k % 2 ? '#8b5cf6' : '#7c3aed'} transform={`rotate(-30 ${f.fx - f.size * 0.8} ${f.fy})`} />
                <ellipse cx={f.fx + f.size * 0.8} cy={f.fy} rx={f.size} ry={f.size * 0.62} fill={f.k % 2 ? '#7c3aed' : '#a78bfa'} transform={`rotate(30 ${f.fx + f.size * 0.8} ${f.fy})`} />
              </g>
            ))}
            {/* tip bud */}
            <ellipse cx={s.tx} cy={s.ty - 2} rx={2} ry={3} fill="#a78bfa" />
          </g>
        )
      })}
      <ConeAndRibbon bouquet={bouquet} />
    </>
  )
}

/* ---------- Main component ---------- */

function Head({ bouquet, r, i }: { bouquet: Bouquet; r: number; i: number }) {
  switch (bouquet.id) {
    case 'red_roses':
      return <RoseHead r={r} />
    case 'pink_peonies':
      return <PeonyHead r={r} />
    case 'sunflowers':
      return <SunflowerHead r={r} />
    case 'white_lilies':
      return <LilyHead r={r} />
    case 'wildflowers':
      return <WildflowerHead r={r} i={i} />
    default:
      return <RoseHead r={r} />
  }
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
      {bouquet.id === 'lavender' ? (
        <LavenderContent bouquet={bouquet} animate={animate} />
      ) : (
        <>
          <StemsAndLeaves bouquet={bouquet} />
          <ConeAndRibbon bouquet={bouquet} />
          {HEADS.map((f, i) => (
            <g key={i} transform={`translate(${f.x} ${f.y})`} {...bloomProps(animate, i, f.x, f.y)}>
              <Head bouquet={bouquet} r={f.r} i={i} />
            </g>
          ))}
        </>
      )}
    </svg>
  )
}
