import { useEffect, useMemo, useState } from 'react'
import {
  type ContactDetail,
  type InterestedPersonRecord,
  type LeaderBeeRegistration,
  type ShakhaRecord,
} from './shakhaTypes'
import {
  checkIsAdmin,
  createShakha,
  deleteShakha,
  getSession,
  listInterestedPeople,
  listLeaderBeeRegistrations,
  requestAdminOtp,
  signOutAdmin,
  updateShakha,
  verifyAdminOtp,
} from './adminApi'
import LeaderBeeAdmin from './LeaderBeeAdmin'

const emptyContact = (): ContactDetail => ({ name: '', mobile: '', email: '' })

const emptyShakhaForm = (): Omit<ShakhaRecord, 'id'> => ({
  name: '',
  address: '',
  state: '',
  city: '',
  vibhag: '',
  bhag: '',
  zipCode: '',
  mapLink: '',
  day: 'Weekly on Sunday',
  time: '10:00am to 11:30am',
  contacts: [emptyContact(), emptyContact(), emptyContact()],
})

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString()
}

function InterestedPeopleTable({ people }: { people: InterestedPersonRecord[] }) {
  if (people.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center" style={{ borderColor: '#eadfce' }}>
        <p className="text-sm" style={{ color: '#5a6f9a' }}>No registrations received yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {people.map(person => (
        <div key={person.id} className="rounded-2xl border bg-white p-5" style={{ borderColor: '#eadfce' }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold" style={{ color: '#132f5d' }}>
              {person.firstName} {person.lastName}
            </h3>
            <span className="text-xs" style={{ color: '#6a7da3' }}>
              {formatDate(person.createdAt)}
            </span>
          </div>
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3" style={{ color: '#2f4671' }}>
            <p><strong>Email:</strong> {person.email}</p>
            <p><strong>Mobile:</strong> {person.mobile}</p>
            <p><strong>Location:</strong> {person.city}, {person.state} {person.zip}</p>
            <p><strong>Occupation:</strong> {person.occupation || 'Not provided'}</p>
            <p><strong>Selected Shakha:</strong> {person.selectedShakha || 'Not selected'}</p>
            <p><strong>Preferred Time:</strong> {person.preferredDay || 'Not set'}</p>
          </div>
          <p className="mt-2 text-sm" style={{ color: '#2f4671' }}>
            <strong>Interests:</strong> {person.interests.length > 0 ? person.interests.join(', ') : 'Not specified'}
          </p>
          {person.comments && (
            <p className="mt-2 text-sm" style={{ color: '#2f4671' }}>
              <strong>Comments:</strong> {person.comments}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function ShakhaEditor({
  records,
  onRefresh,
}: {
  records: ShakhaRecord[]
  onRefresh: () => Promise<void>
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<ShakhaRecord, 'id'>>(emptyShakhaForm)
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return records
    }

    return records.filter(record => {
      return (
        record.name.toLowerCase().includes(normalizedQuery) ||
        record.state.toLowerCase().includes(normalizedQuery) ||
        record.city.toLowerCase().includes(normalizedQuery) ||
        record.vibhag.toLowerCase().includes(normalizedQuery) ||
        record.bhag.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [records, query])

  const setField = (key: keyof Omit<ShakhaRecord, 'id'>, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const setContactField = (index: number, key: keyof ContactDetail, value: string) => {
    setForm(prev => {
      const contacts = [...prev.contacts]
      contacts[index] = { ...contacts[index], [key]: value }
      return { ...prev, contacts }
    })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyShakhaForm())
  }

  const beginEdit = (record: ShakhaRecord) => {
    setEditingId(record.id)
    setForm({
      name: record.name,
      address: record.address,
      state: record.state,
      city: record.city,
      vibhag: record.vibhag,
      bhag: record.bhag,
      zipCode: record.zipCode,
      mapLink: record.mapLink,
      day: record.day,
      time: record.time,
      contacts: [
        record.contacts[0] ?? emptyContact(),
        record.contacts[1] ?? emptyContact(),
        record.contacts[2] ?? emptyContact(),
      ],
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !form.address.trim() || !form.state.trim()) {
      return
    }

    setSaving(true)

    try {
      if (editingId) {
        await updateShakha(editingId, form)
      } else {
        await createShakha(form)
      }

      await onRefresh()
      resetForm()
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    setSaving(true)
    try {
      await deleteShakha(id)
      await onRefresh()
    } finally {
      setSaving(false)
    }

    if (editingId === id) {
      resetForm()
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="rounded-2xl border bg-white p-6" style={{ borderColor: '#eadfce' }}>
        <h3 className="font-display text-xl font-semibold" style={{ color: '#132f5d' }}>
          {editingId ? 'Edit Shakha' : 'Add Shakha'}
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input value={form.name} onChange={event => setField('name', event.target.value)} placeholder="Shakha Name" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} required />
          <input value={form.address} onChange={event => setField('address', event.target.value)} placeholder="Address" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} required />
          <input value={form.state} onChange={event => setField('state', event.target.value)} placeholder="State" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} required />
          <input value={form.city} onChange={event => setField('city', event.target.value)} placeholder="City" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} required />
          <input value={form.vibhag} onChange={event => setField('vibhag', event.target.value)} placeholder="Vibhag" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
          <input value={form.bhag} onChange={event => setField('bhag', event.target.value)} placeholder="Bhag" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
          <input value={form.zipCode} onChange={event => setField('zipCode', event.target.value)} placeholder="Zip Code" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
          <input value={form.mapLink} onChange={event => setField('mapLink', event.target.value)} placeholder="Map Link" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
          <input value={form.day} onChange={event => setField('day', event.target.value)} placeholder="Day (optional)" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
          <input value={form.time} onChange={event => setField('time', event.target.value)} placeholder="Time (optional)" className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
        </div>

        <div className="mt-5 space-y-3">
          <p className="text-sm font-semibold" style={{ color: '#132f5d' }}>Contact Details (3 boxes)</p>
          {form.contacts.map((contact, index) => (
            <div key={index} className="grid gap-3 sm:grid-cols-3">
              <input value={contact.name} onChange={event => setContactField(index, 'name', event.target.value)} placeholder={`Contact ${index + 1} Name`} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
              <input value={contact.mobile} onChange={event => setContactField(index, 'mobile', event.target.value)} placeholder={`Contact ${index + 1} Mobile`} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
              <input value={contact.email} onChange={event => setContactField(index, 'email', event.target.value)} placeholder={`Contact ${index + 1} Email`} className="rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)' }}>
            {editingId ? 'Save Changes' : 'Add Shakha'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-lg border px-5 py-2.5 text-sm font-semibold" style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="rounded-2xl border bg-white p-5" style={{ borderColor: '#eadfce' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold" style={{ color: '#132f5d' }}>Existing Shakhas ({filtered.length})</h3>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by name, state, city" className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm" style={{ borderColor: '#ddd6c8' }} />
        </div>

        <div className="mt-4 space-y-3">
          {filtered.map(record => (
            <div key={record.id} className="rounded-xl border p-4" style={{ borderColor: '#ede5d8' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold" style={{ color: '#132f5d' }}>{record.name}</p>
                  <p className="text-xs" style={{ color: '#5a6f9a' }}>{record.city}, {record.state} | {record.address}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => beginEdit(record)} disabled={saving} className="rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-60" style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}>
                    Edit
                  </button>
                  <button onClick={() => void remove(record.id)} disabled={saving} className="rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-60" style={{ borderColor: '#c2410c', color: '#c2410c' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm" style={{ color: '#5a6f9a' }}>No shakhas match this search.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPanel({
  shakhaRecords,
  refreshShakhas,
}: {
  shakhaRecords: ShakhaRecord[]
  refreshShakhas: () => Promise<void>
}) {
  const [checkingSession, setCheckingSession] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [countryCode, setCountryCode] = useState('+91')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'people' | 'leader-bee' | 'shakhas'>('people')
  const [loadingPeople, setLoadingPeople] = useState(false)
  const [people, setPeople] = useState<InterestedPersonRecord[]>([])
  const [leaderBeeRegistrations, setLeaderBeeRegistrations] = useState<LeaderBeeRegistration[]>([])
  const [loadingLeaderBee, setLoadingLeaderBee] = useState(false)

  const fullPhone = `${countryCode.trim()}${mobile.replace(/\D/g, '')}`

  const refreshPeople = async () => {
    setLoadingPeople(true)
    try {
      const next = await listInterestedPeople()
      setPeople(next)
    } finally {
      setLoadingPeople(false)
    }
  }

  const refreshAllAdminData = async () => {
    setLoadingLeaderBee(true)
    try {
      const [, , registrations] = await Promise.all([refreshShakhas(), refreshPeople(), listLeaderBeeRegistrations()])
      setLeaderBeeRegistrations(registrations)
    } finally {
      setLoadingLeaderBee(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const session = await getSession()
        if (!session) {
          setAuthed(false)
          return
        }

        const isAdmin = await checkIsAdmin()
        setAuthed(isAdmin)
        if (isAdmin) {
          await refreshAllAdminData()
        }
      } catch {
        setAuthed(false)
      } finally {
        setCheckingSession(false)
      }
    }

    void init()
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAuthSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setAuthLoading(true)
    try {
      if (!otpSent) {
        await requestAdminOtp(fullPhone)
        setOtpSent(true)
      } else {
        await verifyAdminOtp(fullPhone, otp)
        setAuthed(true)
        await refreshAllAdminData()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid OTP login'
      setError(message)
    } finally {
      setAuthLoading(false)
    }
  }

  const signOut = async () => {
    await signOutAdmin()
    setAuthed(false)
    setCountryCode('+91')
    setMobile('')
    setOtp('')
    setOtpSent(false)
    setTab('people')
    setPeople([])
    setLeaderBeeRegistrations([])
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen px-4 py-20" style={{ background: '#FDF6ED' }}>
        <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 text-center" style={{ borderColor: '#eadfce' }}>
          <p className="text-sm" style={{ color: '#5a6f9a' }}>Checking admin session...</p>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen px-4 py-20" style={{ background: '#FDF6ED' }}>
        <div className="mx-auto max-w-md rounded-2xl border bg-white p-8" style={{ borderColor: '#eadfce' }}>
          <h1 className="font-display text-2xl font-bold" style={{ color: '#132f5d' }}>Admin Login</h1>
          <p className="mt-2 text-sm" style={{ color: '#5a6f9a' }}>
            Access is protected by Supabase phone OTP authentication and admin access policies.
          </p>
          <form onSubmit={handleAuthSubmit} className="mt-6 space-y-3">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <input value={countryCode} onChange={event => setCountryCode(event.target.value)} placeholder="+91" className="w-full rounded-lg border px-3 py-2.5 text-sm" style={{ borderColor: '#ddd6c8' }} required />
              <input value={mobile} onChange={event => setMobile(event.target.value)} placeholder="Mobile number" className="w-full rounded-lg border px-3 py-2.5 text-sm" style={{ borderColor: '#ddd6c8' }} required />
            </div>
            {otpSent && (
              <input value={otp} onChange={event => setOtp(event.target.value)} placeholder="Enter OTP" className="w-full rounded-lg border px-3 py-2.5 text-sm" style={{ borderColor: '#ddd6c8' }} required />
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={authLoading} className="w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-60" style={{ background: 'linear-gradient(135deg, #D4531A, #c2410c)' }}>
              {otpSent ? 'Verify OTP & Sign in' : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: '#FDF6ED' }}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold" style={{ color: '#132f5d' }}>Admin Panel</h1>
            <p className="mt-1 text-sm" style={{ color: '#5a6f9a' }}>
              Manage interested registrations and shakha details with server-side protected data.
            </p>
          </div>
          <button onClick={() => void signOut()} className="rounded-lg border px-4 py-2 text-sm font-semibold" style={{ borderColor: '#1B3A6B', color: '#1B3A6B' }}>
            Logout
          </button>
        </div>

        <div className="mt-6 flex gap-2 rounded-full border p-1" style={{ borderColor: '#eadfce', width: 'fit-content' }}>
          <button onClick={() => setTab('people')} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: tab === 'people' ? '#1B3A6B' : 'transparent', color: tab === 'people' ? '#fff' : '#1B3A6B' }}>
            Registered Interested People
          </button>
          <button onClick={() => setTab('leader-bee')} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: tab === 'leader-bee' ? '#1B3A6B' : 'transparent', color: tab === 'leader-bee' ? '#fff' : '#1B3A6B' }}>
            Leader-BEE Registrations
          </button>
          <button onClick={() => setTab('shakhas')} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: tab === 'shakhas' ? '#1B3A6B' : 'transparent', color: tab === 'shakhas' ? '#fff' : '#1B3A6B' }}>
            Shakha Management
          </button>
        </div>

        <div className="mt-6">
          {tab === 'people' ? (
            loadingPeople ? (
              <div className="rounded-2xl border bg-white p-8 text-center" style={{ borderColor: '#eadfce' }}>
                <p className="text-sm" style={{ color: '#5a6f9a' }}>Loading registrations...</p>
              </div>
            ) : (
              <InterestedPeopleTable people={people} />
            )
          ) : tab === 'leader-bee' ? (
            loadingLeaderBee ? (
              <div className="rounded-2xl border bg-white p-8 text-center" style={{ borderColor: '#eadfce' }}>
                <p className="text-sm" style={{ color: '#5a6f9a' }}>Loading Leader-BEE registrations...</p>
              </div>
            ) : <LeaderBeeAdmin registrations={leaderBeeRegistrations} />
          ) : (
            <ShakhaEditor records={shakhaRecords} onRefresh={refreshShakhas} />
          )}
        </div>
      </div>
    </div>
  )
}
