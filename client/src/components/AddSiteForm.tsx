"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { createWebsite } from "@/store/websiteSlice"
import { AppDispatch, RootState } from "@/store/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import Link from "next/link"

const FREE_LIMIT = 10

export default function AddSiteForm() {
  const dispatch = useDispatch<AppDispatch>()
  const router   = useRouter()
  const sites    = useSelector((state: RootState) => state.websites)

  const [url, setUrl]       = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")

  const atLimit = sites.length >= FREE_LIMIT

  const handleAdd = async () => {
    if (!url.trim() || atLimit) return
    setError("")
    setLoading(true)

    const normalized = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`
    const result = await dispatch(createWebsite(normalized))

    if (createWebsite.rejected.match(result)) {
      const status = result.payload
      if (status === 401) {
        setError("Not signed in. Please sign in again.")
        router.push("/signin")
      } else if (status === 402) {
        setError("Free plan limit reached. Upgrade to Pro for unlimited monitors.")
      } else {
        setError("Failed to add website. Try again.")
      }
    } else {
      setUrl("")
    }

    setLoading(false)
  }

  if (atLimit) {
    return (
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 flex items-start gap-3">
        <Lock className="size-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <p className="text-sm font-semibold">Free plan limit reached</p>
          <p className="text-sm text-muted-foreground">
            You&apos;re using {sites.length}/{FREE_LIMIT} monitors on the free plan.{" "}
            <Link href="/#pricing" className="text-primary underline underline-offset-2 hover:text-primary/80">
              Upgrade to Pro
            </Link>{" "}
            for unlimited monitors.
          </p>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/15 text-primary shrink-0">
          {sites.length} / {FREE_LIMIT}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <Input
          placeholder="site.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          {sites.length} / {FREE_LIMIT}
        </span>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
