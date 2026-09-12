import assert from 'node:assert/strict'
// eslint-disable-next-line test/no-import-node-test -- Candidate fixes also run against the frozen baseline.
import test from 'node:test'
import { thumbnailCandidate, thumbnailEnvironment } from './helpers/thumbnail.js'

const implementation = await thumbnailCandidate()
function setup(wrapper = false) {
  const env = thumbnailEnvironment(implementation)
  const target = new env.Element(wrapper ? 'div' : 'input')
  const instance = new env.Factory({ fileInput: target, number: 10, width: 20, height: 30, column: 3 })
  return { ...env, target, instance }
}

test('Thumbnail input ownership preserves class methods, constructor fields and defaults', () => {
  const { instance, Factory, exported } = setup()
  assert.equal(typeof exported, 'function')
  assert.equal(exported.default, undefined)
  assert.deepEqual(Object.keys(instance), ['processing', 'option', 'video', 'duration', 'inputChange', 'ondrop'])
  assert.deepEqual(Object.getOwnPropertyNames(Factory.prototype), ['constructor', 'ondrop', 'setup', 'inputChange', 'loadVideo', 'start', 'creatScreenshotDate', 'creatCanvas', 'download', 'errorHandle', 'destroy'])
  assert.deepEqual(Object.keys(Factory.DEFAULTS), ['number', 'width', 'height', 'column', 'begin', 'end'])
  assert.equal(instance.setup({ custom: 7 }), instance)
  assert.equal(instance.option.custom, 7)
  instance.destroy()
})

test('Thumbnail actual registered drop callback loads the first file and prevents default', () => {
  const { instance, target } = setup()
  const file = { name: 'drop.mp4', type: 'video/mp4' }
  let prevented = 0
  for (const callback of target.handlers.get('drop') || [])
    callback({ preventDefault() { prevented++ }, dataTransfer: { files: [file] } })
  assert.equal(instance.file, file)
  assert.equal(prevented, 1)
  assert.equal(target.handlers.get('drop').has(instance.ondrop), true)
  instance.destroy()
})

test('Thumbnail replacing input moves all listeners and reads the new file', () => {
  const { instance, target, Element } = setup()
  const next = new Element('input')
  assert.equal(instance.setup({ fileInput: next }), instance)
  for (const name of ['change', 'dragover', 'drop']) {
    assert.equal(target.handlers.get(name)?.size || 0, 0)
    assert.equal(next.handlers.get(name)?.size, 1)
  }
  next.files = [{ name: 'new.mp4', type: 'video/mp4' }]
  next.value = 'new.mp4'
  for (const callback of next.handlers.get('change'))
    callback({ target: next })
  assert.equal(instance.file, next.files[0])
  assert.equal(next.value, '')
  instance.destroy()
  assert.equal(next.handlers.get('change').size, 0)
})

test('Thumbnail repeated wrapper setup reuses the owned input and restores replaced wrapper style', () => {
  const env = thumbnailEnvironment(implementation)
  const first = new env.Element('div')
  first.style.position = 'sticky'
  const instance = new env.Factory({ fileInput: first })
  const input = instance.option.fileInput
  instance.setup({ fileInput: first })
  assert.equal(first.children.length, 1)
  assert.equal(instance.option.fileInput, input)
  const second = new env.Element('div')
  second.style.position = 'absolute'
  instance.setup({ fileInput: second })
  assert.equal(first.children.length, 0)
  assert.equal(first.style.position, 'sticky')
  assert.equal(input.handlers.get('change').size, 0)
  instance.destroy()
  assert.equal(second.children.length, 0)
  assert.equal(second.style.position, 'absolute')
})

test('Thumbnail does not overwrite a wrapper style changed by its owner', () => {
  const { instance, target } = setup(true)
  target.style.position = 'fixed'
  instance.destroy()
  assert.equal(target.children.length, 0)
  assert.equal(target.style.position, 'fixed')
})

test('Thumbnail setup validation is atomic and cannot append an orphan input', () => {
  const { instance, Element } = setup()
  const previous = instance.option
  const wrapper = new Element('div')
  assert.throws(() => instance.setup({ fileInput: wrapper, width: 'invalid' }), /width/)
  assert.equal(instance.option, previous)
  assert.equal(wrapper.children.length, 0)
  assert.equal(wrapper.style.position, undefined)
  instance.destroy()
})

test('Thumbnail failed replacement listener installation removes partial listeners and keeps old ownership', () => {
  const { instance, target, Element } = setup()
  const next = new Element('input')
  const failure = new Error('listener failed')
  const add = next.addEventListener
  next.addEventListener = function (name, callback) {
    add.call(this, name, callback)
    if (name === 'dragover')
      throw failure
  }
  assert.throws(() => instance.setup({ fileInput: next }), error => error === failure)
  assert.equal(instance.option.fileInput, target)
  assert.equal(target.handlers.get('change').size, 1)
  for (const callbacks of next.handlers.values())
    assert.equal(callbacks.size, 0)
  instance.destroy()
})

test('Thumbnail failed video attachment rolls back generated input and attached video', () => {
  const env = thumbnailEnvironment(implementation)
  const wrapper = new env.Element('div')
  wrapper.style.position = 'fixed'
  const failure = new Error('append failed')
  const append = env.body.appendChild
  env.body.appendChild = function (child) {
    append.call(this, child)
    throw failure
  }
  assert.throws(() => new env.Factory({ fileInput: wrapper }), error => error === failure)
  assert.equal(env.body.children.length, 0)
  assert.equal(wrapper.children.length, 0)
  assert.equal(wrapper.style.position, 'fixed')
})

test('Thumbnail failed constructor listener attachment removes every partial resource', () => {
  const env = thumbnailEnvironment(implementation)
  const target = new env.Element('input')
  const failure = new Error('drop registration failed')
  const add = target.addEventListener
  target.addEventListener = function (name, callback) {
    add.call(this, name, callback)
    if (name === 'drop')
      throw failure
  }
  assert.throws(() => new env.Factory({ fileInput: target }), error => error === failure)
  assert.equal(env.body.children.length, 0)
  for (const callbacks of target.handlers.values())
    assert.equal(callbacks.size, 0)
})

test('Thumbnail externally detached video and repeated destroy are safe', () => {
  const { instance, body, target } = setup()
  let count = 0
  instance.on('destroy', () => count++)
  body.removeChild(instance.video)
  assert.equal(instance.destroy(), undefined)
  assert.equal(instance.destroy(), undefined)
  assert.equal(count, 1)
  for (const callbacks of target.handlers.values())
    assert.equal(callbacks.size, 0)
})

test('Thumbnail destroy uses private input ownership despite public option replacement', () => {
  const { instance, target, Element } = setup(true)
  const ownedInput = instance.option.fileInput
  instance.option = { fileInput: new Element('input') }
  instance.destroy()
  assert.equal(target.children.length, 0)
  for (const callbacks of ownedInput.handlers.values())
    assert.equal(callbacks.size, 0)
})

test('Thumbnail cleanup continues after listener removal failure and cannot reload after destroy', () => {
  const { instance, target, body, operations, Element } = setup()
  instance.loadVideo({ name: 'first.mp4', type: 'video/mp4' })
  const failure = new Error('remove failed')
  const remove = target.removeEventListener
  target.removeEventListener = function (name, callback) {
    if (name === 'change')
      throw failure
    remove.call(this, name, callback)
  }
  let count = 0
  instance.on('destroy', () => count++)
  assert.throws(() => instance.destroy(), error => error === failure)
  assert.equal(body.children.length, 0)
  assert.equal(count, 1)
  assert.equal(target.handlers.get('dragover').size, 0)
  assert.equal(operations.filter(item => item.name === 'revokeURL').length, 1)
  const wrapper = new Element('div')
  assert.equal(instance.setup({ fileInput: wrapper }), instance)
  instance.loadVideo({ name: 'late.mp4', type: 'video/mp4' })
  instance.inputChange({ target })
  instance.ondrop({ preventDefault() {
    throw new Error('should not run')
  } })
  assert.equal(wrapper.children.length, 0)
  assert.equal(operations.filter(item => item.name === 'createURL').length, 1)
  assert.equal(instance.destroy(), undefined)
})

test('Thumbnail download removes its temporary anchor even when click fails', () => {
  const { instance, Element, body } = setup()
  instance.file = { name: 'video.part.mp4' }
  instance.thumbnailUrl = 'blob:sheet'
  const failure = new Error('click failed')
  Element.prototype.click = () => {
    throw failure
  }
  assert.throws(() => instance.download(), error => error === failure)
  assert.deepEqual(body.children.map(child => child.tagName), ['VIDEO'])
  instance.destroy()
})

test('Thumbnail extracted sheet helpers preserve midpoint coordinates and footer', () => {
  const { instance, operations } = setup()
  instance.duration = 100
  assert.deepEqual(JSON.parse(JSON.stringify(instance.creatScreenshotDate())), Array.from({ length: 10 }, (_, i) => ({ time: 5 + i * 10, x: i % 3 * 20, y: Math.floor(i / 3) * 30 })))
  const canvas = instance.creatCanvas()
  assert.equal(canvas.width, 60)
  assert.equal(canvas.height, 150)
  assert.deepEqual(operations.find(item => item.name === 'fillText').args, ['From: https://artplayer.org/, Number: 10, Width: 20, Height: 30, Column: 3', 10, 139])
  instance.destroy()
})
