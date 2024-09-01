function create({ url, width, number }, callback) {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.src = url;

    video.onloadedmetadata = () => {
        const duration = video.duration;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const height = Math.floor((width * video.videoHeight) / video.videoWidth);

        canvas.width = width * 10;
        canvas.height = height * Math.ceil(number / 10);

        let loadedCount = 0;
        let blobUrl = null;

        function seekAndDraw(index) {
            canvas.toBlob((blob) => {
                URL.revokeObjectURL(blobUrl);
                blobUrl = URL.createObjectURL(blob);

                callback({
                    url: blobUrl,
                    height: height,
                });
            }, 'image/jpeg');

            if (index >= number) return;
            video.currentTime = (duration * index) / number;

            video.onseeked = () => {
                ctx.drawImage(video, (index % 10) * width, Math.floor(index / 10) * height, width, height);
                loadedCount++;
                seekAndDraw(index + 1);
            };
        }

        seekAndDraw(0);
    };
}

export default function artplayerPluginAutoThumbnail(option) {
    return async (art) => {
        art.on('video:loadedmetadata', () => {
            const url = option.url || art.option.url;
            const width = option.width || 160;
            const number = option.number || 100;
            const scale = option.scale || 1;
            create({ url, width, number }, (config) => {
                art.thumbnails = {
                    ...config,
                    column: 10,
                    number,
                    width,
                    scale,
                };
            });
        });

        return {
            name: 'artplayerPluginAutoThumbnail',
        };
    };
}

if (typeof window !== 'undefined') {
    window['artplayerPluginAutoThumbnail'] = artplayerPluginAutoThumbnail;
}
