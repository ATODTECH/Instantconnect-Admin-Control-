
const GridCard = () => {

  function formatCompactNumber(value: number) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  const gridCards = [
    {title:"Pending Review", value:"28", color:"bg-[#FB923C]"},
    {title:"Approved Today", value:"12", color:"bg-[#22C55E]"},
    {title:"Rejected Today", value:"3", color:"bg-[#C92B2B]"},
  ]
  const colorToday = [
    {text:"text-[#FB923C]", bg:"bg-[#FFF7ED]"},
    {text:"text-[#22C55E]", bg:"bg-[#DCFCE7]"},
    {text:"text-[#C92B2B]", bg:"bg-[#F9E3E3]"},
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
              <span className={`text-[11px] font-semibold py-0.5 px-1.5 rounded-sm ${colorToday[index].text} ${colorToday[index].bg}`}>Today</span>
            </div>

          </div>
        ))
      }
    </>
  )
}

export default GridCard