import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const server = net.createServer()
server.listen(0)
await once(server, 'listening')
const { port } = server.address()
try {
  const child = spawn(process.execPath, ['--input-type=module', '--eval', "import servor from 'servor'; await servor({port:Number(process.env.ARTPLAYER_PROBE_PORT),reload:false}); process.exit(7)"], {
    cwd: root,
    env: { ...process.env, ARTPLAYER_PROBE_PORT: String(port) },
    windowsHide: true,
    timeout: 10000,
  })
  let output = ''
  child.stdout.on('data', (data) => { output += data })
  child.stderr.on('data', (data) => { output += data })
  const [code, signal] = await once(child, 'exit')
  const version = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/servor/package.json'), 'utf8')).version
  const result = { task: 'MOD-DEV-01', node: process.version, servor: version, occupiedPort: port, code, signal, output, interpretation: 'Historical upstream defect reproduction, not candidate success: an occupied requested port exits the entire process with status zero.' }
  fs.writeFileSync(path.join(root, 'refactor/.cache/servor-port-probe.json'), `${JSON.stringify(result, null, 2)}\n`)
  assert.match(output, /port.*already in use/)
  assert.equal(code, 0, 'Pinned Servor no longer reproduces its historical successful failure exit')
  console.log(JSON.stringify(result, null, 2))
}
finally {
  await new Promise(resolve => server.close(resolve))
}
