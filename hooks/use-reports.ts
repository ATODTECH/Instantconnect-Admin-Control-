import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getUserReports, reviewUserReport } from "@/api/reports"
import type { UserReportStatus } from "@/types/admin-reports"

export const REPORTS_PAGE_SIZE = 10

export const reportKeys = {
  all: ["user-reports"] as const,
  list: (status: UserReportStatus, page: number) => [...reportKeys.all, status, page] as const,
}

export const useUserReports = (status: UserReportStatus, page: number) =>
  useQuery({
    queryKey: reportKeys.list(status, page),
    queryFn: () => getUserReports(status, (page - 1) * REPORTS_PAGE_SIZE, REPORTS_PAGE_SIZE),
    // Paging keeps the old page on screen; a new tab must not show another tab's rows.
    placeholderData: (previous, previousQuery) => (previousQuery?.queryKey[1] === status ? previous : undefined),
  })

export const useReviewUserReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: reviewUserReport,
    onSuccess: (_, { outcome }) => {
      toast.success(outcome === "dismiss" ? "Report dismissed" : "Report marked as actioned")
      void queryClient.invalidateQueries({ queryKey: reportKeys.all })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
