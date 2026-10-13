import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteUser, disableUser, enableUser, exportUsers, getUser, getUsers, messageUser } from "@/lib/api/users"
import type { AdminUserDetail, AdminUserFilters } from "@/types/admin-users"

export const USERS_PAGE_SIZE = 10

export const userKeys = {
  all: ["users"] as const,
  list: (filters: AdminUserFilters, page: number) => [...userKeys.all, "list", filters, page] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
}

export const useUsers = (filters: AdminUserFilters, page: number) =>
  useQuery({
    queryKey: userKeys.list(filters, page),
    queryFn: () => getUsers(filters, (page - 1) * USERS_PAGE_SIZE, USERS_PAGE_SIZE),
    // Keeps the current rows on screen while the next page or filter loads.
    placeholderData: keepPreviousData,
  })

export const useUser = (id: string) =>
  useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
  })

export const useMessageUser = () =>
  useMutation({
    mutationFn: messageUser,
    onSuccess: () => {
      toast.success("Message sent to their Help & Support chat")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

/** Disabling or enabling hands back the fresh profile; the table refetches for the new status. */
export const useSetUserEnabled = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, enabled }: { id: string, enabled: boolean }) => (enabled ? enableUser(id) : disableUser(id)),
    onSuccess: (person: AdminUserDetail, { enabled }) => {
      queryClient.setQueryData(userKeys.detail(person.id), person)
      queryClient.invalidateQueries({ queryKey: [...userKeys.all, "list"] })
      toast.success(enabled ? `${person.fullName} can sign in again` : `${person.fullName} is disabled and signed out`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string, fullName: string }) => deleteUser(id),
    onSuccess: (_, { id, fullName }) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: [...userKeys.all, "list"] })
      toast.success(`${fullName}'s account was deleted`)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useExportUsers = () =>
  useMutation({
    mutationFn: ({ filters, ids }: { filters: AdminUserFilters, ids: string[] }) => exportUsers(filters, ids),
    onError: (error) => {
      toast.error(error.message)
    },
  })
