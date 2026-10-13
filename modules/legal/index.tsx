import Link from "next/link"
import { CalendarDays, FileText, Mail, ShieldCheck } from "lucide-react"
import { cn } from "cn"
import { LegalMarkdown } from "@/components/legal/legal-markdown"
import { Container } from "@/components/landing/section"
import type { LegalDocument, LegalSlug } from "@/lib/legal"
import { ROUTES } from "@/lib/routes"
import CityMap from "@/modules/landing/hero/city-map"
import { CONTACT_EMAIL } from "@/modules/landing/constants"
import { TableOfContents } from "./table-of-contents"

const DOCUMENTS: { slug: LegalSlug, label: string, href: string, icon: typeof ShieldCheck, blurb: string }[] = [
  { slug: "privacy-notice", label: "Privacy Notice", href: ROUTES.privacy, icon: ShieldCheck, blurb: "What we collect, why, who we share it with, and the rights you have over it." },
  { slug: "terms-of-use", label: "Terms of Use", href: ROUTES.terms, icon: FileText, blurb: "The agreement between you and us when you use InstantLinkUp, and the standards every member keeps." },
]

/** Pills to hop between the legal documents. */
const DocumentSwitch = ({ current }: { current: LegalSlug }) => (
  <nav aria-label="Legal documents" className="inline-flex rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur">
    {DOCUMENTS.map(({ slug, label, href, icon: Icon }) => (
      <Link
        key={slug}
        href={href}
        aria-current={slug === current ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          slug === current ? "bg-white text-ink-title" : "text-white/75 hover:text-white",
        )}
      >
        <Icon className="size-4" aria-hidden />
        {label}
      </Link>
    ))}
  </nav>
)

const ContactCard = () => (
  <div className="flex flex-col gap-3 rounded-3xl border-2 border-ink-title bg-tone-lilac p-5 shadow-[5px_5px_0_0_#141417]">
    <span className="flex size-10 items-center justify-center rounded-2xl border-2 border-ink-title bg-white">
      <Mail className="size-4.5 text-brand" aria-hidden />
    </span>
    <span className="font-display text-lg font-bold leading-tight text-ink-title">Questions about this?</span>
    <span className="text-sm leading-relaxed text-ink-body">Email us, or reach us through Help &amp; Support in the app.</span>
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-semibold text-brand underline decoration-brand-tint underline-offset-4 hover:decoration-brand">
      {CONTACT_EMAIL}
    </a>
  </div>
)

interface LegalPageProps {
  slug: LegalSlug
  document: LegalDocument
}

const LegalPage = ({ slug, document }: LegalPageProps) => {
  const blurb = DOCUMENTS.find((doc) => doc.slug === slug)?.blurb

  return (
    <>
      <header className="relative isolate overflow-hidden bg-bg-primary pb-16 pt-36 sm:pb-20 sm:pt-40">
        <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
          <CityMap className="absolute inset-0 h-full w-full" />
          <div className="absolute -right-24 top-0 size-[30rem] rounded-full bg-brand/30 blur-[120px]" />
          <div className="absolute inset-0 bg-linear-to-r from-bg-primary via-bg-primary/80 to-transparent" />
        </div>
        <Container className="flex flex-col items-start gap-6">
          <DocumentSwitch current={slug} />
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-7xl">{document.title}</h1>
          {blurb && <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{blurb}</p>}
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white/80 ring-1 ring-white/15">
            <CalendarDays className="size-4 text-brand-soft" aria-hidden />
            Last updated {document.lastUpdated}
          </span>
        </Container>
      </header>

      <Container className="grid gap-10 py-14 sm:py-20 lg:grid-cols-[17rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pb-6 scrollbar-thin">
          <div className="flex flex-col gap-8">
            <TableOfContents headings={document.headings} />
            <div className="hidden lg:block">
              <ContactCard />
            </div>
          </div>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <LegalMarkdown>{document.body}</LegalMarkdown>
          <div className="mt-16 lg:hidden">
            <ContactCard />
          </div>
        </article>
      </Container>
    </>
  )
}

export default LegalPage
