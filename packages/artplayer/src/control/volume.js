import { append, clamp, tooltip, setStyle, isMobile } from '../utils';

export default function volume(option) {
    return (art) => ({
        ...option,
        mounted: ($control) => {
            const { proxy, icons, i18n } = art;

            let isDroging = false;
            const panelWidth = art.constructor.VOLUME_PANEL_WIDTH;
            const handleWidth = art.constructor.VOLUME_HANDLE_WIDTH;
            const $volume = append($control, icons.volume);
            const $volumeClose = append($control, icons.volumeClose);
            const $volumePanel = append($control, '<div class="art-volume-panel"></div>');
            const $volumeHandle = append($volumePanel, '<div class="art-volume-slider-handle"></div>');
            tooltip($volume, i18n.get('Mute'));
            setStyle($volumeClose, 'display', 'none');

            if (isMobile) {
                setStyle($volumePanel, 'display', 'none');
            }

            function volumeChangeFromEvent(event) {
                const { left: panelLeft } = $volumePanel.getBoundingClientRect();
                const percentage =
                    clamp(event.pageX - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) /
                    (panelWidth - handleWidth);
                return percentage;
            }

            function setVolumeHandle(percentage = 0.7) {
                if (art.muted || percentage === 0) {
                    setStyle($volume, 'display', 'none');
                    setStyle($volumeClose, 'display', 'flex');
                    setStyle($volumeHandle, 'left', '0');
                } else {
                    const width = (panelWidth - handleWidth) * percentage;
                    setStyle($volume, 'display', 'flex');
                    setStyle($volumeClose, 'display', 'none');
                    setStyle($volumeHandle, 'left', `${width}px`);
                }
            }

            setVolumeHandle(art.volume);
            art.on('video:volumechange', () => {
                setVolumeHandle(art.volume);
            });

            proxy($volume, 'click', () => {
                art.muted = true;
            });

            proxy($volumeClose, 'click', () => {
                art.muted = false;
            });

            proxy($volumePanel, 'click', (event) => {
                art.muted = false;
                art.volume = volumeChangeFromEvent(event);
            });

            proxy($volumeHandle, 'mousedown', () => {
                isDroging = true;
            });

            proxy($control, 'mousemove', (event) => {
                if (isDroging) {
                    art.muted = false;
                    art.volume = volumeChangeFromEvent(event);
                }
            });

            proxy(document, 'mouseup', () => {
                if (isDroging) {
                    isDroging = false;
                }
            });
        },
    });
}
