import { useEffect, useState } from 'react'
import { leaderBeePath, shakhaSlug, type ShakhaTenant } from '../data/shakhaDirectory'
import { listLeaderBeeTenants } from '../leaderBeeApi'
import type { ShakhaRecord } from '../shakhaTypes'

export default function ShakhaProgramLinks({ record }: { record: ShakhaRecord }) {
  const [programs, setPrograms] = useState<ShakhaTenant[]>([])
  useEffect(() => {
    let active = true
    setPrograms([])
    listLeaderBeeTenants().then(items => {
      if (active) setPrograms(items.filter(item => !item.isDemo && (item.shakhaId === record.id || item.slug === shakhaSlug(record))))
    }).catch(() => { if (active) setPrograms([]) })
    return () => { active = false }
  }, [record])
  if (!programs.length) return null
  return <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wider text-orange-700">Programs at this Shakha</p>{programs.map(program => <a key={program.slug} href={leaderBeePath(program.slug)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-800">Leader-BEE at {record.name} ↗</a>)}</div>
}
