import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getDashboardActivity, getDashboardStats, getEventsByCategory, getUserGrowth } from "@/api/dashboard"

export const USER_GROWTH_MONTHS = 9
export const ACTIVITY_PAGE_SIZE = 5

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  userGrowth: (months: number) => [...dashboardKeys.all, "user-growth", months] as const,
  eventsByCategory: () => [...dashboardKeys.all, "events-by-category"] as const,
  activity: () => [...dashboardKeys.all, "activity"] as const,
}

export const useDashboardStats = () =>
  useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: getDashboardStats,
  })

export const useUserGrowth = (months = USER_GROWTH_MONTHS) =>
  useQuery({
    queryKey: dashboardKeys.userGrowth(months),
    queryFn: () => getUserGrowth(months),
  })

export const useEventsByCategory = () =>
  useQuery({
    queryKey: dashboardKeys.eventsByCategory(),
    queryFn: getEventsByCategory,
  })

export const useDashboardActivity = () =>
  useInfiniteQuery({
    queryKey: dashboardKeys.activity(),
    queryFn: ({ pageParam }) => getDashboardActivity(pageParam, ACTIVITY_PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: ({ page }) => {
      const next = page.offset + page.limit
      return next < page.total ? next : undefined
    },
  })
