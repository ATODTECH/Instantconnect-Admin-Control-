"use client"

import { APIProvider, Map, AdvancedMarker, ColorScheme, InfoWindow, Pin, MapControl, ControlPosition } from "@vis.gl/react-google-maps"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { AVATAR_COLORS } from ".."
import { ArrowRight, Clock, MapPin } from "lucide-react"

interface GoogleMapProps {
  users: LiveConnectUsersProps[],
  isSwitch: boolean,
  switchVal: number,
  setSwitch: (val: boolean)=> void,
  setSwitchVal: (id: number)=> void,
}


const MapLegend = () => {
  return (
    <div className="border border-[#2D3548] p-3 rounded-lg">
      <div className="flex flex-col gap-1.5 text-[11px] text-primary font-normal">
        <span className="uppercase font-semibold text-secondary">Legend</span>
        <div className="flex gap-2 items-center flex-nowrap">
          <span className="shrink-0 w-2 h-2 inline-flex rounded-full bg-secondary-green-500"></span>
          <span>Active</span>
        </div>
        <div className="flex gap-2 items-center flex-nowrap">
          <span className="shrink-0 w-2 h-2 inline-flex rounded-full bg-neutral-light-300"></span>
          <span>Completed</span>
        </div>
        <div className="flex gap-2 items-center flex-nowrap">
          <span className="shrink-0 w-2 h-2 inline-flex rounded-full bg-[#C92B2B]"></span>
          <span>Flagged</span>
        </div>
      </div>
    </div>
  )
}
const SingleMapLegend = () => {
  return (
    <div className="border border-[#2D3548] p-3 rounded-lg">
      <div className="flex flex-col gap-1.5 text-[11px] text-primary font-normal">
        <span className="uppercase font-semibold text-secondary">Live Tracking Legend</span>
        <div className="flex gap-2 items-center flex-nowrap">
          <span className="shrink-0 w-2 h-2 inline-flex rounded-full bg-secondary-green-500"></span>
          <span>GPS Online (Active)</span>
        </div>
        <div className="flex gap-2 items-center flex-nowrap">
          <span className="shrink-0 w-2 h-2 inline-flex rounded-full bg-purple-light-600"></span>
          <span>Meeting Destination</span>
        </div>
        <div className="flex gap-2 items-center flex-nowrap">
          <span className="shrink-0 w-2 border border-dashed border-purple-light-600 inline-flex" />
          <span>Assigned Path</span>
        </div>
      </div>
    </div>
  )
}


const DEFAULT_CENTER = {lat: 6.42816, lng:  3.41897}

const GoogleMapIndex = ({users, isSwitch, switchVal, setSwitch, setSwitchVal}: GoogleMapProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
  const [connectUsers, setConnectUsers] = useState(users)
  const [selectedUserId, setSelectedUserId] = useState<number>()
  const [isInfoWindow, setIsInfoWindow] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)
  

  if (!apiKey) {
    return <div className="text-sm text-red-600">Error: Missing Google Maps API Key</div>
  }

  const initials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  const intialsConnectionCard = (name: string) => {
    const val = name.split(" ")[1][0]
    return name
      .split(" ")[0]
      .concat(" ", val, ".")
  }


  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsInfoWindow(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  if (isSwitch) {
    console.log(switchVal)
    return (
      <>
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={connectUsers[switchVal!-1].coordinates}
            defaultZoom={12}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapId={"DEMO_MAP_ID"}
            colorScheme={ColorScheme.DARK}
          >
            {/* first person */}
            <AdvancedMarker
              position={connectUsers[switchVal!-1].firstRecipient.coordinates}
              clickable={true}
              draggable={false}
            >
              <Pin background={'#EA4335'} borderColor={'#000'} glyphColor={'#FFF'} />
              <InfoWindow
                position={connectUsers[switchVal!-1].firstRecipient.coordinates}
                headerDisabled={true}
              >
                <div className="flex items-center gap-1 w-full">
                  {(connectUsers[switchVal!-1].firstRecipient.image.length>0)?
                    <Image
                      src={connectUsers[switchVal!-1].firstRecipient.image}
                      alt={connectUsers[switchVal!-1].firstRecipient.name}
                      className="w-5 h-5 rounded-full border-2 border-neutral-white object-cover"
                    /> :
                    <span className={`inline-flex items-center justify-center text-[8px] shrink-0 w-5 h-5 border-2 border-neutral-white rounded-full ${
                      AVATAR_COLORS[connectUsers[switchVal!-1].firstRecipient.id % AVATAR_COLORS.length]
                    }`}>
                      {initials(connectUsers[switchVal!-1].firstRecipient.name)}
                    </span>
                  }
                  <div className=" w-full text-[11px] text-[#1E293B] font-semibold">{intialsConnectionCard(connectUsers[switchVal!-1].firstRecipient.name)}</div>
                </div>
              </InfoWindow>
            </AdvancedMarker>

            {/* location pin */}
            <AdvancedMarker
              position={connectUsers[switchVal!-1].coordinates}
              clickable={true}
              draggable={false}
            >
              <Pin background={'#EA4335'} borderColor={'#000'} 
                glyphColor={`
                  ${connectUsers[switchVal!-1].status==="active"? '#22C55E':''}
                  ${connectUsers[switchVal!-1].status==="completed"? '#83818E':''}
                  ${connectUsers[switchVal!-1].status==="flagged"? '#C92B2B':''}`} 
                />
            </AdvancedMarker>
            
            {/* second person */}
            <AdvancedMarker
              position={connectUsers[switchVal!-1].secondRecipient.coordinates}
              clickable={true}
              draggable={false}
            >
              <Pin background={'#EA4335'} borderColor={'#000'} glyphColor={'#FFF'} />
              <InfoWindow
                position={connectUsers[switchVal!-1].secondRecipient.coordinates}
                headerDisabled={true}
              >
                <div className="flex items-center gap-1 w-full">
                  {(connectUsers[switchVal!-1].secondRecipient.image.length>0)?
                    <Image
                      src={connectUsers[switchVal!-1].secondRecipient.image}
                      alt={connectUsers[switchVal!-1].secondRecipient.name}
                      className="w-5 h-5 rounded-full border-2 border-neutral-white object-cover"
                    /> :
                    <span className={`inline-flex items-center justify-center text-[8px] shrink-0 w-5 h-5 border-2 border-neutral-white rounded-full ${
                      AVATAR_COLORS[connectUsers[switchVal!-1].secondRecipient.id % AVATAR_COLORS.length]
                    }`}>
                      {initials(connectUsers[switchVal!-1].secondRecipient.name)}
                    </span>
                  }
                  <div className=" w-full text-[11px] text-[#1E293B] font-semibold">{intialsConnectionCard(connectUsers[switchVal!-1].secondRecipient.name)}</div>
                </div>
              </InfoWindow>
            </AdvancedMarker>


            <MapControl position={ControlPosition.LEFT_BOTTOM}>
              <SingleMapLegend />
            </MapControl>
          </Map>
        </APIProvider>
      </>
    )
  }
  
  return (
    <>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={12}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId={"DEMO_MAP_ID"}
          colorScheme={ColorScheme.DARK}
        >
          {
            connectUsers.map((connectUser, index) => (
              <AdvancedMarker
                key={connectUser.id}
                position={connectUser.coordinates}
                clickable={true}
                draggable={false}
                onClick={()=> {setIsInfoWindow(true); setSelectedUserId(connectUser.id)}}
              >
                <Pin background={'#EA4335'} borderColor={'#000'} 
                glyphColor={`
                  ${connectUser.status==="active"? '#22C55E':''}
                  ${connectUser.status==="completed"? '#83818E':''}
                  ${connectUser.status==="flagged"? '#C92B2B':''}`} 
                />
                {((selectedUserId===connectUser.id)&& isInfoWindow===true) && (
                  <InfoWindow
                    position={connectUser.coordinates}
                    onCloseClick={()=> setIsInfoWindow(false)}
                    minWidth={220}
                    headerDisabled={true}
                  >
                    <div className="flex flex-col w-full" onClick={()=> setIsInfoWindow(isInfoWindow === true ? true: false)} ref={containerRef}>

                      {/* image */}
                      <div className="relative w-fit pb-2">
                        {(connectUser.firstRecipient.image.length>0)?
                          <Image
                            src={connectUser.firstRecipient.image}
                            alt={connectUser.firstRecipient.name}
                            className="w-8 h-8 rounded-full border-2 border-neutral-white object-cover"
                          /> :
                          <span className={`inline-flex items-center justify-center text-xs shrink-0 w-8 h-8 border-2 border-neutral-white rounded-full ${
                            AVATAR_COLORS[connectUser.firstRecipient.id % AVATAR_COLORS.length]
                          }`}>{initials(connectUser.firstRecipient.name)}</span>
                        }
                        {(connectUser.secondRecipient.image.length>0)?
                          <Image
                            src={connectUser.secondRecipient.image}
                            alt={connectUser.secondRecipient.name}
                            className="absolute -right-5 flex w-8 h-8 rounded-full border-2 border-neutral-white object-cover"
                          /> :
                          <span className={`absolute text-xs -right-5 inline-flex items-center justify-center shrink-0 w-8 h-8 border-2 border-neutral-white rounded-full ${
                            AVATAR_COLORS[connectUser.secondRecipient.id % AVATAR_COLORS.length]
                          }`}>{initials(connectUser.secondRecipient.name)}</span>
                        }
                        <span className="absolute -right-12 inline-flex self-center text-purple-light-600 font-semibold text-[10px] border border-[#F3E8FF] bg-bg-purple-light-200 rounded-sm py-0.5 px-1.5">{connectUser.status}</span>
                      </div>

                      {/* firstName + initials */}
                      <div className="flex flex-col gap-1 pb-2 border-b border-b-[#F1F5F9]">
                        <div className=" w-full text-sm text-neutral-light-600 font-semibold">{intialsConnectionCard(connectUser.firstRecipient.name)} & {intialsConnectionCard(connectUser.secondRecipient.name)}</div>
                        <div className="flex flex-col items-start gap-1 pl-1 text-neutral-light-300 w-full">
                          <div className="flex items-center gap-1">
                            <MapPin size={11} className="h-2.75 w-2.75" />
                            <span className=" font-normal text-xs">{connectUser.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={11} className="h-2.75 w-2.75" />
                            <span className=" font-normal text-xs">{connectUser.meetingStartTime}</span>
                          </div>
                        </div>
                      </div>
                      {/* footer view details */}
                      <button className="flex items-center gap-4 justify-between text-purple-light-600 text-xs font-semibold outline-none pt-2 cursor-pointer"
                      onClick={()=> {setSwitch(true); setSwitchVal(connectUser.id)}}>
                        <span>View Details</span>
                        <ArrowRight size={12} className="h-3 w-3" />
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </AdvancedMarker>
            ))
          }
          <MapControl position={ControlPosition.LEFT_BOTTOM}>
            <MapLegend />
          </MapControl>
        </Map>
      </APIProvider>
    </>
  )
}

export default GoogleMapIndex