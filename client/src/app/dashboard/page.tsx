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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Activity, UserCircle, LogOut } from "lucide-react"

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

    const interval = setInterval(() => {
      dispatch(fetchWebsites())
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch, router])

  const handleSignOut = () => {
    localStorage.removeItem("token")
    dispatch(clearToken())
    router.push("/signin")
  }

  if (!ready) return null

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Activity className="size-5 text-primary" />
            upDawg
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full p-1 hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <UserCircle className="size-7 text-primary" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-14">
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Your monitors</h1>
            <p className="text-sm text-muted-foreground mt-1">Auto-refreshes every 30 seconds</p>
          </div>
          <AddSiteForm />
          <SiteList />
        </div>
      </main>
    </div>
  )
}
