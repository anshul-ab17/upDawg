"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { createWebsite } from "@/store/websiteSlice"
import { AppDispatch } from "@/store/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AddSiteForm() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAdd = async () => {
    if (!url.trim()) return
    setError("")
    setLoading(true)

    const normalized = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`
    const result = await dispatch(createWebsite(normalized))

    if (createWebsite.rejected.match(result)) {
      const status = result.payload
      if (status === 400) {
        setError("Not signed in. Please sign in again.")
        router.push("/signin")
      } else {
        setError("Failed to add website. Try again.")
      }
    } else {
      setUrl("")
    }

    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="google.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button onClick={handleAdd} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
