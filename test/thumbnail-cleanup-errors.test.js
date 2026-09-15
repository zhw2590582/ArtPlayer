import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Compare cleanup exception identity with frozen releases.
import test from 'node:test'
import { thumbnailCandidate, thumbnailEnvironment, thumbnailHistorical } from './helpers/thumbnail.js'

const candidate = await thumbnailCandidate()
const failures = [undefined, null, false, 0, -0, '', Number.NaN]
function attempt(callback) {
  try {
    callback()
    return { threw: false }
  }
  catch (error) {
    return { threw: true, error }
  }
}
function create(implementation) {
  const env = thumbnailEnvironment(implementation)
  const input = new env.Element('input')
  const tool = new env.Factory({ fileInput: input })
  return { ...env, input, tool }
}

test('Thumbnail historical destroy listeners synchronously propagate falsy thrown values', () => {
  for (const implementation of thumbnailHistorical()) {
    for (const failure of failures) {
      const { tool } = create(implementation)
      tool.on('destroy', () => {
        throw failure
      })
      const result = attempt(() => tool.destroy())
      assert.equal(result.threw, true, implementation.name)
      assert(Object.is(result.error, failure), implementation.name)
    }
  }
})

test('Thumbnail destroy preserves falsy listener exceptions after releasing native resources', () => {
  for (const failure of failures) {
    const { tool, input } = create(candidate)
    let first = 0
    let second = 0
    tool.on('destroy', () => {
      first++
      throw failure
    }).on('destroy', () => second++)
    const result = attempt(() => tool.destroy())
    assert.equal(result.threw, true)
    assert(Object.is(result.error, failure))
    assert.equal(tool.video.parentNode, null)
    assert.equal(input.handlers.get('change')?.size || 0, 0)
    assert.equal(first, 1)
    assert.equal(second, 0, 'Normal emitter exception propagation still stops this dispatch')
    assert.doesNotThrow(() => tool.destroy())
    assert.equal(first, 1, 'Failed destroy is still terminal')
  }
})

test('Thumbnail cleanup retains the first falsy failure and still attempts later cleanup and destroy notification', () => {
  for (const failure of failures) {
    const { tool, input, operations } = create(candidate)
    tool.loadVideo({ name: 'first.mp4', type: 'video/mp4' })
    const calls = []
    tool.video.pause = () => {
      calls.push('pause')
      throw failure
    }
    tool.video.removeAttribute = name => calls.push(`remove:${name}`)
    tool.video.load = () => {
      calls.push('load')
      throw new Error('later decoder reset error')
    }
    tool.on('destroy', () => {
      calls.push('destroy')
      throw new Error('later listener error')
    })
    const result = attempt(() => tool.destroy())
    assert.equal(result.threw, true)
    assert(Object.is(result.error, failure), 'Later errors cannot replace the first thrown value')
    assert.deepEqual(calls, ['pause', 'remove:src', 'load', 'destroy'])
    assert.equal(tool.video.parentNode, null)
    assert.equal(input.handlers.get('change')?.size || 0, 0)
    assert.deepEqual(operations.filter(item => item.name === 'revokeURL').map(item => item.url), [tool.videoUrl])
  }
})
