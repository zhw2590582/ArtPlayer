<script setup>
import { reactive } from 'vue'
import Artplayer from './Artplayer.vue'

const option = reactive({
  url: 'https://artplayer.org/assets/sample/video.mp4',
  autoSize: true,
})

const style = reactive({
  width: '600px',
  height: '400px',
  margin: '60px auto 0',
})

function getInstance(art) {
  // eslint-disable-next-line no-console
  console.log(art)
}
</script>

<template>
  <Artplayer :option="option" :style="style" @get-instance="getInstance" />
</template>
