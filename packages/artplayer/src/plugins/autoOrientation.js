import { setStyle } from '../utils';

export default function autoOrientation(art) {
    const {
        option,
        template: { $player, $video },
    } = art;

    art.on('fullscreenWeb', (state) => {
        if (state) {
            const { videoWidth, videoHeight } = $video;
            const { clientWidth: viewWidth, clientHeight: viewHeight } = document.documentElement;
            if (
                (videoWidth > videoHeight && viewWidth < viewHeight) ||
                (videoWidth < videoHeight && viewWidth > viewHeight)
            ) {
                setStyle($player, 'width', `${viewHeight}px`);
                setStyle($player, 'height', `${viewWidth}px`);
                setStyle($player, 'transform', `rotate(90deg) translate(0,-${viewWidth}px)`);
                setStyle($player, 'transform-origin', '0 0');
            }
        } else {
            setStyle($player, 'width', null);
            setStyle($player, 'height', null);
            setStyle($player, 'transform', null);
            setStyle($player, 'transform-origin', null);
            art.autoSize = option.autoSize;
            art.notice.show = '';
        }
    });

    return {
        name: 'autoOrientation',
    };
}
