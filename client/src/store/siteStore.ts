import { create } from "zustand"
import { api } from "@/lib/api"

interface Site {
  id?: string
  url: string
  status?: string
  latency?: number
}

interface SiteStore {
  sites: Site[]
  fetchSites: () => Promise<void>
  addSite: (url: string) => Promise<void>
}

export const useSiteStore = create<SiteStore>((set, get) => ({
  sites: [],

  fetchSites: async () => {
    // backend has no list endpoint
    console.log("fetchSites skipped")
  },

  addSite: async (url: string) => {

    console.log("Sending URL:", url)

    try {

      const res = await api.post("/website", { url })

      console.log("Server response:", res.data)

      const current = get().sites

      set({
        sites: [...current, { url }]
      })

    } catch (err: any) {

      console.log("Server error:", err.response?.data)

    }



  }
}))