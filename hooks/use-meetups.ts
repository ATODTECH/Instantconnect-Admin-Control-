import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { flagMeetup, getMeetup, getMeetupStats, getMeetups, sendSafetyCheck, stopTracking, unflagMeetup } from "@/lib/api/meetups"
import type { AdminMeetupDetail, MeetupView } from "@/types/admin-meetups"

/** The server's page cap. Enough for a live board; older past meetups drop off. */
export const MEETUPS_LIMIT = 50

// Live positions move, so the board keeps itself fresh while it is open.
const LIST_REFRESH_MS = 15_000
const DETAIL_REFRESH_MS = 10_000

export const meetupKeys = {
  all: ["meetups"] as const,
  list: (view: MeetupView) => [...meetupKeys.all, "list", view] as const,
  stats: () => [...meetupKeys.all, "stats"] as const,
  detail: (id: string) => [...meetupKeys.all, "detail", id] as const,
}

export const useMeetups = (view: MeetupView) =>
  useQuery({
    queryKey: meetupKeys.list(view),
    queryFn: () => getMeetups(view, MEETUPS_LIMIT),
    placeholderData: keepPreviousData,
    refetchInterval: LIST_REFRESH_MS,
  })

export const useMeetupStats = () =>
  useQuery({
    queryKey: meetupKeys.stats(),
    queryFn: getMeetupStats,
    refetchInterval: LIST_REFRESH_MS,
  })

export const useMeetup = (id: string, { enabled = true }: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: meetupKeys.detail(id),
    queryFn: () => getMeetup(id),
    refetchInterval: DETAIL_REFRESH_MS,
    enabled,
  })

/** Every action hands back the fresh meetup; the board and stats refetch around it. */
const useMeetupAction = <Input extends { id: string }>(action: (input: Input) => Promise<AdminMeetupDetail>, success: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: action,
    onSuccess: (meetup) => {
      queryClient.setQueryData(meetupKeys.detail(meetup.id), meetup)
      queryClient.invalidateQueries({ queryKey: [...meetupKeys.all, "list"] })
      queryClient.invalidateQueries({ queryKey: meetupKeys.stats() })
      toast.success(success)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useFlagMeetup = () => useMeetupAction(flagMeetup, "Connection flagged")
export const useUnflagMeetup = () => useMeetupAction(unflagMeetup, "Flag removed")
export const useSendSafetyCheck = () => useMeetupAction(sendSafetyCheck, "Safety check sent to both people")
export const useStopTracking = () => useMeetupAction(stopTracking, "Live location stopped for both people")
