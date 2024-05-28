import SubtitlesOctopus from 'libass-wasm';

const defaultAssSubtitle = `[Script Info]\nScriptType: v4.00+`;

export default class LibassAdapter {
    constructor(art, option) {
        const { constructor, template } = art;

        this.art = art;
        this.$video = template.$video;
        this.$webvtt = template.$subtitle;
        this.utils = constructor.utils;

        this.libass = null;

        art.once('ready', this.init.bind(this, option));
    }

    async init(option) {
        this.#checkWebAssemblySupport();

        await this.#createLibass(option);

        this.#addEventListeners();

        this.art.emit('artplayerPluginLibass:init', this);

        // set initial subtitle
        const initialSubtitle = this.art?.option?.subtitle?.url;
        if (initialSubtitle && this.utils.getExt(initialSubtitle) === 'ass') {
            this.switch(initialSubtitle);
        }
    }

    switch(url) {
        this.art.emit('artplayerPluginLibass:switch', url);

        if (url && this.utils.getExt(url) === 'ass') {
            this.currentType = 'ass';
            this.libass.freeTrack();
            this.libass.setTrackByUrl(this.#toAbsoluteUrl(url));

            this.visible = this.art.subtitle.show;
        } else {
            this.currentType = 'webvtt';
            this.hide();
            this.libass.freeTrack();
        }
    }

    setVisibility(visible) {
        this.visible = visible;
    }

    setOffset(offset) {
        this.timeOffset = offset;
    }

    get active() {
        return this.currentType === 'ass';
    }

    get visible() {
        if (!this.libass) return false;

        return this.libass.canvasParent.style.display !== 'none';
    }

    set visible(visible) {
        this.art.emit('artplayerPluginLibass:visible', visible);

        this.#setVttVisible(!this.active);

        if (this.libass.canvasParent) {
            this.libass.canvasParent.style.display = visible ? 'block' : 'none';

            if (visible) this.libass.resize();
        }
    }

    get timeOffset() {
        return this.libass.timeOffset;
    }

    set timeOffset(offset) {
        this.art.emit('artplayerPluginLibass:timeOffset', offset);
        this.libass.timeOffset = offset;
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    destroy() {
        this.art.emit('artplayerPluginLibass:destroy');

        this.#removeEventListeners();

        this.libass.dispose();
        URL.revokeObjectURL(this.workerScriptUrl);
        this.libass = null;
    }

    async #createLibass(option = {}) {
        if (!option.fallbackFont) {
            return this.utils.errorHandle(option.fallbackFont, 'artplayerPluginLibass: fallbackFont is required');
        }

        if (!option.workerUrl) {
            option.workerUrl =
                'https://cdnjs.cloudflare.com/ajax/libs/libass-wasm/4.1.0/js/subtitles-octopus-worker.js';
        }

        if (option.availableFonts) {
            option.availableFonts = Object.entries(option.availableFonts).reduce((acc, [key, value]) => {
                acc[key] = this.#toAbsoluteUrl(value);
                return acc;
            }, {});
        }

        this.libass = new SubtitlesOctopus({
            subContent: defaultAssSubtitle,
            video: this.$video,
            ...option,
            workerUrl: await this.#loadWorker(option),
            fallbackFont: this.#toAbsoluteUrl(option.fallbackFont),
            fonts: option.fonts?.map((font) => this.#toAbsoluteUrl(font)),
        });

        this.libass.canvasParent.className = 'artplayer-plugin-libass';
        this.libass.canvasParent.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            user-select: none;
            pointer-events: none;
            z-index: 20;`;
    }

    #addEventListeners() {
        this.switchHandler = this.switch.bind(this);
        this.visibleHandler = this.setVisibility.bind(this);
        this.offsetHandler = this.setOffset.bind(this);

        this.art.on('subtitle', this.visibleHandler);
        this.art.on('subtitleLoad', this.switchHandler);
        this.art.on('subtitleOffset', this.offsetHandler);

        this.art.once('destroy', this.destroy.bind(this));
    }

    #removeEventListeners() {
        this.art.off('subtitle', this.visibleHandler);
        this.art.off('subtitleLoad', this.switchHandler);
        this.art.off('subtitleOffset', this.offsetHandler);
    }

    #setVttVisible(visible) {
        this.$webvtt.style.visibility = visible ? 'visible' : 'hidden';
    }

    #toAbsoluteUrl(url) {
        if (this.#isAbsoluteUrl(url)) return url;

        // handle absolute URL when the `Worker` of `BLOB` type loading network resources
        return new URL(url, document.baseURI).toString();
    }

    #isAbsoluteUrl(url) {
        return /^https?:\/\//.test(url);
    }

    #loadWorker({ workerUrl, wasmUrl }) {
        return new Promise((resolve) => {
            fetch(workerUrl)
                .then((res) => res.text())
                .then((text) => {
                    let workerScriptContent = text;

                    workerScriptContent = workerScriptContent.replace(
                        /wasmBinaryFile\s*=\s*"(subtitles-octopus-worker\.wasm)"/g,
                        (_match, wasm) => {
                            if (!wasmUrl) {
                                wasmUrl = new URL(wasm, workerUrl).toString();
                            } else {
                                wasmUrl = this.#toAbsoluteUrl(wasmUrl);
                            }

                            return `wasmBinaryFile = "${wasmUrl}"`;
                        },
                    );

                    const workerBlob = new Blob([workerScriptContent], { type: 'text/javascript' });
                    resolve(URL.createObjectURL(workerBlob));
                });
        });
    }

    #checkWebAssemblySupport() {
        let supportsWebAssembly = false;
        try {
            if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
                const module = new WebAssembly.Module(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
                if (module instanceof WebAssembly.Module)
                    supportsWebAssembly = new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
            }

            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            //
        }

        this.utils.errorHandle(supportsWebAssembly, 'Browser does not support WebAssembly');
    }
}
