import { StatCard } from "@/components/shared/stat-card"
import { formatCount } from "@/lib/format"
import { fmtNaira } from "../constants"

// Placeholder figures until subscriptions and payments exist.
const GridCard = () => (
  <>
    <StatCard title="Total Subscribers" value={formatCount(3847)} tone="brand" note={{ label: "+60 this month", tone: "brand" }} />
    <StatCard title="Active Subscriptions" value={formatCount(34)} tone="warning" note={{ label: "+83.5% of total", tone: "warning" }} />
    <StatCard
      title="Revenue This Month"
      value={fmtNaira(12_450_000)}
      valueTitle={fmtNaira(12_450_000)}
      tone="success"
      note={{ label: "+18% vs last month", tone: "success" }}
    />
    <StatCard title="Failed Payments" value={formatCount(47)} tone="danger" note={{ label: "Required attention", tone: "danger" }} />
  </>
)

export default GridCard
