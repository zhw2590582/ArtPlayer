import { bilibiliDanmuParseFromUrl } from './bilibiliDanmuParse';
import getDanmuTop from './getDanmuTop';

export default class Danmuku {
    constructor(art, option) {
        this.art = art;
        this.queue = [];
        this.refs = [];
        this.option = {};
        this.config(option);
        this.isStop = false;
        this.animationFrameTimer = null;
        this.$danmuku = art.template.$danmuku;
        art.i18n.update(Danmuku.i18n);
        art.on('video:play', this.start.bind(this));
        art.on('video:playing', this.start.bind(this));
        art.on('video:pause', this.stop.bind(this));
        art.on('video:waiting', this.stop.bind(this));
        art.on('resize', this.resize.bind(this));
        art.on('destroy', this.stop.bind(this));
        if (typeof this.option.danmuku === 'function') {
            this.option.danmuku().then(danmus => {
                danmus.forEach(this.addToQueue.bind(this));
                art.emit('artplayerPluginDanmuku:loaded');
            });
        } else if (typeof this.option.danmuku === 'string') {
            bilibiliDanmuParseFromUrl(this.option.danmuku).then(danmus => {
                danmus.forEach(this.addToQueue.bind(this));
                art.emit('artplayerPluginDanmuku:loaded');
            });
        } else {
            this.option.danmuku.forEach(this.addToQueue.bind(this));
            art.emit('artplayerPluginDanmuku:loaded');
        }
    }

    static get i18n() {
        return {
            'zh-cn': {
                'Danmu text cannot be empty': '弹幕文本不能为空',
                'The length of the danmu does not exceed': '弹幕文本字数不能超过',
            },
            'zh-tw': {
                'Danmu text cannot be empty': '彈幕文本不能為空',
                'The length of the danmu does not exceed': '彈幕文本字數不能超過',
            },
        };
    }

    static get option() {
        return {
            danmuku: [],
            speed: 5,
            maxlength: 50,
            margin: [10, 100],
            opacity: 1,
            fontSize: 25,
        };
    }

    static get scheme() {
        return {
            danmuku: 'array|function|string',
            speed: 'number',
            maxlength: 'number',
            margin: 'array',
            opacity: 'number',
            fontSize: 'number',
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
        this.option = Object.assign({}, Danmuku.option, this.option, option);
        validator(this.option, Danmuku.scheme);
        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.maxlength = clamp(this.option.maxlength, 10, 100);
        this.option.margin[0] = clamp(this.option.margin[0], 0, 100);
        this.option.margin[1] = clamp(this.option.margin[1], 0, 100);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.fontSize = clamp(this.option.fontSize, 12, 30);
        this.art.emit('artplayerPluginDanmuku:config', this.option);
    }

    emit(danmu) {
        const { $player } = this.art.template;
        danmu.$ref = this.getDanmuRef();
        danmu.$ref.style.opacity = this.option.opacity;
        danmu.$ref.style.fontSize = `${this.option.fontSize}px`;
        danmu.$ref.innerText = danmu.text;
        danmu.$ref.style.color = danmu.color;
        const playerWidth = Danmuku.getRect($player, 'width');
        const danmuWidth = Danmuku.getRect(danmu.$ref, 'width');
        danmu.$restWidth = playerWidth + danmuWidth + 5;
        danmu.$restTime = this.option.speed;
        danmu.$lastStartTime = Date.now();
        danmu.$ref.style.left = `${playerWidth}px`;
        danmu.$ref.style.top = `${this.getDanmuTop()}px`;
        danmu.$ref.style.transform = `translateX(${-danmu.$restWidth}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
        if (danmu.border) {
            danmu.$ref.style.border = `1px solid ${danmu.border}`;
        }
        danmu.$state = 'emit';
    }

    static continue(danmu) {
        danmu.$lastStartTime = Date.now();
        danmu.$ref.style.transform = `translateX(${-danmu.$restWidth}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
        danmu.$state = 'emit';
    }

    resize() {
        const { $player } = this.art.template;
        const { width: playerWidth } = Danmuku.getRect($player);
        this.queue.forEach(danmu => {
            danmu.$state = 'wait';
        });
        this.refs.forEach($ref => {
            $ref.style.left = `${playerWidth}px`;
            $ref.style.border = 'none';
            $ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
            $ref.style.transition = 'transform 0s linear 0s';
        });
    }

    suspend(danmu) {
        const { $player } = this.art.template;
        const { left: playerLeft, width: playerWidth } = Danmuku.getRect($player);
        const { left: danmuLeft } = Danmuku.getRect(danmu.$ref);
        danmu.$restTime -= (Date.now() - danmu.$lastStartTime) / 1000;
        const translateX = playerWidth - (danmuLeft - playerLeft) + 5;
        danmu.$ref.style.transform = `translateX(${-translateX}px) translateY(0px) translateZ(0px)`;
        danmu.$ref.style.transition = 'transform 0s linear 0s';
        danmu.$state = 'stop';
    }

    addToQueue(danmu) {
        const { notice, player, i18n } = this.art;
        if (!danmu.text.trim()) {
            notice.show(i18n.get('Danmu text cannot be empty'));
            return;
        }

        if (danmu.text.length > this.option.maxlength) {
            notice.show(`${i18n.get('The length of the danmu does not exceed')} ${this.option.maxlength}`);
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
            $lastStartTime: 0,
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
            waitDanmu.$ref.style.border = 'none';
            waitDanmu.$ref.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
            waitDanmu.$ref.style.transition = 'transform 0s linear 0s';
            this.$danmuku.appendChild(waitDanmu.$ref);
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

        append(this.$danmuku, $ref);
        this.refs.push($ref);
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
            if (player.playing) {
                this.queue
                    .filter(danmu => {
                        return (
                            player.currentTime + 0.1 >= danmu.time &&
                            danmu.time >= player.currentTime - 0.1 &&
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
        this.art.emit('artplayerPluginDanmuku:stop');
    }

    start() {
        this.isStop = false;
        this.queue
            .filter(danmu => danmu.$state === 'stop')
            .forEach(danmu => {
                Danmuku.continue(danmu);
            });
        this.update();
        this.art.emit('artplayerPluginDanmuku:start');
    }

    show() {
        this.$danmuku.style = 'block';
        this.art.emit('artplayerPluginDanmuku:show');
    }

    hide() {
        this.$danmuku.style = 'none';
        this.art.emit('artplayerPluginDanmuku:hide');
    }
}
