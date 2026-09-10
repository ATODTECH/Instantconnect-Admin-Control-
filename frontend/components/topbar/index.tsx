"use client"

import { Bell, Search } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { usePathname } from "next/navigation"
import { createContext, useContext, useState } from "react";

interface TopBarProps {
  image: StaticImageData,
  setModal: () => void,
  contentModal: (val: React.ReactNode) => void,
  children: React.ReactNode
}

export interface QueryContextType {
  query: string,
  setModal: () => void,
  contentModal: (val: React.ReactNode) => void,
}
export const QueryContext = createContext<QueryContextType | undefined>(undefined)

const TopBarIndex = ({image, setModal, contentModal, children}: TopBarProps) => {
  const [query, setQuery] = useState("")
  const pathname = usePathname()

  const nav = [
    {title:"Dashboard", content:"Welcome back, Admin. InstantConnect overview and quick metrics."},
    {title:"User Management", content:"Manage platform members, KYC verification records, and billing tiers"},
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
            <form className=" relative">
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm" />
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
            <form className=" relative">
              <Search size={16} className="absolute left-2 translate-y-[65%] h-4 w-4 text-[#64748B]" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}  placeholder="Search users, events..." className=" py-1.5 pl-8 text-[#1d293d] rounded-lg border border-[#E4E7EC] placeholder:text-[#64748B] focus:outline-[#64748B] focus:outline-1 focus:border-none placeholder:text-sm" />
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
          <div className=" relative bg-neutral-white rounded-lg border border-[#E4E7EC] p-2">
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