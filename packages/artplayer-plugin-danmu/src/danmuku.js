export default class Danmuku {
    constructor(art, option) {
        this.art = art;
        this.option = {};
        this.config(option);
        this.current = [];
        this.layer = null;
        this.isStop = false;
        this.init();
    }

    static get option() {
        return {
            danmu: [],
            speed: 3,
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
    }

    emit(danmu) {
        const { errorHandle, setStyles, append } = this.art.constructor.utils;
        errorHandle(danmu.text, 'Danmu text cannot be empty');
        errorHandle(danmu.time, 'Danmu time cannot be empty');
        const $danmu = document.createElement('div');
        $danmu.innerText = danmu.text;
        setStyles($danmu, {
            userSelect: 'none',
            position: 'absolute',
            whiteSpace: 'pre',
            pointerEvents: 'none',
            perspective: '500px',
            display: 'inline-block',
            willChange: 'transform',
            fontSize: `${danmu.size || 14}px`,
            color: danmu.color || '#fff',
            fontFamily: 'SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif',
            fontWeight: 'normal',
            lineHeight: '1.125',
            opacity: '1',
            textShadow:
                'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px',
            left: '638px',
            top: '0px',
            transform: 'translateX(-626.14px) translateY(0px) translateZ(0px)',
            transition: '-webkit-transform 0s linear 0s',
        });
        this.current.push(append(this.layer.$ref, $danmu));
        this.art.emit('artplayerPluginDanmu:emit', danmu);
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
