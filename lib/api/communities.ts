import api from "@/lib/axios"
import { saveBlobResponse } from "@/lib/download"
import type {
  AdminCommunityDetail,
  AdminCommunityFilters,
  AdminCommunityPage,
  AdminCommunityStats,
  OfficialPost,
  OfficialPostPage,
  ReportedPostPage,
  ReportStatus,
} from "@/types/admin-communities"

export const getCommunities = async (filters: AdminCommunityFilters, offset: number, limit: number): Promise<AdminCommunityPage> => {
  const { data } = await api.get<AdminCommunityPage>("/admin/communities", { params: { ...filters, offset, limit } })
  return data
}

export const getCommunityStats = async (): Promise<AdminCommunityStats> => {
  const { data } = await api.get<AdminCommunityStats>("/admin/communities/stats")
  return data
}

export const getCommunity = async (id: string): Promise<AdminCommunityDetail> => {
  const { data } = await api.get<AdminCommunityDetail>(`/admin/communities/${id}`)
  return data
}

/** Every community matching the filters, including the status tab. */
export const exportCommunities = async (filters: AdminCommunityFilters): Promise<void> => {
  const response = await api.get<Blob>("/admin/communities/export", { params: filters, responseType: "blob" })
  saveBlobResponse(response, "instantlinkup-communities.csv")
}

export const deleteCommunity = async (id: string): Promise<void> => {
  await api.delete(`/admin/communities/${id}`)
}

export const getReportedPosts = async (communityId: string, status: ReportStatus, offset: number, limit: number): Promise<ReportedPostPage> => {
  const { data } = await api.get<ReportedPostPage>("/admin/communities/reports", { params: { communityId, status, offset, limit } })
  return data
}

export const resolveReport = async ({ postId, outcome }: { postId: string, outcome: "dismiss" | "remove" }): Promise<void> => {
  await api.post(`/admin/communities/reports/${postId}/${outcome}`)
}

export const getOfficialPosts = async (offset: number, limit: number): Promise<OfficialPostPage> => {
  const { data } = await api.get<OfficialPostPage>("/admin/communities/official/posts", { params: { offset, limit } })
  return data
}

export const createOfficialPost = async (body: string): Promise<OfficialPost> => {
  const { data } = await api.post<OfficialPost>("/admin/communities/official/posts", { body })
  return data
}

export const deleteOfficialPost = async (postId: string): Promise<void> => {
  await api.delete(`/admin/communities/official/posts/${postId}`)
}
