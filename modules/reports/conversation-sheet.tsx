"use client"

import { cn } from "cn"
import { DetailSheet } from "@/components/shared/detail-sheet"
import { useReportConversation } from "@/hooks/use-reports"
import type { ReportMessage, UserReport } from "@/types/admin-reports"

const timeFormat = new Intl.DateTimeFormat("en-NG", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
})

const MessageBubble = ({ message, report }: { message: ReportMessage, report: UserReport }) => {
  if (message.kind === "system") {
    return <p className="text-center text-xs text-neutral-light-300">{message.body}</p>
  }

  const fromReported = message.senderId === report.reportedUser.id
  const sender = fromReported ? report.reportedUser.fullName : report.reporter.fullName

  return (
    <div className={cn("flex max-w-[85%] flex-col gap-1", fromReported ? "self-start" : "self-end items-end")}>
      <span className="text-[11px] font-semibold text-neutral-light-400">
        {sender}
        {fromReported ? " (reported)" : " (reporter)"}
      </span>
      <div
        className={cn(
          "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
          fromReported ? "bg-rose-50 text-neutral-light-600" : "bg-slate-100 text-neutral-light-600",
        )}
      >
        {message.mediaUrl && (
          <a href={message.mediaUrl} target="_blank" rel="noreferrer" className="block text-xs font-semibold text-primary underline">
            View photo
          </a>
        )}
        {message.kind === "meetup" ? <em className="text-neutral-light-400">Meetup update</em> : message.body}
      </div>
      <span className="text-[11px] text-neutral-light-300">{timeFormat.format(new Date(message.createdAt))}</span>
    </div>
  )
}

interface ConversationSheetProps {
  report: UserReport | null
  onClose: () => void
}

/**
 * The chat between the reporter and the reported member, for reviewing a
 * report. The server logs every time this opens, since it is a private chat.
 */
export const ConversationSheet = ({ report, onClose }: ConversationSheetProps) => {
  const { data, isPending, isError, error } = useReportConversation(report?.id ?? null)

  return (
    <DetailSheet
      open={report !== null}
      onOpenChange={(open) => !open && onClose()}
      title="Conversation"
      description={report ? `Messages between ${report.reporter.fullName} and ${report.reportedUser.fullName}. Opening this is logged.` : ""}
      showDescription
    >
      {isPending && <p className="text-sm text-neutral-light-300">Loading messages…</p>}
      {isError && <p className="text-sm text-rose-600">{error.message}</p>}
      {data && report && (
        <div className="flex flex-col gap-4">
          {!data.exists && <p className="text-sm text-neutral-light-400">These two members never chatted.</p>}
          {data.truncated && <p className="text-xs text-neutral-light-300">Showing the latest {data.messages.length} messages.</p>}
          {data.messages.map((message) => (
            <MessageBubble key={message.id} message={message} report={report} />
          ))}
        </div>
      )}
    </DetailSheet>
  )
}
