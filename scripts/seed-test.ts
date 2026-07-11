import { PrismaClient } from '../node_modules/.bun/@prisma+client@6.19.3/node_modules/@prisma/client/index.js'

const db = new PrismaClient()

async function seed() {
  console.log('Seeding test workspace and users...')

  // Test users
  const test1 = await db.user.upsert({
    where: { email: 'test1@test.com' },
    update: {},
    create: { id: 'test1-user', email: 'test1@test.com', name: 'Test One', emailVerified: true },
  })
  const test2 = await db.user.upsert({
    where: { email: 'test2@test.com' },
    update: {},
    create: { id: 'test2-user', email: 'test2@test.com', name: 'Test Two', emailVerified: true },
  })

  // Shared workspace owned by test1, test2 is a member
  let workspace = await db.workspace.findFirst({ where: { ownerId: test1.id } })
  if (!workspace) {
    workspace = await db.workspace.create({
      data: {
        name: 'Test Workspace',
        ownerId: test1.id,
        inviteCode: 'test-invite-code-123',
        members: { create: { userId: test1.id, role: 'admin' } },
      },
    })
  }

  // Ensure test2 is a member
  await db.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: test2.id } },
    update: {},
    create: { workspaceId: workspace.id, userId: test2.id, role: 'member' },
  })

  // Seed test files
  const file1 = await db.file.upsert({
    where: { id: 1001 },
    update: {},
    create: {
      id: 1001,
      userId: test1.id,
      workspaceId: workspace.id,
      originalName: 'workspace-doc.txt',
      storageUrl: '/tmp/test/workspace-doc.txt',
      fileType: 'text/plain',
      folder: 'Dokumen',
      sizeBytes: 1024,
      extractedText: 'This is a workspace file visible to all members.',
      accessScope: 'workspace',
    },
  })

  const file2 = await db.file.upsert({
    where: { id: 1002 },
    update: {},
    create: {
      id: 1002,
      userId: test1.id,
      workspaceId: workspace.id,
      originalName: 'private-notes.txt',
      storageUrl: '/tmp/test/private-notes.txt',
      fileType: 'text/plain',
      folder: 'Lainnya',
      sizeBytes: 512,
      extractedText: 'This is a private file only visible to the uploader.',
      accessScope: 'private',
    },
  })

  // Create the test files on disk
  const { writeFile, mkdir } = await import('node:fs/promises')
  await mkdir('/tmp/test', { recursive: true })
  await writeFile('/tmp/test/workspace-doc.txt', 'This is a workspace file visible to all members.')
  await writeFile('/tmp/test/private-notes.txt', 'This is a private file only visible to the uploader.')

  console.log(`Workspace: ${workspace.name} (id: ${workspace.id})`)
  console.log(`Invite code: ${workspace.inviteCode}`)
  console.log(`Test1: ${test1.email} (id: ${test1.id})`)
  console.log(`Test2: ${test2.email} (id: ${test2.id})`)
  console.log(`File 1001: workspace-doc.txt (scope: workspace)`)
  console.log(`File 1002: private-notes.txt (scope: private)`)
  console.log('Seeding complete!')
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect())
