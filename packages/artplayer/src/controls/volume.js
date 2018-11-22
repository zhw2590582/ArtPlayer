import { append, clamp, tooltip, setStyle, getStyle } from '../utils';
import icons from '../icons';

export default class Volume {
    constructor(option) {
        this.option = option;
        this.isDroging = false;
    }

    apply(art, $control) {
        this.art = art;
        const {
            events: { proxy, hover },
            player,
            i18n,
        } = art;

        this.$volume = append($control, icons.volume);
        this.$volumeClose = append($control, icons.volumeClose);
        this.$volumePanel = append($control, '<div class="art-volume-panel"></div>');
        this.$volumeHandle = append(this.$volumePanel, '<div class="art-volume-slider-handle"></div>');
        tooltip(this.$volume, i18n.get('Mute'));
        setStyle(this.$volumeClose, 'display', 'none');

        this.setVolumeHandle(player.volume);
        art.on('video:volumechange', () => {
            this.setVolumeHandle(player.volume);
        });

        proxy(this.$volume, 'click', () => {
            player.muted = true;
        });

        proxy(this.$volumeClose, 'click', () => {
            player.muted = false;
        });

        hover(
            $control,
            () => {
                this.$volumePanel.classList.add('art-volume-panel-hover');
            },
            () => {
                this.$volumePanel.classList.remove('art-volume-panel-hover');
            },
        );

        proxy(this.$volumePanel, 'click', event => {
            player.muted = false;
            player.volume = this.volumeChangeFromEvent(event);
        });

        proxy(this.$volumeHandle, 'mousedown', () => {
            this.isDroging = true;
        });

        proxy(this.$volumeHandle, 'mousemove', event => {
            if (this.isDroging) {
                player.muted = false;
                player.volume = this.volumeChangeFromEvent(event);
            }
        });

        proxy(document, 'mouseup', () => {
            if (this.isDroging) {
                this.isDroging = false;
            }
        });
    }

    volumeChangeFromEvent(event) {
        const { left: panelLeft, width: panelWidth } = this.$volumePanel.getBoundingClientRect();
        const { width: handleWidth } = this.$volumeHandle.getBoundingClientRect();
        const percentage =
            clamp(event.x - panelLeft - handleWidth / 2, 0, panelWidth - handleWidth / 2) / (panelWidth - handleWidth);
        return percentage;
    }

    setVolumeHandle(percentage = 0.7) {
        const { player } = this.art;
        if (player.muted || percentage === 0) {
            setStyle(this.$volume, 'display', 'none');
            setStyle(this.$volumeClose, 'display', 'flex');
            setStyle(this.$volumeHandle, 'left', '0');
        } else {
            // TODO...
            const panelWidth = getStyle(this.$volumePanel, 'width') || 60;
            const handleWidth = getStyle(this.$volumeHandle, 'width');
            console.log('panelWidth', panelWidth);
            console.log('handleWidth', handleWidth);
            const width = handleWidth / 2 + (panelWidth - handleWidth) * percentage - handleWidth / 2;
            setStyle(this.$volume, 'display', 'flex');
            setStyle(this.$volumeClose, 'display', 'none');
            setStyle(this.$volumeHandle, 'left', `${width}px`);
        }
    }
}
