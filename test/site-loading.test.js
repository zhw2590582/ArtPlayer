import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
// eslint-disable-next-line test/no-import-node-test -- Use the repository Node regression runner.
import test from 'node:test'
import vm from 'node:vm'
import {
  createLibraryLoader,
  exampleSource,
  parameters,
} from '../packages/artplayer-vitepress/browser/loader.ts'
import {
  languageDestination,
  runCodeUrl,
} from '../packages/artplayer-vitepress/browser/navigation.ts'

const turn = () => new Promise(resolve => setImmediate(resolve))
function fixture() {
  class Element extends EventTarget {
    removed = false
    remove() {
      this.removed = true
    }

    succeed() {
      this.onload?.()
      this.dispatchEvent(new Event('load'))
    }

    fail() {
      this.onerror?.()
      this.dispatchEvent(new Event('error'))
    }
  }
  const nodes = []
  const head = {
    appendChild(element) {
      nodes.push(element)
    },
  }
  const host = {
    location: { href: 'http://localhost:8082/mobile.html' },
    define: Object.assign(() => {}, { amd: {} }),
    document: {
      head,
      createElement: () => new Element(),
      querySelector: () => head,
    },
  }
  return { host, nodes, head }
}

test('fixed old mobile loader reproduces failure and overlapping AMD restoration defects', async () => {
  const source = execFileSync(
    'git',
    [
      'show',
      '76499e7a3e033c8350ff495ba8bfff4ca5c08d25:docs/assets/js/mobile.js',
    ],
    { encoding: 'utf8' },
  )
  const end = source.indexOf('    var _getURLParameters')
  assert(end > 0)
  const old = `${source.slice(0, end)} window.legacy = {loadScript, loadLib}; })();`
  const failed = fixture()
  vm.runInNewContext(old, {
    window: failed.host,
    document: failed.host.document,
    Artplayer: {},
  })
  const failure = failed.host.legacy.loadScript('missing.js')
  failed.nodes[0].fail()
  await assert.rejects(failure, /Loading script failed/)
  assert.equal(failed.host.define, undefined)
  const parallel = fixture()
  vm.runInNewContext(old, {
    window: parallel.host,
    document: parallel.host.document,
    Artplayer: {},
  })
  const loaded = parallel.host.legacy.loadLib('first.js%0Asecond.js')
  assert.equal(
    parallel.nodes.length,
    2,
    'Old code starts both scripts before dependencies resolve',
  )
  parallel.nodes[0].succeed()
  parallel.nodes[1].succeed()
  await loaded
  assert.equal(
    parallel.host.define,
    undefined,
    'Second request saved the temporarily cleared define',
  )
})

test('shared loader serializes batches, caches successes, retries failures and restores exact AMD descriptor', async () => {
  const { host, nodes } = fixture()
  const original = Object.getOwnPropertyDescriptor(host, 'define')
  const loader = createLibraryLoader(host)
  const first = loader.loadLibraries(
    encodeURIComponent(' ./first.js \n./second.js'),
  )
  const second = loader.loadLibraries(
    encodeURIComponent('./first.js\n./third.css'),
  )
  await turn()
  assert.equal(nodes.length, 1)
  assert.equal(host.define, undefined)
  nodes[0].succeed()
  await turn()
  assert.equal(nodes.length, 2)
  const rejected = assert.rejects(first, /Loading script failed/)
  nodes[1].fail()
  await rejected
  await turn()
  assert.equal(nodes.length, 3)
  assert(nodes[1].removed)
  assert.deepEqual(Object.getOwnPropertyDescriptor(host, 'define'), original)
  nodes[2].succeed()
  assert.deepEqual(await second, ['./first.js', './third.css'])
  const retry = loader.loadLibraries('./second.js')
  await turn()
  assert.equal(nodes.length, 4)
  nodes[3].succeed()
  await retry
  assert.deepEqual(Object.getOwnPropertyDescriptor(host, 'define'), original)
  await assert.rejects(loader.loadLibraries('%bad-encoding'), URIError)
  assert.equal(nodes.length, 4)
})

test('loader restores absence/accessors and synchronous failure, cancels pending work and rejects immutable AMD state', async () => {
  for (const mode of [
    'absent',
    'accessor',
    'append-failure',
    'dispose',
    'immutable',
  ]) {
    const { host, nodes, head } = fixture()
    if (mode === 'absent')
      Reflect.deleteProperty(host, 'define')
    if (mode === 'accessor') {
      Object.defineProperty(host, 'define', {
        get: () => 42,
        configurable: true,
      })
    }
    if (mode === 'immutable') {
      Object.defineProperty(host, 'define', {
        value: 42,
        configurable: false,
        writable: false,
      })
    }
    if (mode === 'append-failure') {
      head.appendChild = () => {
        throw new Error('append failed')
      }
    }
    const before = Object.getOwnPropertyDescriptor(host, 'define')
    const loader = createLibraryLoader(host)
    const pending = loader.loadLibraries('test.js')
    const fails = ['append-failure', 'dispose', 'immutable'].includes(mode)
    const rejection = fails ? assert.rejects(pending) : null
    await turn()
    if (mode === 'dispose')
      loader.dispose()
    else if (!fails)
      nodes[0].succeed()
    if (rejection)
      await rejection
    else await pending
    assert.deepEqual(
      Object.getOwnPropertyDescriptor(host, 'define'),
      before,
      mode,
    )
    if (mode === 'dispose') {
      assert(nodes[0].removed)
      await assert.rejects(loader.loadLibraries('later.js'), /disposed/)
    }
  }
})

test('URL and example contracts preserve literal plus, last duplicate and explicit example priority inputs', async () => {
  assert.deepEqual(
    parameters(
      'http://localhost/?code=a+b%2Bc&libs=first&libs=second&example=mobile#ignored',
    ),
    { code: 'a+b%2Bc', libs: 'second', example: 'mobile' },
  )
  assert.equal(
    await exampleSource('mobile', async (url) => {
      assert.equal(url, './assets/example/mobile.js')
      return new Response('var art = 1')
    }),
    'var art = 1',
  )
  await assert.rejects(
    exampleSource(
      'missing',
      async () => new Response('404 HTML', { status: 404 }),
    ),
    /404/,
  )
  const libs = 'https://cdn.example/lib.js?a=1&b=two\n./theme.css'
  const code = 'var x = "a+b&你好";'
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    const url = new URL(runCodeUrl({ hostname: host }, libs, code))
    assert.equal(url.host, `${host}:8082`)
    assert.equal(url.searchParams.get('libs'), libs)
    assert.equal(url.searchParams.get('code'), code)
  }
  assert.equal(
    new URL(runCodeUrl({ hostname: 'artplayer.org' }, '', code)).origin,
    'https://artplayer.org',
  )
})

test('language routing preserves translated deep links and explicit choices without redirecting local previews', () => {
  const paths = ['', 'index.html', 'start/option.html']
  const choose = (url, lang = 'en-US', initialized = false) =>
    languageDestination(url, lang, initialized, paths)
  assert.deepEqual(
    choose('https://artplayer.org/document/start/option.html?x=1#url'),
    {
      remember: true,
      target: 'https://artplayer.org/document/en/start/option.html?x=1#url',
    },
  )
  assert.deepEqual(
    choose('https://artplayer.org/document/plugin/danmuku.html#x'),
    { remember: true, target: 'https://artplayer.org/document/en/' },
  )
  assert.deepEqual(
    choose('https://artplayer.org/document/en/start/option.html'),
    { remember: true, target: null },
  )
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    assert.deepEqual(choose(`http://${host}:5173/document/`), {
      remember: false,
      target: null,
    })
  }
  for (const [language, initialized] of [
    ['zh-CN', false],
    ['ZH-tw', false],
    ['en', true],
    ['', false],
  ]) {
    assert.deepEqual(
      choose('https://artplayer.org/document/', language, initialized),
      { remember: false, target: null },
    )
  }
})
