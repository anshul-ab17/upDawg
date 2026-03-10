"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Loader2, CheckCircle2 } from "lucide-react"

interface Profile {
  username: string
  alert_email: string | null
}

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const [profile, setProfile]   = useState<Profile | null>(null)
  const [email, setEmail]       = useState("")
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState("")

  useEffect(() => {
    api.get<Profile>("/user/profile").then((res) => {
      setProfile(res.data)
      setEmail(res.data.alert_email ?? "")
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSaved(false)
    try {
      const res = await api.patch<Profile>("/user/profile", {
        alert_email: email.trim() || null,
      })
      setProfile(res.data)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError("Failed to save. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold">Profile settings</h2>
          {profile && (
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          )}
        </div>

        {/* Alert email field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-1.5">
            <Bell className="size-3.5 text-primary" />
            Alert email
          </label>
          <p className="text-xs text-muted-foreground">
            Downtime alerts are sent to this address. Leave blank to disable alerts.
          </p>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            className="h-10"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="min-w-24">
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saved ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4" /> Saved
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
