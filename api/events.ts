import api from "@/lib/axios"
import { saveBlobResponse } from "@/lib/download"
import type { AdminEventDetail, AdminEventFilters, AdminEventPage, AdminEventStats, Lookup } from "@/types/admin-events"

export const getEvents = async (filters: AdminEventFilters, offset: number, limit: number): Promise<AdminEventPage> => {
  const { data } = await api.get<AdminEventPage>("/admin/events", { params: { ...filters, offset, limit } })
  return data
}

export const getEventStats = async (): Promise<AdminEventStats> => {
  const { data } = await api.get<AdminEventStats>("/admin/events/stats")
  return data
}

export const getEvent = async (id: string): Promise<AdminEventDetail> => {
  const { data } = await api.get<AdminEventDetail>(`/admin/events/${id}`)
  return data
}

/** Every event matching the filters, including the status tab. */
export const exportEvents = async (filters: AdminEventFilters): Promise<void> => {
  const response = await api.get<Blob>("/admin/events/export", { params: filters, responseType: "blob" })
  saveBlobResponse(response, "instantconnect-events.csv")
}

export const getCategories = async (): Promise<Lookup[]> => {
  const { data } = await api.get<Lookup[]>("/reference/categories")
  return data
}
