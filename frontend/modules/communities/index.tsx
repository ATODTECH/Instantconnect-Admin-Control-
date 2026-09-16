"use client"
import { useQuery } from "@/components/topbar"
import GridCard from "./gridcard"
import { UserRecord } from "../users"
import { useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, ChevronDown, Download, Ellipsis, X } from "lucide-react"
import Image from "next/image"
import { AVATAR_COLORS } from "../live-connection"
import CommunityModalIndex from "./communities-modal"


//  ..........Generated MOCK Data from the below ...............

const COMMUNITY_NAMES = [
  "Lagos Tech Collective",
  "Product Managers Hub",
  "Women in STEM Nigeria",
  "Crypto Traders NG",
  "Fitness & Wellness Lagos",
  "UI/UX Designers Africa",
  "Startup Founders Circle",
  "AI Builders Workshop",
  "Fintech Founders USA",
  "Crypto Traders UG",
  "CISCO Hub",
  "Data Engineers NG",
  "DSN Nigeria",
  "UBA Group",
  "No-Code Builders Founders",
  "Africa Investor Summit",
  "Remote Work Labs",
  "PIS Labs",
  "NBA USA",
  "Medicals Society",
]

const CREATORS: Pick<UserRecord, 'name'|'avatar'>[] = [
  {name: "Tunde Olowo", avatar:""},
  {name: "Chioma Nze", avatar:""},
  {name: "Amina Yusuf", avatar:""},
  {name: "Emeka Obi", avatar:""},
  {name: "Victor Bassey", avatar:""},
  {name: "Kemi Adesina", avatar:""},
  {name: "Alimi Rukayat", avatar:""},
  {name: "Femi Banjo", avatar:""},
  {name: "Emmanuel Taiwo", avatar:""},
]

const CATEGORIES: EventCategory[] = [
  "Technology",
  "Business",
  "Education",
  "Health",
  "Social",
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

function generateCommunities(count: number): CommunityRow[] {
  const rows: CommunityRow[] = []
  const today = new Date(2026, 8, 15)

  for (let i = 0; i < count; i++) {
    const creator = CREATORS[Math.floor(rand() * CREATORS.length)]
    const name = COMMUNITY_NAMES[Math.floor(rand() * COMMUNITY_NAMES.length)]
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)]

    const createdOffsetDays = Math.floor(rand() * 600)
    const dateCreated = new Date(today)
    dateCreated.setDate(dateCreated.getDate() - createdOffsetDays)

    const roll = rand()
    let status: CommunityStatus

    if (roll < 0.15) {
      status = "Active"
    } else if (roll < 0.5) {
      status = "Inactive"
    } else {
      status = "Reported"
    }

    const members = Math.floor((rand() * 10_000 + 25_000) / 500) * 50 
    const weeklyPost = Math.floor(rand() * 500) + 20
    const totalPost = weeklyPost + Math.floor(rand() * 24_500)
    const about = "A premier ecosystem for builders, developers, and tech executives in Lagos. We drive ecosystem collaborations, share tech career opportunities, and host impactful developer workshops."

    rows.push({
      id: `com-${i + 1}`,
      communityName: `${name}${i >= COMMUNITY_NAMES.length ? ` ${Math.floor(i / COMMUNITY_NAMES.length) + 1}` : ""}`,
      createdBy: creator.name,
      creatorAvatar: creator.avatar,
      communityAvatar: '',
      dateCreated,
      category,
      about,
      members,
      weeklyPost,
      totalPost,
      status,
    });
  }

  return rows.sort((a, b) => b.dateCreated.getTime() - a.dateCreated.getTime());
}

const ALL_EVENTS = generateCommunities(486)

// .................... End mock data ....................

const PAGE_SIZE = 8;

const TABS: CommunityTABSProps[] = [
  { label: "All", status: "All" },
  { label: "Active", status: "Active" },
  { label: "Inactive", status: "Inactive" },
  { label: "Reported", status: "Reported" },
]

export const formatCompactNumber = (value: number) => 
  new Intl.NumberFormat("en-US").format(value)

export const fmtDate = (d: Date | null) =>
  d === null
    ? "--"
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

const VALUE_RANGES = [
  "All",
  "0 to 50",
  "51 to 200",
  "201 to 500",
  "501 to 1000",
  "Upwards",
] as const
type ValueRange = (typeof VALUE_RANGES)[number]

const Dropdown = ({
  label,
  value,
  options,
  onChange,
  icon,
}: CommunityDropdownProps) => {
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

const StatusBadge = ({ status }: { status: CommunityStatus }) => {
  const styles: Record<CommunityStatus, string> = {
    Active: "bg-[#DCFCE7] text-[#22C55E]",
    Inactive: "bg-[#F4F3F5] text-[#4F4E59]",
    Reported: "bg-[#F9E3E3] text-[#C92B2B]",
  }
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  )
}

export const CategoryBadge = ({ category }: { category: CommunityCategory }) => {
  const styles: Record<CommunityCategory, string> = {
    Business: "bg-[#F0FDF4] text-[#16A34A]",
    Education: "bg-[#F5F3FF] text-[#7C3AED]",
    Health: "bg-[#ECFDF5] text-[#059669]",
    Social: "bg-[#FFFBEB] text-[#FB923C]",
    Technology: "bg-[#EFF6FF] text-[#248DDE]",
  }
  return (
    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${styles[category]}`}>
      {category}
    </span>
  )
}



const CommunitiesHomeIndex = () => {
  const {query, setModal, contentModal} = useQuery()
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["status"]>("All")
  const [categoryFilter, setCategoryFilter] = useState<"All" | CommunityCategory>("All")
  const [memberRange, setMemberRange] = useState<ValueRange>("All")
  const [page, setPage] = useState(1)

  const today = useMemo(() => new Date(2026, 8, 15), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ALL_EVENTS.filter((ev) => {
      if (q && !ev.createdBy.toLowerCase().includes(q) && !ev.communityName.toLowerCase().includes(q)) return false;
      if (activeTab !== "All" && ev.status !== activeTab) return false;
      if (categoryFilter !== "All" && ev.category !== categoryFilter) return false;

      if (memberRange !== "All") {
        const memberDiff = ev.members;

        switch (memberRange) {
          case "0 to 50":
            if (!(memberDiff >= 0 && memberDiff <= 50)) return false;
            break;
          case "51 to 200":
            if (!(memberDiff >= 51 && memberDiff <= 200)) return false;
            break;
          case "201 to 500":
            if (!(memberDiff >= 201 && memberDiff <= 500)) return false;
            break;
          case "501 to 1000":
            if (!(memberDiff >= 501 && memberDiff <= 1000)) return false;
            break;
          case "Upwards":
            if (!(memberDiff > 1000)) return false;
            break;
        }
      }
      return true;
    });
  }, [query, activeTab, categoryFilter, memberRange, today])

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
    const header = ["Community Name", "Created By", "Category", "Members", "Weekly Post", "Date Created", "Status"]

    const lines = filtered.map((com) =>
      [com.communityName,com.createdBy,com.category,com.members,com.weeklyPost,com.dateCreated.toISOString().slice(0, 10),com.status]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
    )

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "InstantConnect-Community-Members.csv"
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

  const handleModal = (person: CommunityRow) => {
    setModal(true)
    contentModal(<CommunityModalIndex community={person} modal={(val)=> setModal(val)} />)
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
              {(categoryFilter !== "All" || memberRange !== "All") && (
                <button
                  onClick={() => {
                    setCategoryFilter("All");
                    setMemberRange("All");
                    resetToFirstPage();
                  }}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear filters
                </button>
              )}
              <Dropdown
                label="Category: All"
                value={categoryFilter === "All" ? "All" : categoryFilter}
                options={["All", ...CATEGORIES]}
                onChange={(v) => {
                  setCategoryFilter(v as "All" | CommunityCategory);
                  resetToFirstPage();
                }}
              />
              <Dropdown
                label="Size: All"
                value={memberRange}
                options={VALUE_RANGES}
                onChange={(v) => {
                  setMemberRange(v as ValueRange);
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
            <table className="w-full min-w-[950px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-b-primary-border bg-primary text-left text-xs font-semibold uppercase tracking-wide text-neutral-light-300 select-none">
                  <th className="px-4 py-3">Community Name</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Members</th>
                  <th className="px-4 py-3">Post This Week</th>
                  <th className="px-4 py-3">Date Created</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((com, i) => (
                  <tr key={com.id} className="border-b border-gray-50 last:border-0 select-none text-[13px] text-neutral-light-400 font-normal">
                    <td className="max-w-48 truncate p-4 font-semibold text-sm text-neutral-light-600">
                      <div className="flex items-center gap-2">
                        {(com.communityAvatar.length>0)?
                          <Image
                            src={com.communityAvatar}
                            alt={com.communityName}
                            draggable={false}
                            className="w-9 h-8 text-xs rounded-lg object-cover"
                          /> :
                          <span className={`inline-flex items-center justify-center shrink-0 w-9 h-8 text-xs rounded-lg ${
                            AVATAR_COLORS[i % AVATAR_COLORS.length]
                          }`}>{com.communityName[0]}</span>
                        }
                        <span title={com.communityName} className=" w-full truncate">{com.communityName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {
                          (com.creatorAvatar.length>0)?
                          <Image
                            src={com.creatorAvatar}
                            alt={com.createdBy}
                            draggable={false}
                            className="w-6 h-6 text-[8px] rounded-full object-cover"
                          /> :
                          <span className={`inline-flex items-center justify-center shrink-0 w-6 h-6 text-[8px] rounded-full ${
                            AVATAR_COLORS[i % AVATAR_COLORS.length]
                          }`}>{initials(com.createdBy)}</span>
                        }
                        <span className="font-medium whitespace-nowrap overflow-hidden">{com.createdBy}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <CategoryBadge category={com.category} />
                    </td>
                    <td className="p-4 font-medium">
                      {formatCompactNumber(com.members)}
                    </td>
                    <td className="p-4 font-medium min-w-30">
                      {formatCompactNumber(com.weeklyPost)}
                    </td>
                    <td className="whitespace-nowrap p-4">
                      {fmtDate(com.dateCreated)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={com.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleModal(com)}
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

export default CommunitiesHomeIndex