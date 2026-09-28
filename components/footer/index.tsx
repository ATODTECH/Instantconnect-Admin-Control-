import { LucideIcon } from "lucide-react"
import Image, { StaticImageData } from "next/image"

interface FooterProps {
  icons: LucideIcon
  image: StaticImageData
}

const FooterIndex = ({icons, image}: FooterProps) => {
  const footerIcon = {icon:icons}

  return (
    <footer className="flex items-center border-t border-t-[#1E293B] gap-3 pt-4">
      <Image
       src={image}
       alt="profile avatar"
       height={40}
       width={40}
       className="h-10 w-10 rounded-full object-cover overflow-hidden"
      />
      <div className="flex flex-col flex-1">
        <span className=" font-semibold text-sm text-primary">Kola Adebayo</span>
        <span className=" font-normal text-xs text-[#64748B]">Super Admin</span>
      </div>
      <footerIcon.icon role="button" size={18} className={" text-[#64748B] hover:text-red-600 cursor-pointer"} onClick={()=>alert("coming soon!")} />
    </footer>
  )
}

export default FooterIndex