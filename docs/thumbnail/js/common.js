'use strict';

(function() {
    var $preview = document.querySelector('.preview');
    var $upload = document.querySelector('.upload');
    var $file = document.querySelector('.file');
    var $reset = document.querySelector('.reset');
    var $create = document.querySelector('.create');
    var $download = document.querySelector('.download');
    var $artplayer = document.querySelector('.artplayer');
    var $delay = document.querySelector('.delay');
    var $number = document.querySelector('.number');
    var $width = document.querySelector('.width');
    var $height = document.querySelector('.height');
    var $column = document.querySelector('.column');

    function getConfig() {
        return {
            delay: Number($delay.value),
            number: Number($number.value),
            width: Number($width.value),
            height: Number($height.value),
            column: Number($column.value),
        };
    }

    consola.creat({
        target: '.console',
        size: '100%',
        zIndex: 99,
    });

    console.info('Welcome to this tool, if you like it, consider star it, thank you.');
    console.info('https://github.com/zhw2590582/ArtPlayer');

    window.addEventListener('error', function(err) {
        console.error(err.message);
    });

    var thumbnail = new ArtplayerToolThumbnail({
        fileInput: $file,
    });

    $reset.addEventListener('click', function() {
        window.location.reload();
    });

    $create.addEventListener('click', function() {
        thumbnail.setup(getConfig()).start();
    });

    $download.addEventListener('click', function() {
        thumbnail.download();
    });

    thumbnail.on('file', function(file) {
        console.log('Read video successfully: ' + file.name);
    });

    thumbnail.on('video', function(video) {
        console.log('Video size: ' + video.videoWidth + ' x ' + video.videoHeight);
        console.log('Video duration: ' + video.duration + 's');
        thumbnail.setup(getConfig()).start();
    });

    thumbnail.on('canvas', function(canvas) {
        console.log('Build canvas successfully');
        console.log('Canvas size: ' + canvas.width + ' x ' + canvas.height);
        console.log('Preview density: ' + thumbnail.density + ' p/s');
    });

    thumbnail.on('update', function(url, percentage) {
        console.log('Processing: ' + Math.floor(percentage.toFixed(2) * 100) + '%');
        $preview.style.backgroundImage = 'url(' + url + ')';
    });

    thumbnail.on('download', function(name) {
        console.log('Start download preview: ' + name);
    });

    thumbnail.on('done', function() {
        console.log('Build preview image complete');
        $upload.style.display = 'none';
        $artplayer.style.display = 'block';

        Artplayer.instances.forEach(function(art) {
            art.destroy(true);
        });

        new Artplayer({
            container: $artplayer,
            url: thumbnail.videoUrl,
            thumbnails: {
                url: thumbnail.thumbnailUrl,
                number: thumbnail.option.number,
                width: thumbnail.option.width,
                height: thumbnail.option.height,
                column: thumbnail.option.column,
            },
        });
        console.log('Build player complete');
    });
})();
