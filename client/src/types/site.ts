export interface Site {
  id?: string
  url: string
  status?: string
  latency?: number
}

export interface SiteStore {
  sites: Site[]
  fetchSites: () => Promise<void>
  addSite: (url: string) => Promise<void>
}