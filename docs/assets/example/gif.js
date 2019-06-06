var url = 'https://zhw2590582.github.io/assets-cdn';
var art = new Artplayer({
    container: '.artplayer-app',
    url: url + '/video/one-more-time-one-more-chance-480p.mp4',
    title: '【新海诚动画】『秒速5センチメートル』',
    autoSize: true,
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
            style: {
                marginRight: '15px'
            }
        },
        {
            name: 'open',
            position: 'right',
            html: 'Local video',
            mounted: $open => {
                art.plugins.localPreview.attach($open);
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