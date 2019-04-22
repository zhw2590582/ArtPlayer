import Emitter from 'tiny-emitter';
import { runPromisesInSeries, sleep, getFileName, clamp } from './utils';

class ArtplayerToolThumbnail extends Emitter {
    constructor(option = {}) {
        super();
        this.processing = false;
        this.option = {};
        this.setup(Object.assign({}, ArtplayerToolThumbnail.DEFAULTS, option));
        this.video = ArtplayerToolThumbnail.creatVideo();
        this.inputChange = this.inputChange.bind(this);
        this.ondrop = this.ondrop.bind(this);
        this.option.fileInput.addEventListener('change', this.inputChange);
        this.option.fileInput.addEventListener('dragover', ArtplayerToolThumbnail.ondragover);
        this.option.fileInput.addEventListener('drop', ArtplayerToolThumbnail.ondrop);
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

    static ondragover(e) {
        e.preventDefault();
    }

    ondrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        this.loadVideo(file);
    }

    setup(option = {}) {
        this.option = Object.assign({}, this.option, option);
        const { fileInput, delay, number, width, height, column } = this.option;

        this.errorHandle(fileInput instanceof Element, "The 'fileInput' is not a Element");

        if (!(fileInput.tagName === 'INPUT' && fileInput.type === 'file')) {
            fileInput.style.position = 'relative';
            const newFileInput = document.createElement('input');
            newFileInput.type = 'file';
            newFileInput.style.position = 'absolute';
            newFileInput.style.width = '100%';
            newFileInput.style.height = '100%';
            newFileInput.style.left = '0';
            newFileInput.style.top = '0';
            newFileInput.style.right = '0';
            newFileInput.style.bottom = '0';
            newFileInput.style.opacity = '0';
            fileInput.appendChild(newFileInput);
            this.option.fileInput = newFileInput;
        }

        ['delay', 'number', 'width', 'height', 'column'].forEach(item => {
            this.errorHandle(typeof this.option[item] === 'number', `The '${item}' is not a number`);
        });

        this.option.delay = clamp(delay, 10, 1000);
        this.option.number = clamp(number, 10, 1000);
        this.option.width = clamp(width, 10, 1000);
        this.option.height = clamp(height, 10, 1000);
        this.option.column = clamp(column, 1, 1000);
        return this;
    }

    static creatVideo() {
        const video = document.createElement('video');
        video.style.position = 'absolute';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.muted = true;
        video.controls = true;
        document.body.appendChild(video);
        return video;
    }

    inputChange() {
        const file = this.option.fileInput.files[0];
        this.loadVideo(file);
    }

    loadVideo(file) {
        const { delay } = this.option;
        if (file) {
            const canPlayType = this.video.canPlayType(file.type);
            this.errorHandle(
                canPlayType === 'maybe' || canPlayType === 'probably',
                `Playback of this file format is not supported: ${file.type}`,
            );
            const videoUrl = URL.createObjectURL(file);
            this.videoUrl = videoUrl;
            this.file = file;
            this.emit('file', this.file);
            this.video.src = videoUrl;
            sleep(delay)
                .then(() => {
                    this.emit('video', this.video);
                })
                .catch(err => {
                    this.emit('error', err.message);
                    console.error(err);
                });
        }
    }

    start() {
        const { width, height, number, delay } = this.option;
        this.density = number / this.video.duration;
        this.errorHandle(this.file && this.video, 'Please select the video file first');
        this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...');
        this.errorHandle(this.density <= 1, `The preview density cannot be greater than 1, but got ${this.density}`);
        const screenshotDate = this.creatScreenshotDate();
        const canvas = this.creatCanvas();
        const context2D = canvas.getContext('2d');
        this.emit('canvas', canvas);
        const promiseList = screenshotDate.map((item, index) => () => {
            this.video.currentTime = item.time;
            return new Promise(resolve => {
                sleep(delay)
                    .then(() => {
                        context2D.drawImage(this.video, item.x, item.y, width, height);
                        canvas.toBlob(blob => {
                            if (this.thumbnailUrl) {
                                URL.revokeObjectURL(this.thumbnailUrl);
                            }
                            this.thumbnailUrl = URL.createObjectURL(blob);
                            this.emit('update', this.thumbnailUrl, (index + 1) / number);
                            resolve();
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    });
            });
        });
        this.processing = true;
        return runPromisesInSeries(promiseList)
            .then(() =>
                sleep(delay * 2)
                    .then(() => {
                        this.processing = false;
                        this.emit('done');
                    })
                    .catch(err => {
                        this.processing = false;
                        this.emit('error', err.message);
                        console.error(err);
                    }),
            )
            .catch(err => {
                this.processing = false;
                this.emit('error', err.message);
                console.error(err);
            });
    }

    creatScreenshotDate() {
        const { number, width, height, column } = this.option;
        const { duration } = this.video;
        const timeGap = duration / number;
        const timePoints = [timeGap];
        while (timePoints.length < number) {
            const last = timePoints[timePoints.length - 1];
            timePoints.push(last + timeGap);
        }
        console.log(timePoints);
        return timePoints.map((item, index) => ({
            time: item - timeGap / 2,
            x: (index % column) * width,
            y: Math.floor(index / column) * height,
        }));
    }

    creatCanvas() {
        const { number, width, height, column } = this.option;
        const canvas = document.createElement('canvas');
        const context2D = canvas.getContext('2d');
        canvas.width = width * column;
        canvas.height = Math.ceil(number / column) * height + 30;
        context2D.fillStyle = 'black';
        context2D.fillRect(0, 0, canvas.width, canvas.height);
        context2D.font = '14px Georgia';
        context2D.fillStyle = '#fff';
        context2D.fillText(
            `From: https://artplayer.org/, Number: ${number}, Width: ${width}, Height: ${height}, Column: ${column}`,
            10,
            canvas.height - 11,
        );
        return canvas;
    }

    download() {
        this.errorHandle(
            this.file && this.thumbnailUrl,
            'Download does not seem to be ready, please create preview first',
        );
        this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...');
        const elink = document.createElement('a');
        const name = `${getFileName(this.file.name)}.png`;
        elink.download = name;
        elink.href = this.thumbnailUrl;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
        this.emit('download', name);
        return this;
    }

    errorHandle(condition, msg) {
        if (!condition) {
            this.emit('error', msg);
            throw new Error(msg);
        }
    }

    destroy() {
        this.option.fileInput.removeEventListener('change', this.inputChange);
        this.option.fileInput.removeEventListener('dragover', ArtplayerToolThumbnail.ondragover);
        this.option.fileInput.removeEventListener('drop', ArtplayerToolThumbnail.ondrop);
        document.body.removeChild(this.video);
        if (this.videoUrl) {
            URL.revokeObjectURL(this.videoUrl);
        }
        if (this.thumbnailUrl) {
            URL.revokeObjectURL(this.thumbnailUrl);
        }
        this.emit('destroy');
    }
}

window.ArtplayerToolThumbnail = ArtplayerToolThumbnail;
export default ArtplayerToolThumbnail;
