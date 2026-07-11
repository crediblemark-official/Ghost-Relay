import { env } from '@ghost/config'
import { buildApp } from './app.js'
import { seedDatabase } from './core/seeder.js'

async function main() {
  const app = await buildApp()

  await app.ready()

  // Warn about default/placeholder secrets in production
  if (env.ENVIRONMENT === 'production') {
    const fatalErrors: string[] = []
    if (env.ADMIN_PASSWORD === 'admin123') {
      fatalErrors.push('ADMIN_PASSWORD is still set to the default value "admin123"')
    }
    if (env.JWT_SECRET_KEY === 'change-me-in-production') {
      fatalErrors.push('JWT_SECRET_KEY is still set to the placeholder "change-me-in-production"')
    }
    if (env.ENCRYPTION_KEY === 'change-me-in-production') {
      fatalErrors.push('ENCRYPTION_KEY is still set to the placeholder "change-me-in-production"')
    }
    if (env.CRYPTO_SALT === 'change-me-in-production') {
      fatalErrors.push('CRYPTO_SALT is still set to the placeholder "change-me-in-production"')
    }
    if (fatalErrors.length > 0) {
      console.error('FATAL: Refusing to start with default/placeholder secrets in production:')
      fatalErrors.forEach(e => console.error(`  - ${e}`))
      console.error('Set proper values via environment variables and restart.')
      process.exit(1)
    }
  }

  try {
    await seedDatabase()
  } catch (err) {
    console.warn('Database seeding skipped:', (err as Error).message)
  }

  await app.listen({ port: env.PORT, host: env.HOST })
  console.log(`Ghost Relay running on http://${env.HOST}:${env.PORT}`)
}

main().catch((err) => {
  console.error('Startup error:', err)
  process.exit(1)
})
