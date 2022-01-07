import { secondToTime, download, def } from '../utils';

export default function screenshotMix(art) {
    const {
        option,
        notice,
        template: { $video },
    } = art;

    const $canvas = document.createElement('canvas');

    def(art, 'getDataURL', {
        value: () =>
            new Promise((resolve, reject) => {
                try {
                    $canvas.width = $video.videoWidth;
                    $canvas.height = $video.videoHeight;
                    $canvas.getContext('2d').drawImage($video, 0, 0);
                    resolve($canvas.toDataURL('image/png'));
                } catch (err) {
                    notice.show = err;
                    reject(err);
                }
            }),
    });

    def(art, 'getBlobUrl', {
        value: () =>
            new Promise((resolve, reject) => {
                try {
                    $canvas.width = $video.videoWidth;
                    $canvas.height = $video.videoHeight;
                    $canvas.getContext('2d').drawImage($video, 0, 0);
                    $canvas.toBlob((blob) => {
                        resolve(URL.createObjectURL(blob));
                    });
                } catch (err) {
                    notice.show = err;
                    reject(err);
                }
            }),
    });

    def(art, 'screenshot', {
        value: () => {
            return art.getDataURL().then((dataUri) => {
                download(dataUri, `${option.title || 'artplayer'}_${secondToTime($video.currentTime)}.png`);
                art.emit('screenshot', dataUri);
                return dataUri;
            });
        },
    });
}
