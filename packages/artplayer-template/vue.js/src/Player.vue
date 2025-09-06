<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'

// Test type
import Artplayer, { type Option } from 'artplayer'

// Test i18n
import fr from 'artplayer/i18n/fr'
import id from 'artplayer/i18n/id'

// Test plugins
import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'

const props = defineProps<{ option: Partial<Option> }>()
const emit = defineEmits(['getInstance'])

const art = shallowRef<Artplayer>(null)
const $container = ref(null)

onMounted(() => {
  art.value = new Artplayer({
    ...props.option,
    url: props.option.url,
    container: $container.value,
    i18n: { id, fr },
    lang: 'fr',
    plugins: [
      artplayerPluginDocumentPip({
        //
      }),
      artplayerPluginDanmuku({
        danmuku: 'https://artplayer.org/assets/sample/danmuku.xml',
      }),
    ],
  })
  emit('getInstance', art.value)
})

onBeforeUnmount(() => {
  art.value?.destroy(false)
})
</script>

<template>
  <div ref="$container" />
</template>
