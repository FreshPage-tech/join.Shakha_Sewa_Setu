import { useEffect, useState } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react"
import { leaderBeePath, type ShakhaTenant } from "../data/shakhaDirectory"
import { resolveLeaderBeeTenant } from "../leaderBeeApi"
import ShakhaTracksComparison from "./ShakhaTracksComparison"
import LeaderBeeProgramPage from "./LeaderBeeProgramPage"
import LeaderBeeShareKit from "./LeaderBeeShareKit"
import LeaderBeeRegistration from "./LeaderBeeRegistration"
import LeaderBeeCurriculum from "./LeaderBeeCurriculum"

const button =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4"
const whatsapp = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`

export default function ShakhaLeaderBeePage() {
  const [search, setSearch] = useState(window.location.search)
  const params = new URLSearchParams(search)
  const slug = params.get("shakha") || ""
  const [tenant, setTenant] = useState<ShakhaTenant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    const change = () => setSearch(window.location.search)
    window.addEventListener("popstate", change)
    return () => window.removeEventListener("popstate", change)
  }, [])
  useEffect(() => {
    let cancelled = false
    setTenant(null)
    setError("")
    setLoading(true)
    if (!slug) {
      setLoading(false)
      return
    }
    resolveLeaderBeeTenant(slug)
      .then((value) => {
        if (!cancelled) setTenant(value)
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Unable to load that branch. Please select a location below.",
          )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])
  useEffect(() => {
    if (!tenant) return
    document.title = `${tenant.name} | Leader-BEE · 10-week leadership program`
    const description = `Leader-BEE at ${tenant.name}. Grades K–8 · ${tenant.timing} · ${tenant.address}. Join the family Shakha and youth leadership tracks.`
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', document.title],
      ['meta[property="og:description"]', description],
      [
        'meta[property="og:url"]',
        new URL(leaderBeePath(tenant.slug), window.location.origin).href,
      ],
    ]) {
      document.querySelector(selector)?.setAttribute("content", content)
    }
    const target = window.location.hash.slice(1)
    if (target)
      requestAnimationFrame(() =>
        document.getElementById(target)?.scrollIntoView({ block: "start" }),
      )
  }, [tenant, search])
  const registered = (id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set("shakha", tenant!.slug)
    url.searchParams.set("view", "curriculum")
    url.searchParams.set("registration", id)
    url.hash = "curriculum"
    window.history.pushState({}, "", url)
    setSearch(url.search)
  }
  if (!slug) return <LeaderBeeProgramPage />
  if (loading)
    return (
      <main className="p-12 text-center" role="status">
        Loading your Shakha…
      </main>
    )
  if (!tenant)
    return (
      <LeaderBeeProgramPage
        branchNotice={
          error ||
          "That branch link was not found. Please select your branch below."
        }
      />
    )
  const mukhya = tenant.record?.leaders?.find((leader) =>
    /mukhya.*shikshak/i.test(leader.role),
  )
  const karyawah = tenant.record?.leaders?.find((leader) =>
    /karyawah|karyavah/i.test(leader.role),
  )
  const rsvpPhone = karyawah?.mobile || tenant.whatsappNumber
  const viewCurriculum = params.get("view") === "curriculum"
  return (
    <main className="min-h-screen bg-[#faf9f6] text-slate-900">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
          <a
            href={leaderBeePath()}
            className="text-lg font-black tracking-tight"
          >
            LEADER<span className="text-orange-700">-BEE</span>
          </a>
          <a
            href={`${leaderBeePath()}#find-shakha`}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Change branch
          </a>
        </nav>
        {tenant.isDemo && (
          <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            Sample branch · This event, schedule, venue, and coordinator are
            fictional examples. Registration and direct contact are disabled.
          </p>
        )}
        <header className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-800">
              Independent Event
            </span>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Organized by {tenant.name} under the Leader-BEE National
              Initiative
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Small steps.
              <br />
              <span className="text-orange-700">Future leaders.</span>
              <br />
              Right here at {tenant.name}.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Ten weeks of teamwork, culture, and confidence for Grades K–8. A
              shared experience for your whole family.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#registration"
                className={`${button} bg-orange-700 text-white`}
              >
                Register Child for Leader-BEE{" "}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              {rsvpPhone && !tenant.isDemo ? (
                <a
                  href={whatsapp(
                    rsvpPhone,
                    `Namaste, I would like to RSVP as an adult / attend ${tenant.name} (${tenant.slug}). My name is: `,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${button} border border-slate-300`}
                >
                  RSVP as Adult / Attend Shakha
                </a>
              ) : (
                <a
                  href="#shakha-contacts"
                  className={`${button} border border-slate-300`}
                >
                  Local coordinator details
                </a>
              )}
            </div>
          </div>
          <aside className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-700">
              Your local gathering
            </p>
            <h2 className="mt-3 text-2xl font-bold">{tenant.name}</h2>
            <dl className="mt-6 space-y-5">
              {[
                {
                  Icon: CalendarDays,
                  title: "Program starts",
                  value: tenant.startDate
                    ? new Date(
                        `${tenant.startDate}T12:00:00`,
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Confirm with your coordinator",
                },
                {
                  Icon: Clock3,
                  title: "Weekly schedule",
                  value: tenant.timing || "To be confirmed",
                },
                { Icon: MapPin, title: "Meet us at", value: tenant.address },
              ].map(({ Icon, title, value }) => (
                <div key={title} className="flex gap-3">
                  <Icon
                    className="mt-1 h-5 w-5 shrink-0 text-orange-700"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">
                      {title}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-stone-100 pt-5 text-sm text-slate-600">
              10-week youth leadership academy
              <br />
              Grades K–8 · Family & community track
            </p>
          </aside>
        </header>
        <aside className="rounded-3xl bg-[#152c28] p-6 text-white sm:p-8">
          <h2 className="text-2xl font-bold">Bring your entire family.</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-stone-200">
            While your kids build leadership and strategic thinking through
            Leader-BEE, parents and elder youth participate in health, yoga, and
            discussions. Both tracks begin with Aachar Padhati and conclude
            together with Sangha Prarthana.
          </p>
        </aside>
        <ShakhaTracksComparison />
        <div className="space-y-7 pb-10">
          {viewCurriculum && (
            <LeaderBeeCurriculum
              key={`curriculum-${tenant.slug}`}
              tenant={tenant}
              registrationId={params.get("registration") || ""}
            />
          )}
          <LeaderBeeRegistration
            key={`registration-${tenant.slug}`}
            tenant={tenant}
            onRegistered={registered}
          />
          {!viewCurriculum && (
            <a
              href={`${leaderBeePath(tenant.slug)}&view=curriculum#curriculum`}
              className="inline-block text-sm font-semibold text-orange-700 underline"
            >
              Already registered? Open your curriculum
            </a>
          )}
          <section
            id="shakha-contacts"
            className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold">Connect with your local team</h2>
            <p className="mt-2 text-sm text-slate-600">
              {tenant.coordinatorName ||
                "Ask your local Shakha for coordinator details."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {tenant.whatsappNumber &&
                (tenant.isDemo ? (
                  <p className="text-sm text-slate-500">
                    Sample phone: {tenant.whatsappNumber}
                  </p>
                ) : (
                  <>
                    <a
                      href={`tel:${tenant.whatsappNumber.replace(/[^+\d]/g, "")}`}
                      className={`${button} border border-stone-300`}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {tenant.whatsappNumber}
                    </a>
                    <a
                      href={whatsapp(
                        tenant.whatsappNumber,
                        `Namaste, I would like to know more about Leader-BEE at ${tenant.name}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${button} bg-green-800 text-white`}
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      WhatsApp coordinator
                    </a>
                  </>
                ))}
              {tenant.email &&
                (tenant.isDemo ? (
                  <p className="text-sm text-slate-500">
                    Sample email: {tenant.email}
                  </p>
                ) : (
                  <a
                    href={`mailto:${tenant.email}`}
                    className={`${button} border border-stone-300`}
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {tenant.email}
                  </a>
                ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  role: "Mukhya Shikshak",
                  purpose: "Program & instructions",
                  contact: mukhya,
                },
                {
                  role: "Karyawah",
                  purpose: "Venue & logistics",
                  contact: karyawah,
                },
              ].map(({ role, purpose, contact }) => (
                <div key={role} className="rounded-xl bg-stone-50 p-4">
                  <h3 className="font-bold">{role}</h3>
                  <p className="mt-1 text-sm text-slate-500">{purpose}</p>
                  {contact?.mobile && !tenant.isDemo ? (
                    <a
                      href={whatsapp(
                        contact.mobile,
                        `Namaste, I have a question about ${purpose.toLowerCase()} at ${tenant.name}.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-bold text-green-800 underline"
                    >
                      WhatsApp {contact.name || role}
                    </a>
                  ) : (
                    <p className="mt-3 text-xs text-slate-500">
                      Please ask the local coordinator for this role contact.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
          <LeaderBeeShareKit tenant={tenant} />
        </div>
        <footer className="border-t border-stone-200 py-6 text-sm text-slate-500">
          <a href={import.meta.env.BASE_URL}>← Shakha Sewa Setu</a>
        </footer>
      </div>
    </main>
  )
}
