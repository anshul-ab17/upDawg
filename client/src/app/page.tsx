import AddSiteForm from "@/components/AddSiteForm"
import SiteList from "@/components/SiteList"
export default function Home() {
  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">
        Updawg 
      </h1>
      <AddSiteForm/>
      <SiteList/>

    </main>
  )
}