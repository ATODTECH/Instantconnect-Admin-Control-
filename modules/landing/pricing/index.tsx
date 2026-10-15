"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check } from "lucide-react"
import { cn } from "cn"
import { IconBadge } from "@/components/landing/feature-card"
import { RevealGroup, RevealItem } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { SectionHeading } from "@/components/landing/section-heading"
import { PLANS, type BillingCycle, type Plan } from "../constants"

const naira = (amount: number) => `₦${amount.toLocaleString("en-NG")}`

/** The headline saving, from the first paid plan's own prices. */
const ANNUAL_SAVING = (() => {
  const plan = PLANS.find((p) => p.monthly > 0)
  return plan ? Math.round((1 - plan.annual / (plan.monthly * 12)) * 100) : 0
})()

const CycleToggle = ({ cycle, onChange }: { cycle: BillingCycle, onChange: (cycle: BillingCycle) => void }) => (
  <div role="radiogroup" aria-label="Billing cycle" className="relative inline-flex rounded-full bg-brand-surface-subtle p-1 ring-1 ring-brand-tint">
    {(["monthly", "annual"] as const).map((option) => (
      <button
        key={option}
        type="button"
        role="radio"
        aria-checked={cycle === option}
        onClick={() => onChange(option)}
        className={cn("relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold capitalize transition-colors", cycle === option ? "text-white" : "text-ink-muted")}
      >
        {cycle === option && (
          <motion.span layoutId="cycle-pill" className="absolute inset-0 -z-10 rounded-full bg-brand" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
        )}
        {option}
        {option === "annual" && ANNUAL_SAVING > 0 && (
          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", cycle === option ? "bg-white/20 text-white" : "bg-tone-mint text-ink-verified")}>
            Save {ANNUAL_SAVING}%
          </span>
        )}
      </button>
    ))}
  </div>
)

const PlanCard = ({ plan, cycle }: { plan: Plan, cycle: BillingCycle }) => {
  const price = cycle === "monthly" ? plan.monthly : plan.annual
  const featured = plan.featured

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-6 rounded-3xl p-7 sm:p-8",
        featured ? "bg-bg-primary text-white ring-2 ring-brand/70 shadow-[0_40px_80px_-30px_rgba(147,51,234,0.6)] lg:-my-4 lg:py-12" : "bg-neutral-white ring-1 ring-ink-border",
      )}
    >
      {featured && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Most popular
        </span>
      )}

      <div className="flex items-center gap-3">
        <IconBadge icon={plan.icon} tone="lilac" variant={featured ? "glass" : "tone"} />
        <div className="flex flex-col">
          <h3 className={cn("text-lg font-bold", featured ? "text-white" : "text-ink-title")}>{plan.name}</h3>
          <p className={cn("text-sm", featured ? "text-ic-muted" : "text-ink-meta")}>{plan.tagline}</p>
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={`${plan.id}-${cycle}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className={cn("text-4xl font-bold tracking-tight sm:text-5xl", featured ? "text-white" : "text-ink-title")}
          >
            {price === 0 ? "Free" : naira(price)}
          </motion.span>
        </AnimatePresence>
        {price > 0 && <span className={cn("pb-1.5 text-sm", featured ? "text-ic-muted" : "text-ink-meta")}>/{cycle === "monthly" ? "month" : "year"}</span>}
      </div>

      <ul className="flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-[0.95rem]">
            <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full", featured ? "bg-brand" : "bg-brand-surface")}>
              <Check className={cn("size-3", featured ? "text-white" : "text-brand")} strokeWidth={3} aria-hidden />
            </span>
            <span className={featured ? "text-white/90" : "text-ink-body"}>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="#download"
        className={cn(
          "mt-auto flex h-12 items-center justify-center rounded-full text-sm font-semibold transition-colors",
          featured ? "bg-brand-gradient text-white hover:opacity-90" : "bg-brand-surface text-brand-deep hover:bg-brand-tint",
        )}
      >
        {price === 0 ? "Get started free" : `Get ${plan.name}`}
      </a>
    </div>
  )
}

const Pricing = () => {
  const [cycle, setCycle] = useState<BillingCycle>("monthly")

  return (
    <Section id="pricing" className="bg-brand-surface-subtle/60">
      <SectionHeading
        eyebrow="Pricing"
        title={<>Free to meet people. <span className="text-brand-gradient">Upgrade</span> when you&apos;re ready.</>}
        description="Everything that keeps you safe is free, always. LinkUp Plus adds reach, control and an ad-free app."
      />

      <div className="mt-10 flex justify-center">
        <CycleToggle cycle={cycle} onChange={setCycle} />
      </div>

      <RevealGroup className="mx-auto mt-14 grid max-w-4xl items-stretch gap-6 md:grid-cols-2 lg:gap-5">
        {PLANS.map((plan) => (
          <RevealItem key={plan.id}>
            <PlanCard plan={plan} cycle={cycle} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}

export default Pricing
