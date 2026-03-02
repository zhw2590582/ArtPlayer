if (window.lastThumbnail) {
    window.lastThumbnail.destroy();
}

var $popups = document.querySelector('.popups');
var $popinner = document.querySelector('.popinner');
var $artplayer = document.querySelector('.artplayer-app');

$artplayer.innerHTML = 'Drop video file here or click to upload.';
var thumbnail = new ArtplayerToolThumbnail({
    fileInput: $artplayer,
    number: 60, // 数量
    width: 160, // 宽度
    column: 10, // 列数
    begin: 0, // 开始
    end: NaN, // 结束
});

window.lastThumbnail = thumbnail;

thumbnail.on('file', function (file) {
    console.log('Read video successfully: ' + file.name);
});

thumbnail.on('video', function (video) {
    console.log('Video size: ' + video.videoWidth + ' x ' + video.videoHeight);
    console.log('Video duration: ' + video.duration + 's');
    thumbnail.start();
});

thumbnail.on('canvas', function (canvas) {
    console.log('Build canvas successfully');
    console.log('Canvas size: ' + canvas.width + ' x ' + canvas.height);
    console.log('Preview density: ' + thumbnail.density + ' p/s');
});

thumbnail.on('update', function (url, percentage) {
    console.log('Processing: ' + Math.floor(percentage.toFixed(2) * 100) + '%');
    $popups.style.display = 'flex';
    $popinner.style.backgroundImage = 'url(' + url + ')';
});

thumbnail.on('download', function (name) {
    console.log('Start download preview: ' + name);
});

thumbnail.on('done', function () {
    $popups.style.display = 'none';
    thumbnail.download();
    console.log('Build preview image complete');

    [...Artplayer.instances].forEach(function (art) {
        art.destroy(true);
    });

    new Artplayer({
        container: $artplayer,
        url: thumbnail.videoUrl,
        autoSize: true,
        poster: thumbnail.thumbnailUrl,
        thumbnails: {
            url: thumbnail.thumbnailUrl,
            number: thumbnail.option.number,
            column: thumbnail.option.column,
        },
    });

    console.log('Build player complete');
});
