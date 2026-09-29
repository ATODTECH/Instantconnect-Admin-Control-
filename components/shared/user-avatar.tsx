import { cn } from "cn"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initials } from "@/lib/format"

const PALETTE = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
]

/** Picked from the name, so a person keeps the same colour on every page. */
const colourFor = (name: string) => {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

const SIZES = {
  xs: "size-6 text-[8px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-xl",
  xl: "size-16 text-2xl font-extrabold",
} as const

interface UserAvatarProps {
  name: string
  src?: string | null
  size?: keyof typeof SIZES
  /** Communities and other groups use a rounded square rather than a circle. */
  shape?: "circle" | "square"
  /** Replaces the initials, e.g. a community's first letter. */
  fallback?: string
  className?: string
}

/** A person's photo, or their initials when there is none or it fails to load. */
export const UserAvatar = ({ name, src, size = "sm", shape = "circle", fallback, className }: UserAvatarProps) => {
  const corners = shape === "square" ? (size === "xl" ? "rounded-2xl" : "rounded-lg") : "rounded-full"

  return (
    <Avatar className={cn(SIZES[size], "shrink-0", corners, className)}>
      {src ? <AvatarImage src={src} alt="" className={cn("object-cover", corners)} /> : null}
      <AvatarFallback className={cn("font-medium", corners, colourFor(name))}>{fallback ?? initials(name)}</AvatarFallback>
    </Avatar>
  )
}
