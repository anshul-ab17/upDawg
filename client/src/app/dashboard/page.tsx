"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { AppDispatch, RootState } from "@/store/store"
import { fetchWebsites } from "@/store/websiteSlice"
import { clearToken, loadToken } from "@/store/authSlice"
import AddSiteForm from "@/components/AddSiteForm"
import SiteList from "@/components/SiteList"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth.token)

  useEffect(() => {
    dispatch(loadToken())
  }, [dispatch])

  useEffect(() => {
    if (token === null && typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push("/signin")
      return
    }
    if (token) {
      dispatch(fetchWebsites())
    }
  }, [token, dispatch, router])

  const handleSignOut = () => {
    dispatch(clearToken())
    router.push("/signin")
  }

  return (
    <main className="max-w-2xl mx-auto mt-10 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">upDawg</h1>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>

      <AddSiteForm />
      <SiteList />
    </main>
  )
}
