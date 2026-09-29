import { cn } from "cn"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { fmtDate, fmtNaira } from "../constants"

// Placeholder history until payments exist.
const PAYMENT_HISTORY: PaymentHistoryItem[] = [
  { date: "Jul 01, 2023", amount: "₦15,000", status: "success" },
  { date: "Jun 01, 2023", amount: "₦15,000", status: "success" },
  { date: "May 01, 2023", amount: "₦15,000", status: "success" },
  { date: "Apr 01, 2023", amount: "₦15,000", status: "failed", note: "Retry attempted" },
  { date: "Mar 01, 2023", amount: "₦15,000", status: "success" },
]

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-light-400">{children}</h4>
)

const comingSoon = () => alert("coming soon!")

const SubscriptionDetails = ({ subscription }: { subscription: SubscriptionRow }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-center gap-3 border-b-[.5px] border-b-[#F4F3F5] pb-6">
      <UserAvatar name={subscription.name} src={subscription.avatar || null} size="lg" />
      <div className="flex flex-col text-neutral-light-300">
        <p className="text-xl font-bold text-neutral-light-600">{subscription.name}</p>
        <p className="text-sm">{subscription.email}</p>
        <p className="flex items-center gap-1.5 text-[11px]">
          {subscription.phoneNumber}
          <span aria-hidden className="inline-flex h-1 w-1 shrink-0 rounded-full bg-neutral-light-300" />
          Member since {fmtDate(subscription.startDate)}
        </p>
      </div>
    </div>

    <div className="flex w-full flex-col gap-4 rounded-2xl border border-[#F3E8FF] bg-bg-purple-light-200 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-primary">Current Plan</p>
          <p className="mt-1 text-xl font-extrabold text-neutral-light-600">{subscription.subscriptionPlan}</p>
        </div>
        {subscription.isPro && (
          <span className="rounded-full bg-brand-gradient px-2.5 py-1 text-[11px] font-bold text-neutral-white">PRO</span>
        )}
      </div>
      <div className="flex gap-10">
        <div>
          <p className="text-[11px] uppercase text-neutral-light-400">Price</p>
          <p className="mt-1 text-[15px] font-bold text-neutral-light-600">{fmtNaira(subscription.amount)} / month</p>
        </div>
        <div>
          <p className="text-[11px] uppercase text-neutral-light-400">Billing cycle</p>
          <p className="mt-1 text-[15px] font-semibold text-neutral-light-600">Monthly</p>
        </div>
      </div>
    </div>

    <section className="flex flex-col gap-3 border-b-[.5px] border-b-[#F4F3F5] pb-5">
      <SectionLabel>Payment method</SectionLabel>
      <div className="flex items-center justify-between gap-4 rounded-lg border border-[#E5E7EB] p-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-7 min-w-11 items-center justify-center rounded-sm bg-neutral-light-600 px-1 text-[11px] font-black italic whitespace-nowrap text-neutral-white">
            {subscription.paymentMethod}
          </span>
          <div>
            <p className="text-sm font-semibold text-neutral-light-500">
              {subscription.paymentMethod}
              {subscription.paymentCardPin ? ` ending in ${subscription.paymentCardPin}` : ""}
            </p>
            <p className="text-xs tracking-wide text-neutral-light-300">Expiry: 09/28</p>
          </div>
        </div>
        <Button variant="link" size="sm" onClick={comingSoon} className="font-semibold">Change</Button>
      </div>
    </section>

    <section className="flex flex-col gap-3">
      <SectionLabel>Billing Summary</SectionLabel>
      <dl className="flex flex-col divide-y divide-neutral-100 bg-[#F9FAFB] text-[13px]">
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-neutral-light-400">Next billing date</dt>
          <dd className="font-semibold text-neutral-light-600">Aug 01, 2023</dd>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <dt className="text-neutral-light-400">Last payment</dt>
          <dd className="flex items-center gap-2 font-semibold text-neutral-light-600">
            ₦15,000 <StatusBadge tone="success">Success</StatusBadge>
          </dd>
        </div>
        <div className="flex items-center justify-between bg-bg-purple-light-200 px-4 py-3">
          <dt className="text-neutral-light-400">Total paid to date</dt>
          <dd className="text-sm font-bold text-neutral-light-600">
            ₦165,000 <span className="text-xs font-normal text-neutral-light-400">(11 months)</span>
          </dd>
        </div>
      </dl>
    </section>

    <section className="flex flex-col gap-3">
      <SectionLabel>Payment history</SectionLabel>
      <ul className="space-y-3">
        {PAYMENT_HISTORY.map((item) => (
          <li key={item.date} className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[13px] text-neutral-light-600">{item.date}</p>
              {item.note && <p className="text-[10px] font-semibold text-primary">{item.note}</p>}
            </div>
            <div className="flex items-center gap-2">
              <p className={cn("text-[13px] font-semibold", item.status === "failed" ? "text-neutral-light-300" : "text-neutral-light-600")}>
                {item.amount}
              </p>
              <StatusBadge tone={item.status === "success" ? "success" : "danger"}>{item.status === "success" ? "Success" : "Failed"}</StatusBadge>
            </div>
          </li>
        ))}
      </ul>
      <Button variant="link" onClick={comingSoon} className="font-semibold">View full history</Button>
    </section>

    <div className="flex gap-3 pt-2">
      <Button variant="outline" size="lg" className="flex-1" onClick={comingSoon}>Change Plan</Button>
      <Button variant="outline" size="lg" className="flex-1" onClick={comingSoon}>Refund Last</Button>
    </div>
  </div>
)

export default SubscriptionDetails
