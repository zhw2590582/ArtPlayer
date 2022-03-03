<script setup>
import Artplayer from 'artplayer/examples/vue/Artplayer.vue';

const option = {
    url: 'https://artplayer.org/assets/sample/video.mp4',
};

const style = {
    width: '600px',
    height: '400px',
    margin: '60px auto 0',
};

function getInstance(art) {
    console.log(art);
}
</script>

<template>
    <Artplayer @get-instance="getInstance" :option="option" :style="style" />
</template>