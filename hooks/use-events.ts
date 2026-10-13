import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { exportEvents, getCategories, getEvent, getEventStats, getEvents } from "@/lib/api/events"
import type { AdminEventFilters } from "@/types/admin-events"

export const EVENTS_PAGE_SIZE = 8

export const eventKeys = {
  all: ["events"] as const,
  list: (filters: AdminEventFilters, page: number) => [...eventKeys.all, "list", filters, page] as const,
  stats: () => [...eventKeys.all, "stats"] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
  categories: ["reference", "categories"] as const,
}

export const useEvents = (filters: AdminEventFilters, page: number) =>
  useQuery({
    queryKey: eventKeys.list(filters, page),
    queryFn: () => getEvents(filters, (page - 1) * EVENTS_PAGE_SIZE, EVENTS_PAGE_SIZE),
    placeholderData: keepPreviousData,
  })

export const useEventStats = () =>
  useQuery({
    queryKey: eventKeys.stats(),
    queryFn: getEventStats,
  })

export const useEvent = (id: string) =>
  useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => getEvent(id),
  })

/** Rarely changes, so it is fetched once per session. */
export const useCategories = () =>
  useQuery({
    queryKey: eventKeys.categories,
    queryFn: getCategories,
    staleTime: Infinity,
  })

export const useExportEvents = () =>
  useMutation({
    mutationFn: exportEvents,
    onError: (error) => {
      toast.error(error.message)
    },
  })
