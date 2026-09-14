import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Caption adapters use the repository Node runner.
import test from 'node:test'
import { parseHTML } from 'linkedom'
import { multipleSubtitlesCandidate, multipleSubtitlesEnvironment } from './helpers/multiple-subtitles.js'

const candidate = await multipleSubtitlesCandidate()

function host({ modern = false } = {}) {
  const env = multipleSubtitlesEnvironment(candidate)
  const { document } = parseHTML('<html><body><div id="subtitle"></div></body></html>')
  const target = document.getElementById('subtitle')
  let active = []
  env.art.template = { $subtitle: target }
  Object.defineProperty(env.art.subtitle, 'activeCue', {
    get() { throw new Error('Capability checks must not read a cue') },
  })
  Object.defineProperty(env.art.subtitle, 'textTrack', { get: () => ({ activeCues: active }) })
  if (modern)
    Object.defineProperty(env.art.subtitle, 'activeCues', { get() { throw new Error('Modern rendering belongs to the core') } })
  env.art.subtitle.update = () => {
    target.innerHTML = active[0]?.text || ''
    if (active.length)
      env.emit('subtitleUpdate', active[0].text)
  }
  return {
    ...env,
    target,
    setActive(cues) { active = cues },
  }
}

test('Multiple subtitles legacy caption view preserves cue order, event payload and original update', async () => {
  const env = host()
  const update = env.art.subtitle.update
  const payloads = []
  const views = []
  env.art.on('subtitleUpdate', (value) => {
    payloads.push(value)
    views.push(['before', env.target.textContent])
  })
  await env.factory({ subtitles: [] })(env.art)
  env.art.on('subtitleUpdate', () => views.push(['after', env.target.textContent]))
  const cues = Object.freeze([
    Object.freeze({ text: '<div class="a"><b>A &amp; safe</b></div>', startTime: 1, endTime: 3 }),
    Object.freeze({ text: '<div class="b">B</div>', startTime: 2, endTime: 4 }),
    Object.freeze({ text: '<div class="c">C</div>', startTime: 2.25, endTime: 2.75 }),
  ])
  env.setActive(cues)
  for (let index = 0; index < 3; index++) {
    update()
    assert.equal(env.target.textContent, 'A & safeBC')
    assert.deepEqual(Array.from(env.target.children, node => node.className), ['a', 'b', 'c'])
  }
  assert.equal(env.art.subtitle.update, update)
  assert.deepEqual(payloads, [cues[0].text, cues[0].text, cues[0].text])
  assert.deepEqual(views, Array.from({ length: 3 }, () => [['before', 'A & safe'], ['after', 'A & safeBC']]).flat())
  assert.equal(env.listeners.get('subtitleAfterUpdate'), undefined)
  env.setActive([cues[1]])
  update()
  assert.equal(env.target.innerHTML, cues[1].text)
  env.setActive([])
  update()
  assert.equal(env.target.innerHTML, '')
  assert.equal(payloads.length, 4)
  env.emit('destroy')
})

test('Multiple subtitles legacy view respects later escape changes and blank CRLF lines', async () => {
  const env = host()
  await env.factory({ subtitles: [] })(env.art)
  env.art.option.subtitle.escape = true
  env.setActive([{ text: '<b>A & B</b>\r\n\r\nTail' }, { text: '<img src="bad" onerror="bad()">' }])
  env.art.subtitle.update()
  assert.equal(env.target.querySelectorAll('b, img').length, 0)
  assert.deepEqual(Array.from(env.target.children, node => node.textContent), ['<b>A & B</b>', '', 'Tail', '<img src="bad" onerror="bad()">'])
  assert(Array.from(env.target.children).every(node => node.className === 'art-subtitle-line'))
  env.emit('destroy')
})

test('Multiple subtitles legacy view cleans timestamp markers for both single and overlapping cues', async () => {
  const env = host()
  await env.factory({ subtitles: [] })(env.art)
  const cue = { text: '<div class="a">A<c.artplayer-multiple-subtitles-timestamp><00:02.000></c><b>B</b></div>' }
  for (const cues of [[cue], [cue, { text: '<div>C</div>' }]]) {
    env.setActive(cues)
    env.art.subtitle.update()
    assert.equal(env.target.querySelector('b').textContent, 'B')
    assert.equal(env.target.textContent, cues.length === 1 ? 'AB' : 'ABC')
    assert.equal(env.target.getElementsByTagName('c.artplayer-multiple-subtitles-timestamp').length, 0)
  }
  env.emit('destroy')
})

test('Multiple subtitles modern hosts retain their own view and never install the legacy listener', async () => {
  const env = host({ modern: true })
  await env.factory({ subtitles: [] })(env.art)
  env.target.innerHTML = '<span>Core view</span>'
  env.setActive([{ text: 'A' }, { text: 'B' }])
  env.emit('subtitleUpdate', 'A')
  env.emit('subtitleAfterUpdate', ['A', 'B'])
  assert.equal(env.target.innerHTML, '<span>Core view</span>')
  assert.equal(env.listeners.get('subtitleUpdate'), undefined)
  assert.equal(env.listeners.get('subtitleAfterUpdate').size, 1)
  env.emit('destroy')
  assert.equal(env.listeners.get('subtitleAfterUpdate').size, 0)
})

test('Multiple subtitles legacy listener is removed on destroy and captured late callbacks are inert', async () => {
  const env = host()
  await env.factory({ subtitles: [] })(env.art)
  const callback = [...env.listeners.get('subtitleUpdate')][0]
  env.setActive([{ text: 'A' }, { text: 'B' }])
  env.emit('destroy')
  env.target.innerHTML = '<span>After destroy</span>'
  callback('A')
  assert.equal(env.target.textContent, 'After destroy')
  assert.equal(env.listeners.get('subtitleUpdate').size, 0)
  assert.equal(env.listeners.get('destroy').size, 0)
})

test('Multiple subtitles legacy listener registration failure unwinds both listeners', async () => {
  const env = host()
  const on = env.art.on
  const error = new Error('Listener registration failed')
  env.art.on = (name, callback) => {
    on(name, callback)
    if (name === 'subtitleUpdate')
      throw error
    return env.art
  }
  await assert.rejects(env.factory({ subtitles: [] })(env.art), value => value === error)
  assert.equal(env.listeners.get('subtitleUpdate').size, 0)
  assert.equal(env.listeners.get('destroy').size, 0)
  assert.equal(env.liveBlobs.size, 0)
})
