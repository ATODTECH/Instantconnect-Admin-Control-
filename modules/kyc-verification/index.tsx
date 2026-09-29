"use client"
import GridCard from "./gridcard"
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@/components/topbar";
import { USERS } from "@/modules/kyc-verification/mock-users";
import { ArrowLeft, ArrowRight, Download, MoreHorizontal, RefreshCw } from "lucide-react";
import { Action, Priority } from "@/types/kyc-verification";
import KYCModalInfo from "./kyc-modal-info";
import Image from "next/image";

const kycStyles: Record<KycStatus, string> = {
  Verified: "bg-[#DCFCE7] text-[#4ADE80]",
  Pending: "bg-[#FFF7ED] text-[#FB923C]",
  Rejected: "bg-[#F4F3F5] text-[#4F4E59]",
}
const priorityStyles: Record<Priority, string> = {
  High: "bg-[#F9E3E3] text-[#C92B2B]",
  Medium: "bg-[#FAF5FF] text-[#9333EA]",
  Low: "bg-[#F4F3F5] text-[#4F4E59]",
}
const actionStyles: Record<Action, string> = {
  Review: "bg-[#9333EA] text-[#FFFFFF]",
  View: "bg-[#FAF5FF] text-[#9333EA] border-[#E9D5FF]",
}

const AVATAR_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-orange-100 text-orange-700",
]

const KYC_OPTIONS = ["All Submissions", "Pending", "Verified", "Rejected"] as const;

interface FilterDropdownProps {
  options: string;
  value: string;
  onChange: (v: string) => void;
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

function FilterDropdown({ options, value, onChange }: FilterDropdownProps) {
  const numUser = options==='All Submissions'?USERS:USERS.filter(val => val.kyc===options)
  return (
    <button
      onClick={() => onChange(options)}
      className={`flex items-center gap-1.5 text-nowrap justify-between px-3 py-2 text-sm leading-[100%] border rounded-lg text-center font-medium hover:bg-slate-50 transition-colors cursor-pointer ${
        options === value ? " border-violet-300 bg-violet-50 text-purple-light-600" : "border-primary-border bg-neutral-white text-neutral-light-400 hover:bg-slate-50"
      }`}
    >
      <span>{options}</span>
      <span className={`shrink-0 px-1.5 py-0.5 font-semibold text-[11px] ${options===value?' rounded-sm bg-purple-light-600 text-neutral-white':' rounded-full bg-[#F4F3F5] text-neutral-light-300'}`}>{numUser.length}</span>
    </button>
  )
}


const KYCHomeIndex = () => {
  const {query, setModal, contentModal} = useQuery()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [kycFilter, setKycFilter] = useState<string>(KYC_OPTIONS[0])
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
 
    return USERS.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (kycFilter !== KYC_OPTIONS[0] && u.kyc !== kycFilter) return false;
      return true;
    });
  }, [query, kycFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE)
  
  useEffect(() => {
    setPage(1);
  }, [query, kycFilter])


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
    const headers = ['USER_ID','NAME','EMAIL','PHONE_NUMBER','GENDER','DOB','LOCATION','DOC_TYPE','SUBMITTED_DATE','KYC_STATUS','KYC_ACTION']
    const rows = THE_SELECTED.map((id) => 
      [USERS[+id-1].userID, USERS[+id-1].name, USERS[+id-1].email, USERS[+id-1].phoneNumber, USERS[+id-1].gender, USERS[+id-1].dob, USERS[+id-1].location, [USERS[+id-1].docType.nin, USERS[+id-1].docType.otherKYCType], USERS[+id-1].kycDateSubmitted, USERS[+id-1].kyc, USERS[+id-1].action]
      .map((field) => `"${String(field).replace(/"/g, '""')}"`)
      .join(",")
    )

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'InstantConnect-KYC-Users.csv'
    document.body.appendChild(link)
    // Trigger download and clean up
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const handleModal = (index: number) => {
    const person = USERS[index]
    setModal(true)
    contentModal(
      <KYCModalInfo person={person} modal={(val)=> setModal(val)} />
    )
  }

  

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col gap-y-6 mb-8">
        {/* Filters row */}
        <div className="flex bg-neutral-white items-center justify-between gap-3 p-5 py-6 rounded-2xl border-[.5px] border-primary-border flex-wrap shadow-[0px_0px_10px_0px_#00000005]">
          <div className="flex items-center gap-4">
            <FilterDropdown
              options={KYC_OPTIONS[0]}
              value={kycFilter}
              onChange={(v) => setKycFilter(v)}
            />
            <FilterDropdown
              options={KYC_OPTIONS[1]}
              value={kycFilter}
              onChange={(v) => setKycFilter(v)}
            />
            <FilterDropdown
              options={KYC_OPTIONS[2]}
              value={kycFilter}
              onChange={(v) => setKycFilter(v)}
            />
            <FilterDropdown
              options={KYC_OPTIONS[3]}
              value={kycFilter}
              onChange={(v) => setKycFilter(v)}
            />
          </div>
          <button type="submit" className="flex gap-1.5 items-center flex-nowrap font-semibold border-primary-border bg-neutral-white text-neutral-light-400 hover:bg-slate-50 px-3 py-2 text-sm leading-[100%] border rounded-lg cursor-pointer" onClick={()=>[...selected].length>0?handleExport(): alert('coming soon!')}>
            {[...selected].length>0?
              <>
                <Download className="w-3.5 h-3.5" />
                <span className="">Export CSV</span>
              </>:
              <>
                <RefreshCw size={14} className=" h-3.5 w-3.5" />
                <span className="">Refresh Queue</span>
              </>
            }
          </button>
        </div>
        {/* Panel */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          {/* Table */}
          <div className="scrollbar-thin scrollbar-thumb-gray-200 overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
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
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Document Type</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Submitted Date</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Status</th>
                  <th className="py-3.75 text-xs uppercase font-semibold text-neutral-light-300">Priority</th>
                  <th className="py-3.75 pr-5 text-xs uppercase font-semibold text-neutral-light-300 text-right">Action</th>
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
                            <Image
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
                      <td className="py-3 pr-2" title={u.docType.otherKYCType}>
                        <span className={`inline-flex items-start py-1 rounded-md text-sm text-neutral-light-500 font-medium max-w-50 truncate`}>
                          <span className=" truncate">
                            {u.docType.nin},&nbsp;
                            {u.docType.otherKYCType}
                          </span>
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-start py-1 rounded-md text-sm text-neutral-light-400 font-normal`}>
                          {u.kycDateSubmitted}
                        </span>
                      </td>
                      <td className="py-3 text-start">
                        <span className={`inline-flex items-start px-2.5 py-1 rounded-md text-xs font-semibold ${kycStyles[u.kyc]}`}>
                          {u.kyc}
                        </span>
                      </td>
                      <td className="py-3 text-start">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${priorityStyles[u.priority]}`}>
                          {u.priority}
                        </span>
                      </td>
                      <td className="py-3 pr-5 text-right">
                        <button className={`items-center px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${actionStyles[u.action]}`}
                        onClick={()=>handleModal(i)}>
                          {u.action}
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
                    <MoreHorizontal size={16} className=" text-neutral-light-500" />
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
  )
}

export default KYCHomeIndex