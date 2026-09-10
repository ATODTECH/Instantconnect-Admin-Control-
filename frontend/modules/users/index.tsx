"use client"

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Download, MoreHorizontal, Check, ArrowLeft, ArrowRight, Ellipsis, CircleXIcon, ShieldAlert, MessageSquare, Ban } from "lucide-react";
import { KycStatus, Plan, Status } from "@/types/users";
import { useQuery } from "@/components/topbar";


interface ExportUserRecord {
  id: string,
  name: string,
  email: string,
  status: Status,
  kyc: KycStatus,
  plan: Plan,
  isPro: boolean,
  eventsAttended: number,
  joined: string,
  dob: string,
  gender: string,
  location: string,
  phoneNumber: string,
  userID: string,
  lastActive: string,
  eventCreated: string,
  communities: string,
  connection: string,
}

interface UserRecord extends ExportUserRecord {
  avatar: string,
}

// to-be API DATA
const USERS: UserRecord[] = [
  { id: "1", name: "Halima Lawal", email: "halima.l@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Business", isPro: true, eventsAttended: 24, joined: "12 Oct 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "2", name: "Chidi Okonkwo", email: "chidi.o@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Premium", isPro: true, eventsAttended: 15, joined: "08 Nov 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "3", name: "Aisha Mohammed", email: "aisha.mo@gmail.com", avatar: "", status: "Pending", kyc: "Pending", plan: "Free", isPro: false, eventsAttended: 2, joined: "14 Jan 2024", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "4", name: "Doan Blaq", email: "tunde.bakare@gmail.com", avatar: "", status: "Suspended", kyc: "Rejected", plan: "Free", isPro: false, eventsAttended: 0, joined: "22 Aug 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "5", name: "Ngozi Uju", email: "ngozi.eze@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Premium", isPro: true, eventsAttended: 31, joined: "19 May 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "6", name: "Femi Adeyemi", email: "femi.ade@gmail.com", avatar: "", status: "Active", kyc: "Pending", plan: "Free", isPro: false, eventsAttended: 8, joined: "03 Dec 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "7", name: "Blessing Orija", email: "blessing.ok@gmail.com", avatar: "", status: "Active", kyc: "Verified", plan: "Business", isPro: true, eventsAttended: 42, joined: "11 Feb 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "8", name: "Ibrahim Musa", email: "ibrahim.m@gmail.com", avatar: "", status: "Suspended", kyc: "Verified", plan: "Free", isPro: false, eventsAttended: 5, joined: "28 Jun 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
  { id: "9", name: "Adewole James", email: "adewole.j@gmail.com", avatar: "", status: "Suspended", kyc: "Verified", plan: "Free", isPro: false, eventsAttended: 5, joined: "28 Jun 2023", phoneNumber:"+234 812 345 6789", gender:"female", dob:"13 Mar 1997",location:"Ikeja, Lagos", userID:"#USR-00142", lastActive:"2 hours ago", eventCreated:"8", connection:"128", communities:"5" },
];

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
];

const statusStyles: Record<Status, string> = {
  Active: "bg-[#DCFCE7] text-[#22C55E]",
  Pending: "bg-[#FFF7ED] text-[#FB923C]",
  Suspended: "bg-[#F9E3E3] text-[#991B1B]",
};

const kycStyles: Record<KycStatus, string> = {
  Verified: "bg-[#FAF5FF] text-[#9333EA]",
  Pending: "bg-[#FFF7ED] text-[#FB923C]",
  Rejected: "bg-[#F4F3F5] text-[#4F4E59]",
};

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseJoined(d: string): Date {
  const [day, mon, year] = d.split(" ");
  return new Date(Number(year), MONTHS[mon], Number(day));
}

// "Today" is anchored to the most recent record so the date filter has visible effect on static demo data.
const TODAY = USERS.reduce((latest, u) => {
  const d = parseJoined(u.joined);
  return d > latest ? d : latest;
}, new Date(0));

const DAY_MS = 1000 * 60 * 60 * 24;

const STATUS_OPTIONS = ["All Statuses", "Active", "Pending", "Suspended"] as const;
const KYC_OPTIONS = ["All KYC", "Verified", "Pending", "Rejected"] as const;
const PLAN_OPTIONS = ["All Plans", "Free", "Premium", "Business"] as const;
const DATE_OPTIONS = ["Last 30 Days", "Last 90 Days", "Last 6 Months", "All Time"] as const;

const DATE_WINDOW_DAYS: Record<(typeof DATE_OPTIONS)[number], number | null> = {
  "Last 30 Days": 30,
  "Last 90 Days": 90,
  "Last 6 Months": 182,
  "All Time": null,
};

interface FilterDropdownProps {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function FilterDropdown({ options, value, onChange, isOpen, onToggle }: FilterDropdownProps) {
  const isActive = value !== options[0];
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border font-medium transition-colors ${
          isActive
            ? "border-violet-300 bg-violet-50 text-purple-light-600"
            : "border-primary-border bg-white text-[#1E293B] hover:bg-slate-50"
        }`}
      >
        {value}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""} ${isActive ? "text-violet-400" : "text-slate-400"}`} />
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-1.5 w-44 bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-900/5 py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-50 transition-colors ${
                opt === value ? "text-violet-700 font-medium" : "text-slate-600"
              }`}
            >
              {opt}
              {opt === value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PAGE_SIZE = 8;

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 3) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, 2, 3, total]);
  if (current > 3 && current < total) {
    pages.add(current - 1);
    pages.add(current);
    pages.add(current + 1);
  }

  const sorted = Array.from(pages)
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
}

// main component
const UsersHomeIndex = () => {
  const {query, setModal, contentModal} = useQuery()
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_OPTIONS[0])
  const [kycFilter, setKycFilter] = useState<string>(KYC_OPTIONS[0])
  const [planFilter, setPlanFilter] = useState<string>(PLAN_OPTIONS[0])
  const [dateFilter, setDateFilter] = useState<string>(DATE_OPTIONS[3])
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

 const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const windowDays = DATE_WINDOW_DAYS[dateFilter as (typeof DATE_OPTIONS)[number]];
 
    return USERS.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (statusFilter !== STATUS_OPTIONS[0] && u.status !== statusFilter) return false;
      if (kycFilter !== KYC_OPTIONS[0] && u.kyc !== kycFilter) return false;
      if (planFilter !== PLAN_OPTIONS[0] && u.plan !== planFilter) return false;
      if (windowDays !== null) {
        const diffDays = (TODAY.getTime() - parseJoined(u.joined).getTime()) / DAY_MS;
        if (diffDays > windowDays) return false;
      }
      return true;
    });
  }, [query, statusFilter, kycFilter, planFilter, dateFilter])
 
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE)
 
  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, kycFilter, planFilter, dateFilter])
 

  const allChecked = pageItems.length > 0 && pageItems.every((u) => selected.has(u.id))

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        pageItems.forEach((u) => next.delete(u.id));
      } else {
        pageItems.forEach((u) => next.add(u.id));
      }
      return next;
    })
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    })
  }

  const pageList = useMemo(() => getPageList(safePage, totalPages), [safePage, totalPages])
  
  const initials = (name: string) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
  }

  const handleExport = () => {
    // Pass in the selected sorted users to export as CSV
    const THE_SELECTED = [...selected].sort()
    const headers = ['USER_ID','NAME','EMAIL','PHONE_NUMBER','GENDER','DOB','LOCATION','LAST_ACTIVE','STATUS','KYC','PLAN','IS_PRO','EVENT_CREATED','EVENT_ATTENDED','CONNECTION','COMMUNITY','JOINED']
    const rows = THE_SELECTED.map((id) => [USERS[+id-1].userID, USERS[+id-1].name, USERS[+id-1].email, USERS[+id-1].phoneNumber, USERS[+id-1].gender, USERS[+id-1].dob, USERS[+id-1].location, USERS[+id-1].lastActive, USERS[+id-1].status, USERS[+id-1].kyc, USERS[+id-1].plan, USERS[+id-1].isPro, USERS[+id-1].eventCreated, USERS[+id-1].eventsAttended, USERS[+id-1].connection, USERS[+id-1].communities, USERS[+id-1].joined])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'InstantConnect_Users.csv')
    document.body.appendChild(link)
    
    // Trigger download and clean up
    link.click()
    document.body.removeChild(link)
  }


  const handleModal = (index: number) => { 
    const person = USERS[index]
    setModal()
    contentModal(
      <div className="relative flex flex-col ml-auto h-full w-full max-w-105 bg-neutral-0 border border-b-primary-border shadow-[-20px_0px_60px_#00000026] bg-neutral-white ">
        <div className="flex items-center justify-between gap-4 text-neutral-light-600 text-lg font-bold pt-7.25 pb-5.25 px-6" onClick={(e)=>e.stopPropagation()}>
          <h3>User Profile Details</h3>
          <button className=" h-8 w-8 bg-[#F4F3F5] rounded-full cursor-pointer" onClick={()=>alert('coming soon!')}>
            <CircleXIcon size={12} className=" h-3 w-3 text-neutral-light-300 mx-auto" />
          </button>
        </div>
        <div onClick={(e)=>e.stopPropagation()} className="flex flex-col gap-y-7 px-6 scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto">
          <div className="flex gap-3 items-center w-full rounded-xl border border-bg-purple-light-200 bg-bg-purple-light-200 p-4 ">
            {
              (person.avatar.length>0)?
              <img
                src={person.avatar}
                alt={person.name}
                height={80}
                width={80}
                className="w-20 h-20 rounded-full object-cover"
              /> :
              <span className={`inline-flex items-center justify-center shrink-0 w-20 h-20 text-xl rounded-full ${
                AVATAR_COLORS[+person.id-1 % AVATAR_COLORS.length]
              }`}>{initials(person.name)}</span>
            }
            <div className="flex flex-col">
              <span className=" font-bold text-neutral-light-600 text-xl">{person.name}</span>
              <span className=" font-normal text-neutral-light-300 text-sm">{person.email}</span>
              <span className=" font-semibold bg-[#F0FDF4] text-secondary-green-500 py-1 px-3 text-xs rounded-md w-fit">{person.status}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-[#FED7AA] bg-[#FFF7ED] text-[#FB923C] rounded-lg cursor-pointer" onClick={()=>alert("coming soon!")}>
              <ShieldAlert size={14} className="h-3.5 w-3.5 " />
              Suspend
            </button>
            <button className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-purple-light-600 bg-bg-purple-light-200 text-purple-light-600 rounded-lg cursor-pointer" onClick={()=>alert("coming soon!")}>
              <MessageSquare size={14} className="h-3.5 w-3.5 " />
              Message
            </button>
            <button className="inline-flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold border border-[#EB8C8C] bg-[#FCF2F2] text-[#C92B2B] rounded-lg cursor-pointer" onClick={()=>alert("coming soon!")}>
              <Ban size={14} className="h-3.5 w-3.5 " />
              Disabled
            </button>
          </div>
          <div>
            <h4 className=" uppercase font-semibold text-xs text-purple-light-600 mb-1.5">Personal Information</h4>
            <div className="text-neutral-light-300 text-sm">
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Full Name</span>
                <span className=" text-neutral-light-500 font-semibold">{person.name}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Email Address</span>
                <span className=" text-neutral-light-500 font-semibold">{person.email}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Phone Number</span>
                <span className=" text-neutral-light-500 font-semibold">{person.phoneNumber}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Gender</span>
                <span className=" text-neutral-light-500 font-semibold">{person.gender}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Date of Birth</span>
                <span className=" text-neutral-light-500 font-semibold">{person.dob}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Location</span>
                <span className=" text-neutral-light-500 font-semibold">{person.location}</span>
              </p>
            </div>
          </div>
          <div>
            <h4 className=" uppercase font-semibold text-xs text-purple-light-600 mb-1.5">Account Details</h4>
            <div className="text-neutral-light-300 text-sm">
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">User ID</span>
                <span className=" text-neutral-light-500 font-semibold">{person.userID}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Joined Date</span>
                <span className=" text-neutral-light-500 font-semibold">{person.joined}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Last Active</span>
                <span className=" text-neutral-light-500 font-semibold">{person.lastActive}</span>
              </p>
              <p className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">KYC Status</span>
                <span className=" text-purple-light-600 text-[11px] py-0.5 px-2 bg-bg-purple-light-200 rounded-sm font-semibold">{person.kyc}</span>
              </p>
              <div className="flex justify-between gap-2 py-2.5 border-b-[.5px] border-b-[#F4F3F5]">
                <span className=" font-medium">Subscription</span>
                <div className="flex items-center gap-0.5 border px-0.75 py-0.5 border-[#E9D5FF] bg-bg-purple-light-200 rounded-sm">
                  <span className="text-neutral-light-500 font-medium text-[.625rem]">{person.plan}</span>
                  {person.isPro && (
                    <span className="inline-flex px-1 py-px text-[.5625rem] font-semibold rounded-xs bg-purple-light-600 border border-[#E9D5FF] text-neutral-white">
                      PRO
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-19.25">
            <h4 className=" uppercase font-semibold text-xs text-purple-light-600 mb-3">Activity Statistics</h4>
            <div className="grid grid-cols-2 gap-2.5 text-xl font-bold text-neutral-light-500">
              <div className="border flex flex-col gap-1 rounded-lg border-[#F4F3F5] bg-primary p-3">
                <h5 className="uppercase text-neutral-light-300 text-xs font-medium">Events Attended</h5>
                <span>{person.eventsAttended}</span>
              </div>
              <div className="border flex flex-col gap-1 rounded-lg border-[#F4F3F5] bg-primary p-3">
                <h5 className="uppercase text-neutral-light-300 text-xs font-medium">Events Created</h5>
                <span>{person.eventCreated}</span>
              </div>
              <div className="border flex flex-col gap-1 rounded-lg border-[#F4F3F5] bg-primary p-3">
                <h5 className="uppercase text-neutral-light-300 text-xs font-medium">Connections</h5>
                <span>{person.connection}</span>
              </div>
              <div className="border flex flex-col gap-1 rounded-lg border-[#F4F3F5] bg-primary p-3">
                <h5 className="uppercase text-neutral-light-300 text-xs font-medium">Communities</h5>
                <span>{person.communities}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="flex-1 flex flex-col overflow-y-auto scrollbar-thin pr-8 ">
      <div className="flex flex-col gap-y-6 mb-8">
        {/* Filters row */}
        <div ref={containerRef} className="flex bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <div className="flex items-center gap-4 flex-wrap">
            <FilterDropdown
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setOpenMenu(null); }}
              isOpen={openMenu === "status"}
              onToggle={() => setOpenMenu(openMenu === "status" ? null : "status")}
            />
            <FilterDropdown
              options={KYC_OPTIONS}
              value={kycFilter}
              onChange={(v) => { setKycFilter(v); setOpenMenu(null); }}
              isOpen={openMenu === "kyc"}
              onToggle={() => setOpenMenu(openMenu === "kyc" ? null : "kyc")}
            />
            <FilterDropdown
              options={PLAN_OPTIONS}
              value={planFilter}
              onChange={(v) => { setPlanFilter(v); setOpenMenu(null); }}
              isOpen={openMenu === "plan"}
              onToggle={() => setOpenMenu(openMenu === "plan" ? null : "plan")}
            />
            <FilterDropdown
              options={DATE_OPTIONS}
              value={dateFilter}
              onChange={(v) => { setDateFilter(v); setOpenMenu(null); }}
              isOpen={openMenu === "date"}
              onToggle={() => setOpenMenu(openMenu === "date" ? null : "date")}
            />
            {(statusFilter !== STATUS_OPTIONS[0] ||
              kycFilter !== KYC_OPTIONS[0] ||
              planFilter !== PLAN_OPTIONS[0] ||
              dateFilter !== DATE_OPTIONS[3]) && (
              <button
                onClick={() => {
                  setStatusFilter(STATUS_OPTIONS[0]);
                  setKycFilter(KYC_OPTIONS[0]);
                  setPlanFilter(PLAN_OPTIONS[0]);
                  setDateFilter(DATE_OPTIONS[3]);
                }}
                className="text-sm text-slate-400 hover:text-slate-600 px-2 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#1E293B] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          onClick={handleExport}>
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
        {/* Panel */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="text-left bg-[#FBFBFD] border-b border-b-primary-border">
                  <th className="py-3.75 w-10 pl-5 font-medium">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-slate-300 text-purple-light-600 focus:ring-purple-light-600/40 accent-violet-600 flex self-center"
                    />
                  </th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">User</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Status</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">KYC Status</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Subscription</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Events Attended</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Joined Date</th>
                  <th className="py-3.75 pr-5 text-xs uppercase font-semibold text-neutral-light-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-slate-400">
                      No users match the current search and filters
                    </td>
                  </tr>
                ) : (
                  pageItems.map((u, i) => (
                    <tr
                      key={u.id}
                      className={`border-t border-[#F1F5F9] transition-colors ${i%2==(0+1)?'bg-[#FBFBFD]':''} `}
                    >
                      <td className="pl-5 pr-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(u.id)}
                          onChange={() => toggleOne(u.id)}
                          className="w-4 h-4 rounded border-slate-300 text-purple-light-600 focus:ring-purple-light-600/40 accent-violet-600"
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {
                            (u.avatar.length>0)?
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-8 h-8 rounded-full object-cover"
                            /> :
                            <span className={`inline-flex items-center justify-center  shrink-0 w-8 h-8 rounded-full ${
                              AVATAR_COLORS[i % AVATAR_COLORS.length]
                            }`}>{initials(u.name)}</span>
                          }
                          <div>
                            <div className="font-semibold text-sm text-neutral-light-600">{u.name}</div>
                            <div className="text-xs font-normal text-neutral-light-300">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${statusStyles[u.status]}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${kycStyles[u.kyc]}`}>
                          {u.kyc}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-light-500 font-medium text-sm">{u.plan}</span>
                          {u.isPro && (
                            <span className="px-1.5 py-0.5 text-[.625rem] font-semibold rounded bg-bg-purple-light-200 border border-[#E9D5FF] text-purple-light-600">
                              PRO
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-sm text-neutral-light-500 text-center">{u.eventsAttended}</td>
                      <td className="py-3 text-neutral-light-400 font-normal text-sm">{u.joined}</td>
                      <td className="py-3 pr-5 text-right">
                        <button className={`p-1.5 rounded-lg text-neutral-light-400 transition-colors 
                        ${i%2==(0+1)?
                        'hover:bg-neutral-white shadow-[0px_0px_10px_0px_#00000009] ':
                        'hover:bg-slate-100 '}`}
                        onClick={()=>handleModal(i)}>
                          <MoreHorizontal size={16} className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 flex-wrap gap-3">
            <p className="text-sm font-semibold text-neutral-light-300/60">
              {
                (filtered.length===0)?
                <span>Showing 0 users</span>:
                <span>
                  Showing <b className=" text-neutral-light-500">{pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, filtered.length)}</b> of <b className=" text-neutral-light-500">{filtered.length}</b> users
                </span>
              }
            </p>
            <div className="flex items-center gap-2">
              {/* Previous */}
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  safePage === 1 ? " border-slate-200 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <ArrowLeft size={16} className="w-4 h-4" />
                Previous
              </button>

              {/* Page numbers / ellipsis */}
              {pageList.map((item, idx) =>
                item === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 select-none">
                    <Ellipsis size={16} className=" text-neutral-light-500" />
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`min-w-10 h-10 px-3 text-sm font-medium rounded-xl border transition-colors ${
                      item === safePage
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
                disabled={safePage === totalPages}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  safePage === totalPages
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
  );
}

export default UsersHomeIndex