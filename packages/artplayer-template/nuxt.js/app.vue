<template>
  <div>
    <client-only placeholder="loading...">
      <Artplayer @get-instance="getInstance" :option="option" :style="style" />
    </client-only>
  </div>
</template>

<script>
import Artplayer from "./Artplayer.vue";

export default {
  components: {
    Artplayer,
  },
  data() {
    return {
      option: {
        url: "https://artplayer.org/assets/sample/video.mp4",
        autoSize: true,
      },
      style: {
        width: "600px",
        height: "400px",
        margin: "60px auto 0",
      },
    };
  },
  methods: {
    getInstance(art) {
      console.log(art);
    },
  },
};
</script>