export default function Spotlight() {
  return (
    <svg
      className="absolute -top-12 lg:top-0 left-1/2 -translate-x-1/2 h-full w-[490px] md:w-[550px] lg:w-full lg:w-[110%] blur-sm"
      viewBox="0 0 100 100"
      preserveAspectRatio="none">
      <defs>
        <linearGradient id="ray-gradient-1" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="10%" className="text-white/80" stopColor="currentColor" />
          <stop offset="80%" className="text-transparent" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <polygon points="0,0 100,0 80,100 20,100" fill="url(#ray-gradient-1)" />
    </svg>
  )
}
