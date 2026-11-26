import ProgramShareLink from './ProgramShareLink'
import LeaderBeeBranchPicker from './LeaderBeeBranchPicker'
import { useEffect } from 'react'
import ShakhaTracksComparison from './ShakhaTracksComparison'

const base = import.meta.env.BASE_URL
const cta = 'inline-flex items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-bold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4'
export default function LeaderBeeProgramPage({ branchNotice = '' }: { branchNotice?: string }) {
  useEffect(() => {
    const target = branchNotice ? 'find-shakha' : window.location.hash.slice(1)
    if (target) document.getElementById(target)?.scrollIntoView({ block: 'start' })
  }, [])
  return <main className="min-h-screen bg-[#faf9f6] text-slate-900">
    <nav aria-label="Program navigation" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-10">
      <a href={`${base}register-leader-bee`} className="flex items-center gap-3 text-xl font-black tracking-tight"><span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-2xl">B</span>LEADER<span className="-ml-3 text-orange-700">-BEE</span></a>
      <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex"><a href="#discover">The program</a><a href="#family">For families</a><a href="#questions">FAQs</a></div>
      <a href="#find-shakha" className={`${cta} bg-slate-900 text-white`}>Choose a location <span aria-hidden="true">↗</span></a>
    </nav>
    <div className="mx-auto max-w-7xl px-5 sm:px-10">
      <header className="grid items-center gap-12 pb-14 pt-10 lg:grid-cols-2 lg:pb-24 lg:pt-16">
        <div><span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-800"><span className="h-2 w-2 rounded-full bg-orange-600" />Big possibilities. Little leaders.</span>
          <h1 className="mt-6 text-5xl font-black leading-[1.06] tracking-[-0.05em] sm:text-7xl">Small steps.<br />Strong values.<br /><span className="text-orange-700">Future leaders.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">A 10-week journey of discovery, teamwork, and confidence for kids in Grades K–8. Rooted in culture. Brought to life through play.</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#find-shakha" className={`${cta} bg-orange-700 text-white`}>Choose location & register <span aria-hidden="true">↗</span></a><a href="#discover" className={`${cta} border border-stone-300 bg-white`}>Meet the program <span aria-hidden="true">↓</span></a></div>
          <p className="mt-5 text-sm text-slate-500">For your child. With your family. In your community.</p><ProgramShareLink name="Leader-BEE" path={`${base}register-leader-bee`} />
        </div>
        <div className="relative pb-7 pl-3 sm:pl-8">
          <div className="absolute -right-2 top-8 h-64 w-64 rounded-full bg-amber-200/60 blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#e9e5d9] shadow-xl shadow-stone-200/60"><img src={`${base}register-leader-bee/assets/images/workshop.webp`} alt="Children learning and participating in a workshop together" className="aspect-[4/4.3] w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 to-transparent p-8 pt-24 text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Learning that stays with them</p><p className="mt-2 text-3xl font-bold">A little curiosity.<br />A lifetime of confidence.</p></div></div>
          <div className="absolute -left-1 bottom-0 rounded-2xl border border-stone-100 bg-white p-5 shadow-lg sm:left-0"><span className="text-3xl font-black text-orange-700">10</span><span className="ml-3 text-sm font-semibold">weeks to learn, play & grow</span></div>
        </div>
      </header>
      <section aria-label="Program at a glance" className="grid grid-cols-2 gap-6 border-y border-stone-200 py-8 md:grid-cols-4">{[['K–8', 'Kids & juniors'], ['10 weeks', 'Purposeful discovery'], ['2 tracks', 'One family experience'], ['Together', 'Same time & location']].map(([title, subtitle]) => <div key={title}><p className="text-2xl font-bold tracking-tight">{title}</p><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>)}</section>
      <section id="discover" className="scroll-mt-8 py-16 sm:py-24"><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">More than a weekly activity</p><div className="mt-4 grid gap-5 md:grid-cols-2"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Life skills today.<br />Leadership for tomorrow.</h2><p className="max-w-lg self-center text-slate-600">Every session turns meaningful ideas into experiences children can understand, enjoy, and carry into everyday life.</p></div><div className="mt-9 grid gap-5 md:grid-cols-3">{[['01', 'Think with curiosity', 'Explore Panchatantra stories, Chanakya wisdom, and real-world examples. Ask questions. Discover new perspectives.', 'bg-[#eeeee5]'], ['02', 'Lead through play', 'Practice focus, communication, and teamwork through Lagori, relay games, and shared challenges.', 'bg-[#faeadc]'], ['03', 'Grow with values', 'Connect with Geet, Shlok, Subhashit, and Amrutvachan through a lively, age-appropriate curriculum.', 'bg-[#e8edf3]']].map(([number, title, description, color]) => <article key={number} className={`rounded-3xl p-7 ${color}`}><span className="text-sm font-bold text-slate-500">/{number}</span><h3 className="mb-3 mt-10 text-xl font-bold">{title}</h3><p className="text-sm leading-relaxed text-slate-600">{description}</p></article>)}</div></section>
      <section id="family" className="scroll-mt-8 rounded-3xl bg-[#152c28] p-7 text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Their journey. Your time, too.</p><h2 className="mt-4 text-3xl font-bold sm:text-4xl">Bring your entire family.</h2><p className="mt-4 max-w-3xl leading-relaxed text-stone-200">While your kids build leadership and strategic thinking through Leader-BEE, parents and elder youth participate in health, yoga, and discussions.</p></section>
      <ShakhaTracksComparison />
      <section id="find-shakha" className="my-8 scroll-mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 sm:p-10">{branchNotice && <p role="status" className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">{branchNotice}</p>}<LeaderBeeBranchPicker context="leader-bee" /></section>
      <section id="questions" className="mx-auto max-w-3xl py-14 sm:py-20"><h2 className="mb-7 text-center text-3xl font-bold">A few things to know.</h2>{[['Who can join Leader-BEE?', 'The leadership module is designed for children and juniors in Grades K–8. Parents, elder youth, and other age groups can join the parallel Shakha routine.'], ['Can our whole family attend?', 'Yes. Both tracks meet at the same time and location, begin with Aachar Padhati, and come together again for Sangha Prarthana.'], ['How do registration and payment work?', 'Choose your Shakha above, review its local details, then select Register Child for Leader-BEE. The existing parent and child registration form guides you through registration and payment.'], ['Who can help with local questions?', 'Your selected Shakha page includes available coordinator contacts. Ask the Mukhya Shikshak about the program and the Karyawah about venue, logistics, or attending as an adult.']].map(([question, answer]) => <details key={question} className="group border-b border-stone-200 py-5"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm leading-relaxed text-slate-600">{answer}</p></details>)}</section>
      <footer className="flex flex-wrap justify-between gap-4 border-t border-stone-200 py-8 text-sm text-slate-500"><span className="font-bold text-slate-900">LEADER-BEE · Shakha Sewa Setu</span><a href={base} className="hover:text-orange-700">Explore Shakha Sewa Setu ↗</a></footer>
    </div>
  </main>
}
