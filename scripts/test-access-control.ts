const BASE = 'http://localhost:8000/api'

async function req(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {}
  // Copy auth headers from opts
  if (opts.headers) {
    const h = opts.headers as Record<string, string>
    for (const [k, v] of Object.entries(h)) headers[k] = v
  }
  // Only set Content-Type if body is provided and not FormData
  if (opts.body && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch { data = text }
  return { status: res.status, data }
}

async function signUp(email: string, password: string, name: string) {
  return req('/auth/sign-up/email', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
}

async function signIn(email: string, password: string) {
  const res = await req('/auth/sign-in/email', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return res
}

async function main() {
  console.log('=== Access Control Test ===\n')

  // Sign in existing test users (they were created by seed)
  console.log('1. Sign in...')
  const s1 = await signIn('access-test1@test.com', 'Test1234!')
  const token1 = s1.data?.token
  console.log('   Test1:', s1.status, token1 ? '✓' : '✗')

  const s2 = await signIn('access-test2@test.com', 'Test1234!')
  const token2 = s2.data?.token
  console.log('   Test2:', s2.status, token2 ? '✓' : '✗')

  if (!token1 || !token2) {
    console.log('Failed to get tokens:', JSON.stringify({ s1: s1.data, s2: s2.data }))
    return
  }

  const auth = (t: string) => ({ Authorization: `Bearer ${t}` })

  // Generate invite from test1
  console.log('\n2. Generate invite code...')
  const inviteRes = await req('/settings/invite/generate', {
    method: 'POST',
    headers: auth(token1),
  })
  console.log('   Invite:', inviteRes.status, inviteRes.data)
  const inviteCode = inviteRes.data?.code

  // Test2 accepts invite
  if (inviteCode) {
    console.log('\n3. Test2 joins workspace...')
    const joinRes = await req('/settings/invite/accept', {
      method: 'POST',
      headers: auth(token2),
      body: JSON.stringify({ code: inviteCode }),
    })
    console.log('   Join:', joinRes.status, joinRes.data)
  }

  // Check workspace members
  console.log('\n4. Check workspace members...')
  const members = await req('/settings/workspace/members', { headers: auth(token1) })
  console.log('   Members:', members.data?.members?.map((m: any) => `${m.name} (${m.role})`).join(', '))

  // Test1 uploads workspace-scope file
  console.log('\n5. Test1 uploads workspace-scope file...')
  const formData1 = new FormData()
  formData1.append('file', new Blob(['Workspace content here'], { type: 'text/plain' }), 'workspace-doc.txt')
  const up1 = await fetch(`${BASE}/files/upload`, {
    method: 'POST',
    headers: { ...auth(token1), 'X-Access-Scope': 'workspace' },
    body: formData1,
  }).then(async r => ({ status: r.status, data: await r.json().catch(() => null) }))
  console.log('   Upload:', up1.status, 'id=' + up1.data?.id)
  const file1Id = up1.data?.id

  // Test1 uploads private-scope file
  console.log('\n6. Test1 uploads private-scope file...')
  const formData2 = new FormData()
  formData2.append('file', new Blob(['Private content here'], { type: 'text/plain' }), 'private-doc.txt')
  const up2 = await fetch(`${BASE}/files/upload`, {
    method: 'POST',
    headers: { ...auth(token1), 'X-Access-Scope': 'private' },
    body: formData2,
  }).then(async r => ({ status: r.status, data: await r.json().catch(() => null) }))
  console.log('   Upload:', up2.status, 'id=' + up2.data?.id)
  const file2Id = up2.data?.id

  // Both list files
  console.log('\n7. Both users list files...')
  const f1 = await req('/files', { headers: auth(token1) })
  const f2 = await req('/files', { headers: auth(token2) })
  console.log('   Test1 sees:', f1.data?.length, 'files')
  console.log('   Test2 sees:', f2.data?.length, 'files')

  // Verify
  const test2SeesPrivate = f2.data?.some((f: any) => f.id === file2Id)
  const test2SeesWorkspace = f2.data?.some((f: any) => f.id === file1Id)
  console.log(`\n8. Verification:`)
  console.log(`   Test2 sees workspace file: ${test2SeesWorkspace ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`   Test2 sees private file:   ${!test2SeesPrivate ? '✅ PASS' : '❌ FAIL'}`)

  // Test1 changes workspace file to private
  if (file1Id) {
    console.log('\n9. Test1 changes workspace → private...')
    const patch = await req(`/files/${file1Id}/access`, {
      method: 'PATCH',
      headers: auth(token1),
      body: JSON.stringify({ accessScope: 'private' }),
    })
    console.log('   Patch:', patch.status)

    const f2After = await req('/files', { headers: auth(token2) })
    const test2SeesAfter = f2After.data?.some((f: any) => f.id === file1Id)
    console.log(`   Test2 sees file after change: ${!test2SeesAfter ? '✅ PASS' : '❌ FAIL'}`)
  }

  // Test1 changes it back to workspace
  if (file1Id) {
    console.log('\n10. Test1 changes private → workspace...')
    const patch = await req(`/files/${file1Id}/access`, {
      method: 'PATCH',
      headers: auth(token1),
      body: JSON.stringify({ accessScope: 'workspace' }),
    })
    console.log('    Patch:', patch.status)

    const f2Final = await req('/files', { headers: auth(token2) })
    const test2SeesFinal = f2Final.data?.some((f: any) => f.id === file1Id)
    console.log(`    Test2 sees file after restore: ${test2SeesFinal ? '✅ PASS' : '❌ FAIL'}`)
  }

  console.log('\n=== All tests done ===')
}

main().catch(console.error)
