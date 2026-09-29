"use client"
import { useSignOut } from "@/hooks/use-auth"
import { LucideIcon } from "lucide-react"
import Image, { StaticImageData } from "next/image"

interface FooterProps {
  icons: LucideIcon
  image: StaticImageData
}

const FooterIndex = ({icons, image}: FooterProps) => {
  const footerIcon = {icon:icons}
  const { mutate: signOut, isPending } = useSignOut()

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
      <button
        type="button"
        onClick={() => signOut()}
        disabled={isPending}
        aria-label="Sign out"
        className="flex text-[#64748B] hover:text-red-600 cursor-pointer disabled:opacity-50"
      >
        <footerIcon.icon size={18} aria-hidden />
      </button>
    </footer>
  )
}

export default FooterIndex