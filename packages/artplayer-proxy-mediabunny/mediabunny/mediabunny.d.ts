/// <reference types="dom-mediacapture-transform" />
/// <reference types="dom-webcodecs" />

/**
 * ADTS input format singleton.
 * @group Input formats
 * @public
 */
export declare const ADTS: AdtsInputFormat;

/**
 * ADTS file format.
 *
 * Do not instantiate this class; use the {@link ADTS} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class AdtsInputFormat extends InputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * ADTS file format.
 * @group Output formats
 * @public
 */
export declare class AdtsOutputFormat extends OutputFormat {
    /** Creates a new {@link AdtsOutputFormat} configured with the specified `options`. */
    constructor(options?: AdtsOutputFormatOptions);
    getSupportedTrackCounts(): TrackCountLimits;
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
    get supportsVideoRotationMetadata(): boolean;
}

/**
 * ADTS-specific output options.
 * @group Output formats
 * @public
 */
export declare type AdtsOutputFormatOptions = {
    /**
     * Will be called for each ADTS frame that is written.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onFrame?: (data: Uint8Array, position: number) => unknown;
};

/**
 * List of all input format singletons. If you don't need to support all input formats, you should specify the
 * formats individually for better tree shaking.
 * @group Input formats
 * @public
 */
export declare const ALL_FORMATS: InputFormat[];

/**
 * List of all track types.
 * @group Miscellaneous
 * @public
 */
export declare const ALL_TRACK_TYPES: readonly ["video", "audio", "subtitle"];

/**
 * Sync or async iterable.
 * @group Miscellaneous
 * @public
 */
export declare type AnyIterable<T> = Iterable<T> | AsyncIterable<T>;

/**
 * A file attached to a media file.
 *
 * @group Metadata tags
 * @public
 */
export declare class AttachedFile {
    /** The raw file data. */
    data: Uint8Array;
    /** An RFC 6838 MIME type (e.g. image/jpeg, image/png, font/ttf, etc.) */
    mimeType?: string | undefined;
    /** The name of the file. */
    name?: string | undefined;
    /** A description of the file. */
    description?: string | undefined;
    /** Creates a new {@link AttachedFile}. */
    constructor(
    /** The raw file data. */
    data: Uint8Array, 
    /** An RFC 6838 MIME type (e.g. image/jpeg, image/png, font/ttf, etc.) */
    mimeType?: string | undefined, 
    /** The name of the file. */
    name?: string | undefined, 
    /** A description of the file. */
    description?: string | undefined);
}

/**
 * An embedded image such as cover art, booklet scan, artwork or preview frame.
 *
 * @group Metadata tags
 * @public
 */
export declare type AttachedImage = {
    /** The raw image data. */
    data: Uint8Array;
    /** An RFC 6838 MIME type (e.g. image/jpeg, image/png, etc.) */
    mimeType: string;
    /** The kind or purpose of the image. */
    kind: 'coverFront' | 'coverBack' | 'unknown';
    /** The name of the image file. */
    name?: string;
    /** A description of the image. */
    description?: string;
};

/**
 * List of known audio codecs, ordered by encoding preference.
 * @group Codecs
 * @public
 */
export declare const AUDIO_CODECS: readonly ["aac", "opus", "mp3", "vorbis", "flac", "pcm-s16", "pcm-s16be", "pcm-s24", "pcm-s24be", "pcm-s32", "pcm-s32be", "pcm-f32", "pcm-f32be", "pcm-f64", "pcm-f64be", "pcm-u8", "pcm-s8", "ulaw", "alaw"];

/**
 * A sink that retrieves decoded audio samples from an audio track and converts them to `AudioBuffer` instances. This is
 * often more useful than directly retrieving audio samples, as audio buffers can be directly used with the
 * Web Audio API.
 * @group Media sinks
 * @public
 */
export declare class AudioBufferSink {
    /** Creates a new {@link AudioBufferSink} for the given {@link InputAudioTrack}. */
    constructor(audioTrack: InputAudioTrack);
    /**
     * Retrieves the audio buffer corresponding to the given timestamp, in seconds. More specifically, returns
     * the last audio buffer (in presentation order) with a start timestamp less than or equal to the given timestamp.
     * Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */
    getBuffer(timestamp: number): Promise<WrappedAudioBuffer | null>;
    /**
     * Creates an async iterator that yields audio buffers of this track in presentation order. This method
     * will intelligently pre-decode a few buffers ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding buffers (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding buffers (exclusive).
     */
    buffers(startTimestamp?: number, endTimestamp?: number): AsyncGenerator<WrappedAudioBuffer, void, unknown>;
    /**
     * Creates an async iterator that yields an audio buffer for each timestamp in the argument. This method
     * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
     * once, and is therefore more efficient than manually getting the buffer for every timestamp. The iterator may
     * yield null if no buffer is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */
    buffersAtTimestamps(timestamps: AnyIterable<number>): AsyncGenerator<WrappedAudioBuffer | null, void, unknown>;
}

/**
 * This source can be used to add audio data from an AudioBuffer to the output track. This is useful when working with
 * the Web Audio API.
 * @group Media sources
 * @public
 */
export declare class AudioBufferSource extends AudioSource {
    /**
     * Creates a new {@link AudioBufferSource} whose `AudioBuffer` instances are encoded according to the specified
     * {@link AudioEncodingConfig}.
     */
    constructor(encodingConfig: AudioEncodingConfig);
    /**
     * Converts an AudioBuffer to audio samples, encodes them and adds them to the output. The first AudioBuffer will
     * be played at timestamp 0, and any subsequent AudioBuffer will have a timestamp equal to the total duration of
     * all previous AudioBuffers.
     *
     * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
     * to respect writer and encoder backpressure.
     */
    add(audioBuffer: AudioBuffer): Promise<void>;
}

/**
 * Union type of known audio codecs.
 * @group Codecs
 * @public
 */
export declare type AudioCodec = typeof AUDIO_CODECS[number];

/**
 * Additional options that control audio encoding.
 * @group Encoding
 * @public
 */
export declare type AudioEncodingAdditionalOptions = {
    /** Configures the bitrate mode. */
    bitrateMode?: 'constant' | 'variable';
    /**
     * The full codec string as specified in the WebCodecs Codec Registry. This string must match the codec
     * specified in `codec`. When not set, a fitting codec string will be constructed automatically by the library.
     */
    fullCodecString?: string;
};

/**
 * Configuration object that controls audio encoding. Can be used to set codec, quality, and more.
 * @group Encoding
 * @public
 */
export declare type AudioEncodingConfig = {
    /** The audio codec that should be used for encoding the audio samples. */
    codec: AudioCodec;
    /**
     * The target bitrate for the encoded audio, in bits per second. Alternatively, a subjective {@link Quality} can
     * be provided. Required for compressed audio codecs, unused for PCM codecs.
     */
    bitrate?: number | Quality;
    /** Called for each successfully encoded packet. Both the packet and the encoding metadata are passed. */
    onEncodedPacket?: (packet: EncodedPacket, meta: EncodedAudioChunkMetadata | undefined) => unknown;
    /**
     * Called when the internal [encoder config](https://www.w3.org/TR/webcodecs/#audio-encoder-config), as used by the
     * WebCodecs API, is created.
     */
    onEncoderConfig?: (config: AudioEncoderConfig) => unknown;
} & AudioEncodingAdditionalOptions;

/**
 * Represents a raw, unencoded audio sample. Mainly used as an expressive wrapper around WebCodecs API's
 * [`AudioData`](https://developer.mozilla.org/en-US/docs/Web/API/AudioData), but can also be used standalone.
 * @group Samples
 * @public
 */
export declare class AudioSample implements Disposable {
    /**
     * The audio sample format.
     * [See sample formats](https://developer.mozilla.org/en-US/docs/Web/API/AudioData/format)
     */
    readonly format: AudioSampleFormat;
    /** The audio sample rate in hertz. */
    readonly sampleRate: number;
    /**
     * The number of audio frames in the sample, per channel. In other words, the length of this audio sample in frames.
     */
    readonly numberOfFrames: number;
    /** The number of audio channels. */
    readonly numberOfChannels: number;
    /** The duration of the sample in seconds. */
    readonly duration: number;
    /**
     * The presentation timestamp of the sample in seconds. May be negative. Samples with negative end timestamps should
     * not be presented.
     */
    readonly timestamp: number;
    /** The presentation timestamp of the sample in microseconds. */
    get microsecondTimestamp(): number;
    /** The duration of the sample in microseconds. */
    get microsecondDuration(): number;
    /**
     * Creates a new {@link AudioSample}, either from an existing
     * [`AudioData`](https://developer.mozilla.org/en-US/docs/Web/API/AudioData) or from raw bytes specified in
     * {@link AudioSampleInit}.
     */
    constructor(init: AudioData | AudioSampleInit);
    /** Returns the number of bytes required to hold the audio sample's data as specified by the given options. */
    allocationSize(options: AudioSampleCopyToOptions): number;
    /** Copies the audio sample's data to an ArrayBuffer or ArrayBufferView as specified by the given options. */
    copyTo(destination: AllowSharedBufferSource, options: AudioSampleCopyToOptions): void;
    /** Clones this audio sample. */
    clone(): AudioSample;
    /**
     * Closes this audio sample, releasing held resources. Audio samples should be closed as soon as they are not
     * needed anymore.
     */
    close(): void;
    /**
     * Converts this audio sample to an AudioData for use with the WebCodecs API. The AudioData returned by this
     * method *must* be closed separately from this audio sample.
     */
    toAudioData(): AudioData;
    /** Convert this audio sample to an AudioBuffer for use with the Web Audio API. */
    toAudioBuffer(): AudioBuffer;
    /** Sets the presentation timestamp of this audio sample, in seconds. */
    setTimestamp(newTimestamp: number): void;
    /** Calls `.close()`. */
    [Symbol.dispose](): void;
    /**
     * Creates AudioSamples from an AudioBuffer, starting at the given timestamp in seconds. Typically creates exactly
     * one sample, but may create multiple if the AudioBuffer is exceedingly large.
     */
    static fromAudioBuffer(audioBuffer: AudioBuffer, timestamp: number): AudioSample[];
}

/**
 * Options used for copying audio sample data.
 * @group Samples
 * @public
 */
export declare type AudioSampleCopyToOptions = {
    /**
     * The index identifying the plane to copy from. This must be 0 if using a non-planar (interleaved) output format.
     */
    planeIndex: number;
    /**
     * The output format for the destination data. Defaults to the AudioSample's format.
     * [See sample formats](https://developer.mozilla.org/en-US/docs/Web/API/AudioData/format)
     */
    format?: AudioSampleFormat;
    /** An offset into the source plane data indicating which frame to begin copying from. Defaults to 0. */
    frameOffset?: number;
    /**
     * The number of frames to copy. If not provided, the copy will include all frames in the plane beginning
     * with frameOffset.
     */
    frameCount?: number;
};

/**
 * Metadata used for AudioSample initialization.
 * @group Samples
 * @public
 */
export declare type AudioSampleInit = {
    /** The audio data for this sample. */
    data: AllowSharedBufferSource;
    /**
     * The audio sample format. [See sample formats](https://developer.mozilla.org/en-US/docs/Web/API/AudioData/format)
     */
    format: AudioSampleFormat;
    /** The number of audio channels. */
    numberOfChannels: number;
    /** The audio sample rate in hertz. */
    sampleRate: number;
    /** The presentation timestamp of the sample in seconds. */
    timestamp: number;
};

/**
 * Sink for retrieving decoded audio samples from an audio track.
 * @group Media sinks
 * @public
 */
export declare class AudioSampleSink extends BaseMediaSampleSink<AudioSample> {
    /** Creates a new {@link AudioSampleSink} for the given {@link InputAudioTrack}. */
    constructor(audioTrack: InputAudioTrack);
    /**
     * Retrieves the audio sample corresponding to the given timestamp, in seconds. More specifically, returns
     * the last audio sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
     * Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */
    getSample(timestamp: number): Promise<AudioSample | null>;
    /**
     * Creates an async iterator that yields the audio samples of this track in presentation order. This method
     * will intelligently pre-decode a few samples ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
     */
    samples(startTimestamp?: number, endTimestamp?: number): AsyncGenerator<AudioSample, void, unknown>;
    /**
     * Creates an async iterator that yields an audio sample for each timestamp in the argument. This method
     * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
     * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
     * yield null if no sample is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */
    samplesAtTimestamps(timestamps: AnyIterable<number>): AsyncGenerator<AudioSample | null, void, unknown>;
}

/**
 * This source can be used to add raw, unencoded audio samples to an output audio track. These samples will
 * automatically be encoded and then piped into the output.
 * @group Media sources
 * @public
 */
export declare class AudioSampleSource extends AudioSource {
    /**
     * Creates a new {@link AudioSampleSource} whose samples are encoded according to the specified
     * {@link AudioEncodingConfig}.
     */
    constructor(encodingConfig: AudioEncodingConfig);
    /**
     * Encodes an audio sample and then adds it to the output.
     *
     * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
     * to respect writer and encoder backpressure.
     */
    add(audioSample: AudioSample): Promise<void>;
}

/**
 * Base class for audio sources - sources for audio tracks.
 * @group Media sources
 * @public
 */
export declare abstract class AudioSource extends MediaSource_2 {
    /** Internal constructor. */
    constructor(codec: AudioCodec);
}

/**
 * Additional metadata for audio tracks.
 * @group Output files
 * @public
 */
export declare type AudioTrackMetadata = BaseTrackMetadata & {};

/**
 * Base class for decoded media sample sinks.
 * @group Media sinks
 * @public
 */
export declare abstract class BaseMediaSampleSink<MediaSample extends VideoSample | AudioSample> {
}

/**
 * Base track metadata, applicable to all tracks.
 * @group Output files
 * @public
 */
export declare type BaseTrackMetadata = {
    /** The three-letter, ISO 639-2/T language code specifying the language of this track. */
    languageCode?: string;
    /** A user-defined name for this track, like "English" or "Director Commentary". */
    name?: string;
    /** The track's disposition, i.e. information about its intended usage. */
    disposition?: Partial<TrackDisposition>;
    /**
     * The maximum amount of encoded packets that will be added to this track. Setting this field provides the muxer
     * with an additional signal that it can use to preallocate space in the file.
     *
     * When this field is set, it is an error to provide more packets than whatever this field specifies.
     *
     * Predicting the maximum packet count requires considering both the maximum duration as well as the codec.
     * - For video codecs, you can assume one packet per frame.
     * - For audio codecs, there is one packet for each "audio chunk", the duration of which depends on the codec. For
     * simplicity, you can assume each packet is roughly 10 ms or 512 samples long, whichever is shorter.
     * - For subtitles, assume each cue and each gap in the subtitles adds a packet.
     *
     * If you're not fully sure, make sure to add a buffer of around 33% to make sure you stay below the maximum.
     */
    maximumPacketCount?: number;
};

/**
 * A source backed by a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob). Since a
 * [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) is also a `Blob`, this is the source to use when
 * reading files off the disk.
 * @group Input sources
 * @public
 */
export declare class BlobSource extends Source {
    /**
     * Creates a new {@link BlobSource} backed by the specified
     * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
     */
    constructor(blob: Blob, options?: BlobSourceOptions);
}

/**
 * Options for {@link BlobSource}.
 * @group Input sources
 * @public
 */
export declare type BlobSourceOptions = {
    /** The maximum number of bytes the cache is allowed to hold in memory. Defaults to 8 MiB. */
    maxCacheSize?: number;
};

/**
 * A source backed by an ArrayBuffer or ArrayBufferView, with the entire file held in memory.
 * @group Input sources
 * @public
 */
declare class BufferSource_2 extends Source {
    /**
     * Creates a new {@link BufferSource} backed by the specified `ArrayBuffer`, `SharedArrayBuffer`,
     * or `ArrayBufferView`.
     */
    constructor(buffer: AllowSharedBufferSource);
}
export { BufferSource_2 as BufferSource }

/**
 * A target that writes data directly into an ArrayBuffer in memory. Great for performance, but not suitable for very
 * large files. The buffer will be available once the output has been finalized.
 * @group Output targets
 * @public
 */
export declare class BufferTarget extends Target {
    /** Stores the final output buffer. Until the output is finalized, this will be `null`. */
    buffer: ArrayBuffer | null;
}

/**
 * Checks if the browser is able to encode the given codec.
 * @group Encoding
 * @public
 */
export declare const canEncode: (codec: MediaCodec) => Promise<boolean>;

/**
 * Checks if the browser is able to encode the given audio codec with the given parameters.
 * @group Encoding
 * @public
 */
export declare const canEncodeAudio: (codec: AudioCodec, options?: {
    numberOfChannels?: number;
    sampleRate?: number;
    bitrate?: number | Quality;
} & AudioEncodingAdditionalOptions) => Promise<boolean>;

/**
 * Checks if the browser is able to encode the given subtitle codec.
 * @group Encoding
 * @public
 */
export declare const canEncodeSubtitles: (codec: SubtitleCodec) => Promise<boolean>;

/**
 * Checks if the browser is able to encode the given video codec with the given parameters.
 * @group Encoding
 * @public
 */
export declare const canEncodeVideo: (codec: VideoCodec, options?: {
    width?: number;
    height?: number;
    bitrate?: number | Quality;
} & VideoEncodingAdditionalOptions) => Promise<boolean>;

/**
 * A sink that renders video samples (frames) of the given video track to canvases. This is often more useful than
 * directly retrieving frames, as it comes with common preprocessing steps such as resizing or applying rotation
 * metadata.
 *
 * This sink will yield `HTMLCanvasElement`s when in a DOM context, and `OffscreenCanvas`es otherwise.
 *
 * @group Media sinks
 * @public
 */
export declare class CanvasSink {
    /** Creates a new {@link CanvasSink} for the given {@link InputVideoTrack}. */
    constructor(videoTrack: InputVideoTrack, options?: CanvasSinkOptions);
    /**
     * Retrieves a canvas with the video frame corresponding to the given timestamp, in seconds. More specifically,
     * returns the last video frame (in presentation order) with a start timestamp less than or equal to the given
     * timestamp. Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */
    getCanvas(timestamp: number): Promise<WrappedCanvas | null>;
    /**
     * Creates an async iterator that yields canvases with the video frames of this track in presentation order. This
     * method will intelligently pre-decode a few frames ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding canvases (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding canvases (exclusive).
     */
    canvases(startTimestamp?: number, endTimestamp?: number): AsyncGenerator<WrappedCanvas, void, unknown>;
    /**
     * Creates an async iterator that yields a canvas for each timestamp in the argument. This method uses an optimized
     * decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most once, and is
     * therefore more efficient than manually getting the canvas for every timestamp. The iterator may yield null if
     * no frame is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */
    canvasesAtTimestamps(timestamps: AnyIterable<number>): AsyncGenerator<WrappedCanvas | null, void, unknown>;
}

/**
 * Options for constructing a CanvasSink.
 * @group Media sinks
 * @public
 */
export declare type CanvasSinkOptions = {
    /**
     * Whether the output canvases should have transparency instead of a black background. Defaults to `false`. Set
     * this to `true` when using this sink to read transparent videos.
     */
    alpha?: boolean;
    /**
     * The width of the output canvas in pixels, defaulting to the display width of the video track. If height is not
     * set, it will be deduced automatically based on aspect ratio.
     */
    width?: number;
    /**
     * The height of the output canvas in pixels, defaulting to the display height of the video track. If width is not
     * set, it will be deduced automatically based on aspect ratio.
     */
    height?: number;
    /**
     * The fitting algorithm in case both width and height are set.
     *
     * - `'fill'` will stretch the image to fill the entire box, potentially altering aspect ratio.
     * - `'contain'` will contain the entire image within the box while preserving aspect ratio. This may lead to
     * letterboxing.
     * - `'cover'` will scale the image until the entire box is filled, while preserving aspect ratio.
     */
    fit?: 'fill' | 'contain' | 'cover';
    /**
     * The clockwise rotation by which to rotate the raw video frame. Defaults to the rotation set in the file metadata.
     * Rotation is applied before resizing.
     */
    rotation?: Rotation;
    /**
     * Specifies the rectangular region of the input video to crop to. The crop region will automatically be clamped to
     * the dimensions of the input video track. Cropping is performed after rotation but before resizing.
     */
    crop?: CropRectangle;
    /**
     * When set, specifies the number of canvases in the pool. These canvases will be reused in a ring buffer /
     * round-robin type fashion. This keeps the amount of allocated VRAM constant and relieves the browser from
     * constantly allocating/deallocating canvases. A pool size of 0 or `undefined` disables the pool and means a new
     * canvas is created each time.
     */
    poolSize?: number;
};

/**
 * This source can be used to add video frames to the output track from a fixed canvas element. Since canvases are often
 * used for rendering, this source provides a convenient wrapper around {@link VideoSampleSource}.
 * @group Media sources
 * @public
 */
export declare class CanvasSource extends VideoSource {
    /**
     * Creates a new {@link CanvasSource} from a canvas element or `OffscreenCanvas` whose samples are encoded
     * according to the specified {@link VideoEncodingConfig}.
     */
    constructor(canvas: HTMLCanvasElement | OffscreenCanvas, encodingConfig: VideoEncodingConfig);
    /**
     * Captures the current canvas state as a video sample (frame), encodes it and adds it to the output.
     *
     * @param timestamp - The timestamp of the sample, in seconds.
     * @param duration - The duration of the sample, in seconds.
     *
     * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
     * to respect writer and encoder backpressure.
     */
    add(timestamp: number, duration?: number, encodeOptions?: VideoEncoderEncodeOptions): Promise<void>;
}

/**
 * Represents a media file conversion process, used to convert one media file into another. In addition to conversion,
 * this class can be used to resize and rotate video, resample audio, drop tracks, or trim to a specific time range.
 * @group Conversion
 * @public
 */
export declare class Conversion {
    /** The input file. */
    readonly input: Input;
    /** The output file. */
    readonly output: Output;
    /**
     * A callback that is fired whenever the conversion progresses. Returns a number between 0 and 1, indicating the
     * completion of the conversion. Note that a progress of 1 doesn't necessarily mean the conversion is complete;
     * the conversion is complete once `execute()` resolves.
     *
     * In order for progress to be computed, this property must be set before `execute` is called.
     */
    onProgress?: (progress: number) => unknown;
    /**
     * Whether this conversion, as it has been configured, is valid and can be executed. If this field is `false`, check
     * the `discardedTracks` field for reasons.
     */
    isValid: boolean;
    /** The list of tracks that are included in the output file. */
    readonly utilizedTracks: InputTrack[];
    /** The list of tracks from the input file that have been discarded, alongside the discard reason. */
    readonly discardedTracks: DiscardedTrack[];
    /** Initializes a new conversion process without starting the conversion. */
    static init(options: ConversionOptions): Promise<Conversion>;
    /** Creates a new Conversion instance (duh). */
    private constructor();
    /**
     * Executes the conversion process. Resolves once conversion is complete.
     *
     * Will throw if `isValid` is `false`.
     */
    execute(): Promise<void>;
    /** Cancels the conversion process. Does nothing if the conversion is already complete. */
    cancel(): Promise<void>;
}

/**
 * Audio-specific options.
 * @group Conversion
 * @public
 */
export declare type ConversionAudioOptions = {
    /** If `true`, all audio tracks will be discarded and will not be present in the output. */
    discard?: boolean;
    /** The desired channel count of the output audio. */
    numberOfChannels?: number;
    /** The desired sample rate of the output audio, in hertz. */
    sampleRate?: number;
    /** The desired output audio codec. */
    codec?: AudioCodec;
    /** The desired bitrate of the output audio. */
    bitrate?: number | Quality;
    /** When `true`, audio will always be re-encoded instead of directly copying over the encoded samples. */
    forceTranscode?: boolean;
    /**
     * Allows for custom user-defined processing of audio samples, e.g. for applying audio effects, transformations, or
     * timestamp modifications. Will be called for each input audio sample after remixing and resampling.
     *
     * Must return an {@link AudioSample}, an array of them, or `null` for dropping the sample.
     *
     * This function can also be used to manually perform remixing or resampling. When doing so, you should signal the
     * post-process parameters using the `processedNumberOfChannels` and `processedSampleRate` fields, which enables the
     * encoder to better know what to expect. If these fields aren't set, Mediabunny will assume you won't perform
     * remixing or resampling.
     */
    process?: (sample: AudioSample) => MaybePromise<AudioSample | AudioSample[] | null>;
    /**
     * An optional hint specifying the channel count of audio samples returned by the `process` function, for better
     * encoder configuration.
     */
    processedNumberOfChannels?: number;
    /**
     * An optional hint specifying the sample rate of audio samples returned by the `process` function, for better
     * encoder configuration.
     */
    processedSampleRate?: number;
};

/**
 * The options for media file conversion.
 * @group Conversion
 * @public
 */
export declare type ConversionOptions = {
    /** The input file. */
    input: Input;
    /** The output file. */
    output: Output;
    /**
     * Video-specific options. When passing an object, the same options are applied to all video tracks. When passing a
     * function, it will be invoked for each video track and is expected to return or resolve to the options
     * for that specific track. The function is passed an instance of {@link InputVideoTrack} as well as a number `n`,
     * which is the 1-based index of the track in the list of all video tracks.
     */
    video?: ConversionVideoOptions | ((track: InputVideoTrack, n: number) => MaybePromise<ConversionVideoOptions | undefined>);
    /**
     * Audio-specific options. When passing an object, the same options are applied to all audio tracks. When passing a
     * function, it will be invoked for each audio track and is expected to return or resolve to the options
     * for that specific track. The function is passed an instance of {@link InputAudioTrack} as well as a number `n`,
     * which is the 1-based index of the track in the list of all audio tracks.
     */
    audio?: ConversionAudioOptions | ((track: InputAudioTrack, n: number) => MaybePromise<ConversionAudioOptions | undefined>);
    /** Options to trim the input file. */
    trim?: {
        /**
         * The time in the input file in seconds at which the output file should start. Must be less than `end`.
         * Defaults to 0 when omitted.
         */
        start?: number;
        /**
         * The time in the input file in seconds at which the output file should end. Must be greater than `start`.
         * Defaults to the duration of the input when omitted.
         */
        end?: number;
    };
    /**
     * An object or a callback that returns or resolves to an object containing the descriptive metadata tags that
     * should be written to the output file. If a function is passed, it will be passed the tags of the input file as
     * its first argument, allowing you to modify, augment or extend them.
     *
     * If no function is set, the input's metadata tags will be copied to the output.
     */
    tags?: MetadataTags | ((inputTags: MetadataTags) => MaybePromise<MetadataTags>);
    /**
     * Whether to show potential console warnings about discarded tracks after calling `Conversion.init()`, defaults to
     * `true`. Set this to `false` if you're properly handling the `discardedTracks` and `isValid` fields already and
     * want to keep the console output clean.
     */
    showWarnings?: boolean;
};

/**
 * Video-specific options.
 * @group Conversion
 * @public
 */
export declare type ConversionVideoOptions = {
    /** If `true`, all video tracks will be discarded and will not be present in the output. */
    discard?: boolean;
    /**
     * The desired width of the output video in pixels, defaulting to the video's natural display width. If height
     * is not set, it will be deduced automatically based on aspect ratio.
     */
    width?: number;
    /**
     * The desired height of the output video in pixels, defaulting to the video's natural display height. If width
     * is not set, it will be deduced automatically based on aspect ratio.
     */
    height?: number;
    /**
     * The fitting algorithm in case both width and height are set, or if the input video changes its size over time.
     *
     * - `'fill'` will stretch the image to fill the entire box, potentially altering aspect ratio.
     * - `'contain'` will contain the entire image within the box while preserving aspect ratio. This may lead to
     * letterboxing.
     * - `'cover'` will scale the image until the entire box is filled, while preserving aspect ratio.
     */
    fit?: 'fill' | 'contain' | 'cover';
    /**
     * The angle in degrees to rotate the input video by, clockwise. Rotation is applied before cropping and resizing.
     * This rotation is _in addition to_ the natural rotation of the input video as specified in input file's metadata.
     */
    rotate?: Rotation;
    /**
     * Defaults to `true`. When enabaled, Mediabunny will use the rotation metadata in the output file to perform video
     * rotation whenever possible. Set this field to `false` if you want to ensure the output file does not make use of
     * rotation metadata and that any rotation is baked into the video frames directly.
     */
    allowRotationMetadata?: boolean;
    /**
     * Specifies the rectangular region of the input video to crop to. The crop region will automatically be clamped to
     * the dimensions of the input video track. Cropping is performed after rotation but before resizing.
     */
    crop?: {
        /** The distance in pixels from the left edge of the source frame to the left edge of the crop rectangle. */
        left: number;
        /** The distance in pixels from the top edge of the source frame to the top edge of the crop rectangle. */
        top: number;
        /** The width in pixels of the crop rectangle. */
        width: number;
        /** The height in pixels of the crop rectangle. */
        height: number;
    };
    /**
     * The desired frame rate of the output video, in hertz. If not specified, the original input frame rate will
     * be used (which may be variable).
     */
    frameRate?: number;
    /** The desired output video codec. */
    codec?: VideoCodec;
    /** The desired bitrate of the output video. */
    bitrate?: number | Quality;
    /**
     * Whether to discard or keep the transparency information of the input video. The default is `'discard'`. Note that
     * for `'keep'` to produce a transparent video, you must use an output config that supports it, such as WebM with
     * VP9.
     */
    alpha?: 'discard' | 'keep';
    /**
     * The interval, in seconds, of how often frames are encoded as a key frame. The default is 5 seconds. Frequent key
     * frames improve seeking behavior but increase file size. When using multiple video tracks, you should give them
     * all the same key frame interval.
     *
     * Setting this fields forces a transcode.
     */
    keyFrameInterval?: number;
    /** When `true`, video will always be re-encoded instead of directly copying over the encoded samples. */
    forceTranscode?: boolean;
    /**
     * Allows for custom user-defined processing of video frames, e.g. for applying overlays, color transformations, or
     * timestamp modifications. Will be called for each input video sample after transformations and frame rate
     * corrections.
     *
     * Must return a {@link VideoSample} or a `CanvasImageSource`, an array of them, or `null` for dropping the frame.
     * When non-timestamped data is returned, the timestamp and duration from the source sample will be used. Rotation
     * metadata of the returned sample will be ignored.
     *
     * This function can also be used to manually resize frames. When doing so, you should signal the post-process
     * dimensions using the `processedWidth` and `processedHeight` fields, which enables the encoder to better know what
     * to expect. If these fields aren't set, Mediabunny will assume you won't perform any resizing.
     */
    process?: (sample: VideoSample) => MaybePromise<CanvasImageSource | VideoSample | (CanvasImageSource | VideoSample)[] | null>;
    /**
     * An optional hint specifying the width of video samples returned by the `process` function, for better
     * encoder configuration.
     */
    processedWidth?: number;
    /**
     * An optional hint specifying the height of video samples returned by the `process` function, for better
     * encoder configuration.
     */
    processedHeight?: number;
};

/**
 * Specifies the rectangular cropping region.
 * @group Miscellaneous
 * @public
 */
export declare type CropRectangle = {
    /** The distance in pixels from the left edge of the source frame to the left edge of the crop rectangle. */
    left: number;
    /** The distance in pixels from the top edge of the source frame to the top edge of the crop rectangle. */
    top: number;
    /** The width in pixels of the crop rectangle. */
    width: number;
    /** The height in pixels of the crop rectangle. */
    height: number;
};

/**
 * Base class for custom audio decoders. To add your own custom audio decoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the decoder using {@link registerDecoder}.
 * @group Custom coders
 * @public
 */
export declare abstract class CustomAudioDecoder {
    /** The input audio's codec. */
    readonly codec: AudioCodec;
    /** The input audio's decoder config. */
    readonly config: AudioDecoderConfig;
    /** The callback to call when a decoded AudioSample is available. */
    readonly onSample: (sample: AudioSample) => unknown;
    /** Returns true if and only if the decoder can decode the given codec configuration. */
    static supports(codec: AudioCodec, config: AudioDecoderConfig): boolean;
    /** Called after decoder creation; can be used for custom initialization logic. */
    abstract init(): MaybePromise<void>;
    /** Decodes the provided encoded packet. */
    abstract decode(packet: EncodedPacket): MaybePromise<void>;
    /** Decodes all remaining packets and then resolves. */
    abstract flush(): MaybePromise<void>;
    /** Called when the decoder is no longer needed and its resources can be freed. */
    abstract close(): MaybePromise<void>;
}

/**
 * Base class for custom audio encoders. To add your own custom audio encoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the encoder using {@link registerEncoder}.
 * @group Custom coders
 * @public
 */
export declare abstract class CustomAudioEncoder {
    /** The codec with which to encode the audio. */
    readonly codec: AudioCodec;
    /** Config for the encoder. */
    readonly config: AudioEncoderConfig;
    /** The callback to call when an EncodedPacket is available. */
    readonly onPacket: (packet: EncodedPacket, meta?: EncodedAudioChunkMetadata) => unknown;
    /** Returns true if and only if the encoder can encode the given codec configuration. */
    static supports(codec: AudioCodec, config: AudioEncoderConfig): boolean;
    /** Called after encoder creation; can be used for custom initialization logic. */
    abstract init(): MaybePromise<void>;
    /** Encodes the provided audio sample. */
    abstract encode(audioSample: AudioSample): MaybePromise<void>;
    /** Encodes all remaining audio samples and then resolves. */
    abstract flush(): MaybePromise<void>;
    /** Called when the encoder is no longer needed and its resources can be freed. */
    abstract close(): MaybePromise<void>;
}

/**
 * Base class for custom video decoders. To add your own custom video decoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the decoder using {@link registerDecoder}.
 * @group Custom coders
 * @public
 */
export declare abstract class CustomVideoDecoder {
    /** The input video's codec. */
    readonly codec: VideoCodec;
    /** The input video's decoder config. */
    readonly config: VideoDecoderConfig;
    /** The callback to call when a decoded VideoSample is available. */
    readonly onSample: (sample: VideoSample) => unknown;
    /** Returns true if and only if the decoder can decode the given codec configuration. */
    static supports(codec: VideoCodec, config: VideoDecoderConfig): boolean;
    /** Called after decoder creation; can be used for custom initialization logic. */
    abstract init(): MaybePromise<void>;
    /** Decodes the provided encoded packet. */
    abstract decode(packet: EncodedPacket): MaybePromise<void>;
    /** Decodes all remaining packets and then resolves. */
    abstract flush(): MaybePromise<void>;
    /** Called when the decoder is no longer needed and its resources can be freed. */
    abstract close(): MaybePromise<void>;
}

/**
 * Base class for custom video encoders. To add your own custom video encoder, extend this class, implement the
 * abstract methods and static `supports` method, and register the encoder using {@link registerEncoder}.
 * @group Custom coders
 * @public
 */
export declare abstract class CustomVideoEncoder {
    /** The codec with which to encode the video. */
    readonly codec: VideoCodec;
    /** Config for the encoder. */
    readonly config: VideoEncoderConfig;
    /** The callback to call when an EncodedPacket is available. */
    readonly onPacket: (packet: EncodedPacket, meta?: EncodedVideoChunkMetadata) => unknown;
    /** Returns true if and only if the encoder can encode the given codec configuration. */
    static supports(codec: VideoCodec, config: VideoEncoderConfig): boolean;
    /** Called after encoder creation; can be used for custom initialization logic. */
    abstract init(): MaybePromise<void>;
    /** Encodes the provided video sample. */
    abstract encode(videoSample: VideoSample, options: VideoEncoderEncodeOptions): MaybePromise<void>;
    /** Encodes all remaining video samples and then resolves. */
    abstract flush(): MaybePromise<void>;
    /** Called when the encoder is no longer needed and its resources can be freed. */
    abstract close(): MaybePromise<void>;
}

/**
 * An input track that was discarded (excluded) from a {@link Conversion} alongside the discard reason.
 * @group Conversion
 * @public
 */
export declare type DiscardedTrack = {
    /** The track that was discarded. */
    track: InputTrack;
    /**
     * The reason for discarding the track.
     *
     * - `'discarded_by_user'`: You discarded this track by setting `discard: true`.
     * - `'max_track_count_reached'`: The output had no more room for another track.
     * - `'max_track_count_of_type_reached'`: The output had no more room for another track of this type, or the output
     * doesn't support this track type at all.
     * - `'unknown_source_codec'`: We don't know the codec of the input track and therefore don't know what to do
     * with it.
     * - `'undecodable_source_codec'`: The input track's codec is known, but we are unable to decode it.
     * - `'no_encodable_target_codec'`: We can't find a codec that we are able to encode and that can be contained
     * within the output format. This reason can be hit if the environment doesn't support the necessary encoders, or if
     * you requested a codec that cannot be contained within the output format.
     */
    reason: 'discarded_by_user' | 'max_track_count_reached' | 'max_track_count_of_type_reached' | 'unknown_source_codec' | 'undecodable_source_codec' | 'no_encodable_target_codec';
};

/**
 * The most basic audio source; can be used to directly pipe encoded packets into the output file.
 * @group Media sources
 * @public
 */
export declare class EncodedAudioPacketSource extends AudioSource {
    /** Creates a new {@link EncodedAudioPacketSource} whose packets are encoded using `codec`. */
    constructor(codec: AudioCodec);
    /**
     * Adds an encoded packet to the output audio track. Packets must be added in *decode order*.
     *
     * @param meta - Additional metadata from the encoder. You should pass this for the first call, including a valid
     * decoder config.
     *
     * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
     * to respect writer and encoder backpressure.
     */
    add(packet: EncodedPacket, meta?: EncodedAudioChunkMetadata): Promise<void>;
}

/**
 * Represents an encoded chunk of media. Mainly used as an expressive wrapper around WebCodecs API's
 * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) and
 * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk), but can also be used
 * standalone.
 * @group Packets
 * @public
 */
export declare class EncodedPacket {
    /** The encoded data of this packet. */
    readonly data: Uint8Array;
    /** The type of this packet. */
    readonly type: PacketType;
    /**
     * The presentation timestamp of this packet in seconds. May be negative. Samples with negative end timestamps
     * should not be presented.
     */
    readonly timestamp: number;
    /** The duration of this packet in seconds. */
    readonly duration: number;
    /**
     * The sequence number indicates the decode order of the packets. Packet A  must be decoded before packet B if A
     * has a lower sequence number than B. If two packets have the same sequence number, they are the same packet.
     * Otherwise, sequence numbers are arbitrary and are not guaranteed to have any meaning besides their relative
     * ordering. Negative sequence numbers mean the sequence number is undefined.
     */
    readonly sequenceNumber: number;
    /**
     * The actual byte length of the data in this packet. This field is useful for metadata-only packets where the
     * `data` field contains no bytes.
     */
    readonly byteLength: number;
    /** Additional data carried with this packet. */
    readonly sideData: EncodedPacketSideData;
    /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
    constructor(
    /** The encoded data of this packet. */
    data: Uint8Array, 
    /** The type of this packet. */
    type: PacketType, 
    /**
     * The presentation timestamp of this packet in seconds. May be negative. Samples with negative end timestamps
     * should not be presented.
     */
    timestamp: number, 
    /** The duration of this packet in seconds. */
    duration: number, 
    /**
     * The sequence number indicates the decode order of the packets. Packet A  must be decoded before packet B if A
     * has a lower sequence number than B. If two packets have the same sequence number, they are the same packet.
     * Otherwise, sequence numbers are arbitrary and are not guaranteed to have any meaning besides their relative
     * ordering. Negative sequence numbers mean the sequence number is undefined.
     */
    sequenceNumber?: number, byteLength?: number, sideData?: EncodedPacketSideData);
    /**
     * If this packet is a metadata-only packet. Metadata-only packets don't contain their packet data. They are the
     * result of retrieving packets with {@link PacketRetrievalOptions.metadataOnly} set to `true`.
     */
    get isMetadataOnly(): boolean;
    /** The timestamp of this packet in microseconds. */
    get microsecondTimestamp(): number;
    /** The duration of this packet in microseconds. */
    get microsecondDuration(): number;
    /** Converts this packet to an
     * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
     * WebCodecs API. */
    toEncodedVideoChunk(): EncodedVideoChunk;
    /**
     * Converts this packet to an
     * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
     * WebCodecs API, using the alpha side data instead of the color data. Throws if no alpha side data is defined.
     */
    alphaToEncodedVideoChunk(type?: PacketType): EncodedVideoChunk;
    /** Converts this packet to an
     * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk) for use with the
     * WebCodecs API. */
    toEncodedAudioChunk(): EncodedAudioChunk;
    /**
     * Creates an {@link EncodedPacket} from an
     * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) or
     * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk). This method is useful
     * for converting chunks from the WebCodecs API to `EncodedPacket` instances.
     */
    static fromEncodedChunk(chunk: EncodedVideoChunk | EncodedAudioChunk, sideData?: EncodedPacketSideData): EncodedPacket;
    /** Clones this packet while optionally updating timing information. */
    clone(options?: {
        /** The timestamp of the cloned packet in seconds. */
        timestamp?: number;
        /** The duration of the cloned packet in seconds. */
        duration?: number;
    }): EncodedPacket;
}

/**
 * Holds additional data accompanying an {@link EncodedPacket}.
 * @group Packets
 * @public
 */
export declare type EncodedPacketSideData = {
    /**
     * An encoded alpha frame, encoded with the same codec as the packet. Typically used for transparent videos, where
     * the alpha information is stored separately from the color information.
     */
    alpha?: Uint8Array;
    /**
     * The actual byte length of the alpha data. This field is useful for metadata-only packets where the
     * `alpha` field contains no bytes.
     */
    alphaByteLength?: number;
};

/**
 * Sink for retrieving encoded packets from an input track.
 * @group Media sinks
 * @public
 */
export declare class EncodedPacketSink {
    /** Creates a new {@link EncodedPacketSink} for the given {@link InputTrack}. */
    constructor(track: InputTrack);
    /**
     * Retrieves the track's first packet (in decode order), or null if it has no packets. The first packet is very
     * likely to be a key packet.
     */
    getFirstPacket(options?: PacketRetrievalOptions): Promise<EncodedPacket | null>;
    /**
     * Retrieves the packet corresponding to the given timestamp, in seconds. More specifically, returns the last packet
     * (in presentation order) with a start timestamp less than or equal to the given timestamp. This method can be
     * used to retrieve a track's last packet using `getPacket(Infinity)`. The method returns null if the timestamp
     * is before the first packet in the track.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */
    getPacket(timestamp: number, options?: PacketRetrievalOptions): Promise<EncodedPacket | null>;
    /**
     * Retrieves the packet following the given packet (in decode order), or null if the given packet is the
     * last packet.
     */
    getNextPacket(packet: EncodedPacket, options?: PacketRetrievalOptions): Promise<EncodedPacket | null>;
    /**
     * Retrieves the key packet corresponding to the given timestamp, in seconds. More specifically, returns the last
     * key packet (in presentation order) with a start timestamp less than or equal to the given timestamp. A key packet
     * is a packet that doesn't require previous packets to be decoded. This method can be used to retrieve a track's
     * last key packet using `getKeyPacket(Infinity)`. The method returns null if the timestamp is before the first
     * key packet in the track.
     *
     * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */
    getKeyPacket(timestamp: number, options?: PacketRetrievalOptions): Promise<EncodedPacket | null>;
    /**
     * Retrieves the key packet following the given packet (in decode order), or null if the given packet is the last
     * key packet.
     *
     * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
     */
    getNextKeyPacket(packet: EncodedPacket, options?: PacketRetrievalOptions): Promise<EncodedPacket | null>;
    /**
     * Creates an async iterator that yields the packets in this track in decode order. To enable fast iteration, this
     * method will intelligently preload packets based on the speed of the consumer.
     *
     * @param startPacket - (optional) The packet from which iteration should begin. This packet will also be yielded.
     * @param endTimestamp - (optional) The timestamp at which iteration should end. This packet will _not_ be yielded.
     */
    packets(startPacket?: EncodedPacket, endPacket?: EncodedPacket, options?: PacketRetrievalOptions): AsyncGenerator<EncodedPacket, void, unknown>;
}

/**
 * The most basic video source; can be used to directly pipe encoded packets into the output file.
 * @group Media sources
 * @public
 */
export declare class EncodedVideoPacketSource extends VideoSource {
    /** Creates a new {@link EncodedVideoPacketSource} whose packets are encoded using `codec`. */
    constructor(codec: VideoCodec);
    /**
     * Adds an encoded packet to the output video track. Packets must be added in *decode order*, while a packet's
     * timestamp must be its *presentation timestamp*. B-frames are handled automatically.
     *
     * @param meta - Additional metadata from the encoder. You should pass this for the first call, including a valid
     * decoder config.
     *
     * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
     * to respect writer and encoder backpressure.
     */
    add(packet: EncodedPacket, meta?: EncodedVideoChunkMetadata): Promise<void>;
}

/**
 * A source backed by a path to a file. Intended for server-side usage in Node, Bun, or Deno.
 *
 * Make sure to call `.dispose()` on the corresponding {@link Input} when done to explicitly free the internal file
 * handle acquired by this source.
 * @group Input sources
 * @public
 */
export declare class FilePathSource extends Source {
    /** Creates a new {@link FilePathSource} backed by the file at the specified file path. */
    constructor(filePath: string, options?: FilePathSourceOptions);
}

/**
 * Options for {@link FilePathSource}.
 * @group Input sources
 * @public
 */
export declare type FilePathSourceOptions = {
    /** The maximum number of bytes the cache is allowed to hold in memory. Defaults to 8 MiB. */
    maxCacheSize?: number;
};

/**
 * A target that writes to a file at the specified path. Intended for server-side usage in Node, Bun, or Deno.
 *
 * Writing is chunked by default. The internally held file handle will be closed when `.finalize()` or `.cancel()` are
 * called on the corresponding {@link Output}.
 * @group Output targets
 * @public
 */
export declare class FilePathTarget extends Target {
    /** Creates a new {@link FilePathTarget} that writes to the file at the specified file path. */
    constructor(filePath: string, options?: FilePathTargetOptions);
}

/**
 * Options for {@link FilePathTarget}.
 * @group Output targets
 * @public
 */
export declare type FilePathTargetOptions = StreamTargetOptions;

/**
 * FLAC input format singleton.
 * @group Input formats
 * @public
 */
export declare const FLAC: FlacInputFormat;

/**
 * FLAC file format.
 *
 * Do not instantiate this class; use the {@link FLAC} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class FlacInputFormat extends InputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * FLAC file format.
 * @group Output formats
 * @public
 */
export declare class FlacOutputFormat extends OutputFormat {
    /** Creates a new {@link FlacOutputFormat} configured with the specified `options`. */
    constructor(options?: FlacOutputFormatOptions);
    getSupportedTrackCounts(): TrackCountLimits;
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
    get supportsVideoRotationMetadata(): boolean;
}

/**
 * FLAC-specific output options.
 * @group Output formats
 * @public
 */
export declare type FlacOutputFormatOptions = {
    /**
     * Will be called for each FLAC frame that is written.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onFrame?: (data: Uint8Array, position: number) => unknown;
};

/**
 * Returns the list of all audio codecs that can be encoded by the browser.
 * @group Encoding
 * @public
 */
export declare const getEncodableAudioCodecs: (checkedCodecs?: AudioCodec[], options?: {
    numberOfChannels?: number;
    sampleRate?: number;
    bitrate?: number | Quality;
}) => Promise<AudioCodec[]>;

/**
 * Returns the list of all media codecs that can be encoded by the browser.
 * @group Encoding
 * @public
 */
export declare const getEncodableCodecs: () => Promise<MediaCodec[]>;

/**
 * Returns the list of all subtitle codecs that can be encoded by the browser.
 * @group Encoding
 * @public
 */
export declare const getEncodableSubtitleCodecs: (checkedCodecs?: SubtitleCodec[]) => Promise<SubtitleCodec[]>;

/**
 * Returns the list of all video codecs that can be encoded by the browser.
 * @group Encoding
 * @public
 */
export declare const getEncodableVideoCodecs: (checkedCodecs?: VideoCodec[], options?: {
    width?: number;
    height?: number;
    bitrate?: number | Quality;
}) => Promise<VideoCodec[]>;

/**
 * Returns the first audio codec from the given list that can be encoded by the browser.
 * @group Encoding
 * @public
 */
export declare const getFirstEncodableAudioCodec: (checkedCodecs: AudioCodec[], options?: {
    numberOfChannels?: number;
    sampleRate?: number;
    bitrate?: number | Quality;
}) => Promise<AudioCodec | null>;

/**
 * Returns the first subtitle codec from the given list that can be encoded by the browser.
 * @group Encoding
 * @public
 */
export declare const getFirstEncodableSubtitleCodec: (checkedCodecs: SubtitleCodec[]) => Promise<SubtitleCodec | null>;

/**
 * Returns the first video codec from the given list that can be encoded by the browser.
 * @group Encoding
 * @public
 */
export declare const getFirstEncodableVideoCodec: (checkedCodecs: VideoCodec[], options?: {
    width?: number;
    height?: number;
    bitrate?: number | Quality;
}) => Promise<VideoCodec | null>;

/**
 * Specifies an inclusive range of integers.
 * @group Miscellaneous
 * @public
 */
export declare type InclusiveIntegerRange = {
    /** The integer cannot be less than this. */
    min: number;
    /** The integer cannot be greater than this. */
    max: number;
};

/**
 * Represents an input media file. This is the root object from which all media read operations start.
 * @group Input files & tracks
 * @public
 */
export declare class Input<S extends Source = Source> implements Disposable {
    /** True if the input has been disposed. */
    get disposed(): boolean;
    /**
     * Creates a new input file from the specified options. No reading operations will be performed until methods are
     * called on this instance.
     */
    constructor(options: InputOptions<S>);
    /**
     * Returns the source from which this input file reads its data. This is the same source that was passed to the
     * constructor.
     */
    get source(): S;
    /**
     * Returns the format of the input file. You can compare this result directly to the {@link InputFormat} singletons
     * or use `instanceof` checks for subset-aware logic (for example, `format instanceof MatroskaInputFormat` is true
     * for both MKV and WebM).
     */
    getFormat(): Promise<InputFormat>;
    /**
     * Computes the duration of the input file, in seconds. More precisely, returns the largest end timestamp among
     * all tracks.
     */
    computeDuration(): Promise<number>;
    /** Returns the list of all tracks of this input file. */
    getTracks(): Promise<InputTrack[]>;
    /** Returns the list of all video tracks of this input file. */
    getVideoTracks(): Promise<InputVideoTrack[]>;
    /** Returns the list of all audio tracks of this input file. */
    getAudioTracks(): Promise<InputAudioTrack[]>;
    /** Returns the primary video track of this input file, or null if there are no video tracks. */
    getPrimaryVideoTrack(): Promise<InputVideoTrack | null>;
    /** Returns the primary audio track of this input file, or null if there are no audio tracks. */
    getPrimaryAudioTrack(): Promise<InputAudioTrack | null>;
    /** Returns the full MIME type of this input file, including track codecs. */
    getMimeType(): Promise<string>;
    /**
     * Returns descriptive metadata tags about the media file, such as title, author, date, cover art, or other
     * attached files.
     */
    getMetadataTags(): Promise<MetadataTags>;
    /**
     * Disposes this input and frees connected resources. When an input is disposed, ongoing read operations will be
     * canceled, all future read operations will fail, any open decoders will be closed, and all ongoing media sink
     * operations will be canceled. Disallowed and canceled operations will throw an {@link InputDisposedError}.
     *
     * You are expected not to use an input after disposing it. While some operations may still work, it is not
     * specified and may change in any future update.
     */
    dispose(): void;
    /**
     * Calls `.dispose()` on the input, implementing the `Disposable` interface for use with
     * JavaScript Explicit Resource Management features.
     */
    [Symbol.dispose](): void;
}

/**
 * Represents an audio track in an input file.
 * @group Input files & tracks
 * @public
 */
export declare class InputAudioTrack extends InputTrack {
    get type(): TrackType;
    get codec(): AudioCodec | null;
    /** The number of audio channels in the track. */
    get numberOfChannels(): number;
    /** The track's audio sample rate in hertz. */
    get sampleRate(): number;
    /**
     * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#audio-decoder-config) for decoding the
     * track's packets using an [`AudioDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/AudioDecoder). Returns
     * null if the track's codec is unknown.
     */
    getDecoderConfig(): Promise<AudioDecoderConfig | null>;
    getCodecParameterString(): Promise<string | null>;
    canDecode(): Promise<boolean>;
    determinePacketType(packet: EncodedPacket): Promise<PacketType | null>;
}

/**
 * Thrown when an operation was prevented because the corresponding {@link Input} has been disposed.
 * @group Input files & tracks
 * @public
 */
export declare class InputDisposedError extends Error {
    /** Creates a new {@link InputDisposedError}. */
    constructor(message?: string);
}

/**
 * Base class representing an input media file format.
 * @group Input formats
 * @public
 */
export declare abstract class InputFormat {
    /** Returns the name of the input format. */
    abstract get name(): string;
    /** Returns the typical base MIME type of the input format. */
    abstract get mimeType(): string;
}

/**
 * The options for creating an Input object.
 * @group Input files & tracks
 * @public
 */
export declare type InputOptions<S extends Source = Source> = {
    /** A list of supported formats. If the source file is not of one of these formats, then it cannot be read. */
    formats: InputFormat[];
    /** The source from which data will be read. */
    source: S;
};

/**
 * Represents a media track in an input file.
 * @group Input files & tracks
 * @public
 */
export declare abstract class InputTrack {
    /** The input file this track belongs to. */
    readonly input: Input;
    /** The type of the track. */
    abstract get type(): TrackType;
    /** The codec of the track's packets. */
    abstract get codec(): MediaCodec | null;
    /** Returns the full codec parameter string for this track. */
    abstract getCodecParameterString(): Promise<string | null>;
    /** Checks if this track's packets can be decoded by the browser. */
    abstract canDecode(): Promise<boolean>;
    /**
     * For a given packet of this track, this method determines the actual type of this packet (key/delta) by looking
     * into its bitstream. Returns null if the type couldn't be determined.
     */
    abstract determinePacketType(packet: EncodedPacket): Promise<PacketType | null>;
    /** Returns true if and only if this track is a video track. */
    isVideoTrack(): this is InputVideoTrack;
    /** Returns true if and only if this track is an audio track. */
    isAudioTrack(): this is InputAudioTrack;
    /** The unique ID of this track in the input file. */
    get id(): number;
    /**
     * The identifier of the codec used internally by the container. It is not homogenized by Mediabunny
     * and depends entirely on the container format.
     *
     * This field can be used to determine the codec of a track in case Mediabunny doesn't know that codec.
     *
     * - For ISOBMFF files, this field returns the name of the Sample Description Box (e.g. `'avc1'`).
     * - For Matroska files, this field returns the value of the `CodecID` element.
     * - For WAVE files, this field returns the value of the format tag in the `'fmt '` chunk.
     * - For ADTS files, this field contains the `MPEG-4 Audio Object Type`.
     * - In all other cases, this field is `null`.
     */
    get internalCodecId(): string | number | Uint8Array<ArrayBufferLike> | null;
    /**
     * The ISO 639-2/T language code for this track. If the language is unknown, this field is `'und'` (undetermined).
     */
    get languageCode(): string;
    /** A user-defined name for this track. */
    get name(): string | null;
    /**
     * A positive number x such that all timestamps and durations of all packets of this track are
     * integer multiples of 1/x.
     */
    get timeResolution(): number;
    /** The track's disposition, i.e. information about its intended usage. */
    get disposition(): TrackDisposition;
    /**
     * Returns the start timestamp of the first packet of this track, in seconds. While often near zero, this value
     * may be positive or even negative. A negative starting timestamp means the track's timing has been offset. Samples
     * with a negative timestamp should not be presented.
     */
    getFirstTimestamp(): Promise<number>;
    /** Returns the end timestamp of the last packet of this track, in seconds. */
    computeDuration(): Promise<number>;
    /**
     * Computes aggregate packet statistics for this track, such as average packet rate or bitrate.
     *
     * @param targetPacketCount - This optional parameter sets a target for how many packets this method must have
     * looked at before it can return early; this means, you can use it to aggregate only a subset (prefix) of all
     * packets. This is very useful for getting a great estimate of video frame rate without having to scan through the
     * entire file.
     */
    computePacketStats(targetPacketCount?: number): Promise<PacketStats>;
}

/**
 * Represents a video track in an input file.
 * @group Input files & tracks
 * @public
 */
export declare class InputVideoTrack extends InputTrack {
    get type(): TrackType;
    get codec(): VideoCodec | null;
    /** The width in pixels of the track's coded samples, before any transformations or rotations. */
    get codedWidth(): number;
    /** The height in pixels of the track's coded samples, before any transformations or rotations. */
    get codedHeight(): number;
    /** The angle in degrees by which the track's frames should be rotated (clockwise). */
    get rotation(): Rotation;
    /** The width in pixels of the track's frames after rotation. */
    get displayWidth(): number;
    /** The height in pixels of the track's frames after rotation. */
    get displayHeight(): number;
    /** Returns the color space of the track's samples. */
    getColorSpace(): Promise<VideoColorSpaceInit>;
    /** If this method returns true, the track's samples use a high dynamic range (HDR). */
    hasHighDynamicRange(): Promise<boolean>;
    /** Checks if this track may contain transparent samples with alpha data. */
    canBeTransparent(): Promise<boolean>;
    /**
     * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#video-decoder-config) for decoding the
     * track's packets using a [`VideoDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder). Returns
     * null if the track's codec is unknown.
     */
    getDecoderConfig(): Promise<VideoDecoderConfig | null>;
    getCodecParameterString(): Promise<string | null>;
    canDecode(): Promise<boolean>;
    determinePacketType(packet: EncodedPacket): Promise<PacketType | null>;
}

/**
 * Format representing files compatible with the ISO base media file format (ISOBMFF), like MP4 or MOV files.
 * @group Input formats
 * @public
 */
export declare abstract class IsobmffInputFormat extends InputFormat {
}

/**
 * Format representing files compatible with the ISO base media file format (ISOBMFF), like MP4 or MOV files.
 * @group Output formats
 * @public
 */
export declare abstract class IsobmffOutputFormat extends OutputFormat {
    /** Internal constructor. */
    constructor(options?: IsobmffOutputFormatOptions);
    getSupportedTrackCounts(): TrackCountLimits;
    get supportsVideoRotationMetadata(): boolean;
}

/**
 * ISOBMFF-specific output options.
 * @group Output formats
 * @public
 */
export declare type IsobmffOutputFormatOptions = {
    /**
     * Controls the placement of metadata in the file. Placing metadata at the start of the file is known as "Fast
     * Start", which results in better playback at the cost of more required processing or memory.
     *
     * Use `false` to disable Fast Start, placing the metadata at the end of the file. Fastest and uses the least
     * memory.
     *
     * Use `'in-memory'` to produce a file with Fast Start by keeping all media chunks in memory until the file is
     * finalized. This produces a high-quality and compact output at the cost of a more expensive finalization step and
     * higher memory requirements. Data will be written monotonically (in order) when this option is set.
     *
     * Use `'reserve'` to reserve space at the start of the file into which the metadata will be written later.	This
     * produces a file with Fast Start but requires knowledge about the expected length of the file beforehand. When
     * using this option, you must set the {@link BaseTrackMetadata.maximumPacketCount} field in the track metadata
     * for all tracks.
     *
     * Use `'fragmented'` to place metadata at the start of the file by creating a fragmented file (fMP4). In a
     * fragmented file, chunks of media and their metadata are written to the file in "fragments", eliminating the need
     * to put all metadata in one place. Fragmented files are useful for streaming contexts, as each fragment can be
     * played individually without requiring knowledge of the other fragments. Furthermore, they remain lightweight to
     * create even for very large files, as they don't require all media to be kept in memory. However, fragmented files
     * are not as widely and wholly supported as regular MP4/MOV files. Data will be written monotonically (in order)
     * when this option is set.
     *
     * When this field is not defined, either `false` or `'in-memory'` will be used, automatically determined based on
     * the type of output target used.
     */
    fastStart?: false | 'in-memory' | 'reserve' | 'fragmented';
    /**
     * When using `fastStart: 'fragmented'`, this field controls the minimum duration of each fragment, in seconds.
     * New fragments will only be created when the current fragment is longer than this value. Defaults to 1 second.
     */
    minimumFragmentDuration?: number;
    /**
     * The metadata format to use for writing metadata tags.
     *
     * - `'auto'` (default): Behaves like `'mdir'` for MP4 and like `'udta'` for QuickTime, matching FFmpeg's default
     * behavior.
     * - `'mdir'`: Write tags into `moov/udta/meta` using the 'mdir' handler format.
     * - `'mdta'`: Write tags into `moov/udta/meta` using the 'mdta' handler format, equivalent to FFmpeg's
     * `use_metadata_tags` flag. This allows for custom keys of arbitrary length.
     * - `'udta'`: Write tags directly into `moov/udta`.
     */
    metadataFormat?: 'auto' | 'mdir' | 'mdta' | 'udta';
    /**
     * Will be called once the ftyp (File Type) box of the output file has been written.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onFtyp?: (data: Uint8Array, position: number) => unknown;
    /**
     * Will be called once the moov (Movie) box of the output file has been written.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onMoov?: (data: Uint8Array, position: number) => unknown;
    /**
     * Will be called for each finalized mdat (Media Data) box of the output file. Usage of this callback is not
     * recommended when not using `fastStart: 'fragmented'`, as there will be one monolithic mdat box which might
     * require large amounts of memory.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onMdat?: (data: Uint8Array, position: number) => unknown;
    /**
     * Will be called for each finalized moof (Movie Fragment) box of the output file.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     * @param timestamp - The start timestamp of the fragment in seconds.
     */
    onMoof?: (data: Uint8Array, position: number, timestamp: number) => unknown;
};

/**
 * Matroska input format singleton.
 * @group Input formats
 * @public
 */
export declare const MATROSKA: MatroskaInputFormat;

/**
 * Matroska file format.
 *
 * Do not instantiate this class; use the {@link MATROSKA} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class MatroskaInputFormat extends InputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * T or a promise that resolves to T.
 * @group Miscellaneous
 * @public
 */
export declare type MaybePromise<T> = T | Promise<T>;

/**
 * Union type of known media codecs.
 * @group Codecs
 * @public
 */
export declare type MediaCodec = VideoCodec | AudioCodec | SubtitleCodec;

/**
 * Base class for media sources. Media sources are used to add media samples to an output file.
 * @group Media sources
 * @public
 */
declare abstract class MediaSource_2 {
    /**
     * Closes this source. This prevents future samples from being added and signals to the output file that no further
     * samples will come in for this track. Calling `.close()` is optional but recommended after adding the
     * last sample - for improved performance and reduced memory usage.
     */
    close(): void;
}
export { MediaSource_2 as MediaSource }

/**
 * Audio source that encodes the data of a
 * [`MediaStreamAudioTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) and pipes it into the
 * output. This is useful for capturing live or real-time audio such as microphones or audio from other media elements.
 * Audio will automatically start being captured once the connected {@link Output} is started, and will keep being
 * captured until the {@link Output} is finalized or this source is closed.
 * @group Media sources
 * @public
 */
export declare class MediaStreamAudioTrackSource extends AudioSource {
    /** A promise that rejects upon any error within this source. This promise never resolves. */
    get errorPromise(): Promise<void>;
    /** Whether this source is currently paused as a result of calling `.pause()`. */
    get paused(): boolean;
    /**
     * Creates a new {@link MediaStreamAudioTrackSource} from a `MediaStreamAudioTrack`, which will pull audio samples
     * from the stream in real time and encode them according to {@link AudioEncodingConfig}.
     */
    constructor(track: MediaStreamAudioTrack, encodingConfig: AudioEncodingConfig);
    /**
     * Pauses the capture of audio data - any audio data emitted by the underlying media stream will be ignored
     * while paused. This does *not* close the underlying `MediaStreamAudioTrack`, it just ignores its output.
     */
    pause(): void;
    /** Resumes the capture of audio data after being paused. */
    resume(): void;
}

/**
 * Video source that encodes the frames of a
 * [`MediaStreamVideoTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack) and pipes them into the
 * output. This is useful for capturing live or real-time data such as webcams or screen captures. Frames will
 * automatically start being captured once the connected {@link Output} is started, and will keep being captured until
 * the {@link Output} is finalized or this source is closed.
 * @group Media sources
 * @public
 */
export declare class MediaStreamVideoTrackSource extends VideoSource {
    /** A promise that rejects upon any error within this source. This promise never resolves. */
    get errorPromise(): Promise<void>;
    /** Whether this source is currently paused as a result of calling `.pause()`. */
    get paused(): boolean;
    /**
     * Creates a new {@link MediaStreamVideoTrackSource} from a
     * [`MediaStreamVideoTrack`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack), which will pull
     * video samples from the stream in real time and encode them according to {@link VideoEncodingConfig}.
     */
    constructor(track: MediaStreamVideoTrack, encodingConfig: VideoEncodingConfig);
    /**
     * Pauses the capture of video frames - any video frames emitted by the underlying media stream will be ignored
     * while paused. This does *not* close the underlying `MediaStreamVideoTrack`, it just ignores its output.
     */
    pause(): void;
    /** Resumes the capture of video frames after being paused. */
    resume(): void;
}

/**
 * Represents descriptive (non-technical) metadata about a media file, such as title, author, date, cover art, or other
 * attached files. Common tags are normalized by Mediabunny into a uniform format, while the `raw` field can be used to
 * directly read or write the underlying metadata tags (which differ by format).
 *
 * - For MP4/QuickTime files, the metadata refers to the data in `'moov'`-level `'udta'` and `'meta'` atoms.
 * - For WebM/Matroska files, the metadata refers to the Tags and Attachments elements whose target is 50 (MOVIE).
 * - For MP3 files, the metadata refers to the ID3v2 or ID3v1 tags.
 * - For Ogg files, there is no global metadata so instead, the metadata refers to the combined metadata of all tracks,
 * in Vorbis-style comment headers.
 * - For WAVE files, the metadata refers to the chunks within the RIFF INFO chunk.
 * - For ADTS files, there is no metadata.
 * - For FLAC files, the metadata lives in Vorbis style in the Vorbis comment block.
 *
 * @group Metadata tags
 * @public
 */
export declare type MetadataTags = {
    /** Title of the media (e.g. Gangnam Style, Titanic, etc.) */
    title?: string;
    /** Short description or subtitle of the media. */
    description?: string;
    /** Primary artist(s) or creator(s) of the work. */
    artist?: string;
    /** Album, collection, or compilation the media belongs to. */
    album?: string;
    /** Main credited artist for the album/collection as a whole. */
    albumArtist?: string;
    /** Position of this track within its album or collection (1-based). */
    trackNumber?: number;
    /** Total number of tracks in the album or collection. */
    tracksTotal?: number;
    /** Disc index if the release spans multiple discs (1-based). */
    discNumber?: number;
    /** Total number of discs in the release. */
    discsTotal?: number;
    /** Genre or category describing the media's style or content (e.g. Metal, Horror, etc.) */
    genre?: string;
    /** Release, recording or creation date of the media. */
    date?: Date;
    /** Full text lyrics or transcript associated with the media. */
    lyrics?: string;
    /** Freeform notes, remarks or commentary about the media. */
    comment?: string;
    /** Embedded images such as cover art, booklet scans, artwork or preview frames. */
    images?: AttachedImage[];
    /**
     * The raw, underlying metadata tags.
     *
     * This field can be used for both reading and writing. When reading, it represents the original tags that were used
     * to derive the normalized fields, and any additional metadata that Mediabunny doesn't understand. When writing, it
     * can be used to set arbitrary metadata tags in the output file.
     *
     * The format of these tags differs per format:
     * - MP4/QuickTime: By default, the keys refer to the names of the individual atoms in the `'ilst'` atom inside the
     * `'meta'` atom, and the values are derived from the content of the `'data'` atom inside them. When a `'keys'` atom
     * is also used, then the keys reflect the keys specified there (such as `'com.apple.quicktime.version'`).
     * Additionally, any atoms within the `'udta'` atom are dumped into here, however with unknown internal format
     * (`Uint8Array`).
     * - WebM/Matroska: `SimpleTag` elements whose target is 50 (MOVIE), either containing string or `Uint8Array`
     * values. Additionally, all attached files (such as font files) are included here, where the key corresponds to
     * the FileUID and the value is an {@link AttachedFile}.
     * - MP3: The ID3v2 tags, or a single `'TAG'` key with the contents of the ID3v1 tag.
     * - Ogg: The key-value string pairs from the Vorbis-style comment header (see RFC 7845, Section 5.2).
     * Additionally, the `'vendor'` key refers to the vendor string within this header.
     * - WAVE: The individual metadata chunks within the RIFF INFO chunk. Values are always ISO 8859-1 strings.
     * - FLAC: The key-value string pairs from the vorbis metadata block (see RFC 9639, Section D.2.3).
     * Additionally, the `'vendor'` key refers to the vendor string within this header.
     */
    raw?: Record<string, string | Uint8Array | RichImageData | AttachedFile | null>;
};

/**
 * Matroska file format.
 *
 * Supports writing transparent video. For a video track to be marked as transparent, the first packet added must
 * contain alpha side data.
 *
 * @group Output formats
 * @public
 */
export declare class MkvOutputFormat extends OutputFormat {
    /** Creates a new {@link MkvOutputFormat} configured with the specified `options`. */
    constructor(options?: MkvOutputFormatOptions);
    getSupportedTrackCounts(): TrackCountLimits;
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
    get supportsVideoRotationMetadata(): boolean;
}

/**
 * Matroska-specific output options.
 * @group Output formats
 * @public
 */
export declare type MkvOutputFormatOptions = {
    /**
     * Configures the output to only append new data at the end, useful for live-streaming the file as it's being
     * created. When enabled, some features such as storing duration and seeking will be disabled or impacted, so don't
     * use this option when you want to write out a clean file for later use.
     */
    appendOnly?: boolean;
    /**
     * This field controls the minimum duration of each Matroska cluster, in seconds. New clusters will only be created
     * when the current cluster is longer than this value. Defaults to 1 second.
     */
    minimumClusterDuration?: number;
    /**
     * Will be called once the EBML header of the output file has been written.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onEbmlHeader?: (data: Uint8Array, position: number) => void;
    /**
     * Will be called once the header part of the Matroska Segment element has been written. The header data includes
     * the Segment element and everything inside it, up to (but excluding) the first Matroska Cluster.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onSegmentHeader?: (data: Uint8Array, position: number) => unknown;
    /**
     * Will be called for each finalized Matroska Cluster of the output file.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     * @param timestamp - The start timestamp of the cluster in seconds.
     */
    onCluster?: (data: Uint8Array, position: number, timestamp: number) => unknown;
};

/**
 * QuickTime File Format (QTFF), often called MOV. Supports all video and audio codecs, but not subtitle codecs.
 * @group Output formats
 * @public
 */
export declare class MovOutputFormat extends IsobmffOutputFormat {
    /** Creates a new {@link MovOutputFormat} configured with the specified `options`. */
    constructor(options?: IsobmffOutputFormatOptions);
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
}

/**
 * MP3 input format singleton.
 * @group Input formats
 * @public
 */
export declare const MP3: Mp3InputFormat;

/**
 * MP3 file format.
 *
 * Do not instantiate this class; use the {@link MP3} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class Mp3InputFormat extends InputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * MP3 file format.
 * @group Output formats
 * @public
 */
export declare class Mp3OutputFormat extends OutputFormat {
    /** Creates a new {@link Mp3OutputFormat} configured with the specified `options`. */
    constructor(options?: Mp3OutputFormatOptions);
    getSupportedTrackCounts(): TrackCountLimits;
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
    get supportsVideoRotationMetadata(): boolean;
}

/**
 * MP3-specific output options.
 * @group Output formats
 * @public
 */
export declare type Mp3OutputFormatOptions = {
    /**
     * Controls whether the Xing header, which contains additional metadata as well as an index, is written to the start
     * of the MP3 file. When disabled, the writing process becomes append-only. Defaults to `true`.
     */
    xingHeader?: boolean;
    /**
     * Will be called once the Xing metadata frame is finalized.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     */
    onXingFrame?: (data: Uint8Array, position: number) => unknown;
};

/**
 * MP4 input format singleton.
 * @group Input formats
 * @public
 */
export declare const MP4: Mp4InputFormat;

/**
 * MPEG-4 Part 14 (MP4) file format.
 *
 * Do not instantiate this class; use the {@link MP4} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class Mp4InputFormat extends IsobmffInputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * MPEG-4 Part 14 (MP4) file format. Supports most codecs.
 * @group Output formats
 * @public
 */
export declare class Mp4OutputFormat extends IsobmffOutputFormat {
    /** Creates a new {@link Mp4OutputFormat} configured with the specified `options`. */
    constructor(options?: IsobmffOutputFormatOptions);
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
}

/**
 * List of known compressed audio codecs, ordered by encoding preference.
 * @group Codecs
 * @public
 */
export declare const NON_PCM_AUDIO_CODECS: readonly ["aac", "opus", "mp3", "vorbis", "flac"];

/**
 * This target just discards all incoming data. It is useful for when you need an {@link Output} but extract data from
 * it differently, for example through format-specific callbacks (`onMoof`, `onMdat`, ...) or encoder events.
 * @group Output targets
 * @public
 */
export declare class NullTarget extends Target {
}

/**
 * Ogg input format singleton.
 * @group Input formats
 * @public
 */
export declare const OGG: OggInputFormat;

/**
 * Ogg file format.
 *
 * Do not instantiate this class; use the {@link OGG} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class OggInputFormat extends InputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * Ogg file format.
 * @group Output formats
 * @public
 */
export declare class OggOutputFormat extends OutputFormat {
    /** Creates a new {@link OggOutputFormat} configured with the specified `options`. */
    constructor(options?: OggOutputFormatOptions);
    getSupportedTrackCounts(): TrackCountLimits;
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
    get supportsVideoRotationMetadata(): boolean;
}

/**
 * Ogg-specific output options.
 * @group Output formats
 * @public
 */
export declare type OggOutputFormatOptions = {
    /**
     * Will be called for each Ogg page that is written.
     *
     * @param data - The raw bytes.
     * @param position - The byte offset of the data in the file.
     * @param source - The {@link MediaSource} backing the page's logical bitstream (track).
     */
    onPage?: (data: Uint8Array, position: number, source: MediaSource_2) => unknown;
};

/**
 * Main class orchestrating the creation of a new media file.
 * @group Output files
 * @public
 */
export declare class Output<F extends OutputFormat = OutputFormat, T extends Target = Target> {
    /** The format of the output file. */
    format: F;
    /** The target to which the file will be written. */
    target: T;
    /** The current state of the output. */
    state: 'pending' | 'started' | 'canceled' | 'finalizing' | 'finalized';
    /**
     * Creates a new instance of {@link Output} which can then be used to create a new media file according to the
     * specified {@link OutputOptions}.
     */
    constructor(options: OutputOptions<F, T>);
    /** Adds a video track to the output with the given source. Can only be called before the output is started. */
    addVideoTrack(source: VideoSource, metadata?: VideoTrackMetadata): void;
    /** Adds an audio track to the output with the given source. Can only be called before the output is started. */
    addAudioTrack(source: AudioSource, metadata?: AudioTrackMetadata): void;
    /** Adds a subtitle track to the output with the given source. Can only be called before the output is started. */
    addSubtitleTrack(source: SubtitleSource, metadata?: SubtitleTrackMetadata): void;
    /**
     * Sets descriptive metadata tags about the media file, such as title, author, date, or cover art. When called
     * multiple times, only the metadata from the last call will be used.
     *
     * Can only be called before the output is started.
     */
    setMetadataTags(tags: MetadataTags): void;
    /**
     * Starts the creation of the output file. This method should be called after all tracks have been added. Only after
     * the output has started can media samples be added to the tracks.
     *
     * @returns A promise that resolves when the output has successfully started and is ready to receive media samples.
     */
    start(): Promise<void>;
    /**
     * Resolves with the full MIME type of the output file, including track codecs.
     *
     * The returned promise will resolve only once the precise codec strings of all tracks are known.
     */
    getMimeType(): Promise<string>;
    /**
     * Cancels the creation of the output file, releasing internal resources like encoders and preventing further
     * samples from being added.
     *
     * @returns A promise that resolves once all internal resources have been released.
     */
    cancel(): Promise<void>;
    /**
     * Finalizes the output file. This method must be called after all media samples across all tracks have been added.
     * Once the Promise returned by this method completes, the output file is ready.
     */
    finalize(): Promise<void>;
}

/**
 * Base class representing an output media file format.
 * @group Output formats
 * @public
 */
export declare abstract class OutputFormat {
    /** The file extension used by this output format, beginning with a dot. */
    abstract get fileExtension(): string;
    /** The base MIME type of the output format. */
    abstract get mimeType(): string;
    /** Returns a list of media codecs that this output format can contain. */
    abstract getSupportedCodecs(): MediaCodec[];
    /** Returns the number of tracks that this output format supports. */
    abstract getSupportedTrackCounts(): TrackCountLimits;
    /** Whether this output format supports video rotation metadata. */
    abstract get supportsVideoRotationMetadata(): boolean;
    /** Returns a list of video codecs that this output format can contain. */
    getSupportedVideoCodecs(): VideoCodec[];
    /** Returns a list of audio codecs that this output format can contain. */
    getSupportedAudioCodecs(): AudioCodec[];
    /** Returns a list of subtitle codecs that this output format can contain. */
    getSupportedSubtitleCodecs(): SubtitleCodec[];
}

/**
 * The options for creating an Output object.
 * @group Output files
 * @public
 */
export declare type OutputOptions<F extends OutputFormat = OutputFormat, T extends Target = Target> = {
    /** The format of the output file. */
    format: F;
    /** The target to which the file will be written. */
    target: T;
};

/**
 * Additional options for controlling packet retrieval.
 * @group Media sinks
 * @public
 */
export declare type PacketRetrievalOptions = {
    /**
     * When set to `true`, only packet metadata (like timestamp) will be retrieved - the actual packet data will not
     * be loaded.
     */
    metadataOnly?: boolean;
    /**
     * When set to true, key packets will be verified upon retrieval by looking into the packet's bitstream.
     * If not enabled, the packet types will be determined solely by what's stored in the containing file and may be
     * incorrect, potentially leading to decoder errors. Since determining a packet's actual type requires looking into
     * its data, this option cannot be enabled together with `metadataOnly`.
     */
    verifyKeyPackets?: boolean;
};

/**
 * Contains aggregate statistics about the encoded packets of a track.
 * @group Input files & tracks
 * @public
 */
export declare type PacketStats = {
    /** The total number of packets. */
    packetCount: number;
    /** The average number of packets per second. For video tracks, this will equal the average frame rate (FPS). */
    averagePacketRate: number;
    /** The average number of bits per second. */
    averageBitrate: number;
};

/**
 * The type of a packet. Key packets can be decoded without previous packets, while delta packets depend on previous
 * packets.
 * @group Packets
 * @public
 */
export declare type PacketType = 'key' | 'delta';

/**
 * List of known PCM (uncompressed) audio codecs, ordered by encoding preference.
 * @group Codecs
 * @public
 */
export declare const PCM_AUDIO_CODECS: readonly ["pcm-s16", "pcm-s16be", "pcm-s24", "pcm-s24be", "pcm-s32", "pcm-s32be", "pcm-f32", "pcm-f32be", "pcm-f64", "pcm-f64be", "pcm-u8", "pcm-s8", "ulaw", "alaw"];

/**
 * QuickTime File Format input format singleton.
 * @group Input formats
 * @public
 */
export declare const QTFF: QuickTimeInputFormat;

/**
 * Represents a subjective media quality level.
 * @group Encoding
 * @public
 */
export declare class Quality {
}

/**
 * Represents a high media quality.
 * @group Encoding
 * @public
 */
export declare const QUALITY_HIGH: Quality;

/**
 * Represents a low media quality.
 * @group Encoding
 * @public
 */
export declare const QUALITY_LOW: Quality;

/**
 * Represents a medium media quality.
 * @group Encoding
 * @public
 */
export declare const QUALITY_MEDIUM: Quality;

/**
 * Represents a very high media quality.
 * @group Encoding
 * @public
 */
export declare const QUALITY_VERY_HIGH: Quality;

/**
 * Represents a very low media quality.
 * @group Encoding
 * @public
 */
export declare const QUALITY_VERY_LOW: Quality;

/**
 * QuickTime File Format (QTFF), often called MOV.
 *
 * Do not instantiate this class; use the {@link QTFF} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class QuickTimeInputFormat extends IsobmffInputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * A source backed by a [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) of
 * `Uint8Array`, representing an append-only byte stream of unknown length. This is the source to use for incrementally
 * streaming in input files that are still being constructed and whose size we don't yet know, like for example the
 * output chunks of [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder).
 *
 * This source is *unsized*, meaning calls to `.getSize()` will throw and readers are more limited due to the
 * lack of random file access. You should only use this source with sequential access patterns, such as reading all
 * packets from start to end. This source does not work well with random access patterns unless you increase its
 * max cache size.
 *
 * @group Input sources
 * @public
 */
export declare class ReadableStreamSource extends Source {
    /** Creates a new {@link ReadableStreamSource} backed by the specified `ReadableStream<Uint8Array>`. */
    constructor(stream: ReadableStream<Uint8Array>, options?: ReadableStreamSourceOptions);
}

/**
 * Options for {@link ReadableStreamSource}.
 * @group Input sources
 * @public
 */
export declare type ReadableStreamSourceOptions = {
    /** The maximum number of bytes the cache is allowed to hold in memory. Defaults to 16 MiB. */
    maxCacheSize?: number;
};

/**
 * Registers a custom video or audio decoder. Registered decoders will automatically be used for decoding whenever
 * possible.
 * @group Custom coders
 * @public
 */
export declare const registerDecoder: (decoder: typeof CustomVideoDecoder | typeof CustomAudioDecoder) => void;

/**
 * Registers a custom video or audio encoder. Registered encoders will automatically be used for encoding whenever
 * possible.
 * @group Custom coders
 * @public
 */
export declare const registerEncoder: (encoder: typeof CustomVideoEncoder | typeof CustomAudioEncoder) => void;

/**
 * Image data with additional metadata.
 *
 * @group Metadata tags
 * @public
 */
export declare class RichImageData {
    /** The raw image data. */
    data: Uint8Array;
    /** An RFC 6838 MIME type (e.g. image/jpeg, image/png, etc.) */
    mimeType: string;
    /** Creates a new {@link RichImageData}. */
    constructor(
    /** The raw image data. */
    data: Uint8Array, 
    /** An RFC 6838 MIME type (e.g. image/jpeg, image/png, etc.) */
    mimeType: string);
}

/**
 * Represents a clockwise rotation in degrees.
 * @group Miscellaneous
 * @public
 */
export declare type Rotation = 0 | 90 | 180 | 270;

/**
 * Sets all keys K of T to be required.
 * @group Miscellaneous
 * @public
 */
export declare type SetRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * The source base class, representing a resource from which bytes can be read.
 * @group Input sources
 * @public
 */
export declare abstract class Source {
    /**
     * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
     * will retrieve the size.
     *
     * Returns null if the source is unsized.
     */
    getSizeOrNull(): Promise<number | null>;
    /**
     * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
     * will retrieve the size.
     *
     * Throws an error if the source is unsized.
     */
    getSize(): Promise<number>;
    /** Called each time data is retrieved from the source. Will be called with the retrieved range (end exclusive). */
    onread: ((start: number, end: number) => unknown) | null;
}

/**
 * A general-purpose, callback-driven source that can get its data from anywhere.
 * @group Input sources
 * @public
 */
export declare class StreamSource extends Source {
    /** Creates a new {@link StreamSource} whose behavior is specified by `options`.  */
    constructor(options: StreamSourceOptions);
}

/**
 * Options for defining a {@link StreamSource}.
 * @group Input sources
 * @public
 */
export declare type StreamSourceOptions = {
    /**
     * Called when the size of the entire file is requested. Must return or resolve to the size in bytes. This function
     * is guaranteed to be called before `read`.
     */
    getSize: () => MaybePromise<number>;
    /**
     * Called when data is requested. Must return or resolve to the bytes from the specified byte range, or a stream
     * that yields these bytes.
     */
    read: (start: number, end: number) => MaybePromise<Uint8Array | ReadableStream<Uint8Array>>;
    /**
     * Called when the {@link Input} driven by this source is disposed.
     */
    dispose?: () => unknown;
    /** The maximum number of bytes the cache is allowed to hold in memory. Defaults to 8 MiB. */
    maxCacheSize?: number;
    /**
     * Specifies the prefetch profile that the reader should use with this source. A prefetch profile specifies the
     * pattern with which bytes outside of the requested range are preloaded to reduce latency for future reads.
     *
     * - `'none'` (default): No prefetching; only the data needed in the moment is requested.
     * - `'fileSystem'`: File system-optimized prefetching: a small amount of data is prefetched bidirectionally,
     * aligned with page boundaries.
     * - `'network'`: Network-optimized prefetching, or more generally, prefetching optimized for any high-latency
     * environment: tries to minimize the amount of read calls and aggressively prefetches data when sequential access
     * patterns are detected.
     */
    prefetchProfile?: 'none' | 'fileSystem' | 'network';
};

/**
 * This target writes data to a [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream),
 * making it a general-purpose target for writing data anywhere. It is also compatible with
 * [`FileSystemWritableFileStream`](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemWritableFileStream) for
 * use with the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API). The
 * `WritableStream` can also apply backpressure, which will propagate to the output and throttle the encoders.
 * @group Output targets
 * @public
 */
export declare class StreamTarget extends Target {
    /** Creates a new {@link StreamTarget} which writes to the specified `writable`. */
    constructor(writable: WritableStream<StreamTargetChunk>, options?: StreamTargetOptions);
}

/**
 * A data chunk for {@link StreamTarget}.
 * @group Output targets
 * @public
 */
export declare type StreamTargetChunk = {
    /** The operation type. */
    type: 'write';
    /** The data to write. */
    data: Uint8Array<ArrayBuffer>;
    /** The byte offset in the output file at which to write the data. */
    position: number;
};

/**
 * Options for {@link StreamTarget}.
 * @group Output targets
 * @public
 */
export declare type StreamTargetOptions = {
    /**
     * When setting this to true, data created by the output will first be accumulated and only written out
     * once it has reached sufficient size, using a default chunk size of 16 MiB. This is useful for reducing the total
     * amount of writes, at the cost of latency.
     */
    chunked?: boolean;
    /** When using `chunked: true`, this specifies the maximum size of each chunk. Defaults to 16 MiB. */
    chunkSize?: number;
};

/**
 * List of known subtitle codecs, ordered by encoding preference.
 * @group Codecs
 * @public
 */
export declare const SUBTITLE_CODECS: readonly ["webvtt"];

/**
 * Union type of known subtitle codecs.
 * @group Codecs
 * @public
 */
export declare type SubtitleCodec = typeof SUBTITLE_CODECS[number];

/**
 * Base class for subtitle sources - sources for subtitle tracks.
 * @group Media sources
 * @public
 */
export declare abstract class SubtitleSource extends MediaSource_2 {
    /** Internal constructor. */
    constructor(codec: SubtitleCodec);
}

/**
 * Additional metadata for subtitle tracks.
 * @group Output files
 * @public
 */
export declare type SubtitleTrackMetadata = BaseTrackMetadata & {};

/**
 * Base class for targets, specifying where output files are written.
 * @group Output targets
 * @public
 */
export declare abstract class Target {
    /**
     * Called each time data is written to the target. Will be called with the byte range into which data was written.
     *
     * Use this callback to track the size of the output file as it grows. But be warned, this function is chatty and
     * gets called *extremely* often.
     */
    onwrite: ((start: number, end: number) => unknown) | null;
}

/**
 * This source can be used to add subtitles from a subtitle text file.
 * @group Media sources
 * @public
 */
export declare class TextSubtitleSource extends SubtitleSource {
    /** Creates a new {@link TextSubtitleSource} where added text chunks are in the specified `codec`. */
    constructor(codec: SubtitleCodec);
    /**
     * Parses the subtitle text according to the specified codec and adds it to the output track. You don't have to
     * add the entire subtitle file at once here; you can provide it in chunks.
     *
     * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
     * to respect writer and encoder backpressure.
     */
    add(text: string): Promise<void>;
}

/**
 * Specifies the number of tracks (for each track type and in total) that an output format supports.
 * @group Output formats
 * @public
 */
export declare type TrackCountLimits = {
    [K in TrackType]: InclusiveIntegerRange;
} & {
    /** Specifies the overall allowed range of track counts for the output format. */
    total: InclusiveIntegerRange;
};

/**
 * Specifies a track's disposition, i.e. information about its intended usage.
 * @public
 * @group Miscellaneous
 */
export declare type TrackDisposition = {
    /**
     * Indicates that this track is eligible for automatic selection by a player; that it is the main track among other,
     * non-default tracks of the same type.
     */
    default: boolean;
    /**
     * Indicates that players should always display this track by default, even if it goes against the user's default
     * preferences. For example, a subtitle track only containing translations of foreign-language audio.
     */
    forced: boolean;
    /** Indicates that this track is in the content's original language. */
    original: boolean;
    /** Indicates that this track contains commentary. */
    commentary: boolean;
    /** Indicates that this track is intended for hearing-impaired users. */
    hearingImpaired: boolean;
    /** Indicates that this track is intended for visually-impaired users. */
    visuallyImpaired: boolean;
};

/**
 * Union type of all track types.
 * @group Miscellaneous
 * @public
 */
export declare type TrackType = typeof ALL_TRACK_TYPES[number];

/**
 * A source backed by a URL. This is useful for reading data from the network. Requests will be made using an optimized
 * reading and prefetching pattern to minimize request count and latency.
 * @group Input sources
 * @public
 */
export declare class UrlSource extends Source {
    /** Creates a new {@link UrlSource} backed by the resource at the specified URL. */
    constructor(url: string | URL | Request, options?: UrlSourceOptions);
}

/**
 * Options for {@link UrlSource}.
 * @group Input sources
 * @public
 */
export declare type UrlSourceOptions = {
    /**
     * The [`RequestInit`](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit) used by the Fetch API. Can be
     * used to further control the requests, such as setting custom headers.
     */
    requestInit?: RequestInit;
    /**
     * A function that returns the delay (in seconds) before retrying a failed request. The function is called
     * with the number of previous, unsuccessful attempts, as well as with the error with which the previous request
     * failed. If the function returns `null`, no more retries will be made.
     *
     * By default, it uses an exponential backoff algorithm that never gives up unless
     * a CORS error is suspected (`fetch()` did reject, `navigator.onLine` is true and origin is different)
     */
    getRetryDelay?: (previousAttempts: number, error: unknown, url: string | URL | Request) => number | null;
    /** The maximum number of bytes the cache is allowed to hold in memory. Defaults to 64 MiB. */
    maxCacheSize?: number;
    /**
     * A WHATWG-compatible fetch function. You can use this field to polyfill the `fetch` function, add missing
     * features, or use a custom implementation.
     */
    fetchFn?: typeof fetch;
};

/**
 * List of known video codecs, ordered by encoding preference.
 * @group Codecs
 * @public
 */
export declare const VIDEO_CODECS: readonly ["avc", "hevc", "vp9", "av1", "vp8"];

/**
 * Union type of known video codecs.
 * @group Codecs
 * @public
 */
export declare type VideoCodec = typeof VIDEO_CODECS[number];

/**
 * Additional options that control audio encoding.
 * @group Encoding
 * @public
 */
export declare type VideoEncodingAdditionalOptions = {
    /**
     * What to do with alpha data contained in the video samples.
     *
     * - `'discard'` (default): Only the samples' color data is kept; the video is opaque.
     * - `'keep'`: The samples' alpha data is also encoded as side data. Make sure to pair this mode with a container
     * format that supports transparency (such as WebM or Matroska).
     */
    alpha?: 'discard' | 'keep';
    /** Configures the bitrate mode; defaults to `'variable'`. */
    bitrateMode?: 'constant' | 'variable';
    /**
     * The latency mode used by the encoder; controls the performance-quality tradeoff.
     *
     * - `'quality'` (default): The encoder prioritizes quality over latency, and no frames can be dropped.
     * - `'realtime'`: The encoder prioritizes low latency over quality, and may drop frames if the encoder becomes
     * overloaded to keep up with real-time requirements.
     */
    latencyMode?: 'quality' | 'realtime';
    /**
     * The full codec string as specified in the WebCodecs Codec Registry. This string must match the codec
     * specified in `codec`. When not set, a fitting codec string will be constructed automatically by the library.
     */
    fullCodecString?: string;
    /**
     * A hint that configures the hardware acceleration method of this codec. This is best left on `'no-preference'`,
     * the default.
     */
    hardwareAcceleration?: 'no-preference' | 'prefer-hardware' | 'prefer-software';
    /**
     * An encoding scalability mode identifier as defined by
     * [WebRTC-SVC](https://w3c.github.io/webrtc-svc/#scalabilitymodes*).
     */
    scalabilityMode?: string;
    /**
     * An encoding video content hint as defined by
     * [mst-content-hint](https://w3c.github.io/mst-content-hint/#video-content-hints).
     */
    contentHint?: string;
};

/**
 * Configuration object that controls video encoding. Can be used to set codec, quality, and more.
 * @group Encoding
 * @public
 */
export declare type VideoEncodingConfig = {
    /** The video codec that should be used for encoding the video samples (frames). */
    codec: VideoCodec;
    /**
     * The target bitrate for the encoded video, in bits per second. Alternatively, a subjective {@link Quality} can
     * be provided.
     */
    bitrate: number | Quality;
    /**
     * The interval, in seconds, of how often frames are encoded as a key frame. The default is 5 seconds. Frequent key
     * frames improve seeking behavior but increase file size. When using multiple video tracks, you should give them
     * all the same key frame interval.
     */
    keyFrameInterval?: number;
    /**
     * Video frames may change size over time. This field controls the behavior in case this happens.
     *
     * - `'deny'` (default) will throw an error, requiring all frames to have the exact same dimensions.
     * - `'passThrough'` will allow the change and directly pass the frame to the encoder.
     * - `'fill'` will stretch the image to fill the entire original box, potentially altering aspect ratio.
     * - `'contain'` will contain the entire image within the original box while preserving aspect ratio. This may lead
     * to letterboxing.
     * - `'cover'` will scale the image until the entire original box is filled, while preserving aspect ratio.
     *
     * The "original box" refers to the dimensions of the first encoded frame.
     */
    sizeChangeBehavior?: 'deny' | 'passThrough' | 'fill' | 'contain' | 'cover';
    /** Called for each successfully encoded packet. Both the packet and the encoding metadata are passed. */
    onEncodedPacket?: (packet: EncodedPacket, meta: EncodedVideoChunkMetadata | undefined) => unknown;
    /**
     * Called when the internal [encoder config](https://www.w3.org/TR/webcodecs/#video-encoder-config), as used by the
     * WebCodecs API, is created.
     */
    onEncoderConfig?: (config: VideoEncoderConfig) => unknown;
} & VideoEncodingAdditionalOptions;

/**
 * Represents a raw, unencoded video sample (frame). Mainly used as an expressive wrapper around WebCodecs API's
 * [`VideoFrame`](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame), but can also be used standalone.
 * @group Samples
 * @public
 */
export declare class VideoSample implements Disposable {
    /**
     * The internal pixel format in which the frame is stored.
     * [See pixel formats](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame/format)
     */
    readonly format: VideoPixelFormat | null;
    /** The width of the frame in pixels. */
    readonly codedWidth: number;
    /** The height of the frame in pixels. */
    readonly codedHeight: number;
    /** The rotation of the frame in degrees, clockwise. */
    readonly rotation: Rotation;
    /**
     * The presentation timestamp of the frame in seconds. May be negative. Frames with negative end timestamps should
     * not be presented.
     */
    readonly timestamp: number;
    /** The duration of the frame in seconds. */
    readonly duration: number;
    /** The color space of the frame. */
    readonly colorSpace: VideoColorSpace;
    /** The width of the frame in pixels after rotation. */
    get displayWidth(): number;
    /** The height of the frame in pixels after rotation. */
    get displayHeight(): number;
    /** The presentation timestamp of the frame in microseconds. */
    get microsecondTimestamp(): number;
    /** The duration of the frame in microseconds. */
    get microsecondDuration(): number;
    /**
     * Whether this sample uses a pixel format that can hold transparency data. Note that this doesn't necessarily mean
     * that the sample is transparent.
     */
    get hasAlpha(): boolean | null;
    /**
     * Creates a new {@link VideoSample} from a
     * [`VideoFrame`](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame). This is essentially a near zero-cost
     * wrapper around `VideoFrame`. The sample's metadata is optionally refined using the data specified in `init`.
     */
    constructor(data: VideoFrame, init?: VideoSampleInit);
    /**
     * Creates a new {@link VideoSample} from a
     * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource), similar to the
     * [`VideoFrame`](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame) constructor. When `VideoFrame` is
     * available, this is simply a wrapper around its constructor. If not, it will copy the source's image data to an
     * internal canvas for later use.
     */
    constructor(data: CanvasImageSource, init: SetRequired<VideoSampleInit, 'timestamp'>);
    /**
     * Creates a new {@link VideoSample} from raw pixel data specified in `data`. Additional metadata must be provided
     * in `init`.
     */
    constructor(data: AllowSharedBufferSource, init: SetRequired<VideoSampleInit, 'format' | 'codedWidth' | 'codedHeight' | 'timestamp'>);
    /** Clones this video sample. */
    clone(): VideoSample;
    /**
     * Closes this video sample, releasing held resources. Video samples should be closed as soon as they are not
     * needed anymore.
     */
    close(): void;
    /** Returns the number of bytes required to hold this video sample's pixel data. */
    allocationSize(): number;
    /** Copies this video sample's pixel data to an ArrayBuffer or ArrayBufferView. */
    copyTo(destination: AllowSharedBufferSource): Promise<void>;
    /**
     * Converts this video sample to a VideoFrame for use with the WebCodecs API. The VideoFrame returned by this
     * method *must* be closed separately from this video sample.
     */
    toVideoFrame(): VideoFrame;
    /**
     * Draws the video sample to a 2D canvas context. Rotation metadata will be taken into account.
     *
     * @param dx - The x-coordinate in the destination canvas at which to place the top-left corner of the source image.
     * @param dy - The y-coordinate in the destination canvas at which to place the top-left corner of the source image.
     * @param dWidth - The width in pixels with which to draw the image in the destination canvas.
     * @param dHeight - The height in pixels with which to draw the image in the destination canvas.
     */
    draw(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, dx: number, dy: number, dWidth?: number, dHeight?: number): void;
    /**
     * Draws the video sample to a 2D canvas context. Rotation metadata will be taken into account.
     *
     * @param sx - The x-coordinate of the top left corner of the sub-rectangle of the source image to draw into the
     * destination context.
     * @param sy - The y-coordinate of the top left corner of the sub-rectangle of the source image to draw into the
     * destination context.
     * @param sWidth - The width of the sub-rectangle of the source image to draw into the destination context.
     * @param sHeight - The height of the sub-rectangle of the source image to draw into the destination context.
     * @param dx - The x-coordinate in the destination canvas at which to place the top-left corner of the source image.
     * @param dy - The y-coordinate in the destination canvas at which to place the top-left corner of the source image.
     * @param dWidth - The width in pixels with which to draw the image in the destination canvas.
     * @param dHeight - The height in pixels with which to draw the image in the destination canvas.
     */
    draw(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, sx: number, sy: number, sWidth: number, sHeight: number, dx: number, dy: number, dWidth?: number, dHeight?: number): void;
    /**
     * Draws the sample in the middle of the canvas corresponding to the context with the specified fit behavior.
     */
    drawWithFit(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, options: {
        /**
         * Controls the fitting algorithm.
         *
         * - `'fill'` will stretch the image to fill the entire box, potentially altering aspect ratio.
         * - `'contain'` will contain the entire image within the box while preserving aspect ratio. This may lead to
         * letterboxing.
         * - `'cover'` will scale the image until the entire box is filled, while preserving aspect ratio.
         */
        fit: 'fill' | 'contain' | 'cover';
        /** A way to override rotation. Defaults to the rotation of the sample. */
        rotation?: Rotation;
        /**
         * Specifies the rectangular region of the video sample to crop to. The crop region will automatically be
         * clamped to the dimensions of the video sample. Cropping is performed after rotation but before resizing.
         */
        crop?: CropRectangle;
    }): void;
    /**
     * Converts this video sample to a
     * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource) for drawing to a canvas.
     *
     * You must use the value returned by this method immediately, as any VideoFrame created internally will
     * automatically be closed in the next microtask.
     */
    toCanvasImageSource(): VideoFrame | OffscreenCanvas;
    /** Sets the rotation metadata of this video sample. */
    setRotation(newRotation: Rotation): void;
    /** Sets the presentation timestamp of this video sample, in seconds. */
    setTimestamp(newTimestamp: number): void;
    /** Sets the duration of this video sample, in seconds. */
    setDuration(newDuration: number): void;
    /** Calls `.close()`. */
    [Symbol.dispose](): void;
}

/**
 * Metadata used for VideoSample initialization.
 * @group Samples
 * @public
 */
export declare type VideoSampleInit = {
    /**
     * The internal pixel format in which the frame is stored.
     * [See pixel formats](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame/format)
     */
    format?: VideoPixelFormat;
    /** The width of the frame in pixels. */
    codedWidth?: number;
    /** The height of the frame in pixels. */
    codedHeight?: number;
    /** The rotation of the frame in degrees, clockwise. */
    rotation?: Rotation;
    /** The presentation timestamp of the frame in seconds. */
    timestamp?: number;
    /** The duration of the frame in seconds. */
    duration?: number;
    /** The color space of the frame. */
    colorSpace?: VideoColorSpaceInit;
};

/**
 * A sink that retrieves decoded video samples (video frames) from a video track.
 * @group Media sinks
 * @public
 */
export declare class VideoSampleSink extends BaseMediaSampleSink<VideoSample> {
    /** Creates a new {@link VideoSampleSink} for the given {@link InputVideoTrack}. */
    constructor(videoTrack: InputVideoTrack);
    /**
     * Retrieves the video sample (frame) corresponding to the given timestamp, in seconds. More specifically, returns
     * the last video sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
     * Returns null if the timestamp is before the track's first timestamp.
     *
     * @param timestamp - The timestamp used for retrieval, in seconds.
     */
    getSample(timestamp: number): Promise<VideoSample | null>;
    /**
     * Creates an async iterator that yields the video samples (frames) of this track in presentation order. This method
     * will intelligently pre-decode a few frames ahead to enable fast iteration.
     *
     * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
     * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
     */
    samples(startTimestamp?: number, endTimestamp?: number): AsyncGenerator<VideoSample, void, unknown>;
    /**
     * Creates an async iterator that yields a video sample (frame) for each timestamp in the argument. This method
     * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
     * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
     * yield null if no frame is available for a given timestamp.
     *
     * @param timestamps - An iterable or async iterable of timestamps in seconds.
     */
    samplesAtTimestamps(timestamps: AnyIterable<number>): AsyncGenerator<VideoSample | null, void, unknown>;
}

/**
 * This source can be used to add raw, unencoded video samples (frames) to an output video track. These frames will
 * automatically be encoded and then piped into the output.
 * @group Media sources
 * @public
 */
export declare class VideoSampleSource extends VideoSource {
    /**
     * Creates a new {@link VideoSampleSource} whose samples are encoded according to the specified
     * {@link VideoEncodingConfig}.
     */
    constructor(encodingConfig: VideoEncodingConfig);
    /**
     * Encodes a video sample (frame) and then adds it to the output.
     *
     * @returns A Promise that resolves once the output is ready to receive more samples. You should await this Promise
     * to respect writer and encoder backpressure.
     */
    add(videoSample: VideoSample, encodeOptions?: VideoEncoderEncodeOptions): Promise<void>;
}

/**
 * Base class for video sources - sources for video tracks.
 * @group Media sources
 * @public
 */
export declare abstract class VideoSource extends MediaSource_2 {
    /** Internal constructor. */
    constructor(codec: VideoCodec);
}

/**
 * Additional metadata for video tracks.
 * @group Output files
 * @public
 */
export declare type VideoTrackMetadata = BaseTrackMetadata & {
    /** The angle in degrees by which the track's frames should be rotated (clockwise). */
    rotation?: Rotation;
    /**
     * The expected video frame rate in hertz. If set, all timestamps and durations of this track will be snapped to
     * this frame rate. You should avoid adding more frames than the rate allows, as this will lead to multiple frames
     * with the same timestamp.
     */
    frameRate?: number;
};

/**
 * WAVE input format singleton.
 * @group Input formats
 * @public
 */
export declare const WAVE: WaveInputFormat;

/**
 * WAVE file format, based on RIFF.
 *
 * Do not instantiate this class; use the {@link WAVE} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class WaveInputFormat extends InputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * WAVE file format, based on RIFF.
 * @group Output formats
 * @public
 */
export declare class WavOutputFormat extends OutputFormat {
    /** Creates a new {@link WavOutputFormat} configured with the specified `options`. */
    constructor(options?: WavOutputFormatOptions);
    getSupportedTrackCounts(): TrackCountLimits;
    get fileExtension(): string;
    get mimeType(): string;
    getSupportedCodecs(): MediaCodec[];
    get supportsVideoRotationMetadata(): boolean;
}

/**
 * WAVE-specific output options.
 * @group Output formats
 * @public
 */
export declare type WavOutputFormatOptions = {
    /**
     * When enabled, an RF64 file will be written, allowing for file sizes to exceed 4 GiB, which is otherwise not
     * possible for regular WAVE files.
     */
    large?: boolean;
    /**
     * The metadata format to use for writing metadata tags.
     *
     * - `'info'` (default): Writes metadata into a RIFF INFO LIST chunk, the default way to contain metadata tags
     * within WAVE. Only allows for a limited subset of tags to be written.
     * - `'id3'`: Writes metadata into an ID3 chunk. Non-default, but used by many taggers in practice. Allows for a
     * much larger and richer set of tags to be written.
     */
    metadataFormat?: 'info' | 'id3';
    /**
     * Will be called once the file header is written. The header consists of the RIFF header, the format chunk,
     * metadata chunks, and the start of the data chunk (with a placeholder size of 0).
     */
    onHeader?: (data: Uint8Array, position: number) => unknown;
};

/**
 * WebM input format singleton.
 * @group Input formats
 * @public
 */
export declare const WEBM: WebMInputFormat;

/**
 * WebM file format, based on Matroska.
 *
 * Do not instantiate this class; use the {@link WEBM} singleton instead.
 *
 * @group Input formats
 * @public
 */
export declare class WebMInputFormat extends MatroskaInputFormat {
    get name(): string;
    get mimeType(): string;
}

/**
 * WebM file format, based on Matroska.
 *
 * Supports writing transparent video. For a video track to be marked as transparent, the first packet added must
 * contain alpha side data.
 *
 * @group Output formats
 * @public
 */
export declare class WebMOutputFormat extends MkvOutputFormat {
    /** Creates a new {@link WebMOutputFormat} configured with the specified `options`. */
    constructor(options?: MkvOutputFormatOptions);
    getSupportedCodecs(): MediaCodec[];
    get fileExtension(): string;
    get mimeType(): string;
}

/**
 * WebM-specific output options.
 * @group Output formats
 * @public
 */
export declare type WebMOutputFormatOptions = MkvOutputFormatOptions;

/**
 * An AudioBuffer with additional timing information (timestamp & duration).
 * @group Media sinks
 * @public
 */
export declare type WrappedAudioBuffer = {
    /** An AudioBuffer. */
    buffer: AudioBuffer;
    /** The timestamp of the corresponding audio sample, in seconds. */
    timestamp: number;
    /** The duration of the corresponding audio sample, in seconds. */
    duration: number;
};

/**
 * A canvas with additional timing information (timestamp & duration).
 * @group Media sinks
 * @public
 */
export declare type WrappedCanvas = {
    /** A canvas element or offscreen canvas. */
    canvas: HTMLCanvasElement | OffscreenCanvas;
    /** The timestamp of the corresponding video sample, in seconds. */
    timestamp: number;
    /** The duration of the corresponding video sample, in seconds. */
    duration: number;
};

export { }
export as namespace Mediabunny;
