import './index.scss';

function errorHandle(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
}

function runPromisesInSeries(ps) {
    return ps.reduce((p, next) => p.then(next), Promise.resolve());
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class ArtplayerToolThumbnail {
    constructor(option) {
        if (option.fileInput) {
            errorHandle(
                option.fileInput.tagName === 'INPUT' && option.fileInput.type === 'file',
                'This fileInput is not a file input',
            );
        }

        if (option.videoElement) {
            errorHandle(option.fileInput.tagName === 'VIDEO', 'This videoElement is not a video element');
        }

        if (option.callbackVideoUrl) {
            errorHandle(typeof option.callbackVideoUrl === 'function', 'This callbackVideoUrl is not a function');
        }

        if (option.callbackThumbnailUrl) {
            errorHandle(
                typeof option.callbackThumbnailUrl === 'function',
                'This callbackThumbnailUrl is not a function',
            );
        }

        this.option = {
            ...ArtplayerToolThumbnail.DEFAULTS,
            ...option,
        };
        this.getVideoUrl();
    }

    static get DEFAULTS() {
        return {
            delay: 300,
            number: 60,
            width: 160,
            height: 90,
            column: 10,
        };
    }

    mergeOption(option = {}) {
        this.option = {
            ...this.option,
            ...option,
        };
        return this.option;
    }

    getVideoUrl() {
        const fileType = ['video/mp4', 'video/ogg', 'video/webm'];
        this.option.fileInput.addEventListener('change', () => {
            const file = this.option.fileInput.files[0];
            if (file) {
                errorHandle(fileType.includes(file.type), `Only file types are supported: ${fileType.toString()}`);
                const videoUrl = URL.createObjectURL(file);
                this.videoUrl = videoUrl;
                if (this.option.callbackVideoUrl) {
                    this.option.callbackVideoUrl(videoUrl);
                }
            }
        });
    }

    getThumbnailUrl(option = {}) {
        this.mergeOption(option);
        const { number, width, height, column, videoElement, callbackDone } = this.option;
        const { duration } = videoElement;
        const timeGap = duration / number;
        const timePoints = [timeGap];
        while (timePoints.length < number) {
            const last = timePoints[timePoints.length - 1];
            timePoints.push(last + timeGap);
        }
        const screenshotDate = timePoints.map((item, index) => ({
            time: item - timeGap / 2,
            x: (index % column) * width,
            y: Math.floor(index / column) * height,
        }));
        const canvas = document.createElement('canvas');
        canvas.width = width * column;
        canvas.height = Math.ceil(number / column) * height;
        const promiseList = screenshotDate.map(item => this.getScreenshot(canvas, item));
        runPromisesInSeries(promiseList).then(() => {
            const thumbnailUrl = canvas.toDataURL('image/png');
            this.thumbnailUrl = thumbnailUrl;
            if (callbackDone) {
                callbackDone(this.videoUrl, thumbnailUrl);
            }
        });
    }

    getScreenshot(canvas, item) {
        return () => {
            const context2D = canvas.getContext('2d');
            const { width, height, videoElement, delay, callbackThumbnailUrl } = this.option;
            videoElement.currentTime = item.time;
            return sleep(delay).then(() => {
                context2D.drawImage(videoElement, item.x, item.y, width, height);
                const thumbnailUrl = canvas.toDataURL('image/png');
                if (callbackThumbnailUrl) {
                    callbackThumbnailUrl(thumbnailUrl);
                }
            });
        };
    }
}

window.ArtplayerToolThumbnail = ArtplayerToolThumbnail;
export default ArtplayerToolThumbnail;
