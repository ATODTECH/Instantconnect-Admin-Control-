import { CreditCard, Landmark, Wallet } from "lucide-react"
import type { FilterOption } from "@/components/shared/filter-select"
import type { FilterTab } from "@/components/shared/filter-tabs"
import type { Tone } from "@/lib/tones"
import type { PaymentMethod, PaymentStatus, SubscriptionStatus, SubscriptionTab, SubscriptionWindow } from "@/types/admin-subscriptions"

export type SubscriptionsTab = SubscriptionTab | "all"

export const SUBSCRIPTION_TABS: readonly FilterTab<SubscriptionsTab>[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Failed Payment", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
]

export const STATUS_LABELS: Record<SubscriptionStatus, { label: string, tone: Tone }> = {
  active: { label: "Active", tone: "success" },
  non_renewing: { label: "Cancelled", tone: "warning" },
  past_due: { label: "Failed", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "warning" },
  expired: { label: "Expired", tone: "neutral" },
}

export const PAYMENT_LABELS: Record<PaymentStatus, { label: string, tone: Tone }> = {
  success: { label: "Success", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  pending: { label: "Pending", tone: "warning" },
  abandoned: { label: "Abandoned", tone: "neutral" },
  refunded: { label: "Refunded", tone: "info" },
}

export const WINDOW_FILTER: readonly FilterOption<SubscriptionWindow>[] = [
  { label: "All time" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
  { label: "Last 12 Months", value: "12m" },
]

export const planTone = (planId: string): Tone => (planId === "pro" ? "brand" : "info")

/** Kobo in, "₦15,000" out: the exact figure the design shows. */
export const formatNairaExact = (amountMinor: number) => `₦${(amountMinor / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`

const titleCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** "Visa 4532", "GTBank Transfer", "USSD". */
export function describeMethod(method: PaymentMethod | null): string {
  if (!method) return "Not yet charged"
  if (method.cardLast4) return `${titleCase(method.cardBrand ?? "Card")} ${method.cardLast4}`
  if (method.bank) return `${method.bank}${method.channel === "bank_transfer" || method.channel === "bank" ? " Transfer" : ""}`

  return method.channel ? titleCase(method.channel.replace(/_/g, " ")) : "Unknown"
}

export const MethodIcon = ({ method }: { method: PaymentMethod | null }) => {
  const Icon = method?.cardLast4 ? CreditCard : method?.bank ? Landmark : Wallet

  return <Icon className="h-4 w-4 shrink-0 text-neutral-light-300" aria-hidden />
}
