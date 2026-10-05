export type BillingCycle = "monthly" | "annual"
export type SubscriptionStatus = "active" | "non_renewing" | "past_due" | "cancelled" | "expired"
export type PaymentStatus = "pending" | "success" | "failed" | "abandoned" | "refunded"
export type SubscriptionTab = "active" | "expired" | "failed" | "cancelled"
export type SubscriptionWindow = "7d" | "30d" | "90d" | "12m"

export interface SubscriptionFilters {
  search?: string
  status?: SubscriptionTab
  planId?: string
  window?: SubscriptionWindow
}

export interface PaymentMethod {
  channel: string | null
  cardBrand: string | null
  cardLast4: string | null
  /** "MM/YY". */
  cardExpiry: string | null
  bank: string | null
}

export interface AdminSubscriber {
  id: string
  userId: string
  fullName: string
  email: string
  avatarUrl: string | null
  planId: string
  planName: string
  cycle: BillingCycle
  /** Kobo per period. */
  amountMinor: number
  paymentMethod: PaymentMethod | null
  status: SubscriptionStatus
  startedAt: string
  /** Next billing, or when the plan ends. */
  currentPeriodEnd: string
  /** A failed renewal with a saved card. */
  canRetry: boolean
}

export interface AdminSubscriberPage {
  items: AdminSubscriber[]
  page: { total: number, limit: number, offset: number }
}

export interface SubscriptionPayment {
  id: string
  reference: string
  amountMinor: number
  status: PaymentStatus
  failureReason: string | null
  createdAt: string
  paidAt: string | null
}

export interface AdminSubscriptionDetail extends AdminSubscriber {
  phone: string | null
  memberSince: string
  cancelAtPeriodEnd: boolean
  totalPaidMinor: number
  paidPeriods: number
  /** Newest first, at most 12. */
  payments: SubscriptionPayment[]
  canRefund: boolean
}

export interface AdminSubscriptionStats {
  totalSubscribers: number
  newThisMonth: number
  activeSubscriptions: number
  monthlyRecurringMinor: number
  revenueThisMonthMinor: number
  revenueLastMonthMinor: number
  failedPayments: number
}

export interface AdminPlan {
  id: string
  name: string
  tagline: string
  description: string
  features: string[]
  monthlyPriceMinor: number
  annualPriceMinor: number
  isActive: boolean
  subscriberCount: number
  updatedAt: string
  updatedByName: string | null
}

export type PlanChanges = Partial<Pick<AdminPlan, "name" | "tagline" | "description" | "features" | "monthlyPriceMinor" | "annualPriceMinor" | "isActive">>

export interface PaymentSettings {
  configured: boolean
  testMode: boolean
  webhookUrl: string | null
  callbackUrl: string
  currency: string
}
