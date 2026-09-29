import { Calendar, MessageSquare, UserPlus } from "lucide-react"
import { AvatarStack } from "@/components/shared/avatar-stack"
import { MetricTile } from "@/components/shared/detail-parts"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { formatCount } from "@/lib/format"
import { generateAttendees } from "@/modules/events/mock-data"
import { CATEGORY_TONE, fmtDate } from "../constants"

const RULES = [
  "Keep discussions engineering and tech-focused. No politics or irrelevant topics.",
  "Be highly collaborative and respectful. Mutual growth is our focal mission.",
  "No spam, recruitment scams, or self-promoting solicitations.",
]

const RECENT = [
  { icon: UserPlus, text: "Kolawole J. joined the community", when: "2 hours ago" },
  { icon: MessageSquare, text: "New discussion: 'React Native vs Flutter in 2026' by Tunde", when: "4 hours ago" },
  { icon: Calendar, text: "Amina Y. created 'AI Builders Mixer' event", when: "Yesterday" },
]

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <section className="border-b-[.5px] border-b-[#F4F3F5] pb-5">
    <h4 className="mb-3 text-sm font-bold text-neutral-light-600">{title}</h4>
    {children}
  </section>
)

const CommunityDetails = ({ community }: { community: CommunityRow }) => (
  <div className="flex flex-col gap-5">
    <div className="flex items-start gap-3 border-b-[.5px] border-b-[#F4F3F5] pb-5">
      <UserAvatar
        name={community.communityName}
        src={community.communityAvatar || null}
        size="xl"
        shape="square"
        fallback={community.communityName[0]}
      />
      <div className="flex flex-col">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-neutral-light-600">{community.communityName}</h3>
          <StatusBadge tone={CATEGORY_TONE[community.category]}>{community.category}</StatusBadge>
        </div>
        <p className="text-[13px] font-semibold text-neutral-light-400">
          Created by <span className="text-neutral-light-600">{community.createdBy}</span>
        </p>
        <p className="text-xs text-neutral-light-400">
          Date: <span className="text-neutral-light-300">{fmtDate(community.dateCreated)}</span>
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-5 border-b-[.5px] border-b-[#F4F3F5] pb-5">
      <MetricTile label="Members" value={formatCount(community.members)} note={{ label: "+124 this week", tone: "success" }} />
      <MetricTile label="Posts This Week" value={formatCount(community.weeklyPost)} note={{ label: "Active discussion", tone: "brand" }} />
      <MetricTile label="Total Posts" value={formatCount(community.totalPost)} />
      <MetricTile label="Reports" value="2" note={{ label: "Requires audit", tone: "danger" }} />
    </div>

    <Section title="About Community">
      <p className="text-[13px] leading-5 text-neutral-light-400">{community.about}</p>
    </Section>

    <Section title="Community Rules">
      <ol className="flex flex-col gap-2.5 text-[13px] leading-4.5 text-neutral-light-400">
        {RULES.map((rule, index) => (
          <li key={rule} className="flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-primary">{index + 1}</span>
            <p>{rule}</p>
          </li>
        ))}
      </ol>
    </Section>

    <Section title="Recent Activity">
      <ul className="flex flex-col gap-y-2">
        {RECENT.map(({ icon: Icon, text, when }) => (
          <li key={text} className="flex items-center gap-x-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F4F3F5]">
              <Icon className="h-3.5 w-3.5 text-neutral-light-300" aria-hidden />
            </span>
            <span className="flex flex-col">
              <span className="text-[13px] font-medium text-neutral-light-600">{text}</span>
              <span className="text-[11px] text-ic-muted">{when}</span>
            </span>
          </li>
        ))}
      </ul>
    </Section>

    <section className="flex flex-col gap-y-4">
      <h4 className="text-base font-semibold text-[#1F1D24]">Members ({formatCount(community.members)})</h4>
      <AvatarStack people={generateAttendees(Math.min(community.members, 6))} total={community.members} />
    </section>
  </div>
)

export default CommunityDetails
