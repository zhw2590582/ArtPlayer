export default class Ads {
    constructor(art) {
        this.art = art;
        const { option } = art;

        this.index = 0;
        this.playing = false;
        this.isEnd = false;
        this.urlCache = option.url;

        if (option.ads.length) {
            this.playing = true;
            this.play(option.ads[this.index]);
        }
    }

    get current() {
        return this.art.option.ads[this.index];
    }

    play(item) {
        const { option, player } = this.art;

        player.url = item.url;
        this.art.emit('ads:start', item);

        this.art.once('video:ended', () => {
            const nextIndex = this.index + 1;
            const nextItem = option.ads[nextIndex];
            if (nextItem) {
                this.index = nextIndex;
                this.play(nextItem);
            } else {
                this.end();
            }
        });
    }

    end() {
        this.playing = false;
        this.isEnd = true;
        this.art.option.url = this.urlCache;
        this.art.emit('ads:end');
    }
}
