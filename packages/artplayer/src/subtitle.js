import { setStyles, srtToVtt, vttToBlob, getExt, assToVtt, escape } from './utils';
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

    switch(url, name, ext) {
        const { i18n, notice } = this.art;
        return this.init(url, ext).then((subUrl) => {
            if (name) {
                notice.show = `${i18n.get('Switch subtitle')}: ${name}`;
            }
            this.art.emit('subtitleSwitch', subUrl);
            return subUrl;
        });
    }

    init(url, ext) {
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

        return fetch(url)
            .then((response) => response.text())
            .then((text) => {
                this.art.emit('subtitleLoad', url);
                switch (ext || getExt(url)) {
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
