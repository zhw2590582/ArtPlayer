import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export const ecosystemChecks = [
  { script: 'test:package', args: ['--include=artplayer-plugin-audio-track,artplayer-plugin-hls-control'], packages: ['artplayer', 'artplayer-plugin-chapter', 'artplayer-plugin-audio-track', 'artplayer-plugin-hls-control'] },
  ...[
    ['ads', 'artplayer-plugin-ads'],
    ['ambilight', 'artplayer-plugin-ambilight'],
    ['asr', 'artplayer-plugin-asr'],
    ['auto-thumbnail', 'artplayer-plugin-auto-thumbnail'],
    ['canvas', 'artplayer-proxy-canvas'],
    ['chromecast', 'artplayer-plugin-chromecast'],
    ['danmuku', 'artplayer-plugin-danmuku'],
    ['danmuku-mask', 'artplayer-plugin-danmuku-mask'],
    ['dash', 'artplayer-plugin-dash-control'],
    ['dpip', 'artplayer-plugin-document-pip'],
    ['iframe', 'artplayer-tool-iframe'],
    ['jassub', 'artplayer-plugin-jassub'],
    ['mediabunny', 'artplayer-proxy-mediabunny'],
    ['multiple-subtitles', 'artplayer-plugin-multiple-subtitles'],
    ['thumbnail', 'artplayer-tool-thumbnail'],
    ['vast', 'artplayer-plugin-vast'],
    ['vtt-thumbnail', 'artplayer-plugin-vtt-thumbnail'],
  ].map(([name, pkg]) => ({ script: `test:${name}-types-package`, args: [], packages: [pkg!] })),
]

export function verifyEcosystemScope(directory: string, checks = ecosystemChecks) {
  const names = fs.readdirSync(path.join(directory, 'packages')).filter(name => name !== 'artplayer-vitepress' && fs.existsSync(path.join(directory, 'packages', name, 'package.json'))).sort()
  const covered = checks.flatMap(check => check.packages).sort()
  assert.deepEqual(covered, names, 'Every library package needs exactly one installed type check')
  const manifest = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8')) as { scripts: Record<string, string> }
  for (const check of checks)
    assert(manifest.scripts[check.script], `Missing consumer command: ${check.script}`)
  return names
}

export async function runConsumerCommand(executable: string, args: string[], cwd: string, log: string) {
  const started = Date.now()
  const file = fs.openSync(log, 'w')
  try {
    const result = await new Promise<{ code: number | null, signal: NodeJS.Signals | null, error?: string }>((resolve) => {
      const child = spawn(executable, args, { cwd, windowsHide: true, stdio: ['ignore', file, file], env: { ...process.env, NODE_PATH: '' } })
      child.once('error', error => resolve({ code: null, signal: null, error: error.message }))
      child.once('close', (code, signal) => resolve({ code, signal }))
    })
    return { ...result, elapsedMs: Date.now() - started, log, sha256: createHash('sha256').update(fs.readFileSync(log)).digest('hex') }
  }
  finally {
    fs.closeSync(file)
  }
}

export async function checkEcosystem(directory = fileURLToPath(new URL('../../', import.meta.url))) {
  assert.equal(process.env.npm_config_user_agent?.split(' ')[0], 'yarn/1.22.22', 'Use the pinned Yarn')
  const yarn = process.env.npm_execpath
  assert(yarn && fs.existsSync(yarn), 'Missing Yarn executable')
  const packages = verifyEcosystemScope(directory)
  const parent = path.join(directory, 'refactor/.cache/ecosystem-types')
  fs.mkdirSync(parent, { recursive: true })
  const output = fs.mkdtempSync(path.join(parent, 'run-'))
  const results: { command: string[], packages: string[], outcome: Awaited<ReturnType<typeof runConsumerCommand>> }[] = []
  const save = () => fs.writeFileSync(path.join(output, 'report.json'), `${JSON.stringify({ packages, node: process.version, results, scope: 'Installed type contracts, including explicitly recorded historical diagnostics. Not runtime/device or release acceptance.' }, null, 2)}\n`)
  console.log(`Ecosystem installed types: ${output}`)
  for (const args of [['build:types'], ['build', 'all'], ['build:i18n']]) {
    const outcome = await runConsumerCommand(process.execPath, [yarn, ...args], directory, path.join(output, `prepare-${results.length}.log`))
    results.push({ command: args, packages: [], outcome })
    save()
    assert.equal(outcome.code, 0, `Cannot test stale packages after failed preparation; see ${outcome.log}`)
  }
  let failed = false
  for (const [index, check] of ecosystemChecks.entries()) {
    const args = [check.script, ...check.args]
    console.log(`[${index + 1}/${ecosystemChecks.length}] ${args.join(' ')}`)
    const outcome = await runConsumerCommand(process.execPath, [yarn, ...args], directory, path.join(output, `${check.script.replaceAll(':', '-')}.log`))
    results.push({ command: args, packages: check.packages, outcome })
    save()
    if (outcome.code !== 0)
      failed = true
    console.log(`${check.script}: ${outcome.code === 0 ? 'passed' : 'FAILED'} (${Math.round(outcome.elapsedMs / 1000)}s); ${outcome.log}`)
  }
  assert(!failed, `Installed ecosystem type checks failed; all available results retained in ${output}`)
  return { output, results }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkEcosystem().catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
}
