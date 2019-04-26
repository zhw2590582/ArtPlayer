export default class Danmuku {
    constructor(art, option = {}) {
        this.art = art;
        this.queue = {};
        this.current = [];
        this.layer = {};
        this.isStop = false;
        this.timer = null;
        this.option = Object.assign({}, Danmuku.option, option);
        art.constructor.validator(this.option, Danmuku.scheme);
        if (typeof this.option.danmus === 'function') {
            this.option.danmus().then(danmus => {
                danmus.forEach(this.emit);
                this.init();
            });
        } else {
            this.option.danmus.forEach(this.emit);
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
        };
    }

    static get scheme() {
        return {
            danmus: 'array|function',
            speed: 'number',
            opacity: 'number',
            color: 'string',
            size: 'number',
        };
    }

    init() {
        const { layers } = this.art;
        this.layer = layers.add({
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
            },
        });

        this.update();
        this.art.on('video:play', this.start.bind(this));
        this.art.on('video:pause', this.stop.bind(this));
        this.art.on('video:ended', this.stop.bind(this));
        this.art.on('destroy', this.stop.bind(this));
    }

    emit(danmu = {}) {
        const { errorHandle } = this.art.constructor.utils;
        errorHandle(danmu.text, 'Danmu text cannot be empty');
        errorHandle(danmu.time, 'Danmu time cannot be empty');
        if (this.queue[danmu.time]) {
            this.queue[danmu.time].push(danmu);
        } else {
            this.queue[danmu.time] = [danmu];
        }
        // this.art.emit('artplayerPluginDanmu:emit', danmu);
        // if (!this.isStop) {
        //     const { clientWidth: playerWidth, clientHeight: playerHeight } = this.art.template.$player;
        //     const danmuItem = this.getDanmuItem();
        //     danmuItem.$ref.innerText = danmu.text;
        //     danmuItem.$ref.style.fontSize = danmu.size || this.option.size;
        //     const { clientWidth: danmuWidth, clientHeight: danmuHeight } = danmuItem.$ref;
        //     danmuItem.$ref.style.opacity = danmu.opacity || this.option.opacity;
        //     danmuItem.$ref.style.color = danmu.color || this.option.color;
        //     danmuItem.$ref.style.top = this.getDanmuTop(playerHeight, danmuHeight);
        //     danmuItem.$ref.style.left = `${playerWidth}px`;
        //     danmuItem.$ref.style.transform = `translateX(${-playerWidth -
        //         danmuWidth}px) translateY(0px) translateZ(0px)`;
        //     danmuItem.$ref.style.transition = `-webkit-transform ${danmu.speed || this.option.speed}s linear 0s`;
        //     this.art.emit('artplayerPluginDanmu:emit', danmu);
        // }
    }

    getDanmuItem() {
        const { setStyles, append } = this.art.constructor.utils;
        const inactiveItem = this.current.find(item => item.state === 'inactive');
        if (inactiveItem) {
            inactiveItem.time = Date.now();
            inactiveItem.$ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
            inactiveItem.$ref.style.transition = '-webkit-transform 0s linear 0s';
            return inactiveItem;
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

        return this.current.push({
            state: 'active',
            time: Date.now(),
            $ref: append(this.layer.$ref, $ref),
        });
    }

    getDanmuTop(playerHeight, danmuHeight) {
        return 0;
    }

    update() {
        const {
            template: { $player },
            player,
        } = this.art;
        this.timer = window.requestAnimationFrame(() => {
            this.current.forEach(item => {
                if (Date.now() - item.time >= this.option.speed) {
                    item.state = 'inactive';
                }
            });

            Object.keys(this.queue).filter(time => {
                return player.currentTime + 0.5 >= time && time >= player.currentTime - 0.5;
            }).reduce((result, key) => {
                return result.concat(this.queue[key]);
            }, []).forEach(item => {
                console.log(item);
            });

            if (!this.isStop && player.playing) {
                this.update();
            }
        });
    }

    stop() {
        this.isStop = true;
        window.cancelAnimationFrame(this.timer);
        this.art.emit('artplayerPluginDanmu:stop');
    }

    start() {
        this.isStop = false;
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
