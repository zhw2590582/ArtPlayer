import { setStyles, srtToVtt, vttToBlob, getExt, assToVtt } from './utils';
import Component from './utils/component';

export default class Subtitle extends Component {
    constructor(art) {
        super(art);

        const {
            events: { proxy },
            option: { subtitle },
            template: { $subtitle },
        } = art;

        setStyles($subtitle, subtitle.style);
        proxy(this.textTrack, 'cuechange', this.update.bind(this));

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
                .map(item => `<p>${item}</p>`)
                .join('');
            this.art.emit('subtitle:update', this.activeCue.text);
        }
    }

    switch(url, name) {
        const { i18n, notice } = this.art;
        return this.init(url).then(subUrl => {
            if (name) {
                notice.show(`${i18n.get('Switch subtitle')}: ${name}`);
            }
            this.art.emit('subtitle:switch', subUrl);
            return subUrl;
        });
    }

    init(url) {
        const {
            notice,
            template: { $subtitle, $track },
        } = this.art;

        return fetch(url)
            .then(response => {
                return response.text();
            })
            .then(text => {
                this.art.emit('subtitle:load', url);
                switch (getExt(url)) {
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
            .then(subUrl => {
                $subtitle.innerHTML = '';
                if (this.url === subUrl) return subUrl;
                URL.revokeObjectURL(this.url);
                $track.src = subUrl;
                return subUrl;
            })
            .catch(err => {
                notice.show(err);
                this.art.emit('subtitle:err', err);
                throw err;
            });
    }
}
