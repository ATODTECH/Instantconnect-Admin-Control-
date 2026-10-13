import Image from "next/image"
import { Metadata, NextPage } from "next"
import WorldGlobe from "@/assets/images/world-globe.gif"
import { LogoMark } from "@/components/brand/logo-mark"
import LoginForm from "./_component/LoginForm"

export const metadata: Metadata = {
  title: "Login - InstantLinkUp",
  description: "Sign in to the InstantLinkUp admin console.",
}

const Login: NextPage = () => {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden bg-bg-primary lg:block lg:w-1/2">
        <Image
          src={WorldGlobe}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10" title="" />
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight text-white">InstantLinkUp</span>
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/60">Admin Console</span>
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight text-white">
              Welcome <span className="bg-brand-gradient bg-clip-text text-transparent">back.</span>
            </h2>
            <p className="mt-3 max-w-sm text-base text-white/70">
              A secure, central place to manage members, verifications, events and communities.
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center bg-[#FBFBFD] px-8 py-12 sm:px-12 lg:w-1/2 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <LogoMark className="h-12 w-12" title="" />
            <h1 className="text-2xl font-bold text-brand">InstantLinkUp</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login
