import { Calendar, CircleXIcon, Clock, MapPin } from "lucide-react";
import { fmtDate, fmtRevenue, StatusBadge } from "..";
import { AVATAR_COLORS } from "@/modules/live-connection";
import Image from "next/image";
import Link from "next/link";

interface EventsModalInfoProps {
  person: EventRow;
  modal: (val: boolean) => void;
}


//  ..........Generated MOCK Data from the below ...............

const ATTENDEES = [
  {name: "Olamide Samuel", portfolio: "Senior Backend Engineer at Paystack", avatar: "", status: "VIP"},
  {name: "Chioma Adebayo", portfolio: "Technical Product Manager at Kuda", avatar: "", status: "Regular"},
  {name: "Tunde Fila", portfolio: "Founder at Speak for Child", avatar: "", status: "Regular"},
  {name: "Amina Yusuf", portfolio: "Venture Capital Analyst", avatar: "", status: "Regular"},
  {name: "Emeka Oji", portfolio: "Senior Virtual Assistant at KiddiEdu", avatar: "", status: "Regular"},
  {name: "Kemi Adeosun", portfolio: "Minister of Finance", avatar: "", status: "VIP"},
  {name: "Zainab Bello", portfolio: "First Daughter, Dangote Group", avatar: "", status: "VIP"},
  {name: "Femi Adeyemi", portfolio: "Chairman AMAC", avatar: "", status: "VIP"},
]


function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
const rand = mulberry32(42)

function generateEvents(count: number): AttendeeEventRow[] {
  const rows: AttendeeEventRow[] = [];

  for (let i = 0; i < count; i++) {
    const attendee = ATTENDEES[Math.floor(rand() * ATTENDEES.length)];
    const status: 'VIP'|'Regular' = rand() > 0.4 ? "VIP" : "Regular";

    rows.push({
      id: `atd-${i + 1}`,
      name: attendee.name,
      avatar: attendee.avatar,
      status,
    })
  }

  return rows
}

// .................... End mock data ....................



const EventModalIndex = ({person, modal}: EventsModalInfoProps) => {

  const translater = (index: number) => {
    const arr = [
      "translate-x-0",
      "translate-x-5",
      "translate-x-10",
      "translate-x-15",
      "translate-x-20",
      "translate-x-25",
    ]
    return arr[index]
  }

  const initials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  const percentCalc = (attendee: number, ticket: number) => {
    return Math.round((attendee/(ticket+attendee)) * 100)
  }

  return (
    <div className="relative flex flex-col ml-auto h-full w-full max-w-105 bg-neutral-0 shadow-[-20px_0px_60px_#00000026] bg-neutral-white" onClick={(e)=>e.stopPropagation()} >
      <div className="flex items-center justify-between gap-4 text-neutral-light-600 text-lg font-bold pt-7.25 pb-5.25 px-6 border-b border-b-primary-border">
        <h3>Document Review</h3>
        <button className=" h-8 w-8 bg-[#F4F3F5] rounded-full cursor-pointer" onClick={()=>modal(false)}>
          <CircleXIcon size={12} className=" h-3 w-3 text-neutral-light-300 mx-auto" />
        </button>
      </div>
      <div className="flex flex-col gap-y-7 px-6 py-5.25 scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto gap-5">
        <div className=" flex flex-col gap-5">
          <div className="flex justify-between items-center gap-4">
            <h2 className=" text-neutral-light-600 text-2xl font-bold">{person.name}</h2>
            <span className=" text-secondary-green-500 text-xs font-semibold">
              <StatusBadge status={person.status} />
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className=" flex items-center text-neutral-light-500 gap-3">
              <Calendar size={16} className=" h-4 w-4 text-neutral-light-300" />
              <span className="font-semibold text-sm">{fmtDate(person.eventDate)}</span>
            </div>
            <div className=" flex items-center text-neutral-light-500 gap-3">
              <Clock size={16} className=" h-4 w-4 text-neutral-light-300" />
              <span className="font-medium text-sm">10:00 AM - 5:00 PM</span>
            </div>
            <div className=" flex items-center text-neutral-light-500 gap-3">
              <MapPin size={16} className=" h-4 w-4 text-neutral-light-300" />
              <span className="font-medium text-sm">Landmark Event Centre, Lagos</span>
            </div>
            <div className="flex items-center gap-3 mb-5 mt-3">
              <span className=" text-purple-light-600 font-semibold text-xs py-1 px-2.5 rounded-md bg-[#F3E8FF]">{person.type} Event</span>
              <div className=" text-purple-light-600 text-sm font-bold">{fmtRevenue(person.priceTag)}<span className="text-neutral-light-300 font-normal"> per ticket</span></div>
            </div>
            <div className="border-y-[.5px] py-5 border-y-[#F4F3F5]">
              <div className="flex justify-between items-center gap-4 border border-[#F4F3F5] p-4 rounded-xl">
                <div className="flex gap-2">
                  <div className="relative">
                    {(person.avatar.length>0)?
                      <Image
                        src={person.avatar}
                        alt={person.name}
                        draggable={false}
                        className="w-11 h-11 rounded-full object-cover"
                      /> :
                      <span className={`inline-flex items-center justify-center shrink-0 w-11 h-11 rounded-full ${
                        AVATAR_COLORS[person.attendees % AVATAR_COLORS.length]
                      }`}>{initials(person.createdBy)}</span>
                    }
                  </div>
                  <div className="flex flex-col text-start">
                    <span className=" text-neutral-light-600 font-bold text-sm">{person.createdBy}</span>
                    <span className=" text-xs text-neutral-light-300 font-normal">no-reply@example.com</span>
                  </div>
                </div>
                <div className="flex flex-col text-end font-semibold">
                  <span className="uppercase text-neutral-light-300 leading-none text-[11px]">Created on</span>
                  <span className=" text-neutral-light-600 text-[13px]">{fmtDate(person.dateCreated)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-b-[.5px] py-5 border-b-[#F4F3F5]">
              <h3 className=" text-neutral-light-600 font-semibold text-sm uppercase">Event Description</h3>
              <p className=" text-neutral-light-400 font-normal text-sm">
                The Lagos Tech Summit 2024 returns as West Africa's premium gathering for software engineers, product leaders, venture capitalists, and ecosystem operators. Join us for a full day of insightful keynotes, immersive panels, technical workshops, and high-value networking sessions tailored to build the next frontier of digital transformation.
              </p>
            </div>
            <div className="flex flex-col gap-5 border-b-[.5px] py-5 border-b-[#F4F3F5]">
              <div className="flex items-center justify-between gap-4 ">
                <h3 className=" text-[#1F1D24] font-semibold text-base">Attendees ({person.attendees})</h3>
                <Link 
                href={''}
                className=" text-purple-light-600 text-[13px] font-normal cursor-pointer">
                  View All
                </Link>
              </div>
              <div className="flex relative items-center gap-5">
                <div className="flex relative min-w-30 h-full items-center">
                  {generateEvents(person.attendees).slice(0,6).map((attendee, index) => (
                    <div key={attendee.id} 
                    className="relative">
                      {(attendee.avatar.length>0)?
                        <Image
                          src={attendee.avatar}
                          alt={attendee.name}
                          draggable={false}
                          className={`w-8 h-8 rounded-full border-2 border-neutral-white object-cover select-none -translate-y-4 text-xs ${translater(index)}`}
                        /> :
                        <span className={`inline-flex absolute items-center justify-center shrink-0 w-8 h-8 border-2 border-neutral-white rounded-full select-none -translate-y-4 ${translater(index)} ${
                          AVATAR_COLORS[index % AVATAR_COLORS.length]
                        }`}>{initials(attendee.name)}</span>
                      }
                    </div>
                  ))}
                </div>
                {(person.attendees>6) && 
                  <span className="inline-flex relative font-medium text-sm text-neutral-light-300 select-none">+&nbsp;{person.attendees-6}</span>
                }
              </div>
              <div className="flex flex-col border-[.5px] border-[#E6E5EA] py-2 px-4 rounded-xl">
                {ATTENDEES.toReversed().slice(0,4).map((attendee, index) => (
                  <div key={`dis-${index}`} className="flex justify-between items-center gap-4 py-2.75 border-b-[.5px] border-b-[#F4F3F5]">
                    <div className="flex gap-3 items-center">
                      {(attendee.avatar.length>0)?
                        <Image
                          src={attendee.avatar}
                          alt={attendee.name}
                          draggable={false}
                          className="w-9 h-9 rounded-full  object-cover select-none text-xs"
                        /> :
                        <span className={`inline-flex items-center justify-center shrink-0 w-9 h-9 rounded-full select-none ${
                          AVATAR_COLORS[index % AVATAR_COLORS.length]
                        }`}>{initials(attendee.name)}</span>
                      }
                      <div className="flex flex-col">
                        <span className=" text-neutral-light-600 font-bold text-sm">{attendee.name}</span>
                        <span className=" text-neutral-light-300 text-xs font-normal">{attendee.portfolio}</span>
                      </div>
                    </div>
                    <div className=" text-end">
                      <span className={` py-1 px-2.5 rounded-md text-xs font-semibold ${attendee.status==='VIP'? ' text-purple-light-600 bg-[#F3E8FF]': ' text-neutral-light-400 bg-[#F4F3F5]'}`}>{attendee.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-5 border-b-[.5px] py-5 border-b-[#F4F3F5]  mb-5">
              <div className="flex flex-col p-5 rounded-xl bg-bg-purple-light-200 border-[.5px] border-[#F3E8FF]">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <h6 className=" text-purple-light-600 uppercase font-bold text-xs">Total Revenue</h6>
                    <span title={fmtRevenue(person.revenue)} className="wrap-break-word text-2xl font-extrabold text-[#5B21B6]">{fmtRevenue(person.revenue)}</span>
                  </div>
                  <div className="flex flex-col items-end text-[13px]">
                    {(person.type === "Paid") && (
                      <>
                        <div className="flex gap-1 items-center text-nowrap">
                          <span className="text-nowrap text-neutral-light-600 font-bold">{person.attendees} / {(person.ticket+person.attendees)}</span>
                          <span className=" text-neutral-light-300 font-normal">sold</span>
                        </div>
                        <div className=" bg-[#E9D5FF] rounded-full w-full max-w-21 overflow-hidden">
                          <div className={"relative h-2 bg-purple-light-600"} style={{width: percentCalc(person.attendees, person.ticket)}} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModalIndex