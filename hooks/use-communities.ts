import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createOfficialPost,
  deleteCommunity,
  deleteOfficialPost,
  exportCommunities,
  getCommunities,
  getCommunity,
  getCommunityStats,
  getOfficialPosts,
  getReportedPosts,
  resolveReport,
} from "@/api/communities"
import type { AdminCommunityFilters, ReportStatus } from "@/types/admin-communities"

export const COMMUNITIES_PAGE_SIZE = 8
export const SHEET_LIST_SIZE = 10

export const communityKeys = {
  all: ["communities"] as const,
  list: (filters: AdminCommunityFilters, page: number) => [...communityKeys.all, "list", filters, page] as const,
  stats: () => [...communityKeys.all, "stats"] as const,
  detail: (id: string) => [...communityKeys.all, "detail", id] as const,
  reports: (communityId: string, status: ReportStatus) => [...communityKeys.all, "reports", communityId, status] as const,
  official: () => [...communityKeys.all, "official"] as const,
}

export const useCommunities = (filters: AdminCommunityFilters, page: number) =>
  useQuery({
    queryKey: communityKeys.list(filters, page),
    queryFn: () => getCommunities(filters, (page - 1) * COMMUNITIES_PAGE_SIZE, COMMUNITIES_PAGE_SIZE),
    placeholderData: keepPreviousData,
  })

export const useCommunityStats = () => useQuery({ queryKey: communityKeys.stats(), queryFn: getCommunityStats })

export const useCommunity = (id: string) => useQuery({ queryKey: communityKeys.detail(id), queryFn: () => getCommunity(id) })

export const useReportedPosts = (communityId: string, status: ReportStatus) =>
  useQuery({
    queryKey: communityKeys.reports(communityId, status),
    queryFn: () => getReportedPosts(communityId, status, 0, SHEET_LIST_SIZE),
  })

export const useOfficialPosts = (enabled: boolean) =>
  useQuery({ queryKey: communityKeys.official(), queryFn: () => getOfficialPosts(0, SHEET_LIST_SIZE), enabled })

export const useExportCommunities = () =>
  useMutation({
    mutationFn: exportCommunities,
    onError: (error) => {
      toast.error(error.message)
    },
  })

/** Every change here can move a count on the stat cards, so the whole page refreshes. */
function useCommunityMutation<TVariables, TData>(mutationFn: (variables: TVariables) => Promise<TData>, success: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: communityKeys.all })
      toast.success(success)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteCommunity = () => useCommunityMutation(deleteCommunity, "Community deleted")

export const useResolveReport = () => useCommunityMutation(resolveReport, "Report resolved")

export const useCreateOfficialPost = () => useCommunityMutation(createOfficialPost, "Posted to the Safety Community")

export const useDeleteOfficialPost = () => useCommunityMutation(deleteOfficialPost, "Post deleted")
