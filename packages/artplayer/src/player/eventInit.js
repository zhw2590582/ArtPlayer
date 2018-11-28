import config from '../config';
import { sleep } from '../utils';

export default function eventInit(art, player) {
    const {
        option,
        events: { proxy },
        template: { $player, $video },
        i18n,
        notice,
    } = art;
    let firstCanplay = false;
    let reconnectTime = 0;
    const maxReconnectTime = 5;
    
    proxy($video, 'click', () => {
        player.toggle();
    });

    config.video.events.forEach(eventName => {
        proxy($video, eventName, event => {
            art.emit(`video:${event.type}`, event);
        });
    });

    art.on('video:abort', () => {
        notice.show(`${i18n.get('Video loading is aborted')}`);
    });

    art.on('video:canplay', () => {
        if (!firstCanplay) {
            firstCanplay = true;
            if (option.autoplay) {
                player.play();
            }
            art.emit('firstCanplay');
        }

        reconnectTime = 0;
        art.controls.show();
        art.mask.show();
        art.loading.hide();
    });

    // art.on('video:canplaythrough', () => {

    // });

    // art.on('video:durationchange', () => {

    // });

    // art.on('video:emptied', () => {

    // });

    art.on('video:ended', () => {
        art.isPlaying = false;
        art.controls.show();
        art.mask.show();
        if (option.loop) {
            player.seek(0);
            player.play();
        }
    });

    art.on('video:error', () => {
        if (reconnectTime < maxReconnectTime) {
            sleep(1000).then(() => {
                reconnectTime += 1;
                player.attachUrl(option.url);
                notice.show(`${i18n.get('Reconnect')}: ${reconnectTime}`);
            });
        } else {
            art.isPlaying = false;
            art.loading.hide();
            art.controls.hide();
            $player.classList.add('artplayer-error');
            sleep(1000).then(() => {
                notice.show(i18n.get('Video load failed'), false);
                art.destroy();
            });
        }
    });

    // art.on('video:loadeddata', () => {
        
    // });

    art.on('video:loadedmetadata', () => {
        if (option.autoSize) {
            player.autoSize();
        }
    });

    art.on('video:loadstart', () => {
        art.loading.show();
    });

    art.on('video:pause', () => {
        art.isPlaying = false;
        art.controls.show();
        art.mask.show();
    });

    art.on('video:play', () => {
        art.isPlaying = true;
        art.controls.hide();
        art.mask.hide();
    });

    art.on('video:playing', () => {
        art.isPlaying = true;
        art.controls.hide();
        art.mask.hide();
    });

    // art.on('video:progress', () => {

    // });

    // art.on('video:ratechange', () => {

    // });

    art.on('video:seeked', () => {
        art.loading.hide();
    });

    art.on('video:seeking', () => {
        art.loading.show();
    });

    // art.on('video:stalled', () => {
        
    // });

    // art.on('video:suspend', () => {
        
    // });

    art.on('video:timeupdate', () => {
        art.isPlaying = true;
        art.controls.hide();
        art.mask.hide();
    });

    // art.on('video:volumechange', () => {
        
    // });

    art.on('video:waiting', () => {
        art.loading.show();
    });
}
