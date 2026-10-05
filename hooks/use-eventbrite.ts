import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  addEventbriteOrganizer,
  getEventbriteOrganizers,
  removeEventbriteOrganizer,
  setEventbriteOrganizerActive,
  syncEventbriteOrganizers,
} from "@/api/eventbrite"
import { eventKeys } from "@/hooks/use-events"

export const ORGANIZERS_PAGE_SIZE = 10

/** How often the list refreshes while an import runs, so counts fill in by themselves. */
const SYNC_POLL_MS = 3_000

export const eventbriteKeys = {
  all: ["eventbrite-organizers"] as const,
  list: (page: number) => [...eventbriteKeys.all, "list", page] as const,
}

export const useEventbriteOrganizers = (page: number) =>
  useQuery({
    queryKey: eventbriteKeys.list(page),
    queryFn: () => getEventbriteOrganizers((page - 1) * ORGANIZERS_PAGE_SIZE, ORGANIZERS_PAGE_SIZE),
    placeholderData: keepPreviousData,
    refetchInterval: (query) => (query.state.data?.isSyncing ? SYNC_POLL_MS : false),
  })

/** Imported events change the events table too, so both refresh. */
function useOrganizerMutation<TVariables, TData>(mutationFn: (variables: TVariables) => Promise<TData>, success: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventbriteKeys.all })
      void queryClient.invalidateQueries({ queryKey: eventKeys.all })
      toast.success(success)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useAddEventbriteOrganizer = () =>
  useOrganizerMutation(addEventbriteOrganizer, "Organizer added. Its events are being imported.")

export const useSetEventbriteOrganizerActive = () =>
  useOrganizerMutation(setEventbriteOrganizerActive, "Organizer updated")

export const useRemoveEventbriteOrganizer = () =>
  useOrganizerMutation(removeEventbriteOrganizer, "Organizer removed")

export const useSyncEventbriteOrganizers = () =>
  useOrganizerMutation(syncEventbriteOrganizers, "Import started")
