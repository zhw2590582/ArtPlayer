// npm i artplayer-plugin-audio-track
// import artplayerPluginAudioTrack from 'artplayer-plugin-audio-track';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/sprite-fight.mp4',
    plugins: [
        artplayerPluginAudioTrack({
            url: '/assets/sample/sprite-fight.aac',
            offset: 0, 
            sync: 0.3, 
        }),
    ],
});