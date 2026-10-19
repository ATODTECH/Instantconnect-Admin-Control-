import { LogoMark } from "@/components/brand/logo-mark"

const LogoIndex = () => {
  return (
    <div className="flex h-fit gap-3 items-center mb-5">
      <LogoMark variant="tile" className="h-9 w-9 shrink-0" />
      <p className="flex h-fit justify-between flex-col">
        <span className=" text-lg leading-[100%] tracking-wide font-semibold text-ic-light">InstantLinkUp</span>
        <span className=" text-[11px] font-medium uppercase text-ic-muted">Admin Console</span>
      </p>
    </div>
  )
}

export default LogoIndex