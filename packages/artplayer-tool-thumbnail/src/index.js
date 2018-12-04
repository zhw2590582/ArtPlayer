import './index.scss';

function errorHandle(condition, msg) {
    if (!condition) {
        throw new Error(msg);
    }
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

        this.option = option;
        this.init();
    }

    init() {
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

    setup(option = {}) {
        this.option = {
            ...this.option,
            ...option,
        };
    }
}

window.ArtplayerToolThumbnail = ArtplayerToolThumbnail;
export default ArtplayerToolThumbnail;
