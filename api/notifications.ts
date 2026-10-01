import api from "@/lib/axios"
import type { AdminNotificationPage } from "@/types/admin-notifications"

export const getAdminNotifications = async (limit: number): Promise<AdminNotificationPage> => {
  const { data } = await api.get<AdminNotificationPage>("/admin/notifications", { params: { limit, offset: 0 } })
  return data
}

export const markNotificationsRead = async (ids: string[]): Promise<void> => {
  await api.post("/admin/notifications/read", { ids })
}

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.post("/admin/notifications/read-all")
}
