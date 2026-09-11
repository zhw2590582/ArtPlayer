import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

// Reuse the frozen BASE-06 measurement body; only adapt transport and bundle URLs.
const directory = fileURLToPath(new URL('../refactor/fixtures/', import.meta.url))
function replaceOnce(source, before, after) {
  assert.equal(source.split(before).length, 2, `Performance fixture adapter drift: ${before}`)
  return source.replace(before, after)
}

export function performanceScript() {
  const source = fs.readFileSync(`${directory}/performance.js`, 'utf8')
  return replaceOnce(source, 'const response = await fetch(\'/reports/performance\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify(report) })', 'window.artplayerPerformanceReport = report; const response = { ok: true }')
}

export function performanceHtml(variant) {
  assert(['published', 'candidate'].includes(variant), 'Invalid performance variant')
  let source = fs.readFileSync(`${directory}/performance.html`, 'utf8')
  source = replaceOnce(source, '/releases/artplayer/dist/artplayer.js', `/${variant}/artplayer.js`)
  source = replaceOnce(source, '/releases/artplayer-plugin-chapter/dist/artplayer-plugin-chapter.js', `/${variant}/artplayer-plugin-chapter.js`)
  source = replaceOnce(source, '/fixtures/performance.js', '/test/performance.js')
  return source.replaceAll('published performance baseline', `${variant} performance comparison`).replaceAll('Published performance and resource baseline', `${variant}: performance and resource comparison`)
}
