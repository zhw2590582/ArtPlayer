(function() {
    var $upload = document.querySelector('.upload');
    var $file = document.querySelector('.file');
    var $artplayer = document.querySelector('.artplayer');
    var $aspectRatio = document.querySelector('.aspectRatio');
    var $duration = document.querySelector('.duration');
    var $number = document.querySelector('.number');
    var $width = document.querySelector('.width');
    var $height = document.querySelector('.height');
    var $column = document.querySelector('.column');

    var thumbnail = new ArtplayerToolThumbnail({
        fileInput: $file,
        callbackVideoUrl: function(url) {
            $upload.style.display = 'none';
            $artplayer.style.display = 'block';
            restartArtplayer();
        },
        callbackThumbnailUrl: function (url) {
            console.log(url);
        }
    });

    function restartArtplayer() {
        var number = Number($number.value);
        var width = Number($width.value);
        var height = Number($height.value);
        var column = Number($column.value);

        Artplayer.instances.forEach(function(art) {
            art.destroy(true);
        });

        var option = {
            container: $artplayer,
            url: thumbnail.videoUrl
        };

        if (thumbnail.thumbnailUrl) {
            option.thumbnails = {
                url: thumbnail.thumbnailUrl,
                number: number,
                width: width,
                height: height,
                column: column,
            }
        }

        var art = new Artplayer(option);

        art.on('firstCanplay', function() {
            var $video = art.template.$video;
            $aspectRatio.textContent = $video.videoWidth + ' x ' + $video.videoHeight;
            $duration.textContent = $video.duration + 's';
            thumbnail.setup({
                videoElement: $video,
                number: number,
                width: width,
                height: height,
                column: column,
            });
        });
    }
})();
