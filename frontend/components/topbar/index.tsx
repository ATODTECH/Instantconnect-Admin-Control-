"use client"

import { Bell, Search } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { usePathname } from "next/navigation"
import { createContext, useContext, useState } from "react";

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

const TopBarIndex = ({image, setModal, contentModal, children}: TopBarProps) => {
  const [query, setQuery] = useState("")
  const pathname = usePathname()

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
      case "/":        
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
      case "/users":        
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
      case "/kyc-verification":        
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
      case "/live-connection":        
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
      case "/events":
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
      case "/communities":
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
      case "/subscriptions":
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
      case "/settings":
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
          <div role="button" className=" relative bg-neutral-white rounded-lg border border-[#E4E7EC] p-2" onClick={()=>alert("coming soon!")}>
            <Bell size={18} className="h-4.5 w-4.5 text-[#64748B]" />
            <span className="top-2 right-2 absolute inline-flex shrink-0 rounded-full border-[1.35px] border-neutral-white h-[7.2px] w-[7.2px] bg-[#EF4444]" />
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