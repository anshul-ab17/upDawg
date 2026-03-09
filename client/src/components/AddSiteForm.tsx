"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addWebsite } from "@/store/websiteSlice"

export default function AddSiteForm() {

  const [url, setUrl] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  const handleAdd = async () => {

    if (!url.trim()) {
      alert("URL required")
      return
    }

    dispatch(addWebsite(url))

    setUrl("")
  }

  return (
    <div className="flex gap-3">

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="border p-2 text-black"
      />

      <button
        type="button"
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Add
      </button>

    </div>
  )
}