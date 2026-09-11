import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { compareArtifactSizes, verifyPerformanceArtifacts } from '../../scripts/performance-artifacts.mjs'
import { validatePairedPerformance } from '../../scripts/performance-report.mjs'
import { performanceSummary } from '../../scripts/performance-summary.mjs'
import { expect, test } from '../browser/fixtures.js'

const root = fileURLToPath(new URL('../../', import.meta.url))

test('installed core and chapter: three paired timing groups with strict candidate cleanup', async ({ page, browser, browserName, request, diagnostics }, testInfo) => {
  const artifacts = verifyPerformanceArtifacts(root, process.env.ARTPLAYER_BROWSER_ARTIFACTS)
  const manifest = await (await request.get('/test/manifest.json')).json()
  for (const input of artifacts.inputs) {
    const resource = manifest.resources[`/candidate/${input.name}.js`]
    expect(resource.source.kind).toBe('artifact')
    expect(resource.sha256).toBe(input.sha256)
  }
  const output = path.join(root, 'refactor/.cache/performance')
  fs.mkdirSync(output, { recursive: true })
  const directory = fs.mkdtempSync(path.join(output, `run-${browserName}-`))
  const report = {
    schemaVersion: 1,
    task: 'ENG-08',
    capturedAt: new Date().toISOString(),
    environment: { browser: browserName, version: browser.version(), platform: process.platform, node: process.version },
    inputs: artifacts.inputs,
    toolchain: artifacts.toolchain,
    manifest,
    sizes: await compareArtifactSizes(root, artifacts),
    runs: [],
    status: 'incomplete',
  }
  const file = path.join(directory, 'report.json')
  const save = () => fs.writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`)
  save()
  try {
    for (let group = 0; group < 3; group++) {
      for (const variant of group % 2 ? ['candidate', 'published'] : ['published', 'candidate']) {
        await page.goto(`/test/performance.html?variant=${variant}`)
        await page.bringToFront()
        await page.locator('#run').click()
        await page.waitForFunction(() => window.artplayerPerformanceReport, null, { timeout: 25000 })
        const measurements = await page.evaluate(() => window.artplayerPerformanceReport)
        report.runs.push({ group, variant, measurements })
        save()
      }
    }
    Object.assign(report, validatePairedPerformance(report))
    report.reviewRequired ||= report.sizes.some(item => item.reviewSignals.length > 0)
    expect(diagnostics.errors).toEqual([])
    expect(diagnostics.consoleErrors).toEqual([])
    report.status = report.reviewRequired ? 'review-required' : 'passed'
    save()
    const summary = performanceSummary(report)
    fs.writeFileSync(path.join(directory, 'summary.md'), summary)
    await testInfo.attach('performance-summary', { body: summary, contentType: 'text/markdown' })
    if (process.env.GITHUB_STEP_SUMMARY)
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
  }
  catch (error) {
    report.status = 'failed'
    report.failure = error.message
    save()
    throw error
  }
  finally {
    await testInfo.attach('paired-performance', { path: file, contentType: 'application/json' })
    process.stdout.write(`Paired performance (${browserName}): ${path.relative(root, file)}; ${report.status}\n`)
  }
})
