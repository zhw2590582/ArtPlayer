<template>
    <div class="artplayer-plugin-danmuku">
        <div class="apd-toggle">toggle</div>
        <div class="apd-config">config</div>
        <div class="apd-input">input</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            option: {
                danmuku: [],
                speed: 5,
                margin: [10, 100],
                opacity: 1,
                fontSize: 25,
                filter: () => true,
                antiOverlap: true,
                useWorker: true,
                synchronousPlayback: false,
            },
            danmu: {
                text: '',
                mode: 0,
                time: 0,
                color: '#ffffff',
                border: true,
            },
        };
    },
    mounted() {
        this.option = Object.assign(this.option, this.$danmuku.option);
    },
};
</script>