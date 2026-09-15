import assert from 'node:assert/strict'
import { execFile, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { firefox } from '@playwright/test'
import { selectFirefoxProcesses } from './firefox-process-scope.mjs'

const execute = promisify(execFile)
const repo = fileURLToPath(new URL('../../', import.meta.url))
const sha256 = filename => createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const powershell = script => execute('pwsh.exe', ['-NoProfile', '-NonInteractive', '-Command', script], { windowsHide: true, timeout: 15000, maxBuffer: 4 * 1024 * 1024 })
async function snapshot() {
  const { stdout } = await powershell('Get-CimInstance Win32_Process -Filter "Name = \'firefox.exe\' OR Name = \'node.exe\'" | ForEach-Object { [pscustomobject]@{ pid=[int]$_.ProcessId; parent=[int]$_.ParentProcessId; created=$_.CreationDate.ToUniversalTime().ToString("o"); executable=$_.ExecutablePath } } | ConvertTo-Json -Compress')
  const rows = JSON.parse(stdout)
  return Array.isArray(rows) ? rows : [rows]
}

async function main() {
  assert.equal(process.platform, 'win32', 'ProcDump diagnostic requires Windows')
  assert.equal(process.versions.node, fs.readFileSync(path.join(repo, '.node-version'), 'utf8').trim().replace(/^v/, ''))
  const [toolOption, toolPath, separator, ...args] = process.argv.slice(2)
  assert(toolOption === '--procdump' && toolPath && separator === '--', 'Usage: node refactor/scripts/hls-native-diagnostic.mjs --procdump <procdump64.exe> -- <hls-sdk-diagnostic options>')
  const tool = path.resolve(toolPath)
  assert.equal(sha256(tool), 'd1fc99ae304bd1d2bf28abeb62531da959e2431916194981b88c958fd713a8e6', 'Use the verified ProcDump 12.01 executable')
  // Paths travel through an environment variable, never through PowerShell source text.
  const signature = await execute('pwsh.exe', ['-NoProfile', '-NonInteractive', '-Command', '$s = Get-AuthenticodeSignature -LiteralPath $env:ARTPLAYER_PROCDUMP; [pscustomobject]@{status=$s.Status.ToString(); signer=$s.SignerCertificate.Subject; version=(Get-Item -LiteralPath $env:ARTPLAYER_PROCDUMP).VersionInfo.FileVersion} | ConvertTo-Json -Compress'], { windowsHide: true, timeout: 15000, env: { ...process.env, ARTPLAYER_PROCDUMP: tool } })
  const identity = JSON.parse(signature.stdout)
  assert.equal(identity.status, 'Valid')
  assert(identity.signer.startsWith('CN=Microsoft Corporation,'))
  assert.equal(identity.version, '12.01')
  const directory = fs.mkdtempSync(path.join(repo, 'refactor/.cache/hls-native-'))
  const runnerPath = path.join(repo, 'refactor/scripts/hls-sdk-diagnostic.mjs')
  const executable = firefox.executablePath()
  const report = { started: new Date().toISOString(), directory, args, tool: { ...identity, sha256: sha256(tool) }, firefox: { executable, sha256: sha256(executable) }, runnerSHA256: sha256(runnerPath), wrapperSHA256: sha256(fileURLToPath(import.meta.url)), scopeSHA256: sha256(fileURLToPath(new URL('./firefox-process-scope.mjs', import.meta.url))), attachments: [], errors: [] }
  const handles = []
  const runnerLog = fs.openSync(path.join(directory, 'runner.log'), 'wx')
  const runner = spawn(process.execPath, [runnerPath, ...args], { cwd: repo, windowsHide: true, stdio: ['ignore', runnerLog, runnerLog] })
  let finished = false
  const completion = new Promise((resolve) => {
    runner.on('error', (error) => {
      report.errors.push(String(error))
      finished = true
      resolve()
    })
    runner.on('close', (code, signal) => {
      report.runnerExit = { code, signal }
      finished = true
      resolve()
    })
  })
  console.log(`Native diagnostic: ${directory}; runner PID ${runner.pid}`)
  try {
    const root = (await snapshot()).find(row => row.pid === runner.pid)
    assert(root, 'Diagnostic runner exited before its process identity could be verified')
    report.root = root
    const seen = new Set()
    // Completion is updated by the child-process event handlers.
    // eslint-disable-next-line no-unmodified-loop-condition -- The runner close event ends observation.
    while (!finished) {
      const rows = await snapshot()
      for (const target of selectFirefoxProcesses(rows, root, executable)) {
        const key = `${target.pid}:${target.created}`
        if (seen.has(key))
          continue
        seen.add(key)
        assert(seen.size <= 200, 'Native diagnostic process limit reached')
        const entry = { ...target, started: new Date().toISOString(), log: `procdump-${target.pid}-${handles.length}.log`, dump: `firefox-${target.pid}-${handles.length}.dmp` }
        report.attachments.push(entry)
        const log = fs.openSync(path.join(directory, entry.log), 'wx')
        const child = spawn(tool, ['-accepteula', '-mm', '-e', '-n', '1', '-at', '10', String(target.pid), path.join(directory, entry.dump)], { windowsHide: true, stdio: ['ignore', log, log] })
        const handle = { target, child, entry, log, finished: false }
        handle.completion = new Promise((resolve) => {
          child.on('error', (error) => {
            entry.error = String(error)
            handle.finished = true
            resolve()
          })
          child.on('close', (code, signal) => {
            entry.exit = { code, signal }
            handle.finished = true
            resolve()
          })
        })
        handles.push(handle)
      }
      await setTimeout(250)
    }
  }
  catch (error) {
    report.errors.push(String(error))
  }
  finally {
    // The bounded existing runner owns browser shutdown. Never kill the debuggee.
    await completion
    for (const handle of handles) {
      if (!handle.finished) {
        try {
          const live = (await snapshot()).find(row => row.pid === handle.target.pid)
          if (live?.created === handle.target.created && live.executable === handle.target.executable) {
            const result = await execute(tool, ['-cancel', String(handle.target.pid)], { windowsHide: true, timeout: 15000 })
            handle.entry.cancel = result.stdout
          }
        }
        catch (error) {
          handle.entry.cancelError = String(error)
        }
        await Promise.race([handle.completion, setTimeout(15000)])
      }
      handle.entry.monitorStopped = handle.finished
      fs.closeSync(handle.log)
    }
    fs.closeSync(runnerLog)
    report.finished = new Date().toISOString()
    report.monitoringHadFailures = !handles.length || handles.some(handle => handle.entry.error || handle.entry.exit?.code !== 0 || !handle.finished)
    report.dumps = fs.readdirSync(directory).filter(name => name.endsWith('.dmp')).map(name => ({ name, bytes: fs.statSync(path.join(directory, name)).size, sha256: sha256(path.join(directory, name)) }))
    fs.writeFileSync(path.join(directory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
    console.log(JSON.stringify({ runnerExit: report.runnerExit, attachments: handles.length, dumps: report.dumps, errors: report.errors, monitorsStopped: handles.every(handle => handle.finished), monitoringHadFailures: report.monitoringHadFailures }))
  }
  process.exitCode = report.runnerExit?.code === 0 && !report.errors.length && !report.monitoringHadFailures ? 0 : 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
