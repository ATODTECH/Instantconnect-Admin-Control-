
const GridCard = () => {

  function formatCompactNumber(value: number) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  const gridCards = [
    {title:"Active Connections Now", value:"47", color:"bg-[#22C55E]"},
    {title:"Connections Today", value:"156", color:"bg-[#9333EA]"},
    {title:"Flagged Meetups", value:"3", color:"bg-[#C92B2B]"},
  ]
  const subInfoGridCard = [
    {value:"Live", text:"text-[#22C55E]", bg:"bg-[#DCFCE7]"},
    {value:"+18% vs yesterday", text:"text-[#9333EA]", bg:"bg-[#FAF5FF]"},
    {value:"Action Required", text:"text-[#C92B2B]", bg:"bg-[#F9E3E3]"},
  ]

  return (
    <>
      {
        gridCards.map((Card, index) => (
          <div key={Card.title} className="flex flex-col justify-between h-full min-h-29.25 p-6 rounded-2xl border-[0.5px] border-[#E4E7EC] bg-neutral-white ">
            <div className="flex justify-between items-center w-full">
              <span className=" text-sm font-medium text-neutral-light-400">{Card.title}</span>
              <span className={`shrink-0 rounded-full h-2 w-2 ${Card.color}`}></span>
            </div>
            <div className="flex items-end gap-4 ">
              <span className="text-[2rem] font-bold text-neutral-light-600 leading-[100%]">{formatCompactNumber(+Card.value)}</span>
              <span className={`text-[11px] font-semibold py-0.5 px-1.5 rounded-sm ${subInfoGridCard[index].text} ${subInfoGridCard[index].bg}`}>{subInfoGridCard[index].value}</span>
            </div>

          </div>
        ))
      }
    </>
  )
}

export default GridCard