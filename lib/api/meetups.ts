import api from "@/lib/axios"
import type { AdminMeetupDetail, AdminMeetupPage, AdminMeetupStats, MeetupView } from "@/types/admin-meetups"

export const getMeetups = async (view: MeetupView, limit: number): Promise<AdminMeetupPage> => {
  const { data } = await api.get<AdminMeetupPage>("/admin/meetups", { params: { view, limit, offset: 0 } })
  return data
}

export const getMeetupStats = async (): Promise<AdminMeetupStats> => {
  const { data } = await api.get<AdminMeetupStats>("/admin/meetups/stats")
  return data
}

export const getMeetup = async (id: string): Promise<AdminMeetupDetail> => {
  const { data } = await api.get<AdminMeetupDetail>(`/admin/meetups/${id}`)
  return data
}

export const flagMeetup = async ({ id, reason }: { id: string, reason: string }): Promise<AdminMeetupDetail> => {
  const { data } = await api.post<AdminMeetupDetail>(`/admin/meetups/${id}/flag`, { reason })
  return data
}

export const unflagMeetup = async ({ id }: { id: string }): Promise<AdminMeetupDetail> => {
  const { data } = await api.delete<AdminMeetupDetail>(`/admin/meetups/${id}/flag`)
  return data
}

export const sendSafetyCheck = async ({ id }: { id: string }): Promise<AdminMeetupDetail> => {
  const { data } = await api.post<AdminMeetupDetail>(`/admin/meetups/${id}/safety-check`)
  return data
}

export const stopTracking = async ({ id }: { id: string }): Promise<AdminMeetupDetail> => {
  const { data } = await api.post<AdminMeetupDetail>(`/admin/meetups/${id}/stop-tracking`)
  return data
}
