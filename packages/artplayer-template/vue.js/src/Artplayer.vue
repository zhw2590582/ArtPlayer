<script setup>
import Artplayer from 'artplayer'

// test i18n
import fr from 'artplayer/i18n/fr'
import id from 'artplayer/i18n/id'

import { nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

// test plugins
import artplayerPluginDanmuku from '../../../artplayer-plugin-danmuku'
import artplayerPluginDocumentPip from '../../../artplayer-plugin-document-pip'

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['getInstance'])

const art = shallowRef(null)
const $container = ref(null)

onMounted(() => {
  art.value = new Artplayer({
    ...props.option,
    container: $container.value,
    i18n: { id, fr },
    lang: 'fr',
    plugins: [
      artplayerPluginDocumentPip(),
      artplayerPluginDanmuku({
        danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
      }),
    ],
  })
  nextTick(() => {
    emit('getInstance', art.value)
  })
})

onBeforeUnmount(() => {
  if (art.value) {
    art.value.destroy(false)
  }
})
</script>

<template>
  <div ref="$container" />
</template>
