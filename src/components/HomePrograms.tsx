const base = import.meta.env.BASE_URL
const action = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4'

export default function HomePrograms() {
  return <section id="programs" aria-labelledby="programs-title" className="scroll-mt-36 bg-[#faf9f6] px-5 py-14 sm:px-8 sm:py-20">
    <div className="mx-auto max-w-7xl">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Discover our programs</p><h2 id="programs-title" className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your next step starts here.</h2></div>
        <p className="max-w-md text-base leading-relaxed text-slate-600">Explore programs, find your local Shakha, and connect with our community — all from one place.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="flex flex-col overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 bg-amber-100 px-6 py-5 sm:px-8"><span className="text-2xl font-black tracking-tight text-slate-900">LEADER<span className="text-orange-700">-BEE</span></span><span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-orange-800">Grades K–8</span></div>
          <div className="flex flex-1 flex-col p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-orange-700">10-week youth leadership program</p><h3 className="mt-3 text-2xl font-bold text-slate-900">Small steps. Future leaders.</h3><p className="mt-4 leading-relaxed text-slate-600">Help your child build confidence, strategic thinking, and teamwork through stories, cultural learning, and active leadership games.</p>
            <ul className="my-5 grid gap-2 text-sm text-slate-700"><li>✦ Geet, Shlok, and stories with meaning</li><li>✦ Teamwork, focus, and leadership through play</li><li>✦ A parallel Shakha track for parents and elder youth</li></ul>
            <p className="mb-6 text-sm text-slate-500">Bring your family: both tracks meet at the same time and location.</p>
            <div className="mt-auto flex flex-wrap gap-3"><a href={`${base}register-leader-bee`} className={`${action} bg-orange-700 text-white`}>Explore Leader-BEE <span aria-hidden="true">↗</span></a><a href={`${base}register-leader-bee#find-shakha`} className={`${action} border border-stone-300 text-slate-800`}>Find local programs</a></div>
          </div>
        </article>
        <article className="flex flex-col overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 bg-blue-950 px-6 py-5 text-white sm:px-8"><span className="text-2xl font-bold tracking-tight">Krishna My Sharthi</span><span aria-hidden="true" className="text-2xl text-amber-300">✦</span></div>
          <div className="flex flex-1 flex-col p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-widest text-blue-800">Program information</p><h3 className="mt-3 text-2xl font-bold text-slate-900">Discover Krishna My Sharthi.</h3><p className="mt-4 leading-relaxed text-slate-600">Interested in this program? Connect with us for program details and information about taking part.</p><div className="mt-auto pt-8"><a href={`${base}programs/krishna-my-sharthi`} className={`${action} bg-blue-950 text-white`}>Explore Krishna My Sharthi <span aria-hidden="true">↗</span></a></div></div>
        </article>
      </div>
    </div>
  </section>
}
