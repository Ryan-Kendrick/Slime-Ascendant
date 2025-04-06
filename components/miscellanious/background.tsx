import { PropsWithChildren } from "react"

export default function Background({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen lg:max-h-screen bg-amber-200 overflow-hidden">
      <div id="background-colours" className="absolute h-full lg:relative flex flex-col-reverse lg:flex-row inset-0">
        <div className="grow lg:basis-3/5 lg:max-h-screen">
          <div className="h-full lg:ml-12 lg:h-[104%] overflow-clip scale-120 aspect-square rounded-b-[200px] lg:rounded-b-none lg:rounded-tl-[200px] bg-gradient-to-r from-amber-950 to-amber-800 blur-3xl" />
        </div>
        <div className="h-1/2 lg:h-auto relative lg:basis-2/5 shrink lg:min-h-screen">
          <div className="h-1/2 lg:h-full scale-125 lg:scale-115 xl:scale-130 lg:-translate-x-[20%] lg:translate-y-[20%] aspect-square rounded-full bg-gradient-to-b from-yellow-400 to-orange-600 blur-3xl" />
          <div className="absolute min-h-screen lg:h-full lg:h-full scale-120 lg:scale-110 xl:scale-120 top-0 lg:top-1/2 lg:-translate-y-[45%] lg:-translate-x-[10%] inset-0 aspect-[16/14] lg:aspect-[16/14] rounded-full lg:rounded-[40%] bg-gradient-to-r from-purple-700 to-violet-900 blur-3xl" />
        </div>
      </div>

      <div
        id="background-spotlight"
        className="absolute flex flex-col-reverse lg:flex-row inset-0 overflow-hidden blur-sm">
        <div className="lg:basis-3/5" />
        <svg
          className="absolute top-[160px] lg:relative lg:basis-2/5 grow self-center justify-self-end lg:self-auto w-[490px] md:w-[550px] lg:min-w-[400px] lg:top-0 xl:w-full"
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
      </div>

      {children}
    </div>
  )
}
