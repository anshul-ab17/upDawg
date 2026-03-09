"use client"
import { useEffect } from "react"
import { useSiteStore } from "@/store/siteStore"

export default function SiteList(){
  const { sites, fetchSites } = useSiteStore()
  useEffect(()=>{
    fetchSites()
  },[])

  return (
    <div className="space-y-2">
      {sites.map((site)=>(
        <div key={site.id} className="border p-4 rounded">
          <div>{site.url}</div>
          <div>Status: {site.status ?? "unknown"}</div>
          <div>Latency: {site.latency ?? "-"} ms</div>
        </div>
      ))}
    </div>

  )
}