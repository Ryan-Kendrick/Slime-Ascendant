import { PropsWithChildren } from "react"

export default function Background({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-amber-200 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute lg:-top-10 lg:left-0 w-[70%] aspect-square rounded-full bg-gradient-to-r from-amber-950 to-amber-800 blur-3xl" />
        <div className="absolute lg:top-1/3 lg:left-1/2 w-[40%] aspect-square rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 blur-3xl" />
        <div className="absolute top-0 -translate-y-[12%] right-0 translate-x-[25%] md:translate-x-[18%] lg:top-3/4 lg:right-0 lg:translate-x-1/4 lg:-translate-y-[70%] md:w-[160%] lg:w-[62%] min-w-[1150px] aspect-square rounded-full bg-gradient-to-r from-purple-700 to-violet-900 blur-3xl" />
      </div>
      <div className="absolute flex flex-col-reverse lg:flex-row inset-0 overflow-hidden blur-sm">
        <div className="lg:basis-3/5 grow" />
        <svg
          className="lg:basis-2/5 absolute lg:relative top-56 min-w-[500px]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none">
          <defs>
            <linearGradient id="ray-gradient-1" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="20%" className="text-white/80" stopColor="currentColor" />
              <stop offset="90%" className="text-transparent" stopColor="currentColor" />
            </linearGradient>
          </defs>
          <polygon points="0,0 100,0 80,100 20,100" fill="url(#ray-gradient-1)" />
        </svg>
      </div>

      {children}
    </div>
  )
}
