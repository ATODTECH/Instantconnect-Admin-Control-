
const GridCard = () => {

  function formatCompactNumber(value: number) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  const gridCards = [
    {title:"Total Communities", value:"89", color:"bg-[#9333EA]"},
    {title:"Active Communites", value:"34", color:"bg-[#22C55E]"},
    {title:"Reported Communities", value:"5", color:"bg-[#83818E]"},
    {title:"Total Members", value:"8420", color:"bg-[#FB923C]"},
  ]
  const subInfoGridCard = [
    {value:"+12 this month", text:"text-[#9333EA]", bg:"bg-[#F3E8FF]"},
    {value:"72 active right now", text:"text-[#22C55E]", bg:"bg-[#DCFCE7]"},
    {value:"Required critical audit", text:"text-[#83818E]", bg:"bg-[#F4F3F5]"},
    {value:"+450 across platforms", text:"text-[#FB923C]", bg:"bg-[#FFFBF5]"},
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
            <div className="flex flex-col items-start text-start gap-2 ">
              <span className="text-[2rem] font-bold text-neutral-light-600 leading-[100%]">
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