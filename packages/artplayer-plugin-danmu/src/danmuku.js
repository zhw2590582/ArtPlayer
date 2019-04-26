export default class Danmuku {
    constructor(art, option = {}) {
        this.art = art;
        this.queue = [];
        this.layer = null;
        this.isStop = false;
        this.timer = null;
        this.option = Object.assign({}, Danmuku.option, option);
        art.constructor.validator(this.option, Danmuku.scheme);
        art.on('video:play', this.start.bind(this));
        art.on('video:pause', this.stop.bind(this));
        art.on('destroy', this.stop.bind(this));
        if (typeof this.option.danmus === 'function') {
            this.option.danmus().then(danmus => {
                art.emit('artplayerPluginDanmu:loaded', danmus);
                danmus.forEach(this.addToQueue.bind(this));
                this.init();
            });
        } else {
            this.option.danmus.forEach(this.addToQueue);
            this.init();
        }
    }

    static get option() {
        return {
            danmus: [],
            speed: 5,
            opacity: 1,
            color: '#fff',
            size: 14,
            maxlength: 50,
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
        };
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
            },
        });
    }

    emit(danmu) {
        const { errorHandle } = this.art.constructor.utils;
        errorHandle(this.layer, 'The danmuku is not ready');
        const { clientWidth: playerWidth, clientHeight: playerHeight } = this.art.template.$player;
        danmu.$ref.innerText = danmu.text;
        danmu.$ref.style.fontSize = `${danmu.size || this.option.size}px`;
        const { clientWidth: danmuWidth, clientHeight: danmuHeight } = danmu.$ref;
        danmu.$ref.style.opacity = danmu.opacity || this.option.opacity;
        danmu.$ref.style.color = danmu.color || this.option.color;
        danmu.$ref.style.top = this.getDanmuTop(playerHeight, danmuHeight);
        danmu.$ref.style.left = `${playerWidth}px`;
        const translateX = -playerWidth - danmuWidth - 10;
        danmu.$ref.style.transform = `translateX(${translateX}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = `-webkit-transform ${danmu.$restTime}s linear 0s`;
    }

    continue(danmu) {
        danmu.$ref.style.transform = `translateX(${translateX}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = `-webkit-transform ${danmu.$restTime}s linear 0s`;
    }

    addToQueue(danmu) {
        const { errorHandle } = this.art.constructor.utils;
        errorHandle(danmu.text, 'Danmu text cannot be empty');
        errorHandle(typeof danmu.time === 'number', 'Danmu time cannot be empty');
        errorHandle(
            danmu.text.length <= this.option.maxlength,
            `The length of the danmu does not exceed ${this.option.maxlength}`,
        );
        this.queue.push({
            ...danmu,
            $state: 'wait',
            $ref: null,
            $restTime: 0,
            $lastPlayTime: 0,
        });
    }

    getDanmuRef() {
        const { $player } = this.art.template;
        const { setStyles, append } = this.art.constructor.utils;
        const playerLeft = $player.getBoundingClientRect().left;

        const waitDanmu = this.queue.find(danmu => {
            if (danmu.$ref) {
                const { left, width } = danmu.$ref.getBoundingClientRect();
                return playerLeft >= left + width;
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

    getDanmuTop(playerHeight, danmuHeight) {
        return 0;
    }

    changeState(before, after) {
        return this.queue
            .filter(danmu => danmu.$state === before)
            .map(danmu => {
                danmu.$state = after;
                return danmu;
            });
    }

    update() {
        const { player } = this.art;
        this.timer = window.requestAnimationFrame(() => {
            this.queue
                .filter(danmu => {
                    return (
                        player.currentTime + 0.25 >= danmu.time &&
                        danmu.time >= player.currentTime - 0.25 &&
                        danmu.$state === 'wait'
                    );
                })
                .map(danmu => {
                    danmu.$lastPlayTime = Date.now();
                    danmu.$restTime = this.option.speed;
                    danmu.$ref = this.getDanmuRef();
                    danmu.$state = 'emit';
                    return danmu;
                })
                .forEach(danmu => {
                    this.emit(danmu);
                });

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
                danmu.$state = 'stop';
                danmu.$restTime -= Date.now() - danmu.$lastPlayTime;
            });
        window.cancelAnimationFrame(this.timer);
        this.art.emit('artplayerPluginDanmu:stop');
    }

    start() {
        this.isStop = false;
        this.queue
            .filter(danmu => danmu.$state === 'stop')
            .forEach(danmu => {
                danmu.$state = 'emit';
                danmu.$lastPlayTime = Date.now();
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
