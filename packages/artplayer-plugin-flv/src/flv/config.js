export default {
    mediaSource: {
        propertys: [
            'activeSourceBuffers',
            'duration',
            'readyState',
            'sourceBuffers',
        ],
        methods: [
            'addSourceBuffer',
            'endOfStream',
            'removeSourceBuffer',
            'clearLiveSeekableRange',
            'setLiveSeekableRange',
        ],
        events: [
            'sourceclose',
            'sourceended',
            'sourceopen',
        ],
    },
    sourceBuffer: {
        propertys: [
            'mode',
            'updating',
            'buffered',
            'timestampOffset',
            'audioTracks',
            'videoTracks',
            'textTracks',
            'appendWindowStart',
            'appendWindowEnd',
            'trackDefaults',
        ],
        methods: [
            'appendBuffer',
            'appendStream',
            'abort',
            'remove',
        ],
        events: [
            'abort',
            'error',
            'update',
            'updateend',
            'updatestart',
        ],
    },
    sourceBufferList: {
        propertys: [
            'length',
        ],
        events: [
            'addsourcebuffer',
            'removesourcebuffer',
        ],
    },
};
