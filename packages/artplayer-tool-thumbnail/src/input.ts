import type ArtplayerToolThumbnail from './index'
import type { InputOptions } from './types'
import { cancellation, stateFor } from './lifecycle'
import { clamp } from './utils'

type Registration = readonly [name: string, callback: EventListener]
interface InputRecord {
  input: HTMLInputElement
  wrapper: HTMLElement | null
  position: string
  listeners: Registration[]
  callbacks: Registration[] | null
}

const inputs = new WeakMap<ArtplayerToolThumbnail, InputRecord>()

function release(record: InputRecord) {
  let failure: unknown
  for (const [name, callback] of record.listeners.splice(0)) {
    try {
      record.input.removeEventListener(name, callback)
    }
    catch (error) {
      failure ||= error
    }
  }
  if (record.wrapper) {
    try {
      if (record.input.parentNode)
        record.input.parentNode.removeChild(record.input)
    }
    catch (error) {
      failure ||= error
    }
    if (record.wrapper.style.position === 'relative')
      record.wrapper.style.position = record.position
  }
  if (failure)
    throw failure
}

function connect(record: InputRecord, callbacks: Registration[]) {
  try {
    for (const [name, callback] of callbacks) {
      record.listeners.push([name, callback])
      record.input.addEventListener(name, callback)
    }
  }
  catch (error) {
    try {
      release(record)
    }
    catch {}
    throw error
  }
}

export function setupInput(tool: ArtplayerToolThumbnail, patch: InputOptions) {
  const state = stateFor(tool)
  const epoch = ++state.inputEpoch
  const current = () => !state.closed && state.inputEpoch === epoch
  const option = Object.assign({}, tool.option, patch)
  const target = option.fileInput!
  tool.errorHandle(target instanceof Element, 'The \'fileInput\' is not a Element')
  for (const name of ['number', 'width', 'column', 'begin', 'end'])
    tool.errorHandle(typeof option[name] === 'number', `The '${name}' is not a number`)
  option.number = clamp(option.number, 10, 1000)
  option.width = clamp(option.width, 10, 1000)
  option.column = clamp(option.column, 1, 1000)
  if (!current())
    throw cancellation('input setup superseded')

  const previous = inputs.get(tool)
  if (previous && (target === previous.input || target === previous.wrapper)) {
    option.fileInput = previous.input
    tool.option = option
    return option
  }
  // A wrapper is replaced by its owned file input before the record is committed.
  const record: InputRecord = { input: target as HTMLInputElement, wrapper: null, position: '', listeners: [], callbacks: previous?.callbacks || null }
  try {
    if (!(target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'file')) {
      record.wrapper = target
      record.position = target.style.position
      record.input = document.createElement('input')
      record.input.type = 'file'
      Object.assign(record.input.style, { position: 'absolute', width: '100%', height: '100%', left: '0', top: '0', right: '0', bottom: '0', opacity: '0' })
      target.style.position = 'relative'
      target.appendChild(record.input)
    }
    if (!current())
      throw cancellation('input setup superseded')
    if (record.callbacks)
      connect(record, record.callbacks)
    if (!current())
      throw cancellation('input setup superseded')
  }
  catch (error) {
    try {
      release(record)
    }
    catch {}
    throw error
  }
  option.fileInput = record.input
  inputs.set(tool, record)
  tool.option = option
  if (previous)
    release(previous)
  return option
}

export function connectInput(tool: ArtplayerToolThumbnail, dragover: (event: DragEvent) => void) {
  const record = inputs.get(tool)!
  // These callbacks are registered only for their matching DOM event names.
  record.callbacks = [['change', tool.inputChange], ['dragover', dragover as EventListener], ['drop', tool.ondrop as EventListener]]
  connect(record, record.callbacks)
}

export function releaseInput(tool: ArtplayerToolThumbnail) {
  const record = inputs.get(tool)
  if (!record)
    return
  inputs.delete(tool)
  release(record)
}
