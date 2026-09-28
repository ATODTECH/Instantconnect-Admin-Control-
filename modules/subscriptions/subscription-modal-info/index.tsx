import { AVATAR_COLORS } from "@/modules/live-connection";
import { CircleXIcon } from "lucide-react";
import Image from "next/image";
import { fmtDate } from "..";

interface SubscriptionModalInfoProps {
  user: SubscriptionRow;
  modal: (val: boolean) => void;
}


const paymentHistory: PaymentHistoryItem[] = [
  { date: "Jul 01, 2023", amount: "₦15,000", status: "success" },
  { date: "Jun 01, 2023", amount: "₦15,000", status: "success" },
  { date: "May 01, 2023", amount: "₦15,000", status: "success" },
  { date: "Apr 01, 2023", amount: "₦15,000", status: "failed", note: "Retry attempted" },
  { date: "Mar 01, 2023", amount: "₦15,000", status: "success" },
]

function StatusPill({ status }: { status: PaymentStatus }) {
  const isSuccess = status === "success";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
        isSuccess ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isSuccess ? "bg-emerald-500" : "bg-rose-500"
        }`}
      />
      {isSuccess ? "Success" : "Failed"}
    </span>
  )
}

const SubscriptionModalIndex = ({user, modal}: SubscriptionModalInfoProps) => {

  const initials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  }


  return (
    <div className="relative flex flex-col ml-auto h-full w-full max-w-105 bg-neutral-0 shadow-[-20px_0px_60px_#00000026] bg-neutral-white" onClick={(e)=>e.stopPropagation()} >
      <div className="flex items-center justify-between gap-4 text-neutral-light-600 text-lg font-bold pt-7.25 pb-5.25 px-6 border-b border-b-primary-border">
        <h2>Subscription Details</h2>
        <button className=" h-8 w-8 bg-[#F4F3F5] rounded-full cursor-pointer" onClick={()=>modal(false)}>
          <CircleXIcon size={12} className=" h-3 w-3 text-neutral-light-300 mx-auto" />
        </button>
      </div>
      <div className="flex flex-col px-6 py-5.25 scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto gap-5.25">
        {/* base */}
        <div className=" pb-8.25 pt-3 flex items-center gap-3 border-b-[.5px] border-b-[#F4F3F5]">
          <div className="relative">
            {(user.avatar.length>0)?
              <Image
                src={user.avatar}
                alt={user.name}
                draggable={false}
                className="w-16 h-16 rounded-full object-cover"
              /> :
              <span className={`inline-flex items-center justify-center shrink-0 w-20 h-20 rounded-full text-2xl font-extrabold ${
                AVATAR_COLORS[2 % AVATAR_COLORS.length]
              }`}>{initials(user.name)}</span>
            }
          </div>
          <div className="flex flex-col text-neutral-light-300 font-normal">
            <p className="text-xl font-bold text-neutral-light-600">
              {user.name}
            </p>
            <p className="text-sm">{user.email}</p>
            <p className=" flex items-center text-[11px]">
              {user.phoneNumber}&nbsp;<span className=" shrink-0 w-1 h-1 bg-neutral-light-300 rounded-full inline-flex mx-1" />&nbsp;Member&nbsp;since&nbsp;{fmtDate(user.startDate)}
            </p>
          </div>
        </div>
        <div className=" pb-5.25 flex flex-col items-start gap-3 border-b-[.5px] border-b-[#F4F3F5]">
          {/* Current Plan */}
          <div className="flex flex-col gap-4 rounded-2xl bg-bg-purple-light-200 border border-[#F3E8FF] w-full p-4 relative">
            <div className="flex justify-between items-center gap-4">
              <div className="">
                <p className="text-xs font-semibold text-purple-light-600 uppercase">Current Plan</p>
                <p className="mt-1 text-xl font-extrabold text-neutral-light-600">
                  {user.subscriptionPlan}
                </p>
              </div>
              {user.isPro && (
                <span className=" rounded-full bg-violet-600 px-2.5 py-1 text-[11px] font-bold text-neutral-white bg-[linear-gradient(308.91deg,#FB923C_-14.83%,#F67B58_-0.69%,#F05E7E_17.87%,#EC4899_31.57%,#CE41B5_56.42%,#A136DD_96.49%,#9333EA_106.56%)]">
                  PRO
                </span>
              )}
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-[11px] font-normal text-neutral-light-400 uppercase">Price</p>
                <p className="mt-1 text-[15px] font-bold text-neutral-light-600">
                  ₦{user.amount} / month
                </p>
              </div>
              <div>
                <p className="text-[11px] font-normal text-neutral-light-400 uppercase">Billing cycle</p>
                <p className="mt-1 text-[15px] font-semibold text-neutral-light-600">
                  Monthly
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" pb-5.25 flex flex-col items-start gap-3 border-b-[.5px] border-b-[#F4F3F5]">
          {/* Payment Method */}
          <div className="flex flex-col gap-3 w-full">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-light-400">
              Payment method
            </p>
            <div className="flex items-center gap-4 justify-between rounded-lg border border-[#E5E7EB] p-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-11 items-center justify-center rounded-sm bg-neutral-light-600 text-[11px] whitespace-nowrap font-black italic text-neutral-white">
                  {user.paymentMethod}
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-light-500">
                    {user.paymentMethod} ending in {(user.paymentCardPin!==0)&&user.paymentCardPin}
                  </p>
                  <p className="text-xs tracking-wide text-neutral-light-300 font-normal">Expiry: 09/28</p>
                </div>
              </div>
              <button className="text-[13px] font-semibold text-purple-light-600  cursor-pointer outline-none" onClick={()=> alert("coming soon!")}>
                Change
              </button>
            </div>
          </div>
        </div>
        <div className=" pb-5.25 flex flex-col items-start gap-3">
          {/* Billing Summary */}
          <div className="flex flex-col w-full gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-light-400">
              Billing Summary
            </p>
            <div className="flex flex-col bg-[#F9FAFB] divide-y divide-neutral-100">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-[13px] font-normal text-neutral-light-400">Next billing date</p>
                <p className="text-[13px] font-semibold text-neutral-light-600">
                  Aug 01, 2023
                </p>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-[13px] font-normal text-neutral-light-400">Last payment</p>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-neutral-light-600">
                    ₦15,000
                  </p>
                  <span className=" text-secondary-green-500 text-[11px] font-semibold px-1.5 py-0.5 rounded-sm">Success</span>
                  {/* <StatusPill status="success" /> */}
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 bg-bg-purple-light-200">
                <p className="text-[13px] font-normal text-neutral-light-400">Total paid to date</p>
                <p className="text-sm font-bold text-neutral-light-600">
                  ₦165,000{" "}
                  <span className="font-normal text-neutral-light-400 text-xs">
                    (11 months)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-8.25 flex flex-col items-start gap-3">
          {/* Payment History */}
          <div className="flex flex-col gap-3 w-full">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-light-400">
              Payment history
            </p>
            <div className="space-y-3">
              {paymentHistory.map((item) => (
                <div
                  key={item.date}
                  className="flex items-center gap-3 justify-between"
                >
                  <div>
                    <p className="text-[13px] font-normal text-neutral-light-600">{item.date}</p>
                    {item.note && (
                      <p className="text-[10px] font-semibold text-purple-light-600">
                        {item.note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-[13px] font-semibold ${
                        item.status === "failed"
                          ? "text-neutral-light-300"
                          : "text-neutral-light-600"
                      }`}
                    >
                      {item.amount}
                    </p>
                    <StatusPill status={item.status} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 tracking-wide w-full text-center text-[13px] font-semibold text-purple-light-600 cursor-pointer" onClick={()=> alert("coming soon!")}>
              View full history
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 w-full mt-6 px-6">
            <button className="flex-1 rounded-lg border hover:border-purple-light-600 py-3 text-sm font-semibold border-neutral-light-400 text-neutral-light-400 hover:text-purple-light-600 cursor-pointer" onClick={()=> alert("coming soon!")}>
              Change Plan
            </button>
            <button className="flex-1 rounded-lg border hover:border-purple-light-600 hover:text-purple-light-600 py-3 text-sm font-semibold text-neutral-light-400 border-neutral-light-400 cursor-pointer" onClick={()=> alert("coming soon!")}>
              Refund Last
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SubscriptionModalIndex