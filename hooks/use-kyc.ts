import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { approveKycSubmission, getKycStats, getKycSubmission, getKycSubmissions, rejectKycSubmission } from "@/lib/api/kyc"
import type { KycSubmission, KycSubmissionFilters } from "@/types/admin-kyc"
import { userKeys } from "./use-users"

export const KYC_PAGE_SIZE = 8

export const kycKeys = {
  all: ["kyc"] as const,
  list: (filters: KycSubmissionFilters, page: number) => [...kycKeys.all, "list", filters, page] as const,
  stats: () => [...kycKeys.all, "stats"] as const,
  detail: (id: string) => [...kycKeys.all, "detail", id] as const,
}

export const useKycSubmissions = (filters: KycSubmissionFilters, page: number) =>
  useQuery({
    queryKey: kycKeys.list(filters, page),
    queryFn: () => getKycSubmissions(filters, (page - 1) * KYC_PAGE_SIZE, KYC_PAGE_SIZE),
    placeholderData: keepPreviousData,
  })

export const useKycStats = () =>
  useQuery({
    queryKey: kycKeys.stats(),
    queryFn: getKycStats,
  })

export const useKycSubmission = (id: string) =>
  useQuery({
    queryKey: kycKeys.detail(id),
    queryFn: () => getKycSubmission(id),
  })

/**
 * A decision moves the queue, today's figures and the member's KYC badge on
 * the Users page, so all three refetch. A 409 means another admin got there
 * first; the refetch then shows their decision.
 */
const useDecision = <Input extends { id: string }>(decide: (input: Input) => Promise<KycSubmission>, success: (submission: KycSubmission) => string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: decide,
    onSuccess: (submission) => {
      queryClient.setQueryData(kycKeys.detail(submission.id), submission)
      toast.success(success(submission))
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...kycKeys.all, "list"] })
      queryClient.invalidateQueries({ queryKey: kycKeys.stats() })
      queryClient.invalidateQueries({ queryKey: kycKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

export const useApproveKyc = () =>
  useDecision((input: { id: string }) => approveKycSubmission(input.id), (submission) => `${submission.applicant.fullName} is verified`)

export const useRejectKyc = () =>
  useDecision(rejectKycSubmission, (submission) => `${submission.applicant.fullName} was sent the reason and can resubmit`)
