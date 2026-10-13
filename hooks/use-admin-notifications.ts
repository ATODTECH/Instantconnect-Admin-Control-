import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAdminNotifications, markAllNotificationsRead, markNotificationsRead } from "@/lib/api/notifications"
import type { AdminNotificationPage } from "@/types/admin-notifications"

const NOTIFICATIONS_LIMIT = 20
const REFRESH_MS = 60_000

export const notificationKeys = {
  list: ["admin-notifications"] as const,
}

export const useAdminNotifications = () =>
  useQuery({
    queryKey: notificationKeys.list,
    queryFn: () => getAdminNotifications(NOTIFICATIONS_LIMIT),
    refetchInterval: REFRESH_MS,
  })

/** Marks optimistically so the dot clears at once; a failure puts the list back. */
const useMarkRead = <Input>(mark: (input: Input) => Promise<void>, apply: (page: AdminNotificationPage, input: Input) => AdminNotificationPage) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: mark,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.list })
      const previous = queryClient.getQueryData<AdminNotificationPage>(notificationKeys.list)
      if (previous) queryClient.setQueryData(notificationKeys.list, apply(previous, input))
      return { previous }
    },
    onError: (error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(notificationKeys.list, context.previous)
      toast.error(error.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationKeys.list }),
  })
}

export const useMarkNotificationRead = () =>
  useMarkRead(
    (id: string) => markNotificationsRead([id]),
    (page, id) => {
      const target = page.items.find((n) => n.id === id)
      if (!target || target.read) return page
      return {
        ...page,
        items: page.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
        unreadCount: Math.max(0, page.unreadCount - 1),
      }
    },
  )

export const useMarkAllNotificationsRead = () =>
  useMarkRead(
    (_: void) => markAllNotificationsRead(),
    (page) => ({ ...page, items: page.items.map((n) => ({ ...n, read: true })), unreadCount: 0 }),
  )
