import { errorHandle, setStyles, setStyle, srtToVtt, vttToBlob } from './utils';

export default class Subtitle {
    constructor(art) {
        this.art = art;
        this.state = true;
        const { url } = this.art.option.subtitle;
        if (url) {
            this.init();
        }
    }

    init() {
        const {
            events: { proxy },
            option: { subtitle },
            template: { $video, $subtitle },
        } = this.art;

        setStyles($subtitle, subtitle.style || {});
        const $track = document.createElement('track');
        $track.default = true;
        $track.kind = 'metadata';
        $video.appendChild($track);
        this.art.template.$track = $track;
        this.load(subtitle.url).then(url => {
            $track.src = url;
            this.art.emit('subtitle:load', url);
            if ($video.textTracks && $video.textTracks[0]) {
                const [track] = $video.textTracks;
                proxy(track, 'cuechange', () => {
                    const [cue] = track.activeCues;
                    $subtitle.innerHTML = '';
                    if (cue) {
                        const template = document.createElement('div');
                        template.appendChild(cue.getCueAsHTML());
                        $subtitle.innerHTML = template.innerHTML
                            .split(/\r?\n/)
                            .map(item => `<p>${item}</p>`)
                            .join('');
                    }
                    this.art.emit('subtitle:update', $subtitle);
                });
            }
        });
    }

    load(url) {
        const { notice } = this.art;
        let type;
        return fetch(url)
            .then(response => {
                type = response.headers.get('Content-Type');
                return response.text();
            })
            .then(text => {
                let vttUrl = '';
                if (/x-subrip/gi.test(type)) {
                    vttUrl = vttToBlob(srtToVtt(text));
                } else {
                    vttUrl = url;
                }
                return vttUrl;
            })
            .catch(err => {
                notice.show(err);
                console.warn(err);
            });
    }

    show() {
        const {
            template: { $subtitle },
            i18n,
            notice,
        } = this.art;
        setStyle($subtitle, 'display', 'block');
        this.state = true;
        notice.show(i18n.get('Show subtitle'));
        this.art.emit('subtitle:show', $subtitle);
    }

    hide() {
        const {
            template: { $subtitle },
            i18n,
            notice,
        } = this.art;
        
        setStyle($subtitle, 'display', 'none');
        this.state = false;
        notice.show(i18n.get('Hide subtitle'));
        this.art.emit('subtitle:hide', $subtitle);
    }

    toggle() {
        if (this.state) {
            this.hide();
        } else {
            this.show();
        }
    }

    switch(url) {
        const { $track } = this.art.template;
        errorHandle($track, 'You need to initialize the subtitle option first.');
        this.load(url).then(url => {
            $track.src = url;
            this.art.emit('subtitle:switch', url);
        });
    }
}
