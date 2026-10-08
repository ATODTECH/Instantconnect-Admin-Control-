"use client"
import FooterIndex from "@/components/footer"
import HeaderIndex from "@/components/header"
import LogoIndex from "@/components/logo"
import TopBarIndex from "@/components/topbar"
import { Calendar, FileText, Flag, LayoutDashboard, MessageCircle, Settings, Users, Wallet } from "lucide-react"

const HEADER_ICONS = [LayoutDashboard, Users, FileText, Calendar, MessageCircle, Flag, Wallet, Settings]

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex relative min-w-5xl w-full h-screen">
      <aside className="flex gap-y-5 flex-col h-full px-5 py-8 w-65 bg-bg-primary">
        <LogoIndex />
        <HeaderIndex icons={HEADER_ICONS} />
        <FooterIndex />
      </aside>
      <div className="flex-1 w-[calc(100vw-16.25rem)] relative flex flex-col justify-between gap-6 pl-8 pt-7 bg-bg-secondary">
        <TopBarIndex>{children}</TopBarIndex>
      </div>
    </div>
  )
}

export default DashboardLayout
