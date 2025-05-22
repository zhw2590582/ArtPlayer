var ws = null;

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginAsr({
            interval: 2000,
            sampleRate: 16000,
            onAudioChunk: (buffer) => {
                return new Promise(async (resolve) => {
                    if (!ws) {
                        const {url} = await (await fetch('http://localhost:9001/asr')).json();
                        ws = new WebSocket(url);
                        ws.binaryType = 'arraybuffer';
                        ws.onopen = () => {
                            console.log('WebSocket connection opened');
                        };
                        ws.onclose = () => {
                            console.log('WebSocket connection closed');
                            ws = null;
                        };
                        ws.onerror = (error) => {
                            console.error('WebSocket error:', error);
                        };
                        ws.onmessage = (event) => {
                            resolve(event.data);
                        };
                    }
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(buffer);
                    } else {
                        console.error('WebSocket is not open. Ready state:', ws.readyState);
                    }
                });
  
            },
        }),
    ]
});

art.on('destroy', () => {
    if (ws) {
        ws.close();
        ws = null;
    }
});