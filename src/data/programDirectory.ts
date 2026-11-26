export type ProgramDefinition = {
  slug: string
  name: string
  publicPath: string
  summary: string
  audience: string
  detailsPending?: boolean
}

// Every program has its own public overview URL. Branch events keep separate URLs.
export const programDirectory: ProgramDefinition[] = [
  {
    slug: 'leader-bee',
    name: 'Leader-BEE',
    publicPath: '/register-leader-bee',
    summary: 'A 10-week leadership journey through teamwork, stories, culture, and play, alongside the family Shakha track.',
    audience: 'Grades K–8 · Families welcome',
  },
  {
    slug: 'krishna-my-sharthi',
    name: 'Krishna My Sharthi',
    publicPath: '/programs/krishna-my-sharthi',
    summary: 'Learn about Krishna My Sharthi and connect with the team for participation details.',
    audience: 'Contact the team for program details',
    detailsPending: true,
  },
]

export const programPublicPath = (program: ProgramDefinition) => `${import.meta.env.BASE_URL}${program.publicPath.slice(1)}`
