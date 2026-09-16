
const GridCard = () => {

  function formatCompactNumber(value: number) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  const gridCards = [
    {title:"Total Events", value:"486", color:"bg-[#9333EA]"},
    {title:"Upcoming Events", value:"34", color:"bg-[#22C55E]"},
    {title:"Past Event", value:"452", color:"bg-[#83818E]"},
    {title:"Total Revenue", value:"8600000", color:"bg-[#FB923C]"},
  ]
  const subInfoGridCard = [
    {value:"Overall event created", text:"text-[#9333EA]", bg:"bg-[#F3E8FF]"},
    {value:"Active or Upcoming", text:"text-[#22C55E]", bg:"bg-[#DCFCE7]"},
    {value:"Successfully archived", text:"text-[#83818E]", bg:"bg-[#F4F3F5]"},
    {value:"Ticket transactions", text:"text-[#FB923C]", bg:"bg-[#FFFBF5]"},
  ]

  function formatNgn(value: number) {
    if (value >= 1_000_000) return `NGN ${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `NGN ${(value / 1_000).toFixed(0)}K`;
    return `NGN ${value}`;
  }

  
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
                {(index === gridCards.length-1)?
                  formatNgn(+Card.value):
                  formatCompactNumber(+Card.value)
                }
              </span>
              <span className={`text-[11px] font-semibold py-0.5 px-1.5 rounded-sm ${subInfoGridCard[index].text} ${subInfoGridCard[index].bg}`}>{subInfoGridCard[index].value}</span>
            </div>

          </div>
        ))
      }
    </>
  )
}

export default GridCard