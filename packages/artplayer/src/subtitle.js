import {
    setStyle,
    setStyles,
    srtToVtt,
    vttToBlob,
    getExt,
    assToVtt,
    addClass,
    escape,
    removeClass,
    hasClass,
    errorHandle,
} from './utils';
import Component from './utils/component';

export default class Subtitle extends Component {
    constructor(art) {
        super(art);

        this.name = 'subtitle';

        art.once('ready', () => {
            this.init(art.option.subtitle);
        });
    }

    get url() {
        return this.art.template.$track.src;
    }

    get textTrack() {
        return this.art.template.$video.textTracks[0];
    }

    get activeCue() {
        return this.textTrack.activeCues[0];
    }

    get bilingual() {
        const { $subtitle } = this.art.template;
        return hasClass($subtitle, 'art-bilingual');
    }

    set bilingual(val) {
        const { $subtitle } = this.art.template;
        if (val) {
            addClass($subtitle, 'art-bilingual');
        } else {
            removeClass($subtitle, 'art-bilingual');
        }
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
            $subtitle.innerHTML = this.activeCue.text
                .split(/\r?\n/)
                .map((item) => `<p>${escape(item)}</p>`)
                .join('');
            this.art.emit('subtitleUpdate', this.activeCue.text);
        }
    }

    switch(url, newOption = {}) {
        const { i18n, notice, option } = this.art;
        const subtitleOption = { ...option.subtitle, ...newOption, url };
        return this.init(subtitleOption).then((subUrl) => {
            if (newOption.name) {
                notice.show = `${i18n.get('Switch subtitle')}: ${newOption.name}`;
            }
            this.art.emit('subtitleSwitch', subUrl);
            return subUrl;
        });
    }

    init(subtitleOption) {
        if (!subtitleOption.url) return;

        const {
            notice,
            events: { proxy },
            template: { $subtitle, $video, $track },
        } = this.art;

        if (!$track) {
            const $track = document.createElement('track');
            $track.default = true;
            $track.kind = 'metadata';
            $video.appendChild($track);
            this.art.template.$track = $track;
            proxy(this.textTrack, 'cuechange', this.update.bind(this));
        }

        this.style(subtitleOption.style);
        this.bilingual = subtitleOption.bilingual;

        errorHandle(window.fetch, 'fetch not support');
        return fetch(subtitleOption.url)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                errorHandle(window.TextDecoder, 'TextDecoder not support');
                const decoder = new TextDecoder(subtitleOption.encoding);
                const text = decoder.decode(buffer);

                this.art.emit('subtitleLoad', subtitleOption.url);
                switch (subtitleOption.type || getExt(subtitleOption.url)) {
                    case 'srt':
                        return vttToBlob(srtToVtt(text));
                    case 'ass':
                        return vttToBlob(assToVtt(text));
                    case 'vtt':
                        return vttToBlob(text);
                    default:
                        return subtitleOption.url;
                }
            })
            .then((subUrl) => {
                $subtitle.innerHTML = '';
                if (this.url === subUrl) return subUrl;
                URL.revokeObjectURL(this.url);
                this.art.template.$track.src = subUrl;
                return subUrl;
            })
            .catch((err) => {
                notice.show = err;
                throw err;
            });
    }
}
