// Depends on: 
// https://glomex.github.io/vast-ima-player/
// https://developers.google.com/interactive-media-ads/docs/sdks/html5/client-side

// npm i artplayer-plugin-vast
// import artplayerPluginVast from 'artplayer-plugin-vast';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    fullscreen: true,
    fullscreenWeb: true,
    plugins: [
        artplayerPluginVast(({ playUrl, imaPlayer, ima }) => {
            // Play the ad when the video is played
            art.once('play', () => {
                playUrl('https://artplayer.org/assets/vast/linear-ad.xml');
            });
        }),
    ],
});