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

        const {
            option: { subtitle },
            template: { $subtitle },
        } = art;

        setStyles($subtitle, subtitle.style);

        if (subtitle.url) {
            this.init(subtitle.url);
        }

        if (subtitle.bilingual) {
            addClass($subtitle, 'art-bilingual');
        }
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

    switch(url, opt = {}) {
        const { i18n, notice } = this.art;
        return this.init(url, opt).then((subUrl) => {
            if (opt.name) {
                notice.show = `${i18n.get('Switch subtitle')}: ${opt.name}`;
            }
            this.art.emit('subtitleSwitch', subUrl);
            return subUrl;
        });
    }

    init(url, opt = {}) {
        const {
            notice,
            events: { proxy },
            option: { subtitle },
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

        errorHandle(window.fetch, 'fetch not support');
        return fetch(url)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
                errorHandle(window.TextDecoder, 'TextDecoder not support');
                const decoder = new TextDecoder(opt.encoding || subtitle.encoding);
                const text = decoder.decode(buffer);

                this.art.emit('subtitleLoad', url);
                switch (opt.ext || getExt(url)) {
                    case 'srt':
                        return vttToBlob(srtToVtt(text));
                    case 'ass':
                        return vttToBlob(assToVtt(text));
                    case 'vtt':
                        return vttToBlob(text);
                    default:
                        return url;
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
