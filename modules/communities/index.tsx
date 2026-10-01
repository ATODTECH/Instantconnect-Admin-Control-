import { MessageCircle } from "lucide-react"
import { NotLiveYet } from "@/components/shared/not-live-yet"

const CommunitiesHomeIndex = () => (
  <NotLiveYet
    icon={MessageCircle}
    title="Communities aren't live yet"
    reason="Members can't create or join communities in the app yet, so there's nothing to manage here. This page will fill in once communities ship."
    planned={[
      "Every community, with its creator, category and member count",
      "Reported communities waiting for review",
      "Weekly activity and growth",
    ]}
  />
)

export default CommunitiesHomeIndex
