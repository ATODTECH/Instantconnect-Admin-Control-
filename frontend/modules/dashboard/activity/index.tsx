"use client"

import { ActivityRow, ActivityStatus } from "@/types/dashboard";
import { ArrowRight } from "lucide-react"
import { useState } from "react";



// to-be API DATA 
const ACTIVITY_TEMPLATES: Omit<ActivityRow, "id" | "date">[] = [
  {
    userName: "Chinedu Okafor",
    userEmail: "chinedu@gmail.com",
    avatarSeed: "chinedu",
    action: "Created new event 'Tech Summit Lagos'",
    status: "Approved",
  },
  {
    userName: "Amina Yusuf",
    userEmail: "amina.y@gmail.com",
    avatarSeed: "amina",
    action: "Submitted KYC verification documents",
    status: "Pending",
  },
  {
    userName: "David Williams",
    userEmail: "david@gmail.com",
    avatarSeed: "david",
    action: "Upgraded subscription to 'Organizer Pro'",
    status: "Completed",
  },
  {
    userName: "Zainab Balogun",
    userEmail: "zainab@gmail.com",
    avatarSeed: "zainab",
    action: "Registered on the platform",
    status: "Successful",
  },
  {
    userName: "Tunde Akinola",
    userEmail: "tunde@gmail.com",
    avatarSeed: "tunde",
    action: "Created new event 'Business Networking'",
    status: "Rejected",
  },
  {
    userName: "Kadijat Yusuf",
    userEmail: "kadijat.y@gmail.com",
    avatarSeed: "kadijat",
    action: "Submitted KYC verification documents",
    status: "Completed",
  },
  {
    userName: "Taiwo Williams",
    userEmail: "taiwo@gmail.com",
    avatarSeed: "taiwo",
    action: "Upgraded subscription to 'Organizer Pro'",
    status: "Completed",
  },
  {
    userName: "Zainab Balogun",
    userEmail: "zainab@gmail.com",
    avatarSeed: "zainab",
    action: "Registered on the platform",
    status: "Successful",
  },
  {
    userName: "Tunde Kekere-Ekun",
    userEmail: "tunde@gmail.com",
    avatarSeed: "tunde",
    action: "Created new event 'Business Networking'",
    status: "Successful",
  },
];

const ActivityIndex = () => {
  const [showAll, setShowAll] = useState<boolean>(false)


  function formatRelativeDate(iso: string) {
    const date = new Date(iso);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  
  function initials(name: string) {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const AVATAR_COLORS = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-pink-100 text-pink-700",
    "bg-emerald-100 text-emerald-700",
    "bg-orange-100 text-orange-700",
  ];

  const STATUS_STYLES: Record<ActivityStatus, string> = {
    Approved: "text-[#22C55E] bg-[#F0FDF4]",
    Pending: "text-[#FB923C] bg-[#FFF7ED]",
    Completed: "text-[#A855F7] bg-[#FAF5FF]",
    Successful: "text-[#22C55E] bg-[#F0FDF4]",
    Rejected: "bg-[#F9E3E3] text-[#991B1B]",
  };

  function relativeTimestamp(offsetMinutes: number) {
    const d = new Date(Date.now() - offsetMinutes * 60_000);
    return d.toISOString();
  }

  const recentActivity: ActivityRow[] = ACTIVITY_TEMPLATES.map(
    (template, i) => ({
      ...template,
      id: `${template.avatarSeed}-${i}`,
      date: relativeTimestamp(i === 0 ? 0 : i * 90 + Math.round(Math.random() * 30)),
    })
  )
  const visibleItems = showAll? recentActivity: recentActivity.slice(0, 5)

  return (
    <>
      <div className="flex items-center justify-between px-6">
        <h3 className="  font-bold text-base text-neutral-light-600">Recent Activity</h3>
        <button type="submit" className="flex gap-x-2 hover:underline hover:underline-offset-3 cursor-pointer items-center text-purple-light-600 hover:text-violet-700" onClick={()=>setShowAll(true)}>
          <span className="text-[.8125rem] font-semibold">View all activity</span>
          <ArrowRight size={14} className=" h-3.5 w-3.5" />
        </button>
      </div>
      <div className="relative ">
        <table className="w-full min-w-[650px] border-collapse text-left">
          <thead>
            <tr className=" text-xs font-semibold text-neutral-light-300 bg-bg-secondary">
              <th className="pl-6 py-3">User</th>
              <th className="py-3">Action</th>
              <th className="py-3">Date</th>
              <th className="pr-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((row, i) => (
              <tr
                key={row.id}
                className="border-t border-slate-100 text-sm"
              >
                <td className="py-3 pl-6 pr-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                        AVATAR_COLORS[i % AVATAR_COLORS.length]
                      }`}
                    >
                      {initials(row.userName)}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-neutral-light-600">
                        {row.userName}
                      </p>
                      <p className="text-xs font-normal text-neutral-light-300">
                        {row.userEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm font-medium text-neutral-light-600">{row.action}</td>
                <td className="py-3 pr-4 font-normal text-sm text-neutral-light-300">
                  {formatRelativeDate(row.date)}
                </td>
                <td className="py-3 pr-6">
                  <span
                    className={`text-xs font-semibold py-1 px-2 rounded-md ${STATUS_STYLES[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ActivityIndex