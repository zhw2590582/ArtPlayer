export default class Danmuku {
    constructor(art, option = {}) {
        this.art = art;
        this.option = {};
        this.config(option);
        this.current = [];
        this.layer = {};
        this.isStop = false;
        this.init();
    }

    static get option() {
        return {
            danmu: [],
            speed: 5,
            opacity: 1,
            color: '#fff',
            size: 14,
        };
    }

    static get scheme() {
        return {
            danmu: {
                type: 'array',
                child: {
                    text: 'string',
                    size: 'number',
                    time: 'number',
                    color: 'string',
                    mode: 'number',
                },
            },
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

        this.art.on('video:timeupdate', this.update.bind(this));
        this.art.on('video:play', this.start.bind(this));
        this.art.on('video:pause', this.stop.bind(this));
        this.art.on('video:ended', this.stop.bind(this));
        this.art.on('destroy', this.stop.bind(this));
    }

    emit(danmu) {
        const { errorHandle } = this.art.constructor.utils;
        errorHandle(danmu.text.trim(), 'Danmu text cannot be empty');
        const { clientWidth: playerWidth, clientHeight: playerHeight } = this.art.template.$player;
        const danmuItem = this.getDanmuItem();
        danmuItem.$ref.innerText = danmu.text;
        danmuItem.$ref.style.fontSize = danmu.size || this.option.size;
        const { clientWidth: danmuWidth, clientHeight: danmuHeight } = danmuItem.$ref;
        danmuItem.$ref.style.opacity = danmu.opacity || this.option.opacity;
        danmuItem.$ref.style.color = danmu.color || this.option.color;
        danmuItem.$ref.style.top = this.getDanmuTop(playerHeight, danmuHeight);
        danmuItem.$ref.style.left = `${playerWidth}px`;
        danmuItem.$ref.style.transform = `translateX(${-playerWidth - danmuWidth}px) translateY(0px) translateZ(0px)`;
        danmuItem.$ref.style.transition = `-webkit-transform ${danmu.speed || this.option.speed}s linear 0s`;
        this.art.emit('artplayerPluginDanmu:emit', danmu);
    }

    getDanmuItem() {
        const { setStyles, append } = this.art.constructor.utils;
        const inactiveItem = this.current.find(item => item.state === 'inactive');
        if (inactiveItem) return inactiveItem;
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
        return {
            state: 'active',
            $ref: append(this.layer.$ref, $ref),
        };
    }

    getDanmuTop(playerHeight, danmuHeight) {
        return 0;
    }

    update() {
        if (!this.isStop && this.option.danmu.length) {
            // 播放速度
        }
    }

    config(option) {
        this.option = Object.assign({}, Danmuku.option, option);
        this.art.constructor.validator(this.option, Danmuku.scheme);
    }

    stop() {
        this.isStop = true;
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
