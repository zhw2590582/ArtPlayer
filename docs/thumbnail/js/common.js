(function() {
    var $img = document.querySelector('.img');
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
        callbackThumbnailUrl: function(url) {
            $img.style.backgroundImage = `url(${url})`;
        },
        callbackDone: function(videoUrl, thumbnailUrl) {
            restartArtplayer();
        },
    });

    function restartArtplayer() {
        Artplayer.instances.forEach(function(art) {
            art.destroy(true);
        });

        var option = {
            container: $artplayer,
            url: thumbnail.videoUrl,
        };

        if (thumbnail.thumbnailUrl) {
            option.thumbnails = {
                url: thumbnail.thumbnailUrl,
            };
        }

        var art = new Artplayer(option);

        art.on('firstCanplay', function() {
            var $video = art.template.$video;
            $aspectRatio.textContent = $video.videoWidth + ' x ' + $video.videoHeight;
            $duration.textContent = $video.duration + 's';
            thumbnail.mergeOption({
                videoElement: $video,
            });

            if (!thumbnail.thumbnailUrl) {
                thumbnail.getThumbnailUrl();
            }
        });
    }
})();
