"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch } from "@/store/store"
import { fetchWebsites } from "@/store/websiteSlice"
import { clearToken } from "@/store/authSlice"
import AddSiteForm from "@/components/AddSiteForm"
import SiteList from "@/components/SiteList"
import ThemeToggle from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    setReady(true)
    dispatch(fetchWebsites())
  }, [dispatch, router])

  const handleSignOut = () => {
    localStorage.removeItem("token")
    dispatch(clearToken())
    router.push("/signin")
  }

  if (!ready) return null

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">upDawg</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>

      <AddSiteForm />
      <SiteList />
    </main>
  )
}
