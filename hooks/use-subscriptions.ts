import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  exportSubscriptions,
  getPaymentSettings,
  getPlans,
  getSubscription,
  getSubscriptionStats,
  getSubscriptions,
  refundLastPayment,
  retrySubscription,
  updatePlan,
} from "@/lib/api/subscriptions"
import type { SubscriptionFilters } from "@/types/admin-subscriptions"

export const SUBSCRIPTIONS_PAGE_SIZE = 8

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  list: (filters: SubscriptionFilters, page: number) => [...subscriptionKeys.all, "list", filters, page] as const,
  stats: () => [...subscriptionKeys.all, "stats"] as const,
  detail: (id: string) => [...subscriptionKeys.all, "detail", id] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  settings: () => [...subscriptionKeys.all, "settings"] as const,
}

export const useSubscriptions = (filters: SubscriptionFilters, page: number) =>
  useQuery({
    queryKey: subscriptionKeys.list(filters, page),
    queryFn: () => getSubscriptions(filters, (page - 1) * SUBSCRIPTIONS_PAGE_SIZE, SUBSCRIPTIONS_PAGE_SIZE),
    placeholderData: keepPreviousData,
  })

export const useSubscriptionStats = () => useQuery({ queryKey: subscriptionKeys.stats(), queryFn: getSubscriptionStats })

export const useSubscription = (id: string) => useQuery({ queryKey: subscriptionKeys.detail(id), queryFn: () => getSubscription(id) })

export const usePlans = () => useQuery({ queryKey: subscriptionKeys.plans(), queryFn: getPlans })

export const usePaymentSettings = () => useQuery({ queryKey: subscriptionKeys.settings(), queryFn: getPaymentSettings })

export const useExportSubscriptions = () =>
  useMutation({
    mutationFn: exportSubscriptions,
    onError: (error) => {
      toast.error(error.message)
    },
  })

function useSubscriptionMutation<TVariables, TData>(mutationFn: (variables: TVariables) => Promise<TData>, success: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.all })
      toast.success(success)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useRetrySubscription = () => useSubscriptionMutation(retrySubscription, "Charge started. The result arrives in a moment.")

export const useRefundLast = () => useSubscriptionMutation(refundLastPayment, "Refund sent to Paystack")

export const useUpdatePlan = () => useSubscriptionMutation(updatePlan, "Plan saved")
