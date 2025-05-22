var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginAsr({
            interval: 2000,
            sampleRate: 16000,
            cleanupTimeout: 3000,
            onAudioChunk: async ({ buffer }) => {
                // Use your AI tool to convert buffer into subtitles
                const subtitle = await tencentASR(buffer);
                console.log('Received subtitle:', subtitle);
                return subtitle;
            },
        }),
    ]
});

var ws = null;
async function tencentASR(buffer) {
    return new Promise(async (resolve) => {
        if (!ws) {
            const api = 'https://api.aimu.app/asr/tencent?engine_model_type=16k_ja&voice_format=1';
            const { url } = await (await fetch(api)).json();
            ws = new WebSocket(url);
            ws.binaryType = 'arraybuffer';
            ws.onmessage = (event) => resolve(event.data);
        }
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(buffer);
        } else {
            console.warn('WebSocket is not open');
        }
    })
}