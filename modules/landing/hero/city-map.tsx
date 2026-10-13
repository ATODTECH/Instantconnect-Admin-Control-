/**
 * A stylised night map of Lagos: the lagoon, the Atlantic coast, Third
 * Mainland Bridge, a few arterial roads and neighbourhood names. Decorative
 * only; nothing on it is to scale.
 */

const LABELS = [
  { name: "IKEJA", x: 250, y: 120 },
  { name: "SURULERE", x: 150, y: 215 },
  { name: "YABA", x: 470, y: 205 },
  { name: "LAGOS ISLAND", x: 470, y: 520 },
  { name: "IKOYI", x: 760, y: 455 },
  { name: "VICTORIA ISLAND", x: 650, y: 640 },
  { name: "LEKKI", x: 1120, y: 590 },
  { name: "AJAH", x: 1340, y: 500 },
  { name: "LAGOS LAGOON", x: 980, y: 300, water: true },
  { name: "ATLANTIC OCEAN", x: 1120, y: 860, water: true },
]

const MAJOR_ROADS = [
  "M300 0 C 330 140 360 240 420 300",
  "M0 160 C 220 150 420 190 640 170 S 1000 120 1440 150",
  "M420 470 C 640 520 900 500 1100 520 S 1340 560 1440 540",
  "M560 720 C 800 690 1100 720 1440 690",
  "M760 420 C 780 520 760 620 720 760",
]

const MINOR_ROADS = [
  "M0 80 C 200 90 300 60 520 90",
  "M120 0 C 140 120 120 220 160 280",
  "M600 0 C 620 80 580 140 640 200",
  "M820 0 C 840 90 880 120 900 210",
  "M1100 0 C 1080 100 1120 150 1160 230",
  "M1300 40 C 1280 120 1320 180 1300 240",
  "M880 420 C 900 520 960 600 980 720",
  "M1000 460 C 1060 470 1120 450 1200 470",
  "M1200 420 C 1180 520 1240 600 1220 700",
  "M600 560 C 700 580 820 560 900 600",
  "M200 260 C 260 240 320 250 380 240",
  "M1300 600 C 1360 640 1400 640 1440 630",
]

/** A deterministic scatter of city blocks, so the server and client draw the same map. */
const BLOCKS = Array.from({ length: 70 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280
  const x = (seed / 233280) * 1440
  const y = ((seed * 7) % 233280) / 233280 * 900
  return { x, y, w: 18 + (i % 4) * 8, h: 12 + (i % 3) * 7 }
}).filter(({ y }) => (y < 240 || y > 430) && y < 780) // keep blocks off the water

const CityMap = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
    <defs>
      <linearGradient id="map-water" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#9333EA" stopOpacity="0.28" />
        <stop offset="1" stopColor="#EC4899" stopOpacity="0.16" />
      </linearGradient>
      <pattern id="map-dots" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#FFFFFF" fillOpacity="0.06" />
      </pattern>
    </defs>

    <rect width="1440" height="900" fill="url(#map-dots)" />

    {BLOCKS.map((block, i) => (
      <rect key={i} x={block.x} y={block.y} width={block.w} height={block.h} rx="3" fill="#FFFFFF" fillOpacity="0.035" />
    ))}

    {/* Lagos Lagoon and the Atlantic. */}
    <path
      d="M0 300 C 220 260 420 330 600 300 S 920 220 1100 260 S 1340 300 1440 270 L1440 380 C 1280 410 1100 350 920 390 S 560 450 380 410 S 120 380 0 430 Z"
      fill="url(#map-water)"
    />
    <path d="M0 820 C 300 780 700 840 1000 800 S 1300 790 1440 810 L1440 900 L0 900 Z" fill="url(#map-water)" />

    <g fill="none" strokeLinecap="round">
      {MINOR_ROADS.map((d) => (
        <path key={d} d={d} stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="2" />
      ))}
      {MAJOR_ROADS.map((d) => (
        <path key={d} d={d} stroke="#C084FC" strokeOpacity="0.22" strokeWidth="4" />
      ))}
      {/* Third Mainland Bridge, across the lagoon. */}
      <path d="M380 130 C 420 260 470 380 540 480" stroke="#F67B58" strokeOpacity="0.45" strokeWidth="3" strokeDasharray="2 10" />
    </g>

    <g fontFamily="var(--font-inter-sans), sans-serif" fontWeight="600" letterSpacing="3">
      {LABELS.map((label) => (
        <text
          key={label.name}
          x={label.x}
          y={label.y}
          textAnchor="middle"
          fontSize={label.water ? 13 : 14}
          fontStyle={label.water ? "italic" : "normal"}
          fill={label.water ? "#C084FC" : "#FFFFFF"}
          fillOpacity={label.water ? 0.45 : 0.22}
        >
          {label.name}
        </text>
      ))}
    </g>
  </svg>
)

export default CityMap
