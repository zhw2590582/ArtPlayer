import { secondToTime } from '../utils';

export default function time(option) {
    return art => ({
        ...option,
        mounted: $control => {
            function getTime() {
                const newTime = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
                if (newTime !== $control.innerText) {
                    $control.innerText = newTime;
                }
            }

            getTime();
            ['video:loadedmetadata', 'video:timeupdate', 'video:progress'].forEach(event => {
                art.on(event, getTime);
            });
        },
    });
}
