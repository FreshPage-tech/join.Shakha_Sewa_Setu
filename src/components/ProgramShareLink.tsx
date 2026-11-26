import { useState } from 'react'
import { Copy, Share2 } from 'lucide-react'

export default function ProgramShareLink({ path, name }: { path: string; name: string }) {
  const [status, setStatus] = useState('')
  const url = new URL(path, window.location.origin).href
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setStatus('Program overview link copied.') }
    catch { setStatus('Select and copy the link below.') }
  }
  return <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600"><Share2 aria-hidden="true" className="h-4 w-4" />Share the {name} program</p>
    <p className="mt-2 break-all text-sm text-slate-600">{url}</p>
    <div className="mt-3 flex flex-wrap gap-4"><button onClick={copy} className="inline-flex items-center gap-2 text-sm font-bold text-orange-700"><Copy aria-hidden="true" className="h-4 w-4" />Copy public program link</button><a href={`https://wa.me/?text=${encodeURIComponent(`Explore ${name}: ${url}`)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-green-800">Share on WhatsApp</a></div>
    <p role="status" className="mt-2 text-xs text-slate-500">{status}</p>
  </div>
}
