import Artplayer from '../../artplayer/src';
import '../../artplayer/src/style/index.scss';

export default {
    data() {
        return {
            instance: null,
        };
    },
    props: {
        option: {
            type: Object,
            required: true,
        },
        getInstance: Function,
    },
    mounted() {
        this.instance = new Artplayer({
            ...this.option,
            container: this.$refs.artRef,
        });

        this.$emit('getInstance', this.instance);
    },
    beforeDestroy() {
        if (this.instance && this.instance.destroy) {
            this.instance.destroy();
        }
    },
    render(h) {
        return h('div', {
            ref: 'artRef',
        });
    },
};
