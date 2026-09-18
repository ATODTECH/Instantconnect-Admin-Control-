"use client"

import { useMemo, useState } from "react"
import GridCard from "./gridcard"
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, Download, Ellipsis, X } from "lucide-react"
import { UserRecord } from "../users"
import { AVATAR_COLORS } from "../live-connection"
import { useQuery } from "@/components/topbar"
import EventModalIndex from "./events-modal-info"
import Image from "next/image"


//  ..........Generated MOCK Data from the below ...............
const EVENT_NAMES = [
  "Lagos Tech Summit",
  "PM Meetup Lagos",
  "DevFest Lagos",
  "Women in Tech Conference",
  "Crypto Traders Meetup",
  "Product Design Sprint",
  "Startup Pitch Night",
  "AI Builders Workshop",
  "Fintech Founders Forum",
  "UX Lagos Roundtable",
  "Growth Marketing Bootcamp",
  "Data Engineers Meetup",
  "Creative Founders Brunch",
  "Cloud Native Lagos",
  "No-Code Builders Day",
  "Africa Investor Summit",
  "Remote Work Unconference",
  "Blockchain Devs Lagos",
  "Design Systems Workshop",
  "SaaS Growth Meetup",
]

const CREATORS: Pick<UserRecord, 'name'|'email'|'avatar'>[] = [
  {name: "Olamide Samuel", email: "", avatar:""},
  {name: "Chidi Benson", email: "", avatar:""},
  {name: "Tunde Fila", email: "", avatar:""},
  {name: "Amina Yusuf", email: "", avatar:""},
  {name: "Emeka Oji", email: "", avatar:""},
  {name: "Kemi Adesina", email: "", avatar:""},
  {name: "Zainab Bello", email: "", avatar:""},
  {name: "Femi Adeyemi", email: "", avatar:""},
]

const CATEGORIES: EventCategory[] = [
  "Technology",
  "Business",
  "Education",
  "Health",
  "Social",
]

// Simple seeded PRNG so the dataset is stable across renders/edits.
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

function generateEvents(count: number): EventRow[] {
  const rows: EventRow[] = []
  const today = new Date(2026, 8, 15)

  for (let i = 0; i < count; i++) {
    const creator = CREATORS[Math.floor(rand() * CREATORS.length)]
    const name = EVENT_NAMES[Math.floor(rand() * EVENT_NAMES.length)]
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)]
    const type: EventType = rand() > 0.4 ? "Paid" : "Free"

    // dateCreated: somewhere in the last ~20 months
    const createdOffsetDays = Math.floor(rand() * 600)
    const dateCreated = new Date(today)
    dateCreated.setDate(dateCreated.getDate() - createdOffsetDays)

    // status distribution: 35% upcoming, 15% ongoing, 50% past
    const roll = rand()
    let status: EventStatus
    let eventDate: Date | null

    if (roll < 0.15) {
      status = "Ongoing"
      eventDate = null
    } else if (roll < 0.5) {
      status = "Upcoming"
      eventDate = new Date(today)
      eventDate.setDate(eventDate.getDate() + Math.floor(rand() * 180) + 1)
    } else {
      status = "Past"
      eventDate = new Date(today)
      eventDate.setDate(eventDate.getDate() - Math.floor(rand() * 400) - 1)
    }

    const attendees = Math.floor(rand() * 400) + 20
    const revenue =
      type === "Free" ? 0 : Math.floor((rand() * 2_500_000 + 200_000) / 10_000) * 10_000

    const ticket = type === "Paid" ? Math.floor(rand() * 500) + 20: 0
    const priceTag = type === "Paid" ? Math.floor((rand() * 10_000 + 25_000) / 500) * 50 : 0

    rows.push({
      id: `evt-${i + 1}`,
      name: `${name}${i >= EVENT_NAMES.length ? ` ${Math.floor(i / EVENT_NAMES.length) + 1}` : ""}`,
      createdBy: creator.name,
      email: creator.email,
      avatar: creator.avatar,
      dateCreated,
      eventDate,
      type,
      category,
      attendees,
      status,
      revenue,
      priceTag,
      ticket,
    });
  }

  // newest created first, like a real "Created by" table would default to
  return rows.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());
}

const ALL_EVENTS = generateEvents(486)

// .................... End mock data ....................


// .................... Formatter ....................

export const fmtDate = (d: Date | null) =>
  d === null
    ? "Ongoing"
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export const fmtRevenue = (v: number) =>
  v === 0 ? "Free" : `NGN ${v.toLocaleString("en-US")}`;

const PAGE_SIZE = 8;

const TABS: TABSProps[] = [
  { label: "All Events", status: "All Events" },
  { label: "Upcoming", status: "Upcoming" },
  { label: "Ongoing", status: "Ongoing" },
  { label: "Past", status: "Past" },
]

const DATE_RANGES = [
  "All time",
  "Next 30 days",
  "Next 3 months",
  "Last 30 days",
  "Last 3 months",
  "Last 6 months",
] as const
type DateRange = (typeof DATE_RANGES)[number]

// .................... End Formatter ....................

// .................... Stylings ....................

function Dropdown({
  label,
  value,
  options,
  onChange,
  icon,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span>{value === "All" || (value === "All time") ? label : value}</span>
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

export function StatusBadge({ status }: { status: EventStatus }) {
  const styles: Record<EventStatus, string> = {
    Upcoming: "bg-[#DCFCE7] text-[#22C55E]",
    Ongoing: "bg-[#FFF7ED] text-[#FB923C]",
    Past: "bg-[#F4F3F5] text-[#4F4E59]",
  }
  return (
    <span className={`inline-flex rounded-md px-2 py-1 font-semibold text-[11px] ${styles[status]}`}>
      {status}
    </span>
  )
}

function TypeBadge({ type }: { type: EventType }) {
  const styles: Record<EventType, string> = {
    Paid: "bg-[#EEF2F6] text-[#1E293B]",
    Free: "bg-[#E0F2FE] text-[#0369A1]",
  };
  return (
    <span className={`inline-flex rounded-md px-2 py-1 font-semibold text-[11px] ${styles[type]}`}>
      {type}
    </span>
  )
}

// .................... End of Stylings ....................



const EventsHomeIndex = () => {
  const {query, setModal, contentModal} = useQuery()
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["status"]>("All Events")
  const [typeFilter, setTypeFilter] = useState<"All" | EventType>("All")
  const [categoryFilter, setCategoryFilter] = useState<"All" | EventCategory>("All")
  const [dateRange, setDateRange] = useState<DateRange>("All time")
  const [page, setPage] = useState(1)

  const today = useMemo(() => new Date(2026, 8, 15), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ALL_EVENTS.filter((ev) => {
      if (q && !ev.createdBy.toLowerCase().includes(q) && !ev.name.toLowerCase().includes(q)) return false;
      if (activeTab !== "All Events" && ev.status !== activeTab) return false;
      if (typeFilter !== "All" && ev.type !== typeFilter) return false;
      if (categoryFilter !== "All" && ev.category !== categoryFilter) return false;

      if (dateRange !== "All time") {
        const ref = ev.eventDate ?? ev.dateCreated;
        const diffDays = Math.round((ref.getTime() - today.getTime()) / 86_400_000);

        switch (dateRange) {
          case "Next 30 days":
            if (!(diffDays >= 0 && diffDays <= 30)) return false;
            break;
          case "Next 3 months":
            if (!(diffDays >= 0 && diffDays <= 90)) return false;
            break;
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
  }, [query, activeTab, typeFilter, categoryFilter, dateRange, today])
  
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
    const header = ["Event Name", "Created By", "Date Created", "Event Date", "Type", "Category", "Attendees", "Status",  "Revenue"]

    const lines = filtered.map((ev) =>
      [ev.name,ev.createdBy,ev.dateCreated.toISOString().slice(0, 10),ev.eventDate ? ev.eventDate.toISOString().slice(0, 10) : "Ongoing",ev.type,ev.category,ev.attendees,ev.status,ev.type === "Free" ? "Free" : ev.revenue,
      ]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
    )

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "InstantConnect-Events-Users.csv"
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
  
  const handleModal = (person: EventRow) => {
    setModal(true)
    contentModal(<EventModalIndex person={person} modal={(val)=> setModal(val)} />)
  }

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
                  className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors cursor-pointer ${
                    activeTab === tab.status
                      ? "bg-white text-neutral-light-600 shadow-sm font-semibold"
                      : "text-neutral-light-400 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-[#F4F3F5] px-3.5 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Download size={16} className="h-4 w-4" />
              Export CSV
            </button>
          </div>
          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-4">
            <Dropdown
              label="All Types"
              value={typeFilter === "All" ? "All" : typeFilter}
              options={["All", "Paid", "Free"]}
              onChange={(v) => {
                setTypeFilter(v as "All" | EventType);
                resetToFirstPage();
              }}
            />
            <Dropdown
              label="All Categories"
              value={categoryFilter === "All" ? "All" : categoryFilter}
              options={["All", ...CATEGORIES]}
              onChange={(v) => {
                setCategoryFilter(v as "All" | EventCategory);
                resetToFirstPage();
              }}
            />
            <Dropdown
              label="Select date range..."
              value={dateRange}
              options={DATE_RANGES}
              onChange={(v) => {
                setDateRange(v as DateRange);
                resetToFirstPage();
              }}
            />

            {(typeFilter !== "All" || categoryFilter !== "All" || dateRange !== "All time") && (
              <button
                onClick={() => {
                  setTypeFilter("All");
                  setCategoryFilter("All");
                  setDateRange("All time");
                  resetToFirstPage();
                }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Panel */}
        <div className="bg-white rounded-xl border border-primary-border overflow-hidden">
          {/* Table */}
          <div className="scrollbar-thin scrollbar-thumb-gray-200 overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-b-primary-border bg-primary text-left text-xs font-semibold uppercase tracking-wide text-neutral-light-300 select-none">
                  <th className="px-4 py-3">Event Name</th>
                  <th className="px-4 py-3">Created By</th>
                  <th className="px-4 py-3">Date Created</th>
                  <th className="px-4 py-3">Event Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Attendees</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((ev, i) => (
                  <tr key={ev.id} className="border-b border-gray-50 last:border-0 select-none text-[13px] text-neutral-light-400 font-normal">
                    <td className="max-w-45 truncate p-4 font-semibold text-sm text-neutral-light-600">
                      {ev.name}
                    </td>
                    <td className="p-4 max-w-50">
                      <div className="flex items-center gap-2">
                        {
                          (ev.avatar.length>0)?
                          <Image
                            src={ev.avatar}
                            alt={ev.name}
                            draggable={false}
                            className="w-10 h-10 rounded-full object-cover"
                          /> :
                          <span className={`inline-flex items-center justify-center shrink-0 w-10 h-10 rounded-full ${
                            AVATAR_COLORS[i % AVATAR_COLORS.length]
                          }`}>{initials(ev.createdBy)}</span>
                        }
                        <span className="font-medium whitespace-nowrap overflow-hidden">{ev.createdBy}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {fmtDate(ev.dateCreated)}
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {fmtDate(ev.eventDate)}
                    </td>
                    <td className="p-4">
                      <TypeBadge type={ev.type} />
                    </td>
                    <td className="p-4 font-medium">{ev.attendees}</td>
                    <td className="p-4">
                      <StatusBadge status={ev.status} />
                    </td>
                    <td className="whitespace-nowrap p-4 font-semibold text-neutral-light-600 tracking-wide">
                      {fmtRevenue(ev.revenue)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleModal(ev)}
                        className="rounded-md border border-violet-200 px-3 py-1 text-xs font-medium text-violet-600 hover:bg-violet-50 ml-auto cursor-pointer"
                      >
                        View
                      </button>
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

export default EventsHomeIndex