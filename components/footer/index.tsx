"use client"
import { LogOutIcon } from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentAdmin, useSignOut } from "@/hooks/use-auth"

const FooterIndex = () => {
  const { data: admin } = useCurrentAdmin()
  const { mutate: signOut, isPending } = useSignOut()

  return (
    <footer className="flex items-center border-t border-t-[#1E293B] gap-3 pt-4">
      {admin ? (
        <>
          <UserAvatar name={admin.fullName} size="md" />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="truncate font-semibold text-sm text-ic-light">{admin.fullName}</span>
            <span title={admin.email} className="truncate font-normal text-xs text-[#64748B]">{admin.email}</span>
          </div>
        </>
      ) : (
        <div role="status" className="flex flex-1 items-center gap-3">
          <span className="sr-only">Loading your profile</span>
          <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-[#1E293B]" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-24 bg-[#1E293B]" />
            <Skeleton className="h-3 w-32 bg-[#1E293B]" />
          </div>
        </div>
      )}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            aria-label="Sign out"
            className="flex text-[#64748B] hover:text-red-600 cursor-pointer"
          >
            <LogOutIcon size={18} aria-hidden />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-[#EF4444]">
              <LogOutIcon aria-hidden />
            </AlertDialogMedia>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to sign in again to get back to the dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            {/* A plain Button, not AlertDialogAction, so the dialog stays open with the spinner until the redirect. */}
            <Button variant="danger" loading={isPending} onClick={() => signOut()}>
              Sign out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </footer>
  )
}

export default FooterIndex
