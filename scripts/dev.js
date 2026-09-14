import process from 'node:process'
import { runDevelop } from './library/development.ts'

const abort = new AbortController()
const stop = () => abort.abort()
process.once('SIGINT', stop)
process.once('SIGTERM', stop)

try {
  const configured = process.env.ARTPLAYER_DEV_PORT
  const port = configured === undefined ? 8082 : Number(configured)
  if (configured?.trim() === '' || !Number.isInteger(port) || port < 0 || port > 65535)
    throw new Error('ARTPLAYER_DEV_PORT must be an integer from 0 through 65535')
  const session = await runDevelop({ port, signal: abort.signal })
  await session?.done
}
catch (error) {
  if (!abort.signal.aborted) {
    console.error('❌ Development server failed:', error)
    process.exitCode = 1
  }
}
finally {
  process.off('SIGINT', stop)
  process.off('SIGTERM', stop)
}
