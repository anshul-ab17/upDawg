"use client"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Card } from "@/components/ui/card"

export default function SiteList() {
  const sites = useSelector((state: RootState) => state.websites)

  return (
    <div className="grid gap-4 mt-4">
      {sites.map((site: any, i: number) => (
        <Card key={i} className="p-4">
          {site.url}
          {/* <p>Status: {site.status}</p>
          <p>Latency: {site.latency} ms</p> */}
        </Card>
      ))}
    </div>
  )
} 