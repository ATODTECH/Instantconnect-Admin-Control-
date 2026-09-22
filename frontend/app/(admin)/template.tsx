"use client"
import FooterIndex from "@/components/footer"
import HeaderIndex from "@/components/header"
import LogoIndex from "@/components/logo"
import TopBarIndex from "@/components/topbar"
import { Calendar, FileText, LayoutDashboard, LogOutIcon, MessageCircle, Settings, Users, Wallet } from "lucide-react"

import profile from "@/assets/images/profile.jpg"
import { useEffect, useState } from "react"
import ModalIndex from "../_lib/ui/modal"
import { useRouter } from "next/navigation"


const Template = ({ children }: { children: React.ReactNode }) => {
  const [isModal, setModal] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<React.ReactNode>([])

  const headerIcons = [LayoutDashboard,Users,FileText,Calendar,MessageCircle,Wallet,Settings] 

  // for test
  const [isView, setView] = useState(false)
  const router = useRouter()
  useEffect(() => {
    let role = localStorage.getItem('roleTest')
    if (role) {setView(true)}
    else { router.replace('/login') }
  }, [])

  if (isView === false) return (<></>);
  // end for test

  return (
    <div className="flex relative min-w-5xl w-full h-screen">
      {isModal && (<>
        <ModalIndex modal={(val)=>setModal(val)} content={modalContent} />
      </>)}
      <aside className="flex gap-y-5 flex-col h-full px-5 py-8 w-65 bg-bg-primary">
        <LogoIndex />
        <HeaderIndex icons={headerIcons} />
        <FooterIndex icons={LogOutIcon} image={profile} />
      </aside>
      <div className="flex-1 w-[calc(100vw-16.25rem)] relative flex flex-col justify-between gap-6 pl-8 pt-7 bg-bg-secondary">
        <TopBarIndex contentModal={(val) => setModalContent(val)} setModal={(val: boolean) => {setModal(val)}} image={profile}>
          {children}
        </TopBarIndex>
      </div>
    </div>
  )
}

export default Template