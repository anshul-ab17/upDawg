"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addSite } from "@/store/siteSlice"
import type { AppDispatch } from "@/store/store"

export default function AddSiteForm() {

  const [url, setUrl] = useState("")
  const dispatch = useDispatch<AppDispatch>()

  const submit = async () => {

    console.log("URL typed:", url)

    if (!url.trim()) {
      alert("URL required")
      return
    }

    await dispatch(addSite(url))

    setUrl("")
  }

  return (
    <div className="flex gap-2">

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="border p-2 text-black"
      />

      <button
        type="button"
        onClick={submit}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Add
      </button>

    </div>
  )
}