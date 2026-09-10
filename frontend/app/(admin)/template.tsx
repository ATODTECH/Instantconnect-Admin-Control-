"use client"
import FooterIndex from "@/components/footer"
import HeaderIndex from "@/components/header"
import LogoIndex from "@/components/logo"
import TopBarIndex from "@/components/topbar"
import { Calendar, FileText, LayoutDashboard, LogOutIcon, MessageCircle, Settings, Users, Wallet } from "lucide-react"

import profile from "@/assets/images/profile.jpg"
import { MouseEventHandler, useState } from "react"


const Template = ({ children }: { children: React.ReactNode }) => {
  const [isModal, setModal] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>([]);

  const headerIcons = [LayoutDashboard,Users,FileText,Calendar,MessageCircle,Wallet,Settings]
  const closeOutterModal: MouseEventHandler = () => setModal(false);

  
  return (
    <div className="flex relative min-w-5xl w-full h-screen">
      {isModal && (<>
        <div role='button' className="flex absolute z-20 h-screen w-full bg-[#00000080] " 
        onClick={closeOutterModal}>
          {modalContent}
        </div>
      </>)}
      <aside className="flex gap-y-5 flex-col h-full px-5 py-8 w-65 bg-bg-primary">
        <LogoIndex />
        <HeaderIndex icons={headerIcons} />
        <FooterIndex icons={LogOutIcon} image={profile} />
      </aside>
      <div className="flex-1 relative flex flex-col justify-between gap-6 pl-8 pt-7 bg-bg-secondary">
        <TopBarIndex contentModal={(val) => setModalContent(val)} setModal={() => setModal(true)} image={profile}>
          {children}
        </TopBarIndex>
      </div>
    </div>
  )
}

export default Template