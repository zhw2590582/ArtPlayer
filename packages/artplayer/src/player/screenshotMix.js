import { secondToTime, download, def } from '../utils';

export default function screenshotMix(art, player) {
    const {
        option,
        notice,
        template: { $video },
    } = art;

    const $canvas = document.createElement('canvas');

    def(player, 'getDataURL', {
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

    def(player, 'getBlobUrl', {
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

    def(player, 'screenshot', {
        value: () => {
            player.getDataURL().then((dataUri) => {
                download(dataUri, `${option.title || 'artplayer'}_${secondToTime($video.currentTime)}.png`);
                art.emit('screenshot', dataUri);
            });
        },
    });
}
