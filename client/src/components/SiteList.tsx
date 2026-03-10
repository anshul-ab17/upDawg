"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Website } from "@/store/websiteSlice"
import { Card } from "@/components/ui/card"

function StatusBadge({ status }: { status?: boolean | null }) {
  if (status === undefined || status === null) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Pending</span>
  }
  return status
    ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">UP</span>
    : <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">DOWN</span>
}

export default function SiteList() {
  const sites = useSelector((state: RootState) => state.websites)

  if (sites.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No websites added yet.</p>
  }

  return (
    <div className="grid gap-3">
      {sites.map((site: Website) => (
        <Card key={site.id} className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium truncate">{site.url}</span>
          <div className="flex items-center gap-3 shrink-0">
            {site.latency !== undefined && (
              <span className="text-xs text-muted-foreground">{site.latency}ms</span>
            )}
            <StatusBadge status={site.status} />
          </div>
        </Card>
      ))}
    </div>
  )
}
