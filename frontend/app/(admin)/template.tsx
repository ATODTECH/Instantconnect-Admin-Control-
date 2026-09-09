"use client"
import FooterIndex from "@/components/footer"
import HeaderIndex from "@/components/header"
import LogoIndex from "@/components/logo"
import TopBarIndex from "@/components/topbar"
import { Calendar, FileText, LayoutDashboard, LogOutIcon, MessageCircle, Settings, Users, Wallet } from "lucide-react"

import profile from "@/assets/images/profile.jpg"


const Template = ({ children }: { children: React.ReactNode }) => {

  const headerIcons = [LayoutDashboard,Users,FileText,Calendar,MessageCircle,Wallet,Settings]
  
  return (
    <div className="flex min-w-5xl w-full h-screen">
      <aside className="flex gap-y-5 flex-col h-full px-5 py-8 w-65 bg-bg-primary">
        <LogoIndex />
        <HeaderIndex icons={headerIcons} />
        <FooterIndex icons={LogOutIcon} image={profile} />
      </aside>
      <div className="flex-1 relative flex flex-col justify-between gap-6 pl-8 pt-7 bg-bg-secondary">
        <TopBarIndex image={profile} />
        {children}
      </div>
    </div>
  )
}

export default Template