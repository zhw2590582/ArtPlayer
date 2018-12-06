import gifshot from 'gifshot';

function i18nMix(i18n) {
    i18n.update({
        'zh-cn': {
            'Long press, gif length is between 1 second and 5 seconds': '长按，gif 长度为 1 ~ 5 秒',
            'Gif time is too short': 'Gif 时间太短',
            'Start creating gif...': '开始创建 gif...',
            'Create gif successfully': '创建 gif 成功',
            'There is another gif in the processing': '正有另一个 gif 在创建中',
            'Release the mouse to start': '放开鼠标即可开始',
        },
        'zh-tw': {
            'Long press, gif length is between 1 second and 5 seconds': '長按，gif 長度為 1 ~ 5 秒',
            'Gif time is too short': 'Gif 時間太短',
            'Start creating gif...': '開始創建 gif...',
            'Create gif successfully': '創建 gif 成功',
            'There is another gif in the processing': '正有另一個 gif 在創建中',
            'Release the mouse to start': '放開鼠標即可開始',
        },
    });
}

function artplayerPluginGif(art) {
    const { errorHandle, clamp, downloadImage } = art.constructor.utils;
    const {
        i18n,
        notice,
        layers,
        controls,
        player,
        loading,
        option: { theme, title },
        events: { proxy },
        template: { $video },
    } = art;

    i18nMix(i18n);

    layers.add({
        name: 'artplayer-plugin-gif-progress',
        html: '<div class="artplayer-plugin-gif-progress"></div>',
        style: {
            position: 'absolute',
            top: '0',
            left: '0',
            height: '3px',
            width: '0%',
            'background-color': theme,
        },
    });

    const $progress = layers['artplayer-plugin-gif-progress'].$ref;
    let isProcessing = false;
    let pressStartTime = 0;
    let progressTimer = null;
    let isPress = false;
    let offset = 0;

    function cleanTimer() {
        $progress.style.width = '0%';
        clearTimeout(progressTimer);
        progressTimer = null;
    }

    function createGif() {
        cleanTimer();
        const pressTime = new Date() - pressStartTime;
        if (isProcessing) {
            notice.show(i18n.get('There is another gif in the processing'));
        } else if (pressTime < 1000) {
            notice.show(i18n.get('Gif time is too short'));
        } else {
            const numFrames = Math.floor(clamp(pressTime, 1000, 5000) / 100);
            const { videoWidth, videoHeight } = $video;
            art.plugins.artplayerPluginGif.create(
                {
                    numFrames,
                    offset: Math.floor(offset),
                    gifHeight: 200,
                    gifWidth: (videoWidth / videoHeight) * 200,
                },
                image => {
                    downloadImage(image, `${title || 'unnamed'}.gif`);
                },
            );
        }
    }

    controls.add({
        name: 'artplayer-plugin-gif',
        position: 'right',
        html: 'GIF',
        mounted: $gif => {
            proxy($gif, 'mousedown', () => {
                isPress = true;
                cleanTimer();
                offset = player.currentTime;
                pressStartTime = new Date();
                notice.show(i18n.get('Long press, gif length is between 1 second and 5 seconds'));
                (function loop() {
                    progressTimer = setTimeout(() => {
                        const width = parseInt($progress.style.width, 10);
                        if (width <= 100) {
                            $progress.style.width = `${width + 1}%`;
                            loop();
                        } else {
                            notice.show(i18n.get('Release the mouse to start'));
                        }
                    }, 50);
                })();
            });

            proxy(document, 'mouseup', () => {
                if (isPress) {
                    isPress = false;
                    createGif();
                    offset = 0;
                }
            });
        },
    });

    return {
        name: 'artplayerPluginGif',
        create(config = {}, callback) {
            isProcessing = true;
            loading.show();
            art.emit('artplayerPluginGif:start');
            notice.show(i18n.get('Start creating gif...'), false);
            console.log(`Start time: ${config.offset || 0}s, Frames: ${config.numFrames || 10}p, Duration: ${config.numFrames / 10 || 1}s`);
            gifshot.createGIF(
                {
                    ...config,
                    video: [$video.src],
                    crossOrigin: 'Anonymous',
                },
                obj => {
                    if (obj.error) {
                        notice.show(obj.errorMsg);
                        errorHandle(false, obj.errorMsg);
                    } else if (typeof callback === 'function') {
                        callback(obj.image);
                        notice.show(i18n.get('Create gif successfully'));
                        art.emit('artplayerPluginGif', obj.image);
                    }

                    isProcessing = false;
                    loading.hide();
                    art.emit('artplayerPluginGif:end');
                },
            );
        },
    };
}

window.artplayerPluginGif = artplayerPluginGif;
export default artplayerPluginGif;
