var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/video.mp4',
    title: '【新海诚动画】『秒速5センチメートル』',
    autoSize: true,
    localVideo: true,
    moreVideoAttr: {
        crossOrigin: 'anonymous',
    },
    controls: [
        {
            name: 'gif',
            position: 'right',
            html: 'Create GIF',
            mounted: $gif => {
                art.plugins.artplayerPluginGif.attach($gif);
            },
        },
        {
            name: 'open',
            position: 'right',
            html: 'Local Video',
            mounted: $open => {
                art.plugins.localVideo.attach($open);
            },
        },
    ],
    plugins: [artplayerPluginGif],
});

var $popups = document.querySelector('.popups');
var $popinner = document.querySelector('.popinner');
art.on('artplayerPluginGif', image => {
    $popups.style.display = 'flex';
    var animatedImage = document.createElement('img');
    animatedImage.src = image;
    $popinner.innerHTML = '';
    $popinner.appendChild(animatedImage);
});
