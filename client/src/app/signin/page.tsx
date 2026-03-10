"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { setToken } from "@/store/authSlice"
import { AppDispatch } from "@/store/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import Link from "next/link"

export default function SignIn() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await api.post<{ jwt: string }>("/user/signin", { username, password })
      localStorage.setItem("token", res.data.jwt)
      dispatch(setToken(res.data.jwt))
      router.push("/dashboard")
    } catch {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md px-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold">upDawg</CardTitle>
          <p className="text-base text-muted-foreground mt-1">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-base font-medium">Username</label>
              <Input
                className="h-11 text-base"
                autoComplete="username"
                placeholder="your-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-base font-medium">Password</label>
              <Input
                className="h-11 text-base"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-base text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-base text-center text-muted-foreground">
              No account?{" "}
              <Link href="/signup" className="underline text-foreground">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
