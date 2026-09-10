import type { EntryInput } from '../component/types'
import type { ControlHost } from './types'
import { getScope } from '../lifecycle/instance'
import { wait } from '../lifecycle/resources'
import { isMobile } from '../utils'
import airplay from './airplay'
import fullscreen from './fullscreen'
import fullscreenWeb from './fullscreenWeb'
import pip from './pip'
import playAndPause from './playAndPause'
import progress from './progress'
import screenshot from './screenshot'
import setting from './setting'
import time from './time'
import volume from './volume'

export function installControls(controls: { art: ControlHost, add: (option: EntryInput<ControlHost>) => undefined }): void {
  const { option } = controls.art

  if (!option.isLive) {
    controls.add(
      progress({
        name: 'progress',
        position: 'top',
        index: 10,
      }),
    )
  }

  controls.add({
    name: 'thumbnails',
    position: 'top',
    index: 20,
  })

  controls.add(
    playAndPause({
      name: 'playAndPause',
      position: 'left',
      index: 10,
    }),
  )

  controls.add(
    volume({
      name: 'volume',
      position: 'left',
      index: 20,
    }),
  )

  if (!option.isLive) {
    controls.add(
      time({
        name: 'time',
        position: 'left',
        index: 30,
      }),
    )
  }

  if (option.quality.length) {
    wait(getScope(controls.art)).then((active) => {
      if (!active || getScope(controls.art).closed)
        return
      controls.art.quality = option.quality
    }).catch((error) => {
      console.warn('ArtPlayer quality initialization failed:', error)
    })
  }

  if (option.screenshot && !isMobile) {
    controls.add(
      screenshot({
        name: 'screenshot',
        position: 'right',
        index: 20,
      }),
    )
  }

  if (option.setting) {
    controls.add(
      setting({
        name: 'setting',
        position: 'right',
        index: 30,
      }),
    )
  }

  if (option.pip) {
    controls.add(
      pip({
        name: 'pip',
        position: 'right',
        index: 40,
      }),
    )
  }

  if (option.airplay && 'WebKitPlaybackTargetAvailabilityEvent' in window && window.WebKitPlaybackTargetAvailabilityEvent) {
    controls.add(
      airplay({
        name: 'airplay',
        position: 'right',
        index: 50,
      }),
    )
  }

  if (option.fullscreenWeb) {
    controls.add(
      fullscreenWeb({
        name: 'fullscreenWeb',
        position: 'right',
        index: 60,
      }),
    )
  }

  if (option.fullscreen) {
    controls.add(
      fullscreen({
        name: 'fullscreen',
        position: 'right',
        index: 70,
      }),
    )
  }

  for (let index = 0; index < option.controls.length; index++) {
    controls.add(option.controls[index]!)
  }
}
