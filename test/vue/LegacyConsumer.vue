<script setup>
import { ref } from 'vue'
import Player from './src/Player.vue'

const shown = ref(true)
const option = { url: '/pattern.mp4', muted: true }
const playerStyle = { width: '640px', height: '360px' }
// Plain JavaScript keeps the existing event and prop syntax.
function getInstance(art) {
  document.body.dataset.instance = String(art.id)
  art.on('destroy', () => document.body.dataset.destroyed = 'yes')
}
</script>

<template>
  <button id="toggle" @click="shown = !shown">
    Toggle player
  </button>
  <Player v-if="shown" id="legacy-player" data-consumer="preserved" :option="option" :style="playerStyle" @get-instance="getInstance" />
</template>
