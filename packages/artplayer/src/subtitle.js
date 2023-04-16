import {
    setStyle,
    setStyles,
    srtToVtt,
    vttToBlob,
    getExt,
    assToVtt,
    escape,
    remove,
    append,
    createElement,
} from './utils';
import Component from './utils/component';
import validator from 'option-validator';
import scheme from './scheme';

export default class Subtitle extends Component {
    constructor(art) {
        super(art);
        this.name = 'subtitle';
        this.eventDestroy = () => null;
        this.init(art.option.subtitle);

        let lastState = false;
        art.on('video:timeupdate', () => {
            if (!this.url) return;
            const state = this.art.template.$video.webkitDisplayingFullscreen;
            if (typeof state !== 'boolean') return;
            if (state !== lastState) {
                lastState = state;
                this.createTrack(state ? 'subtitles' : 'metadata', this.url);
            }
        });
    }

    get url() {
        return this.art.template.$track.src;
    }

    set url(url) {
        this.switch(url);
    }

    get textTrack() {
        return this.art.template.$video.textTracks[0];
    }

    get activeCue() {
        return this.textTrack.activeCues[0];
    }

    style(key, value) {
        const { $subtitle } = this.art.template;
        if (typeof key === 'object') {
            return setStyles($subtitle, key);
        }
        return setStyle($subtitle, key, value);
    }

    update() {
        const { $subtitle } = this.art.template;
        $subtitle.innerHTML = '';
        if (this.activeCue) {
            if (this.art.option.subtitle.escape) {
                $subtitle.innerHTML = this.activeCue.text
                    .split(/\r?\n/)
                    .map((item) => `<p>${escape(item)}</p>`)
                    .join('');
            } else {
                $subtitle.innerHTML = this.activeCue.text;
            }
            this.art.emit('subtitleUpdate', this.activeCue.text);
        }
    }

    async switch(url, newOption = {}) {
        const { i18n, notice, option } = this.art;
        const subtitleOption = { ...option.subtitle, ...newOption, url };
        const subUrl = await this.init(subtitleOption);
        if (newOption.name) {
            notice.show = `${i18n.get('Switch Subtitle')}: ${newOption.name}`;
        }
        return subUrl;
    }

    createTrack(kind, url) {
        const { template, proxy } = this.art;
        const { $video, $track } = template;

        const $newTrack = createElement('track');
        $newTrack.default = true;
        $newTrack.kind = kind;
        $newTrack.src = url;
        $newTrack.track.mode = 'hidden';

        this.eventDestroy();
        remove($track);

        append($video, $newTrack);
        template.$track = $newTrack;
        this.eventDestroy = proxy(this.textTrack, 'cuechange', () => this.update());
    }

    async init(subtitleOption) {
        const {
            notice,
            template: { $subtitle },
        } = this.art;

        validator(subtitleOption, scheme.subtitle);
        if (!subtitleOption.url) return;
        this.style(subtitleOption.style);

        return fetch(subtitleOption.url)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const decoder = new TextDecoder(subtitleOption.encoding);
                const text = decoder.decode(buffer);
                this.art.emit('subtitleLoad', subtitleOption.url);
                switch (subtitleOption.type || getExt(subtitleOption.url)) {
                    case 'srt': {
                        const vtt = srtToVtt(text);
                        const vttNew = subtitleOption.onVttLoad(vtt);
                        return vttToBlob(vttNew);
                    }
                    case 'ass': {
                        const vtt = assToVtt(text);
                        const vttNew = subtitleOption.onVttLoad(vtt);
                        return vttToBlob(vttNew);
                    }
                    case 'vtt': {
                        const vttNew = subtitleOption.onVttLoad(text);
                        return vttToBlob(vttNew);
                    }
                    default:
                        return subtitleOption.url;
                }
            })
            .then((subUrl) => {
                $subtitle.innerHTML = '';
                if (this.url === subUrl) return subUrl;
                URL.revokeObjectURL(this.url);
                this.createTrack('metadata', subUrl);
                this.art.emit('subtitleSwitch', subUrl);
                return subUrl;
            })
            .catch((err) => {
                notice.show = err;
                throw err;
            });
    }
}
