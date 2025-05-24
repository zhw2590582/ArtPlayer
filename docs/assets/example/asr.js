var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/steve-jobs.mp4',
    autoSize: true,
    fullscreen: true,
    fullscreenWeb: true,
    moreVideoAttr: {
        // crossOrigin: 'anonymous',
    },
    plugins: [
        artplayerPluginAsr({
            length: 2,
            interval: 40,
            sampleRate: 16000,
            autoHideTimeout: 10000,
            // Use your AI tool to convert pcm into subtitles
            onAudioChunk: ({ pcm }) => startAsr(pcm),
        }),
    ]
});

var ws = null;
var loading = false;

function stopAsr() {
    try {
        ws.send(JSON.stringify({ type: 'end' }));
        ws.close();
    } catch {}
    ws = null;
    loading = false;
}

async function startAsr(buffer) {
    if (loading) return;
    if (!ws) {
        loading = true;
        const api = 'https://api.aimu.app/asr/tencent?engine_model_type=16k_en';
        const { url } = await (await fetch(api)).json();
        ws = new WebSocket(url);
        ws.binaryType = 'arraybuffer';
        ws.onmessage = (event) => {
            const { code, result, message } = JSON.parse(event.data);
            if (code === 0) {
                art.plugins.artplayerPluginAsr.append(result?.voice_text_str);
            } else {
                console.error(code, message);
                stopAsr();
            }
        };
        loading = false;
    }
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(buffer);
    }
}

art.on('destroy', stopAsr);
