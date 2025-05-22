var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginAsr({
            interval: 40,
            sampleRate: 16000,
            cleanupTimeout: 3000,
            // Use your AI tool to convert buffer into subtitles
            onAudioChunk: (buffer) => tencentASR(buffer),
        }),
    ]
});

var ws = null;
var loading = false;
async function tencentASR(buffer) {
    if (loading) return;

    if (!ws) {
        loading = true;
        // This service may not be accessible outside of China
        const api = 'https://api.aimu.app/asr/tencent?engine_model_type=16k_ja';
        const { url } = await (await fetch(api)).json();
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
        ws.onmessage = (event) => {
            const json = JSON.parse(event.data);
            const subtitle = json.result?.voice_text_str;
            console.info('Subtitle', subtitle);
            // Append the subtitle on the player
            art.plugins.artplayerPluginAsr.append(subtitle);
        };
        loading = false;
    }

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(buffer);
    } else {
        console.warn('WebSocket is not open');
    }
}

art.on('destroy', () => {
    try {
        ws.send(JSON.stringify({ type: 'end' }));
        ws.close();
    } catch {}
    ws = null;
});
