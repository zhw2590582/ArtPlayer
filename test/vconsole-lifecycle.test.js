import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise scheduling ownership and cleanup failure semantics.
import test from 'node:test'
import { generateVconsole, hooks } from '../scripts/site-vendor/vconsole/build.ts'
import { enqueue, renderTab, unbind } from '../scripts/site-vendor/vconsole/lifecycle.ts'

function fixture() {
  const queued = new Map()
  const cancelled = []
  const flushed = []
  let sequence = 0
  let restored = 0
  const host = {
    ADDED_LOG_PLUGIN_ID: ['default'],
    logQueue: [],
    flushLogScheduled: false,
    _flushLogs() {
      flushed.push(this.logQueue)
      this.logQueue = []
    },
    unmockConsole() { restored++ },
  }
  const frames = {
    requestAnimationFrame(callback) {
      queued.set(++sequence, callback)
      return sequence
    },
    cancelAnimationFrame(id) { cancelled.push(id) },
  }
  return { host, frames, queued, cancelled, flushed, restored: () => restored }
}

test('vConsole batches in original order and releases the scheduling flag before flushing', () => {
  const { host, frames, queued, flushed } = fixture()
  enqueue(host, 'one', frames)
  enqueue(host, 'two', frames)
  assert.equal(queued.size, 1)
  queued.get(1)()
  assert.equal(host.flushLogScheduled, false)
  assert.deepEqual(flushed, [['one', 'two']])
  enqueue(host, 'three', frames)
  queued.get(2)()
  assert.deepEqual(flushed, [['one', 'two'], ['three']])
})

test('vConsole cancelled callbacks cannot flush or consume a new instance queue', () => {
  const { host, frames, queued, cancelled, flushed, restored } = fixture()
  enqueue(host, 'old', frames)
  host.ADDED_LOG_PLUGIN_ID = []
  unbind(host, frames)
  enqueue(host, 'captured old logger after destroy', frames)
  assert.deepEqual(host.logQueue, [])
  assert.deepEqual(cancelled, [1])
  assert.equal(restored(), 1)
  host.ADDED_LOG_PLUGIN_ID = ['default']
  enqueue(host, 'new', frames)
  queued.get(1)()
  assert.equal(host.flushLogScheduled, true)
  assert.deepEqual(host.logQueue, ['new'])
  queued.get(2)()
  assert.deepEqual(flushed, [['new']])
})

test('vConsole releases ownership and restores console even if native cancellation throws', () => {
  const { host, frames, queued, restored, flushed } = fixture()
  const failure = new Error('cancel failed')
  enqueue(host, 'old', frames)
  frames.cancelAnimationFrame = () => {
    throw failure
  }
  assert.throws(() => unbind(host, frames), error => error === failure)
  assert.equal(restored(), 1)
  assert.equal(host.flushLogScheduled, false)
  queued.get(1)()
  assert.deepEqual(flushed, [])
})

test('vConsole allows reentrant logging while a prior batch is being flushed', () => {
  const { host, frames, queued } = fixture()
  const batches = []
  host._flushLogs = () => {
    batches.push(host.logQueue)
    host.logQueue = []
    if (batches.length === 1)
      enqueue(host, 'reentrant', frames)
  }
  enqueue(host, 'initial', frames)
  queued.get(1)()
  queued.get(2)()
  assert.deepEqual(batches, [['initial'], ['reentrant']])
})

test('vConsole delayed panels retain their original instance and plugin ownership', async () => {
  const plugin = { id: 'custom' }
  const host = { isInited: true, pluginList: { custom: plugin } }
  const rendered = []
  renderTab(host, plugin, () => rendered.push('removed'))
  host.pluginList.custom = { id: 'custom' }
  renderTab(host, host.pluginList.custom, () => rendered.push('replacement'))
  const destroyed = { isInited: true, pluginList: { custom: plugin } }
  renderTab(destroyed, plugin, () => rendered.push('destroyed'))
  destroyed.isInited = false
  await new Promise(resolve => setTimeout(resolve, 10))
  assert.deepEqual(rendered, ['replacement'])
})

test('vConsole generation is deterministic and preserves all bytes outside pinned hooks', async () => {
  const root = path.resolve('.')
  const candidate = await generateVconsole(root)
  assert.equal(candidate, await generateVconsole(root))
  const upstream = fs.readFileSync('scripts/site-vendor/vconsole/upstream.js', 'utf8')
  const original = upstream.split(hooks.factory)
  assert.equal(original.length, 2)
  const suffix = original[1]
    .replace(hooks.signal, 'e._signalLog=function(t){__artplayerVConsoleLogLifecycle.enqueue(this,t,window)}')
    .replace(hooks.unbind, '0===this.ADDED_LOG_PLUGIN_ID.length&&__artplayerVConsoleLogLifecycle.unbind(this,window)')
    .replace(hooks.panel, 'o&&__artplayerVConsoleLogLifecycle.renderTab(e,t,(function(){var e=document.querySelector("#__vc_plug_"+t.id);n.HD(o)?e.innerHTML+=o:n.mf(o.appendTo)?o.appendTo(e):n.kK(o)&&e.insertAdjacentElement("beforeend",o)}))')
    .replace(hooks.resizeResume, 'case 9:if(!s)return n.abrupt("return");F(p),X(p,W.getPosition(),k),0!==k&&H(N&&L),K();')
    .replace(hooks.itemResume, 'case 12:if(!s)return o.abrupt("return");X(p,W.getPosition(),k),e(6,s.style.height=P+"px",s),K();')
  assert(candidate.startsWith(`${original[0]}(this||self,(function(){var __artplayerVConsoleLogLifecycle=`))
  assert(candidate.endsWith(`return function(){${suffix}`))
  assert.equal(candidate, fs.readFileSync('docs/assets/js/vconsole.min.js', 'utf8'))
})

test('vConsole generator rejects changed upstream input before producing a candidate', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'artplayer-vconsole-'))
  try {
    const directory = path.join(root, 'scripts/site-vendor/vconsole')
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(path.join(directory, 'upstream.js'), 'unexpected source')
    await assert.rejects(generateVconsole(root), /Frozen vConsole source changed/)
  }
  finally {
    assert.equal(path.dirname(root), path.resolve(os.tmpdir()))
    assert(path.basename(root).startsWith('artplayer-vconsole-'))
    fs.rmSync(root, { recursive: true, force: true })
  }
})
