import Artplayer from '../packages/artplayer/types/artplayer';

const art = new Artplayer(
    {
        container: '.artplayer-app',
        url: './assets/sample/video.mp4',
    },
    function () {
        this.template.$container;
    },
);

Artplayer.instances.push(0)