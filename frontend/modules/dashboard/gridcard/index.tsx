"use client"

const GridCard = () => {

  function formatCompactNumber(value: number) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  function formatNgn(value: number) {
    if (value >= 1_000_000) return `NGN ${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `NGN ${(value / 1_000).toFixed(0)}K`;
    return `NGN ${value}`;
  }

  function randomChangePct(min: number, max: number) {
    return Math.round(((max - min) + min) * 10) / 10;
    // return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  }

  const gridCards = [
    {title:"Total Users", value:"12847", min:8, max:14},
    {title:"Active Events", value:"342", min:4, max:10},
    {title:"Revenue", value:"4200000", min:18, max:26},
    {title:"Pending KYC", value:"28", min:0, max:0},
  ]

  return (
    <>
      {
        gridCards.map((Card, index) => (
          <div key={Card.title} className="flex flex-col justify-between h-full min-h-29.25 p-6 rounded-2xl bg-neutral-white shadow-[0px_0px_10px_0px_#00000005]">
            <div className="flex justify-between items-center w-full">
              <span className=" text-sm font-medium text-neutral-light-300">{Card.title}</span>
              {
                (index === gridCards.length-1)?
                <span className={`shrink-0 rounded-full h-2 w-2 ${(+Card.value>0)?'bg-[#FB923C]':'bg-neutral-light-300'}`}></span>:
                <span className="py-1 px-2 text-xs font-semibold rounded-lg bg-[#F0FDF4] text-secondary-green-500">+ {randomChangePct(Card.min, Card.max)}%</span>
              }
            </div>
            <div className=" text-[28px] font-bold text-neutral-light-600">
              {
                (index === gridCards.length-2)?
                formatNgn(+Card.value):
                formatCompactNumber(+Card.value)
              }
            </div>
          </div>
        ))
      }
    </>
  )
}

export default GridCard