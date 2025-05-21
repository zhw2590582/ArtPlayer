var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    plugins: [
        artplayerPluginAsr({
            interval: 1000,
            sampleRate: 16000,
            onAudioChunk: (buffer) => {
                console.log('Audio buffer:', buffer);
            },
        }),
    ]
});