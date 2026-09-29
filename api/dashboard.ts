import api from "@/lib/axios"
import type { DashboardActivityPage, DashboardStats, EventsByCategory, UserGrowth } from "@/types/dashboard"

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>("/admin/dashboard/stats")
  return data
}

export const getUserGrowth = async (months: number): Promise<UserGrowth> => {
  const { data } = await api.get<UserGrowth>("/admin/dashboard/user-growth", { params: { months } })
  return data
}

export const getEventsByCategory = async (): Promise<EventsByCategory> => {
  const { data } = await api.get<EventsByCategory>("/admin/dashboard/events-by-category")
  return data
}

export const getDashboardActivity = async (offset: number, limit: number): Promise<DashboardActivityPage> => {
  const { data } = await api.get<DashboardActivityPage>("/admin/dashboard/activity", { params: { offset, limit } })
  return data
}
