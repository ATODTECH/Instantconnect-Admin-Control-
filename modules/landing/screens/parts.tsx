import Image from "next/image"
import { BadgeCheck, MapPin } from "lucide-react"
import { cn } from "cn"

export const PEOPLE = {
  tobi: { name: "Tobi", age: 27, role: "Product designer", photo: "/landing/card-front.jpg", distance: "1.2 km" },
  amara: { name: "Amara", age: 25, role: "Photographer", photo: "/landing/avatar-2.jpg", distance: "800 m" },
  kemi: { name: "Kemi", age: 29, role: "Founder, fintech", photo: "/landing/card-back-right.jpg", distance: "2.4 km" },
  david: { name: "David", age: 26, role: "Music producer", photo: "/landing/avatar-1.jpg", distance: "3.1 km" },
  zara: { name: "Zara", age: 24, role: "Content creator", photo: "/landing/avatar-3.jpg", distance: "1.8 km" },
  seun: { name: "Seun", age: 32, role: "Startup lawyer", photo: "/landing/avatar-5.png", distance: "950 m" },
} as const

export type Person = (typeof PEOPLE)[keyof typeof PEOPLE]

/** The phone's status row, clear of the notch. */
export const StatusBar = ({ tone = "dark" }: { tone?: "light" | "dark" }) => (
  <div className={cn("flex items-center justify-between px-6 pt-3 text-[11px] font-semibold", tone === "light" ? "text-white" : "text-ink-title")}>
    <span>9:41</span>
    <span className="flex items-center gap-1" aria-hidden>
      <span className="h-2 w-3.5 rounded-[2px] border border-current" />
    </span>
  </div>
)

export const Avatar = ({ src, size = 36, online, className }: { src: string, size?: number, online?: boolean, className?: string }) => (
  <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
    <Image src={src} alt="" width={size * 2} height={size * 2} className="h-full w-full rounded-full object-cover" />
    {online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-ink-online ring-2 ring-white" />}
  </span>
)

export const VerifiedTick = ({ className }: { className?: string }) => (
  <BadgeCheck className={cn("size-3.5 fill-ink-verified text-white", className)} aria-label="Verified" />
)

/** A Discover card: photo, darkening scrim, name, role and distance. */
export const PersonCard = ({ person, className, compact }: { person: Person, className?: string, compact?: boolean }) => (
  <div className={cn("relative overflow-hidden rounded-2xl bg-ink-title", className)}>
    <Image src={person.photo} alt="" fill sizes="240px" className="object-cover" />
    <div className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-black/80" />
    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-ink-title">
      <MapPin className="size-2.5 text-brand" aria-hidden />
      {person.distance}
    </span>
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-2.5 text-white">
      <span className={cn("flex items-center gap-1 font-semibold", compact ? "text-[11px]" : "text-sm")}>
        {person.name}, {person.age}
        <VerifiedTick />
      </span>
      <span className={cn("text-white/75", compact ? "text-[9px]" : "text-[11px]")}>{person.role}</span>
    </div>
  </div>
)

/** The app's primary button: solid brand purple, fully rounded. */
export const AppButton = ({ children, variant = "solid", className }: { children: React.ReactNode, variant?: "solid" | "soft" | "ghost", className?: string }) => (
  <span
    className={cn(
      "flex items-center justify-center rounded-full px-3 py-2 text-[10px] font-semibold",
      variant === "solid" && "bg-brand text-white",
      variant === "soft" && "bg-brand-surface text-brand-deep",
      variant === "ghost" && "ring-1 ring-ink-border text-ink-muted",
      className,
    )}
  >
    {children}
  </span>
)
