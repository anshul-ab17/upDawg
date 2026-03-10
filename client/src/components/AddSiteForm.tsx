"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addWebsite } from "@/store/websiteSlice"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function AddSiteForm() {
  const [url, setUrl] = useState("")
  const dispatch = useDispatch()

  const addSite = () => {
    dispatch(addWebsite({ url }))
    setUrl("")
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={addSite}>Add</Button>
    </div>
  )
}