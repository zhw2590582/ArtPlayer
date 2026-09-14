import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { browserInvocation, installedPackages } from './browser-validation/scope.ts'
import { verifyInstalledArtifacts } from './installed-artifacts.mjs'

const invocation = browserInvocation(process.argv[2], process.argv.slice(3), process.env)
const artifacts = invocation.scope === 'installed'
  ? verifyInstalledArtifacts(process.cwd(), invocation.env.ARTPLAYER_BROWSER_ARTIFACTS, installedPackages)
  : null
fs.mkdirSync(invocation.directory, { recursive: true })
fs.writeFileSync(path.join(invocation.directory, 'invocation.json'), `${JSON.stringify({ scope: invocation.scope, args: invocation.args, node: process.versions.node, artifactMap: invocation.env.ARTPLAYER_BROWSER_ARTIFACTS || null, inputs: artifacts?.inputs || [] }, null, 2)}\n`)
const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', ...invocation.args], { env: invocation.env, stdio: 'inherit', windowsHide: true })
let spawnError
let interrupted
child.on('error', (error) => {
  spawnError = error.message
  console.error(error)
})
child.on('close', (code, signal) => {
  fs.writeFileSync(path.join(invocation.directory, 'result.json'), `${JSON.stringify({ scope: invocation.scope, exitCode: code, signal, interrupted, spawnError, args: invocation.args }, null, 2)}\n`)
  process.exitCode = interrupted || spawnError ? 1 : code ?? 1
})
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    interrupted = signal
    child.kill(signal)
  })
}
