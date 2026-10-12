import Image from "next/image"
import Logo from "@/assets/images/logo.png"

const LogoIndex = () => {
  return (
    <div className="flex h-fit gap-3 items-center mb-5">
      <Image
        src={Logo}
        alt="Logo"
        height={36}
        width={36}
        priority
        aria-label="logo"
        className="h-9 w-9 text-xs"
      />
      <p className="flex h-fit justify-between flex-col">
        <span className=" text-lg leading-[100%] tracking-wide font-semibold text-ic-light">InstantLinkUp</span>
        <span className=" text-[11px] font-medium uppercase text-ic-muted">Admin Console</span>
      </p>
    </div>
  )
}

export default LogoIndex