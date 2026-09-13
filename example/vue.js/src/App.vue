<script setup lang="ts">
import type Artplayer from 'artplayer'
import type { Option } from 'artplayer'
import { reactive } from 'vue'
import Player from './Player.vue'

const option = reactive({
  url: 'https://artplayer.org/assets/sample/video.mp4',
  autoSize: true,
} satisfies Partial<Option>)

const style = reactive({
  width: '800px',
  height: '600px',
  margin: '60px auto 0',
})

function getInstance(art: Artplayer) {
  // eslint-disable-next-line no-console
  console.log('Artplayer instance:', art)
}
</script>

<template>
  <Player :option="option" :style="style" @get-instance="getInstance" />
</template>
