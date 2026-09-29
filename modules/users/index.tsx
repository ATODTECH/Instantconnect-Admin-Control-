"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, Check, ChevronDown, Download, Ellipsis, MoreHorizontal } from "lucide-react"
import { cn } from "cn"
import { useQuery } from "@/components/topbar"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetEmpty, WidgetError } from "@/components/widget-state"
import { useDebounce } from "@/hooks/use-debounce"
import { USERS_PAGE_SIZE, useExportUsers, useUsers } from "@/hooks/use-users"
import { formatCount, initials } from "@/lib/format"
import type { AdminUserFilters } from "@/types/admin-users"
import {
  AVATAR_COLORS,
  JOINED_FILTER,
  KYC_FILTER,
  KYC_LABELS,
  PLAN_FILTER,
  PLAN_LABELS,
  STATUS_FILTER,
  STATUS_LABELS,
} from "./constants"
import UserProfile from "./user-profile"

const JOINED = new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric", timeZone: "Africa/Lagos" })

type FilterOption<T> = { readonly label: string, readonly value?: T }

interface FilterDropdownProps<T> {
  options: readonly FilterOption<T>[]
  value: T | undefined
  onChange: (value: T | undefined) => void
  isOpen: boolean
  onToggle: () => void
}

function FilterDropdown<T extends string>({ options, value, onChange, isOpen, onToggle }: FilterDropdownProps<T>) {
  const isActive = value !== undefined
  const current = options.find((option) => option.value === value) ?? options[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors",
          isActive ? "border-violet-300 bg-violet-50 text-purple-light-600" : "border-primary-border bg-neutral-white text-[#1E293B] hover:bg-slate-50",
        )}
      >
        {current.label}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpen && "rotate-180", isActive ? "text-violet-400" : "text-slate-400")} />
      </button>
      {isOpen && (
        <div role="listbox" className="absolute z-20 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-900/5 py-1 overflow-hidden">
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={option.label}
              onClick={() => onChange(option.value)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-50 transition-colors",
                option.value === value ? "text-violet-700 font-medium" : "text-slate-600",
              )}
            >
              {option.label}
              {option.value === value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, 2, 3, total])
  if (current > 3 && current < total) {
    pages.add(current - 1)
    pages.add(current)
    pages.add(current + 1)
  }

  const sorted = Array.from(pages).filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const result: (number | "...")[] = []
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("...")
    result.push(page)
  })
  return result
}

const SkeletonRows = () => (
  <>
    {Array.from({ length: USERS_PAGE_SIZE }, (_, index) => (
      <tr key={index} aria-hidden className="border-b border-slate-100">
        <td className="pl-5 pr-4 py-3"><Skeleton className="h-4 w-4 rounded" /></td>
        <td className="py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="space-y-1.5"><Skeleton className="h-3.5 w-32" /><Skeleton className="h-3 w-40" /></div>
          </div>
        </td>
        <td className="py-3"><Skeleton className="h-6 w-16 rounded-md" /></td>
        <td className="py-3"><Skeleton className="h-6 w-20 rounded-md" /></td>
        <td className="py-3"><Skeleton className="h-4 w-12" /></td>
        <td className="py-3"><Skeleton className="mx-auto h-4 w-6" /></td>
        <td className="py-3"><Skeleton className="h-4 w-24" /></td>
        <td className="py-3 pr-5"><Skeleton className="ml-auto h-7 w-7 rounded-lg" /></td>
      </tr>
    ))}
  </>
)

// main component
const UsersHomeIndex = () => {
  const { query, setModal, contentModal } = useQuery()
  const search = useDebounce(query.trim(), 300)

  const [status, setStatus] = useState<AdminUserFilters["status"]>()
  const [kycStatus, setKycStatus] = useState<AdminUserFilters["kycStatus"]>()
  const [plan, setPlan] = useState<AdminUserFilters["plan"]>()
  const [joinedWithin, setJoinedWithin] = useState<AdminUserFilters["joinedWithin"]>()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filters = useMemo<AdminUserFilters>(
    () => ({ search: search || undefined, status, kycStatus, plan, joinedWithin }),
    [search, status, kycStatus, plan, joinedWithin],
  )

  // Any change to the search or filters starts again at page 1. Reset during
  // render rather than in an effect, so the stale page is never requested.
  const filterKey = JSON.stringify(filters)
  const [pageState, setPageState] = useState({ filterKey, page: 1 })
  if (pageState.filterKey !== filterKey) setPageState({ filterKey, page: 1 })
  const page = pageState.filterKey === filterKey ? pageState.page : 1
  const setPage = (next: number) => setPageState({ filterKey, page: next })

  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useUsers(filters, page)
  const { mutate: runExport, isPending: isExporting } = useExportUsers()

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const rows = data?.items ?? []
  const total = data?.page.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_SIZE))
  const pageStart = (page - 1) * USERS_PAGE_SIZE
  const pageList = getPageList(page, totalPages)
  const hasFilters = status !== undefined || kycStatus !== undefined || plan !== undefined || joinedWithin !== undefined
  const isChangingPage = isPlaceholderData && isFetching

  const allChecked = rows.length > 0 && rows.every((u) => selected.has(u.id))

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      rows.forEach((u) => (allChecked ? next.delete(u.id) : next.add(u.id)))
      return next
    })
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const pick = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value)
    setOpenMenu(null)
  }

  const openProfile = (id: string) => {
    setModal(true)
    contentModal(<UserProfile userId={id} onClose={() => setModal(false)} />)
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin pr-8">
      <div className="flex flex-col gap-y-6 mb-8">
        {/* Filters row */}
        <div ref={containerRef} className="flex shrink-0 bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <div className="flex items-center gap-4 flex-wrap">
            <FilterDropdown options={STATUS_FILTER} value={status} onChange={pick(setStatus)} isOpen={openMenu === "status"} onToggle={() => setOpenMenu(openMenu === "status" ? null : "status")} />
            <FilterDropdown options={KYC_FILTER} value={kycStatus} onChange={pick(setKycStatus)} isOpen={openMenu === "kyc"} onToggle={() => setOpenMenu(openMenu === "kyc" ? null : "kyc")} />
            <FilterDropdown options={PLAN_FILTER} value={plan} onChange={pick(setPlan)} isOpen={openMenu === "plan"} onToggle={() => setOpenMenu(openMenu === "plan" ? null : "plan")} />
            <FilterDropdown options={JOINED_FILTER} value={joinedWithin} onChange={pick(setJoinedWithin)} isOpen={openMenu === "date"} onToggle={() => setOpenMenu(openMenu === "date" ? null : "date")} />
            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  setStatus(undefined)
                  setKycStatus(undefined)
                  setPlan(undefined)
                  setJoinedWithin(undefined)
                }}
                className="text-sm text-slate-400 hover:text-slate-600 px-2 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {selected.size > 0 && (
              <button type="button" onClick={() => setSelected(new Set())} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Clear selection
              </button>
            )}
            <button
              type="button"
              disabled={isExporting || total === 0}
              onClick={() => runExport({ filters, ids: [...selected] })}
              title={selected.size > 0 ? "Exports the ticked members" : "Exports every member matching the filters"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download className={cn("w-3.5 h-3.5", isExporting && "animate-bounce")} />
              {isExporting ? "Preparing CSV" : selected.size > 0 ? `Export ${formatCount(selected.size)} selected` : "Export CSV"}
            </button>
          </div>
        </div>

        {/* Panel */}
        <div className="shrink-0 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <ProgressBar className={isChangingPage ? "visible" : "invisible"} />
          {isError && !data ? (
            <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-16" />
          ) : (
            <div className="scrollbar-thin scrollbar-thumb-gray-200 overflow-x-auto" aria-busy={isPending || isChangingPage}>
              <table className={cn("w-full min-w-[950px] text-sm transition-opacity", isChangingPage && "opacity-60")}>
                <thead>
                  <tr className="text-left bg-[#FBFBFD] border-b border-b-primary-border">
                    <th scope="col" className="py-3.75 w-10 pl-5 font-medium">
                      <input
                        type="checkbox"
                        aria-label="Select all on this page"
                        checked={allChecked}
                        onChange={toggleAll}
                        disabled={rows.length === 0}
                        className="w-4 h-4 rounded border-slate-300 accent-purple-light-600 cursor-pointer"
                      />
                    </th>
                    <th scope="col" className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">User</th>
                    <th scope="col" className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Status</th>
                    <th scope="col" className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">KYC Status</th>
                    <th scope="col" className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Subscription</th>
                    <th scope="col" className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Events Attended</th>
                    <th scope="col" className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Joined Date</th>
                    <th scope="col" className="py-3.75 pr-5 text-xs uppercase font-semibold text-neutral-light-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isPending ? (
                    <SkeletonRows />
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <WidgetEmpty message={search || hasFilters ? "No users match the current search and filters." : "No members yet."} className="py-14" />
                      </td>
                    </tr>
                  ) : (
                    rows.map((u, i) => (
                      <tr key={u.id} className={cn("border-b border-slate-100 transition-colors", selected.has(u.id) ? "bg-violet-50/40" : "hover:bg-slate-50/60")}>
                        <td className="pl-5 pr-4 py-3">
                          <input
                            type="checkbox"
                            aria-label={`Select ${u.fullName}`}
                            checked={selected.has(u.id)}
                            onChange={() => toggleOne(u.id)}
                            className="w-4 h-4 rounded border-slate-300 accent-purple-light-600 cursor-pointer"
                          />
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            {u.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element -- Cloudinary serves its own sized variants
                              <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <span aria-hidden className={cn("inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-full text-xs", AVATAR_COLORS[i % AVATAR_COLORS.length])}>
                                {initials(u.fullName)}
                              </span>
                            )}
                            <div>
                              <div className="font-semibold text-sm text-neutral-light-600">{u.fullName}</div>
                              <div className="text-xs font-normal text-neutral-light-300">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold", STATUS_LABELS[u.status].style)}>
                            {STATUS_LABELS[u.status].label}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold", KYC_LABELS[u.kycStatus].style)}>
                            {KYC_LABELS[u.kycStatus].label}
                          </span>
                        </td>
                        <td className="py-3 text-neutral-light-500 font-medium text-sm">{PLAN_LABELS[u.plan]}</td>
                        <td className="py-3 font-semibold text-sm text-neutral-light-500 text-center">{formatCount(u.eventsAttended)}</td>
                        <td className="py-3 text-neutral-light-400 font-normal text-sm">
                          <time dateTime={u.joinedAt}>{JOINED.format(new Date(u.joinedAt))}</time>
                        </td>
                        <td className="py-3 pr-5 text-right">
                          <button
                            type="button"
                            aria-label={`View ${u.fullName}`}
                            className="p-1.5 rounded-lg text-neutral-light-400 transition-colors hover:bg-slate-100"
                            onClick={() => openProfile(u.id)}
                          >
                            <MoreHorizontal size={16} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {isPending && <span role="status" className="sr-only">Loading users</span>}
            </div>
          )}

          {/* Footer / pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 flex-wrap gap-3">
            <p className="text-sm font-semibold text-neutral-light-300/60" aria-live="polite">
              {isPending ? (
                <span>Loading users…</span>
              ) : total === 0 ? (
                <span>Showing 0 users</span>
              ) : (
                <>
                  Showing <b className="text-neutral-light-500">{pageStart + 1}-{Math.min(pageStart + USERS_PAGE_SIZE, total)}</b> of{" "}
                  <b className="text-neutral-light-500">{formatCount(total)}</b> {total === 1 ? "user" : "users"}
                </>
              )}
            </p>
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors border-slate-200 text-slate-500 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <ArrowLeft size={16} className="w-4 h-4" />
                Previous
              </button>
              {pageList.map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} aria-hidden className="px-1">
                    <Ellipsis size={16} className="text-neutral-light-500" />
                  </span>
                ) : (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setPage(item)}
                    aria-current={item === page ? "page" : undefined}
                    className={cn(
                      "min-w-10 h-10 px-3 text-sm font-medium rounded-xl border transition-colors",
                      item === page ? "bg-purple-light-600 border-purple-light-600 text-white" : "border-slate-200 text-neutral-light-600 hover:bg-slate-50",
                    )}
                  >
                    {item}
                  </button>
                ),
              )}
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages || isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors border-slate-200 text-slate-700 hover:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Next
                <ArrowRight size={16} className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersHomeIndex
