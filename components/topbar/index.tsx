"use client"

import { createContext, useContext, useState } from "react"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { cn } from "cn"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Kept for the top-right avatar, hidden for now: the sidebar already shows the admin.
// import { UserAvatar } from "@/components/shared/user-avatar"
import { Input } from "@/components/ui/input"
// import { useCurrentAdmin } from "@/hooks/use-auth"
import { PAGE_HEADINGS } from "@/lib/routes"

interface TopBarProps {
  children: React.ReactNode
}

export interface QueryContextType {
  query: string
}

export const QueryContext = createContext<QueryContextType | undefined>(undefined)

interface Notification {
  id: string
  title: string
  body: string
  timeAgo: string
  read: boolean
}

// Placeholder until admin notifications have an API.
const INITIAL_NOTIFICATIONS: Notification[] = []

const TopBarIndex = ({ children }: TopBarProps) => {
  // const { data: admin } = useCurrentAdmin()
  const [query, setQuery] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const pathname = usePathname()

  const heading = PAGE_HEADINGS[pathname]
  const unread = notifications.filter((n) => !n.read)

  const markRead = (id?: string) =>
    setNotifications((prev) => prev.map((n) => (id === undefined || n.id === id ? { ...n, read: true } : n)))

  return (
    <>
      <div className="flex gap-x-5 sticky top-0 bg-bg-secondary pr-8">
        {heading && (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className="font-bold text-2xl text-neutral-light-600">{heading.title}</h1>
              <p className="text-[13px] text-neutral-light-300">{heading.description}</p>
            </div>
            <form role="search" className="relative" onSubmit={(e) => e.preventDefault()}>
              <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <Input
                type="search"
                aria-label="Search this page"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, events..."
                className="h-9 w-64 rounded-lg border-[#E4E7EC] pl-8 text-[#1d293d] placeholder:text-sm placeholder:text-[#64748B] [&::-webkit-search-cancel-button]:hidden"
              />
            </form>
          </div>
        )}
        <div className="flex gap-x-5 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
                className="relative rounded-lg border border-[#E4E7EC] bg-neutral-white p-2 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <Bell className="h-4.5 w-4.5 text-[#64748B]" />
                {unread.length > 0 && (
                  <span aria-hidden className="absolute top-2 right-2 inline-flex h-[7.2px] w-[7.2px] shrink-0 rounded-full border-[1.35px] border-neutral-white bg-[#EF4444]" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <DropdownMenuLabel className="p-0 text-[15px] font-semibold text-neutral-light-600">Notifications</DropdownMenuLabel>
                <button
                  type="button"
                  onClick={() => markRead()}
                  disabled={unread.length === 0}
                  className="text-sm font-medium text-[#00A63E] hover:text-emerald-700 disabled:cursor-not-allowed disabled:text-[#00A63E]/50"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-105 overflow-y-auto">
                {unread.length === 0 ? (
                  <p className="px-5 py-6 text-center text-sm text-neutral-light-300">You&apos;re all caught up.</p>
                ) : (
                  unread.map((n) => (
                    <DropdownMenuItem key={n.id} onSelect={() => markRead(n.id)} className="flex-col items-start gap-0.5 rounded-none px-5 py-3.5">
                      <span className="text-sm font-semibold text-[#0F172B]">{n.title}</span>
                      <span className="text-xs text-[#90A1B9]">{n.body}</span>
                      <span className="text-xs text-[#CAD5E2]">{n.timeAgo}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator className="m-0" />
              <DropdownMenuItem onSelect={() => alert("coming soon!")} className={cn("justify-center rounded-none py-3 text-sm font-medium text-[#00A63E] focus:text-emerald-700")}>
                Notification settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Hidden for now: the sidebar already shows the signed-in admin. */}
          {/* {admin && <UserAvatar name={admin.fullName} size="md" className="ring-1 ring-primary-border" />} */}
        </div>
      </div>
      <QueryContext.Provider value={{ query }}>{children}</QueryContext.Provider>
    </>
  )
}

export const useQuery = () => {
  const context = useContext(QueryContext)
  if (context === undefined) {
    throw new Error("useQuery must be used within a QueryProvider")
  }

  return context
}

export default TopBarIndex
