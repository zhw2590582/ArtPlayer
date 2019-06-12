import { setStyles, srtToVtt, vttToBlob } from './utils';

export default class Subtitle {
    constructor(art) {
        this.art = art;
        this.state = true;
        const { url } = this.art.option.subtitle;
        if (url) {
            this.init(url);
        }
    }

    init(url) {
        const {
            events: { proxy },
            option: { subtitle },
            template: { $video, $subtitle, $track },
        } = this.art;

        setStyles($subtitle, subtitle.style || {});

        if (!$track) {
            const $newTrack = document.createElement('track');
            $newTrack.default = true;
            $newTrack.kind = 'metadata';
            $video.appendChild($newTrack);
            this.art.template.$track = $newTrack;
        }

        this.load(url).then(url => {
            this.art.template.$track.src = url;
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

    set show(value) {
        const { $player } = this.art.template;
        if (value) {
            this.state = true;
            $player.classList.remove('artplayer-subtitle-hide');
            this.art.emit('subtitle:show');
        } else {
            this.state = false;
            $player.classList.add('artplayer-subtitle-hide');
            this.art.emit('subtitle:hide');
        }
    }

    toggle() {
        this.show = !this.state;
    }
}
