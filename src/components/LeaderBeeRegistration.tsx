import { useEffect, useState, type FormEvent } from "react"
import {
  CheckCircle2,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react"
import type { ShakhaTenant } from "../data/shakhaDirectory"
import {
  normalizePhone,
  registerLeaderBee,
  openLeaderBeeCheckout,
  sendLeaderBeeOtp,
  verifyLeaderBeeOtp,
} from "../leaderBeeApi"

const field =
  "mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base font-normal focus:outline-2 focus:outline-orange-600 disabled:bg-stone-100"
export default function LeaderBeeRegistration({
  tenant,
  onRegistered,
}: {
  tenant: ShakhaTenant
  onRegistered: (id: string) => void
}) {
  const [parentFirstName, setParentFirstName] = useState("")
  const [parentLastName, setParentLastName] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [notes, setNotes] = useState("")
  const [consent, setConsent] = useState(false)
  const [registrationId, setRegistrationId] = useState("")
  const [parentEmail, setParentEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [children, setChildren] = useState([
    { id: crypto.randomUUID(), name: "", grade: "" },
  ])
  const [otp, setOtp] = useState("")
  const [sentPhone, setSentPhone] = useState("")
  const [verifiedPhone, setVerifiedPhone] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [submissionKey, setSubmissionKey] = useState(() => crypto.randomUUID())
  const isVerified = verifiedPhone === normalizePhone(phone)
  const participantCount = children.filter((child) =>
    /^Grade (K|[1-8])$/.test(child.grade),
  ).length
  const total = (participantCount * tenant.feeCents) / 100
  const money = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" })
  const enabled = tenant.registrationEnabled && !tenant.isDemo
  useEffect(() => {
    if (!cooldown) return
    const timer = window.setTimeout(
      () => setCooldown((value) => value - 1),
      1000,
    )
    return () => window.clearTimeout(timer)
  }, [cooldown])
  const sendCode = async () => {
    if (!/^\+[1-9]\d{7,14}$/.test(normalizePhone(phone))) {
      setError(
        "Enter your WhatsApp number with country code, such as +1 201 555 0123.",
      )
      return
    }
    setBusy(true)
    setError("")
    try {
      await sendLeaderBeeOtp(phone)
      setSentPhone(normalizePhone(phone))
      setOtp("")
      setVerifiedPhone("")
      setCooldown(60)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to send a code. Please try again.",
      )
    } finally {
      setBusy(false)
    }
  }
  const verifyCode = async () => {
    setBusy(true)
    setError("")
    try {
      await verifyLeaderBeeOtp(sentPhone, otp)
      setVerifiedPhone(sentPhone)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The code could not be verified. Try again or request a new code.",
      )
    } finally {
      setBusy(false)
    }
  }
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!enabled || !isVerified || busy) return
    setBusy(true)
    setError("")
    try {
      const id = await registerLeaderBee({
        submissionKey,
        shakhaSlug: tenant.slug,
        parentName: `${parentFirstName.trim()} ${parentLastName.trim()}`,
        details: {
          parentFirstName,
          parentLastName,
          city,
          state,
          notes,
          parentAttendanceConsent: consent,
        },
        parentEmail,
        parentPhone: phone,
        children: children.map(({ name, grade }) => ({ name, grade })),
      })
      setRegistrationId(id)
      if (total > 0) await openLeaderBeeCheckout(id)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Registration could not be saved. Please try again.",
      )
    } finally {
      setBusy(false)
    }
  }
  const updateChild = (id: string, key: "name" | "grade", value: string) =>
    setChildren((entries) =>
      entries.map((child) =>
        child.id === id ? { ...child, [key]: value } : child,
      ),
    )
  return (
    <section
      id="registration"
      className="scroll-mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8"
      aria-labelledby="registration-title"
    >
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-orange-700">
        <ShieldCheck aria-hidden="true" className="h-4 w-4" />
        Your local program. One simple registration.
      </p>
      <h2 id="registration-title" className="mt-3 text-2xl font-bold">
        Parent and Child Registration
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        Register for {tenant.name} · {tenant.timing} · {tenant.address}
      </p>
      <p className="mt-3 text-sm text-slate-600">
        Select grades K–12. Grades K–8 participate in Leader-BEE for{" "}
        {money(tenant.feeCents / 100)} each. For all other grades, the host will
        arrange a separate group at the same location and time, free of charge.
      </p>
      {!enabled && (
        <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">
          {tenant.isDemo
            ? "This is a sample branch for preview. Registration and OTP delivery are disabled for sample events."
            : "Leader-BEE registration is not open at this Shakha yet. Contact the coordinator for availability."}
        </p>
      )}
      {registrationId ? (
        <div className="mt-6 rounded-2xl bg-green-50 p-6" role="status">
          <h3 className="text-2xl font-bold">Thank You for Registering!</h3>
          <p className="mt-3">
            Thank you for registering your children for the Leader Bee program
            at {tenant.name}! We’re thrilled to have them join us.
          </p>
          <p className="mt-3">
            {total > 0
              ? `Your registration details were received. Continue to Stripe to securely pay ${money(total)}. Your registration is confirmed after payment is completed.`
              : participantCount > 0 ? "Your children are registered for Leader-BEE. No payment is required." : "Your children are registered for the separate host-arranged group at the same location and time. No payment is required."}
          </p>
          {total > 0 && (
            <button
              disabled={busy}
              className="mt-4 rounded-xl bg-orange-700 px-5 py-3 font-bold text-white disabled:opacity-50"
              onClick={async () => {
                setBusy(true)
                setError("")
                try {
                  await openLeaderBeeCheckout(registrationId)
                } catch (cause) {
                  setError(
                    cause instanceof Error
                      ? cause.message
                      : "Unable to open payment.",
                  )
                } finally {
                  setBusy(false)
                }
              }}
            >
              {busy ? "Opening secure checkout…" : "Pay with Stripe"}
            </button>
          )}
          <button
            className="ml-3 mt-4 font-semibold text-orange-800 underline"
            onClick={() => onRegistered(registrationId)}
          >
            Open your curriculum & payment status
          </button>
          {error && (
            <p role="alert" className="mt-4 text-red-800">
              {error} Your registration was saved; please use the payment button
              to try again.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6">
          <input type="hidden" name="shakhaSlug" value={tenant.slug} />
          <fieldset
            disabled={!enabled || busy}
            className="space-y-6 disabled:opacity-60"
          >
            <div className="grid items-start gap-6 lg:grid-cols-2">
              <section
                className="space-y-5 rounded-2xl border border-stone-200 p-5"
                aria-labelledby="parent-details-title"
              >
                <h3 id="parent-details-title" className="text-xl font-bold">
                  Parent details
                </h3>
                <p className="text-sm text-slate-500">
                  Registration and receipt contact
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-semibold">
                    Parent First Name
                    <input
                      name="parentFirstName"
                      value={parentFirstName}
                      onChange={(event) =>
                        setParentFirstName(event.target.value)
                      }
                      required
                      minLength={1}
                      maxLength={70}
                      autoComplete="given-name"
                      className={field}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Parent Last Name
                    <input
                      name="parentLastName"
                      value={parentLastName}
                      onChange={(event) =>
                        setParentLastName(event.target.value)
                      }
                      required
                      maxLength={70}
                      autoComplete="family-name"
                      className={field}
                    />
                  </label>
                  <label className="text-sm font-semibold">
                    Email
                    <input
                      name="parentEmail"
                      type="email"
                      value={parentEmail}
                      onChange={(event) => setParentEmail(event.target.value)}
                      required
                      maxLength={254}
                      autoComplete="email"
                      className={field}
                    />
                  </label>
                </div>
                <div className="rounded-2xl border border-stone-200 p-4">
                  <label className="text-sm font-semibold">
                    WhatsApp mobile number
                    <input
                      name="parentPhone"
                      type="tel"
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value)
                        setVerifiedPhone("")
                        setSentPhone("")
                        setOtp("")
                      }}
                      placeholder="+1 201 555 0123"
                      required
                      maxLength={25}
                      autoComplete="tel"
                      className={field}
                    />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">
                    Include your country code. Request a code to verify this
                    number on WhatsApp.
                  </p>
                  {isVerified ? (
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-800">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      WhatsApp number verified
                    </p>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={sendCode}
                        disabled={cooldown > 0}
                        className="mt-4 rounded-lg bg-green-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                      >
                        {cooldown
                          ? `Resend in ${cooldown}s`
                          : sentPhone
                            ? "Resend WhatsApp code"
                            : "Send WhatsApp code"}
                      </button>
                      {sentPhone && (
                        <div className="mt-4">
                          <label className="text-sm font-semibold">
                            Verification code
                            <input
                              value={otp}
                              onChange={(event) =>
                                setOtp(
                                  event.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 6),
                                )
                              }
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              maxLength={6}
                              className={field}
                              aria-describedby="otp-hint"
                            />
                          </label>
                          <p
                            id="otp-hint"
                            className="mt-2 text-xs text-slate-500"
                          >
                            Enter the 6-digit code sent to {sentPhone}.
                          </p>
                          <button
                            type="button"
                            disabled={otp.length !== 6}
                            onClick={verifyCode}
                            className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                          >
                            Verify code
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>
              <section
                className="space-y-5 rounded-2xl border border-stone-200 p-5"
                aria-labelledby="children-details-title"
              >
                <h3 id="children-details-title" className="text-xl font-bold">
                  Children
                </h3>
                <p className="text-sm text-slate-600">
                  Grades K–8: Leader-BEE Programme · Other grades: separate
                  host-arranged group (free)
                </p>
                {children.map((child, index) => (
                  <div key={child.id} className="rounded-2xl bg-stone-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold">
                        Student {index + 1}
                      </p>
                      {children.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setChildren((entries) =>
                              entries.filter((entry) => entry.id !== child.id),
                            )
                          }
                          aria-label={`Remove student ${index + 1}`}
                          className="rounded-lg p-2 text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-sm font-semibold">
                        Student name
                        <input
                          name={`student-${index}`}
                          value={child.name}
                          onChange={(event) =>
                            updateChild(child.id, "name", event.target.value)
                          }
                          required
                          minLength={2}
                          maxLength={150}
                          autoComplete="off"
                          className={field}
                        />
                      </label>
                      <label className="text-sm font-semibold">
                        Grade
                        <select
                          aria-label={`Grade for student ${index + 1}`}
                          name={`grade-${index}`}
                          value={child.grade}
                          onChange={(event) =>
                            updateChild(child.id, "grade", event.target.value)
                          }
                          required
                          className={field}
                        >
                          <option value="">Select grade</option>
                          {[
                            "K",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                            "12",
                          ].map((grade) => (
                            <option key={grade} value={`Grade ${grade}`}>
                              Grade {grade}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      {!child.grade
                        ? "Select a grade to see participation and fee."
                        : /^Grade (K|[1-8])$/.test(child.grade)
                          ? `Leader-BEE Programme participant · ${money(tenant.feeCents / 100)} registration fee.`
                          : "Separate group · The host will arrange activities at the same location and time · No charge."}
                    </p>
                  </div>
                ))}
                {children.length < 10 && (
                  <button
                    type="button"
                    onClick={() =>
                      setChildren((entries) => [
                        ...entries,
                        { id: crypto.randomUUID(), name: "", grade: "" },
                      ])
                    }
                    className="flex items-center gap-2 text-sm font-bold text-orange-700"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add another child
                  </button>
                )}
              </section>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                City
                <input
                  name="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  required
                  maxLength={100}
                  autoComplete="address-level2"
                  className={field}
                />
              </label>
              <label className="text-sm font-semibold">
                State
                <input
                  name="state"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                  required
                  maxLength={100}
                  autoComplete="address-level1"
                  className={field}
                />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Additional Notes
              <textarea
                name="notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={2000}
                rows={3}
                className={field}
              />
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                required
                className="mt-1"
              />
              At least one parent will attend each session.
            </label>
          </fieldset>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-stone-200 pt-5">
            <p className="text-sm text-slate-600">
              {participantCount} Leader-BEE participants ({children.length}{" "}
              children registered) ·{" "}
              <strong className="text-slate-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(total)}
              </strong>
              <span className="mt-1 block text-xs">
                {total > 0
                  ? "Secure payment available after registration."
                  : "No payment required."}
              </span>
            </p>
            <button
              type="submit"
              disabled={!enabled || !isVerified || busy}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-700 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              {busy
                ? "Please wait…"
                : total > 0
                  ? `Continue to payment · ${money(total)}`
                  : "Submit free registration"}
            </button>
          </div>
          <button
            type="button"
            disabled={busy}
            className="mt-4 text-sm font-semibold text-slate-600 underline"
            onClick={() => {
              setParentFirstName("")
              setParentLastName("")
              setParentEmail("")
              setPhone("")
              setCity("")
              setState("")
              setNotes("")
              setConsent(false)
              setChildren([{ id: crypto.randomUUID(), name: "", grade: "" }])
              setOtp("")
              setSentPhone("")
              setVerifiedPhone("")
              setError("")
              setSubmissionKey(crypto.randomUUID())
            }}
          >
            Reset Form
          </button>
          <p className="mt-3 text-sm text-slate-500">
            Secure payment powered by Stripe. Parents attend free.
          </p>
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800"
            >
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  )
}
