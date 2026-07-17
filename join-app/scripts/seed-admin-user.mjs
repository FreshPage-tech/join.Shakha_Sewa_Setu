import { createClient } from '@supabase/supabase-js'

function parseArgs(argv) {
  const args = {
    email: '',
    mobile: '+919825311888',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === '--email') {
      args.email = argv[i + 1] ?? ''
      i += 1
      continue
    }

    if (token === '--mobile') {
      args.mobile = argv[i + 1] ?? ''
      i += 1
      continue
    }
  }

  return args
}

async function findUserByEmail(supabase, targetEmail) {
  const pageSize = 200
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: pageSize,
    })

    if (error) {
      throw error
    }

    const users = data?.users ?? []
    const match = users.find(user => (user.email ?? '').toLowerCase() === targetEmail.toLowerCase())
    if (match) {
      return match
    }

    if (users.length < pageSize) {
      return null
    }

    page += 1
  }
}

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Missing SUPABASE_URL (or VITE_SUPABASE_URL)')
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  const { email, mobile } = parseArgs(process.argv.slice(2))

  if (!email) {
    throw new Error('Usage: pnpm run seed:admin -- --email admin@example.com [--mobile +919825311888]')
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const user = await findUserByEmail(supabase, email)
  if (!user) {
    throw new Error(`No auth user found for email: ${email}`)
  }

  const { error } = await supabase
    .from('admin_users')
    .upsert({
      user_id: user.id,
      mobile,
    }, { onConflict: 'user_id' })

  if (error) {
    throw error
  }

  console.log('Admin mapping saved successfully.')
  console.log(`Email: ${email}`)
  console.log(`User ID: ${user.id}`)
  console.log(`Mobile: ${mobile}`)
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
