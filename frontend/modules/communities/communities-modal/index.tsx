"use client"

import { AVATAR_COLORS } from "@/modules/live-connection";
import { Calendar, CircleXIcon, MessageSquare, UserPlus } from "lucide-react";
import Image from "next/image";
import { CategoryBadge, fmtDate, formatCompactNumber } from "..";
import { generateEvents } from "@/modules/events/events-modal-info";
import Link from "next/link";

interface CommunityModalInfoProps {
  community: CommunityRow;
  modal: (val: boolean) => void;
}

const CommunityModalIndex = ({ community, modal }: CommunityModalInfoProps) => {

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
      .toUpperCase()
  }

  return (
    <div className="relative flex flex-col ml-auto h-full w-full max-w-105 bg-neutral-0 shadow-[-20px_0px_60px_#00000026] bg-neutral-white" onClick={(e)=>e.stopPropagation()} >
      <div className="flex items-center justify-between gap-4 text-neutral-light-600 text-lg font-bold pt-7.25 pb-5.25 px-6 border-b border-b-primary-border">
        <h2>Community Details</h2>
        <button className=" h-8 w-8 bg-[#F4F3F5] rounded-full cursor-pointer" onClick={()=>modal(false)}>
          <CircleXIcon size={12} className=" h-3 w-3 text-neutral-light-300 mx-auto" />
        </button>
      </div>
      <div className="flex flex-col px-6 py-5.25 scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto gap-5.25">
        {/* base */}
        <div className=" pb-5.25 flex items-start gap-3 border-b-[.5px] border-b-[#F4F3F5]">
          <div className="">
            {(community.communityAvatar.length>0)?
              <Image
                src={community.communityAvatar}
                alt={community.communityName}
                draggable={false}
                className="w-16 h-16 rounded-2xl object-cover"
              /> :
              <span className={`inline-flex items-center justify-center shrink-0 w-16 h-16 rounded-2xl text-2xl font-extrabold ${
                AVATAR_COLORS[community.weeklyPost % AVATAR_COLORS.length]
              }`}>{community.communityName[0]}</span>
            }
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className=" text-base text-neutral-light-600 font-bold">{community.communityName}</h3>
              <CategoryBadge category={community.category} />
            </div>
            <div className=" text-neutral-light-400 font-semibold text-[13px]">
              Created by <span className="text-neutral-light-600">{community.createdBy}</span>
            </div>
            <div className=" text-xs text-neutral-light-400 font-normal">
              Date: <span className="text-neutral-light-300">{fmtDate(community.dateCreated)}</span>
            </div>
          </div>
        </div>
        <div className=" pb-5.25 border-b-[.5px] border-b-[#F4F3F5]">
          <div className="grid grid-cols-2 gap-5 ">
            <div className="flex flex-col h-full min-h-20.5 p-3 rounded-xl bg-[#FAF9FB] border border-primary-border gap-1">
              <span className=" uppercase text-neutral-light-300 text-[11px] font-semibold tracking-wide">Members</span>
              <span className=" text-xl font-bold text-neutral-light-600 tracking-wide">{formatCompactNumber(community.members)}</span>
              <span className=" text-[11px] font-medium text-secondary-green-500">+124 this week</span>
            </div>
            <div className="flex flex-col h-full min-h-20.5 p-3 rounded-xl bg-[#FAF9FB] border border-primary-border gap-1">
              <span className=" uppercase text-neutral-light-300 text-[11px] font-semibold tracking-wide">Posts This Week</span>
              <span className=" text-xl font-bold text-neutral-light-600 tracking-wide">{formatCompactNumber(community.weeklyPost)}</span>
              <span className=" text-[11px] font-medium text-purple-light-600">Active discussion</span>
            </div>
            <div className="flex flex-col h-full min-h-20.5 p-3 rounded-xl bg-[#FAF9FB] border border-primary-border gap-1">
              <span className=" uppercase text-neutral-light-300 text-[11px] font-semibold tracking-wide">Total Posts</span>
              <span className=" text-xl font-bold text-neutral-light-600 tracking-wide">{formatCompactNumber(community.totalPost)}</span>
            </div>
            <div className="flex flex-col h-full min-h-20.5 p-3 rounded-xl bg-[#FAF9FB] border border-primary-border gap-1">
              <span className=" uppercase text-neutral-light-300 text-[11px] font-semibold tracking-wide">Reports</span>
              <span className=" text-xl font-bold text-neutral-light-600 tracking-wide">2</span>
              <span className=" text-[11px] font-medium text-[#C92B2B]">Requires audit</span>
            </div>
          </div>
        </div>
        <div className=" pb-5.25 border-b-[.5px] border-b-[#F4F3F5]">
          <h3 className=" text-sm text-neutral-light-600 font-bold mb-2">About Community</h3>
          <p className=" leading-5 text-[13px] text-neutral-light-400 font-normal">
            {community.about}
          </p>
        </div>
        <div className=" pb-5.25 border-b-[.5px] border-b-[#F4F3F5]">
          <h3 className=" text-sm text-neutral-light-600 font-bold mb-4">Community Rules</h3>
          <div className=" flex flex-col gap-2.5 text-[13px] leading-4.5 text-neutral-light-400 font-normal">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-6 w-6 rounded-lg items-center justify-center bg-bg-purple-light-200 text-purple-light-600 shrink-0 font-bold text-xs">1</span>
              <p className="">
                Keep discussions engineering and tech-focused. No politics or irrelevant topics.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex h-6 w-6 rounded-lg items-center justify-center bg-bg-purple-light-200 text-purple-light-600 shrink-0 font-bold text-xs">2</span>
              <p className="">
                Be highly collaborative and respectful. Mutual growth is our focal mission.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex h-6 w-6 rounded-lg items-center justify-center bg-bg-purple-light-200 text-purple-light-600 shrink-0 font-bold text-xs">3</span>
              <p className="">
                No spam, recruitment scams, or self-promoting solicitations.
              </p>
            </div>
          </div>
          <div className=" pt-6.25">
            <h3 className="text-sm text-neutral-light-600 font-bold mb-4">Recent Activity</h3>
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-3">
                <div className="flex justify-center items-center rounded-full h-7 w-7 bg-[#F4F3F5]">
                  <UserPlus size={14} className="h-3.5 w-3.5 text-neutral-light-300" />
                </div>
                <div className="flex flex-col">
                  <span className=" text-neutral-light-600 text-[13px] font-medium">Kolawole J. joined the community</span>
                  <span className=" text-[11px] font-normal text-secondary">2 hours ago</span>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="flex justify-center items-center rounded-full h-7 w-7 bg-[#F4F3F5]">
                  <MessageSquare size={14} className="h-3.5 w-3.5 text-neutral-light-300" />
                </div>
                <div className="flex flex-col">
                  <span className=" text-neutral-light-600 text-[13px] font-medium">New discussion: 'React Native vs Flutter in 2026' by Tunde</span>
                  <span className=" text-[11px] font-normal text-secondary">4 hours ago</span>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <div className="flex justify-center items-center rounded-full h-7 w-7 bg-[#F4F3F5]">
                  <Calendar size={14} className="h-3.5 w-3.5 text-neutral-light-300" />
                </div>
                <div className="flex flex-col">
                  <span className=" text-neutral-light-600 text-[13px] font-medium">Amina Y. created 'AI Builders Mixer' event</span>
                  <span className=" text-[11px] font-normal text-secondary">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-y-4 pb-5.25 border-b-[.5px] border-b-[#F4F3F5]">
          <div className="flex justify-between items-center gap-4">
            <h2 className=" text-base font-semibold text-[#1F1D24]">Members ({community.members})</h2>
            <Link 
            href={''}
            className=" text-purple-light-600 text-[13px] font-normal cursor-pointer">
              View All Members
            </Link>
          </div>
          <div className="flex relative items-center gap-5">
            <div className="flex relative min-w-30 h-full items-center">
              {/* gotten from event modal */}
              {generateEvents(community.members).slice(0,6).map((attendee, index) => (
                <div key={attendee.id} 
                className="relative">
                  {(attendee.avatar.length>0)?
                    <Image
                      src={attendee.avatar}
                      alt={attendee.name}
                      draggable={false}
                      className={`w-8 h-8 rounded-full border-2 text-[10px] border-neutral-white object-cover select-none -translate-y-4 ${translater(index)}`}
                    /> :
                    <span className={`inline-flex absolute text-[10px] items-center justify-center shrink-0 w-8 h-8 border-2 border-neutral-white rounded-full select-none -translate-y-4 ${translater(index)} ${
                      AVATAR_COLORS[index % AVATAR_COLORS.length]
                    }`}>{initials(attendee.name)}</span>
                  }
                </div>
              ))}
            </div>
            {(community.members>6) && 
              <span className="inline-flex relative font-medium text-sm text-neutral-light-300 select-none">+{community.members-6}&nbsp;more</span>
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default CommunityModalIndex