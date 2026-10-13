"use client"

import { useId, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus } from "lucide-react"
import { cn } from "cn"
import { Reveal } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { SectionHeading } from "@/components/landing/section-heading"
import { CONTACT_EMAIL, FAQS } from "../constants"

const FaqItem = ({ q, a, open, onToggle }: { q: string, a: string, open: boolean, onToggle: () => void }) => {
  const id = useId()

  return (
    <div className={cn("rounded-2xl transition-colors", open ? "bg-brand-surface-subtle ring-1 ring-brand-tint" : "bg-neutral-white ring-1 ring-ink-border")}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold text-ink-title sm:text-lg"
        >
          {q}
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", open ? "bg-brand text-white" : "bg-brand-surface text-brand")}
          >
            <Plus className="size-4" aria-hidden />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-[0.95rem] leading-relaxed text-ink-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Faq = () => {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <Section id="faq" containerClassName="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
      <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you need to know before your first link up."
        />
        <Reveal delay={0.1}>
          <p className="text-sm text-ink-meta">
            Something else? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand hover:underline">{CONTACT_EMAIL}</a>
          </p>
        </Reveal>
      </div>

      <Reveal className="flex flex-col gap-3">
        {FAQS.map((faq, i) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        ))}
      </Reveal>
    </Section>
  )
}

export default Faq
