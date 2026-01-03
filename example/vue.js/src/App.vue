<script setup lang="ts">
import { reactive } from 'vue'
import Artplayer, { type Option } from 'artplayer'
import Player from './Player.vue'

const option = reactive<Partial<Option>>({
  url: 'https://artplayer.org/assets/sample/video.mp4',
  autoSize: true,
})

const style = reactive({
  width: '800px',
  height: '600px',
  margin: '60px auto 0',
})

function getInstance(art: Artplayer) {
  console.log('Artplayer instance:', art)
}
</script>

<template>
  <Player :option="option" :style="style" @get-instance="getInstance" />
</template>
