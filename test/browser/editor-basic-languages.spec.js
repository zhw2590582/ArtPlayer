import fs from 'node:fs'
import { expect, test } from './fixtures.js'

const upstream = JSON.parse(fs.readFileSync(new URL('../../refactor/baselines/monaco-basic-fixtures.json', import.meta.url))).fixtures
// Upstream has no INI test, empty CSP/ECL suites, and SQL-targeted pgsql/redshift suites.
const supplemental = [
  { language: 'ini', samples: [['[player]', 'metatag.ini'], ['# comment', 'comment.ini'], ['42', 'number.ini']] },
  { language: 'csp', samples: [['default-src', 'string.quote.csp'], ['\'self\'', 'string.quote.csp']] },
  { language: 'ecl', samples: [['// comment', 'comment.ecl'], ['OUTPUT', 'keyword.function.ecl'], ['42', 'number.ecl']] },
  { language: 'pgsql', samples: [['-- comment', 'comment.sql'], ['SELECT', 'keyword.sql']] },
  { language: 'redshift', samples: [['-- comment', 'comment.sql'], ['SELECT', 'keyword.sql']] },
].map(({ language, samples }) => ({ source: 'ArtPlayer supplemental cases', language, languages: [language], cases: samples.map(([line, type]) => [{ line, tokens: [{ startIndex: 0, type }] }]) }))

test('docs Monaco preserves all upstream basic-language tokenization cases', async ({ page }, testInfo) => {
  const loaded = new Map()
  page.on('response', (response) => {
    const match = /\/basic-languages\/([^/]+)\/\1\.js$/.exec(response.url())
    if (match)
      loaded.set(match[1], response.status())
  })
  await page.goto('/test/player.html?core=candidate&chapter=published')
  await page.addScriptTag({ url: '/assets/js/vs/loader.js' })
  const result = await page.evaluate(async (fixtures) => {
    window.require.config({ paths: { vs: '/assets/js/vs' } })
    const load = ids => new Promise((resolve, reject) => window.require(ids, (...modules) => resolve(modules), reject))
    await load(['vs/editor/editor.main'])
    const [helper] = await load(['vs/basic-languages/_.contribution'])
    const languages = [...new Set(fixtures.flatMap(fixture => fixture.languages))]
    await Promise.all(languages.map(language => helper.loadLanguage(language)))
    // Match the upstream runner's turn for asynchronous token-provider registration.
    await new Promise(resolve => setTimeout(resolve, 0))
    const failures = []
    let cases = 0
    for (const fixture of fixtures) {
      for (const [index, expected] of fixture.cases.entries()) {
        const text = expected.map(line => line.line).join('\n')
        const actual = window.monaco.editor.tokenize(text, fixture.languages[0]).map((tokens, line) => ({
          line: expected[line].line,
          tokens: tokens.map(token => ({ startIndex: token.offset, type: token.type })),
        }))
        cases++
        if (JSON.stringify(actual) !== JSON.stringify(expected))
          failures.push({ source: fixture.source, index, expected, actual })
      }
    }
    return { cases, suites: fixtures.length, languages, failures }
  }, [...upstream, ...supplemental])
  await testInfo.attach('monaco-basic-results', { contentType: 'application/json', body: JSON.stringify(result, null, 2) })
  expect(result.cases).toBe(2523)
  expect(result.failures).toEqual([])
  expect([...loaded.keys()].sort()).toEqual(fs.readdirSync(new URL('../../docs/assets/js/vs/basic-languages', import.meta.url)).sort())
  expect([...loaded.values()].every(status => status === 200)).toBe(true)
})
