import { def } from '../utils';

export default function airplayMix(art) {
    const {
        i18n,
        notice,
        proxy,
        template: { $video },
    } = art;

    let available = true;

    if (window.WebKitPlaybackTargetAvailabilityEvent && $video.webkitShowPlaybackTargetPicker) {
        proxy($video, 'webkitplaybacktargetavailabilitychanged', (event) => {
            switch (event.availability) {
                case 'available':
                    available = true;
                    break;
                case 'not-available':
                    available = false;
                    break;
            }
        });
    } else {
        available = false;
    }

    def(art, 'airplay', {
        value() {
            if (available) {
                $video.webkitShowPlaybackTargetPicker();
                art.emit('airplay');
            } else {
                notice.show = i18n.get('AirPlay Not Available');
            }
        },
    });
}
