import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
// eslint-disable-next-line test/no-import-node-test -- Pure ASR audio modules use the repository runner.
import test from 'node:test'
import { asrAudioEnvironment, runAsrWorklet } from './helpers/asr-audio.js'
import { asrHistorical } from './helpers/asr.js'
import { loadModules } from './helpers/load.js'

const root = 'packages/artplayer-plugin-asr/src'
const { encodeAudio, SampleQueue, recorderProcessorCode } = await loadModules({
  encodeAudio: { file: `${root}/encoding`, name: 'encodeAudio' },
  SampleQueue: { file: `${root}/sample-queue`, name: 'SampleQueue' },
  recorderProcessorCode: { file: `${root}/worklet`, name: 'recorderProcessorCode' },
})

test('ASR encoder preserves signed PCM16 clamping, truncation, NaN and little endian bytes', () => {
  const input = Float32Array.of(-Infinity, -2, -1, -0.5, -0, 0, 0.5, 1, 2, Infinity, Number.NaN)
  const encoded = encodeAudio(input, 16000)
  assert.deepEqual(Object.keys(encoded), ['pcm', 'wav'])
  const expected = [0, 128, 0, 128, 0, 128, 0, 192, 0, 0, 0, 0, 255, 63, 255, 127, 255, 127, 255, 127, 0, 0]
  assert.deepEqual([...new Uint8Array(encoded.pcm)], expected)
  assert.equal(input[0], -Infinity)
  assert.equal(Number.isNaN(input.at(-1)), true)
})

for (const sampleRate of [8000, 16000, 44100, 48000]) {
  test(`ASR encoder writes exact mono WAV metadata at ${sampleRate} Hz`, () => {
    const { pcm, wav } = encodeAudio(Float32Array.of(-1, 0, 1), sampleRate)
    const data = Buffer.from(wav)
    assert.equal(pcm.byteLength, 6)
    assert.equal(data.length, 50)
    assert.equal(data.toString('ascii', 0, 4), 'RIFF')
    assert.equal(data.readUInt32LE(4), 42)
    assert.equal(data.toString('ascii', 8, 16), 'WAVEfmt ')
    assert.equal(data.readUInt32LE(16), 16)
    assert.equal(data.readUInt16LE(20), 1)
    assert.equal(data.readUInt16LE(22), 1)
    assert.equal(data.readUInt32LE(24), sampleRate)
    assert.equal(data.readUInt32LE(28), sampleRate * 2)
    assert.equal(data.readUInt16LE(32), 2)
    assert.equal(data.readUInt16LE(34), 16)
    assert.equal(data.toString('ascii', 36, 40), 'data')
    assert.equal(data.readUInt32LE(40), 6)
    assert.deepEqual([...data.subarray(44)], [0, 128, 0, 0, 255, 127])
    new Uint8Array(pcm).fill(0)
    assert.deepEqual([...data.subarray(44)], [0, 128, 0, 0, 255, 127], 'The WAV payload owns its bytes')
  })
}

test('ASR encoder empty and offset views retain exact payload boundaries', () => {
  const empty = encodeAudio(new Float32Array(0), 16000)
  assert.equal(empty.pcm.byteLength, 0)
  assert.equal(empty.wav.byteLength, 44)
  assert.equal(new DataView(empty.wav).getUint32(4, true), 36)
  assert.equal(new DataView(empty.wav).getUint32(40, true), 0)
  const backing = Float32Array.of(1, -1, 0.5, 1)
  const { pcm } = encodeAudio(backing.subarray(1, 3), 16000)
  assert.deepEqual([...new Uint8Array(pcm)], [0, 128, 255, 63])
})

for (const implementation of await asrHistorical()) {
  test(`ASR encoder byte parity with ${implementation.name}`, async () => {
    const chunks = []
    const environment = asrAudioEnvironment(implementation, { sampleRate: 8000, interval: 1, onAudioChunk: chunk => chunks.push(chunk) })
    await environment.emit('play')
    const input = Float32Array.of(-Infinity, -1, -0.5, Number.NaN, 0, 0.5, 1, Infinity)
    environment.send(input)
    await environment.tick()
    assert.equal(chunks.length, 1)
    const candidate = encodeAudio(input, 8000)
    assert.deepEqual(Buffer.from(candidate.pcm), Buffer.from(chunks[0].pcm))
    assert.deepEqual(Buffer.from(candidate.wav), Buffer.from(chunks[0].wav))
    await environment.plugin.stop()
  })
}

test('ASR sample queue retains insufficient chunks and excess tails', () => {
  const queue = new SampleQueue()
  assert.equal(queue.take(8), null)
  queue.push(Float32Array.of(1, 2, 3, 4))
  assert.equal(queue.take(8), null)
  assert.equal(queue.length, 4)
  queue.push(Float32Array.of(5, 6, 7, 8, 9, 10))
  assert.deepEqual([...queue.take(8)], [1, 2, 3, 4, 5, 6, 7, 8])
  assert.equal(queue.length, 2)
  assert.equal(queue.take(3), null)
  queue.push(Float32Array.of(11))
  assert.deepEqual([...queue.take(3)], [9, 10, 11])
  assert.equal(queue.length, 0)
  assert.equal(queue.take(1), null)
})

test('ASR sample queue copies input views and returns independently owned output', () => {
  const queue = new SampleQueue()
  const input = Float32Array.of(0, 1, 2, 3)
  queue.push(input.subarray(1, 3))
  input.fill(9)
  const first = queue.take(1)
  assert.deepEqual([...first], [1])
  first[0] = 8
  assert.deepEqual([...queue.take(1)], [2])
})

test('ASR sample queue clears partial blocks and can be reused after draining', () => {
  const queue = new SampleQueue()
  queue.push(Float32Array.of(1, 2, 3))
  assert.deepEqual([...queue.take(1)], [1])
  queue.clear()
  queue.clear()
  queue.push(new Float32Array(0))
  assert.equal(queue.length, 0)
  assert.equal(queue.take(1), null)
  queue.push(Float32Array.of(4, 5))
  assert.deepEqual([...queue.take(2)], [4, 5])
  queue.push(Float32Array.of(6))
  assert.deepEqual([...queue.take(1)], [6])
})

test('ASR sample queue rejects invalid count without losing buffered audio', () => {
  const queue = new SampleQueue()
  queue.push(Float32Array.of(1, 2))
  for (const count of [0, -1, 0.5, Number.NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => queue.take(count), { name: 'RangeError', message: 'Sample count must be a positive safe integer' })
    assert.equal(queue.length, 2)
  }
  assert.equal(queue.take(Number.MAX_SAFE_INTEGER), null)
  assert.deepEqual([...queue.take(2)], [1, 2])
})

test('ASR sample queue handles many worklet blocks without dropping boundary samples', () => {
  const queue = new SampleQueue()
  for (let index = 0; index < 4096; index++)
    queue.push(Float32Array.of(index, -index))
  assert.equal(queue.length, 8192)
  const first = queue.take(4097)
  const second = queue.take(4095)
  assert.equal(queue.length, 0)
  const output = [...first, ...second]
  for (let index = 0; index < 4096; index++) {
    assert.equal(output[index * 2], index)
    assert.equal(output[index * 2 + 1], -index)
  }
})

test('ASR sample queue preserves FIFO through deterministic mixed push, take and clear operations', () => {
  const queue = new SampleQueue()
  let expected = []
  let serial = 0
  for (let index = 1; index <= 1000; index++) {
    if (index % 113 === 0) {
      queue.clear()
      expected = []
    }
    else if (index % 3 !== 0) {
      const chunk = Float32Array.from({ length: index % 17 }, () => ++serial)
      queue.push(chunk)
      expected.push(...chunk)
    }
    else {
      const count = index % 23 + 1
      const actual = queue.take(count)
      if (expected.length < count)
        assert.equal(actual, null)
      else
        assert.deepEqual([...actual], expected.splice(0, count))
    }
    assert.equal(queue.length, expected.length)
  }
  if (expected.length)
    assert.deepEqual([...queue.take(expected.length)], expected)
})

test('ASR candidate Worklet keeps registration, first-channel identity and empty-input behavior', async () => {
  const { processor, messages } = await runAsrWorklet(new Blob([recorderProcessorCode]))
  const first = Float32Array.of(-0.5, 0.5)
  const second = Float32Array.of(1, 1)
  assert.equal(processor.process([]), true)
  assert.equal(processor.process([[]]), true)
  assert.equal(messages.length, 0)
  assert.equal(processor.process([[first, second]]), true)
  assert.equal(messages.length, 1)
  assert.equal(messages[0], first)
})
