import css from './style.less?inline'
import svg from './icon.svg?raw'
import InlineWorker from './worker.ts?worker&inline'
import { add } from './shared.js'

interface Options {
  label?: string
}

export default function buildProbe(options: Options = {}) {
  return {
    label: options.label ?? 'default',
    value: add(20, 22),
    css,
    svg,
    createWorker: () => new InlineWorker(),
  }
}
