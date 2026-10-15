import { IconBadge } from "@/components/landing/feature-card"
import { RevealGroup, RevealItem } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { SectionHeading } from "@/components/landing/section-heading"
import { CATEGORIES } from "../constants"

const Categories = () => (
  <Section id="categories">
    <SectionHeading
      eyebrow="Way more than a swipe"
      title={<>Whatever you&apos;re looking for, <span className="text-brand-gradient">it&apos;s nearby</span></>}
      description="Dating apps stop at a match. InstantLinkUp starts with what you want from the people around you, then helps you actually meet them."
    />

    <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => (
        <RevealItem key={category.name}>
          <div className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-[2rem] border-2 border-ink-title bg-neutral-white p-7 shadow-[6px_6px_0_0_#141417] transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-1 hover:shadow-[9px_10px_0_0_#141417]">
            <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full bg-brand-surface-subtle transition-transform duration-500 group-hover:scale-150" />
            <IconBadge icon={category.icon} tone={category.tone} className="relative border-2 border-ink-title" />
            <div className="relative flex flex-col gap-2">
              <h3 className="font-display text-3xl font-bold tracking-[-0.03em] text-ink-title">{category.name}</h3>
              <p className="text-[0.95rem] leading-relaxed text-ink-muted">{category.body}</p>
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  </Section>
)

export default Categories
