"use client"
import { Cell, LineChart, Line, Pie, PieChart, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetEmpty, WidgetError } from "@/components/widget-state"
import { useEventsByCategory, useUserGrowth } from "@/hooks/use-dashboard"
import { formatCount, formatMonth } from "@/lib/format"

const PANEL = "bg-neutral-white rounded-2xl p-6 shadow-[0px_0px_10px_0px_#00000005]"

/** The mobile app's brand run, purple through coral, then its lighter tints. */
const CATEGORY_COLORS = ["#9333EA", "#EC4899", "#FB923C", "#A136DD", "#F05E7E", "#CE41B5", "#C084FC", "#F67B58"]

const UserGrowthChart = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useUserGrowth()
  const points = data?.points.map((point) => ({ ...point, label: formatMonth(point.month) })) ?? []

  return (
    <div className={`col-span-2 ${PANEL}`}>
      <div className="flex justify-between w-full text-neutral-light-300 font-normal text-xs">
        <div className="flex flex-col">
          <h3 className="text-neutral-light-600 font-bold text-base">User Growth</h3>
          <span>New members each month</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="inline-flex shrink-0 h-2 w-2 rounded-full bg-brand" />
          <span>New Users</span>
        </div>
      </div>
      <div className="mt-4 h-56">
        {isPending ? (
          <div role="status" className="flex h-full items-end gap-3 px-2 pb-6">
            <span className="sr-only">Loading user growth</span>
            {[35, 50, 42, 60, 55, 70, 64, 80, 72].map((height, index) => (
              <Skeleton key={index} className="flex-1 rounded-t-md rounded-b-none" style={{ height: `${height}%` }} />
            ))}
          </div>
        ) : isError ? (
          <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="h-full" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 10, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} dy={8} />
              <Tooltip
                cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
                contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", color: "#94A3B8", fontSize: 12 }}
                formatter={(value) => [formatCount(Number(value)), "New users"]}
              />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#9333EA"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#9333EA" }}
                isAnimationActive
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

const EventsByCategoryChart = () => {
  const { data, isPending, isError, error, refetch, isRefetching } = useEventsByCategory()
  const slices = data?.categories.map((category, index) => ({
    ...category,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  })) ?? []

  return (
    <div className={`flex flex-col gap-10 ${PANEL}`}>
      <div className="flex flex-col">
        <h3 className="font-bold text-neutral-light-600 text-base">Events by Category</h3>
        <span className="text-xs font-normal text-neutral-light-300">Events that have not ended yet</span>
      </div>
      {isPending ? (
        <div role="status" className="flex gap-x-4 items-center mb-10">
          <span className="sr-only">Loading events by category</span>
          <Skeleton className="h-36 w-36 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-3 w-full" />)}
          </div>
        </div>
      ) : isError ? (
        <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="mb-10 min-h-36" />
      ) : data.total === 0 ? (
        <WidgetEmpty message="No upcoming or ongoing events." className="mb-10 min-h-36" />
      ) : (
        <div className="flex gap-x-2 items-center mb-10">
          <div className="flex relative justify-center items-center">
            <div className="relative h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    dataKey="count"
                    nameKey="label"
                    innerRadius="68%"
                    outerRadius="100%"
                    paddingAngle={slices.length > 1 ? 2 : 0}
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive
                    animationDuration={600}
                  >
                    {slices.map((slice) => (
                      <Cell key={slice.label} fill={slice.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute flex flex-col items-center">
              <span className="font-bold text-xl text-neutral-light-600">{formatCount(data.total)}</span>
              <span className="text-[11px] font-medium text-neutral-light-300">{data.total === 1 ? "Event" : "Events"}</span>
            </div>
          </div>
          <ul className="flex-1 space-y-2">
            {slices.map((slice) => (
              <li key={slice.label} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.color }} />
                  {slice.label}
                </span>
                <span className="font-medium text-slate-900">{slice.percentage}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const ChartIndex = () => (
  <>
    <UserGrowthChart />
    <EventsByCategoryChart />
  </>
)

export default ChartIndex
