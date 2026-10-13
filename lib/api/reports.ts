import api from "@/lib/axios"
import type { UserReportPage, UserReportStatus } from "@/types/admin-reports"

export const getUserReports = async (status: UserReportStatus, offset: number, limit: number): Promise<UserReportPage> => {
  const { data } = await api.get<UserReportPage>("/admin/user-reports", { params: { status, offset, limit } })
  return data
}

export const reviewUserReport = async ({ id, outcome }: { id: string, outcome: "dismiss" | "resolve" }): Promise<void> => {
  await api.post(`/admin/user-reports/${id}/${outcome}`)
}
