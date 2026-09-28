"use client"
import ActivityIndex from "./activity"
import ChartIndex from "./charts"
import GridCard from "./gridcard"


const DashboardHomeIndex = () => {

  
  return (
    <div className=" flex-1 flex flex-col gap-y-6 overflow-y-auto scrollbar-thin pr-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 items-center w-full">
        <GridCard />
      </div>
      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 w-full">
        <ChartIndex />
      </div>
      <div className="flex flex-col mb-8 gap-y-4 bg-neutral-white shadow-[0px_0px_10px_0px_#00000005] rounded-2xl pt-6 pb-2">
        <ActivityIndex />
      </div>
    </div>
  )
}

export default DashboardHomeIndex