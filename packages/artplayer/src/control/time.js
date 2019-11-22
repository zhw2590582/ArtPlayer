import { secondToTime } from '../utils';

export default function time(option) {
    return art => ({
        ...option,
        mounted: $control => {
            function getTime() {
                const newTime = `${secondToTime(art.player.currentTime)} / ${secondToTime(art.player.duration)}`;
                if (newTime !== $control.innerHTML) {
                    $control.innerHTML = newTime;
                }
            }

            getTime();
            ['video:loadedmetadata', 'video:timeupdate', 'video:progress'].forEach(event => {
                art.on(event, getTime);
            });
        },
    });
}
