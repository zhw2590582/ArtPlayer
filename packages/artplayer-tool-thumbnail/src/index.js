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
        this.option.fileInput.addEventListener('change', this.inputChange);
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

    setup(option = {}) {
        this.option = Object.assign({}, this.option, option);
        const { fileInput, delay, number, width, height, column } = this.option;

        this.errorHandle(
            fileInput.tagName === 'INPUT' && fileInput.type === 'file',
            'The \'fileInput\' is not a usable file input like: <input type="file">',
        );

        ['delay', 'number', 'width', 'height', 'column'].forEach(item => {
            this.errorHandle(typeof this.option[item] === 'number', `The '${item}' is not a number`);
        });

        this.option.delay = clamp(delay, 100, 1000);
        this.option.number = clamp(number, 10, 100);
        this.option.width = clamp(width, 100, 500);
        this.option.height = clamp(height, 100, 500);
        this.option.column = clamp(column, 10, 100);
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
        const { delay } = this.option;
        const fileType = ['video/mp4', 'audio/ogg', 'video/webm'];
        const file = this.option.fileInput.files[0];
        if (file) {
            this.errorHandle(
                fileType.includes(file.type),
                `Only file types are supported: ${fileType.toString()}, but got ${file.type}`,
            );
            const videoUrl = URL.createObjectURL(file);
            this.videoUrl = videoUrl;
            this.file = file;
            this.emit('file', this.file);
            this.video.src = videoUrl;
            sleep(delay).then(() => {
                this.emit('video', this.video);
            });
        }
    }

    start() {
        this.errorHandle(this.file && this.video, 'Please select the video file first');
        this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...');
        const { width, height, number, delay } = this.option;
        const screenshotDate = this.creatScreenshotDate();
        const canvas = this.creatCanvas();
        const context2D = canvas.getContext('2d');
        this.emit('canvas', canvas);
        const promiseList = screenshotDate.map((item, index) => () => {
            this.video.currentTime = item.time;
            return sleep(delay).then(() => {
                context2D.drawImage(this.video, item.x, item.y, width, height);
                canvas.toBlob(blob => {
                    this.thumbnailUrl = URL.createObjectURL(blob);
                    this.emit('update', (index + 1) / number, this.thumbnailUrl);
                });
            });
        });
        this.processing = true;
        runPromisesInSeries(promiseList).then(() => {
            sleep(delay).then(() => {
                this.processing = false;
                this.emit('done');
            });
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
            `From: https://artplayer.org/thumbnail, Number: ${number}, Width: ${width}, Height: ${height}, Column: ${column}`,
            10,
            canvas.height - 12,
        );
        return canvas;
    }

    download() {
        this.errorHandle(this.file && this.thumbnailUrl, 'Download does not seem to be ready');
        this.errorHandle(!this.processing, 'There is currently a task in progress, please wait a moment...');
        const elink = document.createElement('a');
        const name = `${getFileName(this.file.name)}.png`;
        elink.download = name;
        elink.href = this.thumbnailUrl;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
        this.emit('download', name);
    }

    errorHandle(condition, msg) {
        if (!condition) {
            this.emit('error', msg);
            throw new Error(msg);
        }
    }
}

window.ArtplayerToolThumbnail = ArtplayerToolThumbnail;
export default ArtplayerToolThumbnail;
