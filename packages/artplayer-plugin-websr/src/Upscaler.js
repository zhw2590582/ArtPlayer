export default class Upscaler {
  static DEFAULT_TIMEOUTS = { IMAGE: 300000, VIDEO: 3600000, METADATA: 10000 };
  static DEFAULT_DELAYS = { INIT: 500, NETWORK: 300 };

  static isSupported() {
    try {
      const hasWorker = typeof Worker !== "undefined";
      const hasOffscreen =
        typeof OffscreenCanvas !== "undefined" ||
        (typeof document !== "undefined" &&
          !!document.createElement("canvas").transferControlToOffscreen);
      const hasBlob = typeof Blob !== "undefined";
      return hasWorker && hasOffscreen && hasBlob;
    } catch {
      return false;
    }
  }

  static isVideoSupported() {
    try {
      return (
        typeof VideoEncoder !== "undefined" &&
        typeof VideoDecoder !== "undefined"
      );
    } catch {
      return false;
    }
  }

  constructor(options = {}) {
    const weightsBaseUrl = options.weightsBaseUrl || "/weights";

    this.networks = options.networks || {
      small: {
        name: "anime4k/cnn-2x-l",
        weightsUrl: `${weightsBaseUrl}/cnn-8.json`,
      },
      medium: {
        name: "anime4k/cnn-2x-16",
        weightsUrl: `${weightsBaseUrl}/cnn-16.json`,
      },
      large: {
        name: "anime4k/cnn-2x-28",
        weightsUrl: `${weightsBaseUrl}/cnn-28.json`,
      },
    };

    this.networkSize = options.networkSize || "medium";
    this.weightsBaseUrl = weightsBaseUrl;
    this.workerUrl = options.workerUrl || "/worker/main.js";

    this.timeouts = {
      ...Upscaler.DEFAULT_TIMEOUTS,
      ...(options.timeouts || {}),
    };
    this.delays = { ...Upscaler.DEFAULT_DELAYS, ...(options.delays || {}) };

    this.imageScale =
      typeof options.imageScale === "number" && options.imageScale > 0
        ? options.imageScale
        : 2;
    this.videoScale =
      typeof options.videoScale === "number" && options.videoScale > 0
        ? options.videoScale
        : 2;

    this.weightsCache = new Map();
    this.workerInstance = null;
    this.messageHandlers = {};
    this.progressCallback = null;
    this.processingType = null;

    this.realtimeLoopId = null;
    this.realtimeState = null;
  }

  init({ prewarm = true } = {}) {
    if (!Upscaler.isSupported()) {
      throw new Error("Upscaler is not supported in this environment");
    }
    if (prewarm) {
      this.getWorker().postMessage({ cmd: "isSupported" });
    }
    return this;
  }

  getWorker() {
    if (!this.workerInstance) {
      this.workerInstance = new Worker(this.workerUrl);
      this.workerInstance.onmessage = (event) =>
        this.handleWorkerMessage(event);
    }
    return this.workerInstance;
  }

  static extractProgressValue(data) {
    const value = data.data ?? data.progress ?? data.value ?? data.percentage;
    return typeof value === "number"
      ? Math.min(100, Math.max(0, Math.round(value)))
      : null;
  }

  handleBlobResponse(data) {
    const blobType =
      this.processingType === "video" ? "videoBlob" : "imageBlob";
    const handler = this.messageHandlers[blobType];
    if (data.data instanceof Blob && handler) {
      handler({ [blobType]: data.data });
    }
  }

  requestBlob() {
    const cmd =
      this.processingType === "video" ? "getVideoBlob" : "getImageBlob";
    this.getWorker().postMessage({ cmd });
  }

  handleWorkerMessage(event) {
    const { data } = event;
    if (!data.cmd) return;

    const { cmd } = data;

    if (cmd === "progress") {
      const progress = Upscaler.extractProgressValue(data);
      if (progress !== null && this.progressCallback) {
        this.progressCallback(progress);
      }
      if (this.messageHandlers.progress) this.messageHandlers.progress(data);
    } else if (cmd === "finished") {
      if (data.data instanceof Blob) {
        this.handleBlobResponse(data);
      } else {
        this.requestBlob();
      }
    } else if (this.messageHandlers[cmd]) {
      this.messageHandlers[cmd](data);
    }
  }

  async loadWeights(networkSize) {
    this.validateNetworkSize(networkSize);
    if (this.weightsCache.has(networkSize)) {
      return this.weightsCache.get(networkSize);
    }
    const network = this.networks[networkSize];
    const response = await fetch(network.weightsUrl);
    if (!response.ok)
      throw new Error(`Failed to fetch weights: ${response.statusText}`);
    const weights = await response.json();
    this.weightsCache.set(networkSize, weights);
    return weights;
  }

  static loadImageMetadata(arrayBuffer, mimeType) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([arrayBuffer], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };

      img.src = url;
    });
  }

  static loadVideoMetadata(file, timeoutMs) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = url;

      const timeout = setTimeout(() => reject(new Error("Timeout")), timeoutMs);

      video.onloadedmetadata = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          duration: video.duration,
        });
      };

      video.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load video"));
      };
    });
  }

  createOffscreenCanvas(width, height, scale = 2) {
    const factor = typeof scale === "number" && scale > 0 ? scale : 1;
    const canvas = document.createElement("canvas");
    canvas.width = width * factor;
    canvas.height = height * factor;
    if (typeof canvas.transferControlToOffscreen !== "function") {
      throw new Error("OffscreenCanvas is not supported in this environment");
    }
    return canvas.transferControlToOffscreen();
  }

  createBlobPromise(blobType, timeout) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (this.messageHandlers[blobType]) {
          delete this.messageHandlers[blobType];
          reject(new Error(`${blobType} processing timeout`));
        }
      }, timeout);

      this.messageHandlers[blobType] = (msg) => {
        delete this.messageHandlers[blobType];
        clearTimeout(timeoutId);
        const blob = msg[blobType] || msg.data;
        if (blob instanceof Blob) {
          resolve(blob);
        } else {
          reject(new Error(`Invalid ${blobType} format`));
        }
      };
    });
  }

  validateNetworkSize(size) {
    if (!this.networks[size]) {
      throw new Error(
        "Invalid networkSize: use one of " +
          Object.keys(this.networks).join(", "),
      );
    }
  }

  async upscaleImage(imageFile, networkSize, scaleOverride) {
    if (!imageFile) throw new Error("Image file is required");
    const size = networkSize || this.networkSize;
    this.validateNetworkSize(size);

    this.processingType = "image";
    const arrayBuffer = await imageFile.arrayBuffer();
    const mimeType = imageFile.type || "image/jpeg";
    const { width, height } = await Upscaler.loadImageMetadata(
      arrayBuffer,
      mimeType,
    );


    const weights = await this.loadWeights(size);
    const network = this.networks[size];
    const scale =
      typeof scaleOverride === "number" && scaleOverride > 0
        ? scaleOverride
        : this.imageScale;
    const [canvasUp, canvasOrig] = [
      this.createOffscreenCanvas(width, height, scale),
      this.createOffscreenCanvas(width, height, 1),
    ];

    const blobPromise = this.createBlobPromise(
      "imageBlob",
      this.timeouts.IMAGE,
    );

    this.getWorker().postMessage(
      {
        cmd: "init",
        data: {
          imageArrayBuffer: arrayBuffer,
          imageMimeType: mimeType,
          upscaled: canvasUp,
          original: canvasOrig,
          resolution: { width, height },
          network_name: network.name,
          weights,
        },
      },
      [canvasUp, canvasOrig],
    );

    setTimeout(() => {
      this.getWorker().postMessage({
        cmd: "network",
        data: {
          name: network.name,
          imageArrayBuffer: arrayBuffer,
          imageMimeType: mimeType,
          weights,
        },
      });

      setTimeout(() => {
        this.getWorker().postMessage({
          cmd: "getImageBlob",
          data: { imageArrayBuffer: arrayBuffer, imageMimeType: mimeType },
        });
      }, this.delays.NETWORK);
    }, this.delays.INIT);

    return blobPromise;
  }

  async upscaleVideo(videoFile, networkSize, scaleOverride) {
    if (!videoFile) throw new Error("Video file is required");
    const size = networkSize || this.networkSize;
    this.validateNetworkSize(size);

    if (!Upscaler.isVideoSupported()) {
      throw new Error("WebCodecs API not supported. Requires Chrome 94+");
    }

    this.processingType = "video";
    const { width, height, duration } = await Upscaler.loadVideoMetadata(
      videoFile,
      this.timeouts.METADATA,
    );


    const weights = await this.loadWeights(size);
    const network = this.networks[size];
    const scale =
      typeof scaleOverride === "number" && scaleOverride > 0
        ? scaleOverride
        : this.videoScale;
    const [canvasOut, canvasIn] = [
      this.createOffscreenCanvas(width, height, scale),
      this.createOffscreenCanvas(width, height, 1),
    ];

    const blobPromise = this.createBlobPromise(
      "videoBlob",
      this.timeouts.VIDEO,
    );

    this.getWorker().postMessage(
      {
        cmd: "process",
        file: videoFile,
        fileSize: videoFile.size,
        duration,
        adjustedResolution: {
          adjustedInputWidth: width,
          adjustedInputHeight: height,
          adjustedOutputWidth: width * scale,
          adjustedOutputHeight: height * scale,
        },
        upscaled: canvasOut,
        original: canvasIn,
        weights,
        network_name: network.name,
        skipDemuxProgress: true,
      },
      [canvasOut, canvasIn],
    );

    return blobPromise;
  }

  async startRealtimeUpscale(
    videoElement,
    canvasElement,
    networkSize,
    scaleOverride,
  ) {
    if (!videoElement || !canvasElement) {
      throw new Error("videoElement and canvasElement are required");
    }

    const size = networkSize || this.networkSize;
    this.validateNetworkSize(size);

    const network = this.networks[size];
    const weights = await this.loadWeights(size);

    const scale =
      typeof scaleOverride === "number" && scaleOverride > 0
        ? scaleOverride
        : this.videoScale;

    const ensureMetadata = () => {
      return new Promise((resolve, reject) => {
        if (videoElement.readyState >= 1) {
          resolve();
          return;
        }
        const onLoaded = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error("Failed to load video metadata"));
        };
        const cleanup = () => {
          videoElement.removeEventListener("loadedmetadata", onLoaded);
          videoElement.removeEventListener("error", onError);
        };
        videoElement.addEventListener("loadedmetadata", onLoaded);
        videoElement.addEventListener("error", onError);
      });
    };

    await ensureMetadata();

    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    if (!width || !height) {
      throw new Error("Invalid video dimensions");
    }


    canvasElement.width = width * scale;
    canvasElement.height = height * scale;

    if (typeof canvasElement.transferControlToOffscreen !== "function") {
      throw new Error("OffscreenCanvas is not supported in this environment");
    }

    const offscreen = canvasElement.transferControlToOffscreen();


    if (this.realtimeLoopId) {
      cancelAnimationFrame(this.realtimeLoopId);
      this.realtimeLoopId = null;
    }

    this.getWorker().postMessage(
      {
        cmd: "realtimeInit",
        data: {
          upscaled: offscreen,
          resolution: {
            width,
            height,
            scale,
            outputWidth: width * scale,
            outputHeight: height * scale,
          },
          network_name: network.name,
          weights,
        },
      },
      [offscreen],
    );


    this.realtimeState = {
      running: true,
      video: videoElement,
      canvas: canvasElement,
      scale,
      busy: false,
      frameIndex: 0,
    };

    const loop = async () => {
      if (!this.realtimeState || !this.realtimeState.running) return;
      const state = this.realtimeState;
      const v = state.video;

      if (!v.paused && !v.ended && !state.busy) {
        state.busy = true;
        try {
          const frame = await createImageBitmap(v);
          state.frameIndex += 1;
          
          this.getWorker().postMessage(
            {
              cmd: "realtimeFrame",
              frame,
            },
            [frame],
          );
        } catch (e) {
          console.warn("realtimeFrame error", e);
        } finally {
          if (this.realtimeState) {
            this.realtimeState.busy = false;
          }
        }
      }

      this.realtimeLoopId = requestAnimationFrame(loop);
    };

    this.realtimeLoopId = requestAnimationFrame(loop);
  }

  stopRealtimeUpscale() {
    if (this.realtimeLoopId) {
      cancelAnimationFrame(this.realtimeLoopId);
      this.realtimeLoopId = null;
    }
    if (this.realtimeState) {
      this.realtimeState.running = false;
      this.realtimeState = null;
    }
  }

  async downloadUpscaled(file, networkSize, filename = null) {
    const isVideo = file.type.startsWith("video");
    const size = networkSize || this.networkSize;
    const blob = isVideo
      ? await this.upscaleVideo(file, size)
      : await this.upscaleImage(file, size);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download =
      filename || `upscaled_${Date.now()}.${isVideo ? "mp4" : "png"}`;
    link.click();
    URL.revokeObjectURL(url);
    return blob;
  }

  getSupportedNetworks() {
    return Object.keys(this.networks);
  }

  static async getGPUCapability() {
    try {
      if (navigator.gpu) {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          const buffer = adapter.limits.maxStorageBufferBindingSize / 512;
          const texture = 8192 * 8192;
          return Math.min(buffer, texture);
        }
      }
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2");
      if (gl) return gl.getParameter(gl.MAX_TEXTURE_SIZE) ** 2;
      return 8388608;
    } catch {
      return 8388608;
    }
  }

  static getBackendType() {
    try {
      if (navigator.gpu) return "webgpu";
      if (document.createElement("canvas").getContext("webgl2")) return "webgl";
      return "unknown";
    } catch {
      return "unknown";
    }
  }

  getAppState() {
    return {
      backend: Upscaler.getBackendType(),
      isProcessing: false,
      progress: 0,
      width: 0,
      height: 0,
    };
  }

  onProgress(callback) {
    if (typeof callback === "function") {
      this.progressCallback = callback;
    }
  }

  dispose() {
    this.stopRealtimeUpscale();
    if (this.workerInstance) {
      this.workerInstance.terminate();
      this.workerInstance = null;
    }
    this.messageHandlers = {};
    this.progressCallback = null;
    this.processingType = null;
    this.weightsCache.clear();
  }
}