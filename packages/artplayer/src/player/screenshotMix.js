import { secondToTime, downloadFile } from '../utils';

export default function screenshotMix(art, player) {
    const {
        option,
        notice,
        template: { $video },
    } = art;

    Object.defineProperty(player, 'getScreenshotDataURL', {
        value: () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = $video.videoWidth;
                canvas.height = $video.videoHeight;
                canvas.getContext('2d').drawImage($video, 0, 0);
                return canvas.toDataURL('image/png');
            } catch (error) {
                notice.show(error);
                console.warn(error);
                return null;
            }
        },
    });

    Object.defineProperty(player, 'getScreenshotBlobUrl', {
        value: () => {
            return new Promise((resolve, reject) => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = $video.videoWidth;
                    canvas.height = $video.videoHeight;
                    canvas.getContext('2d').drawImage($video, 0, 0);
                    canvas.toBlob(blob => {
                        resolve(URL.createObjectURL(blob));
                    });
                } catch (error) {
                    notice.show(error);
                    reject(error);
                }
            });
        },
    });

    Object.defineProperty(player, 'screenshot', {
        value: () => {
            const dataUri = player.getScreenshotDataURL();
            if (dataUri) {
                downloadFile(dataUri, `${option.title || 'artplayer'}_${secondToTime($video.currentTime)}.png`);
                art.emit('screenshot', dataUri);
            }
        },
    });
}
