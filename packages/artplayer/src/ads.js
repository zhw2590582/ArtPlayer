export default class Ads {
    constructor(art) {
        this.art = art;
        const { option } = art;

        this.index = 0;
        this.isEnd = false;
        this.playing = false;
        this.urlCache = option.url;

        if (this.current) {
            this.playing = true;
            this.play(this.current);
        }
    }

    get current() {
        return this.art.option.ads[this.index];
    }

    get prev() {
        return this.art.option.ads[this.index - 1];
    }

    get next() {
        return this.art.option.ads[this.index + 1];
    }

    play(item) {
        this.art.player.switchUrl(item.url);

        this.art.once('video:timeupdate', () => {
            this.art.emit('ads:start', item);
        });

        this.art.once('video:ended', () => {
            const next = this.next;
            if (next) {
                this.index += 1;
                this.play(next);
            } else {
                this.end();
            }
        });
    }

    end() {
        this.isEnd = true;
        this.playing = false;
        this.art.option.url = this.urlCache;
        this.art.player.switchUrl(this.urlCache);
        this.art.emit('ads:end');
    }
}
