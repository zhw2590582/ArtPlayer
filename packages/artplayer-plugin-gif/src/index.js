import gifshot from 'gifshot';
import b64toBlob from 'b64-to-blob';

function artplayerPluginGif(art) {
    const { errorHandle, clamp, downloadFile } = art.constructor.utils;
    const {
        i18n,
        notice,
        layers,
        player,
        loading,
        option: { theme, title },
        events: { proxy },
        template: { $video },
    } = art;

    i18n.update({
        'zh-cn': {
            'Long press, gif length is between 1 second and 10 seconds': '长按，gif 长度为 1 ~ 10 秒',
            'Gif time is too short': 'Gif 时间太短',
            'Start creating gif...': '开始创建 gif...',
            'Create gif successfully': '创建 gif 成功',
            'There is another gif in the processing': '正有另一个 gif 在创建中',
            'Release the mouse to start': '放开鼠标即可开始',
        },
        'zh-tw': {
            'Long press, gif length is between 1 second and 10 seconds': '長按，gif 長度為 1 ~ 10 秒',
            'Gif time is too short': 'Gif 時間太短',
            'Start creating gif...': '開始創建 gif...',
            'Create gif successfully': '創建 gif 成功',
            'There is another gif in the processing': '正有另一個 gif 在創建中',
            'Release the mouse to start': '放開鼠標即可開始',
        },
    });

    const layer = layers.add({
        name: 'artplayer-plugin-gif-progress',
        style: {
            position: 'absolute',
            top: '0',
            left: '0',
            height: '3px',
            width: '0%',
            'background-color': theme,
        },
    });

    const $progress = layer.$ref;
    const timeLimit = 10000;
    let isProcessing = false;
    let pressStartTime = 0;
    let progressTimer = null;
    let isPress = false;
    let offset = 0;

    art.on('destroy', () => {
        if (progressTimer) {
            clearTimeout(progressTimer);
        }
    });

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
            const numFrames = Math.floor(clamp(pressTime, 1000, timeLimit) / 100);
            const { videoWidth, videoHeight } = $video;
            art.plugins.artplayerPluginGif.create(
                {
                    numFrames,
                    offset: Math.floor(offset),
                    gifHeight: 200,
                    gifWidth: (videoWidth / videoHeight) * 200,
                },
                image => {
                    downloadFile(image, `${title || 'unnamed'}.gif`);
                },
            );
        }
    }

    return {
        name: 'artplayerPluginGif',
        attach($gif) {
            proxy($gif, 'mousedown', () => {
                isPress = true;
                cleanTimer();
                offset = player.currentTime;
                pressStartTime = new Date();
                notice.show(i18n.get('Long press, gif length is between 1 second and 10 seconds'));
                (function loop() {
                    progressTimer = setTimeout(() => {
                        const width = parseInt($progress.style.width, 10);
                        if (width <= 100) {
                            $progress.style.width = `${width + 1}%`;
                            loop();
                        } else {
                            notice.show(i18n.get('Release the mouse to start'));
                        }
                    }, timeLimit / 100);
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
        create(config = {}, callback) {
            isProcessing = true;
            loading.show = true;
            art.emit('artplayerPluginGif:start');
            notice.show(i18n.get('Start creating gif...'), false);
            gifshot.createGIF(
                {
                    ...config,
                    video: [$video.src],
                    crossOrigin: 'anonymous',
                },
                obj => {
                    if (obj.error) {
                        notice.show(obj.errorMsg);
                        errorHandle(false, obj.errorMsg);
                    } else if (typeof callback === 'function') {
                        const base64String = obj.image.split(',')[1];
                        const blob = b64toBlob(base64String, 'image/gif');
                        const blobUrl = URL.createObjectURL(blob);
                        notice.show(i18n.get('Create gif successfully'));
                        art.emit('artplayerPluginGif', blobUrl);
                        callback(blobUrl);
                    }
                    isProcessing = false;
                    loading.show = false;
                    art.emit('artplayerPluginGif:end');
                },
            );
        },
    };
}

export default artplayerPluginGif;
