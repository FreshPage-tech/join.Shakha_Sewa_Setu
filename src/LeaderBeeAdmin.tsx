import { useMemo, useState } from 'react'
import type { LeaderBeeRegistration } from './shakhaTypes'

const formatDate = (value: string) => new Date(value).toLocaleString()

export default function LeaderBeeAdmin({ registrations }: { registrations: LeaderBeeRegistration[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const filtered = useMemo(() => registrations.filter(item => {
    const searchable = [item.parentName, item.parentEmail, item.parentPhone, ...item.children.flatMap(child => [child.name, child.grade])].join(' ').toLowerCase()
    return (status === 'all' || item.paymentStatus === status) && searchable.includes(query.trim().toLowerCase())
  }), [query, registrations, status])

  const exportCsv = () => {
    const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const rows: unknown[][] = [['Registered', 'Parent', 'Email', 'Phone', 'Children', 'Participants', 'Amount USD', 'Payment status', 'Paid at', 'Stripe session']]
    filtered.forEach(item => rows.push([item.createdAt, item.parentName, item.parentEmail, item.parentPhone,
      item.children.map(child => `${child.name} (${child.grade})`).join('; '), item.participantCount,
      (item.amountCents / 100).toFixed(2), item.paymentStatus, item.paidAt, item.stripeCheckoutSessionId]))
    const url = URL.createObjectURL(new Blob([rows.map(row => row.map(cell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `leader-bee-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap gap-3 rounded-2xl border bg-white p-4" style={{ borderColor: '#eadfce' }}>
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search parent, child, email or phone" className="min-w-64 flex-1 rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
      <select value={status} onChange={event => setStatus(event.target.value)} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }}>
        <option value="all">All payment statuses</option><option value="paid">Paid</option><option value="pending">Pending</option><option value="not_required">No payment required</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
      </select>
      <button onClick={exportCsv} disabled={!filtered.length} className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" style={{ background: '#1B3A6B' }}>Export CSV ({filtered.length})</button>
    </div>
    {filtered.map(item => <div key={item.id} className="rounded-2xl border bg-white p-5" style={{ borderColor: '#eadfce' }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h3 className="font-semibold" style={{ color: '#132f5d' }}>{item.parentName}</h3><p className="text-sm" style={{ color: '#5a6f9a' }}>{item.parentEmail} · {item.parentPhone}</p></div>
        <div className="text-right"><span className="rounded-full px-3 py-1 text-xs font-semibold capitalize" style={{ background: item.paymentStatus === 'paid' ? '#dcfce7' : item.paymentStatus === 'pending' ? '#fef3c7' : '#e8eef8', color: item.paymentStatus === 'paid' ? '#166534' : '#1B3A6B' }}>{item.paymentStatus.replace('_', ' ')}</span><p className="mt-2 text-xs" style={{ color: '#6a7da3' }}>{formatDate(item.createdAt)}</p></div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">{item.children.map((child, index) => <p key={`${child.name}-${index}`} className="rounded-lg px-3 py-2 text-sm" style={{ background: '#FDF6ED', color: '#2f4671' }}><strong>Child {index + 1}:</strong> {child.name} · {child.grade}</p>)}</div>
      <p className="mt-3 text-sm" style={{ color: '#2f4671' }}><strong>Leader-BEE participants:</strong> {item.participantCount} · <strong>Amount:</strong> ${(item.amountCents / 100).toFixed(2)}</p>
    </div>)}
    {!filtered.length && <div className="rounded-2xl border bg-white p-8 text-center text-sm" style={{ borderColor: '#eadfce', color: '#5a6f9a' }}>No Leader-BEE registrations match this view.</div>}
  </div>
}
