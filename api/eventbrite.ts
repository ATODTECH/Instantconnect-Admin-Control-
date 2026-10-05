import api from "@/lib/axios"
import type { EventbriteOrganizer, EventbriteOrganizerPage } from "@/types/admin-eventbrite"

export const getEventbriteOrganizers = async (offset: number, limit: number): Promise<EventbriteOrganizerPage> => {
  const { data } = await api.get<EventbriteOrganizerPage>("/admin/eventbrite-organizers", { params: { offset, limit } })
  return data
}

/** Takes the organizer page link or the number at its end. */
export const addEventbriteOrganizer = async (organizer: string): Promise<EventbriteOrganizer> => {
  const { data } = await api.post<EventbriteOrganizer>("/admin/eventbrite-organizers", { organizer })
  return data
}

export const setEventbriteOrganizerActive = async ({ id, isActive }: { id: string, isActive: boolean }): Promise<EventbriteOrganizer> => {
  const { data } = await api.patch<EventbriteOrganizer>(`/admin/eventbrite-organizers/${id}`, { isActive })
  return data
}

export const removeEventbriteOrganizer = async (id: string): Promise<void> => {
  await api.delete(`/admin/eventbrite-organizers/${id}`)
}

export const syncEventbriteOrganizers = async (): Promise<void> => {
  await api.post("/admin/eventbrite-organizers/sync")
}
