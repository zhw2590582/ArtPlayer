import Artplayer from '../packages/artplayer';
import { type Option } from '../packages/artplayer/types/option';

const option: Option = {
    container: '.artplayer-app',
    url: './assets/sample/video.mp4',
};

option.volume = 0.5;

const art = new Artplayer(option);
