"use client"

import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import { Website, removeWebsite } from "@/store/websiteSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

function StatusBadge({ status }: { status?: boolean | null }) {
  if (status === undefined || status === null) {
    return <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Pending</span>
  }
  return status
    ? <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">UP</span>
    : <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">DOWN</span>
}

export default function SiteList() {
  const sites = useSelector((state: RootState) => state.websites)
  const dispatch = useDispatch<AppDispatch>()

  if (sites.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-8">No websites added yet.</p>
  }

  return (
    <div className="grid gap-3">
      {sites.map((site: Website) => (
        <Card key={site.id} className="p-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium truncate flex-1">{site.url}</span>
          <div className="flex items-center gap-3 shrink-0">
            {site.latency != null && (
              <span className="text-xs text-muted-foreground">{site.latency}ms</span>
            )}
            <StatusBadge status={site.status} />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => dispatch(removeWebsite(site.id))}
              aria-label="Remove"
            >
              <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
