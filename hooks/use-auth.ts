import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signIn, signOut } from "@/api/auth"
import { ROUTES } from "@/lib/routes"

export const useSignIn = () => {
  const router = useRouter()

  return useMutation({
    mutationFn: signIn,
    onSuccess: ({ user }) => {
      toast.success(`Welcome back, ${user.firstName}!`)
      router.replace(ROUTES.overview)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}

export const useSignOut = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    // The API clears the cookies even when the revoke fails, so the admin leaves either way.
    onSettled: () => {
      queryClient.clear()
      router.replace(ROUTES.login)
    },
  })
}
