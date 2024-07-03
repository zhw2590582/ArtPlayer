import { secondToTime, download, def, createElement } from '../utils';

export default function screenshotMix(art) {
    const {
        notice,
        template: { $video },
    } = art;

    const $canvas = createElement('canvas');

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
        value: async (name) => {
            const dataUri = await art.getDataURL();
            const fileName = name || `artplayer_${secondToTime($video.currentTime)}`;
            download(dataUri, `${fileName}.png`);
            art.emit('screenshot', dataUri);
            return dataUri;
        },
    });
}
