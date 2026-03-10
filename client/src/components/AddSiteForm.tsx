"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { createWebsite } from "@/store/websiteSlice"
import { AppDispatch } from "@/store/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AddSiteForm() {
  const dispatch = useDispatch<AppDispatch>()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!url.trim()) return
    setLoading(true)
    await dispatch(createWebsite(url.trim()))
    setUrl("")
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <Button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
    </div>
  )
}
