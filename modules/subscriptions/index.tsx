"use client"
import { ArrowLeft, ArrowRight, ChevronDown, Download, Ellipsis, X } from "lucide-react";
import { USERS } from "../users";
import GridCard from "./gridcard"
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@/components/topbar";
import SubscriptionModalIndex from "./subscription-modal-info";
import { AVATAR_COLORS } from "../live-connection";
import Image from "next/image";
import { useRouter } from "next/navigation";

// .................... Start mock data ....................

const SUBSCRIPTION: Plan[] = [
  "Business",
  "Free",
  "Premium",
]

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
const rand = mulberry32(42)

function generateUsers(count: number): SubscriptionRow[] {
  const rows: SubscriptionRow[] = []
  const today = new Date(2026, 8, 7)

  for (let i = 0; i < count; i++) {
    const user = USERS[Math.floor(rand() * USERS.length)]
    const subscriptionPlan = SUBSCRIPTION[Math.floor(rand() * SUBSCRIPTION.length)]

    const createdOffsetDays = Math.floor(rand() * 600)
    const startDate = new Date(today)
    startDate.setUTCDate(startDate.getUTCDate() - createdOffsetDays)
    const expiresDate = new Date(startDate.getUTCFullYear()+1, startDate.getUTCMonth(), startDate.getUTCDate())

    const roll = rand()
    let paymentMethod: string
    let status: SubscriptionStatus
    
    if (roll < 0.15) {
      status = "Active"
      paymentMethod = "Visa"
    } else if (roll < 0.5) {
      status = "Expired"
      paymentMethod = "GTBank Transfer"
    } else if (roll < 0.75) {
      status = "Cancelled"
      paymentMethod = "Mastercard"
    } else {
      status = "Failed"
      paymentMethod = "Access Bank Transfer"
    }
    
    let paymentCardPin = (paymentMethod==="Visa" || paymentMethod==="Mastercard") ? Math.floor(rand() * 9000) + 1000 : 0
    const isPro = 
    (subscriptionPlan==="Free") ? false: true;
    const amount = 
    (subscriptionPlan==="Free") ? 5000 :
    (subscriptionPlan==="Premium") ? 15000 : 35000;

    rows.push({
      id: `sub-${i + 1}`,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      isPro,
      amount,
      paymentMethod,
      paymentCardPin,
      subscriptionPlan,
      startDate,
      expiresDate,
      status,
    })
  }

  return rows.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
}

const ALL_USERS = generateUsers(486)

// .................... End mock data ....................

const PAGE_SIZE = 8;

const TABS: SubscriptionTABSProps[] = [
  { label: "All", status: "All" },
  { label: "Active", status: "Active" },
  { label: "Expired", status: "Expired" },
  { label: "Failed", status: "Failed" },
  { label: "Cancelled", status: "Cancelled" },
]

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export const fmtDate = (d: Date | null) =>
  d === null
    ? "--"
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const DATE_RANGES = [
  "All time",
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
] as const
type DateRange = (typeof DATE_RANGES)[number]

const Dropdown = ({
  label,
  value,
  options,
  onChange,
  icon,
}: SubscriptionDropdownProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      >
        {icon}
        <span>{value === "All" ? label : value}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                  opt === value ? "bg-gray-50 font-medium text-gray-900" : "text-gray-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export const StatusBadge = ({ status }: { status: SubscriptionStatus }) => {
  const styles: Record<SubscriptionStatus, string> = {
    Active: "bg-[#F0FDF4] text-[#22C55E]",
    Expired: "bg-[#F4F3F5] text-[#4F4E59]",
    Failed: "bg-[#FCF2F2] text-[#B91C1C]",
    Cancelled: "bg-[#FFF7ED] text-[#FB923C]",
  }
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}

export const SubscribePlanBadge = ({ plan }: { plan: Plan }) => {
  const styles: Record<Plan, string> = {
    Business: "bg-[#FAF5FF] text-[#9333EA] border-[#FAF5FF]",
    Free: "bg-[#F0FDF4] text-[#22C55E] border-[#F0FDF4]",
    Premium: "bg-[#EFF6FF] text-[#248DDE] border-[#DEF1FF]",
  }
  return (
    <span className={`inline-flex rounded-md px-2 py-1 border text-xs font-semibold ${styles[plan]}`}>
      {plan}
    </span>
  )
}


const SubscriptionsHomeIndex = () => {
  const {query, setModal, contentModal} = useQuery()
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["status"]>("All")
  const [subscriptionFilter, setSubscriptionFilter] = useState<"All plans" | Plan>("All plans")
  const [dateRange, setDateRange] = useState<DateRange>("All time")
  const [page, setPage] = useState(1)

  const today = useMemo(() => new Date(2026, 8, 15), [])
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ALL_USERS.filter((ev) => {
      if (q && !ev.name.toLowerCase().includes(q) && !ev.email.toLowerCase().includes(q)) return false;
      if (activeTab !== "All" && ev.status !== activeTab) return false;
      if (subscriptionFilter !== "All plans" && ev.subscriptionPlan !== subscriptionFilter) return false;

      if (dateRange !== "All time") {
        // expiresDate is next billing date (-o^o-)
        const ref = ev.startDate ?? ev.expiresDate;
        const diffDays = Math.round((ref.getTime() - today.getTime()) / 86_400_000);

        switch (dateRange) {
          case "Last 30 days":
            if (!(diffDays <= 0 && diffDays >= -30)) return false;
            break;
          case "Last 3 months":
            if (!(diffDays <= 0 && diffDays >= -90)) return false;
            break;
          case "Last 6 months":
            if (!(diffDays <= 0 && diffDays >= -180)) return false;
            break;
        }
      }
      return true;
    });
  }, [query, activeTab, subscriptionFilter, dateRange, today])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length)

  function resetToFirstPage() {
    setPage(1)
  }

  function handleTab(status: (typeof TABS)[number]["status"]) {
    setActiveTab(status)
    resetToFirstPage()
  }

  function handleExportCSV() {
    const header = ["Name", "Email", "Plan", "Payment Method", "Start Date", "Next Billing Date", "Status"]

    const lines = filtered.map((sub) =>
      [sub.name,sub.email,sub.subscriptionPlan,sub.paymentMethod,sub.startDate.toISOString().slice(0, 10),sub.expiresDate.toISOString().slice(0, 10),sub.status]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
    )

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "InstantConnect-Subscribed-Members.csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function pageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let p = start; p <= end; p++) pages.push(p);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }
  
  const initials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const handleModal = (person: SubscriptionRow) => {
    setModal(true)
    contentModal(<SubscriptionModalIndex user={person} modal={(val)=> setModal(val)} />)
  }

  
  // for test
  const [isView, setView] = useState(false)
  const router = useRouter()
  useEffect(() => {
    let role = localStorage.getItem('roleTest')
    if (role) {setView(true)}
    else {router.replace('/login')}
  }, [])

  if (isView === false) return (<></>);
  // end for test

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        {/* filters row */}
        <div className="w-full rounded-2xl border border-gray-200 bg-neutral-white shadow-[0px_0px_10px_0px_#0000000A]">
          {/* Top bar: tabs + export */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-1 rounded-lg bg-[#F4F3F5] p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => handleTab(tab.status)}
                  className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    activeTab === tab.status
                      ? "bg-white text-neutral-light-600 shadow-sm font-semibold"
                      : "text-neutral-light-400 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-x-4">
              {(subscriptionFilter !== "All plans" || dateRange !== "All time") && (
                <button
                  onClick={() => {
                    setSubscriptionFilter("All plans");
                    setDateRange("All time");
                    resetToFirstPage();
                  }}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
              <Dropdown
                label="Size: All"
                value={dateRange}
                options={DATE_RANGES}
                onChange={(v) => {
                  setDateRange(v as DateRange);
                  resetToFirstPage();
                }}
              />
              <Dropdown
                label="All plans"
                value={subscriptionFilter === "All plans" ? "All" : subscriptionFilter}
                options={["All plans", ...SUBSCRIPTION]}
                onChange={(v) => {
                  setSubscriptionFilter(v as "All plans" | Plan);
                  resetToFirstPage();
                }}
              />
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 rounded-lg border border-[#F4F3F5] px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Download size={16} className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
        {/* Panel */}
        <div className="bg-white rounded-xl border border-primary-border overflow-hidden">
          {/* Table */}
          <div className="scrollbar-thin scrollbar-thumb-gray-200 overflow-x-auto">
            <table className="w-full min-w-[1024px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-b-primary-border bg-primary text-left text-xs font-semibold uppercase tracking-wide text-neutral-light-300 select-none">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">Next Billing</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((sub, i) => (
                  <tr key={sub.id} className="border-b border-gray-50 last:border-0 select-none text-[13px] text-neutral-light-400 font-normal">
                    <td className="p-4 font-semibold text-sm text-neutral-light-600">
                      <div className="flex items-center gap-3">
                        {(sub.avatar.length>0)?
                          <Image
                            src={sub.avatar}
                            alt={sub.name}
                            draggable={false}
                            className="w-9 h-9 text-[8px] rounded-full object-cover"
                          /> :
                          <span className={`inline-flex items-center justify-center shrink-0 w-9 h-9 text-xs rounded-full ${
                            AVATAR_COLORS[i % AVATAR_COLORS.length]
                          }`}>{initials(sub.name)}</span>
                        }
                        <div className="flex flex-col cursor-pointer items-start w-full max-w-28">
                          <span title={sub.name} className="font-semibold text-neutral-light-600 text-sm w-full truncate ">{sub.name}</span>
                          <span title={sub.email} className="w-full truncate text-neutral-light-300 text-xs font-normal">{sub.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <SubscribePlanBadge plan={sub.subscriptionPlan} />
                    </td>
                    <td className="p-4 font-semibold text-sm text-neutral-light-600">
                      <span className="flex text-nowrap">
                        ₦{formatCompactNumber(sub.amount)}
                      </span>
                    </td>
                    <td className="p-4">
                      {sub.paymentMethod}&nbsp;{(sub.paymentCardPin!==0)&&sub.paymentCardPin}
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {fmtDate(sub.startDate)}
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {fmtDate(sub.expiresDate)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center gap-x-2">
                        <button
                          onClick={() => handleModal(sub)}
                          className="rounded-md border border-violet-200 px-3 py-1 text-xs font-medium text-violet-600 hover:bg-violet-50 ml-auto cursor-pointer"
                        >
                          View
                        </button>
                        {(sub.status==="Failed") && (
                          <button
                            onClick={() => alert('coming soon!')}
                            className="rounded-md px-3 py-1 text-xs font-medium bg-purple-light-600 text-neutral-white ml-auto cursor-pointer"
                          >
                            Retry
                          </button>                        
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-400">
                      No events match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 flex-wrap gap-3">
            <p className="text-sm font-semibold text-neutral-light-300/60">
              {(filtered.length===0)?
                <span>Showing 0 users</span>:
                <span>
                  Showing <b className=" text-neutral-light-500">{rangeStart}-{rangeEnd}</b> of <b className=" text-neutral-light-500">{filtered.length}</b> events
                </span>
              }
            </p>
            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  currentPage === 1 ? " border-slate-200 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <ArrowLeft size={16} className="w-4 h-4" />
                Previous
              </button>

              {/* Page numbers / ellipsis */}
              {pageNumbers().map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 select-none">
                    <Ellipsis size={16} className=" text-neutral-light-500" />
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`min-w-10 h-10 px-3 text-sm font-medium rounded-xl border transition-colors ${
                      item === currentPage
                        ? "bg-purple-light-600 border-purple-light-600 text-white"
                        : "border-slate-200 text-neutral-light-600 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  (currentPage === totalPages)
                    ? "border-slate-200 text-slate-300 cursor-not-allowed"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Next
                <ArrowRight size={16} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionsHomeIndex