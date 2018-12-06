import gifshot from 'gifshot';

function i18nMix(i18n) {
    i18n.update({
        'zh-cn': {
            'Long press, gif length is between 1 second and 5 seconds': '长按，gif 长度为 1 ~ 5 秒',
            'Gif time is too short': 'Gif 时间太短',
            'Start creating gif, please wait': '开始创建 gif，请稍等',
            'Create gif successfully': '创建 gif 成功',
            'There is another gif in the processing': '正有另一个 gif 在创建中',
            'Release the mouse to start': '放开鼠标即可开始',
        },
        'zh-tw': {
            'Long press, gif length is between 1 second and 5 seconds': '長按，gif 長度為 1 ~ 5 秒',
            'Gif time is too short': 'Gif 時間太短',
            'Start creating gif, please wait': '開始創建 gif，請稍等',
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
                cleanTimer();
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

            proxy($gif, 'mouseup', () => {
                createGif();
            });
        },
    });

    return {
        name: 'artplayerPluginGif',
        isProcessing,
        create(config = {}, callback) {
            isProcessing = true;
            art.emit('artplayerPluginGif:create:start');
            notice.show(`${i18n.get('Start creating gif, please wait')}: ${config.numFrames / 10 || 1} s`, false, 5000);
            gifshot.createGIF(
                {
                    ...config,
                    offset: player.currentTime,
                    video: [$video.src],
                },
                obj => {
                    if (obj.error) {
                        notice.show(obj.errorMsg);
                        errorHandle(false, obj.errorMsg);
                    } else if (typeof callback === 'function') {
                        callback(obj.image);
                        notice.show(i18n.get('Create gif successfully'));
                    }

                    isProcessing = false;
                    art.emit('artplayerPluginGif:create:end');
                },
            );
        },
    };
}

window.artplayerPluginGif = artplayerPluginGif;
export default artplayerPluginGif;
