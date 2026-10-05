import api from "@/lib/axios"
import { saveBlobResponse } from "@/lib/download"
import type {
  AdminPlan,
  AdminSubscriberPage,
  AdminSubscriptionDetail,
  AdminSubscriptionStats,
  PaymentSettings,
  PlanChanges,
  SubscriptionFilters,
} from "@/types/admin-subscriptions"

export const getSubscriptions = async (filters: SubscriptionFilters, offset: number, limit: number): Promise<AdminSubscriberPage> => {
  const { data } = await api.get<AdminSubscriberPage>("/admin/subscriptions", { params: { ...filters, offset, limit } })
  return data
}

export const getSubscriptionStats = async (): Promise<AdminSubscriptionStats> => {
  const { data } = await api.get<AdminSubscriptionStats>("/admin/subscriptions/stats")
  return data
}

export const getSubscription = async (id: string): Promise<AdminSubscriptionDetail> => {
  const { data } = await api.get<AdminSubscriptionDetail>(`/admin/subscriptions/${id}`)
  return data
}

export const exportSubscriptions = async (filters: SubscriptionFilters): Promise<void> => {
  const response = await api.get<Blob>("/admin/subscriptions/export", { params: filters, responseType: "blob" })
  saveBlobResponse(response, "instantconnect-subscriptions.csv")
}

export const retrySubscription = async (id: string): Promise<void> => {
  await api.post(`/admin/subscriptions/${id}/retry`)
}

export const refundLastPayment = async (id: string): Promise<void> => {
  await api.post(`/admin/subscriptions/${id}/refund-last`)
}

export const getPlans = async (): Promise<AdminPlan[]> => {
  const { data } = await api.get<AdminPlan[]>("/admin/subscriptions/plans")
  return data
}

export const updatePlan = async ({ id, changes }: { id: string, changes: PlanChanges }): Promise<AdminPlan> => {
  const { data } = await api.patch<AdminPlan>(`/admin/subscriptions/plans/${id}`, changes)
  return data
}

export const getPaymentSettings = async (): Promise<PaymentSettings> => {
  const { data } = await api.get<PaymentSettings>("/admin/subscriptions/settings")
  return data
}
