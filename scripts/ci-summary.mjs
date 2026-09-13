import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { ciContext } from './ci-context.mjs'

export const requiredJobs = ['checks', 'coverage', 'browser-smoke']

export function evaluateJobs(needs) {
  const object = needs !== null && typeof needs === 'object' && !Array.isArray(needs)
  const errors = []
  if (!object)
    errors.push('Job results must be an object')
  else if (Object.keys(needs).some(name => !requiredJobs.includes(name)))
    errors.push('Unexpected job entries; update the explicit required-job policy')
  const rows = requiredJobs.map((job) => {
    const value = object && Object.hasOwn(needs, job) ? needs[job]?.result : undefined
    const result = ['success', 'failure', 'cancelled', 'skipped'].includes(value) ? value : 'missing-or-invalid'
    return { job, result, passed: result === 'success' }
  })
  return { passed: errors.length === 0 && rows.every(row => row.passed), rows, errors }
}

export function renderSummary(report) {
  return [
    '## ArtPlayer CI',
    '',
    `Result: **${report.passed ? 'passed' : 'failed'}**`,
    '',
    '| Required job | Result |',
    '| --- | --- |',
    ...report.rows.map(row => `| ${row.job} | ${row.result} |`),
    '',
    'Success requires every configured matrix job to succeed. Skipped, cancelled and missing results do not pass.',
    '',
  ].join('\n')
}

export function summarize(root, env = process.env) {
  let needs
  let invalidJSON = false
  try {
    needs = JSON.parse(env.ARTPLAYER_CI_NEEDS || '')
  }
  catch {
    invalidJSON = true
  }
  const report = { schemaVersion: 1, context: ciContext(root, env), ...evaluateJobs(needs) }
  if (invalidJSON)
    report.errors.push('Job results were not valid JSON')
  const directory = path.join(root, 'refactor/.cache/ci')
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'summary.json'), `${JSON.stringify(report, null, 2)}\n`)
  const markdown = renderSummary(report)
  fs.writeFileSync(path.join(directory, 'summary.md'), markdown)
  if (env.GITHUB_STEP_SUMMARY)
    fs.appendFileSync(env.GITHUB_STEP_SUMMARY, markdown)
  return report
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = summarize(process.cwd())
  console.log(renderSummary(report))
  process.exitCode = report.passed ? 0 : 1
}
