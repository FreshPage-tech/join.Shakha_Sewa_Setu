import { useEffect } from 'react'
import { ArrowLeft, Mail } from 'lucide-react'
import { programDirectory, programPublicPath } from '../data/programDirectory'
import ProgramShareLink from './ProgramShareLink'

export default function ProgramPublicPage({ slug }: { slug: string }) {
  const program = programDirectory.find(item => item.slug === slug)
  useEffect(() => { document.title = program ? `${program.name} | Shakha Sewa Setu` : 'Program not found | Shakha Sewa Setu' }, [program])
  return <main className="min-h-screen bg-[#faf9f6] px-5 py-8 text-slate-900 sm:px-8">
    <div className="mx-auto max-w-4xl"><a href={import.meta.env.BASE_URL} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Shakha Sewa Setu</a>
      {!program ? <section className="py-20"><h1 className="text-3xl font-bold">Program not found</h1><p className="mt-4">Return home to explore available programs.</p></section> : <>
        <header className="py-16"><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Program overview</p><h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{program.name}</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{program.summary}</p><ProgramShareLink path={programPublicPath(program)} name={program.name} /></header>
        <section className="rounded-3xl border border-stone-200 bg-white p-7 sm:p-10"><h2 className="text-2xl font-bold">Participation & local availability</h2><p className="mt-4 leading-relaxed text-slate-600">Detailed schedules, eligibility, and Shakha-specific sessions have not been published for this program yet. Contact the team to learn more.</p><a href={`mailto:info@shakhasewasetu.com?subject=${encodeURIComponent(`Enquiry about ${program.name}`)}`} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-950 px-5 py-3 text-sm font-bold text-white"><Mail className="h-4 w-4" aria-hidden="true" />Ask about {program.name}</a></section>
      </>}
    </div>
  </main>
}
