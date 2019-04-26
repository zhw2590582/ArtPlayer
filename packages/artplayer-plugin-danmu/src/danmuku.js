export default class Danmuku {
    constructor(art, option = {}) {
        this.art = art;
        this.queue = [];
        this.layer = null;
        this.isStop = false;
        this.animationFrameTimer = null;
        this.option = Object.assign({}, Danmuku.option, option);
        art.constructor.validator(this.option, Danmuku.scheme);
        art.on('video:play', this.start.bind(this));
        art.on('video:playing', this.start.bind(this));
        art.on('video:pause', this.stop.bind(this));
        art.on('video:waiting', this.stop.bind(this));
        art.on('destroy', this.stop.bind(this));
        if (typeof this.option.danmus === 'function') {
            this.option.danmus().then(danmus => {
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
            danmus: 'array|function',
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
        const playerHeight = Danmuku.getRect($player, 'height');
        const danmus = this.queue.filter(danmu => danmu.$state === 'emit');
        if (danmus.length === 0) {
            return this.option.margin[0];
        }

        if (danmus.length === 1) {
            return this.option.margin[0] + Danmuku.getRect(danmus[0].$ref, 'height');
        }

        return 0;
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
