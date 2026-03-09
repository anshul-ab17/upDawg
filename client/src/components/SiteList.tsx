"use client"

import { useSites } from "../hooks/useSites"

export default function SiteList() {
  const { sites, isLoading } = useSites()

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      {sites?.map((site) => (
        <div key={site.id}>
          <p>{site.url}</p>
          <p>Status: {site.status}</p>
          <p>Latency: {site.latency} ms</p>
        </div>
      ))}
    </div>
  )
}