"use client"

import { useState, type FormEvent } from "react"
import { Lock, MessageSquare, Trash2, UserPlus } from "lucide-react"
import { cn } from "cn"
import { AvatarStack } from "@/components/shared/avatar-stack"
import { DetailSection, MetricTile } from "@/components/shared/detail-parts"
import { StatusBadge } from "@/components/shared/status-badge"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { WidgetError } from "@/components/widget-state"
import {
  useCommunity,
  useCreateOfficialPost,
  useDeleteOfficialPost,
  useOfficialPosts,
  useReportedPosts,
  useResolveReport,
} from "@/hooks/use-communities"
import { formatCount, formatTimeAgo } from "@/lib/format"
import type { AdminCommunityDetail, ReportedPost, ReportReason } from "@/types/admin-communities"
import { formatDay } from "../../events/constants"
import { STATUS_LABELS, categoryTone, initialColour } from "../constants"

const POST_MAX = 2000

const REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam",
  harassment: "Harassment",
  misinformation: "Misinformation",
  hate_speech: "Hate speech",
  violence: "Violence",
  sexual_content: "Sexual content",
  other: "Other",
}

const DetailsSkeleton = () => (
  <div role="status" className="flex flex-col gap-5">
    <span className="sr-only">Loading community</span>
    <div className="flex gap-4">
      <Skeleton className="h-16 w-16 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-20 rounded-xl" />)}
    </div>
    <Skeleton className="h-24 w-full" />
  </div>
)

interface CommunityDetailsProps {
  communityId: string
  onDelete: (community: AdminCommunityDetail) => void
}

const CommunityDetails = ({ communityId, onDelete }: CommunityDetailsProps) => {
  const { data: community, isPending, isError, error, refetch, isRefetching } = useCommunity(communityId)

  if (isPending) return <DetailsSkeleton />
  if (isError) {
    return <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-16" />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        {community.coverUrl ? (
          // A Cloudinary URL sized on the server; next/image would need the host allow-listed for no gain.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={community.coverUrl} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
        ) : (
          <span
            aria-hidden
            className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-semibold text-white", initialColour(community.id))}
          >
            {community.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-neutral-light-600 wrap-break-word">{community.name}</h3>
            {community.isOfficial ? (
              <StatusBadge tone="brand">Official</StatusBadge>
            ) : community.categoryLabel ? (
              <StatusBadge tone={categoryTone(community.categoryId)}>{community.categoryLabel}</StatusBadge>
            ) : null}
          </div>
          <p className="text-sm text-neutral-light-400">
            Created by <span className="font-semibold text-neutral-light-500">{community.creator?.fullName ?? (community.isOfficial ? "Safety Team" : "a deleted account")}</span>
          </p>
          <p className="text-xs text-neutral-light-400">
            Date: {formatDay(community.createdAt)} ·{" "}
            <span className={cn("font-medium", community.status === "reported" && "text-[#C92B2B]")}>{STATUS_LABELS[community.status].label}</span>
            {!community.isPublic && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Lock className="h-3 w-3" aria-hidden /> Private
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricTile label="Members" value={formatCount(community.memberCount)} note={{ label: `+${formatCount(community.membersThisWeek)} this week`, tone: "success" }} />
        <MetricTile
          label="Posts This Week"
          value={formatCount(community.postsThisWeek)}
          note={community.postsThisWeek > 0 ? { label: "Active discussion", tone: "brand" } : { label: "Quiet this week", tone: "neutral" }}
        />
        <MetricTile label="Total Posts" value={formatCount(community.postCount)} />
        <MetricTile
          label="Reports"
          value={formatCount(community.reportedPostCount)}
          note={community.reportedPostCount > 0 ? { label: "Requires audit", tone: "danger" } : { label: "None open", tone: "neutral" }}
        />
      </div>

      {community.description && (
        <DetailSection title="About Community">
          <p className="text-sm leading-relaxed text-neutral-light-500">{community.description}</p>
        </DetailSection>
      )}

      <DetailSection title="Recent Activity">
        {community.recentActivity.length === 0 ? (
          <p className="text-sm text-neutral-light-400">Nothing yet.</p>
        ) : (
          <ul className="space-y-3">
            {community.recentActivity.map((activity, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F4F3F5] text-neutral-light-400">
                  {activity.kind === "joined" ? <UserPlus className="h-3.5 w-3.5" aria-hidden /> : <MessageSquare className="h-3.5 w-3.5" aria-hidden />}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-neutral-light-600">
                    {activity.kind === "joined" ? `${activity.actorName} joined the community` : `New post by ${activity.actorName}`}
                    {activity.excerpt && <span className="text-neutral-light-400">: “{activity.excerpt}”</span>}
                  </p>
                  <p className="text-xs text-neutral-light-300">{formatTimeAgo(activity.occurredAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DetailSection>

      <DetailSection title={`Members (${formatCount(community.memberCount)})`}>
        {community.isOfficial ? (
          <p className="text-sm text-neutral-light-400">Every active member belongs to the Safety Community.</p>
        ) : community.memberPreview.length === 0 ? (
          <p className="text-sm text-neutral-light-400">No members.</p>
        ) : (
          <AvatarStack
            people={community.memberPreview.map((person) => ({ id: person.id, name: person.fullName, avatar: person.avatarUrl }))}
            total={community.memberCount}
          />
        )}
      </DetailSection>

      <CommunityReports communityId={community.id} />

      {community.isOfficial && <SafetyTeamPosts />}

      {!community.isOfficial && (
        <div className="border-t border-gray-100 pt-5">
          <Button variant="danger" className="w-full" onClick={() => onDelete(community)}>
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete community
          </Button>
        </div>
      )}
    </div>
  )
}

/** Open reports on this community's posts: remove hides the post, dismiss keeps it. */
const CommunityReports = ({ communityId }: { communityId: string }) => {
  const { data, isPending, isError, error, refetch, isRefetching } = useReportedPosts(communityId, "open")

  return (
    <DetailSection title="Reported Posts">
      {isPending ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : isError ? (
        <WidgetError message={error.message} onRetry={() => refetch()} isRetrying={isRefetching} className="py-6" />
      ) : data.items.length === 0 ? (
        <p className="text-sm text-neutral-light-400">No open reports.</p>
      ) : (
        <div className="space-y-3">
          {data.items.map((post) => <ReportCard key={post.postId} post={post} />)}
        </div>
      )}
    </DetailSection>
  )
}

const ReportCard = ({ post }: { post: ReportedPost }) => {
  const resolve = useResolveReport()

  return (
    <article className="space-y-3 rounded-xl border border-red-100 bg-[#FFFBFB] p-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <UserAvatar name={post.author.fullName} src={post.author.avatarUrl} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-light-600">{post.author.fullName}</p>
            <p className="text-xs text-neutral-light-400">posted {formatTimeAgo(post.postedAt)}</p>
          </div>
        </div>
        <StatusBadge tone="danger">
          {post.reportCount} {post.reportCount === 1 ? "report" : "reports"}
        </StatusBadge>
      </header>
      {post.body && <p className="whitespace-pre-line text-sm text-neutral-light-500">{post.body}</p>}
      {post.mediaUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- a remote, user uploaded image of unknown size
        <img src={post.mediaUrl} alt="Photo in the reported post" className="max-h-48 rounded-lg object-cover" />
      )}
      <div className="flex flex-wrap gap-1.5">
        {post.reasons.map(({ reason, count }) => (
          <StatusBadge key={reason} tone="warning">
            {REASON_LABELS[reason]}
            {count > 1 ? ` × ${count}` : ""}
          </StatusBadge>
        ))}
      </div>
      {post.details.map((detail, index) => (
        <p key={index} className="text-xs text-neutral-light-400">“{detail}”</p>
      ))}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" disabled={resolve.isPending} onClick={() => resolve.mutate({ postId: post.postId, outcome: "dismiss" })}>
          Dismiss
        </Button>
        <Button variant="danger" size="sm" loading={resolve.isPending} onClick={() => resolve.mutate({ postId: post.postId, outcome: "remove" })}>
          Remove post
        </Button>
      </div>
    </article>
  )
}

/** Posting to the Safety Community, which every member sees, as the Safety Team. */
const SafetyTeamPosts = () => {
  const [body, setBody] = useState("")
  const { data, isPending } = useOfficialPosts(true)
  const create = useCreateOfficialPost()
  const remove = useDeleteOfficialPost()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!body.trim()) return
    create.mutate(body.trim(), { onSuccess: () => setBody("") })
  }

  return (
    <DetailSection title="Post as the Safety Team">
      <form onSubmit={submit} className="space-y-2">
        <label htmlFor="official-post" className="sr-only">Post</label>
        <Textarea
          id="official-post"
          value={body}
          maxLength={POST_MAX}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Share a safety tip, a trust report, or an update from the team…"
          className="min-h-24 rounded-xl border-slate-200 text-sm"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-light-400">Every member sees it, with the admin badge.</span>
          <Button type="submit" variant="brand" size="sm" loading={create.isPending} disabled={!body.trim()}>
            Post
          </Button>
        </div>
      </form>
      <ul className="mt-4 space-y-2">
        {isPending ? (
          <Skeleton className="h-16 w-full rounded-xl" />
        ) : (
          data?.items.map((post) => (
            <li key={post.id} className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 p-3">
              <div className="min-w-0">
                <p className="text-xs text-neutral-light-400">{post.author.fullName} · {formatTimeAgo(post.createdAt)}</p>
                <p className="line-clamp-3 text-sm text-neutral-light-500">{post.body}</p>
              </div>
              <button
                type="button"
                aria-label="Delete post"
                onClick={() => remove.mutate(post.id)}
                disabled={remove.isPending}
                className="rounded-md p-1 text-neutral-light-400 hover:bg-red-50 hover:text-[#C92B2B]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))
        )}
      </ul>
    </DetailSection>
  )
}

export default CommunityDetails
