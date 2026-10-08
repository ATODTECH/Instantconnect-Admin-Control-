"use client"
import { LucideIcon } from "lucide-react"
import LiveConnections from "@/icons/live-users.icon"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { usePathname } from "next/navigation"

interface HeaderProps {
  icons: LucideIcon[]
}

const HeaderIndex = ({icons}: HeaderProps) => {
  const [LayoutDashboard,Users,FileText,Calendar,MessageCircle,Flag,Wallet,Settings] = icons
  const route = [
    {name:"Dashboard", route:ROUTES.overview, icon:LayoutDashboard},
    {name:"User", route:ROUTES.users, icon:Users},
    {name:"KYC Verifications", route:ROUTES.kycVerification, icon:FileText},
    {name:"Live Connections", route:ROUTES.liveConnection, icon:LiveConnections},
    {name:"Events", route:ROUTES.events, icon:Calendar},
    {name:"Communities", route:ROUTES.communities, icon:MessageCircle},
    {name:"Reports", route:ROUTES.reports, icon:Flag},
    {name:"Subscriptions", route:ROUTES.subscriptions, icon:Wallet},
    {name:"Platform Settings", route:ROUTES.settings, icon:Settings},
  ]
  const pathname = usePathname()

  

  return (
    <header className="flex flex-col gap-0.5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#1E293B] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-ic-muted [&::-webkit-scrollbar-track]:bg-[#1E293B] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full ">
      {
        route.map((route, index) => (
          <Link 
            key={route.name} 
            href={route.route}
            className={`flex gap-3 py-2.25 px-3.25 mr-1 items-center rounded-lg outline-none ring-0 ${pathname===route.route?'bg-[#1E293B] text-ic-light':'text-ic-muted'}`}
          >
            {(index===3)? 
            <route.icon 
              color={`${pathname===route.route? '#9333EA': '#94A3B8'}`} 
              className={"h-5 w-5"} />:<route.icon size={20} 
              className={` ${pathname===route.route? ' text-purple-light-600': ''}`} 
            />}
            <span className={"inline-flex justify-between w-full font-medium text-sm"}>
              {route.name}
              {(pathname===route.route) && (
                <span className="inline-flex space-y-1 w-1 rounded-lg bg-purple-light-600" />
              )}
            </span>
          </Link>
        ))
      }
    </header>
  )
}

export default HeaderIndex