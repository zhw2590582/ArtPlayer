<template>
    <div ref="artRef"></div>
</template>

<script setup>
import Artplayer from 'artplayer';
import { ref, shallowRef, onMounted, onBeforeUnmount, nextTick } from 'vue';

const emit = defineEmits(['get-instance']);

const props = defineProps({
    option: {
        type: Object,
        required: true,
    },
});

const instance = shallowRef(null);
const artRef = ref(null);

onMounted(() => {
    instance.value = new Artplayer({
        ...props.option,
        container: artRef.value,
    });
    nextTick(() => {
        emit('get-instance', instance.value);
    });
});

onBeforeUnmount(() => {
    if (instance.value) {
        instance.value.destroy(false);
    }
});
</script>
