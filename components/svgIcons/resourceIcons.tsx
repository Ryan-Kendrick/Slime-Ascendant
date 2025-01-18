import React from "react"

export function PlasmaIcon() {
  return (
    <svg height={"5rem"} width={"5rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="plasma-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#05e6e6" />
          <stop offset="50%" stopColor="#0099ff" />
          <stop offset="100%" stopColor="#005577" />
        </radialGradient>
      </defs>
      <circle cx={50} cy={50} r={45} fill="url(#plasma-gradient)" />
      <path
        d="M50 10 Q70 30 50 50 Q30 70 50 90 Q70 70 50 50 Q30 30 50 10 Z"
        fill="none"
        stroke="white"
        strokeWidth={4}
        opacity={0.8}
      />
    </svg>
  )
}

export function MinPlasmaIcon() {
  return (
    <svg height={"1.25rem"} width={"1.25rem"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path
        d="M50 10 Q85 30 50 50 Q15 70 50 90 Q85 70 50 50 Q15 30 50 10 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        opacity="0.8"
      />
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

// Gold coin before JSX conversion
// ;<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
//   <defs>
//     <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//       <stop offset="0%" style="stop-color:#FFD700" />
//       <stop offset="50%" style="stop-color:#FDB931" />
//       <stop offset="100%" style="stop-color:#F4A460" />
//     </linearGradient>
//     <linearGradient id="edgeShine" x1="0%" y1="0%" x2="0%" y2="100%">
//       <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.0" />
//       <stop offset="20%" style="stop-color:#ffffff;stop-opacity:0.4" />
//       <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.0" />
//     </linearGradient>
//   </defs>

//   <circle cx="50" cy="50" r="45" fill="url(#coinGradient)" stroke="#DAA520" stroke-width="2" />

//   <circle cx="50" cy="50" r="38" fill="none" stroke="#DAA520" stroke-width="1" />

//   <path
//     d="M58.7 40c0-5-4-8-9-8s-9 3-9 8c0 10 18 5 18 15 0 5-4 8-9 8s-9-3-9-8"
//     fill="none"
//     stroke="#DAA520"
//     stroke-width="4"
//     stroke-linecap="round"
//   />
// <line x1="50" y1="30" x2="50" y2="71" stroke="#DAA520" stroke-width="4" stroke-linecap="round" />

//   <path d="M50 5A45 45 0 0 1 95 50" stroke="url(#edgeShine)" stroke-width="4" fill="none" />

//   <ellipse cx="35" cy="35" rx="15" ry="10" fill="#ffffff" fill-opacity="0.2" transform="rotate(-30 35 35)" />
// </svg>
