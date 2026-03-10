"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Activity,
  Bell,
  Globe,
  Zap,
  Check,
  Clock,
  ShieldCheck,
  BarChart2,
  Lock,
} from "lucide-react"

// Load Three.js canvases only on client (no SSR)
const HeroCanvas  = dynamic(() => import("@/components/HeroCanvas"),  { ssr: false })
const GlobeCanvas = dynamic(() => import("@/components/GlobeCanvas"), { ssr: false })

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Globe,
    title: "HTTP Monitoring",
    desc: "We ping your URLs every 60 seconds from our monitoring node and record the HTTP status code.",
  },
  {
    icon: Bell,
    title: "Instant Email Alerts",
    desc: "The moment a site goes DOWN you get an email. When it recovers, you get another one.",
  },
  {
    icon: Zap,
    title: "Latency Tracking",
    desc: "Every check records response time in milliseconds so you can spot slowdowns before they become outages.",
  },
  {
    icon: BarChart2,
    title: "Status Dashboard",
    desc: "A clean real-time dashboard shows every monitor with its current status and latest latency at a glance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    desc: "JWT-authenticated API. Your monitors and alert config are private to your account.",
  },
  {
    icon: Clock,
    title: "Always On",
    desc: "The Rust worker runs 24/7, picking up new monitors automatically without any restarts.",
  },
]


const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started.",
    cta: "Start for free",
    ctaHref: "/signup",
    highlighted: false,
    features: [
      "Up to 10 monitors",
      "60-second check interval",
      "Email alerts",
      "7-day history",
      "REST API access",
    ],
  },
  {
    name: "Pro",
    price: "$9",
    period: "/ month",
    description: "For teams and production workloads.",
    cta: "Coming soon",
    ctaHref: "#",
    highlighted: true,
    badge: "Coming soon",
    features: [
      "Unlimited monitors",
      "30-second check interval",
      "SMS + Slack + webhook alerts",
      "90-day history & analytics",
      "Multi-region checks",
      "Status page (public)",
      "Priority support",
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter()
  const [url, setUrl] = useState("")

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-14 min-h-screen flex items-center">
        {/* Three.js background */}
        <HeroCanvas />

        {/* Radial gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Monitoring 24 / 7
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                Know when your{" "}
                <span className="text-primary">sites go down</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Real-time uptime monitoring with instant email alerts. Track latency, catch downtime, keep your users happy.
              </p>
            </div>

            <div className="flex gap-3 max-w-md">
              <Input
                placeholder="yoursite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && router.push("/signup")}
                className="h-11 bg-card/80 backdrop-blur"
              />
              <Button size="lg" className="shrink-0 h-11 px-6" onClick={() => router.push("/signup")}>
                Start monitoring
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">Free forever · No credit card required</p>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Globe, label: "HTTP checks" },
                { icon: Bell, label: "Email alerts" },
                { icon: Zap, label: "Latency tracking" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-border bg-card/70 backdrop-blur">
                  <Icon className="size-3.5 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="relative hidden lg:block">
            <div className="rounded-xl border border-border bg-card/90 backdrop-blur shadow-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/40">
                <span className="size-3 rounded-full bg-red-400/80" />
                <span className="size-3 rounded-full bg-yellow-400/80" />
                <span className="size-3 rounded-full bg-green-400/80" />
                <span className="ml-3 text-xs text-muted-foreground font-mono">upDawg — Dashboard</span>
              </div>
              {/* Mock content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Activity className="size-4 text-primary" />
                    Your monitors
                  </div>
                  <span className="text-xs text-muted-foreground">auto-refresh 30s</span>
                </div>
                {[
                  { url: "github.com", up: true, ms: 112 },
                  { url: "stripe.com", up: true, ms: 89 },
                  { url: "myapp.io", up: false, ms: null },
                  { url: "api.example.com", up: true, ms: 204 },
                  { url: "docs.myco.dev", up: true, ms: 155 },
                ].map((s) => (
                  <div
                    key={s.url}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50"
                  >
                    <span className="text-sm font-medium">{s.url}</span>
                    <div className="flex items-center gap-3">
                      {s.ms != null && <span className="text-xs text-muted-foreground">{s.ms}ms</span>}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.up
                            ? "bg-green-500/15 text-green-500"
                            : "bg-primary/15 text-primary"
                        }`}
                      >
                        {s.up ? "UP" : "DOWN"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -inset-6 -z-10 bg-primary/10 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 bg-card/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Features</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold">Everything you need to stay up</h2>
            <p className="text-muted-foreground">Simple, reliable monitoring with no fluff.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors space-y-3"
              >
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">

          {/* Section header */}
          <div className="text-center space-y-3 max-w-xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">How it works</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold">Up and running in 30 seconds</h2>
          </div>

          {/* Sticky globe left / scrolling steps right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            {/* Left — sticky globe */}
            <div className="hidden lg:block sticky top-20 h-[calc(100vh-6rem)]">
              <GlobeCanvas />
              {/* Fade right edge into background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background pointer-events-none" />
            </div>

            {/* Right — scrolling steps */}
            <div className="flex flex-col justify-center space-y-32 py-8 lg:py-24">

              {/* Step 1 */}
              <div className="space-y-4">
                <span className="text-7xl font-black text-primary/15 select-none leading-none">01</span>
                <h3 className="text-2xl font-bold">Add a URL</h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Paste any URL into your dashboard. upDawg auto-prepends <code className="text-primary text-sm">https://</code> so you can just type <code className="text-primary text-sm">yoursite.com</code> and we handle the rest.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  Instantly added to the monitoring queue
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-4">
                <span className="text-7xl font-black text-primary/15 select-none leading-none">02</span>
                <h3 className="text-2xl font-bold">We check it every 60 s</h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  Our always-on Rust worker pings your URL from the node you see on the globe. Every check records the HTTP status code and exact response latency in milliseconds.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                  <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                  Continuous 24 / 7 monitoring
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <span className="text-7xl font-black text-primary/15 select-none leading-none">03</span>
                <h3 className="text-2xl font-bold">Get alerted instantly</h3>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  The moment a site flips DOWN an email fires immediately — you can see the ping rings on the globe go silent. When it recovers you get a second email. React before your users even notice.
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                  Email alert within seconds of downtime
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-card/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Pricing</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 space-y-6 flex flex-col ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-xl shadow-primary/10"
                    : "border-border bg-card"
                }`}
              >
                {plan.badge && (
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary">
                    {plan.badge}
                  </span>
                )}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="size-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={plan.highlighted}
                  asChild={!plan.highlighted}
                >
                  {plan.highlighted ? (
                    <span className="flex items-center gap-2">
                      <Lock className="size-3.5" />
                      {plan.cta}
                    </span>
                  ) : (
                    <Link href={plan.ctaHref}>{plan.cta}</Link>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-card/40">
        <div className="max-w-3xl mx-auto px-6 space-y-10">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">FAQ</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold">Frequently asked questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {[
              {
                q: "How often does upDawg check my sites?",
                a: "Every 60 seconds. The background Rust worker continuously loops through all your monitors with no delay between cycles.",
              },
              {
                q: "What happens when a site goes down?",
                a: "An alert email is sent immediately to the address you configured in ALERT_EMAIL. When the site recovers, you receive a second recovery email so you know the issue is resolved.",
              },
              {
                q: "How many monitors can I add on the free plan?",
                a: "Up to 10 URLs on the free tier. The upcoming Pro plan will support unlimited monitors with additional features like multi-region checks and Slack/webhook alerts.",
              },
              {
                q: "Does it check HTTPS and HTTP?",
                a: "Yes. upDawg monitors any URL that resolves over HTTP or HTTPS. The frontend auto-prepends https:// if you omit the protocol, but you can manually enter http:// URLs too.",
              },
              {
                q: "How is latency measured?",
                a: "Latency is the total round-trip time from the worker's outbound request to receiving the first byte of the response, measured in milliseconds using Rust's reqwest library.",
              },
              {
                q: "Is my data private?",
                a: "Yes. All API routes are protected by JWT authentication. Your monitors and alert settings are only accessible with your token.",
              },
              {
                q: "What is the Pro plan?",
                a: "Pro is coming soon and will include unlimited monitors, 30-second check intervals, SMS/Slack/webhook alerts, 90-day history, multi-region checks, and a public status page.",
              },
            ].map(({ q, a }, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-border rounded-xl px-5 bg-card"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold">
            Start monitoring in{" "}
            <span className="text-primary">30 seconds</span>
          </h2>
          <p className="text-muted-foreground">
            Free forever. No credit card. Just add a URL and go.
          </p>
          <Button size="lg" className="h-12 px-8 text-base" asChild>
            <Link href="/signup">Create free account</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
