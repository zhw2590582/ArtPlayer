<script setup lang="ts">
import type { Option } from 'artplayer'
import Artplayer from 'artplayer'
import { nextTick, onErrorCaptured, reactive, ref, shallowRef } from 'vue'
import Player from './src/Player.vue'

const shown = ref(true)
const sibling = ref(false)
const bare = ref(false)
const cached = ref(false)
const key = ref(0)
const player = shallowRef<InstanceType<typeof Player> | null>(null)
const option = shallowRef<Partial<Option>>(reactive({ url: '/pattern.mp4', muted: true }))
const records: { art: Artplayer, destroyed: number }[] = []
const errors: { message: string, same: boolean }[] = []
const failure = new Error('vue-consumer-listener-failure')
let callbackMode = 'normal'
function capture(art: Artplayer) {
  const record = { art, destroyed: 0 }
  records.push(record)
  art.on('destroy', () => record.destroyed++)
  if (callbackMode === 'throw')
    throw failure
  if (callbackMode === 'unmount')
    shown.value = false
}
onErrorCaptured((error) => {
  errors.push({ message: error.message, same: error === failure })
  return false
})
const probe = {
  async act(action: string) {
    if (action === 'mutate')
      option.value.url = '/pattern.mp4?mutation'
    if (action === 'replace')
      option.value = { url: '/pattern.mp4?replacement', muted: true }
    if (action === 'key')
      key.value++
    if (action === 'siblings')
      sibling.value = true
    if (action === 'remove-sibling')
      sibling.value = false
    if (action === 'hide')
      shown.value = false
    if (action === 'show')
      shown.value = true
    if (action === 'bare') {
      shown.value = false
      bare.value = true
    }
    if (action === 'remove-bare')
      bare.value = false
    if (action === 'cache') {
      shown.value = false
      cached.value = true
    }
    if (action === 'deactivate')
      cached.value = false
    if (action === 'activate')
      cached.value = true
    if (action === 'throw' || action === 'unmount') {
      callbackMode = action
      key.value++
      shown.value = true
    }
    if (action === 'normal')
      callbackMode = 'normal'
    if (action === 'cancel') {
      shown.value = true
      shown.value = false
    }
    await nextTick()
  },
  current: () => Artplayer.instances.find(art => art.template.$container.classList.contains('primary-player')) || Artplayer.instances[0],
  snapshot: () => ({
    active: Artplayer.instances.length,
    created: records.length,
    records: records.map(({ art, destroyed }) => ({ id: art.id, isDestroy: art.isDestroy, destroyed })),
    errors,
    exposesArt: Boolean(player.value && 'art' in player.value),
    componentRef: Boolean(player.value?.$el),
    players: document.querySelectorAll('.art-video-player').length,
    videos: document.querySelectorAll('video').length,
  }),
}
declare global {
  interface Window { vueProbe: typeof probe, unmountVue: () => void }
}
window.vueProbe = probe
</script>

<template>
  <Player v-if="shown" :key="key" ref="player" class="primary-player" :style="{ width: '640px', height: '360px' }" :option="option" @get-instance="capture" />
  <Player v-if="sibling" :style="{ width: '320px', height: '180px' }" :option="option" @get-instance="capture" />
  <Player v-if="bare" :style="{ width: '320px', height: '180px' }" :option="option" />
  <KeepAlive>
    <Player v-if="cached" :style="{ width: '320px', height: '180px' }" :option="option" @get-instance="capture" />
  </KeepAlive>
</template>
