import Image from "next/image"
import { BadgeCheck, MapPin, UserPlus } from "lucide-react"
import { cn } from "cn"
import { TONES, type Tone } from "@/components/landing/feature-card"
import { Reveal } from "@/components/landing/reveal"
import { PEOPLE, type Person } from "../people"

type Card = { person: Person, looking: string, tone: Tone }

const ROW_ONE: Card[] = [
  { person: PEOPLE.amara, looking: "Photo walk buddies", tone: "lilac" },
  { person: PEOPLE.kemi, looking: "A technical co-founder", tone: "sky" },
  { person: PEOPLE.marco, looking: "Supper club regulars", tone: "peach" },
  { person: PEOPLE.zara, looking: "Creators to collab with", tone: "blush" },
  { person: PEOPLE.seun, looking: "Squash on Saturdays", tone: "mint" },
]

const ROW_TWO: Card[] = [
  { person: PEOPLE.david, looking: "Vocalists for my next EP", tone: "peach" },
  { person: PEOPLE.ella, looking: "New friends in Lagos", tone: "blush" },
  { person: PEOPLE.tobi, looking: "A 6am gym partner", tone: "mint" },
  { person: PEOPLE.amara, looking: "Someone for Afronation", tone: "lilac" },
  { person: PEOPLE.kemi, looking: "Angel investors", tone: "sky" },
]

const ProfileCard = ({ card }: { card: Card }) => (
  <div className="relative aspect-3/4 w-56 shrink-0 overflow-hidden rounded-[1.75rem] bg-ink-title sm:w-64">
    <Image src={card.person.photo} alt="" fill sizes="256px" className="object-cover" />
    <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/85" />
    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-ink-title">
      <MapPin className="size-3 text-brand" aria-hidden /> {card.person.distance}
    </span>
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white">
      <span className={cn("w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold", TONES[card.tone])}>Looking for</span>
      <span className="text-[15px] font-semibold leading-snug">{card.looking}</span>
      <div className="mt-1 flex items-center justify-between">
        <span className="flex items-center gap-1 text-sm text-white/80">
          {card.person.name}, {card.person.age}
          <BadgeCheck className="size-4 fill-ink-verified text-white" aria-label="Verified" />
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient">
          <UserPlus className="size-4" aria-hidden />
        </span>
      </div>
    </div>
  </div>
)

/** One endless row; the cards are doubled so the loop has no seam. */
const Row = ({ cards, reverse }: { cards: Card[], reverse?: boolean }) => (
  <div className="group flex overflow-hidden">
    <div
      className={cn(
        "flex w-max shrink-0 gap-4 pr-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none",
        reverse ? "animate-marquee-reverse" : "animate-marquee",
      )}
    >
      {[...cards, ...cards].map((card, i) => (
        <div key={i} aria-hidden={i >= cards.length}>
          <ProfileCard card={card} />
        </div>
      ))}
    </div>
  </div>
)

/** The hero's night carries on into a drifting wall of people and what they're after. */
const PeopleWall = () => (
  <section aria-label="People on InstantLinkUp" className="relative overflow-hidden bg-bg-primary pb-24 pt-8">
    <Reveal className="mx-auto mb-14 max-w-3xl px-5 text-center">
      <p className="font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
        Not a swipe. <span className="text-brand-gradient">A link up.</span>
      </p>
      <p className="mt-4 text-base text-ic-muted sm:text-lg">Everyone here is after something real, and most of them are closer than your nearest buka.</p>
    </Reveal>

    <div className="flex -rotate-2 flex-col gap-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <Row cards={ROW_ONE} />
      <Row cards={ROW_TWO} reverse />
    </div>
  </section>
)

export default PeopleWall
