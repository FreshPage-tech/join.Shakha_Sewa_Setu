import { programDirectory, programPublicPath } from '../data/programDirectory'
import { useEffect, useId, useMemo, useState } from 'react'
import { ArrowUpRight, BookOpen, MapPin, Search, X } from 'lucide-react'
import { leaderBeePath, shakhaSlug, type ShakhaTenant } from '../data/shakhaDirectory'
import { listLeaderBeeTenants } from '../leaderBeeApi'
import { listPublicShakhaSearchRecords, type ShakhaSearchRecord } from '../publicShakhaApi'

const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const card = 'rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-orange-500 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-orange-600'

export default function LeaderBeeBranchPicker({ context = 'discovery' }: { context?: 'discovery' | 'leader-bee' }) {
  const programOnly = context === 'leader-bee'
  const incoming = new URLSearchParams(window.location.search)
  const id = useId()
  const [query, setQuery] = useState(() => programOnly ? incoming.get('location') || '' : '')
  const [state, setState] = useState(() => programOnly ? incoming.get('state') || '' : '')
  const [branches, setBranches] = useState<ShakhaTenant[]>([])
  const [shakhas, setShakhas] = useState<ShakhaSearchRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [limit, setLimit] = useState(6)
  useEffect(() => {
    let active = true
    Promise.allSettled([listPublicShakhaSearchRecords(), listLeaderBeeTenants()]).then(([locations, programs]) => {
      if (!active) return
      if (locations.status === 'fulfilled') setShakhas(locations.value)
      if (programs.status === 'fulfilled') setBranches(programs.value)
      if (locations.status === 'rejected' || programs.status === 'rejected') setError('Some listings could not be loaded. Please refresh to try again.')
      setLoading(false)
    })
    return () => { active = false }
  }, [])
  const tokens = normalize(query).split(' ').filter(Boolean)
  const matches = (text: string) => tokens.every(token => normalize(text).includes(token))
  const states = useMemo(() => [...new Set(shakhas.map(item => item.state))].filter(Boolean).sort(), [shakhas])
  const stateNamesByCode = useMemo(() => {
    const names = new Map<string, string>()
    for (const item of shakhas) {
      const code = item.address.match(/\b([A-Z]{2})\s+\d{5}\b/)?.[1]
      if (code) names.set(code, item.state)
    }
    return names
  }, [shakhas])
  const filteredShakhas = shakhas.filter(item => (!state || item.state === state) && matches(`${item.name} ${item.city} ${item.state} ${item.address} ${item.zipCode}`)).sort((left, right) => {
    // Put exact city/ZIP matches ahead of wider address/name matches; never invent distances.
    const rank = (item: ShakhaSearchRecord) => normalize(item.city) === normalize(query) || item.zipCode === query.trim() ? 1 : 0
    return rank(right) - rank(left) || left.city.localeCompare(right.city) || left.name.localeCompare(right.name)
  })
  const filteredPrograms = branches.filter(branch => {
    if (branch.isDemo) return false
    const linked = shakhas.find(item => item.id === branch.shakhaId)
    const stateCode = branch.address.match(/\b([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?)?\s*$/)?.[1] || branch.slug.slice(-2).toUpperCase()
    const region = linked?.state || stateNamesByCode.get(stateCode) || ''
    const inState = !state || region === state || normalize(branch.address).includes(normalize(state))
    return inState && matches(`Leader BEE leadership program ${branch.name} ${branch.address} ${branch.slug} ${linked?.city || ''} ${region} ${linked?.zipCode || ''}`)
  }).sort((left, right) => Number(left.isDemo) - Number(right.isDemo) || left.name.localeCompare(right.name))
  const matchingOverviews = programDirectory.filter(program => matches(`${program.name} ${program.summary} ${program.audience}`))
  const overviews = matchingOverviews.length ? matchingOverviews : [programDirectory[0]]
  const overviewLink = (path: string, slug: string) => {
    if (slug !== 'leader-bee' || (!query && !state)) return path
    const params = new URLSearchParams()
    if (query) params.set('location', query)
    if (state) params.set('state', state)
    return `${path}?${params}`
  }
  const locationChosen = Boolean(query.trim() || state)
  const reset = () => { setQuery(''); setState(''); setLimit(6) }
  return <section aria-labelledby={`${id}-title`}>
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">{programOnly ? 'Choose your Leader-BEE location' : 'Start close to home'}</p>
    <h2 id={`${id}-title`} className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">{programOnly ? 'Register at your local Leader-BEE program' : 'Find your Shakha / Location / Programme near you'}</h2>
    <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">{programOnly ? 'Choose a participating location below to go directly to its registration form.' : 'Shakha cards open local Shakha pages. Explore a program overview or go straight to a program at a specific Shakha.'}</p>
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <label className="relative block flex-1"><span className="sr-only">Search Shakhas, locations, and programs</span><Search aria-hidden="true" className="absolute left-4 top-4 h-5 w-5 text-slate-400" /><input type="search" value={query} onChange={event => { setQuery(event.target.value); setLimit(6) }} placeholder="City, ZIP, Shakha, or program…" className="w-full rounded-xl border border-stone-300 bg-stone-50 py-3.5 pl-12 pr-4 focus:outline-2 focus:outline-orange-600" /></label>
      <label><span className="sr-only">Filter by state</span><select aria-label="Filter by state" value={state} disabled={loading} onChange={event => { setState(event.target.value); setLimit(6) }} className="h-full min-h-12 w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 sm:w-52"><option value="">All states</option>{states.map(value => <option key={value}>{value}</option>)}</select></label>
      {locationChosen && <button type="button" onClick={reset} className="flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600"><X className="h-4 w-4" aria-hidden="true" />Clear</button>}
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <p role="status" className="mt-3 text-xs text-slate-500">{loading ? 'Loading Shakhas and programs…' : `${programOnly ? '' : `${filteredShakhas.length} Shakhas · `}${filteredPrograms.length} local program events${locationChosen ? ' match your search' : ' listed — enter your location to find local matches'}`}</p>
    {!programOnly && <section aria-labelledby={`${id}-shakhas`} className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 id={`${id}-shakhas`} className="flex items-center gap-2 text-xl font-bold"><MapPin className="h-5 w-5 text-orange-700" aria-hidden="true" />{locationChosen ? 'Shakhas near your search' : 'Explore Shakhas near you'}</h3><span className="text-xs text-slate-500">Weekly gatherings · All ages</span></div>
      {!loading && !filteredShakhas.length ? <p className="mt-4 rounded-2xl bg-stone-50 p-5 text-sm text-slate-600">No Shakhas match this search. Try a nearby city, a different ZIP, or clear the state filter.</p> : <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredShakhas.slice(0, limit).map(item => <a href={`${import.meta.env.BASE_URL}${item.searchSlug || shakhaSlug(item)}`} key={item.id} data-result-type="shakha" className={card}><div className="flex items-start justify-between gap-3"><h4 className="font-bold text-slate-900">{item.name}</h4><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-orange-700" /></div><p className="mt-2 text-sm font-semibold text-slate-700">{item.city}, {item.state}</p><p className="mt-2 text-xs leading-relaxed text-slate-500">{item.address}</p><p className="mt-4 border-t border-stone-100 pt-3 text-xs font-semibold text-orange-800">{[item.day, item.time].filter(Boolean).join(' · ') || 'Contact coordinator for schedule'}</p></a>)}</div>}
      {filteredShakhas.length > limit && <button type="button" onClick={() => setLimit(value => value + 6)} className="mt-4 text-sm font-bold text-orange-700 underline underline-offset-4">Show more Shakhas</button>}
    </section>}
    <section aria-labelledby={`${id}-programs`} className="mt-8 border-t border-stone-200 pt-8">
      <h3 id={`${id}-programs`} className="flex items-center gap-2 text-xl font-bold"><BookOpen className="h-5 w-5 text-orange-700" aria-hidden="true" />{programOnly ? 'Leader-BEE locations & registration' : 'Programs for your family'}</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {!programOnly && overviews.map(program => <a key={`overview-${program.slug}`} data-result-type="program-overview" href={overviewLink(programPublicPath(program), program.slug)} className={`${card} border-orange-200 bg-orange-50/60`}>
          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-800">Public program overview</span>
          <div className="mt-4 flex items-start justify-between gap-3"><h4 className="text-lg font-bold">{program.name}</h4><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-orange-700" /></div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{program.summary}</p>
          <p className="mt-4 text-xs font-bold text-orange-800">{program.detailsPending ? 'Program information & enquiries' : 'Explore the program & choose a location'}</p>
        </a>)}
        {filteredPrograms.map(branch => <a data-result-type="branch-program" href={`${leaderBeePath(branch.slug)}${programOnly ? '#registration' : ''}`} key={branch.slug} className={card}>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-700">Leader-BEE · Shakha program</span>
          <div className="mt-3 flex items-start justify-between gap-3"><h4 className="font-bold">{branch.name}</h4><ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-orange-700" /></div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{branch.address}</p><p className="mt-3 text-xs font-semibold text-slate-600">{branch.timing}</p>
          <p className="mt-4 text-sm font-bold text-orange-800">{programOnly ? `Register at ${branch.name} →` : 'View this Shakha’s program →'}</p>
        </a>)}
      </div>
      {!loading && !filteredPrograms.length && <p className="mt-4 rounded-2xl bg-stone-50 p-5 text-sm text-slate-600">{programOnly ? 'No Leader-BEE events match this location yet. Clear your search to see other participating locations.' : 'No local program events match this search. You can still explore the public program overview above.'}</p>}
    </section>
  </section>
}
