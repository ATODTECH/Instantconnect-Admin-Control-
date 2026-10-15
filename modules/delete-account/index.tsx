import { Archive, CreditCard, Mail, Smartphone, Trash2 } from "lucide-react"
import { Container } from "@/components/landing/section"
import CityMap from "@/modules/landing/hero/city-map"
import { CONTACT_EMAIL } from "@/modules/landing/constants"

const APP_STEPS = [
  "Open InstantLinkUp and sign in.",
  "Go to Profile, then Settings, then Delete Account.",
  "Choose why you're leaving and continue.",
  "Enter the code we email you to confirm it's really you.",
]

const DELETED = [
  "Your profile, photos, bio and interests",
  "Your messages, posts, comments and connections",
  "Your meetups, safety circle and location history",
  "Your identity verification documents and selfie",
  "Your PIN, settings and notification preferences",
]

const KEPT = [
  "Payment and transaction records, for as long as Nigerian tax and accounting law requires.",
  "Reports and moderation records, for up to three months, or longer if needed for a legal claim or a law enforcement request.",
  "Copies in backups, kept isolated and secure until the backup expires.",
]

const EMAIL_SUBJECT = "Delete my InstantLinkUp account"

const Card = ({ icon: Icon, title, children }: { icon: typeof Trash2, title: string, children: React.ReactNode }) => (
  <section className="flex flex-col gap-5 rounded-3xl bg-neutral-white p-6 ring-1 ring-ink-border sm:p-8">
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-surface">
        <Icon className="size-4.5 text-brand" aria-hidden />
      </span>
      <h2 className="font-display text-xl font-bold leading-tight text-ink-title sm:text-2xl">{title}</h2>
    </div>
    {children}
  </section>
)

const List = ({ items }: { items: string[] }) => (
  <ul className="flex flex-col gap-3">
    {items.map((item) => (
      <li key={item} className="flex gap-3 text-base leading-relaxed text-ink-body">
        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand" />
        {item}
      </li>
    ))}
  </ul>
)

/**
 * The public account deletion page Google Play asks for: how to delete in the
 * app, how to ask without it, and what is deleted or kept (Privacy Notice §7).
 */
const DeleteAccountPage = () => (
  <>
    <header className="relative isolate overflow-hidden bg-bg-primary pb-16 pt-36 sm:pb-20 sm:pt-40">
      <div aria-hidden className="absolute inset-0 -z-10 opacity-70">
        <CityMap className="absolute inset-0 h-full w-full" />
        <div className="absolute -right-24 top-0 size-[30rem] rounded-full bg-brand/30 blur-[120px]" />
        <div className="absolute inset-0 bg-linear-to-r from-bg-primary via-bg-primary/80 to-transparent" />
      </div>
      <Container className="flex flex-col items-start gap-6">
        <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-7xl">Delete your account</h1>
        <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
          You can delete your InstantLinkUp account at any time, from the app or by emailing us. Your account disappears from the app straight away.
        </p>
      </Container>
    </header>

    <Container className="grid max-w-4xl gap-6 py-14 sm:py-20">
      <Card icon={Smartphone} title="In the app">
        <ol className="flex flex-col gap-3">
          {APP_STEPS.map((step, index) => (
            <li key={step} className="flex gap-3 text-base leading-relaxed text-ink-body">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{index + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm leading-relaxed text-ink-muted">Your account closes as soon as you confirm.</p>
      </Card>

      <Card icon={Mail} title="Without the app">
        <p className="text-base leading-relaxed text-ink-body">
          If you no longer have the app, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
            className="font-semibold text-brand underline decoration-brand-tint underline-offset-4 hover:decoration-brand"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          from the email address on your account, with the subject &ldquo;{EMAIL_SUBJECT}&rdquo;. We&apos;ll reply to confirm it&apos;s you, then close the account.
        </p>
      </Card>

      <Card icon={CreditCard} title="If you have a subscription">
        <p className="text-base leading-relaxed text-ink-body">
          Deleting your account does not cancel a subscription bought through Google Play or the App Store. Cancel it first in the store: on Android, open the Play Store, then Payments &amp; subscriptions, then Subscriptions.
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card icon={Trash2} title="What we delete">
          <List items={DELETED} />
          <p className="text-sm leading-relaxed text-ink-muted">Removed from the app immediately, and deleted or anonymised within three months.</p>
        </Card>

        <Card icon={Archive} title="What we keep">
          <List items={KEPT} />
        </Card>
      </div>
    </Container>
  </>
)

export default DeleteAccountPage
