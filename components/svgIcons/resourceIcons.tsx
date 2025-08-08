export function PlasmaIcon() {
  return (
    <svg height={"5rem"} width={"5rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        {/* Circular clip to ensure full transparency outside r=46 */}
        <clipPath id="plasma-clip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>

        {/* Core plasma gradient */}
        <radialGradient id="plasma-gradient-2" cx="50%" cy="50%" r="50%" fx="45%" fy="45%">
          <stop offset="0%" stopColor="#77fff7" />
          <stop offset="22%" stopColor="#39e9ff" />
          <stop offset="48%" stopColor="#1aa3ff" />
          <stop offset="75%" stopColor="#0b66c2" />
          <stop offset="100%" stopColor="#032e55" />
        </radialGradient>

        {/* Outer glow (kept inside clip) */}
        <radialGradient id="outer-glow" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor="rgba(0,255,255,0.45)" />
          <stop offset="100%" stopColor="rgba(0,255,255,0)" />
        </radialGradient>

        {/* Inner highlight bloom */}
        <radialGradient id="inner-bloom" cx="50%" cy="50%" r="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.0)" />
        </radialGradient>

        {/* Subtle plasma texture, tight filter region */}
        <filter id="plasma-noise" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="turb" />
          <feColorMatrix type="saturate" values="0" in="turb" result="mono" />
          <feComponentTransfer in="mono" result="soft">
            <feFuncA type="table" tableValues="0 0.03 0.05 0.02 0" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="0.6" />
        </filter>

        {/* Soft blur for glow rings (tightened) */}
        <filter id="soft-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>

        {/* Glow for arcs and icon (tightened) */}
        <filter id="arc-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Thin chromatic rim effect (tightened) */}
        <filter id="rim-chroma" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix
            type="matrix"
            values="
              1 0 0 0 0
              0 0.8 0 0 0
              0 0 1.4 0 0
              0 0 0 1 0
            "
          />
          <feGaussianBlur stdDeviation="0.7" />
        </filter>

        {/* Gradient for energy arcs */}
        <linearGradient id="arc-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b7ffff" />
          <stop offset="40%" stopColor="#5bdcff" />
          <stop offset="100%" stopColor="#2fa2ff" />
        </linearGradient>
      </defs>

      {/* Everything clipped to the circle */}
      <g clipPath="url(#plasma-clip)">
        {/* Outer aura inside clip */}
        <ellipse cx={50} cy={50} rx={46} ry={46} fill="url(#outer-glow)" filter="url(#soft-blur)" />

        {/* Distinctive hex frame (stays within clip visually) */}
        <g opacity={0.9} filter="url(#arc-glow)">
          <path
            d="M50 6 L84 24 L84 60 L50 94 L16 60 L16 24 Z"
            fill="none"
            stroke="rgba(119,255,247,0.9)"
            strokeWidth={2.5}
          />
          <path
            d="M50 12 L78 27 L78 57 L50 88 L22 57 L22 27 Z"
            fill="none"
            stroke="rgba(0,225,255,0.4)"
            strokeWidth={2}
          />
        </g>

        {/* Core plasma sphere */}
        <circle cx={50} cy={50} r={42} fill="url(#plasma-gradient-2)" />

        {/* Subtle texture overlay */}
        <circle
          cx={50}
          cy={50}
          r={42}
          fill="rgba(255,255,255,0.06)"
          filter="url(#plasma-noise)"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Inner bright bloom */}
        <circle cx={48} cy={48} r={18} fill="url(#inner-bloom)" filter="url(#soft-blur)" />

        {/* Energy arcs */}
        <g filter="url(#arc-glow)">
          <path
            d="M20 50 Q38 28 58 42 T84 46"
            fill="none"
            stroke="url(#arc-stroke)"
            strokeWidth={2.6}
            strokeLinecap="round"
            opacity={0.9}
          />
          <path
            d="M16 54 Q36 70 52 60 T86 58"
            fill="none"
            stroke="url(#arc-stroke)"
            strokeWidth={2.2}
            strokeLinecap="round"
            opacity={0.7}
          />
          <path
            d="M22 40 Q40 36 56 50 T78 64"
            fill="none"
            stroke="url(#arc-stroke)"
            strokeWidth={1.6}
            strokeLinecap="round"
            opacity={0.65}
          />
          <path
            d="M24 60 Q44 48 62 56 T80 52"
            fill="none"
            stroke="url(#arc-stroke)"
            strokeWidth={1.8}
            strokeLinecap="round"
            opacity={0.6}
          />
        </g>

        {/* Rim highlight + chroma fringe */}
        <g>
          <circle
            cx={50}
            cy={50}
            r={42}
            fill="none"
            stroke="rgba(183,255,255,0.75)"
            strokeWidth={1.35}
            opacity={0.95}
          />
          <circle
            cx={50}
            cy={50}
            r={42}
            fill="none"
            stroke="rgba(80,180,255,0.7)"
            strokeWidth={0.9}
            filter="url(#rim-chroma)"
          />
        </g>

        {/* Center icon (bolt) */}
        <g id="center-icon" filter="url(#arc-glow)">
          <path d="M54 20 L36 54 H50 L44 80 L68 46 H54 L60 20 Z" fill="white" fillOpacity={0.95} />
          <path
            d="M54 20 L36 54 H50 L44 80 L68 46 H54 L60 20 Z"
            fill="none"
            stroke="#7ffcff"
            strokeOpacity={0.9}
            strokeWidth={1}
          />
        </g>

        {/* Specular sweep */}
        <path
          d="M18 44 C28 22 62 18 78 36"
          fill="none"
          stroke="white"
          strokeOpacity={0.35}
          strokeWidth={3.2}
          filter="url(#soft-blur)"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function MinPlasmaIcon() {
  return (
    <svg height={"1.25rem"} width={"1.25rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={40} fill="none" stroke="currentColor" strokeWidth={8} />
      <path d="M54 22 L38 50 H50 L46 74 L66 46 H54 L58 22 Z" fill="currentColor" />
    </svg>
  )
}

export function GoldIcon() {
  return (
    <svg height={"5rem"} width={"5rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FDB931" />
          <stop offset="100%" stopColor="#F4A460" />
        </linearGradient>
        <linearGradient id="edgeShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="20%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx={50} cy={50} r={45} fill="url(#coinGradient)" stroke="#DAA520" strokeWidth={2} />
      <circle cx={50} cy={50} r={38} fill="none" stroke="#DAA520" strokeWidth={1} />
      <path
        d="M59.7 43c0-5-4-8-9-8s-9 3-9 8c0 10 18 5 18 15 0 5-4 8-9 8s-9-3-9-8"
        fill="none"
        stroke="#DAA520"
        strokeWidth={4}
        strokeLinecap="round"
      />{" "}
      <line x1={50} y1={30} x2={51} y2={72} stroke="#DAA520" strokeWidth={4} strokeLinecap="round" />
      <path d="M50 5A45 45 0 0 1 95 50" stroke="url(#edgeShine)" strokeWidth={4} fill="none" />
      <ellipse cx={35} cy={35} rx={15} ry={10} fill="#ffffff" fillOpacity={0.2} transform="rotate(-30 35 35)" />
    </svg>
  )
}
