import type Artplayer from 'artplayer'
import type { Option, Result } from '../types/api.js'
import './stylesheet'

function {{export}}(_option: Option = {}) {
  return (_art: Artplayer): Result => ({ name: '{{export}}' })
}

export default Object.assign({{export}}, { default: {{export}} })
