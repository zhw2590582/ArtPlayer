<script setup lang="ts">
import type { Option } from 'artplayer'
import Artplayer from 'artplayer'

import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { playerOptions } from './player-options'

const props = defineProps<{ option: Partial<Option> }>()
const emit = defineEmits(['getInstance'])

const art = shallowRef<Artplayer | null>(null)
const $container = shallowRef<HTMLDivElement | null>(null)

onMounted(() => {
  const container = $container.value
  if (!container)
    return
  art.value = new Artplayer(playerOptions(props.option, container))
  emit('getInstance', art.value)
})

onBeforeUnmount(() => {
  const instance = art.value
  art.value = null
  instance?.destroy(false)
})
</script>

<template>
  <div ref="$container" />
</template>
