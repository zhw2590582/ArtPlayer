import { secondToTime, downloadImage } from '../utils';

export default function screenshotMix(art, player) {
    const {
        option,
        notice,
        template: { $video },
    } = art;

    function captureFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = $video.videoWidth;
        canvas.height = $video.videoHeight;
        canvas.getContext('2d').drawImage($video, 0, 0);
        const dataUri = canvas.toDataURL('image/png');
        downloadImage(dataUri, `${option.title || 'artplayer'}_${secondToTime($video.currentTime)}.png`);
        return dataUri;
    }

    Object.defineProperty(player, 'screenshot', {
        value: () => {
            try {
                const dataUri = captureFrame();
                art.emit('screenshot', dataUri);
            } catch (error) {
                notice.show(error);
                console.warn(error);
            }
        },
    });
}
