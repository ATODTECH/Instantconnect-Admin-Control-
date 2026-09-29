import { StatCard } from "@/components/shared/stat-card"
import { formatCount, formatNaira } from "@/lib/format"

// Placeholder figures until the events admin API exists.
const GridCard = () => (
  <>
    <StatCard title="Total Events" value={formatCount(486)} tone="brand" note={{ label: "Overall event created", tone: "brand" }} />
    <StatCard title="Upcoming Events" value={formatCount(34)} tone="success" note={{ label: "Active or Upcoming", tone: "success" }} />
    <StatCard title="Past Event" value={formatCount(452)} tone="neutral" note={{ label: "Successfully archived", tone: "neutral" }} />
    <StatCard title="Total Revenue" value={formatNaira(8_600_000 * 100)} tone="warning" note={{ label: "Ticket transactions", tone: "warning" }} />
  </>
)

export default GridCard
