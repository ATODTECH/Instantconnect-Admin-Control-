import { AvatarGroup } from "@/components/ui/avatar"
import { formatCount } from "@/lib/format"
import { UserAvatar } from "./user-avatar"

interface AvatarStackProps {
  people: readonly { id: string, name: string, avatar?: string | null }[]
  /** Everyone, including those not shown, for the "+N more" count. */
  total: number
  max?: number
}

/** Overlapping faces with a count of the rest, e.g. attendees or members. */
export const AvatarStack = ({ people, total, max = 6 }: AvatarStackProps) => {
  const shown = people.slice(0, max)

  return (
    <div className="flex items-center gap-3">
      <AvatarGroup>
        {shown.map((person) => (
          <UserAvatar key={person.id} name={person.name} src={person.avatar || null} />
        ))}
      </AvatarGroup>
      {total > shown.length && (
        <span className="text-sm font-medium text-neutral-light-300">+{formatCount(total - shown.length)} more</span>
      )}
    </div>
  )
}
