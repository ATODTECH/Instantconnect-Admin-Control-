import { StatCard } from "@/components/shared/stat-card"
import { formatCount } from "@/lib/format"

// Placeholder figures until the KYC page is wired to the API.
const GridCard = () => (
  <>
    <StatCard title="Pending Review" value={formatCount(28)} tone="warning" note={{ label: "Today", tone: "warning" }} noteLayout="inline" />
    <StatCard title="Approved Today" value={formatCount(12)} tone="success" note={{ label: "Today", tone: "success" }} noteLayout="inline" />
    <StatCard title="Rejected Today" value={formatCount(3)} tone="danger" note={{ label: "Today", tone: "danger" }} noteLayout="inline" />
  </>
)

export default GridCard
