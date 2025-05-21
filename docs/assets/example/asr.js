var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginAsr({
            length: 3,
            interval: 40,
            sampleRate: 16000,
            hideTimeout: 10000,
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
        const api = 'https://api.aimu.app/asr/tencent?engine_model_type=16k_ja';
        const { url } = await (await fetch(api)).json();
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
        ws.onmessage = (event) => {
            const { code, result } = JSON.parse(event.data);
            if (code === 0) {
                const subtitle = result?.voice_text_str;
                art.plugins.artplayerPluginAsr.append(subtitle);
            } else {
                ws.close();
                ws = null;
            }

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
