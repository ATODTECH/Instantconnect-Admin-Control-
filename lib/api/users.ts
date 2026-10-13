import api from "@/lib/axios"
import { saveBlobResponse } from "@/lib/download"
import type { AdminUserDetail, AdminUserFilters, AdminUserPage, MessageUserInput } from "@/types/admin-users"

export const getUsers = async (filters: AdminUserFilters, offset: number, limit: number): Promise<AdminUserPage> => {
  const { data } = await api.get<AdminUserPage>("/admin/users", { params: { ...filters, offset, limit } })
  return data
}

export const getUser = async (id: string): Promise<AdminUserDetail> => {
  const { data } = await api.get<AdminUserDetail>(`/admin/users/${id}`)
  return data
}

export const messageUser = async ({ id, ...message }: MessageUserInput & { id: string }): Promise<void> => {
  await api.post(`/admin/users/${id}/messages`, message)
}

export const disableUser = async (id: string): Promise<AdminUserDetail> => {
  const { data } = await api.post<AdminUserDetail>(`/admin/users/${id}/disable`)
  return data
}

export const enableUser = async (id: string): Promise<AdminUserDetail> => {
  const { data } = await api.post<AdminUserDetail>(`/admin/users/${id}/enable`)
  return data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/admin/users/${id}`)
}

/** Every row matching the filters, or only `ids` when some are ticked. */
export const exportUsers = async (filters: AdminUserFilters, ids: string[]): Promise<void> => {
  const response = await api.get<Blob>("/admin/users/export", {
    params: { ...filters, ids: ids.length ? ids.join(",") : undefined },
    responseType: "blob",
  })

  saveBlobResponse(response, "instantlinkup-users.csv")
}
