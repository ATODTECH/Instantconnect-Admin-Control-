import api from "@/lib/axios"
import type { KycReviewStats, KycSubmission, KycSubmissionFilters, KycSubmissionPage } from "@/types/admin-kyc"

export const getKycSubmissions = async (filters: KycSubmissionFilters, offset: number, limit: number): Promise<KycSubmissionPage> => {
  const { data } = await api.get<KycSubmissionPage>("/kyc/submissions", { params: { ...filters, offset, limit } })
  return data
}

export const getKycStats = async (): Promise<KycReviewStats> => {
  const { data } = await api.get<KycReviewStats>("/kyc/submissions/stats")
  return data
}

export const getKycSubmission = async (id: string): Promise<KycSubmission> => {
  const { data } = await api.get<KycSubmission>(`/kyc/submissions/${id}`)
  return data
}

export const approveKycSubmission = async (id: string): Promise<KycSubmission> => {
  const { data } = await api.post<KycSubmission>(`/kyc/submissions/${id}/approve`)
  return data
}

export const rejectKycSubmission = async ({ id, reason }: { id: string, reason: string }): Promise<KycSubmission> => {
  const { data } = await api.post<KycSubmission>(`/kyc/submissions/${id}/reject`, { reason })
  return data
}
