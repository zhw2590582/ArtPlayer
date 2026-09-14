import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Text entity regressions use real built plugin serialization.
import test from 'node:test'
import { parseHTML } from 'linkedom'
import { multipleSubtitlesCandidate, multipleSubtitlesEnvironment, multipleSubtitlesHistorical, subtitleVtt } from './helpers/multiple-subtitles.js'

const implementation = await multipleSubtitlesCandidate()
for (const [input, expected] of [
  ['&amp; &lt; &gt; &lrm; &rlm; &nbsp;', '& < > \u200E \u200F \u00A0'],
  ['Literal &lt;00:02.000&gt; and &lt;b&gt;text&lt;/b&gt;', 'Literal <00:02.000> and <b>text</b>'],
  ['&amp;lt; &amp;amp; &amp;gt;', '&lt; &amp; &gt;'],
  ['One &amp;; two &lt;;', 'One &; two <;'],
  ['<b>bold &amp; safe</b> tail &lt;i&gt;', 'bold & safe tail <i>'],
  ['<c.red>color</c> <i>italic</i>', 'color italic'],
  ['<v Speaker>voice</v>', 'voice'],
  ['<ruby>text<rt>note</rt></ruby>', 'textnote'],
  ['&unknown; &amplitude; &amp', '&unknown; &litude; &'],
  ['&#65; &#x41;', 'A A'],
]) {
  test(`Multiple subtitles entity text remains literal after selection/reset: ${input}`, async () => {
    const env = multipleSubtitlesEnvironment(implementation, { responses: { 'a.vtt': subtitleVtt(input), 'b.vtt': subtitleVtt('Other') } })
    const result = await env.factory({ subtitles: [{ name: 'a', url: 'a.vtt' }, { name: 'b', url: 'b.vtt' }] })(env.art)
    for (const names of [['a'], ['b', 'a'], ['a', 'a']]) {
      result.tracks(names)
      const vtt = env.utils.unescape(await env.latestText())
      const text = vtt.split(/\n\d[^\n]*-->[^\n]*\n/).slice(1).join('')
      const { document } = parseHTML(`<html><body>${text}</body></html>`)
      assert.equal(document.body.textContent.trim(), names.map(name => name === 'a' ? expected : 'Other').join('\n\n').trim())
      if (input.includes('&lt;i&gt;'))
        assert.equal(document.querySelectorAll('i').length, 0)
      if (input.startsWith('<b>'))
        assert.equal(document.querySelector('b').textContent, 'bold & safe')
    }
    result.reset()
    assert((env.utils.unescape(await env.latestText())).includes('Other'))
    env.emit('destroy')
  })
}

test('Multiple subtitles raw ampersand and malformed angle text retain historical visible output', async () => {
  const historical = (await multipleSubtitlesHistorical()).find(item => item.name === 'published-1.2.0-main')
  const output = []
  for (const code of [historical, implementation]) {
    const env = multipleSubtitlesEnvironment(code, { responses: { 'a.vtt': subtitleVtt('A & B < C > D') } })
    await env.factory({ subtitles: [{ name: 'a', url: 'a.vtt' }] })(env.art)
    const { document } = parseHTML(`<html><body>${env.utils.unescape(await env.latestText())}</body></html>`)
    output.push(document.body.textContent)
    env.emit('destroy')
  }
  assert.equal(output[1], output[0])
})
