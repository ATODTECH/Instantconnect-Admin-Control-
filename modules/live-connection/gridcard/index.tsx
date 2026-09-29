import { StatCard } from "@/components/shared/stat-card"
import { formatCount } from "@/lib/format"

// Placeholder figures until the live connection admin API exists.
const GridCard = () => (
  <>
    <StatCard title="Active Connections Now" value={formatCount(47)} tone="success" note={{ label: "Live", tone: "success" }} noteLayout="inline" />
    <StatCard title="Connections Today" value={formatCount(156)} tone="brand" note={{ label: "+18% vs yesterday", tone: "brand" }} noteLayout="inline" />
    <StatCard title="Flagged Meetups" value={formatCount(3)} tone="danger" note={{ label: "Action Required", tone: "danger" }} noteLayout="inline" />
  </>
)

export default GridCard
