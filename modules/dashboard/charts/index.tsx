"use client";
import {
  Cell,
  LineChart,
  Line,
  Pie, 
  PieChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// line chart
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept"];
function jitter(base: number, pct: number) {
  // const delta = base * pct * (Math.random() * 2 - 1);
  const delta = base * pct * (2 - 1);
  return Math.round(base + delta);
}

const ChartIndex = () => {

  // line chart
  const userGrowth = MONTHS.map((month, i) => {
    const progress = i / (MONTHS.length - 1);
    const trend = 4200 + progress * 3400;
    return { month, newUsers: Math.round(jitter(trend, 0.05)) };
  });

  // pie chart
  const BASE_EVENTS = 342;
  const activeEvents = jitter(BASE_EVENTS, 0.02);

  const rawSlices = [
    { label: "Tech", pct: 40, color: "#7C3AED" },
    { label: "Business", pct: 25, color: "#3B82F6" },
    { label: "Social", pct: 15, color: "#EC4899" },
    { label: "Health", pct: 12, color: "#10B981" },
    { label: "Education", pct: 8, color: "#F97316" },
  ].map((s) => ({ ...s, pct: Math.max(1, jitter(s.pct, 0.08)) }));
  const sliceTotal = rawSlices.reduce((sum, s) => sum + s.pct, 0);
  const eventsByCategory = rawSlices.map((s) => ({
    ...s,
    pct: Math.round((s.pct / sliceTotal) * 100),
  }));


  return (
    <>
      <div className="col-span-2 bg-neutral-white rounded-2xl p-6 shadow-[0px_0px_10px_0px_#00000005]">
        <div className="flex justify-between w-full text-neutral-light-300 font-normal text-xs">
          <div className="flex flex-col">
            <h3 className=" text-neutral-light-600 font-bold text-base">User Growth</h3>
            <span className="">Monthly user growth trend</span>
          </div>
          <div className="flex items-center gap-x-2">
            <span className="inline-flex shrink-0 h-2 w-2 rounded-full bg-[#9333EA]"></span>
            <span className="">New Users</span>
          </div>
        </div>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowth} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#EEF0F3" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 12 }}
                dy={8}
              />
              <Tooltip
                cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  color: "#94A3B8",
                  fontSize: 12,
                }}
                formatter={(value: any) => [value.toLocaleString(), "New users"]}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#7C3AED"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#7C3AED" }}
                isAnimationActive
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className=" flex flex-col gap-10 bg-neutral-white rounded-2xl p-6">
        <div className="flex flex-col">
          <h3 className=" font-bold text-neutral-light-600 text-base">Events by Category</h3>
          <span className=" text-xs font-normal text-neutral-light-300">Live events metrics by vertical</span>
        </div>
        <div className="flex gap-x-2 items-center mb-10">
          <div className="flex relative justify-center items-center">
            <div className="relative h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventsByCategory}
                    dataKey="pct"
                    nameKey="label"
                    innerRadius="68%"
                    outerRadius="100%"
                    paddingAngle={2}
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive
                    animationDuration={600}
                  >
                    {eventsByCategory.map((slice) => (
                      <Cell key={slice.label} fill={slice.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute flex flex-col">
              <span className=" font-bold text-xl text-neutral-light-600">{activeEvents}</span>
              <span className=" text-[11px] font-medium text-neutral-light-300">Events</span>
            </div>
          </div>
          <ul className="flex-1 space-y-2">
            {eventsByCategory.map((slice) => (
              <li
                key={slice.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  {slice.label}
                </span>
                <span className="font-medium text-slate-900">{slice.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default ChartIndex