import { StatCard } from "@/components/shared/stat-card"
import { formatCount } from "@/lib/format"

// Placeholder figures until the communities admin API exists.
const GridCard = () => (
  <>
    <StatCard title="Total Communities" value={formatCount(89)} tone="brand" note={{ label: "+12 this month", tone: "brand" }} />
    <StatCard title="Active Communities" value={formatCount(34)} tone="success" note={{ label: "72 active right now", tone: "success" }} />
    <StatCard title="Reported Communities" value={formatCount(5)} tone="neutral" note={{ label: "Required critical audit", tone: "neutral" }} />
    <StatCard title="Total Members" value={formatCount(8420)} tone="warning" note={{ label: "+450 across platforms", tone: "warning" }} />
  </>
)

export default GridCard
