import Image from "next/image"
import { ArrowLeft, Bell, CalendarClock, Check, Clock, MapPin, Search, Send, ShieldCheck, SlidersHorizontal } from "lucide-react"
import { cn } from "cn"
import type { HowItWorksKey } from "../constants"
import { AppButton, Avatar, PEOPLE, PersonCard, StatusBar, VerifiedTick } from "./parts"

const CHIPS = ["All", "Friendship", "Business", "Talents"]

/** Home and Discover: greeting, search, category chips and a people grid. */
export const DiscoverScreen = () => (
  <div className="flex h-full flex-col bg-neutral-white">
    <StatusBar />
    <div className="flex items-center justify-between px-4 pt-4">
      <div className="flex flex-col">
        <span className="text-[10px] text-ink-meta">Good evening</span>
        <span className="flex items-center gap-1 text-[13px] font-bold text-ink-title">
          <MapPin className="size-3 text-brand" aria-hidden /> Lekki, Lagos
        </span>
      </div>
      <span className="relative flex size-8 items-center justify-center rounded-full bg-brand-surface-subtle">
        <Bell className="size-4 text-ink-title" aria-hidden />
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#EF4444]" />
      </span>
    </div>
    <div className="mx-4 mt-3 flex items-center gap-2 rounded-full bg-[#F9F9F9] px-3 py-2 ring-1 ring-ink-border">
      <Search className="size-3.5 text-ink-meta" aria-hidden />
      <span className="flex-1 text-[10px] text-ink-placeholder">Search people, places, events</span>
      <SlidersHorizontal className="size-3.5 text-brand" aria-hidden />
    </div>
    <div className="mt-3 flex gap-1.5 overflow-hidden px-4">
      {CHIPS.map((chip, i) => (
        <span
          key={chip}
          className={cn("shrink-0 rounded-full px-2.5 py-1 text-[9px] font-medium", i === 0 ? "bg-brand text-white" : "bg-brand-surface-subtle text-ink-muted ring-1 ring-ink-border")}
        >
          {chip}
        </span>
      ))}
    </div>
    <div className="mx-4 mt-3 rounded-xl bg-brand-gradient p-2.5 text-white">
      <span className="text-[10px] font-bold">18 people nearby match your vibe</span>
      <span className="mt-0.5 block text-[8.5px] text-white/80">Friendship · within 5 km · online now</span>
    </div>
    <div className="mt-3 grid flex-1 grid-cols-2 gap-2 px-4 pb-4">
      <PersonCard person={PEOPLE.amara} compact />
      <PersonCard person={PEOPLE.tobi} compact />
      <PersonCard person={PEOPLE.kemi} compact />
      <PersonCard person={PEOPLE.david} compact />
    </div>
  </div>
)

const ThreadHeader = () => (
  <div className="flex items-center gap-2 border-b border-ink-border px-4 pb-2.5 pt-4">
    <ArrowLeft className="size-4 text-ink-title" aria-hidden />
    <Avatar src={PEOPLE.amara.photo} size={30} online />
    <div className="flex flex-col">
      <span className="flex items-center gap-1 text-[12px] font-semibold text-ink-title">Amara <VerifiedTick /></span>
      <span className="text-[9px] text-ink-online">Online</span>
    </div>
  </div>
)

const Bubble = ({ children, mine }: { children: React.ReactNode, mine?: boolean }) => (
  <div
    className={cn(
      "max-w-[78%] rounded-xl px-2.5 py-1.5 text-[10px] leading-snug",
      mine ? "self-end rounded-br-sm bg-brand text-white" : "self-start rounded-bl-sm bg-[#F4F3F5] text-ink-title",
    )}
  >
    {children}
  </div>
)

const Composer = () => (
  <div className="mt-auto flex items-center gap-2 border-t border-ink-border px-3 py-2.5">
    <span className="flex-1 rounded-full bg-[#F9F9F9] px-3 py-1.5 text-[9.5px] text-ink-placeholder ring-1 ring-ink-border">Type a message…</span>
    <span className="flex size-7 items-center justify-center rounded-full bg-brand">
      <Send className="size-3.5 text-white" aria-hidden />
    </span>
  </div>
)

/** A connected pair's thread, warming up to a meetup. */
export const ChatScreen = () => (
  <div className="flex h-full flex-col bg-neutral-white">
    <StatusBar />
    <ThreadHeader />
    <div className="flex flex-col gap-1.5 px-3 py-3">
      <span className="self-center rounded-full bg-brand-surface-subtle px-2 py-0.5 text-[8.5px] text-ink-meta">You&apos;re now connected</span>
      <Bubble>Hey! Saw you&apos;re into film photography too 📸</Bubble>
      <Bubble mine>Yes!! Been shooting Portra all month. You?</Bubble>
      <Bubble>Same. There&apos;s a photo walk at Freedom Park on Saturday</Bubble>
      <Bubble mine>No way, I was going to go. Want to link up there?</Bubble>
      <Bubble>Let&apos;s do it 🙌</Bubble>
      <span className="self-end flex items-center gap-0.5 text-[8px] text-ink-meta">Read <Check className="size-2.5 text-brand" aria-hidden /></span>
    </div>
    <Composer />
  </div>
)

const SLOTS = ["Sat 10 AM", "Sat 2 PM", "Sun 11 AM"]

/** The meetup proposal card, dropped into the thread. */
export const PlanScreen = () => (
  <div className="flex h-full flex-col bg-neutral-white">
    <StatusBar />
    <ThreadHeader />
    <div className="flex flex-col gap-1.5 px-3 py-3">
      <Bubble>Let&apos;s do it 🙌</Bubble>
      <div className="mt-1 self-stretch overflow-hidden rounded-2xl ring-1 ring-brand-tint">
        <div className="relative h-20">
          <Image src="/landing/place-freedom-park.jpg" alt="" fill sizes="260px" className="object-cover" />
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[8.5px] font-semibold text-brand-deep">
            <CalendarClock className="size-2.5" aria-hidden /> Meetup proposal
          </span>
        </div>
        <div className="flex flex-col gap-2 p-2.5">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-ink-title">Freedom Park, Lagos Island</span>
            <span className="text-[9px] text-ink-meta">Photo walk · 3.4 km away</span>
          </div>
          <span className="text-[8.5px] font-semibold uppercase tracking-wider text-ink-meta">Pick a time</span>
          <div className="flex gap-1.5">
            {SLOTS.map((slot, i) => (
              <span
                key={slot}
                className={cn("rounded-full px-2 py-1 text-[9px] font-medium", i === 0 ? "bg-brand text-white" : "bg-brand-surface-subtle text-ink-muted ring-1 ring-ink-border")}
              >
                {slot}
              </span>
            ))}
          </div>
          <AppButton>Confirm Meetup</AppButton>
          <div className="flex gap-1.5">
            <AppButton variant="soft" className="flex-1">Suggest other time</AppButton>
            <AppButton variant="ghost" className="flex-1">Decline</AppButton>
          </div>
        </div>
      </div>
    </div>
    <Composer />
  </div>
)

/** The meetup screen on the day: the viewer's own one-time arrival code. */
export const VerifyScreen = () => (
  <div className="flex h-full flex-col bg-brand-gradient text-white">
    <StatusBar tone="light" />
    <div className="flex items-center gap-2 px-4 pt-4">
      <ArrowLeft className="size-4" aria-hidden />
      <span className="text-[12px] font-semibold">Meetup with Amara</span>
    </div>
    <div className="mx-4 mt-4 flex flex-col items-center gap-2 rounded-2xl bg-white/15 p-4 ring-1 ring-white/25 backdrop-blur">
      <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/80">Your one-time code</span>
      <div className="flex gap-1.5">
        {["4", "8", "2", "7"].map((digit, i) => (
          <span key={i} className="flex h-11 w-9 items-center justify-center rounded-lg bg-white text-xl font-bold text-ink-title">{digit}</span>
        ))}
      </div>
      <span className="flex items-center gap-1 text-[9px] text-white/80"><Clock className="size-2.5" aria-hidden /> Valid until 12:00 PM</span>
    </div>
    <div className="mx-4 mt-3 flex flex-col gap-2 rounded-2xl bg-neutral-white p-3 text-ink-title">
      <div className="flex items-center gap-2">
        <Avatar src={PEOPLE.amara.photo} size={30} />
        <div className="flex flex-1 flex-col">
          <span className="text-[11px] font-semibold">Amara confirmed you arrived</span>
          <span className="text-[9px] text-ink-meta">Freedom Park · 10:04 AM</span>
        </div>
        <span className="flex size-6 items-center justify-center rounded-full bg-ink-verified">
          <Check className="size-3.5 text-white" strokeWidth={3} aria-hidden />
        </span>
      </div>
      <div className="h-px bg-ink-border" />
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-full bg-tone-mint">
          <ShieldCheck className="size-3.5 text-ink-verified" aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="text-[10.5px] font-semibold">Safety circle notified</span>
          <span className="text-[9px] text-ink-meta">Mum and Ada know you&apos;ve arrived</span>
        </div>
      </div>
    </div>
    <div className="mx-4 mt-auto mb-5 flex flex-col gap-2">
      <span className="rounded-full bg-white py-2.5 text-center text-[11px] font-semibold text-brand-deep">Enter Amara&apos;s code</span>
      <span className="text-center text-[9px] text-white/75">Codes only work in person, and expire after the meetup</span>
    </div>
  </div>
)

export const SCREENS: Record<HowItWorksKey, () => React.JSX.Element> = {
  discover: DiscoverScreen,
  chat: ChatScreen,
  plan: PlanScreen,
  verify: VerifyScreen,
}
