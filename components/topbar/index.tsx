"use client"

import { Bell, Search } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { usePathname } from "next/navigation"
import { ROUTES } from "@/lib/routes"
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface TopBarProps {
  image: StaticImageData,
  setModal: (val: boolean) => void,
  contentModal: (val: React.ReactNode) => void,
  children: React.ReactNode
}

export interface QueryContextType {
  query: string,
  setModal: (val: boolean) => void,
  contentModal: (val: React.ReactNode) => void,
}
export const QueryContext = createContext<QueryContextType | undefined>(undefined)

interface Notification {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  read: boolean;
}

// API DATA
const initialNotifications: Notification[] = [
  {
    id: "IC-2026-0837",
    title: "",
    body: "",
    timeAgo: "",
    read: true,
  }, {
    id: "IC-2026-0841",
    title: "",
    body: "",
    timeAgo: "",
    read: true,
  }, {
    id: "IC-2026-0815",
    title: "",
    body: "",
    timeAgo: "",
    read: true,
  },
]

const TopBarIndex = ({image, setModal, contentModal, children}: TopBarProps) => {
  const [query, setQuery] = useState("")
  const pathname = usePathname()

  const [isRinging, setIsRinging] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const containerRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsRinging(false)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsRinging(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    }
  }, [])


  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }
  const triggerRing = () => setIsRinging(!isRinging)

  const nav = [
    {title:"Dashboard", content:"Welcome back, Admin. InstantConnect overview and quick metrics."},
    {title:"User Management", content:"Manage platform members, KYC verification records, and billing tiers."},
    {title:"KYC Verification", content:"Review and verify user identity documents."},
    {title:"Live Connection", content:"Monitor active meetups and connection locations in real-time."},
    {title:"Events", content:"Review and verify user identity documents."},
    {title:"Community Management", content:"Monitor and manage all platform communities."},
    {title:"Subscription Management", content:"Monitor and manage all platform subscriptions."},
    {title:"Platform Settings", content:"Configure and manage platform preferences."},
  ]

  const content= () => {
    switch (pathname) {
      case ROUTES.overview:        
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[0].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[0].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )    
      case ROUTES.users:        
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[1].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[1].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )    
      case ROUTES.kycVerification:        
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[2].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[2].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )    
      case ROUTES.liveConnection:        
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[3].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[3].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )    
      case ROUTES.events:
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[4].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[4].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )
      case ROUTES.communities:
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[5].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[5].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )
      case ROUTES.subscriptions:
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[6].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[6].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )
      case ROUTES.settings:
        return (
          <div className="flex flex-1 gap-x-5 justify-between items-center">
            <div className="flex flex-col">
              <h1 className=" font-bold text-2xl text-neutral-light-600">{nav[7].title}</h1>
              <h4 className=" font-normal text-[13px] text-neutral-light-300">{nav[7].content}</h4>
            </div>
            <form className=" relative" onSubmit={(e)=>e.preventDefault()}>
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm [&::-webkit-search-cancel-button]:hidden" />
            </form>
          </div>
        )
      default:
        return <></>
    }
  }

  return (
    <>
      <div className="flex gap-x-5 sticky top-0 bg-bg-secondary pr-8">
        {content()}
        <div className="flex gap-x-5 items-center">
          <div className="relative flex flex-col" ref={containerRef}>
            <button 
              role="button"
              onClick={triggerRing}
              aria-haspopup={true}
              aria-expanded={isRinging}
              aria-label="Notifications"
              className="relative bg-neutral-white rounded-lg cursor-pointer border border-[#E4E7EC] p-2"
            >
              <Bell size={18} className="h-4.5 w-4.5 text-[#64748B]" />
              <span className="top-2 right-2 absolute inline-flex shrink-0 rounded-full border-[1.35px] border-neutral-white h-[7.2px] w-[7.2px] bg-[#EF4444]" />
            </button>
            {isRinging && (
              <div role='menu' className="absolute right-0 top-8 z-10 bg-neutral-white mt-2 w-80 origin-top-right overflow-y-auto h-fit max-h-[70vh] rounded-xl bg-neutral-0 shadow-[0_8px_30px_rgba(15,23,42,0.12)] ring-1 ring-primary-border animate-[fadeIn_0.12s_ease-out]">
                {/* Header */}
                <div className="flex items-center sticky top-0 bg-neutral-0 justify-between px-5 pt-4 pb-3">
                  <h3 className="text-[15px] font-semibold text-neutral-light-600">
                    Notifications
                  </h3>
                  <button
                    type="button"
                    onClick={markAllRead}
                    disabled={unreadCount===0}
                    className="text-sm font-medium text-[#00A63E] disabled:cursor-not-allowed disabled:text-[#00A63E]/50 transition-colors hover:text-emerald-700 cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                {/* List */}
                <div className="max-h-105 divide-y divide-slate-100 overflow-y-auto">
                  {(unreadCount === 0) ? 
                  (<div className="px-5 py-3 select-none text-center text-[1.5rem]">
                    🔔
                  </div>) : 
                  (notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item.id === n.id ? { ...item, read: true } : item
                          )
                        )
                      }
                      className={`w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 cursor-pointer ${n.read?'hidden':'flex'}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug text-[#0F172B]">{n.title}</p>
                        <p className="mt-0.5 text-xs leading-snug text-[#90A1B9]">{n.body}</p>
                        <p className="mt-1 text-xs text-[#CAD5E2]">{n.timeAgo}</p>
                      </div>
                    </button>
                  )))}
                </div>

                {/* Footer */}
                <div className="border-t border-[#f1f5f9] px-5 py-3 text-center">
                  <button
                    type="button"
                    onClick={()=> alert('coming soon!')}
                    className="text-sm font-medium text-[#00A63E] transition-colors hover:text-emerald-700 cursor-pointer"
                  >
                    Notification settings
                  </button>
                </div>
              </div>
            )}
          </div>
          <Image
            src={image}
            alt="profile avatar"
            height={36}
            width={36}
            className="h-10 w-10 rounded-full object-cover overflow-hidden"
          />
        </div>
      </div>
      <QueryContext.Provider value={{query, setModal, contentModal}}>
        { children }
      </QueryContext.Provider>
    </>
  )
}

export const useQuery = () => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  
  return context;
}

export default TopBarIndex