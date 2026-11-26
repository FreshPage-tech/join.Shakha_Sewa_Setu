const tracks = [
  {
    title: 'Shakha for All Ages (Youth & Adults)',
    badge: 'Family & Community Track',
    steps: [
      ['Aachar Padhati', 'Assembly, discipline, and opening alignment.'],
      ['Sharirik (Warm-up & Yoga)', 'Dynamic stretches, Surya Namaskar, and physical fitness.'],
      ['Khel (Group Games)', 'High-energy traditional team games: Kho Kho, Kabaddi, and Dodgeball.'],
      ['Bauddhik Varga', 'Thought-provoking discussions, cultural heritage, and social awareness topics.'],
      ['Sangha Prarthana', 'Joint concluding prayer and formal disperse.'],
    ],
  },
  {
    title: 'Leader-BEE Program (Kids & Juniors K–8)',
    badge: '10-Week Youth Leadership Academy',
    steps: [
      ['Aachar Padhati & Opening', 'Starts aligned with the full Shakha assembly.'],
      ['Leadership Core Module', 'A 10-week dynamic curriculum: Geet, Shlok, Subhashit, and Amrutvachan.'],
      ['Strategic Thinking & Stories', 'Panchatantra moral analysis, Chanakya wisdom, and real-world case studies, including Jeff Bezos and Chhatrapati Shivaji Maharaj.'],
      ['Active Leadership Khel', 'Focus-building and teamwork games: Lagori, Relay, Dodgeball, and Key & Lock.'],
      ['Sangha Prarthana', 'Reconnects with parents and mentors for the closing prayer.'],
    ],
  },
]

export default function ShakhaTracksComparison() {
  return <section aria-labelledby="tracks-title" className="py-10 sm:py-14">
    <p className="text-sm font-bold uppercase tracking-widest text-orange-700">One family. Two parallel tracks.</p>
    <h2 id="tracks-title" className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Grow together, in your own way.</h2>
    <p className="mt-3 max-w-2xl text-slate-600">Same time. Same location. We begin together with Aachar Padhati and reunite for Sangha Prarthana.</p>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {tracks.map((track, index) => <article key={track.title} className={`rounded-3xl border p-6 sm:p-8 ${index ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${index ? 'bg-amber-200 text-amber-950' : 'bg-blue-100 text-blue-900'}`}>{track.badge}</span>
        <h3 className="mt-4 text-2xl font-bold text-slate-900">{track.title}</h3>
        <ol className="mt-7 space-y-6">
          {track.steps.map(([title, description], step) => <li key={title} className="flex gap-4">
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${index ? 'bg-amber-200 text-amber-950' : 'bg-blue-100 text-blue-900'}`}>{step + 1}</span>
            <div><h4 className="font-bold text-slate-900">{title}</h4><p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p></div>
          </li>)}
        </ol>
      </article>)}
    </div>
  </section>
}
