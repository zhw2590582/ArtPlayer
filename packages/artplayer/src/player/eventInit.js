import config from '../config';
import { sleep, addClass } from '../utils';

export default function eventInit(art, player) {
    const {
        option,
        events: { proxy },
        template: { $player, $video },
        i18n,
        notice,
    } = art;

    let reconnectTime = 0;
    const maxReconnectTime = 5;

    proxy($video, 'click', () => {
        player.toggle = true;
    });

    config.events.forEach((eventName) => {
        proxy($video, eventName, (event) => {
            art.emit(`video:${event.type}`, event);
        });
    });

    // art.on('video:abort', () => {

    // });

    art.on('video:canplay', () => {
        reconnectTime = 0;
        art.loading.show = false;
    });

    art.once('video:canplay', () => {
        art.loading.show = false;
        art.controls.show = true;
        art.mask.show = true;
        art.emit('ready');
    });

    // art.on('video:canplaythrough', () => {

    // });

    // art.on('video:durationchange', () => {

    // });

    // art.on('video:emptied', () => {

    // });

    art.on('video:ended', () => {
        if (option.loop) {
            player.seek = 0;
            player.play = true;
            art.controls.show = false;
            art.mask.show = false;
        } else {
            art.controls.show = true;
            art.mask.show = true;
        }
    });

    art.on('video:error', () => {
        if (reconnectTime < maxReconnectTime) {
            sleep(1000).then(() => {
                reconnectTime += 1;
                player.url = option.url;
                notice.show = `${i18n.get('Reconnect')}: ${reconnectTime}`;
            });
        } else {
            art.loading.show = false;
            art.controls.show = false;
            addClass($player, 'art-error');
            sleep(1000).then(() => {
                notice.show = i18n.get('Video load failed');
                art.destroy(false);
            });
        }
    });

    // art.on('video:loadeddata', () => {

    // });

    art.once('video:loadedmetadata', () => {
        player.autoSize = option.autoSize;
        if (art.isMobile) {
            art.loading.show = false;
            art.controls.show = true;
            art.mask.show = true;
            art.emit('ready');
        }
    });

    art.on('video:loadstart', () => {
        art.loading.show = true;
    });

    art.on('video:pause', () => {
        art.controls.show = true;
        art.mask.show = true;
    });

    art.on('video:play', () => {
        art.mask.show = false;
    });

    art.on('video:playing', () => {
        art.mask.show = false;
    });

    // art.on('video:progress', () => {

    // });

    // art.on('video:ratechange', () => {

    // });

    art.on('video:seeked', () => {
        art.loading.show = false;
    });

    art.on('video:seeking', () => {
        art.loading.show = true;
    });

    // art.on('video:stalled', () => {

    // });

    // art.on('video:suspend', () => {

    // });

    art.on('video:timeupdate', () => {
        art.mask.show = false;
    });

    // art.on('video:volumechange', () => {

    // });

    art.on('video:waiting', () => {
        art.loading.show = true;
    });
}
