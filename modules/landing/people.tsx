import Image from "next/image"
import { cn } from "cn"

/** The made-up members who appear across the landing page, with photos from the app's onboarding. */
export const PEOPLE = {
  tobi: { name: "Tobi", age: 27, role: "Product designer", photo: "/landing/card-front.jpg", distance: "1.2 km" },
  amara: { name: "Amara", age: 25, role: "Photographer", photo: "/landing/avatar-2.jpg", distance: "800 m" },
  kemi: { name: "Kemi", age: 29, role: "Founder, fintech", photo: "/landing/card-back-right.jpg", distance: "2.4 km" },
  david: { name: "David", age: 26, role: "Music producer", photo: "/landing/avatar-1.jpg", distance: "3.1 km" },
  zara: { name: "Zara", age: 24, role: "Content creator", photo: "/landing/avatar-3.jpg", distance: "1.8 km" },
  seun: { name: "Seun", age: 32, role: "Startup lawyer", photo: "/landing/avatar-5.png", distance: "950 m" },
  ella: { name: "Ella", age: 26, role: "UX researcher", photo: "/landing/card-back-left.jpg", distance: "2.1 km" },
  marco: { name: "Marco", age: 30, role: "Chef", photo: "/landing/avatar-4.jpg", distance: "1.5 km" },
} as const

export type Person = (typeof PEOPLE)[keyof typeof PEOPLE]

export const Avatar = ({ src, size = 36, online, className }: { src: string, size?: number, online?: boolean, className?: string }) => (
  <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
    <Image src={src} alt="" width={size * 2} height={size * 2} className="h-full w-full rounded-full object-cover" />
    {online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-ink-online ring-2 ring-white" />}
  </span>
)
