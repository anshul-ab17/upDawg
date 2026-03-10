import Link from "next/link"
import { Activity } from "lucide-react"

const LINKS = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Pricing", href: "/#pricing" },
  ],
  Account: [
    { label: "Sign in", href: "/signin" },
    { label: "Sign up", href: "/signup" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Activity className="size-5 text-primary" />
              upDawg
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Real-time uptime monitoring with instant alerts. Keep your sites up.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</p>
              <ul className="space-y-2">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} upDawg. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with Rust + Next.js</p>
        </div>
      </div>
    </footer>
  )
}
