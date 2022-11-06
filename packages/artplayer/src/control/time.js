import { secondToTime } from '../utils';

export default function time(option) {
    return (art) => ({
        ...option,
        style: {
            cursor: 'auto',
            marginLeft: '10px',
        },
        mounted: ($control) => {
            function getTime() {
                const newTime = `${secondToTime(art.currentTime)} / ${secondToTime(art.duration)}`;
                if (newTime !== $control.innerText) {
                    $control.innerText = newTime;
                }
            }

            getTime();

            const events = ['video:loadedmetadata', 'video:timeupdate', 'video:progress'];
            for (let index = 0; index < events.length; index++) {
                art.on(events[index], getTime);
            }
        },
    });
}
