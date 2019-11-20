import { setStyles, srtToVtt, vttToBlob, getExt, addClass, removeClass, assToVtt } from './utils';

export default class Subtitle {
    constructor(art) {
        this.art = art;
        this.state = true;

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
        }
        this.art.emit('subtitle:update', this.activeCue.text);
    }

    switch(url, name = 'unknown') {
        const { i18n, notice } = this.art;
        return this.init(url).then(subUrl => {
            notice.show(`${i18n.get('Switch subtitle')}: ${name}`);
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
                throw err;
            });
    }

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            removeClass($player, 'artplayer-subtitle-hide');
            this.art.emit('subtitle:show');
        } else {
            this.state = false;
            addClass($player, 'artplayer-subtitle-hide');
            this.art.emit('subtitle:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
