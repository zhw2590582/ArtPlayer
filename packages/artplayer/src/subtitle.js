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
        this.option = null;
        this.destroyEvent = () => null;
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
        return this.art.template.$video?.textTracks?.[0];
    }

    get activeCues() {
        if (!this.textTrack) return [];
        return Array.from(this.textTrack.activeCues);
    }

    get cues() {
        if (!this.textTrack) return [];
        return Array.from(this.textTrack.cues);
    }

    style(key, value) {
        const { $subtitle } = this.art.template;
        if (typeof key === 'object') {
            return setStyles($subtitle, key);
        }
        return setStyle($subtitle, key, value);
    }

    update() {
        const {
            option: { subtitle },
            template: { $subtitle },
        } = this.art;

        $subtitle.innerHTML = '';
        if (!this.activeCues.length) return;

        this.art.emit('subtitleBeforeUpdate', this.activeCues);
        $subtitle.innerHTML = this.activeCues
            .map((cue, index) =>
                cue.text
                    .split(/\r?\n/)
                    .filter((line) => line.trim())
                    .map(
                        (line) =>
                            `<div class="art-subtitle-line" data-group="${index}">
                                ${subtitle.escape ? escape(line) : line}
                            </div>`,
                    )
                    .join(''),
            )
            .join('');
        this.art.emit('subtitleAfterUpdate', this.activeCues);
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
        const { template, proxy, option } = this.art;
        const { $video, $track } = template;

        const $newTrack = createElement('track');
        $newTrack.default = true;
        $newTrack.kind = kind;
        $newTrack.src = url;
        $newTrack.label = option.subtitle.name || 'Artplayer';
        $newTrack.track.mode = 'hidden';
        $newTrack.onload = () => {
            this.art.emit('subtitleLoad', this.cues, this.option);
        };

        this.art.events.remove(this.destroyEvent);
        $track.onload = null;
        remove($track);
        append($video, $newTrack);
        template.$track = $newTrack;
        this.destroyEvent = proxy(this.textTrack, 'cuechange', () => this.update());
    }

    async init(subtitleOption) {
        const {
            notice,
            template: { $subtitle },
        } = this.art;

        if (!this.textTrack) return null;
        validator(subtitleOption, scheme.subtitle);
        if (!subtitleOption.url) return;
        this.option = subtitleOption;
        this.style(subtitleOption.style);

        return fetch(subtitleOption.url)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                const decoder = new TextDecoder(subtitleOption.encoding);
                const text = decoder.decode(buffer);
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
                return subUrl;
            })
            .catch((err) => {
                $subtitle.innerHTML = '';
                notice.show = err;
                throw err;
            });
    }
}
