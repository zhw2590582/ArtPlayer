import Emitter from './emitter';
import { runPromisesInSeries, sleep, getFileName, clamp } from './utils';

export default class ArtplayerToolThumbnail extends Emitter {
    constructor(option = {}) {
        super();
        this.processing = false;
        this.option = {};
        this.setup(Object.assign({}, ArtplayerToolThumbnail.DEFAULTS, option));
        this.video = ArtplayerToolThumbnail.creatVideo();
        this.duration = 0;
        this.inputChange = this.inputChange.bind(this);
        this.ondrop = this.ondrop.bind(this);
        this.option.fileInput.addEventListener('change', this.inputChange);
        this.option.fileInput.addEventListener('dragover', ArtplayerToolThumbnail.ondragover);
        this.option.fileInput.addEventListener('drop', ArtplayerToolThumbnail.ondrop);
    }

    static get DEFAULTS() {
        return {
            number: 60,
            width: 160,
            height: 90,
            column: 10,
            begin: 0,
            end: NaN,
        };
    }

    static ondragover(event) {
        event.preventDefault();
    }

    ondrop(event) {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        this.loadVideo(file);
    }

    setup(option = {}) {
        this.option = Object.assign({}, this.option, option);
        const { fileInput, number, width, column } = this.option;

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

        ['number', 'width', 'column', 'begin', 'end'].forEach((item) => {
            this.errorHandle(typeof this.option[item] === 'number', `The '${item}' is not a number`);
        });

        this.option.number = clamp(number, 10, 1000);
        this.option.width = clamp(width, 10, 1000);
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

    inputChange(event) {
        const file = this.option.fileInput.files[0];
        this.loadVideo(file);
        event.target.value = '';
    }

    loadVideo(file) {
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
            this.emit('video', this.video);
        }
    }

    start() {
        if (!this.video.duration) return sleep(1000).then(() => this.start());
        const { width, number, begin, end } = this.option;
        const height = (this.video.videoHeight / this.video.videoWidth) * width;
        this.option.height = height;
        this.option.begin = clamp(begin, 0, this.video.duration);
        this.option.end = clamp(end || this.video.duration, begin, this.video.duration);
        this.errorHandle(this.option.end > this.option.begin, `End time must be greater than the start time`);
        this.duration = this.option.end - this.option.begin;
        this.density = number / this.duration;
        this.errorHandle(this.file && this.video, 'Please select the video file first');
        this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...');
        this.errorHandle(this.density <= 1, `The preview density cannot be greater than 1, but got ${this.density}`);
        const screenshotDate = this.creatScreenshotDate();
        const canvas = this.creatCanvas();
        const context2D = canvas.getContext('2d');
        this.emit('canvas', canvas);
        const promiseList = screenshotDate.map((item, index) => () => {
            return new Promise((resolve) => {
                this.video.oncanplay = () => {
                    context2D.drawImage(this.video, item.x, item.y, width, height);
                    canvas.toBlob((blob) => {
                        if (this.thumbnailUrl) {
                            URL.revokeObjectURL(this.thumbnailUrl);
                        }
                        this.thumbnailUrl = URL.createObjectURL(blob);
                        this.emit('update', this.thumbnailUrl, (index + 1) / number);
                        this.video.oncanplay = null;
                        resolve();
                    });
                };
                this.video.currentTime = item.time;
            });
        });
        this.processing = true;
        return runPromisesInSeries(promiseList)
            .then(() => {
                this.processing = false;
                this.emit('done');
            })
            .catch((err) => {
                this.processing = false;
                this.emit('error', err.message);
                throw err;
            });
    }

    creatScreenshotDate() {
        const { number, width, height, column, begin } = this.option;
        const timeGap = this.duration / number;
        const timePoints = [begin + timeGap];
        while (timePoints.length < number) {
            const last = timePoints[timePoints.length - 1];
            timePoints.push(last + timeGap);
        }
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

window['ArtplayerToolThumbnail'] = ArtplayerToolThumbnail;
