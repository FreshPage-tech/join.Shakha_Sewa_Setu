import { supabase } from "../supabaseClient"
import { useEffect, useState } from "react"
import { BookOpen, CalendarDays, CheckCircle2 } from "lucide-react"
import type { ShakhaTenant } from "../data/shakhaDirectory"
import {
  getLeaderBeeCurriculum,
  getLeaderBeePayment,
  openLeaderBeeCheckout,
  type CurriculumWeek,
  type LeaderBeePayment,
} from "../leaderBeeApi"

export default function LeaderBeeCurriculum({
  tenant,
  registrationId,
}: {
  tenant: ShakhaTenant
  registrationId: string
}) {
  const [weeks, setWeeks] = useState<CurriculumWeek[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState(1)
  const [paying, setPaying] = useState(false)
  const [payment, setPayment] = useState<LeaderBeePayment | null>(null)
  const [refresh, setRefresh] = useState(0)
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED"
      )
        setRefresh((value) => value + 1)
    })
    return () => data.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    let active = true
    setLoading(true)
    setError("")
    setWeeks([])
    Promise.all([
      getLeaderBeeCurriculum(tenant.slug),
      getLeaderBeePayment(tenant.slug, registrationId),
    ])
      .then(([value, status]) => {
        if (active) {
          setWeeks(value)
          setPayment(status)
        }
      })
      .catch((cause) => {
        if (active) setError(cause.message || "Unable to load the curriculum.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [tenant.slug, registrationId, refresh])
  const pay = async () => {
    setPaying(true)
    setError("")
    try {
      await openLeaderBeeCheckout(payment?.id || registrationId)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to open payment.",
      )
      setPaying(false)
    }
  }
  const week = weeks.find((item) => item.week === selected)
  const date = (number: number) => {
    if (!tenant.startDate) return "Date to be confirmed"
    const start = new Date(`${tenant.startDate}T12:00:00`)
    start.setDate(start.getDate() + (number - 1) * 7)
    return start.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }
  return (
    <section
      id="curriculum"
      className="scroll-mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
    >
      <p className="flex items-center gap-2 text-sm font-bold text-orange-700">
        <BookOpen className="h-5 w-5" aria-hidden="true" />
        Your 10-week journey
      </p>
      <h2 className="mt-3 text-3xl font-bold">{tenant.name} curriculum</h2>
      {loading ? (
        <p className="mt-6" role="status">
          Checking registration and loading your curriculum…
        </p>
      ) : weeks.length > 0 ? (
        <>
          <p className="mt-3 flex items-center gap-2 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Verified registration · {tenant.name}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Weekly dates are based on the branch start date. Confirm any changes
            with your coordinator.
          </p>
          {payment && (
            <div className="my-5 rounded-xl bg-amber-50 p-4">
              <p className="text-sm text-amber-950">
                Payment:{" "}
                <strong>{payment.payment_status.replace(/_/g, " ")}</strong> ·{" "}
                {(payment.amount_cents / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </p>
              {["pending", "failed"].includes(payment.payment_status) && (
                <button
                  onClick={pay}
                  disabled={paying}
                  className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  {paying ? "Opening…" : "Open secure payment"}
                </button>
              )}
              <button
                onClick={() => setRefresh((value) => value + 1)}
                className="ml-3 mt-3 text-sm font-semibold text-orange-800 underline"
              >
                Refresh payment status
              </button>
            </div>
          )}
          <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr]">
            <nav
              aria-label="Curriculum weeks"
              className="flex flex-wrap gap-2 md:flex-col"
            >
              {weeks.map((item) => (
                <button
                  key={item.week}
                  onClick={() => setSelected(item.week)}
                  aria-pressed={selected === item.week}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                    selected === item.week
                      ? "bg-orange-700 text-white"
                      : "bg-stone-100 text-slate-700 hover:bg-stone-200"
                  }`}
                >
                  Week {item.week}
                </button>
              ))}
            </nav>
            {week && (
              <article className="rounded-2xl bg-stone-50 p-5 sm:p-7">
                <p className="flex items-center gap-2 text-xs font-bold uppercase text-orange-700">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {date(week.week)}
                </p>
                <h3 className="mt-3 text-2xl font-bold">{week.title}</h3>
                <p className="mt-3 text-slate-600">{week.objective}</p>
                <ul className="mt-6 list-disc space-y-3 pl-5 text-sm text-slate-700">
                  {week.activities.map((activity) => (
                    <li key={activity}>{activity}</li>
                  ))}
                </ul>
              </article>
            )}
          </div>
        </>
      ) : null}
      {error && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {!loading && !weeks.length && (
        <a
          href="#registration"
          className="mt-4 inline-block font-semibold text-orange-700 underline"
        >
          Go to registration
        </a>
      )}
    </section>
  )
}
