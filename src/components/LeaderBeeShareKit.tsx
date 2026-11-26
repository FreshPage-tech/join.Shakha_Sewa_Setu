import { useRef, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Download, Share2 } from "lucide-react"
import { leaderBeePath, type ShakhaTenant } from "../data/shakhaDirectory"

export default function LeaderBeeShareKit({
  tenant,
}: {
  tenant: ShakhaTenant
}) {
  const [status, setStatus] = useState("")
  const qr = useRef<HTMLDivElement>(null)
  const url = new URL(leaderBeePath(tenant.slug), window.location.origin).href
  const promo = `${
    tenant.isDemo ? "[SAMPLE EVENT] " : ""
  }*LEADER-BEE – 10 Weeks Workshop*

${[
  `• Shakha: ${tenant.name}`,
  "• Grades: K–8",
  `• Starts: ${
    tenant.startDate
      ? new Date(`${tenant.startDate}T12:00:00`).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Confirm with your coordinator"
  }`,
  `• Time: ${tenant.timing || "Confirm with your coordinator"}`,
  `• Location: ${tenant.address}`,
  `• Registration: ${(tenant.feeCents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })} per K–8 child`,
  "• Parents: Free",
  "• Grades 9–12: Separate host-arranged group at the same location and time, free of charge.",
  "• At least one parent will attend each session.",
].join("\n")}

${url}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(promo)
      setStatus("Promo text and branch link copied.")
    } catch {
      setStatus("Copy is unavailable. Select and copy the text below.")
    }
  }
  const download = () => {
    const svg = qr.current?.querySelector("svg")
    if (!svg) return
    const escape = (text: string) =>
      text.replace(
        /[<>&"']/g,
        (char) =>
          ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
          })[char]!,
      )
    const lines = [
      tenant.isDemo ? "SAMPLE EVENT · LEADER-BEE" : "LEADER-BEE",
      tenant.name,
      "10 weeks · Grades K–8 · Family Shakha",
      tenant.timing,
      tenant.address,
      tenant.startDate
        ? `Starts ${tenant.startDate}`
        : "Ask your coordinator for the start date",
    ]
    const content = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1100" viewBox="0 0 1000 1100"><rect width="1000" height="1100" fill="#fff7ed"/><rect x="50" y="50" width="900" height="1000" rx="36" fill="white"/>${lines.map((line, i) => `<text x="500" y="${135 + i * 68}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${i < 2 ? 36 : 22}" fill="#152e57">${escape(line)}</text>`).join("")}<svg x="350" y="540" width="300" height="300" viewBox="${svg.getAttribute("viewBox")}">${svg.innerHTML}</svg><text x="500" y="890" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#9a3412">Scan for your branch details &amp; registration</text><foreignObject x="90" y="925" width="820" height="100"><div xmlns="http://www.w3.org/1999/xhtml" style="font:16px Arial;text-align:center;overflow-wrap:anywhere;color:#152e57">${escape(url)}</div></foreignObject></svg>`
    const objectUrl = URL.createObjectURL(
      new Blob([content], { type: "image/svg+xml" }),
    )
    const link = document.createElement("a")
    link.href = objectUrl
    link.download = `leader-bee-${tenant.slug}.svg`
    link.click()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    setStatus("Flyer downloaded with the branch QR code.")
  }
  return (
    <details className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
      <summary className="cursor-pointer text-lg font-bold">
        <Share2 className="mr-2 inline h-5 w-5" aria-hidden="true" />
        Coordinator & Share Kit
      </summary>
      <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr]">
        <div
          ref={qr}
          className="w-fit self-start rounded-xl border border-stone-100 bg-white p-3"
        >
          <QRCodeSVG
            value={url}
            size={160}
            level="M"
            marginSize={4}
            title={`Scan to visit ${tenant.name}`}
          />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Your branch link</p>
          <a
            href={url}
            className="mt-2 block break-all text-sm text-orange-700 underline"
          >
            {url}
          </a>
          <textarea
            aria-label="Ready-to-share event text"
            readOnly
            value={promo}
            rows={5}
            className="mt-4 w-full rounded-xl border border-stone-200 bg-stone-50 p-3 text-sm"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy promo
            </button>
            <button
              onClick={download}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download flyer
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(promo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-800 px-3 py-2 text-sm font-semibold text-white"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(promo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-blue-900 px-3 py-2 text-sm font-semibold text-white"
            >
              Facebook
            </a>
          </div>
          <p role="status" className="mt-3 text-sm text-slate-600">
            {status}
          </p>
        </div>
      </div>
    </details>
  )
}
