import { formatCompactNumber } from ".."

const GridCard = () => {

  const gridCards = [
    {title:"Total Subscribers", value:"3847", color:"bg-[#9333EA]"},
    {title:"Active Subscriptions", value:"34", color:"bg-[#FB923C]"},
    {title:"Revenue This Month", value:"12450000", color:"bg-[#4ADE80]"},
    {title:"Failed Payments", value:"47", color:"bg-[#C92B2B]"},
  ]
  const subInfoGridCard = [
    {value:"+60 this month", text:"text-[#9333EA]", bg:"bg-[#F3E8FF]"},
    {value:"+83.5% of total", text:"text-[#FB923C]", bg:"bg-[#FFFBF5]"},
    {value:"+18% vs last month", text:"text-[#22C55E]", bg:"bg-[#DCFCE7]"},
    {value:"Required attention", text:"text-[#C92B2B]", bg:"bg-[#FCF2F2]"},
  ]

  return (
    <>
      {
        gridCards.map((Card, index) => (
          <div key={Card.title} className="flex flex-col justify-between h-full min-h-29.25 gap-4 p-6 rounded-2xl border-[0.5px] border-[#E4E7EC] bg-neutral-white ">
            <div className="flex justify-between items-center w-full">
              <span className=" text-sm font-medium text-neutral-light-400">{Card.title}</span>
              <span className={`shrink-0 rounded-full h-2 w-2 ${Card.color}`}></span>
            </div>
            <div className="flex flex-col items-start text-start gap-2">
              <span className="text-[2rem] font-bold text-neutral-light-600 leading-[100%] cursor-pointer overflow-hidden w-full" title={` ${(index===2)?'₦':''}${formatCompactNumber(+Card.value)}`}>
                {(index===2)&&'₦'}
                {formatCompactNumber(+Card.value)}
              </span>
              <span className={`text-[11px] font-semibold py-0.5 px-1.5 rounded-sm truncate ${subInfoGridCard[index].text} ${subInfoGridCard[index].bg}`}>{subInfoGridCard[index].value}</span>
            </div>
          </div>
        ))
      }
    </>
  )
}

export default GridCard