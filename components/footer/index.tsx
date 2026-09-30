"use client"
import { LogOutIcon } from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
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
      <button
        type="button"
        onClick={() => signOut()}
        disabled={isPending}
        aria-label="Sign out"
        className="flex text-[#64748B] hover:text-red-600 cursor-pointer disabled:opacity-50"
      >
        <LogOutIcon size={18} aria-hidden />
      </button>
    </footer>
  )
}

export default FooterIndex
