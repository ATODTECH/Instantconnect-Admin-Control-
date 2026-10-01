import type { LucideIcon } from "lucide-react"

interface NotLiveYetProps {
  icon: LucideIcon
  title: string
  /** Why the page is empty, in terms the admin can act on or wait for. */
  reason: string
  /** What the page will show once its feature exists. */
  planned: readonly string[]
}

/** For a page whose feature has no data behind it yet, so it shows nothing rather than invented figures. */
export const NotLiveYet = ({ icon: Icon, title, reason, planned }: NotLiveYetProps) => (
  <div className="flex-1 overflow-y-auto scrollbar-thin pr-8 pb-8">
    <section className="flex flex-col items-center rounded-2xl border border-primary-border bg-neutral-white px-6 py-16 text-center shadow-[0px_0px_10px_0px_#00000005]">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-surface-subtle text-brand">
        <Icon className="h-7 w-7" aria-hidden />
      </span>
      <h2 className="mt-5 text-lg font-bold text-neutral-light-600">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-neutral-light-400">{reason}</p>
      <div className="mt-8 w-full max-w-md rounded-xl border border-slate-100 bg-slate-50 p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-light-400">When it&apos;s live, this page will show</p>
        <ul className="mt-3 space-y-2 text-sm text-neutral-light-500">
          {planned.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </div>
)
