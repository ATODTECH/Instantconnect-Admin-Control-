"use client"
import { UserAvatar } from "@/components/shared/user-avatar"
import { useState } from "react"
import GridCard from "./gridcard"
import { AlertTriangle, ArrowLeft, ArrowLeftCircle, CheckCircleIcon, CircleCheck, CircleCheckBigIcon, Clock, MapPin } from "lucide-react"
import GoogleMapIndex from "./google-maps"

// API DATA
const LiveConnectUsers: LiveConnectUsersProps[] = [
  {
    id: 1,
    firstRecipient: {
      id: 15,
      name: "Halima Lawal",
      image:"",
      coordinates: {
        lat: 6.4300,
        lng: 3.4220,
      },
      departure: "2:20 PM",
    },
    secondRecipient: {
      id: 24,
      name: "Chidi Okonkwo",
      image:"",
      coordinates: {
        lat: 6.4494,
        lng: 3.4811,
      },
      departure: "2:22 PM",
    },
    acceptConnect: "2:15 PM",
    location: "Café Neo, Victoria Island",
    meetingType: "Coffee Meetup",
    coordinates: {
      lat: 6.42816,
      lng: 3.41897,
    },
    safetyAlert: false,
    meetingStartTime: "2:30 PM",
    meetingEndTime: "",
    status: "active"
  },
  {
    id: 2,
    firstRecipient: {
      id: 11,
      name: "Blessing Orija",
      image:"",
      coordinates: {
        lat: 6.42816,
        lng: 3.41897,
      },
      departure: "2:20 PM",
    },
    secondRecipient: {
      id: 22,
      name: "Ibrahim Musa",
      image:"",
      coordinates: {
        lat: 6.46153,
        lng: 3.45681,
      },
      departure: "2:22 PM",
    },
    acceptConnect: "2:15 PM",
    location: "Lagos Oriental Hotel, Victoria Island",
    meetingType: "Coffee Meetup",
    coordinates: {
      lat: 6.43627,
      lng: 3.44463,
    },
    safetyAlert: false,
    meetingStartTime: "2:30 PM",
    meetingEndTime: "",
    status: "active"
  },
  {
    id: 3,
    firstRecipient: {
      id: 100,
      name: "Ngozi Ugu",
      image:"",
      coordinates: {
        lat: 39.96222,
        lng: -82.99750,
      },
      departure: "2:20 PM",
    },
    secondRecipient: {
      id: 34,
      name: "Don Blaq",
      image:"",
      coordinates: {
        lat: 39.96222,
        lng: -82.99750,
      },
      departure: "2:22 PM",
    },
    acceptConnect: "2:15 PM",
    location: "Trinity's Lounge, Columbus",
    meetingType: "Business Chat",
    coordinates: {
      lat: 39.96222,
      lng: -82.99750,
    },
    safetyAlert: false,
    meetingStartTime: "2:30 PM",
    meetingEndTime: "5:03 PM",
    status: "completed"
  },
]


const calcAcceptedConnection = () => {
  // AM / PM
  // return {
  //   connectAccept: '2:15 PM',
  //   firstRecipient: '2:20 PM',
  //   secondRecipient: '2:22 PM',
  // }
}
const calcMeetingDuration = (title: string) => {
  // calculate time from the meetingStartTime to CurrentTime (if no EndTime) or to EndTime
  switch (title) {
    case 'connectCard':
      return '45 min'
    default:
      return '--'
  }
}
const calcDistanceApart = (firstUser:UserCoordinates, secondUser: UserCoordinates) => {
  // firstRecipient distance from that of secondRecipient's
  return '0.2 km'
}

const LiveConnectionHomeIndex = () => {
  const [active, setActive] = useState<activeToggle>('ongoing')
  const [isSwitch, setSwitch] = useState<boolean>(false)
  const [switchVal, setSwitchVal] = useState<number>(1)
  const activeUser = LiveConnectUsers.filter(val => val.status==='active')
  const pastConnectionUser = LiveConnectUsers.filter(val => val.status!=='active')


  const intialsConnectionCard = (name: string) => {
    const val = name.split(" ")[1][0]
    return name
      .split(" ")[0]
      .concat(" ", val, ".")
  }

  const ConnectionCard = ({user, index}: ConnectionCardProps) => {
    return (
      <>
        <div className="flex flex-col justify-between items-center gap-3 border-[.5px] border-[#F1F5F9] bg-neutral-white shadow-[0px_0px_10px_0px_#0000000F] p-4 rounded-xl">
          <div className="flex items-center justify-between w-full">
            <div className="relative">
              <UserAvatar name={user.firstRecipient.name} src={user.firstRecipient.image || null} className="size-8 text-xs border-2 border-neutral-white" />
              <UserAvatar name={user.secondRecipient.name} src={user.secondRecipient.image || null} className="size-8 absolute text-xs -right-5 border-2 border-neutral-white" />
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${active==='ongoing'? 'text-secondary-green-500': 'text-neutral-light-300'}`}>
              <span className={`inline-flex shrink-0 h-1.5 w-1.5 rounded-full ${active==='ongoing'? 'bg-secondary-green-500': 'bg-neutral-light-300'}`} />
              <span>{calcMeetingDuration('connectCard')}</span>
            </div>
          </div>

          {/* firstName + initials */}
          <div className=" w-full text-sm text-neutral-light-600 font-semibold">{intialsConnectionCard(user.firstRecipient.name)} & {intialsConnectionCard(user.secondRecipient.name)}</div>

          {/* location and timeStart */}
          <div className="flex items-center gap-2 text-neutral-light-300 w-full">
            <div className="flex items-center gap-1">
              <MapPin size={11} className="h-2.75 w-2.75" />
              <span className=" font-normal text-xs">{user.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={11} className="h-2.75 w-2.75" />
              <span className=" font-normal text-xs">{user.meetingStartTime}</span>
            </div>
          </div>

          {/* Track */}
          <div className="flex w-full items-center justify-between gap-4">
            <div className="w-full max-w-[60%] h-0 border border-[#F1F5F9]" />
            <button className="py-1.5 px-3.5 rounded-lg bg-bg-purple-light-200 text-xs font-semibold tracking-wide cursor-pointer text-purple-light-600 outline-0" onClick={()=>{setSwitch(!isSwitch); setSwitchVal(user.id)}}>
              Track
            </button>
          </div>
        </div>
      </>
    )  
  }
  const SingleConnectionCard = ({user}: ConnectionCardProps) => {
    return (
      <>
        <div className="grid grid-cols-3 gap-1 border border-[#F4F3F5] bg-[#F1F5F8] p-4 rounded-xl">
          <div className="flex flex-col gap-2 items-center justify-center">
            <UserAvatar name={user.firstRecipient.name} src={user.firstRecipient.image || null} className="size-12 text-lg" />
            <span className=" font-semibold text-xs text-neutral-light-600 w-full truncate cursor-default" title={user.firstRecipient.name}>{user.firstRecipient.name}</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            {
              user.meetingEndTime.length>0?
              <></>:
              <>
                <CircleCheckBigIcon size={16} className="h-4 w-4 text-secondary-green-500" />
                <span className="py-0.5 px-1.5 bg-[#DCFCE7] rounded-sm text-[.625rem] text-secondary-green-500">Connected</span>
              </>
            }
          </div>
          <div className="flex flex-col gap-2 items-center justify-center w-full">
            <UserAvatar name={user.secondRecipient.name} src={user.secondRecipient.image || null} className="size-12 text-lg" />
            <span className=" font-semibold text-xs text-neutral-light-600 w-full truncate cursor-default" title={user.secondRecipient.name}>{user.secondRecipient.name}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 border-b border-b-[#F4F3F5] pb-4">
          <h5 className=" text-neutral-light-300 font-semibold text-xs uppercase">Meeting Information</h5>
          <div className="flex flex-col gap-1.5 text-[13px] font-normal text-neutral-light-300">
            <p className="flex justify-between gap-3 ">
              <span className="">Location</span><span className=" text-neutral-light-600 font-medium text-end">{user.location}</span>
            </p>
            <p className="flex justify-between gap-3 ">
              <span className="">Meeting Type</span><span className=" text-neutral-light-600 font-medium text-end">{user.meetingType}</span>
            </p>
            <p className="flex justify-between gap-3 ">
              <span className="">Started</span><span className=" text-neutral-light-600 font-medium text-end">{user.meetingStartTime}</span>
            </p>
            <p className="flex justify-between gap-3 ">
              <span className="">Duration</span><span className=" text-neutral-light-600 font-medium text-end">{calcMeetingDuration("connectCard")}</span>
            </p>
            <p className="flex justify-between gap-3 ">
              <span className="">Distance Apart</span><span className={` ${(user.meetingEndTime.length===0)? 'text-secondary-green-500': 'text-neutral-light-600'} font-semibold text-end`}>
                {(user.meetingEndTime.length===0)&&"Currently:"}&nbsp;{calcDistanceApart(user.firstRecipient.coordinates, user.secondRecipient.coordinates)}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 border-b border-b-[#F4F3F5] pb-4">
          <h5 className=" text-neutral-light-300 font-semibold text-xs uppercase">Real-time Log</h5>
          <div className="flex flex-col gap-1.5 text-[13px] font-normal text-neutral-light-300">
            <div className="flex justify-between gap-3 ">
              <div className="flex items-center gap-2">
                <span className={`inline-flex shrink-0 h-2 w-2 rounded-full ${(user.meetingEndTime.length===0)? 'bg-purple-light-600': 'bg-neutral-light-400'}`}></span>
                <span className="">Connection Accepted</span>
              </div>
              <span className="text-[11px] text-end text-neutral-light-300 font-normal">{user.location}</span>
            </div>
            <div className="flex justify-between gap-3 ">
              <div className="flex items-center gap-2">
                <span className={`inline-flex shrink-0 h-2 w-2 rounded-full ${(user.meetingEndTime.length===0)? 'bg-purple-light-600': 'bg-neutral-light-400'}`}></span>
                <span className="">{user.firstRecipient.name.split(' ')[0]} depart</span>
              </div>
              <span className="text-[11px] text-end text-neutral-light-300 font-normal">{user.firstRecipient.departure}</span>
            </div>
            <div className="flex justify-between gap-3 ">
              <div className="flex items-center gap-2">
                <span className={`inline-flex shrink-0 h-2 w-2 rounded-full ${(user.meetingEndTime.length===0)? 'bg-purple-light-600': 'bg-neutral-light-400'}`}></span>
                <span className="">{user.secondRecipient.name.split(' ')[0]} depart</span>
              </div>
              <span className="text-[11px] text-end text-neutral-light-300 font-normal">{user.secondRecipient.departure}</span>
            </div>
            <div className="flex justify-between gap-3 ">
              <div className="flex items-center gap-2">
                <span className={`inline-flex shrink-0 h-2 w-2 rounded-full ${(user.meetingEndTime.length===0)? 'bg-purple-light-600': 'bg-neutral-light-400'}`}></span>
                <span className="">Both Arrived at {user.location}</span>
              </div>
              <span className="text-[11px] text-end text-neutral-light-300 font-normal text-nowrap">{calcMeetingDuration("connectCard")}</span>
            </div>
            <div className={`flex justify-between gap-3 font-semibold ${(user.meetingEndTime.length===0)? 'text-secondary-green-500': 'text-neutral-light-300'}`}>
              <div className="flex items-center gap-2">
                <span className={`inline-flex shrink-0 h-2 w-2 rounded-full ${(user.meetingEndTime.length===0)? 'bg-secondary-green-500': 'bg-neutral-light-400'}`}></span>
                <span className="">Currently at location</span>
              </div>
              <span className={` text-[11px] text-end  `}>
                {(user.meetingEndTime.length===0)? 'Now':'Ended'}
              </span>
            </div>
          </div>
        </div>
        <div className={`flex items-start justify-start mb-2.5 border p-3 rounded-lg font-medium text-[13px]  gap-3 w-full ${(user.safetyAlert===false)? 'bg-[#F0FDF4] border-[#DCFCE7] text-secondary-green-500': 'bg-[#F9E3E3] border-[#F9F3F3] text-[#C92B2B] animate-pulse'}`}>
          {(user.safetyAlert===false)?
            <>
              <CheckCircleIcon size={18} strokeWidth={2.5} className="h-4.5 w-4.5" />
              <span className="">No safety alerts triggered</span>
            </>:
            <>
              <AlertTriangle size={18} strokeWidth={2.5} className="h-4.5 w-4.5" />
              <span className="">Safety alerts triggered</span>
            </>
          }
        </div>
        {(user.meetingEndTime.length===0)?
          (<div className="flex flex-col gap-2.5 pb-4">
            <button className="flex items-center justify-center border border-[#FB923C] px-3 cursor-pointer py-2.5 rounded-lg bg-neutral-white font-semibold text-[13px] text-[#FB923C] gap-3 w-full"
            onClick={()=> alert("coming soon!")}>
              <span className="">Send Alert to Users</span>
            </button>
            <button className="flex items-center justify-center border border-[#C92B2B] px-3 cursor-pointer py-2.5 rounded-lg bg-neutral-white font-semibold text-[13px] text-[#C92B2B] gap-3 w-full"
            onClick={()=> alert("coming soon!")}>
              <span className="">Flag Connection</span>
            </button>
            <button className="flex items-center justify-center border border-[#E4E7EC] px-3 cursor-pointer py-2.5 rounded-lg bg-[#F4F3F5] font-semibold text-[13px] text-neutral-light-300 gap-3 w-full"
            onClick={()=> alert("coming soon!")}>
              <span className="">End Tracking</span>
            </button>
          </div>):
          <></>
        }

        {/* footer button back to state */}
        <button className=" flex text-xs w-fit py-1.5 px-2 rounded-lg bg-bg-purple-light-200 items-center flex-nowrap gap-2 text-neutral-light-300 hover:text-purple-light-600 cursor-pointer"
        onClick={()=> setSwitch(!isSwitch)}>
          <ArrowLeft size={16} />
          <span className="">Back</span>
        </button>
      </>
    )
  }
  const NoConnectionCard = ({info}: {info: string}) => {
    return (
      <p className=" w-full text-center text-sm text-neutral-light-300 py-4">
        No {info} connection
      </p>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center w-full">
        <GridCard />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full mb-6">
        <div className="col-span-2 h-screen">
          <div className="relative bg-neutral-white w-full h-full border-[.5px] border-primary-border rounded-2xl overflow-hidden">
            <GoogleMapIndex users={LiveConnectUsers} isSwitch={isSwitch} switchVal={switchVal} setSwitch={(val) => setSwitch(val)} setSwitchVal={(id) => setSwitchVal(id)} />
           
          </div>
        </div>
        <div className=" bg-neutral-white border-[.5px] border-primary-border rounded-2xl h-fit">
          {(isSwitch===false)?
            (<>
              <div className="flex text-sm items-center justify-between border-b-[.5px] border-b-primary-border">
                <button className={`inline-flex items-center justify-center w-full py-4 border-b-2 cursor-pointer outline-none transition ${(active==='ongoing')? 'font-semibold text-purple-light-600 border-b-purple-light-600': 'font-medium text-neutral-light-300 border-b-transparent'}`} onClick={()=> setActive('ongoing')}>Ongoing ({activeUser.length})</button>
                <button className={`inline-flex items-center justify-center w-full py-4 border-b-2 cursor-pointer outline-none transition ${(active==='past')? 'font-semibold text-purple-light-600  border-b-purple-light-600': 'font-medium text-neutral-light-300 border-b-transparent'}`} onClick={()=> setActive('past')}>Past Connections</button>
              </div>
              <div className="h-fit max-h-[calc(100vh-54px)] scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4 ">
                  {(active==="ongoing")?
                    (activeUser.length>0) && activeUser.map((active, index) => 
                      <ConnectionCard
                        key={active.id}
                        user={active}
                        index={index}
                      />):
                    (pastConnectionUser.length>0) && pastConnectionUser.map((active, index) => 
                      <ConnectionCard
                        key={active.id}
                        user={active}
                        index={index}
                      />)
                  }
                  {( (active==="ongoing") && activeUser.length===0) && <NoConnectionCard info={"active"} />}
                  {( (active==="past") && pastConnectionUser.length===0) && <NoConnectionCard info={"past"} />}
                </div>

              </div>
            </>) :
            (<>
              <div className="flex text-sm w-full border-b-[.5px] border-b-primary-border">
                <h5 className=" font-semibold text-base text-neutral-light-600 p-4">Connection Analytics</h5>
              </div>
              <div className="flex flex-col gap-4 h-fit max-h-[calc(100vh-54px)] scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                  <SingleConnectionCard
                    user={LiveConnectUsers[switchVal-1]}
                  />
                </div>
              </div>
            </>)
          }
        </div>
      </div>
    </div>
  )
}

export default LiveConnectionHomeIndex