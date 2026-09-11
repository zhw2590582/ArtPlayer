import type Artplayer from 'artplayer'
import type { Input, Options } from './types'

export function normalizeOptions(input: Input | undefined, validate: typeof Artplayer.validator): Options {
  return validate({
    html: '',
    video: '',
    url: '',
    playDuration: 5,
    totalDuration: 10,
    muted: false,
    i18n: {
      close: '关闭广告',
      countdown: '%s秒',
      detail: '查看详情',
      canBeClosed: '%s秒后可关闭广告',
    },
    ...input,
  }, {
    html: '?string',
    video: '?string',
    url: '?string',
    playDuration: 'number',
    totalDuration: 'number',
    muted: '?boolean',
    i18n: { close: 'string', countdown: 'string', detail: 'string', canBeClosed: 'string' },
  })
}
