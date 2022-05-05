import { bilibiliDanmuParseFromUrl } from './bilibili';
import getDanmuTop from './getDanmuTop';

export default class Danmuku {
    constructor(art, option) {
        const { constructor, template } = art;

        this.utils = constructor.utils;
        this.validator = constructor.validator;
        this.$danmuku = template.$danmuku;
        this.$player = template.$player;

        this.art = art;
        this.queue = [];
        this.option = {};
        this.$refs = [];
        this.isStop = false;
        this.isHide = false;
        this.timer = null;
        this.config(option);

        if (this.option.useWorker) {
            try {
                this.worker = new Worker(new URL('data-url:./worker.js', import.meta.url));
            } catch (error) {
                //
            }
        }

        art.on('video:play', this.start.bind(this));
        art.on('video:playing', this.start.bind(this));
        art.on('video:pause', this.stop.bind(this));
        art.on('video:waiting', this.stop.bind(this));
        art.on('fullscreen', this.reset.bind(this));
        art.on('fullscreenWeb', this.reset.bind(this));
        art.on('destroy', this.stop.bind(this));

        this.load();
    }

    static get option() {
        return {
            danmuku: [],
            speed: 5,
            margin: [10, 100],
            opacity: 1,
            fontSize: 25,
            filter: () => true,
            antiOverlap: true,
            useWorker: true,
            synchronousPlayback: false,
        };
    }

    static get scheme() {
        return {
            danmuku: 'array|function|string',
            speed: 'number',
            margin: 'array',
            opacity: 'number',
            fontSize: 'number',
            filter: 'function',
            antiOverlap: 'boolean',
            useWorker: 'boolean',
            synchronousPlayback: 'boolean',
        };
    }

    get isRotate() {
        return this.art.plugins.autoOrientation && this.art.plugins.autoOrientation.state;
    }

    get marginTop() {
        const { clamp } = this.utils;
        const value = this.option.margin[0];
        const { clientHeight } = this.$player;

        if (typeof value === 'number') {
            return clamp(value, 0, clientHeight);
        }

        if (typeof value === 'string' && value.endsWith('%')) {
            const ratio = parseFloat(value) / 100;
            return clamp(clientHeight * ratio, 0, clientHeight);
        }

        return Danmuku.option.margin[0];
    }

    get marginBottom() {
        const { clamp } = this.utils;
        const value = this.option.margin[1];
        const { clientHeight } = this.$player;

        if (typeof value === 'number') {
            return clamp(value, 0, clientHeight);
        }

        if (typeof value === 'string' && value.endsWith('%')) {
            const ratio = parseFloat(value) / 100;
            return clamp(clientHeight * ratio, 0, clientHeight);
        }

        return Danmuku.option.margin[1];
    }

    filter(state, callback) {
        return this.queue.filter((danmu) => danmu.$state === state).map(callback);
    }

    getLeft($ref) {
        const rect = $ref.getBoundingClientRect();
        return this.isRotate ? rect.top : rect.left;
    }

    getRef() {
        const $refCache = this.$refs.pop();
        if ($refCache) return $refCache;

        const $ref = document.createElement('div');

        $ref.style.cssText = `
            user-select: none;
            position: absolute;
            white-space: pre;
            pointer-events: none;
            perspective: 500px;
            display: inline-block;
            will-change: transform;
            font-weight: normal;
            line-height: 1.125;
            visibility: hidden;
            font-family: SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif;
            text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;
        `;

        return $ref;
    }

    getReady() {
        const { currentTime } = this.art;
        return this.queue.filter((danmu) => {
            return (
                danmu.$state === 'ready' ||
                (danmu.$state === 'wait' && currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1)
            );
        });
    }

    getEmits() {
        const result = [];
        const { clientWidth } = this.$player;
        const clientLeft = this.getLeft(this.$player);

        this.filter('emit', (danmu) => {
            const top = danmu.$ref.offsetTop;
            const left = this.getLeft(danmu.$ref) - clientLeft;
            const height = danmu.$ref.clientHeight;
            const width = danmu.$ref.clientWidth;
            const distance = left + width;
            const right = clientWidth - distance;
            const speed = distance / danmu.$restTime;

            const emit = {};
            emit.top = top;
            emit.left = left;
            emit.height = height;
            emit.width = width;
            emit.right = right;
            emit.speed = speed;
            emit.distance = distance;
            emit.time = danmu.$restTime;
            emit.mode = danmu.mode;

            result.push(emit);
        });

        return result;
    }

    postMessage(message = {}) {
        return new Promise((resolve) => {
            if (this.option.useWorker && this.worker && this.worker.postMessage) {
                message.id = Date.now();
                this.worker.postMessage(message);
                this.worker.onmessage = (event) => {
                    const { data } = event;
                    if (data.id === message.id) {
                        resolve(data);
                    }
                };
            } else {
                const top = getDanmuTop(message);
                resolve({ top });
            }
        });
    }

    async load() {
        try {
            let danmus = [];
            if (typeof this.option.danmuku === 'function') {
                danmus = await this.option.danmuku();
            } else if (typeof this.option.danmuku.then === 'function') {
                danmus = await this.option.danmuku;
            } else if (typeof this.option.danmuku === 'string') {
                danmus = await bilibiliDanmuParseFromUrl(this.option.danmuku);
            } else {
                danmus = this.option.danmuku;
            }

            this.utils.errorHandle(Array.isArray(danmus), 'Danmuku need return an array as result');
            this.art.emit('artplayerPluginDanmuku:loaded', danmus);

            this.queue = [];
            this.$danmuku.innerText = '';
            danmus.forEach((danmu) => this.emit(danmu));
        } catch (error) {
            this.art.emit('artplayerPluginDanmuku:error', error);
            throw error;
        }

        return this;
    }

    config(option) {
        const { clamp } = this.utils;

        this.option = Object.assign({}, Danmuku.option, this.option, option);
        this.validator(this.option, Danmuku.scheme);
        if (option.fontSize) this.reset();

        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.fontSize = clamp(this.option.fontSize, 12, 100);

        this.art.emit('artplayerPluginDanmuku:config', this.option);

        return this;
    }

    makeWait(danmu) {
        danmu.$state = 'wait';
        if (danmu.$ref) {
            danmu.$ref.style.visibility = 'hidden';
            danmu.$ref.style.marginLeft = '0px';
            danmu.$ref.style.transform = 'translateX(0px)';
            danmu.$ref.style.transition = 'transform 0s linear 0s';
            this.$refs.push(danmu.$ref);
            danmu.$ref = null;
        }
    }

    continue() {
        const { clientWidth } = this.$player;
        this.filter('stop', (danmu) => {
            danmu.$state = 'emit';
            danmu.$lastStartTime = Date.now();
            switch (danmu.mode) {
                case 0: {
                    const translateX = clientWidth + danmu.$ref.clientWidth;
                    danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                    danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
                    break;
                }
                default:
                    break;
            }
        });

        return this;
    }

    suspend() {
        const { clientWidth } = this.$player;
        this.filter('emit', (danmu) => {
            danmu.$state = 'stop';
            switch (danmu.mode) {
                case 0: {
                    const translateX = clientWidth - (this.getLeft(danmu.$ref) - this.getLeft(this.$player));
                    danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                    danmu.$ref.style.transition = 'transform 0s linear 0s';
                    break;
                }
                default:
                    break;
            }
        });

        return this;
    }

    reset() {
        this.queue.forEach((danmu) => this.makeWait(danmu));
        return this;
    }

    update() {
        this.timer = window.requestAnimationFrame(async () => {
            if (this.art.playing && !this.isHide) {
                this.filter('emit', (danmu) => {
                    const emitTime = (Date.now() - danmu.$lastStartTime) / 1000;
                    danmu.$restTime -= emitTime;
                    danmu.$lastStartTime = Date.now();
                    if (danmu.$restTime <= 0) {
                        this.makeWait(danmu);
                    }
                });

                const readys = this.getReady();
                const { clientWidth, clientHeight } = this.$player;
                for (let index = 0; index < readys.length; index++) {
                    const danmu = readys[index];
                    danmu.$ref = this.getRef();
                    danmu.$ref.innerText = danmu.text;
                    this.$danmuku.appendChild(danmu.$ref);

                    danmu.$ref.style.left = `${clientWidth}px`;
                    danmu.$ref.style.opacity = this.option.opacity;
                    danmu.$ref.style.fontSize = `${this.option.fontSize}px`;
                    danmu.$ref.style.color = danmu.color || '#fff';
                    danmu.$ref.style.border = danmu.border ? `1px solid ${danmu.color || '#fff'}` : 'none';
                    danmu.$ref.style.marginLeft = '0px';

                    danmu.$lastStartTime = Date.now();
                    danmu.$restTime =
                        this.option.synchronousPlayback && this.art.playbackRate
                            ? this.option.speed / Number(this.art.playbackRate)
                            : this.option.speed;

                    const target = {
                        mode: danmu.mode,
                        height: danmu.$ref.clientHeight,
                        speed: (clientWidth + danmu.$ref.clientWidth) / danmu.$restTime,
                    };

                    const { top } = await this.postMessage({
                        target,
                        emits: this.getEmits(),
                        antiOverlap: this.option.antiOverlap,
                        clientWidth: clientWidth,
                        clientHeight: clientHeight,
                        marginBottom: this.marginBottom,
                        marginTop: this.marginTop,
                    });

                    if (danmu.$ref) {
                        if (!this.isStop && top !== undefined) {
                            danmu.$state = 'emit';
                            danmu.$ref.style.visibility = 'visible';

                            switch (danmu.mode) {
                                case 0: {
                                    danmu.$ref.style.top = `${top}px`;
                                    const translateX = clientWidth + danmu.$ref.clientWidth;
                                    danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                                    danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
                                    break;
                                }
                                case 1:
                                    danmu.$ref.style.left = '50%';
                                    danmu.$ref.style.top = `${top}px`;
                                    danmu.$ref.style.marginLeft = `-${danmu.$ref.clientWidth / 2}px`;
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            danmu.$state = 'ready';
                            this.$refs.push(danmu.$ref);
                            danmu.$ref = null;
                        }
                    }
                }
            }

            if (!this.isStop) {
                this.update();
            }
        });
        return this;
    }

    stop() {
        this.isStop = true;
        this.suspend();
        window.cancelAnimationFrame(this.timer);
        this.art.emit('artplayerPluginDanmuku:stop');
        return this;
    }

    start() {
        this.isStop = false;
        this.continue();
        this.update();
        this.art.emit('artplayerPluginDanmuku:start');
        return this;
    }

    show() {
        this.isHide = false;
        this.start();
        this.$danmuku.style.display = 'block';
        this.art.emit('artplayerPluginDanmuku:show');
        return this;
    }

    hide() {
        this.isHide = true;
        this.stop();
        this.queue.forEach((item) => this.makeWait(item));
        this.$danmuku.style.display = 'none';
        this.art.emit('artplayerPluginDanmuku:hide');
        return this;
    }

    emit(danmu) {
        this.validator(danmu, {
            text: 'string',
            mode: 'number|undefined',
            color: 'string|undefined',
            time: 'number|undefined',
            border: 'boolean|undefined',
        });

        if (!danmu.text.trim()) return this;
        if (!this.option.filter(danmu)) return this;

        if (danmu.time) {
            danmu.time = this.utils.clamp(danmu.time, 0, Infinity);
        } else {
            danmu.time = this.art.currentTime + 1;
        }

        this.queue.push({
            mode: 0,
            ...danmu,
            $state: 'wait',
            $ref: null,
            $restTime: 0,
            $lastStartTime: 0,
        });

        return this;
    }
}
