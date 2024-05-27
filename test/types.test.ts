import Artplayer from '../packages/artplayer';

const option: Artplayer['Option'] = {
    container: '.artplayer-app',
    url: './assets/sample/video.mp4',
};

option.volume = 0.5;

const art = new Artplayer(option);
