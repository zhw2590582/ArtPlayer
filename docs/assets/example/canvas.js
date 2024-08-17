// npm i artplayer-plugin-canvas
// import ArtplayerPluginCanvas from 'artplayer-plugin-canvas';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    Canvas: ArtplayerPluginCanvas,
});