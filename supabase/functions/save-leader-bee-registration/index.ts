const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type Child = { name?: string; grade?: string }

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!supabaseUrl || !serviceKey) return json({ error: 'Registration storage is not configured' }, 500)

  let input: Record<string, unknown>
  try {
    input = await request.json()
  } catch {
    return json({ error: 'Invalid request body' }, 400)
  }

  const submissionKey = String(input.submissionKey || '').trim()
  const shakhaSlug = String(input.shakhaSlug || 'usa-07751-sri-krishna-shakha').trim()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(shakhaSlug) || shakhaSlug.length > 200) {
    return json({ error: 'Invalid Shakha' }, 400)
  }
  const parentName = String(input.parentName || '').trim()
  const parentEmail = String(input.parentEmail || '').trim().toLowerCase()
  const parentPhone = String(input.parentPhone || '').replace(/\D/g, '')
  const children = (Array.isArray(input.children) ? input.children : [])
    .map((raw: Child) => ({ name: String(raw?.name || '').trim(), grade: String(raw?.grade || '').trim() }))
    .filter((child: Child) => child.name && /^Grade (?:K|[1-9]|1[0-2])$/.test(child.grade || ''))
  const participantCount = children.filter((child: Child) => /^Grade (?:K|[1-8])$/.test(child.grade || '')).length

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionKey)) {
    return json({ error: 'A valid submission ID is required' }, 400)
  }
  if (!parentName || !/^\S+@\S+\.\S+$/.test(parentEmail) || !/^\d{10}$/.test(parentPhone)) {
    return json({ error: 'Valid parent contact details are required' }, 400)
  }
  if (children.length < 1 || children.length > 10) return json({ error: 'Please register between 1 and 10 children' }, 400)

  // This legacy route cannot create or replace registrations in the verified engine.
  const guardUrl = Deno.env.get('SUPABASE_URL') || ''
  const guardKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  if (!guardUrl || !guardKey) return json({ error: 'Registration storage is not configured' }, 503)
  const guardHeaders = { apikey: guardKey, Authorization: `Bearer ${guardKey}` }
  const existingResponse = await fetch(`${guardUrl}/rest/v1/leader_bee_registrations?submission_key=eq.${encodeURIComponent(submissionKey)}&select=phone_verified_at`, { headers: guardHeaders })
  const branchResponse = await fetch(`${guardUrl}/rest/v1/leader_bee_branches?slug=eq.${encodeURIComponent(shakhaSlug)}&select=slug`, { headers: guardHeaders })
  if (!existingResponse.ok || !branchResponse.ok) return json({ error: 'Unable to validate registration. Please try again.' }, 503)
  const existing = await existingResponse.json()
  const branches = await branchResponse.json()
  if (existing.some((row: { phone_verified_at?: string }) => row.phone_verified_at) || branches.length) {
    return json({ error: 'Please use the branch page and verify your WhatsApp number before registration or payment.' }, 403)
  }

  const row = {
    submission_key: submissionKey,
    shakha_slug: shakhaSlug,
    parent_name: parentName,
    parent_email: parentEmail,
    parent_phone: parentPhone,
    children,
    child_count: children.length,
    participant_count: participantCount,
    amount_cents: participantCount * 1000,
    payment_status: participantCount > 0 ? 'pending' : 'not_required',
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/leader_bee_registrations?on_conflict=submission_key`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(row),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    console.error('Leader-BEE registration storage error', data)
    return json({ error: 'Unable to save registration' }, 502)
  }

  return json({ id: data?.[0]?.id, submissionKey })
})
