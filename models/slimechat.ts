type Username = string
export type Color =
  | "#ef4444" // red
  | "#f97316" // orange
  | "#f59e0b" // amber
  | "#eab308" // yellow
  | "#84cc16" // lime
  | "#22c55e" // green
  | "#10b981" // emerald
  | "#14b8a6" // teal
  | "#06b6d4" // cyan
  | "#0ea5e9" // sky
  | "#3b82f6" // blue
  | "#6366f1" // indigo
  | "#8b5cf6" // violet
  | "#a855f7" // purple
  | "#d946ef" // fuchsia
  | "#ec4899" // pink
  | "#f43f5e" // rose
  | "#64748b" // slate
  | "#78716c" // stone

export interface ChatUser {
  name: Username
  color: Color
}

export interface Message {
  name: Username
  content: string
  unixTime: number
  color?: Color
}
