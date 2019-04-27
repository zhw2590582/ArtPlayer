import { bilibiliDanmuParseFromUrl } from './bilibiliDanmuParse';
import getDanmuTop from './getDanmuTop';

export default class Danmuku {
    constructor(art, option) {
        this.art = art;
        this.queue = [];
        this.layer = null;
        this.isStop = false;
        this.animationFrameTimer = null;
        art.on('video:play', this.start.bind(this));
        art.on('video:playing', this.start.bind(this));
        art.on('video:pause', this.stop.bind(this));
        art.on('video:waiting', this.stop.bind(this));
        art.on('destroy', this.stop.bind(this));
        this.config(option);
        if (typeof this.option.danmus === 'function') {
            this.option.danmus().then(danmus => {
                danmus.forEach(this.addToQueue.bind(this));
                this.init();
                art.emit('artplayerPluginDanmu:loaded', danmus);
            });
        } else if (typeof this.option.danmus === 'string') {
            bilibiliDanmuParseFromUrl(this.option.danmus).then(danmus => {
                danmus.forEach(this.addToQueue.bind(this));
                this.init();
                art.emit('artplayerPluginDanmu:loaded', danmus);
            });
        } else {
            this.option.danmus.forEach(this.addToQueue.bind(this));
            this.init();
        }
    }

    static get option() {
        return {
            danmus: [],
            speed: 5,
            opacity: 1,
            color: '#fff',
            size: 25,
            maxlength: 50,
            margin: [10, 20],
        };
    }

    static get scheme() {
        return {
            danmus: 'array|function|string',
            speed: 'number',
            opacity: 'number',
            color: 'string',
            size: 'number',
            maxlength: 'number',
            margin: 'array',
        };
    }

    static getRect(ref, key) {
        const result = ref.getBoundingClientRect();
        return key ? result[key] : result;
    }

    config(option) {
        const {
            utils: { clamp },
            validator,
        } = this.art.constructor;
        this.option = Object.assign({}, Danmuku.option, option);
        validator(this.option, Danmuku.scheme);
        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.size = clamp(this.option.size, 12, 30);
        this.option.maxlength = clamp(this.option.maxlength, 10, 100);
        this.option.margin[0] = clamp(this.option.margin[0], 0, 100);
        this.option.margin[1] = clamp(this.option.margin[1], 0, 100);
    }

    init() {
        this.layer = this.art.layers.add({
            name: 'danmu',
            style: {
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
                opacity: this.option.opacity,
            },
        });
    }

    emit(danmu) {
        const { $player } = this.art.template;
        danmu.$ref = this.getDanmuRef();
        danmu.$ref.innerText = danmu.text;
        danmu.$ref.style.fontSize = `${danmu.size || this.option.size}px`;
        const playerWidth = Danmuku.getRect($player, 'width');
        const danmuWidth = Danmuku.getRect(danmu.$ref, 'width');
        danmu.$restWidth = playerWidth + danmuWidth + 5;
        danmu.$restTime = this.option.speed;
        danmu.$lastStartTime = Date.now();
        danmu.$ref.style.color = danmu.color || this.option.color;
        danmu.$ref.style.left = `${playerWidth}px`;
        danmu.$ref.style.top = `${this.getDanmuTop()}px`;
        danmu.$ref.style.transform = `translateX(${-danmu.$restWidth}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = `-webkit-transform ${danmu.$restTime}s linear 0s`;
        if (danmu.border) {
            danmu.$ref.style.border = `1px solid ${danmu.border}`;
        }
        danmu.$state = 'emit';
    }

    static continue(danmu) {
        danmu.$lastStartTime = Date.now();
        danmu.$ref.style.transform = `translateX(${-danmu.$restWidth}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = `-webkit-transform ${danmu.$restTime}s linear 0s`;
        danmu.$state = 'emit';
    }

    suspend(danmu) {
        const { $player } = this.art.template;
        const { left: playerLeft, width: playerWidth } = Danmuku.getRect($player);
        const { left: danmuLeft } = Danmuku.getRect(danmu.$ref);
        danmu.$restTime -= (Date.now() - danmu.$lastStartTime) / 1000;
        const translateX = playerWidth - (danmuLeft - playerLeft) + 5;
        danmu.$ref.style.transform = `translateX(${-translateX}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = '-webkit-transform 0s linear 0s';
        danmu.$state = 'stop';
    }

    addToQueue(danmu) {
        const { notice, player } = this.art;
        if (!danmu.text.trim()) {
            notice('Danmu text cannot be empty');
            return;
        }

        if (danmu.text.length > this.option.maxlength) {
            notice(`The length of the danmu does not exceed ${this.option.maxlength}`);
            return;
        }

        if (typeof danmu.time !== 'number') {
            danmu.time = player.currentTime;
        }

        this.queue.push({
            ...danmu,
            $state: 'wait',
            $ref: null,
            $restTime: 0,
        });
    }

    getDanmuRef() {
        const { $player } = this.art.template;
        const { setStyles, append } = this.art.constructor.utils;
        const playerLeft = Danmuku.getRect($player, 'left');

        const waitDanmu = this.queue.find(danmu => {
            if (danmu.$ref) {
                const { left: danmuLeft, width: danmuWidth } = Danmuku.getRect(danmu.$ref);
                return danmu.$state === 'emit' && playerLeft > danmuLeft + danmuWidth;
            }
            return false;
        });

        if (waitDanmu) {
            waitDanmu.$state = 'wait';
            waitDanmu.$ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
            waitDanmu.$ref.style.transition = '-webkit-transform 0s linear 0s';
            return waitDanmu.$ref;
        }

        const $ref = document.createElement('div');

        setStyles($ref, {
            userSelect: 'none',
            position: 'absolute',
            whiteSpace: 'pre',
            pointerEvents: 'none',
            perspective: '500px',
            display: 'inline-block',
            willChange: 'transform',
            fontFamily: 'SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif',
            fontWeight: 'normal',
            lineHeight: '1.125',
            textShadow:
                'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px',
        });

        append(this.layer.$ref, $ref);
        return $ref;
    }

    getDanmuTop() {
        const { $player } = this.art.template;
        const { left: playerLeft, top: playerTop, height: playerHeight, width: playerWidth } = Danmuku.getRect($player);
        const danmus = this.queue.filter(danmu => danmu.$state === 'emit');

        if (danmus.length === 0) {
            return this.option.margin[0];
        }

        const danmusBySort = danmus
            .map(danmu => {
                const { left: danmuLeft, top: danmuTop, width: danmuWidth, height: danmuHeight } = Danmuku.getRect(
                    danmu.$ref,
                );
                const top = danmuTop - playerTop;
                const left = danmuLeft - playerLeft;
                const right = playerWidth - left - danmuWidth;
                return {
                    top,
                    left,
                    right,
                    height: danmuHeight,
                    width: danmuWidth,
                };
            })
            .sort((prev, next) => {
                return prev.top - next.top;
            });

        danmusBySort.unshift({
            top: 0,
            left: 0,
            right: 0,
            height: this.option.margin[0],
            width: playerWidth,
        });

        danmusBySort.push({
            top: playerHeight - this.option.margin[1],
            left: 0,
            right: 0,
            height: this.option.margin[1],
            width: playerWidth,
        });

        return getDanmuTop(danmusBySort);
    }

    update() {
        const { player } = this.art;
        this.animationFrameTimer = window.requestAnimationFrame(() => {
            if (this.layer && player.playing) {
                this.queue
                    .filter(danmu => {
                        return (
                            player.currentTime + 0.25 >= danmu.time &&
                            danmu.time >= player.currentTime - 0.25 &&
                            danmu.$state === 'wait'
                        );
                    })
                    .forEach(danmu => {
                        this.emit(danmu);
                    });
            }

            if (!this.isStop) {
                this.update();
            }
        });
    }

    stop() {
        this.isStop = true;
        this.queue
            .filter(danmu => danmu.$state === 'emit')
            .forEach(danmu => {
                this.suspend(danmu);
            });
        window.cancelAnimationFrame(this.animationFrameTimer);
        this.art.emit('artplayerPluginDanmu:stop');
    }

    start() {
        this.isStop = false;
        this.queue
            .filter(danmu => danmu.$state === 'stop')
            .forEach(danmu => {
                Danmuku.continue(danmu);
            });
        this.update();
        this.art.emit('artplayerPluginDanmu:start');
    }

    show() {
        this.layer.$ref.style = 'none';
        this.art.emit('artplayerPluginDanmu:show');
    }

    hide() {
        this.layer.$ref.style = 'block';
        this.art.emit('artplayerPluginDanmu:hide');
    }
}
