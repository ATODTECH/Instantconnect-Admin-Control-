"use client"

import { useMemo, useState, type FormEvent } from "react"
import { ExternalLink, Lock, RefreshCw, Trash2 } from "lucide-react"
import { cn } from "cn"
import { createDataTableColumns } from "@/components/data-table/columns"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  ORGANIZERS_PAGE_SIZE,
  useAddEventbriteOrganizer,
  useEventbriteOrganizers,
  useRemoveEventbriteOrganizer,
  useSetEventbriteOrganizerActive,
  useSyncEventbriteOrganizers,
} from "@/hooks/use-eventbrite"
import { formatCount, formatTimeAgo } from "@/lib/format"
import type { EventbriteOrganizer } from "@/types/admin-eventbrite"

const NO_ORGANIZERS: EventbriteOrganizer[] = []

const column = createDataTableColumns<EventbriteOrganizer>()

function organizerColumns(onToggle: (organizer: EventbriteOrganizer, isActive: boolean) => void, onRemove: (organizer: EventbriteOrganizer) => void) {
  return column.columns([
    column.display({
      id: "organizer",
      header: "Organizer",
      meta: { cellClassName: "max-w-72" },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <a
            href={row.original.pageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 truncate font-semibold text-neutral-light-600 hover:text-primary"
          >
            <span className="truncate">{row.original.name ?? "Waiting for first sync"}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </a>
          <span className="text-xs text-neutral-light-400">ID {row.original.organizerId}</span>
        </div>
      ),
    }),
    column.accessor("upcomingEventCount", {
      header: "Upcoming Events",
      meta: { cellClassName: "font-medium text-neutral-light-400" },
      cell: ({ getValue }) => formatCount(getValue()),
    }),
    column.display({
      id: "sync",
      header: "Last Sync",
      meta: { cellClassName: "max-w-64" },
      cell: ({ row }) => {
        const { lastSyncedAt, lastSyncError } = row.original
        if (!lastSyncedAt) return <span className="text-neutral-light-400">Not yet</span>
        if (lastSyncError) {
          return (
            <span title={lastSyncError}>
              <StatusBadge tone="danger">Failed {formatTimeAgo(lastSyncedAt)}</StatusBadge>
            </span>
          )
        }
        return <span className="whitespace-nowrap text-neutral-light-400">{formatTimeAgo(lastSyncedAt)}</span>
      },
    }),
    column.display({
      id: "addedBy",
      header: "Added By",
      meta: { cellClassName: "whitespace-nowrap text-neutral-light-400" },
      cell: ({ row }) => row.original.addedByName ?? "Initial list",
    }),
    column.display({
      id: "active",
      header: "Importing",
      cell: ({ row }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={(checked) => onToggle(row.original, checked)}
          aria-label={`Import events from ${row.original.name ?? row.original.organizerId}`}
        />
      ),
    }),
    column.display({
      id: "actions",
      header: "Action",
      meta: { headerClassName: "text-right", cellClassName: "text-right" },
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onRemove(row.original)}
          aria-label={`Remove ${row.original.name ?? row.original.organizerId}`}
          className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1 text-xs font-medium text-[#C92B2B] hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
          Remove
        </button>
      ),
    }),
  ])
}

/**
 * Eventbrite has no location search, so its events reach the app only from
 * the organizers listed here. Imports run every 6 hours and when one is added.
 */
const EventbriteOrganizers = () => {
  const [page, setPage] = useState(1)
  const [link, setLink] = useState("")
  const [removing, setRemoving] = useState<EventbriteOrganizer | null>(null)

  const sync = useSyncEventbriteOrganizers()
  const { data, isPending, isError, error, refetch, isRefetching, isPlaceholderData, isFetching } = useEventbriteOrganizers(page)
  const add = useAddEventbriteOrganizer()
  const { mutate: setActive } = useSetEventbriteOrganizerActive()
  const remove = useRemoveEventbriteOrganizer()

  const tokenMissing = data?.tokenConfigured === false
  const isSyncing = data?.isSyncing ?? false
  const columns = useMemo(
    () => organizerColumns((organizer, isActive) => setActive({ id: organizer.id, isActive }), setRemoving),
    [setActive],
  )

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!link.trim()) return
    add.mutate(link.trim(), { onSuccess: () => setLink("") })
  }

  const confirmRemove = () => {
    if (!removing) return
    remove.mutate(removing.id, { onSettled: () => setRemoving(null) })
  }

  return (
    <section aria-labelledby="eventbrite-organizers" className="flex flex-col gap-y-4">
      <div className="rounded-2xl border border-gray-200 bg-neutral-white p-5 shadow-[0px_0px_10px_0px_#0000000A]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 id="eventbrite-organizers" className="text-base font-bold text-neutral-light-600">Eventbrite Organizers</h2>
            <p className="mt-1 text-sm text-neutral-light-400">
              Members see public, in person events from these organizers in Around You, with a link to register on Eventbrite. Eventbrite has no
              search by city, so new organizers have to be added here. Imports run every 6 hours.
            </p>
          </div>
          <Button variant="outline" onClick={() => sync.mutate()} loading={sync.isPending} disabled={tokenMissing || isSyncing}>
            <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} aria-hidden />
            {isSyncing ? "Importing" : "Sync now"}
          </Button>
        </div>

        {tokenMissing && (
          <div role="note" className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
            <p className="text-sm text-amber-900">
              <span className="font-semibold">Imports are off.</span> EVENTBRITE_TOKEN is not set on the server, so nothing is imported and
              organizers can&apos;t be added.
            </p>
          </div>
        )}

        <form onSubmit={submit} className="mt-4 flex flex-wrap items-center gap-3">
          <label htmlFor="organizer-link" className="sr-only">Organizer page link</label>
          <Input
            id="organizer-link"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://www.eventbrite.com/o/organizer-name-1234567890"
            disabled={tokenMissing}
            className="h-9 max-w-xl flex-1 rounded-lg border-slate-200 text-sm"
          />
          <Button type="submit" loading={add.isPending} disabled={tokenMissing || !link.trim()}>
            Add organizer
          </Button>
        </form>
      </div>

      <DataTable
        label="Eventbrite organizers"
        columns={columns}
        data={data?.items ?? NO_ORGANIZERS}
        getRowId={(row) => row.id}
        isLoading={isPending}
        isRefreshing={isPlaceholderData && isFetching}
        skeletonRows={4}
        error={isError ? error : null}
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        emptyMessage="No organizers yet. Paste an organizer's Eventbrite page link above."
        minWidthClassName="min-w-[800px]"
        footer={
          <DataTablePagination
            page={page}
            pageSize={ORGANIZERS_PAGE_SIZE}
            total={data?.page.total ?? 0}
            onPageChange={setPage}
            noun={{ one: "organizer", other: "organizers" }}
            isLoading={isPending}
          />
        }
      />

      <AlertDialog open={removing !== null} onOpenChange={(open) => !open && setRemoving(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-50 text-[#EF4444]">
              <Trash2 aria-hidden />
            </AlertDialogMedia>
            <AlertDialogTitle>Remove {removing?.name ?? "this organizer"}?</AlertDialogTitle>
            <AlertDialogDescription>
              Its {removing ? formatCount(removing.upcomingEventCount) : 0} upcoming events disappear from the app, along with who said they
              were going. Past events stay. To stop new imports but keep what is listed, switch Importing off instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={remove.isPending}>Cancel</AlertDialogCancel>
            <Button variant="danger" loading={remove.isPending} onClick={confirmRemove}>
              Remove organizer
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

export default EventbriteOrganizers
