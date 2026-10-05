"use client"

import { cn } from "cn"
import { DetailSection } from "@/components/shared/detail-parts"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetError } from "@/components/widget-state"
import { useSubscription } from "@/hooks/use-subscriptions"
import type { AdminSubscriptionDetail } from "@/types/admin-subscriptions"
import { formatDay } from "../../events/constants"
import { MethodIcon, PAYMENT_LABELS, STATUS_LABELS, describeMethod, formatNairaExact, planTone } from "../constants"

const MONTH_YEAR = new Intl.DateTimeFormat("en-NG", { month: "short", year: "numeric", timeZone: "Africa/Lagos" })

const DetailsSkeleton = () => (
  <div role="status" className="flex flex-col gap-5">
    <span className="sr-only">Loading subscription</span>
    <div className="flex gap-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-28 w-full rounded-xl" />
    <Skeleton className="h-16 w-full rounded-xl" />
    <Skeleton className="h-32 w-full" />
  </div>
)

interface SubscriptionDetailsProps {
  subscriptionId: string
  onRefund: (subscription: AdminSubscriptionDetail) => void
}

const SubscriptionDetails = ({ subscriptionId, onRefund }: SubscriptionDetailsProps) => {
  const { data: subscription, isPending, isError, error, refetch, isRefetching } = useSubscription(subscriptionId)

  if (isPending) return <DetailsSkeleton />
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-16" />
  }

  const last = subscription.payments.find((payment) => payment.status !== "pending")
  const renews = subscription.status === "active" || subscription.status === "past_due"
  const method = subscription.paymentMethod

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <UserAvatar name={subscription.fullName} src={subscription.avatarUrl} size="lg" />
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-neutral-light-600 wrap-break-word">{subscription.fullName}</h3>
          <p className="truncate text-sm text-neutral-light-400">{subscription.email}</p>
          <p className="text-xs text-neutral-light-300">
            {subscription.phone && <>{subscription.phone} · </>}Member since {MONTH_YEAR.format(new Date(subscription.memberSince))}
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-violet-200 bg-[#FAF5FF] p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Current Plan</p>
            <p className="text-lg font-bold text-neutral-light-600">{subscription.planName}</p>
          </div>
          <div className="flex gap-1.5">
            <StatusBadge tone={planTone(subscription.planId)}>{subscription.planId.toUpperCase()}</StatusBadge>
            <StatusBadge tone={STATUS_LABELS[subscription.status].tone}>{STATUS_LABELS[subscription.status].label}</StatusBadge>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase text-neutral-light-300">Price</p>
            <p className="font-bold text-neutral-light-600">
              {formatNairaExact(subscription.amountMinor)} / {subscription.cycle === "monthly" ? "month" : "year"}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-neutral-light-300">Billing Cycle</p>
            <p className="font-bold text-neutral-light-600">{subscription.cycle === "monthly" ? "Monthly" : "Annual"}</p>
          </div>
        </div>
      </section>

      <DetailSection title="Payment Method">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
          <MethodIcon method={method} />
          <div>
            <p className="text-sm font-semibold text-neutral-light-600">
              {method?.cardLast4 ? `${describeMethod(method).split(" ")[0]} ending in ${method.cardLast4}` : describeMethod(method)}
            </p>
            {method?.cardExpiry && <p className="text-xs text-neutral-light-400">Expiry: {method.cardExpiry}</p>}
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Billing Summary">
        <div className="space-y-2 rounded-xl bg-[#FAF9FB] p-4 text-sm">
          <div className="flex justify-between gap-3">
            <span className="text-neutral-light-400">{renews && !subscription.cancelAtPeriodEnd ? "Next billing date" : "Plan ends"}</span>
            <span className="font-semibold text-neutral-light-600">{formatDay(subscription.currentPeriodEnd)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-neutral-light-400">Last payment</span>
            <span className="flex items-center gap-2 font-semibold text-neutral-light-600">
              {last ? (
                <>
                  {formatNairaExact(last.amountMinor)}
                  <span className={cn("text-xs font-medium", last.status === "success" ? "text-[#16A34A]" : "text-[#C92B2B]")}>
                    {PAYMENT_LABELS[last.status].label}
                  </span>
                </>
              ) : (
                "None yet"
              )}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-neutral-light-400">Total paid to date</span>
            <span className="font-semibold text-neutral-light-600">
              {formatNairaExact(subscription.totalPaidMinor)}{" "}
              <span className="text-xs font-normal text-neutral-light-400">
                ({subscription.paidPeriods} {subscription.paidPeriods === 1 ? "payment" : "payments"})
              </span>
            </span>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Payment History">
        {subscription.payments.length === 0 ? (
          <p className="text-sm text-neutral-light-400">No payments yet.</p>
        ) : (
          <ul className="space-y-2.5">
            {subscription.payments.map((payment) => (
              <li key={payment.id} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="text-neutral-light-600">{formatDay(payment.paidAt ?? payment.createdAt)}</p>
                  {payment.failureReason && <p className="text-xs text-primary">{payment.failureReason}</p>}
                </div>
                <span className="flex items-center gap-3">
                  <span className={cn("font-semibold", payment.status === "success" ? "text-neutral-light-600" : "text-neutral-light-300")}>
                    {formatNairaExact(payment.amountMinor)}
                  </span>
                  <StatusBadge tone={PAYMENT_LABELS[payment.status].tone}>{PAYMENT_LABELS[payment.status].label}</StatusBadge>
                </span>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
        <Button variant="outline" disabled title="Members change plans in the app, so the charge goes through Paystack's checkout.">
          Change Plan
        </Button>
        <Button variant="outline" disabled={!subscription.canRefund} onClick={() => onRefund(subscription)}>
          Refund Last
        </Button>
      </div>
    </div>
  )
}

export default SubscriptionDetails
