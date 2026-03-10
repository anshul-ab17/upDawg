import AddSiteForm from "@/components/AddSiteForm"
import SiteList from "@/components/SiteList"

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Website Monitor</h1>

      <AddSiteForm />

      <SiteList />
    </main>
  )
}