import { bilibiliDanmuParseFromUrl } from './bilibili';
import workerText from 'bundle-text:./worker';

export default class Danmuku {
    constructor(art, option) {
        const { constructor, template } = art;

        this.utils = constructor.utils; // 工具库
        this.validator = constructor.validator; // 配置校验器
        this.$danmuku = template.$danmuku; // 弹幕层容器
        this.$player = template.$player; // 播放器容器

        this.art = art;
        this.danmus = []; // 原始弹幕数据
        this.queue = []; // 实际弹幕队列
        this.option = {}; // 格式化后的配置项
        this.$refs = []; // 弹幕DOM节点池
        this.isStop = false; // 是否停止
        this.isHide = false; // 是否隐藏
        this.timer = null; // 定时器
        this.config(option); // 动态配置

        // 创建 Web Worker, 用于计算弹幕的 top 值
        this.worker = new Worker(URL.createObjectURL(new Blob([workerText])));

        // 绑定公用事件
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.destroy = this.destroy.bind(this);

        // 监听事件
        art.on('video:play', this.start);
        art.on('video:playing', this.start);
        art.on('video:pause', this.stop);
        art.on('video:waiting', this.stop);
        art.on('destroy', this.destroy);
        // art.on('resize', this.reset);

        // 开始加载弹幕
        this.load();
    }

    // 默认配置
    static get option() {
        return {
            danmuku: [], // 弹幕数据
            speed: 5, // 弹幕持续时间
            margin: ['2%', '25%'], // 弹幕上下边距，支持像素数字和百分比
            opacity: 1, // 默认弹幕透明度
            color: '#FFFFFF', // 默认弹幕颜色，可以被单独弹幕项覆盖
            mode: 0, // 默认弹幕模式: 0: 滚动，1: 顶部，2: 底部
            fontSize: 25, // 弹幕字体大小，支持像素数字和百分比，不可以被单独弹幕项覆盖
            antiOverlap: true, // 弹幕是否防重叠
            synchronousPlayback: false, // 是否同步播放速度
            mount: undefined, // 弹幕发射器挂载点, 默认为播放器控制栏中部
            heatmap: false, // 是否开启热力图
            points: [], // 热力图数据
            setting: {}, // 弹幕发射器设置
            filter: () => true, // 弹幕载入前的过滤器，只支持返回布尔值
            beforeEmit: () => true, // 弹幕发送前的过滤器，支持返回 Promise
            beforeVisible: () => true, // 弹幕显示前的过滤器，支持返回 Promise
        };
    }

    // 配置校验
    static get scheme() {
        return {
            danmuku: 'array|function|string',
            speed: 'number',
            margin: 'array',
            opacity: 'number',
            color: 'string',
            mode: 'number',
            fontSize: 'number|string',
            filter: 'function',
            antiOverlap: 'boolean',
            synchronousPlayback: 'boolean',
            mount: '?htmldivelement',
            heatmap: 'object|boolean',
            points: 'array',
            setting: 'object',
            beforeEmit: 'function',
            beforeVisible: 'function',
        };
    }

    // 初始弹幕样式
    static get cssText() {
        return `
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
    }

    // 是否在移动端使用了自动旋屏，会影响弹幕的left和top值
    get isRotate() {
        return this.art.plugins?.autoOrientation?.state;
    }

    // 计算上空白边距
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

    // 计算下空白边距
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

    // 加载弹幕
    async load() {
        const { errorHandle } = this.utils;

        try {
            if (typeof this.option.danmuku === 'function') {
                this.danmus = await this.option.danmuku();
            } else if (typeof this.option.danmuku.then === 'function') {
                this.danmus = await this.option.danmuku;
            } else if (typeof this.option.danmuku === 'string') {
                this.danmus = await bilibiliDanmuParseFromUrl(this.option.danmuku);
            } else {
                this.danmus = this.option.danmuku;
            }

            errorHandle(Array.isArray(this.danmus), 'Danmuku need return an array as result');

            this.queue = []; // 清空实际弹幕队列
            this.$danmuku.innerText = ''; // 清空弹幕层
            this.danmus.forEach((danmu) => this.emit(danmu)); // 逐个验证原始弹幕并转换为实际弹幕
            this.art.emit('artplayerPluginDanmuku:loaded', this.queue);

            // TODO: 按时间从小到大排序，用于减少弹幕的遍历次数，待优化...
            // this.queue = this.queue.sort((a, b) => a.time - b.time);
        } catch (error) {
            this.art.emit('artplayerPluginDanmuku:error', error);
            throw error;
        }

        return this;
    }

    // 把原始弹幕转换为实际弹幕
    emit(danmu) {
        const { clamp } = this.utils;

        this.validator(danmu, {
            text: 'string', // 弹幕文本
            mode: '?number', // 弹幕模式: 0: 滚动，1: 顶部，2: 底部
            color: '?string', // 弹幕颜色
            time: '?number', // 弹幕时间
            border: '?boolean', // 弹幕是否有边框
            style: '?object', // 弹幕额外样式
            escape: '?boolean', // 弹幕文本是否转义
        });

        // 弹幕文本为空则直接忽略
        if (!danmu.text.trim()) return this;

        // 弹幕模式只能是 0, 1, 2
        if (![0, 1, 2].includes(danmu.mode)) return this;

        // 自定义弹幕过滤函数
        if (!this.option.filter(danmu)) return this;

        // 设置弹幕时间，如果没有则默认为当前时间加 0.5 秒
        if (danmu.time) {
            danmu.time = clamp(danmu.time, 0, Infinity);
        } else {
            danmu.time = this.art.currentTime + 0.5;
        }

        // 设置弹幕模式，如果没有则默认为全局配置
        if (danmu.mode === undefined) {
            danmu.mode = this.option.mode;
        }

        // 设置弹幕单独样式，如果没有则默认为空对象
        if (danmu.style === undefined) {
            danmu.style = {};
        }

        // 设置弹幕弹幕是否转义，如果没有则默认为 true，即不会显示 HTML 标签
        if (danmu.escape === undefined) {
            danmu.escape = true;
        }

        // 设置弹幕颜色，如果没有则默认为全局配置
        if (danmu.color === undefined) {
            danmu.color = this.option.color;
        }

        // 添加到实际弹幕队列
        this.queue.push({
            ...danmu,
            $state: 'wait', // 弹幕状态
            $ref: null, // 弹幕 DOM 节点
            $restTime: 0, // 弹幕剩余时间
            $lastStartTime: 0, // 弹幕上次开始时间
        });

        // 弹幕有四个状态：
        // - wait: 弹幕还未开始显示，没有被添加到 DOM 中
        // - ready: 弹幕准备好显示，没有被添加到 DOM 中
        // - emit: 弹幕正在显示，已经被添加到 DOM 中
        // - stop: 弹幕正在停止显示，已经被添加到 DOM 中

        return this;
    }

    // 动态配置
    config(option) {
        const { clamp } = this.utils;

        this.option = Object.assign({}, Danmuku.option, this.option, option);
        this.validator(this.option, Danmuku.scheme);

        this.option.speed = clamp(this.option.speed, 1, 10);
        this.option.opacity = clamp(this.option.opacity, 0, 1);
        this.option.style = Object.assign({}, Danmuku.option.style, this.option.style);

        // 重新计算弹幕字体大小，需要重新渲染
        if (option.fontSize) {
            this.option.fontSize = this.getFontSize(this.option.fontSize);
            this.reset();
        }

        this.art.emit('artplayerPluginDanmuku:config', this.option);

        return this;
    }

    // 计算DOM的left值，受到旋屏影响
    getLeft($ref) {
        const rect = $ref.getBoundingClientRect();
        return this.isRotate ? rect.top : rect.left;
    }

    // 获取弹幕DOM节点
    getRef() {
        const $ref = this.$refs.pop() || document.createElement('div');
        $ref.style.cssText = Danmuku.cssText;
        $ref.dataset.mode = '';
        return $ref;
    }

    // 计算弹幕字体大小
    getFontSize(fontSize) {
        const { clamp } = this.utils;
        const { clientHeight } = this.$player;

        if (typeof fontSize === 'number') {
            return clamp(fontSize, 12, clientHeight);
        }

        if (typeof fontSize === 'string' && fontSize.endsWith('%')) {
            const ratio = parseFloat(fontSize) / 100;
            return clamp(clientHeight * ratio, 12, clientHeight);
        }

        return Danmuku.option.fontSize;
    }

    // 计算弹幕的top值
    postMessage(message = {}) {
        return new Promise((resolve) => {
            message.id = Date.now();
            this.worker.postMessage(message);
            this.worker.onmessage = (event) => {
                const { data } = event;
                if (data.id === message.id) {
                    resolve(data);
                }
            };
        });
    }

    // 根据状态，获取弹幕队列中的弹幕
    filter(state, callback) {
        return this.queue.filter((danmu) => danmu.$state === state).map(callback);
    }

    // 获取准备好发送的弹幕：有的是ready状态（如之前因为弹幕太多而暂停发送的弹幕），有的是wait状态
    getReady() {
        const { currentTime } = this.art;
        return this.queue.filter((danmu) => {
            return (
                danmu.$state === 'ready' ||
                (danmu.$state === 'wait' && currentTime + 0.1 >= danmu.time && danmu.time >= currentTime - 0.1)
            );
        });
    }

    // 获取正在发送的弹幕，用于计算下一个弹幕的top值
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

    // 重置弹幕到wait状态，回收弹幕DOM节点
    makeWait(danmu) {
        danmu.$state = 'wait';
        if (danmu.$ref) {
            danmu.$ref.style.cssText = Danmuku.cssText;
            this.$refs.push(danmu.$ref);
            danmu.$ref = null;
        }
    }

    // 实时更新弹幕
    update() {
        const { setStyles } = this.utils;

        this.timer = window.requestAnimationFrame(async () => {
            if (this.art.playing && !this.isHide) {
                // 实时计算弹幕的剩余显示时间
                this.filter('emit', (danmu) => {
                    const emitTime = (Date.now() - danmu.$lastStartTime) / 1000;
                    danmu.$restTime -= emitTime;
                    danmu.$lastStartTime = Date.now();
                    // 超过时间即重置弹幕
                    if (danmu.$restTime <= 0) {
                        this.makeWait(danmu);
                    }
                });

                // 获取准备好发送的弹幕，可能包含ready和wait状态的弹幕
                const readys = this.getReady();
                for (let index = 0; index < readys.length; index++) {
                    const danmu = readys[index];

                    // 弹幕发送前的过滤器
                    const state = await this.option.beforeVisible(danmu);

                    if (state) {
                        const { clientWidth, clientHeight } = this.$player;
                        danmu.$ref = this.getRef(); // 获取弹幕DOM节点

                        // 设置弹幕文本
                        if (danmu.escape) {
                            danmu.$ref.innerText = danmu.text;
                        } else {
                            danmu.$ref.innerHTML = danmu.text;
                        }

                        // 提前添加到弹幕层中，用于计算top值
                        this.$danmuku.appendChild(danmu.$ref);

                        // 设置初始弹幕样式
                        danmu.$ref.style.left = `${clientWidth}px`;
                        danmu.$ref.style.opacity = this.option.opacity;
                        danmu.$ref.style.fontSize = `${this.option.fontSize}px`;
                        danmu.$ref.style.color = danmu.color;
                        danmu.$ref.style.border = danmu.border ? `1px solid ${danmu.color}` : null;
                        danmu.$ref.style.backgroundColor = danmu.border ? 'rgb(0 0 0 / 50%)' : null;
                        danmu.$ref.style.marginLeft = '0px';

                        // 设置单独弹幕样式
                        setStyles(danmu.$ref, danmu.style);

                        // 记录弹幕时间戳
                        danmu.$lastStartTime = Date.now();

                        // 计算弹幕剩余时间
                        danmu.$restTime =
                            this.option.synchronousPlayback && this.art.playbackRate
                                ? this.option.speed / Number(this.art.playbackRate)
                                : this.option.speed;

                        // 计算弹幕的top值
                        const { top } = await this.postMessage({
                            target: {
                                mode: danmu.mode,
                                height: danmu.$ref.clientHeight,
                                speed: (clientWidth + danmu.$ref.clientWidth) / danmu.$restTime,
                            }, // 当前弹幕信息
                            emits: this.getEmits(), // 正在发送的其它弹幕
                            antiOverlap: this.option.antiOverlap,
                            clientWidth: clientWidth,
                            clientHeight: clientHeight,
                            marginBottom: this.marginBottom,
                            marginTop: this.marginTop,
                        });

                        if (danmu.$ref) {
                            if (!this.isStop && top !== undefined) {
                                danmu.$state = 'emit'; // 转换为emit状态
                                danmu.$ref.style.visibility = 'visible';
                                danmu.$ref.dataset.mode = danmu.mode; // CSS控制模式的显示和隐藏
                                this.art.emit('artplayerPluginDanmuku:visible', danmu);

                                switch (danmu.mode) {
                                    // 滚动的弹幕
                                    case 0: {
                                        danmu.$ref.style.top = `${top}px`;
                                        const translateX = clientWidth + danmu.$ref.clientWidth;
                                        danmu.$ref.style.transform = `translateX(${-translateX}px)`;
                                        danmu.$ref.style.transition = `transform ${danmu.$restTime}s linear 0s`;
                                        break;
                                    }
                                    case 1:
                                    // falls through
                                    case 2:
                                        danmu.$ref.style.left = '50%';
                                        danmu.$ref.style.top = `${top}px`;
                                        danmu.$ref.style.marginLeft = `-${danmu.$ref.clientWidth / 2}px`;
                                        break;
                                    default:
                                        break;
                                }
                            } else {
                                // 假如弹幕已经停止或者没有 top 值，则重置弹幕为ready状态，回收弹幕DOM节点，等待下次发送
                                danmu.$state = 'ready';
                                this.$refs.push(danmu.$ref);
                                danmu.$ref = null;
                            }
                        }
                    }
                }
            }

            // 递归调用
            if (!this.isStop) {
                this.update();
            }
        });
        return this;
    }

    // 继续弹幕
    continue() {
        const { clientWidth } = this.$player;
        this.filter('stop', (danmu) => {
            danmu.$state = 'emit'; // 转换为emit状态
            danmu.$lastStartTime = Date.now();
            switch (danmu.mode) {
                // 继续滚动的弹幕
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

    // 暂停弹幕
    suspend() {
        const { clientWidth } = this.$player;
        this.filter('emit', (danmu) => {
            danmu.$state = 'stop'; // 转换为stop状态
            switch (danmu.mode) {
                // 停止滚动的弹幕
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

    reset() {
        this.queue.forEach((danmu) => this.makeWait(danmu));
        return this;
    }

    show() {
        this.isHide = false;
        this.start();
        this.$danmuku.style.display = '';
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

    destroy() {
        this.stop();
        this.worker.terminate();
        this.art.off('video:play', this.start);
        this.art.off('video:playing', this.start);
        this.art.off('video:pause', this.stop);
        this.art.off('video:waiting', this.stop);
        this.art.off('resize', this.reset);
        this.art.off('destroy', this.destroy);
        this.art.emit('artplayerPluginDanmuku:destroy');
    }
}
