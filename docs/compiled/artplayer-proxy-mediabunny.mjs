/*!
 * artplayer-proxy-mediabunny.js v1.0.1
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2026 Harvey Zhao
 * Released under the MIT License.
 */
class EventTarget {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  addEventListener(type, fn) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push(fn);
  }
  removeEventListener(type, fn) {
    const list = this.listeners.get(type);
    if (!list)
      return;
    const index = list.indexOf(fn);
    if (index >= 0) {
      list.splice(index, 1);
    }
  }
  emit(type, detail) {
    const evt = new Event(type);
    evt.detail = detail;
    const list = this.listeners.get(type);
    if (list) {
      list.forEach((fn) => fn(evt));
    }
  }
}
function assert(x) {
  if (!x) {
    throw new Error("Assertion failed.");
  }
}
const normalizeRotation = (rotation) => {
  const mappedRotation = (rotation % 360 + 360) % 360;
  if (mappedRotation === 0 || mappedRotation === 90 || mappedRotation === 180 || mappedRotation === 270) {
    return mappedRotation;
  } else {
    throw new Error(`Invalid rotation ${rotation}.`);
  }
};
const last = (arr) => {
  return arr && arr[arr.length - 1];
};
class Bitstream {
  constructor(bytes) {
    this.bytes = bytes;
    this.pos = 0;
  }
  seekToByte(byteOffset) {
    this.pos = 8 * byteOffset;
  }
  readBit() {
    const byteIndex = Math.floor(this.pos / 8);
    const byte = this.bytes[byteIndex] ?? 0;
    const bitIndex = 7 - (this.pos & 7);
    const bit = (byte & 1 << bitIndex) >> bitIndex;
    this.pos++;
    return bit;
  }
  readBits(n) {
    if (n === 1) {
      return this.readBit();
    }
    let result = 0;
    for (let i = 0; i < n; i++) {
      result <<= 1;
      result |= this.readBit();
    }
    return result;
  }
  writeBits(n, value) {
    const end = this.pos + n;
    for (let i = this.pos; i < end; i++) {
      const byteIndex = Math.floor(i / 8);
      let byte = this.bytes[byteIndex];
      const bitIndex = 7 - (i & 7);
      byte &= ~(1 << bitIndex);
      byte |= (value & 1 << end - i - 1) >> end - i - 1 << bitIndex;
      this.bytes[byteIndex] = byte;
    }
    this.pos = end;
  }
  readAlignedByte() {
    if (this.pos % 8 !== 0) {
      throw new Error("Bitstream is not byte-aligned.");
    }
    const byteIndex = this.pos / 8;
    const byte = this.bytes[byteIndex] ?? 0;
    this.pos += 8;
    return byte;
  }
  skipBits(n) {
    this.pos += n;
  }
  getBitsLeft() {
    return this.bytes.length * 8 - this.pos;
  }
  clone() {
    const clone = new Bitstream(this.bytes);
    clone.pos = this.pos;
    return clone;
  }
}
const readExpGolomb = (bitstream) => {
  let leadingZeroBits = 0;
  while (bitstream.readBits(1) === 0 && leadingZeroBits < 32) {
    leadingZeroBits++;
  }
  if (leadingZeroBits >= 32) {
    throw new Error("Invalid exponential-Golomb code.");
  }
  const result = (1 << leadingZeroBits) - 1 + bitstream.readBits(leadingZeroBits);
  return result;
};
const readSignedExpGolomb = (bitstream) => {
  const codeNum = readExpGolomb(bitstream);
  return (codeNum & 1) === 0 ? -(codeNum >> 1) : codeNum + 1 >> 1;
};
const toUint8Array = (source) => {
  if (source.constructor === Uint8Array) {
    return source;
  } else if (ArrayBuffer.isView(source)) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  } else {
    return new Uint8Array(source);
  }
};
const toDataView = (source) => {
  if (source.constructor === DataView) {
    return source;
  } else if (ArrayBuffer.isView(source)) {
    return new DataView(source.buffer, source.byteOffset, source.byteLength);
  } else {
    return new DataView(source);
  }
};
const textDecoder = /* @__PURE__ */ new TextDecoder();
const invertObject = (object) => {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [value, key]));
};
const COLOR_PRIMARIES_MAP = {
  bt709: 1,
  // ITU-R BT.709
  bt470bg: 5,
  // ITU-R BT.470BG
  smpte170m: 6,
  // ITU-R BT.601 525 - SMPTE 170M
  bt2020: 9,
  // ITU-R BT.202
  smpte432: 12
  // SMPTE EG 432-1
};
const COLOR_PRIMARIES_MAP_INVERSE = /* @__PURE__ */ invertObject(COLOR_PRIMARIES_MAP);
const TRANSFER_CHARACTERISTICS_MAP = {
  "bt709": 1,
  // ITU-R BT.709
  "smpte170m": 6,
  // SMPTE 170M
  "linear": 8,
  // Linear transfer characteristics
  "iec61966-2-1": 13,
  // IEC 61966-2-1
  "pq": 16,
  // Rec. ITU-R BT.2100-2 perceptual quantization (PQ) system
  "hlg": 18
  // Rec. ITU-R BT.2100-2 hybrid loggamma (HLG) system
};
const TRANSFER_CHARACTERISTICS_MAP_INVERSE = /* @__PURE__ */ invertObject(TRANSFER_CHARACTERISTICS_MAP);
const MATRIX_COEFFICIENTS_MAP = {
  "rgb": 0,
  // Identity
  "bt709": 1,
  // ITU-R BT.709
  "bt470bg": 5,
  // ITU-R BT.470BG
  "smpte170m": 6,
  // SMPTE 170M
  "bt2020-ncl": 9
  // ITU-R BT.2020-2 (non-constant luminance)
};
const MATRIX_COEFFICIENTS_MAP_INVERSE = /* @__PURE__ */ invertObject(MATRIX_COEFFICIENTS_MAP);
const isAllowSharedBufferSource = (x) => {
  return x instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && x instanceof SharedArrayBuffer || ArrayBuffer.isView(x);
};
class AsyncMutex {
  constructor() {
    this.currentPromise = Promise.resolve();
  }
  async acquire() {
    let resolver;
    const nextPromise = new Promise((resolve) => {
      resolver = resolve;
    });
    const currentPromiseAlias = this.currentPromise;
    this.currentPromise = nextPromise;
    await currentPromiseAlias;
    return resolver;
  }
}
const bytesToHexString = (bytes) => {
  return [...bytes].map((x) => x.toString(16).padStart(2, "0")).join("");
};
const reverseBitsU32 = (x) => {
  x = x >> 1 & 1431655765 | (x & 1431655765) << 1;
  x = x >> 2 & 858993459 | (x & 858993459) << 2;
  x = x >> 4 & 252645135 | (x & 252645135) << 4;
  x = x >> 8 & 16711935 | (x & 16711935) << 8;
  x = x >> 16 & 65535 | (x & 65535) << 16;
  return x >>> 0;
};
const binarySearchExact = (arr, key, valueGetter) => {
  let low = 0;
  let high = arr.length - 1;
  let ans = -1;
  while (low <= high) {
    const mid = low + high >> 1;
    const midVal = valueGetter(arr[mid]);
    if (midVal === key) {
      ans = mid;
      high = mid - 1;
    } else if (midVal < key) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
};
const binarySearchLessOrEqual = (arr, key, valueGetter) => {
  let low = 0;
  let high = arr.length - 1;
  let ans = -1;
  while (low <= high) {
    const mid = low + (high - low + 1) / 2 | 0;
    const midVal = valueGetter(arr[mid]);
    if (midVal <= key) {
      ans = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return ans;
};
const insertSorted = (arr, item, valueGetter) => {
  const insertionIndex = binarySearchLessOrEqual(arr, valueGetter(item), valueGetter);
  arr.splice(insertionIndex + 1, 0, item);
};
const promiseWithResolvers = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
const findLast = (arr, predicate) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return arr[i];
    }
  }
  return void 0;
};
const findLastIndex = (arr, predicate) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return i;
    }
  }
  return -1;
};
const toAsyncIterator = async function* (source) {
  if (Symbol.iterator in source) {
    yield* source[Symbol.iterator]();
  } else {
    yield* source[Symbol.asyncIterator]();
  }
};
const validateAnyIterable = (iterable) => {
  if (!(Symbol.iterator in iterable) && !(Symbol.asyncIterator in iterable)) {
    throw new TypeError("Argument must be an iterable or async iterable.");
  }
};
const assertNever = (x) => {
  throw new Error(`Unexpected value: ${x}`);
};
const getUint24 = (view, byteOffset, littleEndian) => {
  const byte1 = view.getUint8(byteOffset);
  const byte2 = view.getUint8(byteOffset + 1);
  const byte3 = view.getUint8(byteOffset + 2);
  if (littleEndian) {
    return byte1 | byte2 << 8 | byte3 << 16;
  } else {
    return byte1 << 16 | byte2 << 8 | byte3;
  }
};
const getInt24 = (view, byteOffset, littleEndian) => {
  return getUint24(view, byteOffset, littleEndian) << 8 >> 8;
};
const setUint24 = (view, byteOffset, value, littleEndian) => {
  value = value >>> 0;
  value = value & 16777215;
  {
    view.setUint8(byteOffset, value >>> 16 & 255);
    view.setUint8(byteOffset + 1, value >>> 8 & 255);
    view.setUint8(byteOffset + 2, value & 255);
  }
};
const mapAsyncGenerator = (generator, map) => {
  return {
    async next() {
      const result = await generator.next();
      if (result.done) {
        return { value: void 0, done: true };
      } else {
        return { value: map(result.value), done: false };
      }
    },
    return() {
      return generator.return();
    },
    throw(error) {
      return generator.throw(error);
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
};
const clamp$1 = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};
const UNDETERMINED_LANGUAGE = "und";
const roundIfAlmostInteger = (value) => {
  const rounded = Math.round(value);
  if (Math.abs(value / rounded - 1) < 10 * Number.EPSILON) {
    return rounded;
  } else {
    return value;
  }
};
const roundToMultiple = (value, multiple) => {
  return Math.round(value / multiple) * multiple;
};
const ilog = (x) => {
  let ret = 0;
  while (x) {
    ret++;
    x >>= 1;
  }
  return ret;
};
const ISO_639_2_REGEX = /^[a-z]{3}$/;
const isIso639Dash2LanguageCode = (x) => {
  return ISO_639_2_REGEX.test(x);
};
const SECOND_TO_MICROSECOND_FACTOR = 1e6 * (1 + Number.EPSILON);
const mergeRequestInit = (init1, init2) => {
  const merged = { ...init1, ...init2 };
  if (init1.headers || init2.headers) {
    const headers1 = init1.headers ? normalizeHeaders(init1.headers) : {};
    const headers2 = init2.headers ? normalizeHeaders(init2.headers) : {};
    const mergedHeaders = { ...headers1 };
    Object.entries(headers2).forEach(([key2, value2]) => {
      const existingKey = Object.keys(mergedHeaders).find((key1) => key1.toLowerCase() === key2.toLowerCase());
      if (existingKey) {
        delete mergedHeaders[existingKey];
      }
      mergedHeaders[key2] = value2;
    });
    merged.headers = mergedHeaders;
  }
  return merged;
};
const normalizeHeaders = (headers) => {
  if (headers instanceof Headers) {
    const result = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    const result = {};
    headers.forEach(([key, value]) => {
      result[key] = value;
    });
    return result;
  }
  return headers;
};
const retriedFetch = async (fetchFn, url, requestInit, getRetryDelay, shouldStop) => {
  let attempts = 0;
  while (true) {
    try {
      return await fetchFn(url, requestInit);
    } catch (error) {
      if (shouldStop()) {
        throw error;
      }
      attempts++;
      const retryDelayInSeconds = getRetryDelay(attempts, error, url);
      if (retryDelayInSeconds === null) {
        throw error;
      }
      console.error("Retrying failed fetch. Error:", error);
      if (!Number.isFinite(retryDelayInSeconds) || retryDelayInSeconds < 0) {
        throw new TypeError("Retry delay must be a non-negative finite number.");
      }
      if (retryDelayInSeconds > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1e3 * retryDelayInSeconds));
      }
      if (shouldStop()) {
        throw error;
      }
    }
  }
};
class CallSerializer {
  constructor() {
    this.currentPromise = Promise.resolve();
  }
  call(fn) {
    return this.currentPromise = this.currentPromise.then(fn);
  }
}
let isWebKitCache = null;
const isWebKit = () => {
  if (isWebKitCache !== null) {
    return isWebKitCache;
  }
  return isWebKitCache = !!(typeof navigator !== "undefined" && (navigator.vendor?.match(/apple/i) || /AppleWebKit/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) || /\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent)));
};
let isFirefoxCache = null;
const isFirefox = () => {
  if (isFirefoxCache !== null) {
    return isFirefoxCache;
  }
  return isFirefoxCache = typeof navigator !== "undefined" && navigator.userAgent?.includes("Firefox");
};
let isChromiumCache = null;
const isChromium = () => {
  if (isChromiumCache !== null) {
    return isChromiumCache;
  }
  return isChromiumCache = !!(typeof navigator !== "undefined" && (navigator.vendor?.includes("Google Inc") || /Chrome/.test(navigator.userAgent)));
};
let chromiumVersionCache = null;
const getChromiumVersion = () => {
  if (chromiumVersionCache !== null) {
    return chromiumVersionCache;
  }
  if (typeof navigator === "undefined") {
    return null;
  }
  const match = /\bChrome\/(\d+)/.exec(navigator.userAgent);
  if (!match) {
    return null;
  }
  return chromiumVersionCache = Number(match[1]);
};
const coalesceIndex = (a, b) => {
  return a !== -1 ? a : b;
};
const closedIntervalsOverlap = (startA, endA, startB, endB) => {
  return startA <= endB && startB <= endA;
};
const base64ToBytes = (base64) => {
  const decoded = atob(base64);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return bytes;
};
const polyfillSymbolDispose = () => {
  Symbol.dispose ?? (Symbol.dispose = /* @__PURE__ */ Symbol("Symbol.dispose"));
};
const isNumber = (x) => {
  return typeof x === "number" && !Number.isNaN(x);
};
class RichImageData {
  /** Creates a new {@link RichImageData}. */
  constructor(data, mimeType) {
    this.data = data;
    this.mimeType = mimeType;
    if (!(data instanceof Uint8Array)) {
      throw new TypeError("data must be a Uint8Array.");
    }
    if (typeof mimeType !== "string") {
      throw new TypeError("mimeType must be a string.");
    }
  }
}
class AttachedFile {
  /** Creates a new {@link AttachedFile}. */
  constructor(data, mimeType, name, description) {
    this.data = data;
    this.mimeType = mimeType;
    this.name = name;
    this.description = description;
    if (!(data instanceof Uint8Array)) {
      throw new TypeError("data must be a Uint8Array.");
    }
    if (mimeType !== void 0 && typeof mimeType !== "string") {
      throw new TypeError("mimeType, when provided, must be a string.");
    }
    if (name !== void 0 && typeof name !== "string") {
      throw new TypeError("name, when provided, must be a string.");
    }
    if (description !== void 0 && typeof description !== "string") {
      throw new TypeError("description, when provided, must be a string.");
    }
  }
}
const DEFAULT_TRACK_DISPOSITION = {
  default: true,
  forced: false,
  original: false,
  commentary: false,
  hearingImpaired: false,
  visuallyImpaired: false
};
const PCM_AUDIO_CODECS = [
  "pcm-s16",
  // We don't prefix 'le' so we're compatible with the WebCodecs-registered PCM codec strings
  "pcm-s16be",
  "pcm-s24",
  "pcm-s24be",
  "pcm-s32",
  "pcm-s32be",
  "pcm-f32",
  "pcm-f32be",
  "pcm-f64",
  "pcm-f64be",
  "pcm-u8",
  "pcm-s8",
  "ulaw",
  "alaw"
];
const VP9_LEVEL_TABLE = [
  { maxPictureSize: 36864, maxBitrate: 2e5, level: 10 },
  // Level 1
  { maxPictureSize: 73728, maxBitrate: 8e5, level: 11 },
  // Level 1.1
  { maxPictureSize: 122880, maxBitrate: 18e5, level: 20 },
  // Level 2
  { maxPictureSize: 245760, maxBitrate: 36e5, level: 21 },
  // Level 2.1
  { maxPictureSize: 552960, maxBitrate: 72e5, level: 30 },
  // Level 3
  { maxPictureSize: 983040, maxBitrate: 12e6, level: 31 },
  // Level 3.1
  { maxPictureSize: 2228224, maxBitrate: 18e6, level: 40 },
  // Level 4
  { maxPictureSize: 2228224, maxBitrate: 3e7, level: 41 },
  // Level 4.1
  { maxPictureSize: 8912896, maxBitrate: 6e7, level: 50 },
  // Level 5
  { maxPictureSize: 8912896, maxBitrate: 12e7, level: 51 },
  // Level 5.1
  { maxPictureSize: 8912896, maxBitrate: 18e7, level: 52 },
  // Level 5.2
  { maxPictureSize: 35651584, maxBitrate: 18e7, level: 60 },
  // Level 6
  { maxPictureSize: 35651584, maxBitrate: 24e7, level: 61 },
  // Level 6.1
  { maxPictureSize: 35651584, maxBitrate: 48e7, level: 62 }
  // Level 6.2
];
const VP9_DEFAULT_SUFFIX = ".01.01.01.01.00";
const AV1_DEFAULT_SUFFIX = ".0.110.01.01.01.0";
const extractVideoCodecString = (trackInfo) => {
  const { codec, codecDescription, colorSpace, avcCodecInfo, hevcCodecInfo, vp9CodecInfo, av1CodecInfo } = trackInfo;
  if (codec === "avc") {
    assert(trackInfo.avcType !== null);
    if (avcCodecInfo) {
      const bytes = new Uint8Array([
        avcCodecInfo.avcProfileIndication,
        avcCodecInfo.profileCompatibility,
        avcCodecInfo.avcLevelIndication
      ]);
      return `avc${trackInfo.avcType}.${bytesToHexString(bytes)}`;
    }
    if (!codecDescription || codecDescription.byteLength < 4) {
      throw new TypeError("AVC decoder description is not provided or is not at least 4 bytes long.");
    }
    return `avc${trackInfo.avcType}.${bytesToHexString(codecDescription.subarray(1, 4))}`;
  } else if (codec === "hevc") {
    let generalProfileSpace;
    let generalProfileIdc;
    let compatibilityFlags;
    let generalTierFlag;
    let generalLevelIdc;
    let constraintFlags;
    if (hevcCodecInfo) {
      generalProfileSpace = hevcCodecInfo.generalProfileSpace;
      generalProfileIdc = hevcCodecInfo.generalProfileIdc;
      compatibilityFlags = reverseBitsU32(hevcCodecInfo.generalProfileCompatibilityFlags);
      generalTierFlag = hevcCodecInfo.generalTierFlag;
      generalLevelIdc = hevcCodecInfo.generalLevelIdc;
      constraintFlags = [...hevcCodecInfo.generalConstraintIndicatorFlags];
    } else {
      if (!codecDescription || codecDescription.byteLength < 23) {
        throw new TypeError("HEVC decoder description is not provided or is not at least 23 bytes long.");
      }
      const view = toDataView(codecDescription);
      const profileByte = view.getUint8(1);
      generalProfileSpace = profileByte >> 6 & 3;
      generalProfileIdc = profileByte & 31;
      compatibilityFlags = reverseBitsU32(view.getUint32(2));
      generalTierFlag = profileByte >> 5 & 1;
      generalLevelIdc = view.getUint8(12);
      constraintFlags = [];
      for (let i = 0; i < 6; i++) {
        constraintFlags.push(view.getUint8(6 + i));
      }
    }
    let codecString = "hev1.";
    codecString += ["", "A", "B", "C"][generalProfileSpace] + generalProfileIdc;
    codecString += ".";
    codecString += compatibilityFlags.toString(16).toUpperCase();
    codecString += ".";
    codecString += generalTierFlag === 0 ? "L" : "H";
    codecString += generalLevelIdc;
    while (constraintFlags.length > 0 && constraintFlags[constraintFlags.length - 1] === 0) {
      constraintFlags.pop();
    }
    if (constraintFlags.length > 0) {
      codecString += ".";
      codecString += constraintFlags.map((x) => x.toString(16).toUpperCase()).join(".");
    }
    return codecString;
  } else if (codec === "vp8") {
    return "vp8";
  } else if (codec === "vp9") {
    if (!vp9CodecInfo) {
      const pictureSize = trackInfo.width * trackInfo.height;
      let level2 = last(VP9_LEVEL_TABLE).level;
      for (const entry of VP9_LEVEL_TABLE) {
        if (pictureSize <= entry.maxPictureSize) {
          level2 = entry.level;
          break;
        }
      }
      return `vp09.00.${level2.toString().padStart(2, "0")}.08`;
    }
    const profile = vp9CodecInfo.profile.toString().padStart(2, "0");
    const level = vp9CodecInfo.level.toString().padStart(2, "0");
    const bitDepth = vp9CodecInfo.bitDepth.toString().padStart(2, "0");
    const chromaSubsampling = vp9CodecInfo.chromaSubsampling.toString().padStart(2, "0");
    const colourPrimaries = vp9CodecInfo.colourPrimaries.toString().padStart(2, "0");
    const transferCharacteristics = vp9CodecInfo.transferCharacteristics.toString().padStart(2, "0");
    const matrixCoefficients = vp9CodecInfo.matrixCoefficients.toString().padStart(2, "0");
    const videoFullRangeFlag = vp9CodecInfo.videoFullRangeFlag.toString().padStart(2, "0");
    let string = `vp09.${profile}.${level}.${bitDepth}.${chromaSubsampling}`;
    string += `.${colourPrimaries}.${transferCharacteristics}.${matrixCoefficients}.${videoFullRangeFlag}`;
    if (string.endsWith(VP9_DEFAULT_SUFFIX)) {
      string = string.slice(0, -VP9_DEFAULT_SUFFIX.length);
    }
    return string;
  } else if (codec === "av1") {
    if (!av1CodecInfo) {
      const pictureSize = trackInfo.width * trackInfo.height;
      let level2 = last(VP9_LEVEL_TABLE).level;
      for (const entry of VP9_LEVEL_TABLE) {
        if (pictureSize <= entry.maxPictureSize) {
          level2 = entry.level;
          break;
        }
      }
      return `av01.0.${level2.toString().padStart(2, "0")}M.08`;
    }
    const profile = av1CodecInfo.profile;
    const level = av1CodecInfo.level.toString().padStart(2, "0");
    const tier = av1CodecInfo.tier ? "H" : "M";
    const bitDepth = av1CodecInfo.bitDepth.toString().padStart(2, "0");
    const monochrome = av1CodecInfo.monochrome ? "1" : "0";
    const chromaSubsampling = 100 * av1CodecInfo.chromaSubsamplingX + 10 * av1CodecInfo.chromaSubsamplingY + 1 * (av1CodecInfo.chromaSubsamplingX && av1CodecInfo.chromaSubsamplingY ? av1CodecInfo.chromaSamplePosition : 0);
    const colorPrimaries = colorSpace?.primaries ? COLOR_PRIMARIES_MAP[colorSpace.primaries] : 1;
    const transferCharacteristics = colorSpace?.transfer ? TRANSFER_CHARACTERISTICS_MAP[colorSpace.transfer] : 1;
    const matrixCoefficients = colorSpace?.matrix ? MATRIX_COEFFICIENTS_MAP[colorSpace.matrix] : 1;
    const videoFullRangeFlag = colorSpace?.fullRange ? 1 : 0;
    let string = `av01.${profile}.${level}${tier}.${bitDepth}`;
    string += `.${monochrome}.${chromaSubsampling.toString().padStart(3, "0")}`;
    string += `.${colorPrimaries.toString().padStart(2, "0")}`;
    string += `.${transferCharacteristics.toString().padStart(2, "0")}`;
    string += `.${matrixCoefficients.toString().padStart(2, "0")}`;
    string += `.${videoFullRangeFlag}`;
    if (string.endsWith(AV1_DEFAULT_SUFFIX)) {
      string = string.slice(0, -AV1_DEFAULT_SUFFIX.length);
    }
    return string;
  }
  throw new TypeError(`Unhandled codec '${codec}'.`);
};
const extractAudioCodecString = (trackInfo) => {
  const { codec, codecDescription, aacCodecInfo } = trackInfo;
  if (codec === "aac") {
    if (!aacCodecInfo) {
      throw new TypeError("AAC codec info must be provided.");
    }
    if (aacCodecInfo.isMpeg2) {
      return "mp4a.67";
    } else {
      const audioSpecificConfig = parseAacAudioSpecificConfig(codecDescription);
      return `mp4a.40.${audioSpecificConfig.objectType}`;
    }
  } else if (codec === "mp3") {
    return "mp3";
  } else if (codec === "opus") {
    return "opus";
  } else if (codec === "vorbis") {
    return "vorbis";
  } else if (codec === "flac") {
    return "flac";
  } else if (codec && PCM_AUDIO_CODECS.includes(codec)) {
    return codec;
  }
  throw new TypeError(`Unhandled codec '${codec}'.`);
};
const aacFrequencyTable = [
  96e3,
  88200,
  64e3,
  48e3,
  44100,
  32e3,
  24e3,
  22050,
  16e3,
  12e3,
  11025,
  8e3,
  7350
];
const aacChannelMap = [-1, 1, 2, 3, 4, 5, 6, 8];
const parseAacAudioSpecificConfig = (bytes) => {
  if (!bytes || bytes.byteLength < 2) {
    throw new TypeError("AAC description must be at least 2 bytes long.");
  }
  const bitstream = new Bitstream(bytes);
  let objectType = bitstream.readBits(5);
  if (objectType === 31) {
    objectType = 32 + bitstream.readBits(6);
  }
  const frequencyIndex = bitstream.readBits(4);
  let sampleRate = null;
  if (frequencyIndex === 15) {
    sampleRate = bitstream.readBits(24);
  } else {
    if (frequencyIndex < aacFrequencyTable.length) {
      sampleRate = aacFrequencyTable[frequencyIndex];
    }
  }
  const channelConfiguration = bitstream.readBits(4);
  let numberOfChannels = null;
  if (channelConfiguration >= 1 && channelConfiguration <= 7) {
    numberOfChannels = aacChannelMap[channelConfiguration];
  }
  return {
    objectType,
    frequencyIndex,
    sampleRate,
    channelConfiguration,
    numberOfChannels
  };
};
const OPUS_SAMPLE_RATE = 48e3;
const PCM_CODEC_REGEX = /^pcm-([usf])(\d+)+(be)?$/;
const parsePcmCodec = (codec) => {
  assert(PCM_AUDIO_CODECS.includes(codec));
  if (codec === "ulaw") {
    return { dataType: "ulaw", sampleSize: 1, littleEndian: true, silentValue: 255 };
  } else if (codec === "alaw") {
    return { dataType: "alaw", sampleSize: 1, littleEndian: true, silentValue: 213 };
  }
  const match = PCM_CODEC_REGEX.exec(codec);
  assert(match);
  let dataType;
  if (match[1] === "u") {
    dataType = "unsigned";
  } else if (match[1] === "s") {
    dataType = "signed";
  } else {
    dataType = "float";
  }
  const sampleSize = Number(match[2]) / 8;
  const littleEndian = match[3] !== "be";
  const silentValue = codec === "pcm-u8" ? 2 ** 7 : 0;
  return { dataType, sampleSize, littleEndian, silentValue };
};
var AvcNalUnitType;
(function(AvcNalUnitType2) {
  AvcNalUnitType2[AvcNalUnitType2["IDR"] = 5] = "IDR";
  AvcNalUnitType2[AvcNalUnitType2["SEI"] = 6] = "SEI";
  AvcNalUnitType2[AvcNalUnitType2["SPS"] = 7] = "SPS";
  AvcNalUnitType2[AvcNalUnitType2["PPS"] = 8] = "PPS";
  AvcNalUnitType2[AvcNalUnitType2["SPS_EXT"] = 13] = "SPS_EXT";
})(AvcNalUnitType || (AvcNalUnitType = {}));
var HevcNalUnitType;
(function(HevcNalUnitType2) {
  HevcNalUnitType2[HevcNalUnitType2["RASL_N"] = 8] = "RASL_N";
  HevcNalUnitType2[HevcNalUnitType2["RASL_R"] = 9] = "RASL_R";
  HevcNalUnitType2[HevcNalUnitType2["BLA_W_LP"] = 16] = "BLA_W_LP";
  HevcNalUnitType2[HevcNalUnitType2["RSV_IRAP_VCL23"] = 23] = "RSV_IRAP_VCL23";
  HevcNalUnitType2[HevcNalUnitType2["VPS_NUT"] = 32] = "VPS_NUT";
  HevcNalUnitType2[HevcNalUnitType2["SPS_NUT"] = 33] = "SPS_NUT";
  HevcNalUnitType2[HevcNalUnitType2["PPS_NUT"] = 34] = "PPS_NUT";
  HevcNalUnitType2[HevcNalUnitType2["PREFIX_SEI_NUT"] = 39] = "PREFIX_SEI_NUT";
  HevcNalUnitType2[HevcNalUnitType2["SUFFIX_SEI_NUT"] = 40] = "SUFFIX_SEI_NUT";
})(HevcNalUnitType || (HevcNalUnitType = {}));
const findNalUnitsInAnnexB = (packetData) => {
  const nalUnits = [];
  let i = 0;
  while (i < packetData.length) {
    let startCodePos = -1;
    let startCodeLength = 0;
    for (let j = i; j < packetData.length - 3; j++) {
      if (packetData[j] === 0 && packetData[j + 1] === 0 && packetData[j + 2] === 1) {
        startCodePos = j;
        startCodeLength = 3;
        break;
      }
      if (j < packetData.length - 4 && packetData[j] === 0 && packetData[j + 1] === 0 && packetData[j + 2] === 0 && packetData[j + 3] === 1) {
        startCodePos = j;
        startCodeLength = 4;
        break;
      }
    }
    if (startCodePos === -1) {
      break;
    }
    if (i > 0 && startCodePos > i) {
      const nalData = packetData.subarray(i, startCodePos);
      if (nalData.length > 0) {
        nalUnits.push(nalData);
      }
    }
    i = startCodePos + startCodeLength;
  }
  if (i < packetData.length) {
    const nalData = packetData.subarray(i);
    if (nalData.length > 0) {
      nalUnits.push(nalData);
    }
  }
  return nalUnits;
};
const findNalUnitsInLengthPrefixed = (packetData, lengthSize) => {
  const nalUnits = [];
  let offset = 0;
  const dataView = new DataView(packetData.buffer, packetData.byteOffset, packetData.byteLength);
  while (offset + lengthSize <= packetData.length) {
    let nalUnitLength;
    if (lengthSize === 1) {
      nalUnitLength = dataView.getUint8(offset);
    } else if (lengthSize === 2) {
      nalUnitLength = dataView.getUint16(offset, false);
    } else if (lengthSize === 3) {
      nalUnitLength = getUint24(dataView, offset, false);
    } else if (lengthSize === 4) {
      nalUnitLength = dataView.getUint32(offset, false);
    } else {
      assertNever(lengthSize);
      assert(false);
    }
    offset += lengthSize;
    const nalUnit = packetData.subarray(offset, offset + nalUnitLength);
    nalUnits.push(nalUnit);
    offset += nalUnitLength;
  }
  return nalUnits;
};
const removeEmulationPreventionBytes = (data) => {
  const result = [];
  const len = data.length;
  for (let i = 0; i < len; i++) {
    if (i + 2 < len && data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 3) {
      result.push(0, 0);
      i += 2;
    } else {
      result.push(data[i]);
    }
  }
  return new Uint8Array(result);
};
const ANNEX_B_START_CODE = new Uint8Array([0, 0, 0, 1]);
const concatNalUnitsInAnnexB = (nalUnits) => {
  const totalLength = nalUnits.reduce((a, b) => a + ANNEX_B_START_CODE.byteLength + b.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const nalUnit of nalUnits) {
    result.set(ANNEX_B_START_CODE, offset);
    offset += ANNEX_B_START_CODE.byteLength;
    result.set(nalUnit, offset);
    offset += nalUnit.byteLength;
  }
  return result;
};
const concatNalUnitsInLengthPrefixed = (nalUnits, lengthSize) => {
  const totalLength = nalUnits.reduce((a, b) => a + lengthSize + b.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const nalUnit of nalUnits) {
    const dataView = new DataView(result.buffer, result.byteOffset, result.byteLength);
    switch (lengthSize) {
      case 1:
        dataView.setUint8(offset, nalUnit.byteLength);
        break;
      case 2:
        dataView.setUint16(offset, nalUnit.byteLength, false);
        break;
      case 3:
        setUint24(dataView, offset, nalUnit.byteLength);
        break;
      case 4:
        dataView.setUint32(offset, nalUnit.byteLength, false);
        break;
    }
    offset += lengthSize;
    result.set(nalUnit, offset);
    offset += nalUnit.byteLength;
  }
  return result;
};
const extractAvcNalUnits = (packetData, decoderConfig) => {
  if (decoderConfig.description) {
    const bytes = toUint8Array(decoderConfig.description);
    const lengthSizeMinusOne = bytes[4] & 3;
    const lengthSize = lengthSizeMinusOne + 1;
    return findNalUnitsInLengthPrefixed(packetData, lengthSize);
  } else {
    return findNalUnitsInAnnexB(packetData);
  }
};
const concatAvcNalUnits = (nalUnits, decoderConfig) => {
  if (decoderConfig.description) {
    const bytes = toUint8Array(decoderConfig.description);
    const lengthSizeMinusOne = bytes[4] & 3;
    const lengthSize = lengthSizeMinusOne + 1;
    return concatNalUnitsInLengthPrefixed(nalUnits, lengthSize);
  } else {
    return concatNalUnitsInAnnexB(nalUnits);
  }
};
const extractNalUnitTypeForAvc = (data) => {
  return data[0] & 31;
};
const extractAvcDecoderConfigurationRecord = (packetData) => {
  try {
    const nalUnits = findNalUnitsInAnnexB(packetData);
    const spsUnits = nalUnits.filter((unit) => extractNalUnitTypeForAvc(unit) === AvcNalUnitType.SPS);
    const ppsUnits = nalUnits.filter((unit) => extractNalUnitTypeForAvc(unit) === AvcNalUnitType.PPS);
    const spsExtUnits = nalUnits.filter((unit) => extractNalUnitTypeForAvc(unit) === AvcNalUnitType.SPS_EXT);
    if (spsUnits.length === 0) {
      return null;
    }
    if (ppsUnits.length === 0) {
      return null;
    }
    const spsData = spsUnits[0];
    const spsInfo = parseAvcSps(spsData);
    assert(spsInfo !== null);
    const hasExtendedData = spsInfo.profileIdc === 100 || spsInfo.profileIdc === 110 || spsInfo.profileIdc === 122 || spsInfo.profileIdc === 144;
    return {
      configurationVersion: 1,
      avcProfileIndication: spsInfo.profileIdc,
      profileCompatibility: spsInfo.constraintFlags,
      avcLevelIndication: spsInfo.levelIdc,
      lengthSizeMinusOne: 3,
      // Typically 4 bytes for length field
      sequenceParameterSets: spsUnits,
      pictureParameterSets: ppsUnits,
      chromaFormat: hasExtendedData ? spsInfo.chromaFormatIdc : null,
      bitDepthLumaMinus8: hasExtendedData ? spsInfo.bitDepthLumaMinus8 : null,
      bitDepthChromaMinus8: hasExtendedData ? spsInfo.bitDepthChromaMinus8 : null,
      sequenceParameterSetExt: hasExtendedData ? spsExtUnits : null
    };
  } catch (error) {
    console.error("Error building AVC Decoder Configuration Record:", error);
    return null;
  }
};
const deserializeAvcDecoderConfigurationRecord = (data) => {
  try {
    const view = toDataView(data);
    let offset = 0;
    const configurationVersion = view.getUint8(offset++);
    const avcProfileIndication = view.getUint8(offset++);
    const profileCompatibility = view.getUint8(offset++);
    const avcLevelIndication = view.getUint8(offset++);
    const lengthSizeMinusOne = view.getUint8(offset++) & 3;
    const numOfSequenceParameterSets = view.getUint8(offset++) & 31;
    const sequenceParameterSets = [];
    for (let i = 0; i < numOfSequenceParameterSets; i++) {
      const length = view.getUint16(offset, false);
      offset += 2;
      sequenceParameterSets.push(data.subarray(offset, offset + length));
      offset += length;
    }
    const numOfPictureParameterSets = view.getUint8(offset++);
    const pictureParameterSets = [];
    for (let i = 0; i < numOfPictureParameterSets; i++) {
      const length = view.getUint16(offset, false);
      offset += 2;
      pictureParameterSets.push(data.subarray(offset, offset + length));
      offset += length;
    }
    const record = {
      configurationVersion,
      avcProfileIndication,
      profileCompatibility,
      avcLevelIndication,
      lengthSizeMinusOne,
      sequenceParameterSets,
      pictureParameterSets,
      chromaFormat: null,
      bitDepthLumaMinus8: null,
      bitDepthChromaMinus8: null,
      sequenceParameterSetExt: null
    };
    if ((avcProfileIndication === 100 || avcProfileIndication === 110 || avcProfileIndication === 122 || avcProfileIndication === 144) && offset + 4 <= data.length) {
      const chromaFormat = view.getUint8(offset++) & 3;
      const bitDepthLumaMinus8 = view.getUint8(offset++) & 7;
      const bitDepthChromaMinus8 = view.getUint8(offset++) & 7;
      const numOfSequenceParameterSetExt = view.getUint8(offset++);
      record.chromaFormat = chromaFormat;
      record.bitDepthLumaMinus8 = bitDepthLumaMinus8;
      record.bitDepthChromaMinus8 = bitDepthChromaMinus8;
      const sequenceParameterSetExt = [];
      for (let i = 0; i < numOfSequenceParameterSetExt; i++) {
        const length = view.getUint16(offset, false);
        offset += 2;
        sequenceParameterSetExt.push(data.subarray(offset, offset + length));
        offset += length;
      }
      record.sequenceParameterSetExt = sequenceParameterSetExt;
    }
    return record;
  } catch (error) {
    console.error("Error deserializing AVC Decoder Configuration Record:", error);
    return null;
  }
};
const parseAvcSps = (sps) => {
  try {
    const bitstream = new Bitstream(removeEmulationPreventionBytes(sps));
    bitstream.skipBits(1);
    bitstream.skipBits(2);
    const nalUnitType = bitstream.readBits(5);
    if (nalUnitType !== 7) {
      return null;
    }
    const profileIdc = bitstream.readAlignedByte();
    const constraintFlags = bitstream.readAlignedByte();
    const levelIdc = bitstream.readAlignedByte();
    readExpGolomb(bitstream);
    let chromaFormatIdc = null;
    let bitDepthLumaMinus8 = null;
    let bitDepthChromaMinus8 = null;
    if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
      chromaFormatIdc = readExpGolomb(bitstream);
      if (chromaFormatIdc === 3) {
        bitstream.skipBits(1);
      }
      bitDepthLumaMinus8 = readExpGolomb(bitstream);
      bitDepthChromaMinus8 = readExpGolomb(bitstream);
      bitstream.skipBits(1);
      const seqScalingMatrixPresentFlag = bitstream.readBits(1);
      if (seqScalingMatrixPresentFlag) {
        for (let i = 0; i < (chromaFormatIdc !== 3 ? 8 : 12); i++) {
          const seqScalingListPresentFlag = bitstream.readBits(1);
          if (seqScalingListPresentFlag) {
            const sizeOfScalingList = i < 6 ? 16 : 64;
            let lastScale = 8;
            let nextScale = 8;
            for (let j = 0; j < sizeOfScalingList; j++) {
              if (nextScale !== 0) {
                const deltaScale = readSignedExpGolomb(bitstream);
                nextScale = (lastScale + deltaScale + 256) % 256;
              }
              lastScale = nextScale === 0 ? lastScale : nextScale;
            }
          }
        }
      }
    }
    readExpGolomb(bitstream);
    const picOrderCntType = readExpGolomb(bitstream);
    if (picOrderCntType === 0) {
      readExpGolomb(bitstream);
    } else if (picOrderCntType === 1) {
      bitstream.skipBits(1);
      readSignedExpGolomb(bitstream);
      readSignedExpGolomb(bitstream);
      const numRefFramesInPicOrderCntCycle = readExpGolomb(bitstream);
      for (let i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
        readSignedExpGolomb(bitstream);
      }
    }
    readExpGolomb(bitstream);
    bitstream.skipBits(1);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    const frameMbsOnlyFlag = bitstream.readBits(1);
    return {
      profileIdc,
      constraintFlags,
      levelIdc,
      frameMbsOnlyFlag,
      chromaFormatIdc,
      bitDepthLumaMinus8,
      bitDepthChromaMinus8
    };
  } catch (error) {
    console.error("Error parsing AVC SPS:", error);
    return null;
  }
};
const extractHevcNalUnits = (packetData, decoderConfig) => {
  if (decoderConfig.description) {
    const bytes = toUint8Array(decoderConfig.description);
    const lengthSizeMinusOne = bytes[21] & 3;
    const lengthSize = lengthSizeMinusOne + 1;
    return findNalUnitsInLengthPrefixed(packetData, lengthSize);
  } else {
    return findNalUnitsInAnnexB(packetData);
  }
};
const extractNalUnitTypeForHevc = (data) => {
  return data[0] >> 1 & 63;
};
const extractHevcDecoderConfigurationRecord = (packetData) => {
  try {
    const nalUnits = findNalUnitsInAnnexB(packetData);
    const vpsUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.VPS_NUT);
    const spsUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.SPS_NUT);
    const ppsUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.PPS_NUT);
    const seiUnits = nalUnits.filter((unit) => extractNalUnitTypeForHevc(unit) === HevcNalUnitType.PREFIX_SEI_NUT || extractNalUnitTypeForHevc(unit) === HevcNalUnitType.SUFFIX_SEI_NUT);
    if (spsUnits.length === 0 || ppsUnits.length === 0)
      return null;
    const sps = spsUnits[0];
    const bitstream = new Bitstream(removeEmulationPreventionBytes(sps));
    bitstream.skipBits(16);
    bitstream.readBits(4);
    const sps_max_sub_layers_minus1 = bitstream.readBits(3);
    const sps_temporal_id_nesting_flag = bitstream.readBits(1);
    const { general_profile_space, general_tier_flag, general_profile_idc, general_profile_compatibility_flags, general_constraint_indicator_flags, general_level_idc } = parseProfileTierLevel(bitstream, sps_max_sub_layers_minus1);
    readExpGolomb(bitstream);
    const chroma_format_idc = readExpGolomb(bitstream);
    if (chroma_format_idc === 3)
      bitstream.skipBits(1);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    if (bitstream.readBits(1)) {
      readExpGolomb(bitstream);
      readExpGolomb(bitstream);
      readExpGolomb(bitstream);
      readExpGolomb(bitstream);
    }
    const bit_depth_luma_minus8 = readExpGolomb(bitstream);
    const bit_depth_chroma_minus8 = readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    const sps_sub_layer_ordering_info_present_flag = bitstream.readBits(1);
    const maxNum = sps_sub_layer_ordering_info_present_flag ? 0 : sps_max_sub_layers_minus1;
    for (let i = maxNum; i <= sps_max_sub_layers_minus1; i++) {
      readExpGolomb(bitstream);
      readExpGolomb(bitstream);
      readExpGolomb(bitstream);
    }
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    if (bitstream.readBits(1)) {
      if (bitstream.readBits(1)) {
        skipScalingListData(bitstream);
      }
    }
    bitstream.skipBits(1);
    bitstream.skipBits(1);
    if (bitstream.readBits(1)) {
      bitstream.skipBits(4);
      bitstream.skipBits(4);
      readExpGolomb(bitstream);
      readExpGolomb(bitstream);
      bitstream.skipBits(1);
    }
    const num_short_term_ref_pic_sets = readExpGolomb(bitstream);
    skipAllStRefPicSets(bitstream, num_short_term_ref_pic_sets);
    if (bitstream.readBits(1)) {
      const num_long_term_ref_pics_sps = readExpGolomb(bitstream);
      for (let i = 0; i < num_long_term_ref_pics_sps; i++) {
        readExpGolomb(bitstream);
        bitstream.skipBits(1);
      }
    }
    bitstream.skipBits(1);
    bitstream.skipBits(1);
    let min_spatial_segmentation_idc = 0;
    if (bitstream.readBits(1)) {
      min_spatial_segmentation_idc = parseVuiForMinSpatialSegmentationIdc(bitstream, sps_max_sub_layers_minus1);
    }
    let parallelismType = 0;
    if (ppsUnits.length > 0) {
      const pps = ppsUnits[0];
      const ppsBitstream = new Bitstream(removeEmulationPreventionBytes(pps));
      ppsBitstream.skipBits(16);
      readExpGolomb(ppsBitstream);
      readExpGolomb(ppsBitstream);
      ppsBitstream.skipBits(1);
      ppsBitstream.skipBits(1);
      ppsBitstream.skipBits(3);
      ppsBitstream.skipBits(1);
      ppsBitstream.skipBits(1);
      readExpGolomb(ppsBitstream);
      readExpGolomb(ppsBitstream);
      readSignedExpGolomb(ppsBitstream);
      ppsBitstream.skipBits(1);
      ppsBitstream.skipBits(1);
      if (ppsBitstream.readBits(1)) {
        readExpGolomb(ppsBitstream);
      }
      readSignedExpGolomb(ppsBitstream);
      readSignedExpGolomb(ppsBitstream);
      ppsBitstream.skipBits(1);
      ppsBitstream.skipBits(1);
      ppsBitstream.skipBits(1);
      ppsBitstream.skipBits(1);
      const tiles_enabled_flag = ppsBitstream.readBits(1);
      const entropy_coding_sync_enabled_flag = ppsBitstream.readBits(1);
      if (!tiles_enabled_flag && !entropy_coding_sync_enabled_flag)
        parallelismType = 0;
      else if (tiles_enabled_flag && !entropy_coding_sync_enabled_flag)
        parallelismType = 2;
      else if (!tiles_enabled_flag && entropy_coding_sync_enabled_flag)
        parallelismType = 3;
      else
        parallelismType = 0;
    }
    const arrays = [
      ...vpsUnits.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: HevcNalUnitType.VPS_NUT,
          nalUnits: vpsUnits
        }
      ] : [],
      ...spsUnits.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: HevcNalUnitType.SPS_NUT,
          nalUnits: spsUnits
        }
      ] : [],
      ...ppsUnits.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: HevcNalUnitType.PPS_NUT,
          nalUnits: ppsUnits
        }
      ] : [],
      ...seiUnits.length ? [
        {
          arrayCompleteness: 1,
          nalUnitType: extractNalUnitTypeForHevc(seiUnits[0]),
          nalUnits: seiUnits
        }
      ] : []
    ];
    const record = {
      configurationVersion: 1,
      generalProfileSpace: general_profile_space,
      generalTierFlag: general_tier_flag,
      generalProfileIdc: general_profile_idc,
      generalProfileCompatibilityFlags: general_profile_compatibility_flags,
      generalConstraintIndicatorFlags: general_constraint_indicator_flags,
      generalLevelIdc: general_level_idc,
      minSpatialSegmentationIdc: min_spatial_segmentation_idc,
      parallelismType,
      chromaFormatIdc: chroma_format_idc,
      bitDepthLumaMinus8: bit_depth_luma_minus8,
      bitDepthChromaMinus8: bit_depth_chroma_minus8,
      avgFrameRate: 0,
      constantFrameRate: 0,
      numTemporalLayers: sps_max_sub_layers_minus1 + 1,
      temporalIdNested: sps_temporal_id_nesting_flag,
      lengthSizeMinusOne: 3,
      arrays
    };
    return record;
  } catch (error) {
    console.error("Error building HEVC Decoder Configuration Record:", error);
    return null;
  }
};
const parseProfileTierLevel = (bitstream, maxNumSubLayersMinus1) => {
  const general_profile_space = bitstream.readBits(2);
  const general_tier_flag = bitstream.readBits(1);
  const general_profile_idc = bitstream.readBits(5);
  let general_profile_compatibility_flags = 0;
  for (let i = 0; i < 32; i++) {
    general_profile_compatibility_flags = general_profile_compatibility_flags << 1 | bitstream.readBits(1);
  }
  const general_constraint_indicator_flags = new Uint8Array(6);
  for (let i = 0; i < 6; i++) {
    general_constraint_indicator_flags[i] = bitstream.readBits(8);
  }
  const general_level_idc = bitstream.readBits(8);
  const sub_layer_profile_present_flag = [];
  const sub_layer_level_present_flag = [];
  for (let i = 0; i < maxNumSubLayersMinus1; i++) {
    sub_layer_profile_present_flag.push(bitstream.readBits(1));
    sub_layer_level_present_flag.push(bitstream.readBits(1));
  }
  if (maxNumSubLayersMinus1 > 0) {
    for (let i = maxNumSubLayersMinus1; i < 8; i++) {
      bitstream.skipBits(2);
    }
  }
  for (let i = 0; i < maxNumSubLayersMinus1; i++) {
    if (sub_layer_profile_present_flag[i])
      bitstream.skipBits(88);
    if (sub_layer_level_present_flag[i])
      bitstream.skipBits(8);
  }
  return {
    general_profile_space,
    general_tier_flag,
    general_profile_idc,
    general_profile_compatibility_flags,
    general_constraint_indicator_flags,
    general_level_idc
  };
};
const skipScalingListData = (bitstream) => {
  for (let sizeId = 0; sizeId < 4; sizeId++) {
    for (let matrixId = 0; matrixId < (sizeId === 3 ? 2 : 6); matrixId++) {
      const scaling_list_pred_mode_flag = bitstream.readBits(1);
      if (!scaling_list_pred_mode_flag) {
        readExpGolomb(bitstream);
      } else {
        const coefNum = Math.min(64, 1 << 4 + (sizeId << 1));
        if (sizeId > 1) {
          readSignedExpGolomb(bitstream);
        }
        for (let i = 0; i < coefNum; i++) {
          readSignedExpGolomb(bitstream);
        }
      }
    }
  }
};
const skipAllStRefPicSets = (bitstream, num_short_term_ref_pic_sets) => {
  const NumDeltaPocs = [];
  for (let stRpsIdx = 0; stRpsIdx < num_short_term_ref_pic_sets; stRpsIdx++) {
    NumDeltaPocs[stRpsIdx] = skipStRefPicSet(bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs);
  }
};
const skipStRefPicSet = (bitstream, stRpsIdx, num_short_term_ref_pic_sets, NumDeltaPocs) => {
  let NumDeltaPocsThis = 0;
  let inter_ref_pic_set_prediction_flag = 0;
  let RefRpsIdx = 0;
  if (stRpsIdx !== 0) {
    inter_ref_pic_set_prediction_flag = bitstream.readBits(1);
  }
  if (inter_ref_pic_set_prediction_flag) {
    if (stRpsIdx === num_short_term_ref_pic_sets) {
      const delta_idx_minus1 = readExpGolomb(bitstream);
      RefRpsIdx = stRpsIdx - (delta_idx_minus1 + 1);
    } else {
      RefRpsIdx = stRpsIdx - 1;
    }
    bitstream.readBits(1);
    readExpGolomb(bitstream);
    const numDelta = NumDeltaPocs[RefRpsIdx] ?? 0;
    for (let j = 0; j <= numDelta; j++) {
      const used_by_curr_pic_flag = bitstream.readBits(1);
      if (!used_by_curr_pic_flag) {
        bitstream.readBits(1);
      }
    }
    NumDeltaPocsThis = NumDeltaPocs[RefRpsIdx];
  } else {
    const num_negative_pics = readExpGolomb(bitstream);
    const num_positive_pics = readExpGolomb(bitstream);
    for (let i = 0; i < num_negative_pics; i++) {
      readExpGolomb(bitstream);
      bitstream.readBits(1);
    }
    for (let i = 0; i < num_positive_pics; i++) {
      readExpGolomb(bitstream);
      bitstream.readBits(1);
    }
    NumDeltaPocsThis = num_negative_pics + num_positive_pics;
  }
  return NumDeltaPocsThis;
};
const parseVuiForMinSpatialSegmentationIdc = (bitstream, sps_max_sub_layers_minus1) => {
  if (bitstream.readBits(1)) {
    const aspect_ratio_idc = bitstream.readBits(8);
    if (aspect_ratio_idc === 255) {
      bitstream.readBits(16);
      bitstream.readBits(16);
    }
  }
  if (bitstream.readBits(1)) {
    bitstream.readBits(1);
  }
  if (bitstream.readBits(1)) {
    bitstream.readBits(3);
    bitstream.readBits(1);
    if (bitstream.readBits(1)) {
      bitstream.readBits(8);
      bitstream.readBits(8);
      bitstream.readBits(8);
    }
  }
  if (bitstream.readBits(1)) {
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
  }
  bitstream.readBits(1);
  bitstream.readBits(1);
  bitstream.readBits(1);
  if (bitstream.readBits(1)) {
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
  }
  if (bitstream.readBits(1)) {
    bitstream.readBits(32);
    bitstream.readBits(32);
    if (bitstream.readBits(1)) {
      readExpGolomb(bitstream);
    }
    if (bitstream.readBits(1)) {
      skipHrdParameters(bitstream, true, sps_max_sub_layers_minus1);
    }
  }
  if (bitstream.readBits(1)) {
    bitstream.readBits(1);
    bitstream.readBits(1);
    bitstream.readBits(1);
    const min_spatial_segmentation_idc = readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    return min_spatial_segmentation_idc;
  }
  return 0;
};
const skipHrdParameters = (bitstream, commonInfPresentFlag, maxNumSubLayersMinus1) => {
  let nal_hrd_parameters_present_flag = false;
  let vcl_hrd_parameters_present_flag = false;
  let sub_pic_hrd_params_present_flag = false;
  {
    nal_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
    vcl_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
    if (nal_hrd_parameters_present_flag || vcl_hrd_parameters_present_flag) {
      sub_pic_hrd_params_present_flag = bitstream.readBits(1) === 1;
      if (sub_pic_hrd_params_present_flag) {
        bitstream.readBits(8);
        bitstream.readBits(5);
        bitstream.readBits(1);
        bitstream.readBits(5);
      }
      bitstream.readBits(4);
      bitstream.readBits(4);
      if (sub_pic_hrd_params_present_flag) {
        bitstream.readBits(4);
      }
      bitstream.readBits(5);
      bitstream.readBits(5);
      bitstream.readBits(5);
    }
  }
  for (let i = 0; i <= maxNumSubLayersMinus1; i++) {
    const fixed_pic_rate_general_flag = bitstream.readBits(1) === 1;
    let fixed_pic_rate_within_cvs_flag = true;
    if (!fixed_pic_rate_general_flag) {
      fixed_pic_rate_within_cvs_flag = bitstream.readBits(1) === 1;
    }
    let low_delay_hrd_flag = false;
    if (fixed_pic_rate_within_cvs_flag) {
      readExpGolomb(bitstream);
    } else {
      low_delay_hrd_flag = bitstream.readBits(1) === 1;
    }
    let CpbCnt = 1;
    if (!low_delay_hrd_flag) {
      const cpb_cnt_minus1 = readExpGolomb(bitstream);
      CpbCnt = cpb_cnt_minus1 + 1;
    }
    if (nal_hrd_parameters_present_flag) {
      skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
    }
    if (vcl_hrd_parameters_present_flag) {
      skipSubLayerHrdParameters(bitstream, CpbCnt, sub_pic_hrd_params_present_flag);
    }
  }
};
const skipSubLayerHrdParameters = (bitstream, CpbCnt, sub_pic_hrd_params_present_flag) => {
  for (let i = 0; i < CpbCnt; i++) {
    readExpGolomb(bitstream);
    readExpGolomb(bitstream);
    if (sub_pic_hrd_params_present_flag) {
      readExpGolomb(bitstream);
      readExpGolomb(bitstream);
    }
    bitstream.readBits(1);
  }
};
const extractVp9CodecInfoFromPacket = (packet) => {
  const bitstream = new Bitstream(packet);
  const frameMarker = bitstream.readBits(2);
  if (frameMarker !== 2) {
    return null;
  }
  const profileLowBit = bitstream.readBits(1);
  const profileHighBit = bitstream.readBits(1);
  const profile = (profileHighBit << 1) + profileLowBit;
  if (profile === 3) {
    bitstream.skipBits(1);
  }
  const showExistingFrame = bitstream.readBits(1);
  if (showExistingFrame === 1) {
    return null;
  }
  const frameType = bitstream.readBits(1);
  if (frameType !== 0) {
    return null;
  }
  bitstream.skipBits(2);
  const syncCode = bitstream.readBits(24);
  if (syncCode !== 4817730) {
    return null;
  }
  let bitDepth = 8;
  if (profile >= 2) {
    const tenOrTwelveBit = bitstream.readBits(1);
    bitDepth = tenOrTwelveBit ? 12 : 10;
  }
  const colorSpace = bitstream.readBits(3);
  let chromaSubsampling = 0;
  let videoFullRangeFlag = 0;
  if (colorSpace !== 7) {
    const colorRange = bitstream.readBits(1);
    videoFullRangeFlag = colorRange;
    if (profile === 1 || profile === 3) {
      const subsamplingX = bitstream.readBits(1);
      const subsamplingY = bitstream.readBits(1);
      chromaSubsampling = !subsamplingX && !subsamplingY ? 3 : subsamplingX && !subsamplingY ? 2 : 1;
      bitstream.skipBits(1);
    } else {
      chromaSubsampling = 1;
    }
  } else {
    chromaSubsampling = 3;
    videoFullRangeFlag = 1;
  }
  const widthMinusOne = bitstream.readBits(16);
  const heightMinusOne = bitstream.readBits(16);
  const width = widthMinusOne + 1;
  const height = heightMinusOne + 1;
  const pictureSize = width * height;
  let level = last(VP9_LEVEL_TABLE).level;
  for (const entry of VP9_LEVEL_TABLE) {
    if (pictureSize <= entry.maxPictureSize) {
      level = entry.level;
      break;
    }
  }
  const matrixCoefficients = colorSpace === 7 ? 0 : colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2;
  const colourPrimaries = colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2;
  const transferCharacteristics = colorSpace === 2 ? 1 : colorSpace === 1 ? 6 : 2;
  return {
    profile,
    level,
    bitDepth,
    chromaSubsampling,
    videoFullRangeFlag,
    colourPrimaries,
    transferCharacteristics,
    matrixCoefficients
  };
};
const iterateAv1PacketObus = function* (packet) {
  const bitstream = new Bitstream(packet);
  const readLeb128 = () => {
    let value = 0;
    for (let i = 0; i < 8; i++) {
      const byte = bitstream.readAlignedByte();
      value |= (byte & 127) << i * 7;
      if (!(byte & 128)) {
        break;
      }
      if (i === 7 && byte & 128) {
        return null;
      }
    }
    if (value >= 2 ** 32 - 1) {
      return null;
    }
    return value;
  };
  while (bitstream.getBitsLeft() >= 8) {
    bitstream.skipBits(1);
    const obuType = bitstream.readBits(4);
    const obuExtension = bitstream.readBits(1);
    const obuHasSizeField = bitstream.readBits(1);
    bitstream.skipBits(1);
    if (obuExtension) {
      bitstream.skipBits(8);
    }
    let obuSize;
    if (obuHasSizeField) {
      const obuSizeValue = readLeb128();
      if (obuSizeValue === null)
        return;
      obuSize = obuSizeValue;
    } else {
      obuSize = Math.floor(bitstream.getBitsLeft() / 8);
    }
    assert(bitstream.pos % 8 === 0);
    yield {
      type: obuType,
      data: packet.subarray(bitstream.pos / 8, bitstream.pos / 8 + obuSize)
    };
    bitstream.skipBits(obuSize * 8);
  }
};
const extractAv1CodecInfoFromPacket = (packet) => {
  for (const { type, data } of iterateAv1PacketObus(packet)) {
    if (type !== 1) {
      continue;
    }
    const bitstream = new Bitstream(data);
    const seqProfile = bitstream.readBits(3);
    bitstream.readBits(1);
    const reducedStillPictureHeader = bitstream.readBits(1);
    let seqLevel = 0;
    let seqTier = 0;
    let bufferDelayLengthMinus1 = 0;
    if (reducedStillPictureHeader) {
      seqLevel = bitstream.readBits(5);
    } else {
      const timingInfoPresentFlag = bitstream.readBits(1);
      if (timingInfoPresentFlag) {
        bitstream.skipBits(32);
        bitstream.skipBits(32);
        const equalPictureInterval = bitstream.readBits(1);
        if (equalPictureInterval) {
          return null;
        }
      }
      const decoderModelInfoPresentFlag = bitstream.readBits(1);
      if (decoderModelInfoPresentFlag) {
        bufferDelayLengthMinus1 = bitstream.readBits(5);
        bitstream.skipBits(32);
        bitstream.skipBits(5);
        bitstream.skipBits(5);
      }
      const operatingPointsCntMinus1 = bitstream.readBits(5);
      for (let i = 0; i <= operatingPointsCntMinus1; i++) {
        bitstream.skipBits(12);
        const seqLevelIdx = bitstream.readBits(5);
        if (i === 0) {
          seqLevel = seqLevelIdx;
        }
        if (seqLevelIdx > 7) {
          const seqTierTemp = bitstream.readBits(1);
          if (i === 0) {
            seqTier = seqTierTemp;
          }
        }
        if (decoderModelInfoPresentFlag) {
          const decoderModelPresentForThisOp = bitstream.readBits(1);
          if (decoderModelPresentForThisOp) {
            const n = bufferDelayLengthMinus1 + 1;
            bitstream.skipBits(n);
            bitstream.skipBits(n);
            bitstream.skipBits(1);
          }
        }
        const initialDisplayDelayPresentFlag = bitstream.readBits(1);
        if (initialDisplayDelayPresentFlag) {
          bitstream.skipBits(4);
        }
      }
    }
    const frameWidthBitsMinus1 = bitstream.readBits(4);
    const frameHeightBitsMinus1 = bitstream.readBits(4);
    const n1 = frameWidthBitsMinus1 + 1;
    bitstream.skipBits(n1);
    const n2 = frameHeightBitsMinus1 + 1;
    bitstream.skipBits(n2);
    let frameIdNumbersPresentFlag = 0;
    if (reducedStillPictureHeader) {
      frameIdNumbersPresentFlag = 0;
    } else {
      frameIdNumbersPresentFlag = bitstream.readBits(1);
    }
    if (frameIdNumbersPresentFlag) {
      bitstream.skipBits(4);
      bitstream.skipBits(3);
    }
    bitstream.skipBits(1);
    bitstream.skipBits(1);
    bitstream.skipBits(1);
    if (!reducedStillPictureHeader) {
      bitstream.skipBits(1);
      bitstream.skipBits(1);
      bitstream.skipBits(1);
      bitstream.skipBits(1);
      const enableOrderHint = bitstream.readBits(1);
      if (enableOrderHint) {
        bitstream.skipBits(1);
        bitstream.skipBits(1);
      }
      const seqChooseScreenContentTools = bitstream.readBits(1);
      let seqForceScreenContentTools = 0;
      if (seqChooseScreenContentTools) {
        seqForceScreenContentTools = 2;
      } else {
        seqForceScreenContentTools = bitstream.readBits(1);
      }
      if (seqForceScreenContentTools > 0) {
        const seqChooseIntegerMv = bitstream.readBits(1);
        if (!seqChooseIntegerMv) {
          bitstream.skipBits(1);
        }
      }
      if (enableOrderHint) {
        bitstream.skipBits(3);
      }
    }
    bitstream.skipBits(1);
    bitstream.skipBits(1);
    bitstream.skipBits(1);
    const highBitdepth = bitstream.readBits(1);
    let bitDepth = 8;
    if (seqProfile === 2 && highBitdepth) {
      const twelveBit = bitstream.readBits(1);
      bitDepth = twelveBit ? 12 : 10;
    } else if (seqProfile <= 2) {
      bitDepth = highBitdepth ? 10 : 8;
    }
    let monochrome = 0;
    if (seqProfile !== 1) {
      monochrome = bitstream.readBits(1);
    }
    let chromaSubsamplingX = 1;
    let chromaSubsamplingY = 1;
    let chromaSamplePosition = 0;
    if (!monochrome) {
      if (seqProfile === 0) {
        chromaSubsamplingX = 1;
        chromaSubsamplingY = 1;
      } else if (seqProfile === 1) {
        chromaSubsamplingX = 0;
        chromaSubsamplingY = 0;
      } else {
        if (bitDepth === 12) {
          chromaSubsamplingX = bitstream.readBits(1);
          if (chromaSubsamplingX) {
            chromaSubsamplingY = bitstream.readBits(1);
          }
        }
      }
      if (chromaSubsamplingX && chromaSubsamplingY) {
        chromaSamplePosition = bitstream.readBits(2);
      }
    }
    return {
      profile: seqProfile,
      level: seqLevel,
      tier: seqTier,
      bitDepth,
      monochrome,
      chromaSubsamplingX,
      chromaSubsamplingY,
      chromaSamplePosition
    };
  }
  return null;
};
const parseOpusIdentificationHeader = (bytes) => {
  const view = toDataView(bytes);
  const outputChannelCount = view.getUint8(9);
  const preSkip = view.getUint16(10, true);
  const inputSampleRate = view.getUint32(12, true);
  const outputGain = view.getInt16(16, true);
  const channelMappingFamily = view.getUint8(18);
  let channelMappingTable = null;
  if (channelMappingFamily) {
    channelMappingTable = bytes.subarray(19, 19 + 2 + outputChannelCount);
  }
  return {
    outputChannelCount,
    preSkip,
    inputSampleRate,
    outputGain,
    channelMappingFamily,
    channelMappingTable
  };
};
const OPUS_FRAME_DURATION_TABLE = [
  480,
  960,
  1920,
  2880,
  480,
  960,
  1920,
  2880,
  480,
  960,
  1920,
  2880,
  480,
  960,
  480,
  960,
  120,
  240,
  480,
  960,
  120,
  240,
  480,
  960,
  120,
  240,
  480,
  960,
  120,
  240,
  480,
  960
];
const parseOpusTocByte = (packet) => {
  const config = packet[0] >> 3;
  return {
    durationInSamples: OPUS_FRAME_DURATION_TABLE[config]
  };
};
const parseModesFromVorbisSetupPacket = (setupHeader) => {
  if (setupHeader.length < 7) {
    throw new Error("Setup header is too short.");
  }
  if (setupHeader[0] !== 5) {
    throw new Error("Wrong packet type in Setup header.");
  }
  const signature = String.fromCharCode(...setupHeader.slice(1, 7));
  if (signature !== "vorbis") {
    throw new Error("Invalid packet signature in Setup header.");
  }
  const bufSize = setupHeader.length;
  const revBuffer = new Uint8Array(bufSize);
  for (let i = 0; i < bufSize; i++) {
    revBuffer[i] = setupHeader[bufSize - 1 - i];
  }
  const bitstream = new Bitstream(revBuffer);
  let gotFramingBit = 0;
  while (bitstream.getBitsLeft() > 97) {
    if (bitstream.readBits(1) === 1) {
      gotFramingBit = bitstream.pos;
      break;
    }
  }
  if (gotFramingBit === 0) {
    throw new Error("Invalid Setup header: framing bit not found.");
  }
  let modeCount = 0;
  let gotModeHeader = false;
  let lastModeCount = 0;
  while (bitstream.getBitsLeft() >= 97) {
    const tempPos = bitstream.pos;
    const a = bitstream.readBits(8);
    const b = bitstream.readBits(16);
    const c = bitstream.readBits(16);
    if (a > 63 || b !== 0 || c !== 0) {
      bitstream.pos = tempPos;
      break;
    }
    bitstream.skipBits(1);
    modeCount++;
    if (modeCount > 64) {
      break;
    }
    const bsClone = bitstream.clone();
    const candidate = bsClone.readBits(6) + 1;
    if (candidate === modeCount) {
      gotModeHeader = true;
      lastModeCount = modeCount;
    }
  }
  if (!gotModeHeader) {
    throw new Error("Invalid Setup header: mode header not found.");
  }
  if (lastModeCount > 63) {
    throw new Error(`Unsupported mode count: ${lastModeCount}.`);
  }
  const finalModeCount = lastModeCount;
  bitstream.pos = 0;
  bitstream.skipBits(gotFramingBit);
  const modeBlockflags = Array(finalModeCount).fill(0);
  for (let i = finalModeCount - 1; i >= 0; i--) {
    bitstream.skipBits(40);
    modeBlockflags[i] = bitstream.readBits(1);
  }
  return { modeBlockflags };
};
const determineVideoPacketType = (codec, decoderConfig, packetData) => {
  switch (codec) {
    case "avc": {
      const nalUnits = extractAvcNalUnits(packetData, decoderConfig);
      let isKeyframe = nalUnits.some((x) => extractNalUnitTypeForAvc(x) === AvcNalUnitType.IDR);
      if (!isKeyframe && (!isChromium() || getChromiumVersion() >= 144)) {
        for (const nalUnit of nalUnits) {
          const type = extractNalUnitTypeForAvc(nalUnit);
          if (type !== AvcNalUnitType.SEI) {
            continue;
          }
          const bytes = removeEmulationPreventionBytes(nalUnit);
          let pos = 1;
          do {
            let payloadType = 0;
            while (true) {
              const nextByte = bytes[pos++];
              if (nextByte === void 0)
                break;
              payloadType += nextByte;
              if (nextByte < 255) {
                break;
              }
            }
            let payloadSize = 0;
            while (true) {
              const nextByte = bytes[pos++];
              if (nextByte === void 0)
                break;
              payloadSize += nextByte;
              if (nextByte < 255) {
                break;
              }
            }
            const PAYLOAD_TYPE_RECOVERY_POINT = 6;
            if (payloadType === PAYLOAD_TYPE_RECOVERY_POINT) {
              const bitstream = new Bitstream(bytes);
              bitstream.pos = 8 * pos;
              const recoveryFrameCount = readExpGolomb(bitstream);
              const exactMatchFlag = bitstream.readBits(1);
              if (recoveryFrameCount === 0 && exactMatchFlag === 1) {
                isKeyframe = true;
                break;
              }
            }
            pos += payloadSize;
          } while (pos < bytes.length - 1);
        }
      }
      return isKeyframe ? "key" : "delta";
    }
    case "hevc": {
      const nalUnits = extractHevcNalUnits(packetData, decoderConfig);
      const isKeyframe = nalUnits.some((x) => {
        const type = extractNalUnitTypeForHevc(x);
        return HevcNalUnitType.BLA_W_LP <= type && type <= HevcNalUnitType.RSV_IRAP_VCL23;
      });
      return isKeyframe ? "key" : "delta";
    }
    case "vp8": {
      const frameType = packetData[0] & 1;
      return frameType === 0 ? "key" : "delta";
    }
    case "vp9": {
      const bitstream = new Bitstream(packetData);
      if (bitstream.readBits(2) !== 2) {
        return null;
      }
      const profileLowBit = bitstream.readBits(1);
      const profileHighBit = bitstream.readBits(1);
      const profile = (profileHighBit << 1) + profileLowBit;
      if (profile === 3) {
        bitstream.skipBits(1);
      }
      const showExistingFrame = bitstream.readBits(1);
      if (showExistingFrame) {
        return null;
      }
      const frameType = bitstream.readBits(1);
      return frameType === 0 ? "key" : "delta";
    }
    case "av1": {
      let reducedStillPictureHeader = false;
      for (const { type, data } of iterateAv1PacketObus(packetData)) {
        if (type === 1) {
          const bitstream = new Bitstream(data);
          bitstream.skipBits(4);
          reducedStillPictureHeader = !!bitstream.readBits(1);
        } else if (type === 3 || type === 6 || type === 7) {
          if (reducedStillPictureHeader) {
            return "key";
          }
          const bitstream = new Bitstream(data);
          const showExistingFrame = bitstream.readBits(1);
          if (showExistingFrame) {
            return null;
          }
          const frameType = bitstream.readBits(2);
          return frameType === 0 ? "key" : "delta";
        }
      }
      return null;
    }
    default: {
      assertNever(codec);
      assert(false);
    }
  }
};
var FlacBlockType;
(function(FlacBlockType2) {
  FlacBlockType2[FlacBlockType2["STREAMINFO"] = 0] = "STREAMINFO";
  FlacBlockType2[FlacBlockType2["VORBIS_COMMENT"] = 4] = "VORBIS_COMMENT";
  FlacBlockType2[FlacBlockType2["PICTURE"] = 6] = "PICTURE";
})(FlacBlockType || (FlacBlockType = {}));
const readVorbisComments = (bytes, metadataTags) => {
  var _a, _b;
  const commentView = toDataView(bytes);
  let commentPos = 0;
  const vendorStringLength = commentView.getUint32(commentPos, true);
  commentPos += 4;
  const vendorString = textDecoder.decode(bytes.subarray(commentPos, commentPos + vendorStringLength));
  commentPos += vendorStringLength;
  if (vendorStringLength > 0) {
    metadataTags.raw ?? (metadataTags.raw = {});
    (_a = metadataTags.raw)["vendor"] ?? (_a["vendor"] = vendorString);
  }
  const listLength = commentView.getUint32(commentPos, true);
  commentPos += 4;
  for (let i = 0; i < listLength; i++) {
    const stringLength = commentView.getUint32(commentPos, true);
    commentPos += 4;
    const string = textDecoder.decode(bytes.subarray(commentPos, commentPos + stringLength));
    commentPos += stringLength;
    const separatorIndex = string.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }
    const key = string.slice(0, separatorIndex).toUpperCase();
    const value = string.slice(separatorIndex + 1);
    metadataTags.raw ?? (metadataTags.raw = {});
    (_b = metadataTags.raw)[key] ?? (_b[key] = value);
    switch (key) {
      case "TITLE":
        {
          metadataTags.title ?? (metadataTags.title = value);
        }
        break;
      case "DESCRIPTION":
        {
          metadataTags.description ?? (metadataTags.description = value);
        }
        break;
      case "ARTIST":
        {
          metadataTags.artist ?? (metadataTags.artist = value);
        }
        break;
      case "ALBUM":
        {
          metadataTags.album ?? (metadataTags.album = value);
        }
        break;
      case "ALBUMARTIST":
        {
          metadataTags.albumArtist ?? (metadataTags.albumArtist = value);
        }
        break;
      case "COMMENT":
        {
          metadataTags.comment ?? (metadataTags.comment = value);
        }
        break;
      case "LYRICS":
        {
          metadataTags.lyrics ?? (metadataTags.lyrics = value);
        }
        break;
      case "TRACKNUMBER":
        {
          const parts = value.split("/");
          const trackNum = Number.parseInt(parts[0], 10);
          const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
          if (Number.isInteger(trackNum) && trackNum > 0) {
            metadataTags.trackNumber ?? (metadataTags.trackNumber = trackNum);
          }
          if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) {
            metadataTags.tracksTotal ?? (metadataTags.tracksTotal = tracksTotal);
          }
        }
        break;
      case "TRACKTOTAL":
        {
          const tracksTotal = Number.parseInt(value, 10);
          if (Number.isInteger(tracksTotal) && tracksTotal > 0) {
            metadataTags.tracksTotal ?? (metadataTags.tracksTotal = tracksTotal);
          }
        }
        break;
      case "DISCNUMBER":
        {
          const parts = value.split("/");
          const discNum = Number.parseInt(parts[0], 10);
          const discsTotal = parts[1] && Number.parseInt(parts[1], 10);
          if (Number.isInteger(discNum) && discNum > 0) {
            metadataTags.discNumber ?? (metadataTags.discNumber = discNum);
          }
          if (discsTotal && Number.isInteger(discsTotal) && discsTotal > 0) {
            metadataTags.discsTotal ?? (metadataTags.discsTotal = discsTotal);
          }
        }
        break;
      case "DISCTOTAL":
        {
          const discsTotal = Number.parseInt(value, 10);
          if (Number.isInteger(discsTotal) && discsTotal > 0) {
            metadataTags.discsTotal ?? (metadataTags.discsTotal = discsTotal);
          }
        }
        break;
      case "DATE":
        {
          const date = new Date(value);
          if (!Number.isNaN(date.getTime())) {
            metadataTags.date ?? (metadataTags.date = date);
          }
        }
        break;
      case "GENRE":
        {
          metadataTags.genre ?? (metadataTags.genre = value);
        }
        break;
      case "METADATA_BLOCK_PICTURE":
        {
          const decoded = base64ToBytes(value);
          const view = toDataView(decoded);
          const pictureType = view.getUint32(0, false);
          const mediaTypeLength = view.getUint32(4, false);
          const mediaType = String.fromCharCode(...decoded.subarray(8, 8 + mediaTypeLength));
          const descriptionLength = view.getUint32(8 + mediaTypeLength, false);
          const description = textDecoder.decode(decoded.subarray(12 + mediaTypeLength, 12 + mediaTypeLength + descriptionLength));
          const dataLength = view.getUint32(mediaTypeLength + descriptionLength + 28);
          const data = decoded.subarray(mediaTypeLength + descriptionLength + 32, mediaTypeLength + descriptionLength + 32 + dataLength);
          metadataTags.images ?? (metadataTags.images = []);
          metadataTags.images.push({
            data,
            mimeType: mediaType,
            kind: pictureType === 3 ? "coverFront" : pictureType === 4 ? "coverBack" : "unknown",
            name: void 0,
            description: description || void 0
          });
        }
        break;
    }
  }
};
class Demuxer {
  constructor(input) {
    this.input = input;
  }
}
const customVideoDecoders = [];
const customAudioDecoders = [];
const PLACEHOLDER_DATA = /* @__PURE__ */ new Uint8Array(0);
class EncodedPacket {
  /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
  constructor(data, type, timestamp, duration, sequenceNumber = -1, byteLength, sideData) {
    this.data = data;
    this.type = type;
    this.timestamp = timestamp;
    this.duration = duration;
    this.sequenceNumber = sequenceNumber;
    if (data === PLACEHOLDER_DATA && byteLength === void 0) {
      throw new Error("Internal error: byteLength must be explicitly provided when constructing metadata-only packets.");
    }
    if (byteLength === void 0) {
      byteLength = data.byteLength;
    }
    if (!(data instanceof Uint8Array)) {
      throw new TypeError("data must be a Uint8Array.");
    }
    if (type !== "key" && type !== "delta") {
      throw new TypeError('type must be either "key" or "delta".');
    }
    if (!Number.isFinite(timestamp)) {
      throw new TypeError("timestamp must be a number.");
    }
    if (!Number.isFinite(duration) || duration < 0) {
      throw new TypeError("duration must be a non-negative number.");
    }
    if (!Number.isFinite(sequenceNumber)) {
      throw new TypeError("sequenceNumber must be a number.");
    }
    if (!Number.isInteger(byteLength) || byteLength < 0) {
      throw new TypeError("byteLength must be a non-negative integer.");
    }
    if (sideData !== void 0 && (typeof sideData !== "object" || !sideData)) {
      throw new TypeError("sideData, when provided, must be an object.");
    }
    if (sideData?.alpha !== void 0 && !(sideData.alpha instanceof Uint8Array)) {
      throw new TypeError("sideData.alpha, when provided, must be a Uint8Array.");
    }
    if (sideData?.alphaByteLength !== void 0 && (!Number.isInteger(sideData.alphaByteLength) || sideData.alphaByteLength < 0)) {
      throw new TypeError("sideData.alphaByteLength, when provided, must be a non-negative integer.");
    }
    this.byteLength = byteLength;
    this.sideData = sideData ?? {};
    if (this.sideData.alpha && this.sideData.alphaByteLength === void 0) {
      this.sideData.alphaByteLength = this.sideData.alpha.byteLength;
    }
  }
  /**
   * If this packet is a metadata-only packet. Metadata-only packets don't contain their packet data. They are the
   * result of retrieving packets with {@link PacketRetrievalOptions.metadataOnly} set to `true`.
   */
  get isMetadataOnly() {
    return this.data === PLACEHOLDER_DATA;
  }
  /** The timestamp of this packet in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.timestamp);
  }
  /** The duration of this packet in microseconds. */
  get microsecondDuration() {
    return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.duration);
  }
  /** Converts this packet to an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
   * WebCodecs API. */
  toEncodedVideoChunk() {
    if (this.isMetadataOnly) {
      throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
    }
    if (typeof EncodedVideoChunk === "undefined") {
      throw new Error("Your browser does not support EncodedVideoChunk.");
    }
    return new EncodedVideoChunk({
      data: this.data,
      type: this.type,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /**
   * Converts this packet to an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
   * WebCodecs API, using the alpha side data instead of the color data. Throws if no alpha side data is defined.
   */
  alphaToEncodedVideoChunk(type = this.type) {
    if (!this.sideData.alpha) {
      throw new TypeError("This packet does not contain alpha side data.");
    }
    if (this.isMetadataOnly) {
      throw new TypeError("Metadata-only packets cannot be converted to a video chunk.");
    }
    if (typeof EncodedVideoChunk === "undefined") {
      throw new Error("Your browser does not support EncodedVideoChunk.");
    }
    return new EncodedVideoChunk({
      data: this.sideData.alpha,
      type,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /** Converts this packet to an
   * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk) for use with the
   * WebCodecs API. */
  toEncodedAudioChunk() {
    if (this.isMetadataOnly) {
      throw new TypeError("Metadata-only packets cannot be converted to an audio chunk.");
    }
    if (typeof EncodedAudioChunk === "undefined") {
      throw new Error("Your browser does not support EncodedAudioChunk.");
    }
    return new EncodedAudioChunk({
      data: this.data,
      type: this.type,
      timestamp: this.microsecondTimestamp,
      duration: this.microsecondDuration
    });
  }
  /**
   * Creates an {@link EncodedPacket} from an
   * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) or
   * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk). This method is useful
   * for converting chunks from the WebCodecs API to `EncodedPacket` instances.
   */
  static fromEncodedChunk(chunk, sideData) {
    if (!(chunk instanceof EncodedVideoChunk || chunk instanceof EncodedAudioChunk)) {
      throw new TypeError("chunk must be an EncodedVideoChunk or EncodedAudioChunk.");
    }
    const data = new Uint8Array(chunk.byteLength);
    chunk.copyTo(data);
    return new EncodedPacket(data, chunk.type, chunk.timestamp / 1e6, (chunk.duration ?? 0) / 1e6, void 0, void 0, sideData);
  }
  /** Clones this packet while optionally updating timing information. */
  clone(options) {
    if (options !== void 0 && (typeof options !== "object" || options === null)) {
      throw new TypeError("options, when provided, must be an object.");
    }
    if (options?.timestamp !== void 0 && !Number.isFinite(options.timestamp)) {
      throw new TypeError("options.timestamp, when provided, must be a number.");
    }
    if (options?.duration !== void 0 && !Number.isFinite(options.duration)) {
      throw new TypeError("options.duration, when provided, must be a number.");
    }
    return new EncodedPacket(this.data, this.type, options?.timestamp ?? this.timestamp, options?.duration ?? this.duration, this.sequenceNumber, this.byteLength);
  }
}
const fromUlaw = (u8) => {
  const MULAW_BIAS = 33;
  let sign = 0;
  let position = 0;
  let number = ~u8;
  if (number & 128) {
    number &= -129;
    sign = -1;
  }
  position = ((number & 240) >> 4) + 5;
  const decoded = (1 << position | (number & 15) << position - 4 | 1 << position - 5) - MULAW_BIAS;
  return sign === 0 ? decoded : -decoded;
};
const fromAlaw = (u8) => {
  let sign = 0;
  let position = 0;
  let number = u8 ^ 85;
  if (number & 128) {
    number &= -129;
    sign = -1;
  }
  position = ((number & 240) >> 4) + 4;
  let decoded = 0;
  if (position !== 4) {
    decoded = 1 << position | (number & 15) << position - 4 | 1 << position - 5;
  } else {
    decoded = number << 1 | 1;
  }
  return sign === 0 ? decoded : -decoded;
};
polyfillSymbolDispose();
let lastVideoGcErrorLog = -Infinity;
let lastAudioGcErrorLog = -Infinity;
let finalizationRegistry = null;
if (typeof FinalizationRegistry !== "undefined") {
  finalizationRegistry = new FinalizationRegistry((value) => {
    const now = Date.now();
    if (value.type === "video") {
      if (now - lastVideoGcErrorLog >= 1e3) {
        console.error(`A VideoSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your VideoSamples as soon as you're done using them.`);
        lastVideoGcErrorLog = now;
      }
      if (typeof VideoFrame !== "undefined" && value.data instanceof VideoFrame) {
        value.data.close();
      }
    } else {
      if (now - lastAudioGcErrorLog >= 1e3) {
        console.error(`An AudioSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your AudioSamples as soon as you're done using them.`);
        lastAudioGcErrorLog = now;
      }
      if (typeof AudioData !== "undefined" && value.data instanceof AudioData) {
        value.data.close();
      }
    }
  });
}
const VIDEO_SAMPLE_PIXEL_FORMATS = [
  // 4:2:0 Y, U, V
  "I420",
  "I420P10",
  "I420P12",
  // 4:2:0 Y, U, V, A
  "I420A",
  "I420AP10",
  "I420AP12",
  // 4:2:2 Y, U, V
  "I422",
  "I422P10",
  "I422P12",
  // 4:2:2 Y, U, V, A
  "I422A",
  "I422AP10",
  "I422AP12",
  // 4:4:4 Y, U, V
  "I444",
  "I444P10",
  "I444P12",
  // 4:4:4 Y, U, V, A
  "I444A",
  "I444AP10",
  "I444AP12",
  // 4:2:0 Y, UV
  "NV12",
  // 4:4:4 RGBA
  "RGBA",
  // 4:4:4 RGBX (opaque)
  "RGBX",
  // 4:4:4 BGRA
  "BGRA",
  // 4:4:4 BGRX (opaque)
  "BGRX"
];
const VIDEO_SAMPLE_PIXEL_FORMATS_SET = new Set(VIDEO_SAMPLE_PIXEL_FORMATS);
class VideoSample {
  /** The width of the frame in pixels after rotation. */
  get displayWidth() {
    return this.rotation % 180 === 0 ? this.codedWidth : this.codedHeight;
  }
  /** The height of the frame in pixels after rotation. */
  get displayHeight() {
    return this.rotation % 180 === 0 ? this.codedHeight : this.codedWidth;
  }
  /** The presentation timestamp of the frame in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.timestamp);
  }
  /** The duration of the frame in microseconds. */
  get microsecondDuration() {
    return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.duration);
  }
  /**
   * Whether this sample uses a pixel format that can hold transparency data. Note that this doesn't necessarily mean
   * that the sample is transparent.
   */
  get hasAlpha() {
    return this.format && this.format.includes("A");
  }
  constructor(data, init) {
    this._closed = false;
    if (data instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && data instanceof SharedArrayBuffer || ArrayBuffer.isView(data)) {
      if (!init || typeof init !== "object") {
        throw new TypeError("init must be an object.");
      }
      if (init.format === void 0 || !VIDEO_SAMPLE_PIXEL_FORMATS_SET.has(init.format)) {
        throw new TypeError("init.format must be one of: " + VIDEO_SAMPLE_PIXEL_FORMATS.join(", "));
      }
      if (!Number.isInteger(init.codedWidth) || init.codedWidth <= 0) {
        throw new TypeError("init.codedWidth must be a positive integer.");
      }
      if (!Number.isInteger(init.codedHeight) || init.codedHeight <= 0) {
        throw new TypeError("init.codedHeight must be a positive integer.");
      }
      if (init.rotation !== void 0 && ![0, 90, 180, 270].includes(init.rotation)) {
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      }
      if (!Number.isFinite(init.timestamp)) {
        throw new TypeError("init.timestamp must be a number.");
      }
      if (init.duration !== void 0 && (!Number.isFinite(init.duration) || init.duration < 0)) {
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      }
      this._data = toUint8Array(data).slice();
      this._layout = init.layout ?? createDefaultPlaneLayout(init.format, init.codedWidth, init.codedHeight);
      this.format = init.format;
      this.codedWidth = init.codedWidth;
      this.codedHeight = init.codedHeight;
      this.rotation = init.rotation ?? 0;
      this.timestamp = init.timestamp;
      this.duration = init.duration ?? 0;
      this.colorSpace = new VideoSampleColorSpace(init.colorSpace);
    } else if (typeof VideoFrame !== "undefined" && data instanceof VideoFrame) {
      if (init?.rotation !== void 0 && ![0, 90, 180, 270].includes(init.rotation)) {
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      }
      if (init?.timestamp !== void 0 && !Number.isFinite(init?.timestamp)) {
        throw new TypeError("init.timestamp, when provided, must be a number.");
      }
      if (init?.duration !== void 0 && (!Number.isFinite(init.duration) || init.duration < 0)) {
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      }
      this._data = data;
      this._layout = null;
      this.format = data.format;
      this.codedWidth = data.displayWidth;
      this.codedHeight = data.displayHeight;
      this.rotation = init?.rotation ?? 0;
      this.timestamp = init?.timestamp ?? data.timestamp / 1e6;
      this.duration = init?.duration ?? (data.duration ?? 0) / 1e6;
      this.colorSpace = new VideoSampleColorSpace(data.colorSpace);
    } else if (typeof HTMLImageElement !== "undefined" && data instanceof HTMLImageElement || typeof SVGImageElement !== "undefined" && data instanceof SVGImageElement || typeof ImageBitmap !== "undefined" && data instanceof ImageBitmap || typeof HTMLVideoElement !== "undefined" && data instanceof HTMLVideoElement || typeof HTMLCanvasElement !== "undefined" && data instanceof HTMLCanvasElement || typeof OffscreenCanvas !== "undefined" && data instanceof OffscreenCanvas) {
      if (!init || typeof init !== "object") {
        throw new TypeError("init must be an object.");
      }
      if (init.rotation !== void 0 && ![0, 90, 180, 270].includes(init.rotation)) {
        throw new TypeError("init.rotation, when provided, must be 0, 90, 180, or 270.");
      }
      if (!Number.isFinite(init.timestamp)) {
        throw new TypeError("init.timestamp must be a number.");
      }
      if (init.duration !== void 0 && (!Number.isFinite(init.duration) || init.duration < 0)) {
        throw new TypeError("init.duration, when provided, must be a non-negative number.");
      }
      if (typeof VideoFrame !== "undefined") {
        return new VideoSample(new VideoFrame(data, {
          timestamp: Math.trunc(init.timestamp * SECOND_TO_MICROSECOND_FACTOR),
          // Drag 0 to undefined
          duration: Math.trunc((init.duration ?? 0) * SECOND_TO_MICROSECOND_FACTOR) || void 0
        }), init);
      }
      let width = 0;
      let height = 0;
      if ("naturalWidth" in data) {
        width = data.naturalWidth;
        height = data.naturalHeight;
      } else if ("videoWidth" in data) {
        width = data.videoWidth;
        height = data.videoHeight;
      } else if ("width" in data) {
        width = Number(data.width);
        height = Number(data.height);
      }
      if (!width || !height) {
        throw new TypeError("Could not determine dimensions.");
      }
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d", {
        alpha: isFirefox(),
        // Firefox has VideoFrame glitches with opaque canvases
        willReadFrequently: true
      });
      assert(context);
      context.drawImage(data, 0, 0);
      this._data = canvas;
      this._layout = null;
      this.format = "RGBX";
      this.codedWidth = width;
      this.codedHeight = height;
      this.rotation = init.rotation ?? 0;
      this.timestamp = init.timestamp;
      this.duration = init.duration ?? 0;
      this.colorSpace = new VideoSampleColorSpace({
        matrix: "rgb",
        primaries: "bt709",
        transfer: "iec61966-2-1",
        fullRange: true
      });
    } else {
      throw new TypeError("Invalid data type: Must be a BufferSource or CanvasImageSource.");
    }
    finalizationRegistry?.register(this, { type: "video", data: this._data }, this);
  }
  /** Clones this video sample. */
  clone() {
    if (this._closed) {
      throw new Error("VideoSample is closed.");
    }
    assert(this._data !== null);
    if (isVideoFrame(this._data)) {
      return new VideoSample(this._data.clone(), {
        timestamp: this.timestamp,
        duration: this.duration,
        rotation: this.rotation
      });
    } else if (this._data instanceof Uint8Array) {
      assert(this._layout);
      return new VideoSample(this._data, {
        format: this.format,
        layout: this._layout,
        codedWidth: this.codedWidth,
        codedHeight: this.codedHeight,
        timestamp: this.timestamp,
        duration: this.duration,
        colorSpace: this.colorSpace,
        rotation: this.rotation
      });
    } else {
      return new VideoSample(this._data, {
        format: this.format,
        codedWidth: this.codedWidth,
        codedHeight: this.codedHeight,
        timestamp: this.timestamp,
        duration: this.duration,
        colorSpace: this.colorSpace,
        rotation: this.rotation
      });
    }
  }
  /**
   * Closes this video sample, releasing held resources. Video samples should be closed as soon as they are not
   * needed anymore.
   */
  close() {
    if (this._closed) {
      return;
    }
    finalizationRegistry?.unregister(this);
    if (isVideoFrame(this._data)) {
      this._data.close();
    } else {
      this._data = null;
    }
    this._closed = true;
  }
  /**
   * Returns the number of bytes required to hold this video sample's pixel data. Throws if `format` is `null`.
   */
  allocationSize(options = {}) {
    validateVideoFrameCopyToOptions(options);
    if (this._closed) {
      throw new Error("VideoSample is closed.");
    }
    if (this.format === null) {
      throw new Error("Cannot get allocation size when format is null. Sorry!");
    }
    assert(this._data !== null);
    if (!isVideoFrame(this._data)) {
      if (options.colorSpace || options.format && options.format !== this.format || options.layout || options.rect) {
        const videoFrame = this.toVideoFrame();
        const size = videoFrame.allocationSize(options);
        videoFrame.close();
        return size;
      }
    }
    if (isVideoFrame(this._data)) {
      return this._data.allocationSize(options);
    } else if (this._data instanceof Uint8Array) {
      return this._data.byteLength;
    } else {
      return this.codedWidth * this.codedHeight * 4;
    }
  }
  /**
   * Copies this video sample's pixel data to an ArrayBuffer or ArrayBufferView. Throws if `format` is `null`.
   * @returns The byte layout of the planes of the copied data.
   */
  async copyTo(destination, options = {}) {
    if (!isAllowSharedBufferSource(destination)) {
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    }
    validateVideoFrameCopyToOptions(options);
    if (this._closed) {
      throw new Error("VideoSample is closed.");
    }
    if (this.format === null) {
      throw new Error("Cannot copy video sample data when format is null. Sorry!");
    }
    assert(this._data !== null);
    if (!isVideoFrame(this._data)) {
      if (options.colorSpace || options.format && options.format !== this.format || options.layout || options.rect) {
        const videoFrame = this.toVideoFrame();
        const layout = await videoFrame.copyTo(destination, options);
        videoFrame.close();
        return layout;
      }
    }
    if (isVideoFrame(this._data)) {
      return this._data.copyTo(destination, options);
    } else if (this._data instanceof Uint8Array) {
      assert(this._layout);
      const dest = toUint8Array(destination);
      dest.set(this._data);
      return this._layout;
    } else {
      const canvas = this._data;
      const context = canvas.getContext("2d");
      assert(context);
      const imageData = context.getImageData(0, 0, this.codedWidth, this.codedHeight);
      const dest = toUint8Array(destination);
      dest.set(imageData.data);
      return [{
        offset: 0,
        stride: 4 * this.codedWidth
      }];
    }
  }
  /**
   * Converts this video sample to a VideoFrame for use with the WebCodecs API. The VideoFrame returned by this
   * method *must* be closed separately from this video sample.
   */
  toVideoFrame() {
    if (this._closed) {
      throw new Error("VideoSample is closed.");
    }
    assert(this._data !== null);
    if (isVideoFrame(this._data)) {
      return new VideoFrame(this._data, {
        timestamp: this.microsecondTimestamp,
        duration: this.microsecondDuration || void 0
        // Drag 0 duration to undefined, glitches some codecs
      });
    } else if (this._data instanceof Uint8Array) {
      return new VideoFrame(this._data, {
        format: this.format,
        codedWidth: this.codedWidth,
        codedHeight: this.codedHeight,
        timestamp: this.microsecondTimestamp,
        duration: this.microsecondDuration || void 0,
        colorSpace: this.colorSpace
      });
    } else {
      return new VideoFrame(this._data, {
        timestamp: this.microsecondTimestamp,
        duration: this.microsecondDuration || void 0
      });
    }
  }
  draw(context, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    let sx = 0;
    let sy = 0;
    let sWidth = this.displayWidth;
    let sHeight = this.displayHeight;
    let dx = 0;
    let dy = 0;
    let dWidth = this.displayWidth;
    let dHeight = this.displayHeight;
    if (arg5 !== void 0) {
      sx = arg1;
      sy = arg2;
      sWidth = arg3;
      sHeight = arg4;
      dx = arg5;
      dy = arg6;
      if (arg7 !== void 0) {
        dWidth = arg7;
        dHeight = arg8;
      } else {
        dWidth = sWidth;
        dHeight = sHeight;
      }
    } else {
      dx = arg1;
      dy = arg2;
      if (arg3 !== void 0) {
        dWidth = arg3;
        dHeight = arg4;
      }
    }
    if (!(typeof CanvasRenderingContext2D !== "undefined" && context instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D !== "undefined" && context instanceof OffscreenCanvasRenderingContext2D)) {
      throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
    }
    if (!Number.isFinite(sx)) {
      throw new TypeError("sx must be a number.");
    }
    if (!Number.isFinite(sy)) {
      throw new TypeError("sy must be a number.");
    }
    if (!Number.isFinite(sWidth) || sWidth < 0) {
      throw new TypeError("sWidth must be a non-negative number.");
    }
    if (!Number.isFinite(sHeight) || sHeight < 0) {
      throw new TypeError("sHeight must be a non-negative number.");
    }
    if (!Number.isFinite(dx)) {
      throw new TypeError("dx must be a number.");
    }
    if (!Number.isFinite(dy)) {
      throw new TypeError("dy must be a number.");
    }
    if (!Number.isFinite(dWidth) || dWidth < 0) {
      throw new TypeError("dWidth must be a non-negative number.");
    }
    if (!Number.isFinite(dHeight) || dHeight < 0) {
      throw new TypeError("dHeight must be a non-negative number.");
    }
    if (this._closed) {
      throw new Error("VideoSample is closed.");
    }
    ({ sx, sy, sWidth, sHeight } = this._rotateSourceRegion(sx, sy, sWidth, sHeight, this.rotation));
    const source = this.toCanvasImageSource();
    context.save();
    const centerX = dx + dWidth / 2;
    const centerY = dy + dHeight / 2;
    context.translate(centerX, centerY);
    context.rotate(this.rotation * Math.PI / 180);
    const aspectRatioChange = this.rotation % 180 === 0 ? 1 : dWidth / dHeight;
    context.scale(1 / aspectRatioChange, aspectRatioChange);
    context.drawImage(source, sx, sy, sWidth, sHeight, -dWidth / 2, -dHeight / 2, dWidth, dHeight);
    context.restore();
  }
  /**
   * Draws the sample in the middle of the canvas corresponding to the context with the specified fit behavior.
   */
  drawWithFit(context, options) {
    if (!(typeof CanvasRenderingContext2D !== "undefined" && context instanceof CanvasRenderingContext2D || typeof OffscreenCanvasRenderingContext2D !== "undefined" && context instanceof OffscreenCanvasRenderingContext2D)) {
      throw new TypeError("context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.");
    }
    if (!options || typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (!["fill", "contain", "cover"].includes(options.fit)) {
      throw new TypeError("options.fit must be 'fill', 'contain', or 'cover'.");
    }
    if (options.rotation !== void 0 && ![0, 90, 180, 270].includes(options.rotation)) {
      throw new TypeError("options.rotation, when provided, must be 0, 90, 180, or 270.");
    }
    if (options.crop !== void 0) {
      validateCropRectangle(options.crop, "options.");
    }
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;
    const rotation = options.rotation ?? this.rotation;
    const [rotatedWidth, rotatedHeight] = rotation % 180 === 0 ? [this.codedWidth, this.codedHeight] : [this.codedHeight, this.codedWidth];
    if (options.crop) {
      clampCropRectangle(options.crop, rotatedWidth, rotatedHeight);
    }
    let dx;
    let dy;
    let newWidth;
    let newHeight;
    const { sx, sy, sWidth, sHeight } = this._rotateSourceRegion(options.crop?.left ?? 0, options.crop?.top ?? 0, options.crop?.width ?? rotatedWidth, options.crop?.height ?? rotatedHeight, rotation);
    if (options.fit === "fill") {
      dx = 0;
      dy = 0;
      newWidth = canvasWidth;
      newHeight = canvasHeight;
    } else {
      const [sampleWidth, sampleHeight] = options.crop ? [options.crop.width, options.crop.height] : [rotatedWidth, rotatedHeight];
      const scale = options.fit === "contain" ? Math.min(canvasWidth / sampleWidth, canvasHeight / sampleHeight) : Math.max(canvasWidth / sampleWidth, canvasHeight / sampleHeight);
      newWidth = sampleWidth * scale;
      newHeight = sampleHeight * scale;
      dx = (canvasWidth - newWidth) / 2;
      dy = (canvasHeight - newHeight) / 2;
    }
    context.save();
    const aspectRatioChange = rotation % 180 === 0 ? 1 : newWidth / newHeight;
    context.translate(canvasWidth / 2, canvasHeight / 2);
    context.rotate(rotation * Math.PI / 180);
    context.scale(1 / aspectRatioChange, aspectRatioChange);
    context.translate(-canvasWidth / 2, -canvasHeight / 2);
    context.drawImage(this.toCanvasImageSource(), sx, sy, sWidth, sHeight, dx, dy, newWidth, newHeight);
    context.restore();
  }
  /** @internal */
  _rotateSourceRegion(sx, sy, sWidth, sHeight, rotation) {
    if (rotation === 90) {
      [sx, sy, sWidth, sHeight] = [
        sy,
        this.codedHeight - sx - sWidth,
        sHeight,
        sWidth
      ];
    } else if (rotation === 180) {
      [sx, sy] = [
        this.codedWidth - sx - sWidth,
        this.codedHeight - sy - sHeight
      ];
    } else if (rotation === 270) {
      [sx, sy, sWidth, sHeight] = [
        this.codedWidth - sy - sHeight,
        sx,
        sHeight,
        sWidth
      ];
    }
    return { sx, sy, sWidth, sHeight };
  }
  /**
   * Converts this video sample to a
   * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource) for drawing to a canvas.
   *
   * You must use the value returned by this method immediately, as any VideoFrame created internally will
   * automatically be closed in the next microtask.
   */
  toCanvasImageSource() {
    if (this._closed) {
      throw new Error("VideoSample is closed.");
    }
    assert(this._data !== null);
    if (this._data instanceof Uint8Array) {
      const videoFrame = this.toVideoFrame();
      queueMicrotask(() => videoFrame.close());
      return videoFrame;
    } else {
      return this._data;
    }
  }
  /** Sets the rotation metadata of this video sample. */
  setRotation(newRotation) {
    if (![0, 90, 180, 270].includes(newRotation)) {
      throw new TypeError("newRotation must be 0, 90, 180, or 270.");
    }
    this.rotation = newRotation;
  }
  /** Sets the presentation timestamp of this video sample, in seconds. */
  setTimestamp(newTimestamp) {
    if (!Number.isFinite(newTimestamp)) {
      throw new TypeError("newTimestamp must be a number.");
    }
    this.timestamp = newTimestamp;
  }
  /** Sets the duration of this video sample, in seconds. */
  setDuration(newDuration) {
    if (!Number.isFinite(newDuration) || newDuration < 0) {
      throw new TypeError("newDuration must be a non-negative number.");
    }
    this.duration = newDuration;
  }
  /** Calls `.close()`. */
  [Symbol.dispose]() {
    this.close();
  }
}
class VideoSampleColorSpace {
  /** Creates a new VideoSampleColorSpace. */
  constructor(init) {
    this.primaries = init?.primaries ?? null;
    this.transfer = init?.transfer ?? null;
    this.matrix = init?.matrix ?? null;
    this.fullRange = init?.fullRange ?? null;
  }
  /** Serializes the color space to a JSON object. */
  toJSON() {
    return {
      primaries: this.primaries,
      transfer: this.transfer,
      matrix: this.matrix,
      fullRange: this.fullRange
    };
  }
}
const isVideoFrame = (x) => {
  return typeof VideoFrame !== "undefined" && x instanceof VideoFrame;
};
const clampCropRectangle = (crop, outerWidth, outerHeight) => {
  crop.left = Math.min(crop.left, outerWidth);
  crop.top = Math.min(crop.top, outerHeight);
  crop.width = Math.min(crop.width, outerWidth - crop.left);
  crop.height = Math.min(crop.height, outerHeight - crop.top);
  assert(crop.width >= 0);
  assert(crop.height >= 0);
};
const validateCropRectangle = (crop, prefix) => {
  if (!crop || typeof crop !== "object") {
    throw new TypeError(prefix + "crop, when provided, must be an object.");
  }
  if (!Number.isInteger(crop.left) || crop.left < 0) {
    throw new TypeError(prefix + "crop.left must be a non-negative integer.");
  }
  if (!Number.isInteger(crop.top) || crop.top < 0) {
    throw new TypeError(prefix + "crop.top must be a non-negative integer.");
  }
  if (!Number.isInteger(crop.width) || crop.width < 0) {
    throw new TypeError(prefix + "crop.width must be a non-negative integer.");
  }
  if (!Number.isInteger(crop.height) || crop.height < 0) {
    throw new TypeError(prefix + "crop.height must be a non-negative integer.");
  }
};
const validateVideoFrameCopyToOptions = (options) => {
  if (!options || typeof options !== "object") {
    throw new TypeError("options must be an object.");
  }
  if (options.colorSpace !== void 0 && !["display-p3", "srgb"].includes(options.colorSpace)) {
    throw new TypeError("options.colorSpace, when provided, must be 'display-p3' or 'srgb'.");
  }
  if (options.format !== void 0 && typeof options.format !== "string") {
    throw new TypeError("options.format, when provided, must be a string.");
  }
  if (options.layout !== void 0) {
    if (!Array.isArray(options.layout)) {
      throw new TypeError("options.layout, when provided, must be an array.");
    }
    for (const plane of options.layout) {
      if (!plane || typeof plane !== "object") {
        throw new TypeError("Each entry in options.layout must be an object.");
      }
      if (!Number.isInteger(plane.offset) || plane.offset < 0) {
        throw new TypeError("plane.offset must be a non-negative integer.");
      }
      if (!Number.isInteger(plane.stride) || plane.stride < 0) {
        throw new TypeError("plane.stride must be a non-negative integer.");
      }
    }
  }
  if (options.rect !== void 0) {
    if (!options.rect || typeof options.rect !== "object") {
      throw new TypeError("options.rect, when provided, must be an object.");
    }
    if (options.rect.x !== void 0 && (!Number.isInteger(options.rect.x) || options.rect.x < 0)) {
      throw new TypeError("options.rect.x, when provided, must be a non-negative integer.");
    }
    if (options.rect.y !== void 0 && (!Number.isInteger(options.rect.y) || options.rect.y < 0)) {
      throw new TypeError("options.rect.y, when provided, must be a non-negative integer.");
    }
    if (options.rect.width !== void 0 && (!Number.isInteger(options.rect.width) || options.rect.width < 0)) {
      throw new TypeError("options.rect.width, when provided, must be a non-negative integer.");
    }
    if (options.rect.height !== void 0 && (!Number.isInteger(options.rect.height) || options.rect.height < 0)) {
      throw new TypeError("options.rect.height, when provided, must be a non-negative integer.");
    }
  }
};
const createDefaultPlaneLayout = (format, codedWidth, codedHeight) => {
  const planes = getPlaneConfigs(format);
  const layouts = [];
  let currentOffset = 0;
  for (const plane of planes) {
    const planeWidth = Math.ceil(codedWidth / plane.widthDivisor);
    const planeHeight = Math.ceil(codedHeight / plane.heightDivisor);
    const stride = planeWidth * plane.sampleBytes;
    const planeSize = stride * planeHeight;
    layouts.push({
      offset: currentOffset,
      stride
    });
    currentOffset += planeSize;
  }
  return layouts;
};
const getPlaneConfigs = (format) => {
  const yuv = (yBytes, uvBytes, subX, subY, hasAlpha) => {
    const configs = [
      { sampleBytes: yBytes, widthDivisor: 1, heightDivisor: 1 },
      { sampleBytes: uvBytes, widthDivisor: subX, heightDivisor: subY },
      { sampleBytes: uvBytes, widthDivisor: subX, heightDivisor: subY }
    ];
    if (hasAlpha) {
      configs.push({ sampleBytes: yBytes, widthDivisor: 1, heightDivisor: 1 });
    }
    return configs;
  };
  switch (format) {
    case "I420":
      return yuv(1, 1, 2, 2, false);
    case "I420P10":
    case "I420P12":
      return yuv(2, 2, 2, 2, false);
    case "I420A":
      return yuv(1, 1, 2, 2, true);
    case "I420AP10":
    case "I420AP12":
      return yuv(2, 2, 2, 2, true);
    case "I422":
      return yuv(1, 1, 2, 1, false);
    case "I422P10":
    case "I422P12":
      return yuv(2, 2, 2, 1, false);
    case "I422A":
      return yuv(1, 1, 2, 1, true);
    case "I422AP10":
    case "I422AP12":
      return yuv(2, 2, 2, 1, true);
    case "I444":
      return yuv(1, 1, 1, 1, false);
    case "I444P10":
    case "I444P12":
      return yuv(2, 2, 1, 1, false);
    case "I444A":
      return yuv(1, 1, 1, 1, true);
    case "I444AP10":
    case "I444AP12":
      return yuv(2, 2, 1, 1, true);
    case "NV12":
      return [
        { sampleBytes: 1, widthDivisor: 1, heightDivisor: 1 },
        { sampleBytes: 2, widthDivisor: 2, heightDivisor: 2 }
        // Interleaved U and V
      ];
    case "RGBA":
    case "RGBX":
    case "BGRA":
    case "BGRX":
      return [
        { sampleBytes: 4, widthDivisor: 1, heightDivisor: 1 }
      ];
    default:
      assertNever(format);
      assert(false);
  }
};
const AUDIO_SAMPLE_FORMATS = /* @__PURE__ */ new Set(["f32", "f32-planar", "s16", "s16-planar", "s32", "s32-planar", "u8", "u8-planar"]);
class AudioSample {
  /** The presentation timestamp of the sample in microseconds. */
  get microsecondTimestamp() {
    return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.timestamp);
  }
  /** The duration of the sample in microseconds. */
  get microsecondDuration() {
    return Math.trunc(SECOND_TO_MICROSECOND_FACTOR * this.duration);
  }
  /**
   * Creates a new {@link AudioSample}, either from an existing
   * [`AudioData`](https://developer.mozilla.org/en-US/docs/Web/API/AudioData) or from raw bytes specified in
   * {@link AudioSampleInit}.
   */
  constructor(init) {
    this._closed = false;
    if (isAudioData(init)) {
      if (init.format === null) {
        throw new TypeError("AudioData with null format is not supported.");
      }
      this._data = init;
      this.format = init.format;
      this.sampleRate = init.sampleRate;
      this.numberOfFrames = init.numberOfFrames;
      this.numberOfChannels = init.numberOfChannels;
      this.timestamp = init.timestamp / 1e6;
      this.duration = init.numberOfFrames / init.sampleRate;
    } else {
      if (!init || typeof init !== "object") {
        throw new TypeError("Invalid AudioDataInit: must be an object.");
      }
      if (!AUDIO_SAMPLE_FORMATS.has(init.format)) {
        throw new TypeError("Invalid AudioDataInit: invalid format.");
      }
      if (!Number.isFinite(init.sampleRate) || init.sampleRate <= 0) {
        throw new TypeError("Invalid AudioDataInit: sampleRate must be > 0.");
      }
      if (!Number.isInteger(init.numberOfChannels) || init.numberOfChannels === 0) {
        throw new TypeError("Invalid AudioDataInit: numberOfChannels must be an integer > 0.");
      }
      if (!Number.isFinite(init?.timestamp)) {
        throw new TypeError("init.timestamp must be a number.");
      }
      const numberOfFrames = init.data.byteLength / (getBytesPerSample(init.format) * init.numberOfChannels);
      if (!Number.isInteger(numberOfFrames)) {
        throw new TypeError("Invalid AudioDataInit: data size is not a multiple of frame size.");
      }
      this.format = init.format;
      this.sampleRate = init.sampleRate;
      this.numberOfFrames = numberOfFrames;
      this.numberOfChannels = init.numberOfChannels;
      this.timestamp = init.timestamp;
      this.duration = numberOfFrames / init.sampleRate;
      let dataBuffer;
      if (init.data instanceof ArrayBuffer) {
        dataBuffer = new Uint8Array(init.data);
      } else if (ArrayBuffer.isView(init.data)) {
        dataBuffer = new Uint8Array(init.data.buffer, init.data.byteOffset, init.data.byteLength);
      } else {
        throw new TypeError("Invalid AudioDataInit: data is not a BufferSource.");
      }
      const expectedSize = this.numberOfFrames * this.numberOfChannels * getBytesPerSample(this.format);
      if (dataBuffer.byteLength < expectedSize) {
        throw new TypeError("Invalid AudioDataInit: insufficient data size.");
      }
      this._data = dataBuffer;
    }
    finalizationRegistry?.register(this, { type: "audio", data: this._data }, this);
  }
  /** Returns the number of bytes required to hold the audio sample's data as specified by the given options. */
  allocationSize(options) {
    if (!options || typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) {
      throw new TypeError("planeIndex must be a non-negative integer.");
    }
    if (options.format !== void 0 && !AUDIO_SAMPLE_FORMATS.has(options.format)) {
      throw new TypeError("Invalid format.");
    }
    if (options.frameOffset !== void 0 && (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)) {
      throw new TypeError("frameOffset must be a non-negative integer.");
    }
    if (options.frameCount !== void 0 && (!Number.isInteger(options.frameCount) || options.frameCount < 0)) {
      throw new TypeError("frameCount must be a non-negative integer.");
    }
    if (this._closed) {
      throw new Error("AudioSample is closed.");
    }
    const destFormat = options.format ?? this.format;
    const frameOffset = options.frameOffset ?? 0;
    if (frameOffset >= this.numberOfFrames) {
      throw new RangeError("frameOffset out of range");
    }
    const copyFrameCount = options.frameCount !== void 0 ? options.frameCount : this.numberOfFrames - frameOffset;
    if (copyFrameCount > this.numberOfFrames - frameOffset) {
      throw new RangeError("frameCount out of range");
    }
    const bytesPerSample = getBytesPerSample(destFormat);
    const isPlanar = formatIsPlanar(destFormat);
    if (isPlanar && options.planeIndex >= this.numberOfChannels) {
      throw new RangeError("planeIndex out of range");
    }
    if (!isPlanar && options.planeIndex !== 0) {
      throw new RangeError("planeIndex out of range");
    }
    const elementCount = isPlanar ? copyFrameCount : copyFrameCount * this.numberOfChannels;
    return elementCount * bytesPerSample;
  }
  /** Copies the audio sample's data to an ArrayBuffer or ArrayBufferView as specified by the given options. */
  copyTo(destination, options) {
    if (!isAllowSharedBufferSource(destination)) {
      throw new TypeError("destination must be an ArrayBuffer or an ArrayBuffer view.");
    }
    if (!options || typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) {
      throw new TypeError("planeIndex must be a non-negative integer.");
    }
    if (options.format !== void 0 && !AUDIO_SAMPLE_FORMATS.has(options.format)) {
      throw new TypeError("Invalid format.");
    }
    if (options.frameOffset !== void 0 && (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)) {
      throw new TypeError("frameOffset must be a non-negative integer.");
    }
    if (options.frameCount !== void 0 && (!Number.isInteger(options.frameCount) || options.frameCount < 0)) {
      throw new TypeError("frameCount must be a non-negative integer.");
    }
    if (this._closed) {
      throw new Error("AudioSample is closed.");
    }
    const { planeIndex, format, frameCount: optFrameCount, frameOffset: optFrameOffset } = options;
    const srcFormat = this.format;
    const destFormat = format ?? this.format;
    if (!destFormat)
      throw new Error("Destination format not determined");
    const numFrames = this.numberOfFrames;
    const numChannels = this.numberOfChannels;
    const frameOffset = optFrameOffset ?? 0;
    if (frameOffset >= numFrames) {
      throw new RangeError("frameOffset out of range");
    }
    const copyFrameCount = optFrameCount !== void 0 ? optFrameCount : numFrames - frameOffset;
    if (copyFrameCount > numFrames - frameOffset) {
      throw new RangeError("frameCount out of range");
    }
    const destBytesPerSample = getBytesPerSample(destFormat);
    const destIsPlanar = formatIsPlanar(destFormat);
    if (destIsPlanar && planeIndex >= numChannels) {
      throw new RangeError("planeIndex out of range");
    }
    if (!destIsPlanar && planeIndex !== 0) {
      throw new RangeError("planeIndex out of range");
    }
    const destElementCount = destIsPlanar ? copyFrameCount : copyFrameCount * numChannels;
    const requiredSize = destElementCount * destBytesPerSample;
    if (destination.byteLength < requiredSize) {
      throw new RangeError("Destination buffer is too small");
    }
    const destView = toDataView(destination);
    const writeFn = getWriteFunction(destFormat);
    if (isAudioData(this._data)) {
      if (isWebKit() && numChannels > 2 && destFormat !== srcFormat) {
        doAudioDataCopyToWebKitWorkaround(this._data, destView, srcFormat, destFormat, numChannels, planeIndex, frameOffset, copyFrameCount);
      } else {
        this._data.copyTo(destination, {
          planeIndex,
          frameOffset,
          frameCount: copyFrameCount,
          format: destFormat
        });
      }
    } else {
      const uint8Data = this._data;
      const srcView = toDataView(uint8Data);
      const readFn = getReadFunction(srcFormat);
      const srcBytesPerSample = getBytesPerSample(srcFormat);
      const srcIsPlanar = formatIsPlanar(srcFormat);
      for (let i = 0; i < copyFrameCount; i++) {
        if (destIsPlanar) {
          const destOffset = i * destBytesPerSample;
          let srcOffset;
          if (srcIsPlanar) {
            srcOffset = (planeIndex * numFrames + (i + frameOffset)) * srcBytesPerSample;
          } else {
            srcOffset = ((i + frameOffset) * numChannels + planeIndex) * srcBytesPerSample;
          }
          const normalized = readFn(srcView, srcOffset);
          writeFn(destView, destOffset, normalized);
        } else {
          for (let ch = 0; ch < numChannels; ch++) {
            const destIndex = i * numChannels + ch;
            const destOffset = destIndex * destBytesPerSample;
            let srcOffset;
            if (srcIsPlanar) {
              srcOffset = (ch * numFrames + (i + frameOffset)) * srcBytesPerSample;
            } else {
              srcOffset = ((i + frameOffset) * numChannels + ch) * srcBytesPerSample;
            }
            const normalized = readFn(srcView, srcOffset);
            writeFn(destView, destOffset, normalized);
          }
        }
      }
    }
  }
  /** Clones this audio sample. */
  clone() {
    if (this._closed) {
      throw new Error("AudioSample is closed.");
    }
    if (isAudioData(this._data)) {
      const sample = new AudioSample(this._data.clone());
      sample.setTimestamp(this.timestamp);
      return sample;
    } else {
      return new AudioSample({
        format: this.format,
        sampleRate: this.sampleRate,
        numberOfFrames: this.numberOfFrames,
        numberOfChannels: this.numberOfChannels,
        timestamp: this.timestamp,
        data: this._data
      });
    }
  }
  /**
   * Closes this audio sample, releasing held resources. Audio samples should be closed as soon as they are not
   * needed anymore.
   */
  close() {
    if (this._closed) {
      return;
    }
    finalizationRegistry?.unregister(this);
    if (isAudioData(this._data)) {
      this._data.close();
    } else {
      this._data = new Uint8Array(0);
    }
    this._closed = true;
  }
  /**
   * Converts this audio sample to an AudioData for use with the WebCodecs API. The AudioData returned by this
   * method *must* be closed separately from this audio sample.
   */
  toAudioData() {
    if (this._closed) {
      throw new Error("AudioSample is closed.");
    }
    if (isAudioData(this._data)) {
      if (this._data.timestamp === this.microsecondTimestamp) {
        return this._data.clone();
      } else {
        if (formatIsPlanar(this.format)) {
          const size = this.allocationSize({ planeIndex: 0, format: this.format });
          const data = new ArrayBuffer(size * this.numberOfChannels);
          for (let i = 0; i < this.numberOfChannels; i++) {
            this.copyTo(new Uint8Array(data, i * size, size), { planeIndex: i, format: this.format });
          }
          return new AudioData({
            format: this.format,
            sampleRate: this.sampleRate,
            numberOfFrames: this.numberOfFrames,
            numberOfChannels: this.numberOfChannels,
            timestamp: this.microsecondTimestamp,
            data
          });
        } else {
          const data = new ArrayBuffer(this.allocationSize({ planeIndex: 0, format: this.format }));
          this.copyTo(data, { planeIndex: 0, format: this.format });
          return new AudioData({
            format: this.format,
            sampleRate: this.sampleRate,
            numberOfFrames: this.numberOfFrames,
            numberOfChannels: this.numberOfChannels,
            timestamp: this.microsecondTimestamp,
            data
          });
        }
      }
    } else {
      return new AudioData({
        format: this.format,
        sampleRate: this.sampleRate,
        numberOfFrames: this.numberOfFrames,
        numberOfChannels: this.numberOfChannels,
        timestamp: this.microsecondTimestamp,
        data: this._data.buffer instanceof ArrayBuffer ? this._data.buffer : this._data.slice()
        // In the case of SharedArrayBuffer, convert to ArrayBuffer
      });
    }
  }
  /** Convert this audio sample to an AudioBuffer for use with the Web Audio API. */
  toAudioBuffer() {
    if (this._closed) {
      throw new Error("AudioSample is closed.");
    }
    const audioBuffer = new AudioBuffer({
      numberOfChannels: this.numberOfChannels,
      length: this.numberOfFrames,
      sampleRate: this.sampleRate
    });
    const dataBytes = new Float32Array(this.allocationSize({ planeIndex: 0, format: "f32-planar" }) / 4);
    for (let i = 0; i < this.numberOfChannels; i++) {
      this.copyTo(dataBytes, { planeIndex: i, format: "f32-planar" });
      audioBuffer.copyToChannel(dataBytes, i);
    }
    return audioBuffer;
  }
  /** Sets the presentation timestamp of this audio sample, in seconds. */
  setTimestamp(newTimestamp) {
    if (!Number.isFinite(newTimestamp)) {
      throw new TypeError("newTimestamp must be a number.");
    }
    this.timestamp = newTimestamp;
  }
  /** Calls `.close()`. */
  [Symbol.dispose]() {
    this.close();
  }
  /** @internal */
  static *_fromAudioBuffer(audioBuffer, timestamp) {
    if (!(audioBuffer instanceof AudioBuffer)) {
      throw new TypeError("audioBuffer must be an AudioBuffer.");
    }
    const MAX_FLOAT_COUNT = 48e3 * 5;
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const totalFrames = audioBuffer.length;
    const maxFramesPerChunk = Math.floor(MAX_FLOAT_COUNT / numberOfChannels);
    let currentRelativeFrame = 0;
    let remainingFrames = totalFrames;
    while (remainingFrames > 0) {
      const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
      const chunkData = new Float32Array(numberOfChannels * framesToCopy);
      for (let channel = 0; channel < numberOfChannels; channel++) {
        audioBuffer.copyFromChannel(chunkData.subarray(channel * framesToCopy, (channel + 1) * framesToCopy), channel, currentRelativeFrame);
      }
      yield new AudioSample({
        format: "f32-planar",
        sampleRate,
        numberOfFrames: framesToCopy,
        numberOfChannels,
        timestamp: timestamp + currentRelativeFrame / sampleRate,
        data: chunkData
      });
      currentRelativeFrame += framesToCopy;
      remainingFrames -= framesToCopy;
    }
  }
  /**
   * Creates AudioSamples from an AudioBuffer, starting at the given timestamp in seconds. Typically creates exactly
   * one sample, but may create multiple if the AudioBuffer is exceedingly large.
   */
  static fromAudioBuffer(audioBuffer, timestamp) {
    if (!(audioBuffer instanceof AudioBuffer)) {
      throw new TypeError("audioBuffer must be an AudioBuffer.");
    }
    const MAX_FLOAT_COUNT = 48e3 * 5;
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const totalFrames = audioBuffer.length;
    const maxFramesPerChunk = Math.floor(MAX_FLOAT_COUNT / numberOfChannels);
    let currentRelativeFrame = 0;
    let remainingFrames = totalFrames;
    const result = [];
    while (remainingFrames > 0) {
      const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
      const chunkData = new Float32Array(numberOfChannels * framesToCopy);
      for (let channel = 0; channel < numberOfChannels; channel++) {
        audioBuffer.copyFromChannel(chunkData.subarray(channel * framesToCopy, (channel + 1) * framesToCopy), channel, currentRelativeFrame);
      }
      const audioSample = new AudioSample({
        format: "f32-planar",
        sampleRate,
        numberOfFrames: framesToCopy,
        numberOfChannels,
        timestamp: timestamp + currentRelativeFrame / sampleRate,
        data: chunkData
      });
      result.push(audioSample);
      currentRelativeFrame += framesToCopy;
      remainingFrames -= framesToCopy;
    }
    return result;
  }
}
const getBytesPerSample = (format) => {
  switch (format) {
    case "u8":
    case "u8-planar":
      return 1;
    case "s16":
    case "s16-planar":
      return 2;
    case "s32":
    case "s32-planar":
      return 4;
    case "f32":
    case "f32-planar":
      return 4;
    default:
      throw new Error("Unknown AudioSampleFormat");
  }
};
const formatIsPlanar = (format) => {
  switch (format) {
    case "u8-planar":
    case "s16-planar":
    case "s32-planar":
    case "f32-planar":
      return true;
    default:
      return false;
  }
};
const getReadFunction = (format) => {
  switch (format) {
    case "u8":
    case "u8-planar":
      return (view, offset) => (view.getUint8(offset) - 128) / 128;
    case "s16":
    case "s16-planar":
      return (view, offset) => view.getInt16(offset, true) / 32768;
    case "s32":
    case "s32-planar":
      return (view, offset) => view.getInt32(offset, true) / 2147483648;
    case "f32":
    case "f32-planar":
      return (view, offset) => view.getFloat32(offset, true);
  }
};
const getWriteFunction = (format) => {
  switch (format) {
    case "u8":
    case "u8-planar":
      return (view, offset, value) => view.setUint8(offset, clamp$1((value + 1) * 127.5, 0, 255));
    case "s16":
    case "s16-planar":
      return (view, offset, value) => view.setInt16(offset, clamp$1(Math.round(value * 32767), -32768, 32767), true);
    case "s32":
    case "s32-planar":
      return (view, offset, value) => view.setInt32(offset, clamp$1(Math.round(value * 2147483647), -2147483648, 2147483647), true);
    case "f32":
    case "f32-planar":
      return (view, offset, value) => view.setFloat32(offset, value, true);
  }
};
const isAudioData = (x) => {
  return typeof AudioData !== "undefined" && x instanceof AudioData;
};
const doAudioDataCopyToWebKitWorkaround = (audioData, destView, srcFormat, destFormat, numChannels, planeIndex, frameOffset, copyFrameCount) => {
  const readFn = getReadFunction(srcFormat);
  const writeFn = getWriteFunction(destFormat);
  const srcBytesPerSample = getBytesPerSample(srcFormat);
  const destBytesPerSample = getBytesPerSample(destFormat);
  const srcIsPlanar = formatIsPlanar(srcFormat);
  const destIsPlanar = formatIsPlanar(destFormat);
  if (destIsPlanar) {
    if (srcIsPlanar) {
      const data = new ArrayBuffer(copyFrameCount * srcBytesPerSample);
      const dataView = toDataView(data);
      audioData.copyTo(data, {
        planeIndex,
        frameOffset,
        frameCount: copyFrameCount,
        format: srcFormat
      });
      for (let i = 0; i < copyFrameCount; i++) {
        const srcOffset = i * srcBytesPerSample;
        const destOffset = i * destBytesPerSample;
        const sample = readFn(dataView, srcOffset);
        writeFn(destView, destOffset, sample);
      }
    } else {
      const data = new ArrayBuffer(copyFrameCount * numChannels * srcBytesPerSample);
      const dataView = toDataView(data);
      audioData.copyTo(data, {
        planeIndex: 0,
        frameOffset,
        frameCount: copyFrameCount,
        format: srcFormat
      });
      for (let i = 0; i < copyFrameCount; i++) {
        const srcOffset = (i * numChannels + planeIndex) * srcBytesPerSample;
        const destOffset = i * destBytesPerSample;
        const sample = readFn(dataView, srcOffset);
        writeFn(destView, destOffset, sample);
      }
    }
  } else {
    if (srcIsPlanar) {
      const planeSize = copyFrameCount * srcBytesPerSample;
      const data = new ArrayBuffer(planeSize);
      const dataView = toDataView(data);
      for (let ch = 0; ch < numChannels; ch++) {
        audioData.copyTo(data, {
          planeIndex: ch,
          frameOffset,
          frameCount: copyFrameCount,
          format: srcFormat
        });
        for (let i = 0; i < copyFrameCount; i++) {
          const srcOffset = i * srcBytesPerSample;
          const destOffset = (i * numChannels + ch) * destBytesPerSample;
          const sample = readFn(dataView, srcOffset);
          writeFn(destView, destOffset, sample);
        }
      }
    } else {
      const data = new ArrayBuffer(copyFrameCount * numChannels * srcBytesPerSample);
      const dataView = toDataView(data);
      audioData.copyTo(data, {
        planeIndex: 0,
        frameOffset,
        frameCount: copyFrameCount,
        format: srcFormat
      });
      for (let i = 0; i < copyFrameCount; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
          const idx = i * numChannels + ch;
          const srcOffset = idx * srcBytesPerSample;
          const destOffset = idx * destBytesPerSample;
          const sample = readFn(dataView, srcOffset);
          writeFn(destView, destOffset, sample);
        }
      }
    }
  }
};
const validatePacketRetrievalOptions = (options) => {
  if (!options || typeof options !== "object") {
    throw new TypeError("options must be an object.");
  }
  if (options.metadataOnly !== void 0 && typeof options.metadataOnly !== "boolean") {
    throw new TypeError("options.metadataOnly, when defined, must be a boolean.");
  }
  if (options.verifyKeyPackets !== void 0 && typeof options.verifyKeyPackets !== "boolean") {
    throw new TypeError("options.verifyKeyPackets, when defined, must be a boolean.");
  }
  if (options.verifyKeyPackets && options.metadataOnly) {
    throw new TypeError("options.verifyKeyPackets and options.metadataOnly cannot be enabled together.");
  }
};
const validateTimestamp = (timestamp) => {
  if (!isNumber(timestamp)) {
    throw new TypeError("timestamp must be a number.");
  }
};
const maybeFixPacketType = (track, promise, options) => {
  if (options.verifyKeyPackets) {
    return promise.then(async (packet) => {
      if (!packet || packet.type === "delta") {
        return packet;
      }
      const determinedType = await track.determinePacketType(packet);
      if (determinedType) {
        packet.type = determinedType;
      }
      return packet;
    });
  } else {
    return promise;
  }
};
class EncodedPacketSink {
  /** Creates a new {@link EncodedPacketSink} for the given {@link InputTrack}. */
  constructor(track) {
    if (!(track instanceof InputTrack)) {
      throw new TypeError("track must be an InputTrack.");
    }
    this._track = track;
  }
  /**
   * Retrieves the track's first packet (in decode order), or null if it has no packets. The first packet is very
   * likely to be a key packet.
   */
  getFirstPacket(options = {}) {
    validatePacketRetrievalOptions(options);
    if (this._track.input._disposed) {
      throw new InputDisposedError();
    }
    return maybeFixPacketType(this._track, this._track._backing.getFirstPacket(options), options);
  }
  /**
   * Retrieves the packet corresponding to the given timestamp, in seconds. More specifically, returns the last packet
   * (in presentation order) with a start timestamp less than or equal to the given timestamp. This method can be
   * used to retrieve a track's last packet using `getPacket(Infinity)`. The method returns null if the timestamp
   * is before the first packet in the track.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  getPacket(timestamp, options = {}) {
    validateTimestamp(timestamp);
    validatePacketRetrievalOptions(options);
    if (this._track.input._disposed) {
      throw new InputDisposedError();
    }
    return maybeFixPacketType(this._track, this._track._backing.getPacket(timestamp, options), options);
  }
  /**
   * Retrieves the packet following the given packet (in decode order), or null if the given packet is the
   * last packet.
   */
  getNextPacket(packet, options = {}) {
    if (!(packet instanceof EncodedPacket)) {
      throw new TypeError("packet must be an EncodedPacket.");
    }
    validatePacketRetrievalOptions(options);
    if (this._track.input._disposed) {
      throw new InputDisposedError();
    }
    return maybeFixPacketType(this._track, this._track._backing.getNextPacket(packet, options), options);
  }
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
  async getKeyPacket(timestamp, options = {}) {
    validateTimestamp(timestamp);
    validatePacketRetrievalOptions(options);
    if (this._track.input._disposed) {
      throw new InputDisposedError();
    }
    if (!options.verifyKeyPackets) {
      return this._track._backing.getKeyPacket(timestamp, options);
    }
    const packet = await this._track._backing.getKeyPacket(timestamp, options);
    if (!packet) {
      return packet;
    }
    assert(packet.type === "key");
    const determinedType = await this._track.determinePacketType(packet);
    if (determinedType === "delta") {
      return this.getKeyPacket(packet.timestamp - 1 / this._track.timeResolution, options);
    }
    return packet;
  }
  /**
   * Retrieves the key packet following the given packet (in decode order), or null if the given packet is the last
   * key packet.
   *
   * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
   */
  async getNextKeyPacket(packet, options = {}) {
    if (!(packet instanceof EncodedPacket)) {
      throw new TypeError("packet must be an EncodedPacket.");
    }
    validatePacketRetrievalOptions(options);
    if (this._track.input._disposed) {
      throw new InputDisposedError();
    }
    if (!options.verifyKeyPackets) {
      return this._track._backing.getNextKeyPacket(packet, options);
    }
    const nextPacket = await this._track._backing.getNextKeyPacket(packet, options);
    if (!nextPacket) {
      return nextPacket;
    }
    assert(nextPacket.type === "key");
    const determinedType = await this._track.determinePacketType(nextPacket);
    if (determinedType === "delta") {
      return this.getNextKeyPacket(nextPacket, options);
    }
    return nextPacket;
  }
  /**
   * Creates an async iterator that yields the packets in this track in decode order. To enable fast iteration, this
   * method will intelligently preload packets based on the speed of the consumer.
   *
   * @param startPacket - (optional) The packet from which iteration should begin. This packet will also be yielded.
   * @param endTimestamp - (optional) The timestamp at which iteration should end. This packet will _not_ be yielded.
   */
  packets(startPacket, endPacket, options = {}) {
    if (startPacket !== void 0 && !(startPacket instanceof EncodedPacket)) {
      throw new TypeError("startPacket must be an EncodedPacket.");
    }
    if (startPacket !== void 0 && startPacket.isMetadataOnly && !options?.metadataOnly) {
      throw new TypeError("startPacket can only be metadata-only if options.metadataOnly is enabled.");
    }
    if (endPacket !== void 0 && !(endPacket instanceof EncodedPacket)) {
      throw new TypeError("endPacket must be an EncodedPacket.");
    }
    validatePacketRetrievalOptions(options);
    if (this._track.input._disposed) {
      throw new InputDisposedError();
    }
    const packetQueue = [];
    let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers();
    let { promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers();
    let ended = false;
    let terminated = false;
    let outOfBandError = null;
    const timestamps = [];
    const maxQueueSize = () => Math.max(2, timestamps.length);
    (async () => {
      let packet = startPacket ?? await this.getFirstPacket(options);
      while (packet && !terminated && !this._track.input._disposed) {
        if (endPacket && packet.sequenceNumber >= endPacket?.sequenceNumber) {
          break;
        }
        if (packetQueue.length > maxQueueSize()) {
          ({ promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers());
          await queueDequeue;
          continue;
        }
        packetQueue.push(packet);
        onQueueNotEmpty();
        ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers());
        packet = await this.getNextPacket(packet, options);
      }
      ended = true;
      onQueueNotEmpty();
    })().catch((error) => {
      if (!outOfBandError) {
        outOfBandError = error;
        onQueueNotEmpty();
      }
    });
    const track = this._track;
    return {
      async next() {
        while (true) {
          if (track.input._disposed) {
            throw new InputDisposedError();
          } else if (terminated) {
            return { value: void 0, done: true };
          } else if (outOfBandError) {
            throw outOfBandError;
          } else if (packetQueue.length > 0) {
            const value = packetQueue.shift();
            const now = performance.now();
            timestamps.push(now);
            while (timestamps.length > 0 && now - timestamps[0] >= 1e3) {
              timestamps.shift();
            }
            onQueueDequeue();
            return { value, done: false };
          } else if (ended) {
            return { value: void 0, done: true };
          } else {
            await queueNotEmpty;
          }
        }
      },
      async return() {
        terminated = true;
        onQueueDequeue();
        onQueueNotEmpty();
        return { value: void 0, done: true };
      },
      async throw(error) {
        throw error;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
}
class DecoderWrapper {
  constructor(onSample, onError) {
    this.onSample = onSample;
    this.onError = onError;
  }
}
class BaseMediaSampleSink {
  /** @internal */
  mediaSamplesInRange(startTimestamp = 0, endTimestamp = Infinity) {
    validateTimestamp(startTimestamp);
    validateTimestamp(endTimestamp);
    const sampleQueue = [];
    let firstSampleQueued = false;
    let lastSample = null;
    let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers();
    let { promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers();
    let decoderIsFlushed = false;
    let ended = false;
    let terminated = false;
    let outOfBandError = null;
    (async () => {
      const decoder = await this._createDecoder((sample) => {
        onQueueDequeue();
        if (sample.timestamp >= endTimestamp) {
          ended = true;
        }
        if (ended) {
          sample.close();
          return;
        }
        if (lastSample) {
          if (sample.timestamp > startTimestamp) {
            sampleQueue.push(lastSample);
            firstSampleQueued = true;
          } else {
            lastSample.close();
          }
        }
        if (sample.timestamp >= startTimestamp) {
          sampleQueue.push(sample);
          firstSampleQueued = true;
        }
        lastSample = firstSampleQueued ? null : sample;
        if (sampleQueue.length > 0) {
          onQueueNotEmpty();
          ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers());
        }
      }, (error) => {
        if (!outOfBandError) {
          outOfBandError = error;
          onQueueNotEmpty();
        }
      });
      const packetSink = this._createPacketSink();
      const keyPacket = await packetSink.getKeyPacket(startTimestamp, { verifyKeyPackets: true }) ?? await packetSink.getFirstPacket();
      let currentPacket = keyPacket;
      const endPacket = void 0;
      const packets = packetSink.packets(keyPacket ?? void 0, endPacket);
      await packets.next();
      while (currentPacket && !ended && !this._track.input._disposed) {
        const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
        if (sampleQueue.length + decoder.getDecodeQueueSize() > maxQueueSize) {
          ({ promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers());
          await queueDequeue;
          continue;
        }
        decoder.decode(currentPacket);
        const packetResult = await packets.next();
        if (packetResult.done) {
          break;
        }
        currentPacket = packetResult.value;
      }
      await packets.return();
      if (!terminated && !this._track.input._disposed) {
        await decoder.flush();
      }
      decoder.close();
      if (!firstSampleQueued && lastSample) {
        sampleQueue.push(lastSample);
      }
      decoderIsFlushed = true;
      onQueueNotEmpty();
    })().catch((error) => {
      if (!outOfBandError) {
        outOfBandError = error;
        onQueueNotEmpty();
      }
    });
    const track = this._track;
    const closeSamples = () => {
      lastSample?.close();
      for (const sample of sampleQueue) {
        sample.close();
      }
    };
    return {
      async next() {
        while (true) {
          if (track.input._disposed) {
            closeSamples();
            throw new InputDisposedError();
          } else if (terminated) {
            return { value: void 0, done: true };
          } else if (outOfBandError) {
            closeSamples();
            throw outOfBandError;
          } else if (sampleQueue.length > 0) {
            const value = sampleQueue.shift();
            onQueueDequeue();
            return { value, done: false };
          } else if (!decoderIsFlushed) {
            await queueNotEmpty;
          } else {
            return { value: void 0, done: true };
          }
        }
      },
      async return() {
        terminated = true;
        ended = true;
        onQueueDequeue();
        onQueueNotEmpty();
        closeSamples();
        return { value: void 0, done: true };
      },
      async throw(error) {
        throw error;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
  /** @internal */
  mediaSamplesAtTimestamps(timestamps) {
    validateAnyIterable(timestamps);
    const timestampIterator = toAsyncIterator(timestamps);
    const timestampsOfInterest = [];
    const sampleQueue = [];
    let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers();
    let { promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers();
    let decoderIsFlushed = false;
    let terminated = false;
    let outOfBandError = null;
    const pushToQueue = (sample) => {
      sampleQueue.push(sample);
      onQueueNotEmpty();
      ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = promiseWithResolvers());
    };
    (async () => {
      const decoder = await this._createDecoder((sample) => {
        onQueueDequeue();
        if (terminated) {
          sample.close();
          return;
        }
        let sampleUses = 0;
        while (timestampsOfInterest.length > 0 && sample.timestamp - timestampsOfInterest[0] > -1e-10) {
          sampleUses++;
          timestampsOfInterest.shift();
        }
        if (sampleUses > 0) {
          for (let i = 0; i < sampleUses; i++) {
            pushToQueue(i < sampleUses - 1 ? sample.clone() : sample);
          }
        } else {
          sample.close();
        }
      }, (error) => {
        if (!outOfBandError) {
          outOfBandError = error;
          onQueueNotEmpty();
        }
      });
      const packetSink = this._createPacketSink();
      let lastPacket = null;
      let lastKeyPacket = null;
      let maxSequenceNumber = -1;
      const decodePackets = async () => {
        assert(lastKeyPacket);
        let currentPacket = lastKeyPacket;
        decoder.decode(currentPacket);
        while (currentPacket.sequenceNumber < maxSequenceNumber) {
          const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
          while (sampleQueue.length + decoder.getDecodeQueueSize() > maxQueueSize && !terminated) {
            ({ promise: queueDequeue, resolve: onQueueDequeue } = promiseWithResolvers());
            await queueDequeue;
          }
          if (terminated) {
            break;
          }
          const nextPacket = await packetSink.getNextPacket(currentPacket);
          assert(nextPacket);
          decoder.decode(nextPacket);
          currentPacket = nextPacket;
        }
        maxSequenceNumber = -1;
      };
      const flushDecoder = async () => {
        await decoder.flush();
        for (let i = 0; i < timestampsOfInterest.length; i++) {
          pushToQueue(null);
        }
        timestampsOfInterest.length = 0;
      };
      for await (const timestamp of timestampIterator) {
        validateTimestamp(timestamp);
        if (terminated || this._track.input._disposed) {
          break;
        }
        const targetPacket = await packetSink.getPacket(timestamp);
        const keyPacket = targetPacket && await packetSink.getKeyPacket(timestamp, { verifyKeyPackets: true });
        if (!keyPacket) {
          if (maxSequenceNumber !== -1) {
            await decodePackets();
            await flushDecoder();
          }
          pushToQueue(null);
          lastPacket = null;
          continue;
        }
        if (lastPacket && (keyPacket.sequenceNumber !== lastKeyPacket.sequenceNumber || targetPacket.timestamp < lastPacket.timestamp)) {
          await decodePackets();
          await flushDecoder();
        }
        timestampsOfInterest.push(targetPacket.timestamp);
        maxSequenceNumber = Math.max(targetPacket.sequenceNumber, maxSequenceNumber);
        lastPacket = targetPacket;
        lastKeyPacket = keyPacket;
      }
      if (!terminated && !this._track.input._disposed) {
        if (maxSequenceNumber !== -1) {
          await decodePackets();
        }
        await flushDecoder();
      }
      decoder.close();
      decoderIsFlushed = true;
      onQueueNotEmpty();
    })().catch((error) => {
      if (!outOfBandError) {
        outOfBandError = error;
        onQueueNotEmpty();
      }
    });
    const track = this._track;
    const closeSamples = () => {
      for (const sample of sampleQueue) {
        sample?.close();
      }
    };
    return {
      async next() {
        while (true) {
          if (track.input._disposed) {
            closeSamples();
            throw new InputDisposedError();
          } else if (terminated) {
            return { value: void 0, done: true };
          } else if (outOfBandError) {
            closeSamples();
            throw outOfBandError;
          } else if (sampleQueue.length > 0) {
            const value = sampleQueue.shift();
            assert(value !== void 0);
            onQueueDequeue();
            return { value, done: false };
          } else if (!decoderIsFlushed) {
            await queueNotEmpty;
          } else {
            return { value: void 0, done: true };
          }
        }
      },
      async return() {
        terminated = true;
        onQueueDequeue();
        onQueueNotEmpty();
        closeSamples();
        return { value: void 0, done: true };
      },
      async throw(error) {
        throw error;
      },
      [Symbol.asyncIterator]() {
        return this;
      }
    };
  }
}
const computeMaxQueueSize = (decodedSampleQueueSize) => {
  return decodedSampleQueueSize === 0 ? 40 : 8;
};
class VideoDecoderWrapper extends DecoderWrapper {
  constructor(onSample, onError, codec, decoderConfig, rotation, timeResolution) {
    super(onSample, onError);
    this.codec = codec;
    this.decoderConfig = decoderConfig;
    this.rotation = rotation;
    this.timeResolution = timeResolution;
    this.decoder = null;
    this.customDecoder = null;
    this.customDecoderCallSerializer = new CallSerializer();
    this.customDecoderQueueSize = 0;
    this.inputTimestamps = [];
    this.sampleQueue = [];
    this.currentPacketIndex = 0;
    this.raslSkipped = false;
    this.alphaDecoder = null;
    this.alphaHadKeyframe = false;
    this.colorQueue = [];
    this.alphaQueue = [];
    this.merger = null;
    this.mergerCreationFailed = false;
    this.decodedAlphaChunkCount = 0;
    this.alphaDecoderQueueSize = 0;
    this.nullAlphaFrameQueue = [];
    this.currentAlphaPacketIndex = 0;
    this.alphaRaslSkipped = false;
    const MatchingCustomDecoder = customVideoDecoders.find((x) => x.supports(codec, decoderConfig));
    if (MatchingCustomDecoder) {
      this.customDecoder = new MatchingCustomDecoder();
      this.customDecoder.codec = codec;
      this.customDecoder.config = decoderConfig;
      this.customDecoder.onSample = (sample) => {
        if (!(sample instanceof VideoSample)) {
          throw new TypeError("The argument passed to onSample must be a VideoSample.");
        }
        this.finalizeAndEmitSample(sample);
      };
      void this.customDecoderCallSerializer.call(() => this.customDecoder.init());
    } else {
      const colorHandler = (frame) => {
        if (this.alphaQueue.length > 0) {
          const alphaFrame = this.alphaQueue.shift();
          assert(alphaFrame !== void 0);
          this.mergeAlpha(frame, alphaFrame);
        } else {
          this.colorQueue.push(frame);
        }
      };
      if (codec === "avc" && this.decoderConfig.description && isChromium()) {
        const record = deserializeAvcDecoderConfigurationRecord(toUint8Array(this.decoderConfig.description));
        if (record && record.sequenceParameterSets.length > 0) {
          const sps = parseAvcSps(record.sequenceParameterSets[0]);
          if (sps && sps.frameMbsOnlyFlag === 0) {
            this.decoderConfig = {
              ...this.decoderConfig,
              hardwareAcceleration: "prefer-software"
            };
          }
        }
      }
      const stack = new Error("Decoding error").stack;
      this.decoder = new VideoDecoder({
        output: (frame) => {
          try {
            colorHandler(frame);
          } catch (error) {
            this.onError(error);
          }
        },
        error: (error) => {
          error.stack = stack;
          this.onError(error);
        }
      });
      this.decoder.configure(this.decoderConfig);
    }
  }
  getDecodeQueueSize() {
    if (this.customDecoder) {
      return this.customDecoderQueueSize;
    } else {
      assert(this.decoder);
      return Math.max(this.decoder.decodeQueueSize, this.alphaDecoder?.decodeQueueSize ?? 0);
    }
  }
  decode(packet) {
    if (this.codec === "hevc" && this.currentPacketIndex > 0 && !this.raslSkipped) {
      if (this.hasHevcRaslPicture(packet.data)) {
        return;
      }
      this.raslSkipped = true;
    }
    if (this.customDecoder) {
      this.customDecoderQueueSize++;
      void this.customDecoderCallSerializer.call(() => this.customDecoder.decode(packet)).then(() => this.customDecoderQueueSize--);
    } else {
      assert(this.decoder);
      if (!isWebKit()) {
        insertSorted(this.inputTimestamps, packet.timestamp, (x) => x);
      }
      if (isChromium() && this.currentPacketIndex === 0 && this.codec === "avc") {
        const nalUnits = extractAvcNalUnits(packet.data, this.decoderConfig);
        const filteredNalUnits = nalUnits.filter((x) => {
          const type = extractNalUnitTypeForAvc(x);
          return !(type >= 20 && type <= 31);
        });
        const newData = concatAvcNalUnits(filteredNalUnits, this.decoderConfig);
        packet = new EncodedPacket(newData, packet.type, packet.timestamp, packet.duration);
      }
      this.decoder.decode(packet.toEncodedVideoChunk());
      this.decodeAlphaData(packet);
    }
    this.currentPacketIndex++;
  }
  decodeAlphaData(packet) {
    if (!packet.sideData.alpha || this.mergerCreationFailed) {
      this.pushNullAlphaFrame();
      return;
    }
    if (!this.merger) {
      try {
        this.merger = new ColorAlphaMerger();
      } catch (error) {
        console.error("Due to an error, only color data will be decoded.", error);
        this.mergerCreationFailed = true;
        this.decodeAlphaData(packet);
        return;
      }
    }
    if (!this.alphaDecoder) {
      const alphaHandler = (frame) => {
        this.alphaDecoderQueueSize--;
        if (this.colorQueue.length > 0) {
          const colorFrame = this.colorQueue.shift();
          assert(colorFrame !== void 0);
          this.mergeAlpha(colorFrame, frame);
        } else {
          this.alphaQueue.push(frame);
        }
        this.decodedAlphaChunkCount++;
        while (this.nullAlphaFrameQueue.length > 0 && this.nullAlphaFrameQueue[0] === this.decodedAlphaChunkCount) {
          this.nullAlphaFrameQueue.shift();
          if (this.colorQueue.length > 0) {
            const colorFrame = this.colorQueue.shift();
            assert(colorFrame !== void 0);
            this.mergeAlpha(colorFrame, null);
          } else {
            this.alphaQueue.push(null);
          }
        }
      };
      const stack = new Error("Decoding error").stack;
      this.alphaDecoder = new VideoDecoder({
        output: (frame) => {
          try {
            alphaHandler(frame);
          } catch (error) {
            this.onError(error);
          }
        },
        error: (error) => {
          error.stack = stack;
          this.onError(error);
        }
      });
      this.alphaDecoder.configure(this.decoderConfig);
    }
    const type = determineVideoPacketType(this.codec, this.decoderConfig, packet.sideData.alpha);
    if (!this.alphaHadKeyframe) {
      this.alphaHadKeyframe = type === "key";
    }
    if (this.alphaHadKeyframe) {
      if (this.codec === "hevc" && this.currentAlphaPacketIndex > 0 && !this.alphaRaslSkipped) {
        if (this.hasHevcRaslPicture(packet.sideData.alpha)) {
          this.pushNullAlphaFrame();
          return;
        }
        this.alphaRaslSkipped = true;
      }
      this.currentAlphaPacketIndex++;
      this.alphaDecoder.decode(packet.alphaToEncodedVideoChunk(type ?? packet.type));
      this.alphaDecoderQueueSize++;
    } else {
      this.pushNullAlphaFrame();
    }
  }
  pushNullAlphaFrame() {
    if (this.alphaDecoderQueueSize === 0) {
      this.alphaQueue.push(null);
    } else {
      this.nullAlphaFrameQueue.push(this.decodedAlphaChunkCount + this.alphaDecoderQueueSize);
    }
  }
  /**
   * If we're using HEVC, we need to make sure to skip any RASL slices that follow a non-IDR key frame such as
   * CRA_NUT. This is because RASL slices cannot be decoded without data before the CRA_NUT. Browsers behave
   * differently here: Chromium drops the packets, Safari throws a decoder error. Either way, it's not good
   * and causes bugs upstream. So, let's take the dropping into our own hands.
   */
  hasHevcRaslPicture(packetData) {
    const nalUnits = extractHevcNalUnits(packetData, this.decoderConfig);
    return nalUnits.some((x) => {
      const type = extractNalUnitTypeForHevc(x);
      return type === HevcNalUnitType.RASL_N || type === HevcNalUnitType.RASL_R;
    });
  }
  /** Handler for the WebCodecs VideoDecoder for ironing out browser differences. */
  sampleHandler(sample) {
    if (isWebKit()) {
      if (this.sampleQueue.length > 0 && sample.timestamp >= last(this.sampleQueue).timestamp) {
        for (const sample2 of this.sampleQueue) {
          this.finalizeAndEmitSample(sample2);
        }
        this.sampleQueue.length = 0;
      }
      insertSorted(this.sampleQueue, sample, (x) => x.timestamp);
    } else {
      const timestamp = this.inputTimestamps.shift();
      assert(timestamp !== void 0);
      sample.setTimestamp(timestamp);
      this.finalizeAndEmitSample(sample);
    }
  }
  finalizeAndEmitSample(sample) {
    sample.setTimestamp(Math.round(sample.timestamp * this.timeResolution) / this.timeResolution);
    sample.setDuration(Math.round(sample.duration * this.timeResolution) / this.timeResolution);
    sample.setRotation(this.rotation);
    this.onSample(sample);
  }
  mergeAlpha(color, alpha) {
    if (!alpha) {
      const finalSample2 = new VideoSample(color);
      this.sampleHandler(finalSample2);
      return;
    }
    assert(this.merger);
    this.merger.update(color, alpha);
    color.close();
    alpha.close();
    const finalFrame = new VideoFrame(this.merger.canvas, {
      timestamp: color.timestamp,
      duration: color.duration ?? void 0
    });
    const finalSample = new VideoSample(finalFrame);
    this.sampleHandler(finalSample);
  }
  async flush() {
    if (this.customDecoder) {
      await this.customDecoderCallSerializer.call(() => this.customDecoder.flush());
    } else {
      assert(this.decoder);
      await Promise.all([
        this.decoder.flush(),
        this.alphaDecoder?.flush()
      ]);
      this.colorQueue.forEach((x) => x.close());
      this.colorQueue.length = 0;
      this.alphaQueue.forEach((x) => x?.close());
      this.alphaQueue.length = 0;
      this.alphaHadKeyframe = false;
      this.decodedAlphaChunkCount = 0;
      this.alphaDecoderQueueSize = 0;
      this.nullAlphaFrameQueue.length = 0;
      this.currentAlphaPacketIndex = 0;
      this.alphaRaslSkipped = false;
    }
    if (isWebKit()) {
      for (const sample of this.sampleQueue) {
        this.finalizeAndEmitSample(sample);
      }
      this.sampleQueue.length = 0;
    }
    this.currentPacketIndex = 0;
    this.raslSkipped = false;
  }
  close() {
    if (this.customDecoder) {
      void this.customDecoderCallSerializer.call(() => this.customDecoder.close());
    } else {
      assert(this.decoder);
      this.decoder.close();
      this.alphaDecoder?.close();
      this.colorQueue.forEach((x) => x.close());
      this.colorQueue.length = 0;
      this.alphaQueue.forEach((x) => x?.close());
      this.alphaQueue.length = 0;
      this.merger?.close();
    }
    for (const sample of this.sampleQueue) {
      sample.close();
    }
    this.sampleQueue.length = 0;
  }
}
class ColorAlphaMerger {
  constructor() {
    if (typeof OffscreenCanvas !== "undefined") {
      this.canvas = new OffscreenCanvas(300, 150);
    } else {
      this.canvas = document.createElement("canvas");
    }
    const gl = this.canvas.getContext("webgl2", {
      premultipliedAlpha: false
    });
    if (!gl) {
      throw new Error("Couldn't acquire WebGL 2 context.");
    }
    this.gl = gl;
    this.program = this.createProgram();
    this.vao = this.createVAO();
    this.colorTexture = this.createTexture();
    this.alphaTexture = this.createTexture();
    this.gl.useProgram(this.program);
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_colorTexture"), 0);
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_alphaTexture"), 1);
  }
  createProgram() {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, `#version 300 es
			in vec2 a_position;
			in vec2 a_texCoord;
			out vec2 v_texCoord;
			
			void main() {
				gl_Position = vec4(a_position, 0.0, 1.0);
				v_texCoord = a_texCoord;
			}
		`);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, `#version 300 es
			precision highp float;
			
			uniform sampler2D u_colorTexture;
			uniform sampler2D u_alphaTexture;
			in vec2 v_texCoord;
			out vec4 fragColor;
			
			void main() {
				vec3 color = texture(u_colorTexture, v_texCoord).rgb;
				float alpha = texture(u_alphaTexture, v_texCoord).r;
				fragColor = vec4(color, alpha);
			}
		`);
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    return program;
  }
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  }
  createVAO() {
    const vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(vao);
    const vertices = new Float32Array([
      -1,
      -1,
      0,
      1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      0,
      0,
      1,
      1,
      1,
      0
    ]);
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
    const texCoordLocation = this.gl.getAttribLocation(this.program, "a_texCoord");
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(texCoordLocation);
    this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
    return vao;
  }
  createTexture() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    return texture;
  }
  update(color, alpha) {
    if (color.displayWidth !== this.canvas.width || color.displayHeight !== this.canvas.height) {
      this.canvas.width = color.displayWidth;
      this.canvas.height = color.displayHeight;
    }
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.colorTexture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, color);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.alphaTexture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, alpha);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }
  close() {
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.gl = null;
  }
}
class VideoSampleSink extends BaseMediaSampleSink {
  /** Creates a new {@link VideoSampleSink} for the given {@link InputVideoTrack}. */
  constructor(videoTrack) {
    if (!(videoTrack instanceof InputVideoTrack)) {
      throw new TypeError("videoTrack must be an InputVideoTrack.");
    }
    super();
    this._track = videoTrack;
  }
  /** @internal */
  async _createDecoder(onSample, onError) {
    if (!await this._track.canDecode()) {
      throw new Error("This video track cannot be decoded by this browser. Make sure to check decodability before using a track.");
    }
    const codec = this._track.codec;
    const rotation = this._track.rotation;
    const decoderConfig = await this._track.getDecoderConfig();
    const timeResolution = this._track.timeResolution;
    assert(codec && decoderConfig);
    return new VideoDecoderWrapper(onSample, onError, codec, decoderConfig, rotation, timeResolution);
  }
  /** @internal */
  _createPacketSink() {
    return new EncodedPacketSink(this._track);
  }
  /**
   * Retrieves the video sample (frame) corresponding to the given timestamp, in seconds. More specifically, returns
   * the last video sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
   * Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getSample(timestamp) {
    validateTimestamp(timestamp);
    for await (const sample of this.mediaSamplesAtTimestamps([timestamp])) {
      return sample;
    }
    throw new Error("Internal error: Iterator returned nothing.");
  }
  /**
   * Creates an async iterator that yields the video samples (frames) of this track in presentation order. This method
   * will intelligently pre-decode a few frames ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
   */
  samples(startTimestamp = 0, endTimestamp = Infinity) {
    return this.mediaSamplesInRange(startTimestamp, endTimestamp);
  }
  /**
   * Creates an async iterator that yields a video sample (frame) for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no frame is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   */
  samplesAtTimestamps(timestamps) {
    return this.mediaSamplesAtTimestamps(timestamps);
  }
}
class CanvasSink {
  /** Creates a new {@link CanvasSink} for the given {@link InputVideoTrack}. */
  constructor(videoTrack, options = {}) {
    this._nextCanvasIndex = 0;
    if (!(videoTrack instanceof InputVideoTrack)) {
      throw new TypeError("videoTrack must be an InputVideoTrack.");
    }
    if (options && typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (options.alpha !== void 0 && typeof options.alpha !== "boolean") {
      throw new TypeError("options.alpha, when provided, must be a boolean.");
    }
    if (options.width !== void 0 && (!Number.isInteger(options.width) || options.width <= 0)) {
      throw new TypeError("options.width, when defined, must be a positive integer.");
    }
    if (options.height !== void 0 && (!Number.isInteger(options.height) || options.height <= 0)) {
      throw new TypeError("options.height, when defined, must be a positive integer.");
    }
    if (options.fit !== void 0 && !["fill", "contain", "cover"].includes(options.fit)) {
      throw new TypeError('options.fit, when provided, must be one of "fill", "contain", or "cover".');
    }
    if (options.width !== void 0 && options.height !== void 0 && options.fit === void 0) {
      throw new TypeError("When both options.width and options.height are provided, options.fit must also be provided.");
    }
    if (options.rotation !== void 0 && ![0, 90, 180, 270].includes(options.rotation)) {
      throw new TypeError("options.rotation, when provided, must be 0, 90, 180 or 270.");
    }
    if (options.crop !== void 0) {
      validateCropRectangle(options.crop, "options.");
    }
    if (options.poolSize !== void 0 && (typeof options.poolSize !== "number" || !Number.isInteger(options.poolSize) || options.poolSize < 0)) {
      throw new TypeError("poolSize must be a non-negative integer.");
    }
    const rotation = options.rotation ?? videoTrack.rotation;
    const [rotatedWidth, rotatedHeight] = rotation % 180 === 0 ? [videoTrack.codedWidth, videoTrack.codedHeight] : [videoTrack.codedHeight, videoTrack.codedWidth];
    const crop = options.crop;
    if (crop) {
      clampCropRectangle(crop, rotatedWidth, rotatedHeight);
    }
    let [width, height] = crop ? [crop.width, crop.height] : [rotatedWidth, rotatedHeight];
    const originalAspectRatio = width / height;
    if (options.width !== void 0 && options.height === void 0) {
      width = options.width;
      height = Math.round(width / originalAspectRatio);
    } else if (options.width === void 0 && options.height !== void 0) {
      height = options.height;
      width = Math.round(height * originalAspectRatio);
    } else if (options.width !== void 0 && options.height !== void 0) {
      width = options.width;
      height = options.height;
    }
    this._videoTrack = videoTrack;
    this._alpha = options.alpha ?? false;
    this._width = width;
    this._height = height;
    this._rotation = rotation;
    this._crop = crop;
    this._fit = options.fit ?? "fill";
    this._videoSampleSink = new VideoSampleSink(videoTrack);
    this._canvasPool = Array.from({ length: options.poolSize ?? 0 }, () => null);
  }
  /** @internal */
  _videoSampleToWrappedCanvas(sample) {
    let canvas = this._canvasPool[this._nextCanvasIndex];
    let canvasIsNew = false;
    if (!canvas) {
      if (typeof document !== "undefined") {
        canvas = document.createElement("canvas");
        canvas.width = this._width;
        canvas.height = this._height;
      } else {
        canvas = new OffscreenCanvas(this._width, this._height);
      }
      if (this._canvasPool.length > 0) {
        this._canvasPool[this._nextCanvasIndex] = canvas;
      }
      canvasIsNew = true;
    }
    if (this._canvasPool.length > 0) {
      this._nextCanvasIndex = (this._nextCanvasIndex + 1) % this._canvasPool.length;
    }
    const context = canvas.getContext("2d", {
      alpha: this._alpha || isFirefox()
      // Firefox has VideoFrame glitches with opaque canvases
    });
    assert(context);
    context.resetTransform();
    if (!canvasIsNew) {
      if (!this._alpha && isFirefox()) {
        context.fillStyle = "black";
        context.fillRect(0, 0, this._width, this._height);
      } else {
        context.clearRect(0, 0, this._width, this._height);
      }
    }
    sample.drawWithFit(context, {
      fit: this._fit,
      rotation: this._rotation,
      crop: this._crop
    });
    const result = {
      canvas,
      timestamp: sample.timestamp,
      duration: sample.duration
    };
    sample.close();
    return result;
  }
  /**
   * Retrieves a canvas with the video frame corresponding to the given timestamp, in seconds. More specifically,
   * returns the last video frame (in presentation order) with a start timestamp less than or equal to the given
   * timestamp. Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getCanvas(timestamp) {
    validateTimestamp(timestamp);
    const sample = await this._videoSampleSink.getSample(timestamp);
    return sample && this._videoSampleToWrappedCanvas(sample);
  }
  /**
   * Creates an async iterator that yields canvases with the video frames of this track in presentation order. This
   * method will intelligently pre-decode a few frames ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding canvases (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding canvases (exclusive).
   */
  canvases(startTimestamp = 0, endTimestamp = Infinity) {
    return mapAsyncGenerator(this._videoSampleSink.samples(startTimestamp, endTimestamp), (sample) => this._videoSampleToWrappedCanvas(sample));
  }
  /**
   * Creates an async iterator that yields a canvas for each timestamp in the argument. This method uses an optimized
   * decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most once, and is
   * therefore more efficient than manually getting the canvas for every timestamp. The iterator may yield null if
   * no frame is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   */
  canvasesAtTimestamps(timestamps) {
    return mapAsyncGenerator(this._videoSampleSink.samplesAtTimestamps(timestamps), (sample) => sample && this._videoSampleToWrappedCanvas(sample));
  }
}
class AudioDecoderWrapper extends DecoderWrapper {
  constructor(onSample, onError, codec, decoderConfig) {
    super(onSample, onError);
    this.decoder = null;
    this.customDecoder = null;
    this.customDecoderCallSerializer = new CallSerializer();
    this.customDecoderQueueSize = 0;
    this.currentTimestamp = null;
    const sampleHandler = (sample) => {
      if (this.currentTimestamp === null || Math.abs(sample.timestamp - this.currentTimestamp) >= sample.duration) {
        this.currentTimestamp = sample.timestamp;
      }
      const preciseTimestamp = this.currentTimestamp;
      this.currentTimestamp += sample.duration;
      if (sample.numberOfFrames === 0) {
        sample.close();
        return;
      }
      const sampleRate = decoderConfig.sampleRate;
      sample.setTimestamp(Math.round(preciseTimestamp * sampleRate) / sampleRate);
      onSample(sample);
    };
    const MatchingCustomDecoder = customAudioDecoders.find((x) => x.supports(codec, decoderConfig));
    if (MatchingCustomDecoder) {
      this.customDecoder = new MatchingCustomDecoder();
      this.customDecoder.codec = codec;
      this.customDecoder.config = decoderConfig;
      this.customDecoder.onSample = (sample) => {
        if (!(sample instanceof AudioSample)) {
          throw new TypeError("The argument passed to onSample must be an AudioSample.");
        }
        sampleHandler(sample);
      };
      void this.customDecoderCallSerializer.call(() => this.customDecoder.init());
    } else {
      const stack = new Error("Decoding error").stack;
      this.decoder = new AudioDecoder({
        output: (data) => {
          try {
            sampleHandler(new AudioSample(data));
          } catch (error) {
            this.onError(error);
          }
        },
        error: (error) => {
          error.stack = stack;
          this.onError(error);
        }
      });
      this.decoder.configure(decoderConfig);
    }
  }
  getDecodeQueueSize() {
    if (this.customDecoder) {
      return this.customDecoderQueueSize;
    } else {
      assert(this.decoder);
      return this.decoder.decodeQueueSize;
    }
  }
  decode(packet) {
    if (this.customDecoder) {
      this.customDecoderQueueSize++;
      void this.customDecoderCallSerializer.call(() => this.customDecoder.decode(packet)).then(() => this.customDecoderQueueSize--);
    } else {
      assert(this.decoder);
      this.decoder.decode(packet.toEncodedAudioChunk());
    }
  }
  flush() {
    if (this.customDecoder) {
      return this.customDecoderCallSerializer.call(() => this.customDecoder.flush());
    } else {
      assert(this.decoder);
      return this.decoder.flush();
    }
  }
  close() {
    if (this.customDecoder) {
      void this.customDecoderCallSerializer.call(() => this.customDecoder.close());
    } else {
      assert(this.decoder);
      this.decoder.close();
    }
  }
}
class PcmAudioDecoderWrapper extends DecoderWrapper {
  constructor(onSample, onError, decoderConfig) {
    super(onSample, onError);
    this.decoderConfig = decoderConfig;
    this.currentTimestamp = null;
    assert(PCM_AUDIO_CODECS.includes(decoderConfig.codec));
    this.codec = decoderConfig.codec;
    const { dataType, sampleSize, littleEndian } = parsePcmCodec(this.codec);
    this.inputSampleSize = sampleSize;
    switch (sampleSize) {
      case 1:
        {
          if (dataType === "unsigned") {
            this.readInputValue = (view, byteOffset) => view.getUint8(byteOffset) - 2 ** 7;
          } else if (dataType === "signed") {
            this.readInputValue = (view, byteOffset) => view.getInt8(byteOffset);
          } else if (dataType === "ulaw") {
            this.readInputValue = (view, byteOffset) => fromUlaw(view.getUint8(byteOffset));
          } else if (dataType === "alaw") {
            this.readInputValue = (view, byteOffset) => fromAlaw(view.getUint8(byteOffset));
          } else {
            assert(false);
          }
        }
        break;
      case 2:
        {
          if (dataType === "unsigned") {
            this.readInputValue = (view, byteOffset) => view.getUint16(byteOffset, littleEndian) - 2 ** 15;
          } else if (dataType === "signed") {
            this.readInputValue = (view, byteOffset) => view.getInt16(byteOffset, littleEndian);
          } else {
            assert(false);
          }
        }
        break;
      case 3:
        {
          if (dataType === "unsigned") {
            this.readInputValue = (view, byteOffset) => getUint24(view, byteOffset, littleEndian) - 2 ** 23;
          } else if (dataType === "signed") {
            this.readInputValue = (view, byteOffset) => getInt24(view, byteOffset, littleEndian);
          } else {
            assert(false);
          }
        }
        break;
      case 4:
        {
          if (dataType === "unsigned") {
            this.readInputValue = (view, byteOffset) => view.getUint32(byteOffset, littleEndian) - 2 ** 31;
          } else if (dataType === "signed") {
            this.readInputValue = (view, byteOffset) => view.getInt32(byteOffset, littleEndian);
          } else if (dataType === "float") {
            this.readInputValue = (view, byteOffset) => view.getFloat32(byteOffset, littleEndian);
          } else {
            assert(false);
          }
        }
        break;
      case 8:
        {
          if (dataType === "float") {
            this.readInputValue = (view, byteOffset) => view.getFloat64(byteOffset, littleEndian);
          } else {
            assert(false);
          }
        }
        break;
      default: {
        assertNever(sampleSize);
        assert(false);
      }
    }
    switch (sampleSize) {
      case 1:
        {
          if (dataType === "ulaw" || dataType === "alaw") {
            this.outputSampleSize = 2;
            this.outputFormat = "s16";
            this.writeOutputValue = (view, byteOffset, value) => view.setInt16(byteOffset, value, true);
          } else {
            this.outputSampleSize = 1;
            this.outputFormat = "u8";
            this.writeOutputValue = (view, byteOffset, value) => view.setUint8(byteOffset, value + 2 ** 7);
          }
        }
        break;
      case 2:
        {
          this.outputSampleSize = 2;
          this.outputFormat = "s16";
          this.writeOutputValue = (view, byteOffset, value) => view.setInt16(byteOffset, value, true);
        }
        break;
      case 3:
        {
          this.outputSampleSize = 4;
          this.outputFormat = "s32";
          this.writeOutputValue = (view, byteOffset, value) => view.setInt32(byteOffset, value << 8, true);
        }
        break;
      case 4:
        {
          this.outputSampleSize = 4;
          if (dataType === "float") {
            this.outputFormat = "f32";
            this.writeOutputValue = (view, byteOffset, value) => view.setFloat32(byteOffset, value, true);
          } else {
            this.outputFormat = "s32";
            this.writeOutputValue = (view, byteOffset, value) => view.setInt32(byteOffset, value, true);
          }
        }
        break;
      case 8:
        {
          this.outputSampleSize = 4;
          this.outputFormat = "f32";
          this.writeOutputValue = (view, byteOffset, value) => view.setFloat32(byteOffset, value, true);
        }
        break;
      default: {
        assertNever(sampleSize);
        assert(false);
      }
    }
  }
  getDecodeQueueSize() {
    return 0;
  }
  decode(packet) {
    const inputView = toDataView(packet.data);
    const numberOfFrames = packet.byteLength / this.decoderConfig.numberOfChannels / this.inputSampleSize;
    const outputBufferSize = numberOfFrames * this.decoderConfig.numberOfChannels * this.outputSampleSize;
    const outputBuffer = new ArrayBuffer(outputBufferSize);
    const outputView = new DataView(outputBuffer);
    for (let i = 0; i < numberOfFrames * this.decoderConfig.numberOfChannels; i++) {
      const inputIndex = i * this.inputSampleSize;
      const outputIndex = i * this.outputSampleSize;
      const value = this.readInputValue(inputView, inputIndex);
      this.writeOutputValue(outputView, outputIndex, value);
    }
    const preciseDuration = numberOfFrames / this.decoderConfig.sampleRate;
    if (this.currentTimestamp === null || Math.abs(packet.timestamp - this.currentTimestamp) >= preciseDuration) {
      this.currentTimestamp = packet.timestamp;
    }
    const preciseTimestamp = this.currentTimestamp;
    this.currentTimestamp += preciseDuration;
    const audioSample = new AudioSample({
      format: this.outputFormat,
      data: outputBuffer,
      numberOfChannels: this.decoderConfig.numberOfChannels,
      sampleRate: this.decoderConfig.sampleRate,
      numberOfFrames,
      timestamp: preciseTimestamp
    });
    this.onSample(audioSample);
  }
  async flush() {
  }
  close() {
  }
}
class AudioSampleSink extends BaseMediaSampleSink {
  /** Creates a new {@link AudioSampleSink} for the given {@link InputAudioTrack}. */
  constructor(audioTrack) {
    if (!(audioTrack instanceof InputAudioTrack)) {
      throw new TypeError("audioTrack must be an InputAudioTrack.");
    }
    super();
    this._track = audioTrack;
  }
  /** @internal */
  async _createDecoder(onSample, onError) {
    if (!await this._track.canDecode()) {
      throw new Error("This audio track cannot be decoded by this browser. Make sure to check decodability before using a track.");
    }
    const codec = this._track.codec;
    const decoderConfig = await this._track.getDecoderConfig();
    assert(codec && decoderConfig);
    if (PCM_AUDIO_CODECS.includes(decoderConfig.codec)) {
      return new PcmAudioDecoderWrapper(onSample, onError, decoderConfig);
    } else {
      return new AudioDecoderWrapper(onSample, onError, codec, decoderConfig);
    }
  }
  /** @internal */
  _createPacketSink() {
    return new EncodedPacketSink(this._track);
  }
  /**
   * Retrieves the audio sample corresponding to the given timestamp, in seconds. More specifically, returns
   * the last audio sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
   * Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getSample(timestamp) {
    validateTimestamp(timestamp);
    for await (const sample of this.mediaSamplesAtTimestamps([timestamp])) {
      return sample;
    }
    throw new Error("Internal error: Iterator returned nothing.");
  }
  /**
   * Creates an async iterator that yields the audio samples of this track in presentation order. This method
   * will intelligently pre-decode a few samples ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
   */
  samples(startTimestamp = 0, endTimestamp = Infinity) {
    return this.mediaSamplesInRange(startTimestamp, endTimestamp);
  }
  /**
   * Creates an async iterator that yields an audio sample for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
   * yield null if no sample is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   */
  samplesAtTimestamps(timestamps) {
    return this.mediaSamplesAtTimestamps(timestamps);
  }
}
class AudioBufferSink {
  /** Creates a new {@link AudioBufferSink} for the given {@link InputAudioTrack}. */
  constructor(audioTrack) {
    if (!(audioTrack instanceof InputAudioTrack)) {
      throw new TypeError("audioTrack must be an InputAudioTrack.");
    }
    this._audioSampleSink = new AudioSampleSink(audioTrack);
  }
  /** @internal */
  _audioSampleToWrappedArrayBuffer(sample) {
    const result = {
      buffer: sample.toAudioBuffer(),
      timestamp: sample.timestamp,
      duration: sample.duration
    };
    sample.close();
    return result;
  }
  /**
   * Retrieves the audio buffer corresponding to the given timestamp, in seconds. More specifically, returns
   * the last audio buffer (in presentation order) with a start timestamp less than or equal to the given timestamp.
   * Returns null if the timestamp is before the track's first timestamp.
   *
   * @param timestamp - The timestamp used for retrieval, in seconds.
   */
  async getBuffer(timestamp) {
    validateTimestamp(timestamp);
    const data = await this._audioSampleSink.getSample(timestamp);
    return data && this._audioSampleToWrappedArrayBuffer(data);
  }
  /**
   * Creates an async iterator that yields audio buffers of this track in presentation order. This method
   * will intelligently pre-decode a few buffers ahead to enable fast iteration.
   *
   * @param startTimestamp - The timestamp in seconds at which to start yielding buffers (inclusive).
   * @param endTimestamp - The timestamp in seconds at which to stop yielding buffers (exclusive).
   */
  buffers(startTimestamp = 0, endTimestamp = Infinity) {
    return mapAsyncGenerator(this._audioSampleSink.samples(startTimestamp, endTimestamp), (data) => this._audioSampleToWrappedArrayBuffer(data));
  }
  /**
   * Creates an async iterator that yields an audio buffer for each timestamp in the argument. This method
   * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
   * once, and is therefore more efficient than manually getting the buffer for every timestamp. The iterator may
   * yield null if no buffer is available for a given timestamp.
   *
   * @param timestamps - An iterable or async iterable of timestamps in seconds.
   */
  buffersAtTimestamps(timestamps) {
    return mapAsyncGenerator(this._audioSampleSink.samplesAtTimestamps(timestamps), (data) => data && this._audioSampleToWrappedArrayBuffer(data));
  }
}
class InputTrack {
  /** @internal */
  constructor(input, backing) {
    this.input = input;
    this._backing = backing;
  }
  /** Returns true if and only if this track is a video track. */
  isVideoTrack() {
    return this instanceof InputVideoTrack;
  }
  /** Returns true if and only if this track is an audio track. */
  isAudioTrack() {
    return this instanceof InputAudioTrack;
  }
  /** The unique ID of this track in the input file. */
  get id() {
    return this._backing.getId();
  }
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
  get internalCodecId() {
    return this._backing.getInternalCodecId();
  }
  /**
   * The ISO 639-2/T language code for this track. If the language is unknown, this field is `'und'` (undetermined).
   */
  get languageCode() {
    return this._backing.getLanguageCode();
  }
  /** A user-defined name for this track. */
  get name() {
    return this._backing.getName();
  }
  /**
   * A positive number x such that all timestamps and durations of all packets of this track are
   * integer multiples of 1/x.
   */
  get timeResolution() {
    return this._backing.getTimeResolution();
  }
  /** The track's disposition, i.e. information about its intended usage. */
  get disposition() {
    return this._backing.getDisposition();
  }
  /**
   * Returns the start timestamp of the first packet of this track, in seconds. While often near zero, this value
   * may be positive or even negative. A negative starting timestamp means the track's timing has been offset. Samples
   * with a negative timestamp should not be presented.
   */
  getFirstTimestamp() {
    return this._backing.getFirstTimestamp();
  }
  /** Returns the end timestamp of the last packet of this track, in seconds. */
  computeDuration() {
    return this._backing.computeDuration();
  }
  /**
   * Computes aggregate packet statistics for this track, such as average packet rate or bitrate.
   *
   * @param targetPacketCount - This optional parameter sets a target for how many packets this method must have
   * looked at before it can return early; this means, you can use it to aggregate only a subset (prefix) of all
   * packets. This is very useful for getting a great estimate of video frame rate without having to scan through the
   * entire file.
   */
  async computePacketStats(targetPacketCount = Infinity) {
    const sink = new EncodedPacketSink(this);
    let startTimestamp = Infinity;
    let endTimestamp = -Infinity;
    let packetCount = 0;
    let totalPacketBytes = 0;
    for await (const packet of sink.packets(void 0, void 0, { metadataOnly: true })) {
      if (packetCount >= targetPacketCount && packet.timestamp >= endTimestamp) {
        break;
      }
      startTimestamp = Math.min(startTimestamp, packet.timestamp);
      endTimestamp = Math.max(endTimestamp, packet.timestamp + packet.duration);
      packetCount++;
      totalPacketBytes += packet.byteLength;
    }
    return {
      packetCount,
      averagePacketRate: packetCount ? Number((packetCount / (endTimestamp - startTimestamp)).toPrecision(16)) : 0,
      averageBitrate: packetCount ? Number((8 * totalPacketBytes / (endTimestamp - startTimestamp)).toPrecision(16)) : 0
    };
  }
}
class InputVideoTrack extends InputTrack {
  /** @internal */
  constructor(input, backing) {
    super(input, backing);
    this._backing = backing;
  }
  get type() {
    return "video";
  }
  get codec() {
    return this._backing.getCodec();
  }
  /** The width in pixels of the track's coded samples, before any transformations or rotations. */
  get codedWidth() {
    return this._backing.getCodedWidth();
  }
  /** The height in pixels of the track's coded samples, before any transformations or rotations. */
  get codedHeight() {
    return this._backing.getCodedHeight();
  }
  /** The angle in degrees by which the track's frames should be rotated (clockwise). */
  get rotation() {
    return this._backing.getRotation();
  }
  /** The width in pixels of the track's frames after rotation. */
  get displayWidth() {
    const rotation = this._backing.getRotation();
    return rotation % 180 === 0 ? this._backing.getCodedWidth() : this._backing.getCodedHeight();
  }
  /** The height in pixels of the track's frames after rotation. */
  get displayHeight() {
    const rotation = this._backing.getRotation();
    return rotation % 180 === 0 ? this._backing.getCodedHeight() : this._backing.getCodedWidth();
  }
  /** Returns the color space of the track's samples. */
  getColorSpace() {
    return this._backing.getColorSpace();
  }
  /** If this method returns true, the track's samples use a high dynamic range (HDR). */
  async hasHighDynamicRange() {
    const colorSpace = await this._backing.getColorSpace();
    return colorSpace.primaries === "bt2020" || colorSpace.primaries === "smpte432" || colorSpace.transfer === "pg" || colorSpace.transfer === "hlg" || colorSpace.matrix === "bt2020-ncl";
  }
  /** Checks if this track may contain transparent samples with alpha data. */
  canBeTransparent() {
    return this._backing.canBeTransparent();
  }
  /**
   * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#video-decoder-config) for decoding the
   * track's packets using a [`VideoDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder). Returns
   * null if the track's codec is unknown.
   */
  getDecoderConfig() {
    return this._backing.getDecoderConfig();
  }
  async getCodecParameterString() {
    const decoderConfig = await this._backing.getDecoderConfig();
    return decoderConfig?.codec ?? null;
  }
  async canDecode() {
    try {
      const decoderConfig = await this._backing.getDecoderConfig();
      if (!decoderConfig) {
        return false;
      }
      const codec = this._backing.getCodec();
      assert(codec !== null);
      if (customVideoDecoders.some((x) => x.supports(codec, decoderConfig))) {
        return true;
      }
      if (typeof VideoDecoder === "undefined") {
        return false;
      }
      const support = await VideoDecoder.isConfigSupported(decoderConfig);
      return support.supported === true;
    } catch (error) {
      console.error("Error during decodability check:", error);
      return false;
    }
  }
  async determinePacketType(packet) {
    if (!(packet instanceof EncodedPacket)) {
      throw new TypeError("packet must be an EncodedPacket.");
    }
    if (packet.isMetadataOnly) {
      throw new TypeError("packet must not be metadata-only to determine its type.");
    }
    if (this.codec === null) {
      return null;
    }
    const decoderConfig = await this.getDecoderConfig();
    assert(decoderConfig);
    return determineVideoPacketType(this.codec, decoderConfig, packet.data);
  }
}
class InputAudioTrack extends InputTrack {
  /** @internal */
  constructor(input, backing) {
    super(input, backing);
    this._backing = backing;
  }
  get type() {
    return "audio";
  }
  get codec() {
    return this._backing.getCodec();
  }
  /** The number of audio channels in the track. */
  get numberOfChannels() {
    return this._backing.getNumberOfChannels();
  }
  /** The track's audio sample rate in hertz. */
  get sampleRate() {
    return this._backing.getSampleRate();
  }
  /**
   * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#audio-decoder-config) for decoding the
   * track's packets using an [`AudioDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/AudioDecoder). Returns
   * null if the track's codec is unknown.
   */
  getDecoderConfig() {
    return this._backing.getDecoderConfig();
  }
  async getCodecParameterString() {
    const decoderConfig = await this._backing.getDecoderConfig();
    return decoderConfig?.codec ?? null;
  }
  async canDecode() {
    try {
      const decoderConfig = await this._backing.getDecoderConfig();
      if (!decoderConfig) {
        return false;
      }
      const codec = this._backing.getCodec();
      assert(codec !== null);
      if (customAudioDecoders.some((x) => x.supports(codec, decoderConfig))) {
        return true;
      }
      if (decoderConfig.codec.startsWith("pcm-")) {
        return true;
      } else {
        if (typeof AudioDecoder === "undefined") {
          return false;
        }
        const support = await AudioDecoder.isConfigSupported(decoderConfig);
        return support.supported === true;
      }
    } catch (error) {
      console.error("Error during decodability check:", error);
      return false;
    }
  }
  async determinePacketType(packet) {
    if (!(packet instanceof EncodedPacket)) {
      throw new TypeError("packet must be an EncodedPacket.");
    }
    if (this.codec === null) {
      return null;
    }
    return "key";
  }
}
const buildIsobmffMimeType = (info) => {
  const base = info.hasVideo ? "video/" : info.hasAudio ? "audio/" : "application/";
  let string = base + (info.isQuickTime ? "quicktime" : "mp4");
  if (info.codecStrings.length > 0) {
    const uniqueCodecMimeTypes = [...new Set(info.codecStrings)];
    string += `; codecs="${uniqueCodecMimeTypes.join(", ")}"`;
  }
  return string;
};
const MIN_BOX_HEADER_SIZE = 8;
const MAX_BOX_HEADER_SIZE = 16;
const readBoxHeader = (slice) => {
  let totalSize = readU32Be(slice);
  const name = readAscii(slice, 4);
  let headerSize = 8;
  const hasLargeSize = totalSize === 1;
  if (hasLargeSize) {
    totalSize = readU64Be(slice);
    headerSize = 16;
  }
  const contentSize = totalSize - headerSize;
  if (contentSize < 0) {
    return null;
  }
  return { name, totalSize, headerSize, contentSize };
};
const readFixed_16_16 = (slice) => {
  return readI32Be(slice) / 65536;
};
const readFixed_2_30 = (slice) => {
  return readI32Be(slice) / 1073741824;
};
const readIsomVariableInteger = (slice) => {
  let result = 0;
  for (let i = 0; i < 4; i++) {
    result <<= 7;
    const nextByte = readU8(slice);
    result |= nextByte & 127;
    if ((nextByte & 128) === 0) {
      break;
    }
  }
  return result;
};
const readMetadataStringShort = (slice) => {
  let stringLength = readU16Be(slice);
  slice.skip(2);
  stringLength = Math.min(stringLength, slice.remainingLength);
  return textDecoder.decode(readBytes(slice, stringLength));
};
const readDataBox = (slice) => {
  const header = readBoxHeader(slice);
  if (!header || header.name !== "data") {
    return null;
  }
  if (slice.remainingLength < 8) {
    return null;
  }
  const typeIndicator = readU32Be(slice);
  slice.skip(4);
  const data = readBytes(slice, header.contentSize - 8);
  switch (typeIndicator) {
    case 1:
      return textDecoder.decode(data);
    // UTF-8
    case 2:
      return new TextDecoder("utf-16be").decode(data);
    // UTF-16-BE
    case 13:
      return new RichImageData(data, "image/jpeg");
    case 14:
      return new RichImageData(data, "image/png");
    case 27:
      return new RichImageData(data, "image/bmp");
    default:
      return data;
  }
};
class IsobmffDemuxer extends Demuxer {
  constructor(input) {
    super(input);
    this.moovSlice = null;
    this.currentTrack = null;
    this.tracks = [];
    this.metadataPromise = null;
    this.movieTimescale = -1;
    this.movieDurationInTimescale = -1;
    this.isQuickTime = false;
    this.metadataTags = {};
    this.currentMetadataKeys = null;
    this.isFragmented = false;
    this.fragmentTrackDefaults = [];
    this.currentFragment = null;
    this.lastReadFragment = null;
    this.reader = input._reader;
  }
  async computeDuration() {
    const tracks = await this.getTracks();
    const trackDurations = await Promise.all(tracks.map((x) => x.computeDuration()));
    return Math.max(0, ...trackDurations);
  }
  async getTracks() {
    await this.readMetadata();
    return this.tracks.map((track) => track.inputTrack);
  }
  async getMimeType() {
    await this.readMetadata();
    const codecStrings = await Promise.all(this.tracks.map((x) => x.inputTrack.getCodecParameterString()));
    return buildIsobmffMimeType({
      isQuickTime: this.isQuickTime,
      hasVideo: this.tracks.some((x) => x.info?.type === "video"),
      hasAudio: this.tracks.some((x) => x.info?.type === "audio"),
      codecStrings: codecStrings.filter(Boolean)
    });
  }
  async getMetadataTags() {
    await this.readMetadata();
    return this.metadataTags;
  }
  readMetadata() {
    return this.metadataPromise ?? (this.metadataPromise = (async () => {
      let currentPos = 0;
      while (true) {
        let slice = this.reader.requestSliceRange(currentPos, MIN_BOX_HEADER_SIZE, MAX_BOX_HEADER_SIZE);
        if (slice instanceof Promise)
          slice = await slice;
        if (!slice)
          break;
        const startPos = currentPos;
        const boxInfo = readBoxHeader(slice);
        if (!boxInfo) {
          break;
        }
        if (boxInfo.name === "ftyp") {
          const majorBrand = readAscii(slice, 4);
          this.isQuickTime = majorBrand === "qt  ";
        } else if (boxInfo.name === "moov") {
          let moovSlice = this.reader.requestSlice(slice.filePos, boxInfo.contentSize);
          if (moovSlice instanceof Promise)
            moovSlice = await moovSlice;
          if (!moovSlice)
            break;
          this.moovSlice = moovSlice;
          this.readContiguousBoxes(this.moovSlice);
          this.tracks.sort((a, b) => Number(b.disposition.default) - Number(a.disposition.default));
          for (const track of this.tracks) {
            const previousSegmentDurationsInSeconds = track.editListPreviousSegmentDurations / this.movieTimescale;
            track.editListOffset -= Math.round(previousSegmentDurationsInSeconds * track.timescale);
          }
          break;
        }
        currentPos = startPos + boxInfo.totalSize;
      }
      if (this.isFragmented && this.reader.fileSize !== null) {
        let lastWordSlice = this.reader.requestSlice(this.reader.fileSize - 4, 4);
        if (lastWordSlice instanceof Promise)
          lastWordSlice = await lastWordSlice;
        assert(lastWordSlice);
        const lastWord = readU32Be(lastWordSlice);
        const potentialMfraPos = this.reader.fileSize - lastWord;
        if (potentialMfraPos >= 0 && potentialMfraPos <= this.reader.fileSize - MAX_BOX_HEADER_SIZE) {
          let mfraHeaderSlice = this.reader.requestSliceRange(potentialMfraPos, MIN_BOX_HEADER_SIZE, MAX_BOX_HEADER_SIZE);
          if (mfraHeaderSlice instanceof Promise)
            mfraHeaderSlice = await mfraHeaderSlice;
          if (mfraHeaderSlice) {
            const boxInfo = readBoxHeader(mfraHeaderSlice);
            if (boxInfo && boxInfo.name === "mfra") {
              let mfraSlice = this.reader.requestSlice(mfraHeaderSlice.filePos, boxInfo.contentSize);
              if (mfraSlice instanceof Promise)
                mfraSlice = await mfraSlice;
              if (mfraSlice) {
                this.readContiguousBoxes(mfraSlice);
              }
            }
          }
        }
      }
    })());
  }
  getSampleTableForTrack(internalTrack) {
    if (internalTrack.sampleTable) {
      return internalTrack.sampleTable;
    }
    const sampleTable = {
      sampleTimingEntries: [],
      sampleCompositionTimeOffsets: [],
      sampleSizes: [],
      keySampleIndices: null,
      chunkOffsets: [],
      sampleToChunk: [],
      presentationTimestamps: null,
      presentationTimestampIndexMap: null
    };
    internalTrack.sampleTable = sampleTable;
    assert(this.moovSlice);
    const stblContainerSlice = this.moovSlice.slice(internalTrack.sampleTableByteOffset);
    this.currentTrack = internalTrack;
    this.traverseBox(stblContainerSlice);
    this.currentTrack = null;
    const isPcmCodec = internalTrack.info?.type === "audio" && internalTrack.info.codec && PCM_AUDIO_CODECS.includes(internalTrack.info.codec);
    if (isPcmCodec && sampleTable.sampleCompositionTimeOffsets.length === 0) {
      assert(internalTrack.info?.type === "audio");
      const pcmInfo = parsePcmCodec(internalTrack.info.codec);
      const newSampleTimingEntries = [];
      const newSampleSizes = [];
      for (let i = 0; i < sampleTable.sampleToChunk.length; i++) {
        const chunkEntry = sampleTable.sampleToChunk[i];
        const nextEntry = sampleTable.sampleToChunk[i + 1];
        const chunkCount = (nextEntry ? nextEntry.startChunkIndex : sampleTable.chunkOffsets.length) - chunkEntry.startChunkIndex;
        for (let j = 0; j < chunkCount; j++) {
          const startSampleIndex = chunkEntry.startSampleIndex + j * chunkEntry.samplesPerChunk;
          const endSampleIndex = startSampleIndex + chunkEntry.samplesPerChunk;
          const startTimingEntryIndex = binarySearchLessOrEqual(sampleTable.sampleTimingEntries, startSampleIndex, (x) => x.startIndex);
          const startTimingEntry = sampleTable.sampleTimingEntries[startTimingEntryIndex];
          const endTimingEntryIndex = binarySearchLessOrEqual(sampleTable.sampleTimingEntries, endSampleIndex, (x) => x.startIndex);
          const endTimingEntry = sampleTable.sampleTimingEntries[endTimingEntryIndex];
          const firstSampleTimestamp = startTimingEntry.startDecodeTimestamp + (startSampleIndex - startTimingEntry.startIndex) * startTimingEntry.delta;
          const lastSampleTimestamp = endTimingEntry.startDecodeTimestamp + (endSampleIndex - endTimingEntry.startIndex) * endTimingEntry.delta;
          const delta = lastSampleTimestamp - firstSampleTimestamp;
          const lastSampleTimingEntry = last(newSampleTimingEntries);
          if (lastSampleTimingEntry && lastSampleTimingEntry.delta === delta) {
            lastSampleTimingEntry.count++;
          } else {
            newSampleTimingEntries.push({
              startIndex: chunkEntry.startChunkIndex + j,
              startDecodeTimestamp: firstSampleTimestamp,
              count: 1,
              delta
            });
          }
          const chunkSize = chunkEntry.samplesPerChunk * pcmInfo.sampleSize * internalTrack.info.numberOfChannels;
          newSampleSizes.push(chunkSize);
        }
        chunkEntry.startSampleIndex = chunkEntry.startChunkIndex;
        chunkEntry.samplesPerChunk = 1;
      }
      sampleTable.sampleTimingEntries = newSampleTimingEntries;
      sampleTable.sampleSizes = newSampleSizes;
    }
    if (sampleTable.sampleCompositionTimeOffsets.length > 0) {
      sampleTable.presentationTimestamps = [];
      for (const entry of sampleTable.sampleTimingEntries) {
        for (let i = 0; i < entry.count; i++) {
          sampleTable.presentationTimestamps.push({
            presentationTimestamp: entry.startDecodeTimestamp + i * entry.delta,
            sampleIndex: entry.startIndex + i
          });
        }
      }
      for (const entry of sampleTable.sampleCompositionTimeOffsets) {
        for (let i = 0; i < entry.count; i++) {
          const sampleIndex = entry.startIndex + i;
          const sample = sampleTable.presentationTimestamps[sampleIndex];
          if (!sample) {
            continue;
          }
          sample.presentationTimestamp += entry.offset;
        }
      }
      sampleTable.presentationTimestamps.sort((a, b) => a.presentationTimestamp - b.presentationTimestamp);
      sampleTable.presentationTimestampIndexMap = Array(sampleTable.presentationTimestamps.length).fill(-1);
      for (let i = 0; i < sampleTable.presentationTimestamps.length; i++) {
        sampleTable.presentationTimestampIndexMap[sampleTable.presentationTimestamps[i].sampleIndex] = i;
      }
    }
    return sampleTable;
  }
  async readFragment(startPos) {
    if (this.lastReadFragment?.moofOffset === startPos) {
      return this.lastReadFragment;
    }
    let headerSlice = this.reader.requestSliceRange(startPos, MIN_BOX_HEADER_SIZE, MAX_BOX_HEADER_SIZE);
    if (headerSlice instanceof Promise)
      headerSlice = await headerSlice;
    assert(headerSlice);
    const moofBoxInfo = readBoxHeader(headerSlice);
    assert(moofBoxInfo?.name === "moof");
    let entireSlice = this.reader.requestSlice(startPos, moofBoxInfo.totalSize);
    if (entireSlice instanceof Promise)
      entireSlice = await entireSlice;
    assert(entireSlice);
    this.traverseBox(entireSlice);
    const fragment = this.lastReadFragment;
    assert(fragment && fragment.moofOffset === startPos);
    for (const [, trackData] of fragment.trackData) {
      const track = trackData.track;
      const { fragmentPositionCache } = track;
      if (!trackData.startTimestampIsFinal) {
        const lookupEntry = track.fragmentLookupTable.find((x) => x.moofOffset === fragment.moofOffset);
        if (lookupEntry) {
          offsetFragmentTrackDataByTimestamp(trackData, lookupEntry.timestamp);
        } else {
          const lastCacheIndex = binarySearchLessOrEqual(fragmentPositionCache, fragment.moofOffset - 1, (x) => x.moofOffset);
          if (lastCacheIndex !== -1) {
            const lastCache = fragmentPositionCache[lastCacheIndex];
            offsetFragmentTrackDataByTimestamp(trackData, lastCache.endTimestamp);
          }
        }
        trackData.startTimestampIsFinal = true;
      }
      const insertionIndex = binarySearchLessOrEqual(fragmentPositionCache, trackData.startTimestamp, (x) => x.startTimestamp);
      if (insertionIndex === -1 || fragmentPositionCache[insertionIndex].moofOffset !== fragment.moofOffset) {
        fragmentPositionCache.splice(insertionIndex + 1, 0, {
          moofOffset: fragment.moofOffset,
          startTimestamp: trackData.startTimestamp,
          endTimestamp: trackData.endTimestamp
        });
      }
    }
    return fragment;
  }
  readContiguousBoxes(slice) {
    const startIndex = slice.filePos;
    while (slice.filePos - startIndex <= slice.length - MIN_BOX_HEADER_SIZE) {
      const foundBox = this.traverseBox(slice);
      if (!foundBox) {
        break;
      }
    }
  }
  // eslint-disable-next-line @stylistic/generator-star-spacing
  *iterateContiguousBoxes(slice) {
    const startIndex = slice.filePos;
    while (slice.filePos - startIndex <= slice.length - MIN_BOX_HEADER_SIZE) {
      const startPos = slice.filePos;
      const boxInfo = readBoxHeader(slice);
      if (!boxInfo) {
        break;
      }
      yield { boxInfo, slice };
      slice.filePos = startPos + boxInfo.totalSize;
    }
  }
  traverseBox(slice) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
    const startPos = slice.filePos;
    const boxInfo = readBoxHeader(slice);
    if (!boxInfo) {
      return false;
    }
    const contentStartPos = slice.filePos;
    const boxEndPos = startPos + boxInfo.totalSize;
    switch (boxInfo.name) {
      case "mdia":
      case "minf":
      case "dinf":
      case "mfra":
      case "edts":
        {
          this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
        }
        break;
      case "mvhd":
        {
          const version = readU8(slice);
          slice.skip(3);
          if (version === 1) {
            slice.skip(8 + 8);
            this.movieTimescale = readU32Be(slice);
            this.movieDurationInTimescale = readU64Be(slice);
          } else {
            slice.skip(4 + 4);
            this.movieTimescale = readU32Be(slice);
            this.movieDurationInTimescale = readU32Be(slice);
          }
        }
        break;
      case "trak":
        {
          const track = {
            id: -1,
            demuxer: this,
            inputTrack: null,
            disposition: {
              ...DEFAULT_TRACK_DISPOSITION
            },
            info: null,
            timescale: -1,
            durationInMovieTimescale: -1,
            durationInMediaTimescale: -1,
            rotation: 0,
            internalCodecId: null,
            name: null,
            languageCode: UNDETERMINED_LANGUAGE,
            sampleTableByteOffset: -1,
            sampleTable: null,
            fragmentLookupTable: [],
            currentFragmentState: null,
            fragmentPositionCache: [],
            editListPreviousSegmentDurations: 0,
            editListOffset: 0
          };
          this.currentTrack = track;
          this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
          if (track.id !== -1 && track.timescale !== -1 && track.info !== null) {
            if (track.info.type === "video" && track.info.width !== -1) {
              const videoTrack = track;
              track.inputTrack = new InputVideoTrack(this.input, new IsobmffVideoTrackBacking(videoTrack));
              this.tracks.push(track);
            } else if (track.info.type === "audio" && track.info.numberOfChannels !== -1) {
              const audioTrack = track;
              track.inputTrack = new InputAudioTrack(this.input, new IsobmffAudioTrackBacking(audioTrack));
              this.tracks.push(track);
            }
          }
          this.currentTrack = null;
        }
        break;
      case "tkhd":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          const version = readU8(slice);
          const flags = readU24Be(slice);
          const trackEnabled = !!(flags & 1);
          track.disposition.default = trackEnabled;
          if (version === 0) {
            slice.skip(8);
            track.id = readU32Be(slice);
            slice.skip(4);
            track.durationInMovieTimescale = readU32Be(slice);
          } else if (version === 1) {
            slice.skip(16);
            track.id = readU32Be(slice);
            slice.skip(4);
            track.durationInMovieTimescale = readU64Be(slice);
          } else {
            throw new Error(`Incorrect track header version ${version}.`);
          }
          slice.skip(2 * 4 + 2 + 2 + 2 + 2);
          const matrix = [
            readFixed_16_16(slice),
            readFixed_16_16(slice),
            readFixed_2_30(slice),
            readFixed_16_16(slice),
            readFixed_16_16(slice),
            readFixed_2_30(slice),
            readFixed_16_16(slice),
            readFixed_16_16(slice),
            readFixed_2_30(slice)
          ];
          const rotation = normalizeRotation(roundToMultiple(extractRotationFromMatrix(matrix), 90));
          assert(rotation === 0 || rotation === 90 || rotation === 180 || rotation === 270);
          track.rotation = rotation;
        }
        break;
      case "elst":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          const version = readU8(slice);
          slice.skip(3);
          let relevantEntryFound = false;
          let previousSegmentDurations = 0;
          const entryCount = readU32Be(slice);
          for (let i = 0; i < entryCount; i++) {
            const segmentDuration = version === 1 ? readU64Be(slice) : readU32Be(slice);
            const mediaTime = version === 1 ? readI64Be(slice) : readI32Be(slice);
            const mediaRate = readFixed_16_16(slice);
            if (segmentDuration === 0) {
              continue;
            }
            if (relevantEntryFound) {
              console.warn("Unsupported edit list: multiple edits are not currently supported. Only using first edit.");
              break;
            }
            if (mediaTime === -1) {
              previousSegmentDurations += segmentDuration;
              continue;
            }
            if (mediaRate !== 1) {
              console.warn("Unsupported edit list entry: media rate must be 1.");
              break;
            }
            track.editListPreviousSegmentDurations = previousSegmentDurations;
            track.editListOffset = mediaTime;
            relevantEntryFound = true;
          }
        }
        break;
      case "mdhd":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          const version = readU8(slice);
          slice.skip(3);
          if (version === 0) {
            slice.skip(8);
            track.timescale = readU32Be(slice);
            track.durationInMediaTimescale = readU32Be(slice);
          } else if (version === 1) {
            slice.skip(16);
            track.timescale = readU32Be(slice);
            track.durationInMediaTimescale = readU64Be(slice);
          }
          let language = readU16Be(slice);
          if (language > 0) {
            track.languageCode = "";
            for (let i = 0; i < 3; i++) {
              track.languageCode = String.fromCharCode(96 + (language & 31)) + track.languageCode;
              language >>= 5;
            }
            if (!isIso639Dash2LanguageCode(track.languageCode)) {
              track.languageCode = UNDETERMINED_LANGUAGE;
            }
          }
        }
        break;
      case "hdlr":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          slice.skip(8);
          const handlerType = readAscii(slice, 4);
          if (handlerType === "vide") {
            track.info = {
              type: "video",
              width: -1,
              height: -1,
              codec: null,
              codecDescription: null,
              colorSpace: null,
              avcType: null,
              avcCodecInfo: null,
              hevcCodecInfo: null,
              vp9CodecInfo: null,
              av1CodecInfo: null
            };
          } else if (handlerType === "soun") {
            track.info = {
              type: "audio",
              numberOfChannels: -1,
              sampleRate: -1,
              codec: null,
              codecDescription: null,
              aacCodecInfo: null
            };
          }
        }
        break;
      case "stbl":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          track.sampleTableByteOffset = startPos;
          this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
        }
        break;
      case "stsd":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (track.info === null || track.sampleTable) {
            break;
          }
          const stsdVersion = readU8(slice);
          slice.skip(3);
          const entries = readU32Be(slice);
          for (let i = 0; i < entries; i++) {
            const sampleBoxStartPos = slice.filePos;
            const sampleBoxInfo = readBoxHeader(slice);
            if (!sampleBoxInfo) {
              break;
            }
            track.internalCodecId = sampleBoxInfo.name;
            const lowercaseBoxName = sampleBoxInfo.name.toLowerCase();
            if (track.info.type === "video") {
              if (lowercaseBoxName === "avc1" || lowercaseBoxName === "avc3") {
                track.info.codec = "avc";
                track.info.avcType = lowercaseBoxName === "avc1" ? 1 : 3;
              } else if (lowercaseBoxName === "hvc1" || lowercaseBoxName === "hev1") {
                track.info.codec = "hevc";
              } else if (lowercaseBoxName === "vp08") {
                track.info.codec = "vp8";
              } else if (lowercaseBoxName === "vp09") {
                track.info.codec = "vp9";
              } else if (lowercaseBoxName === "av01") {
                track.info.codec = "av1";
              } else {
                console.warn(`Unsupported video codec (sample entry type '${sampleBoxInfo.name}').`);
              }
              slice.skip(6 * 1 + 2 + 2 + 2 + 3 * 4);
              track.info.width = readU16Be(slice);
              track.info.height = readU16Be(slice);
              slice.skip(4 + 4 + 4 + 2 + 32 + 2 + 2);
              this.readContiguousBoxes(slice.slice(slice.filePos, sampleBoxStartPos + sampleBoxInfo.totalSize - slice.filePos));
            } else {
              if (lowercaseBoxName === "mp4a") ;
              else if (lowercaseBoxName === "opus") {
                track.info.codec = "opus";
              } else if (lowercaseBoxName === "flac") {
                track.info.codec = "flac";
              } else if (lowercaseBoxName === "twos" || lowercaseBoxName === "sowt" || lowercaseBoxName === "raw " || lowercaseBoxName === "in24" || lowercaseBoxName === "in32" || lowercaseBoxName === "fl32" || lowercaseBoxName === "fl64" || lowercaseBoxName === "lpcm" || lowercaseBoxName === "ipcm" || lowercaseBoxName === "fpcm") ;
              else if (lowercaseBoxName === "ulaw") {
                track.info.codec = "ulaw";
              } else if (lowercaseBoxName === "alaw") {
                track.info.codec = "alaw";
              } else {
                console.warn(`Unsupported audio codec (sample entry type '${sampleBoxInfo.name}').`);
              }
              slice.skip(6 * 1 + 2);
              const version = readU16Be(slice);
              slice.skip(3 * 2);
              let channelCount = readU16Be(slice);
              let sampleSize = readU16Be(slice);
              slice.skip(2 * 2);
              let sampleRate = readU32Be(slice) / 65536;
              if (stsdVersion === 0 && version > 0) {
                if (version === 1) {
                  slice.skip(4);
                  sampleSize = 8 * readU32Be(slice);
                  slice.skip(2 * 4);
                } else if (version === 2) {
                  slice.skip(4);
                  sampleRate = readF64Be(slice);
                  channelCount = readU32Be(slice);
                  slice.skip(4);
                  sampleSize = readU32Be(slice);
                  const flags = readU32Be(slice);
                  slice.skip(2 * 4);
                  if (lowercaseBoxName === "lpcm") {
                    const bytesPerSample = sampleSize + 7 >> 3;
                    const isFloat = Boolean(flags & 1);
                    const isBigEndian = Boolean(flags & 2);
                    const sFlags = flags & 4 ? -1 : 0;
                    if (sampleSize > 0 && sampleSize <= 64) {
                      if (isFloat) {
                        if (sampleSize === 32) {
                          track.info.codec = isBigEndian ? "pcm-f32be" : "pcm-f32";
                        }
                      } else {
                        if (sFlags & 1 << bytesPerSample - 1) {
                          if (bytesPerSample === 1) {
                            track.info.codec = "pcm-s8";
                          } else if (bytesPerSample === 2) {
                            track.info.codec = isBigEndian ? "pcm-s16be" : "pcm-s16";
                          } else if (bytesPerSample === 3) {
                            track.info.codec = isBigEndian ? "pcm-s24be" : "pcm-s24";
                          } else if (bytesPerSample === 4) {
                            track.info.codec = isBigEndian ? "pcm-s32be" : "pcm-s32";
                          }
                        } else {
                          if (bytesPerSample === 1) {
                            track.info.codec = "pcm-u8";
                          }
                        }
                      }
                    }
                    if (track.info.codec === null) {
                      console.warn("Unsupported PCM format.");
                    }
                  }
                }
              }
              if (track.info.codec === "opus") {
                sampleRate = OPUS_SAMPLE_RATE;
              }
              track.info.numberOfChannels = channelCount;
              track.info.sampleRate = sampleRate;
              if (lowercaseBoxName === "twos") {
                if (sampleSize === 8) {
                  track.info.codec = "pcm-s8";
                } else if (sampleSize === 16) {
                  track.info.codec = "pcm-s16be";
                } else {
                  console.warn(`Unsupported sample size ${sampleSize} for codec 'twos'.`);
                  track.info.codec = null;
                }
              } else if (lowercaseBoxName === "sowt") {
                if (sampleSize === 8) {
                  track.info.codec = "pcm-s8";
                } else if (sampleSize === 16) {
                  track.info.codec = "pcm-s16";
                } else {
                  console.warn(`Unsupported sample size ${sampleSize} for codec 'sowt'.`);
                  track.info.codec = null;
                }
              } else if (lowercaseBoxName === "raw ") {
                track.info.codec = "pcm-u8";
              } else if (lowercaseBoxName === "in24") {
                track.info.codec = "pcm-s24be";
              } else if (lowercaseBoxName === "in32") {
                track.info.codec = "pcm-s32be";
              } else if (lowercaseBoxName === "fl32") {
                track.info.codec = "pcm-f32be";
              } else if (lowercaseBoxName === "fl64") {
                track.info.codec = "pcm-f64be";
              } else if (lowercaseBoxName === "ipcm") {
                track.info.codec = "pcm-s16be";
              } else if (lowercaseBoxName === "fpcm") {
                track.info.codec = "pcm-f32be";
              }
              this.readContiguousBoxes(slice.slice(slice.filePos, sampleBoxStartPos + sampleBoxInfo.totalSize - slice.filePos));
            }
          }
        }
        break;
      case "avcC":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info);
          track.info.codecDescription = readBytes(slice, boxInfo.contentSize);
        }
        break;
      case "hvcC":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info);
          track.info.codecDescription = readBytes(slice, boxInfo.contentSize);
        }
        break;
      case "vpcC":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info?.type === "video");
          slice.skip(4);
          const profile = readU8(slice);
          const level = readU8(slice);
          const thirdByte = readU8(slice);
          const bitDepth = thirdByte >> 4;
          const chromaSubsampling = thirdByte >> 1 & 7;
          const videoFullRangeFlag = thirdByte & 1;
          const colourPrimaries = readU8(slice);
          const transferCharacteristics = readU8(slice);
          const matrixCoefficients = readU8(slice);
          track.info.vp9CodecInfo = {
            profile,
            level,
            bitDepth,
            chromaSubsampling,
            videoFullRangeFlag,
            colourPrimaries,
            transferCharacteristics,
            matrixCoefficients
          };
        }
        break;
      case "av1C":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info?.type === "video");
          slice.skip(1);
          const secondByte = readU8(slice);
          const profile = secondByte >> 5;
          const level = secondByte & 31;
          const thirdByte = readU8(slice);
          const tier = thirdByte >> 7;
          const highBitDepth = thirdByte >> 6 & 1;
          const twelveBit = thirdByte >> 5 & 1;
          const monochrome = thirdByte >> 4 & 1;
          const chromaSubsamplingX = thirdByte >> 3 & 1;
          const chromaSubsamplingY = thirdByte >> 2 & 1;
          const chromaSamplePosition = thirdByte & 3;
          const bitDepth = profile === 2 && highBitDepth ? twelveBit ? 12 : 10 : highBitDepth ? 10 : 8;
          track.info.av1CodecInfo = {
            profile,
            level,
            tier,
            bitDepth,
            monochrome,
            chromaSubsamplingX,
            chromaSubsamplingY,
            chromaSamplePosition
          };
        }
        break;
      case "colr":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info?.type === "video");
          const colourType = readAscii(slice, 4);
          if (colourType !== "nclx") {
            break;
          }
          const colourPrimaries = readU16Be(slice);
          const transferCharacteristics = readU16Be(slice);
          const matrixCoefficients = readU16Be(slice);
          const fullRangeFlag = Boolean(readU8(slice) & 128);
          track.info.colorSpace = {
            primaries: COLOR_PRIMARIES_MAP_INVERSE[colourPrimaries],
            transfer: TRANSFER_CHARACTERISTICS_MAP_INVERSE[transferCharacteristics],
            matrix: MATRIX_COEFFICIENTS_MAP_INVERSE[matrixCoefficients],
            fullRange: fullRangeFlag
          };
        }
        break;
      case "wave":
        {
          this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
        }
        break;
      case "esds":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info?.type === "audio");
          slice.skip(4);
          const tag = readU8(slice);
          assert(tag === 3);
          readIsomVariableInteger(slice);
          slice.skip(2);
          const mixed = readU8(slice);
          const streamDependenceFlag = (mixed & 128) !== 0;
          const urlFlag = (mixed & 64) !== 0;
          const ocrStreamFlag = (mixed & 32) !== 0;
          if (streamDependenceFlag) {
            slice.skip(2);
          }
          if (urlFlag) {
            const urlLength = readU8(slice);
            slice.skip(urlLength);
          }
          if (ocrStreamFlag) {
            slice.skip(2);
          }
          const decoderConfigTag = readU8(slice);
          assert(decoderConfigTag === 4);
          const decoderConfigDescriptorLength = readIsomVariableInteger(slice);
          const payloadStart = slice.filePos;
          const objectTypeIndication = readU8(slice);
          if (objectTypeIndication === 64 || objectTypeIndication === 103) {
            track.info.codec = "aac";
            track.info.aacCodecInfo = { isMpeg2: objectTypeIndication === 103 };
          } else if (objectTypeIndication === 105 || objectTypeIndication === 107) {
            track.info.codec = "mp3";
          } else if (objectTypeIndication === 221) {
            track.info.codec = "vorbis";
          } else {
            console.warn(`Unsupported audio codec (objectTypeIndication ${objectTypeIndication}) - discarding track.`);
          }
          slice.skip(1 + 3 + 4 + 4);
          if (decoderConfigDescriptorLength > slice.filePos - payloadStart) {
            const decoderSpecificInfoTag = readU8(slice);
            assert(decoderSpecificInfoTag === 5);
            const decoderSpecificInfoLength = readIsomVariableInteger(slice);
            track.info.codecDescription = readBytes(slice, decoderSpecificInfoLength);
            if (track.info.codec === "aac") {
              const audioSpecificConfig = parseAacAudioSpecificConfig(track.info.codecDescription);
              if (audioSpecificConfig.numberOfChannels !== null) {
                track.info.numberOfChannels = audioSpecificConfig.numberOfChannels;
              }
              if (audioSpecificConfig.sampleRate !== null) {
                track.info.sampleRate = audioSpecificConfig.sampleRate;
              }
            }
          }
        }
        break;
      case "enda":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info?.type === "audio");
          const littleEndian = readU16Be(slice) & 255;
          if (littleEndian) {
            if (track.info.codec === "pcm-s16be") {
              track.info.codec = "pcm-s16";
            } else if (track.info.codec === "pcm-s24be") {
              track.info.codec = "pcm-s24";
            } else if (track.info.codec === "pcm-s32be") {
              track.info.codec = "pcm-s32";
            } else if (track.info.codec === "pcm-f32be") {
              track.info.codec = "pcm-f32";
            } else if (track.info.codec === "pcm-f64be") {
              track.info.codec = "pcm-f64";
            }
          }
        }
        break;
      case "pcmC": {
        const track = this.currentTrack;
        if (!track) {
          break;
        }
        assert(track.info?.type === "audio");
        slice.skip(1 + 3);
        const formatFlags = readU8(slice);
        const isLittleEndian = Boolean(formatFlags & 1);
        const pcmSampleSize = readU8(slice);
        if (track.info.codec === "pcm-s16be") {
          if (isLittleEndian) {
            if (pcmSampleSize === 16) {
              track.info.codec = "pcm-s16";
            } else if (pcmSampleSize === 24) {
              track.info.codec = "pcm-s24";
            } else if (pcmSampleSize === 32) {
              track.info.codec = "pcm-s32";
            } else {
              console.warn(`Invalid ipcm sample size ${pcmSampleSize}.`);
              track.info.codec = null;
            }
          } else {
            if (pcmSampleSize === 16) {
              track.info.codec = "pcm-s16be";
            } else if (pcmSampleSize === 24) {
              track.info.codec = "pcm-s24be";
            } else if (pcmSampleSize === 32) {
              track.info.codec = "pcm-s32be";
            } else {
              console.warn(`Invalid ipcm sample size ${pcmSampleSize}.`);
              track.info.codec = null;
            }
          }
        } else if (track.info.codec === "pcm-f32be") {
          if (isLittleEndian) {
            if (pcmSampleSize === 32) {
              track.info.codec = "pcm-f32";
            } else if (pcmSampleSize === 64) {
              track.info.codec = "pcm-f64";
            } else {
              console.warn(`Invalid fpcm sample size ${pcmSampleSize}.`);
              track.info.codec = null;
            }
          } else {
            if (pcmSampleSize === 32) {
              track.info.codec = "pcm-f32be";
            } else if (pcmSampleSize === 64) {
              track.info.codec = "pcm-f64be";
            } else {
              console.warn(`Invalid fpcm sample size ${pcmSampleSize}.`);
              track.info.codec = null;
            }
          }
        }
        break;
      }
      case "dOps":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info?.type === "audio");
          slice.skip(1);
          const outputChannelCount = readU8(slice);
          const preSkip = readU16Be(slice);
          const inputSampleRate = readU32Be(slice);
          const outputGain = readI16Be(slice);
          const channelMappingFamily = readU8(slice);
          let channelMappingTable;
          if (channelMappingFamily !== 0) {
            channelMappingTable = readBytes(slice, 2 + outputChannelCount);
          } else {
            channelMappingTable = new Uint8Array(0);
          }
          const description = new Uint8Array(8 + 1 + 1 + 2 + 4 + 2 + 1 + channelMappingTable.byteLength);
          const view = new DataView(description.buffer);
          view.setUint32(0, 1332770163, false);
          view.setUint32(4, 1214603620, false);
          view.setUint8(8, 1);
          view.setUint8(9, outputChannelCount);
          view.setUint16(10, preSkip, true);
          view.setUint32(12, inputSampleRate, true);
          view.setInt16(16, outputGain, true);
          view.setUint8(18, channelMappingFamily);
          description.set(channelMappingTable, 19);
          track.info.codecDescription = description;
          track.info.numberOfChannels = outputChannelCount;
        }
        break;
      case "dfLa":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.info?.type === "audio");
          slice.skip(4);
          const BLOCK_TYPE_MASK = 127;
          const LAST_METADATA_BLOCK_FLAG_MASK = 128;
          const startPos2 = slice.filePos;
          while (slice.filePos < boxEndPos) {
            const flagAndType = readU8(slice);
            const metadataBlockLength = readU24Be(slice);
            const type = flagAndType & BLOCK_TYPE_MASK;
            if (type === FlacBlockType.STREAMINFO) {
              slice.skip(10);
              const word = readU32Be(slice);
              const sampleRate = word >>> 12;
              const numberOfChannels = (word >> 9 & 7) + 1;
              track.info.sampleRate = sampleRate;
              track.info.numberOfChannels = numberOfChannels;
              slice.skip(20);
            } else {
              slice.skip(metadataBlockLength);
            }
            if (flagAndType & LAST_METADATA_BLOCK_FLAG_MASK) {
              break;
            }
          }
          const endPos = slice.filePos;
          slice.filePos = startPos2;
          const bytes = readBytes(slice, endPos - startPos2);
          const description = new Uint8Array(4 + bytes.byteLength);
          const view = new DataView(description.buffer);
          view.setUint32(0, 1716281667, false);
          description.set(bytes, 4);
          track.info.codecDescription = description;
        }
        break;
      case "stts":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(4);
          const entryCount = readU32Be(slice);
          let currentIndex = 0;
          let currentTimestamp = 0;
          for (let i = 0; i < entryCount; i++) {
            const sampleCount = readU32Be(slice);
            const sampleDelta = readU32Be(slice);
            track.sampleTable.sampleTimingEntries.push({
              startIndex: currentIndex,
              startDecodeTimestamp: currentTimestamp,
              count: sampleCount,
              delta: sampleDelta
            });
            currentIndex += sampleCount;
            currentTimestamp += sampleCount * sampleDelta;
          }
        }
        break;
      case "ctts":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(1 + 3);
          const entryCount = readU32Be(slice);
          let sampleIndex = 0;
          for (let i = 0; i < entryCount; i++) {
            const sampleCount = readU32Be(slice);
            const sampleOffset = readI32Be(slice);
            track.sampleTable.sampleCompositionTimeOffsets.push({
              startIndex: sampleIndex,
              count: sampleCount,
              offset: sampleOffset
            });
            sampleIndex += sampleCount;
          }
        }
        break;
      case "stsz":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(4);
          const sampleSize = readU32Be(slice);
          const sampleCount = readU32Be(slice);
          if (sampleSize === 0) {
            for (let i = 0; i < sampleCount; i++) {
              const sampleSize2 = readU32Be(slice);
              track.sampleTable.sampleSizes.push(sampleSize2);
            }
          } else {
            track.sampleTable.sampleSizes.push(sampleSize);
          }
        }
        break;
      case "stz2":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(4);
          slice.skip(3);
          const fieldSize = readU8(slice);
          const sampleCount = readU32Be(slice);
          const bytes = readBytes(slice, Math.ceil(sampleCount * fieldSize / 8));
          const bitstream = new Bitstream(bytes);
          for (let i = 0; i < sampleCount; i++) {
            const sampleSize = bitstream.readBits(fieldSize);
            track.sampleTable.sampleSizes.push(sampleSize);
          }
        }
        break;
      case "stss":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(4);
          track.sampleTable.keySampleIndices = [];
          const entryCount = readU32Be(slice);
          for (let i = 0; i < entryCount; i++) {
            const sampleIndex = readU32Be(slice) - 1;
            track.sampleTable.keySampleIndices.push(sampleIndex);
          }
          if (track.sampleTable.keySampleIndices[0] !== 0) {
            track.sampleTable.keySampleIndices.unshift(0);
          }
        }
        break;
      case "stsc":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(4);
          const entryCount = readU32Be(slice);
          for (let i = 0; i < entryCount; i++) {
            const startChunkIndex = readU32Be(slice) - 1;
            const samplesPerChunk = readU32Be(slice);
            const sampleDescriptionIndex = readU32Be(slice);
            track.sampleTable.sampleToChunk.push({
              startSampleIndex: -1,
              startChunkIndex,
              samplesPerChunk,
              sampleDescriptionIndex
            });
          }
          let startSampleIndex = 0;
          for (let i = 0; i < track.sampleTable.sampleToChunk.length; i++) {
            track.sampleTable.sampleToChunk[i].startSampleIndex = startSampleIndex;
            if (i < track.sampleTable.sampleToChunk.length - 1) {
              const nextChunk = track.sampleTable.sampleToChunk[i + 1];
              const chunkCount = nextChunk.startChunkIndex - track.sampleTable.sampleToChunk[i].startChunkIndex;
              startSampleIndex += chunkCount * track.sampleTable.sampleToChunk[i].samplesPerChunk;
            }
          }
        }
        break;
      case "stco":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(4);
          const entryCount = readU32Be(slice);
          for (let i = 0; i < entryCount; i++) {
            const chunkOffset = readU32Be(slice);
            track.sampleTable.chunkOffsets.push(chunkOffset);
          }
        }
        break;
      case "co64":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          if (!track.sampleTable) {
            break;
          }
          slice.skip(4);
          const entryCount = readU32Be(slice);
          for (let i = 0; i < entryCount; i++) {
            const chunkOffset = readU64Be(slice);
            track.sampleTable.chunkOffsets.push(chunkOffset);
          }
        }
        break;
      case "mvex":
        {
          this.isFragmented = true;
          this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
        }
        break;
      case "mehd":
        {
          const version = readU8(slice);
          slice.skip(3);
          const fragmentDuration = version === 1 ? readU64Be(slice) : readU32Be(slice);
          this.movieDurationInTimescale = fragmentDuration;
        }
        break;
      case "trex":
        {
          slice.skip(4);
          const trackId = readU32Be(slice);
          const defaultSampleDescriptionIndex = readU32Be(slice);
          const defaultSampleDuration = readU32Be(slice);
          const defaultSampleSize = readU32Be(slice);
          const defaultSampleFlags = readU32Be(slice);
          this.fragmentTrackDefaults.push({
            trackId,
            defaultSampleDescriptionIndex,
            defaultSampleDuration,
            defaultSampleSize,
            defaultSampleFlags
          });
        }
        break;
      case "tfra":
        {
          const version = readU8(slice);
          slice.skip(3);
          const trackId = readU32Be(slice);
          const track = this.tracks.find((x) => x.id === trackId);
          if (!track) {
            break;
          }
          const word = readU32Be(slice);
          const lengthSizeOfTrafNum = (word & 48) >> 4;
          const lengthSizeOfTrunNum = (word & 12) >> 2;
          const lengthSizeOfSampleNum = word & 3;
          const functions = [readU8, readU16Be, readU24Be, readU32Be];
          const readTrafNum = functions[lengthSizeOfTrafNum];
          const readTrunNum = functions[lengthSizeOfTrunNum];
          const readSampleNum = functions[lengthSizeOfSampleNum];
          const numberOfEntries = readU32Be(slice);
          for (let i = 0; i < numberOfEntries; i++) {
            const time = version === 1 ? readU64Be(slice) : readU32Be(slice);
            const moofOffset = version === 1 ? readU64Be(slice) : readU32Be(slice);
            readTrafNum(slice);
            readTrunNum(slice);
            readSampleNum(slice);
            track.fragmentLookupTable.push({
              timestamp: time,
              moofOffset
            });
          }
          track.fragmentLookupTable.sort((a, b) => a.timestamp - b.timestamp);
          for (let i = 0; i < track.fragmentLookupTable.length - 1; i++) {
            const entry1 = track.fragmentLookupTable[i];
            const entry2 = track.fragmentLookupTable[i + 1];
            if (entry1.timestamp === entry2.timestamp) {
              track.fragmentLookupTable.splice(i + 1, 1);
              i--;
            }
          }
        }
        break;
      case "moof":
        {
          this.currentFragment = {
            moofOffset: startPos,
            moofSize: boxInfo.totalSize,
            implicitBaseDataOffset: startPos,
            trackData: /* @__PURE__ */ new Map()
          };
          this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
          this.lastReadFragment = this.currentFragment;
          this.currentFragment = null;
        }
        break;
      case "traf":
        {
          assert(this.currentFragment);
          this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
          if (this.currentTrack) {
            const trackData = this.currentFragment.trackData.get(this.currentTrack.id);
            if (trackData) {
              const { currentFragmentState } = this.currentTrack;
              assert(currentFragmentState);
              if (currentFragmentState.startTimestamp !== null) {
                offsetFragmentTrackDataByTimestamp(trackData, currentFragmentState.startTimestamp);
                trackData.startTimestampIsFinal = true;
              }
            }
            this.currentTrack.currentFragmentState = null;
            this.currentTrack = null;
          }
        }
        break;
      case "tfhd":
        {
          assert(this.currentFragment);
          slice.skip(1);
          const flags = readU24Be(slice);
          const baseDataOffsetPresent = Boolean(flags & 1);
          const sampleDescriptionIndexPresent = Boolean(flags & 2);
          const defaultSampleDurationPresent = Boolean(flags & 8);
          const defaultSampleSizePresent = Boolean(flags & 16);
          const defaultSampleFlagsPresent = Boolean(flags & 32);
          const durationIsEmpty = Boolean(flags & 65536);
          const defaultBaseIsMoof = Boolean(flags & 131072);
          const trackId = readU32Be(slice);
          const track = this.tracks.find((x) => x.id === trackId);
          if (!track) {
            break;
          }
          const defaults = this.fragmentTrackDefaults.find((x) => x.trackId === trackId);
          this.currentTrack = track;
          track.currentFragmentState = {
            baseDataOffset: this.currentFragment.implicitBaseDataOffset,
            sampleDescriptionIndex: defaults?.defaultSampleDescriptionIndex ?? null,
            defaultSampleDuration: defaults?.defaultSampleDuration ?? null,
            defaultSampleSize: defaults?.defaultSampleSize ?? null,
            defaultSampleFlags: defaults?.defaultSampleFlags ?? null,
            startTimestamp: null
          };
          if (baseDataOffsetPresent) {
            track.currentFragmentState.baseDataOffset = readU64Be(slice);
          } else if (defaultBaseIsMoof) {
            track.currentFragmentState.baseDataOffset = this.currentFragment.moofOffset;
          }
          if (sampleDescriptionIndexPresent) {
            track.currentFragmentState.sampleDescriptionIndex = readU32Be(slice);
          }
          if (defaultSampleDurationPresent) {
            track.currentFragmentState.defaultSampleDuration = readU32Be(slice);
          }
          if (defaultSampleSizePresent) {
            track.currentFragmentState.defaultSampleSize = readU32Be(slice);
          }
          if (defaultSampleFlagsPresent) {
            track.currentFragmentState.defaultSampleFlags = readU32Be(slice);
          }
          if (durationIsEmpty) {
            track.currentFragmentState.defaultSampleDuration = 0;
          }
        }
        break;
      case "tfdt":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(track.currentFragmentState);
          const version = readU8(slice);
          slice.skip(3);
          const baseMediaDecodeTime = version === 0 ? readU32Be(slice) : readU64Be(slice);
          track.currentFragmentState.startTimestamp = baseMediaDecodeTime;
        }
        break;
      case "trun":
        {
          const track = this.currentTrack;
          if (!track) {
            break;
          }
          assert(this.currentFragment);
          assert(track.currentFragmentState);
          if (this.currentFragment.trackData.has(track.id)) {
            console.warn("Can't have two trun boxes for the same track in one fragment. Ignoring...");
            break;
          }
          const version = readU8(slice);
          const flags = readU24Be(slice);
          const dataOffsetPresent = Boolean(flags & 1);
          const firstSampleFlagsPresent = Boolean(flags & 4);
          const sampleDurationPresent = Boolean(flags & 256);
          const sampleSizePresent = Boolean(flags & 512);
          const sampleFlagsPresent = Boolean(flags & 1024);
          const sampleCompositionTimeOffsetsPresent = Boolean(flags & 2048);
          const sampleCount = readU32Be(slice);
          let dataOffset = track.currentFragmentState.baseDataOffset;
          if (dataOffsetPresent) {
            dataOffset += readI32Be(slice);
          }
          let firstSampleFlags = null;
          if (firstSampleFlagsPresent) {
            firstSampleFlags = readU32Be(slice);
          }
          let currentOffset = dataOffset;
          if (sampleCount === 0) {
            this.currentFragment.implicitBaseDataOffset = currentOffset;
            break;
          }
          let currentTimestamp = 0;
          const trackData = {
            track,
            startTimestamp: 0,
            endTimestamp: 0,
            firstKeyFrameTimestamp: null,
            samples: [],
            presentationTimestamps: [],
            startTimestampIsFinal: false
          };
          this.currentFragment.trackData.set(track.id, trackData);
          for (let i = 0; i < sampleCount; i++) {
            let sampleDuration;
            if (sampleDurationPresent) {
              sampleDuration = readU32Be(slice);
            } else {
              assert(track.currentFragmentState.defaultSampleDuration !== null);
              sampleDuration = track.currentFragmentState.defaultSampleDuration;
            }
            let sampleSize;
            if (sampleSizePresent) {
              sampleSize = readU32Be(slice);
            } else {
              assert(track.currentFragmentState.defaultSampleSize !== null);
              sampleSize = track.currentFragmentState.defaultSampleSize;
            }
            let sampleFlags;
            if (sampleFlagsPresent) {
              sampleFlags = readU32Be(slice);
            } else {
              assert(track.currentFragmentState.defaultSampleFlags !== null);
              sampleFlags = track.currentFragmentState.defaultSampleFlags;
            }
            if (i === 0 && firstSampleFlags !== null) {
              sampleFlags = firstSampleFlags;
            }
            let sampleCompositionTimeOffset = 0;
            if (sampleCompositionTimeOffsetsPresent) {
              if (version === 0) {
                sampleCompositionTimeOffset = readU32Be(slice);
              } else {
                sampleCompositionTimeOffset = readI32Be(slice);
              }
            }
            const isKeyFrame = !(sampleFlags & 65536);
            trackData.samples.push({
              presentationTimestamp: currentTimestamp + sampleCompositionTimeOffset,
              duration: sampleDuration,
              byteOffset: currentOffset,
              byteSize: sampleSize,
              isKeyFrame
            });
            currentOffset += sampleSize;
            currentTimestamp += sampleDuration;
          }
          trackData.presentationTimestamps = trackData.samples.map((x, i) => ({ presentationTimestamp: x.presentationTimestamp, sampleIndex: i })).sort((a, b) => a.presentationTimestamp - b.presentationTimestamp);
          for (let i = 0; i < trackData.presentationTimestamps.length; i++) {
            const currentEntry = trackData.presentationTimestamps[i];
            const currentSample = trackData.samples[currentEntry.sampleIndex];
            if (trackData.firstKeyFrameTimestamp === null && currentSample.isKeyFrame) {
              trackData.firstKeyFrameTimestamp = currentSample.presentationTimestamp;
            }
            if (i < trackData.presentationTimestamps.length - 1) {
              const nextEntry = trackData.presentationTimestamps[i + 1];
              currentSample.duration = nextEntry.presentationTimestamp - currentEntry.presentationTimestamp;
            }
          }
          const firstSample = trackData.samples[trackData.presentationTimestamps[0].sampleIndex];
          const lastSample = trackData.samples[last(trackData.presentationTimestamps).sampleIndex];
          trackData.startTimestamp = firstSample.presentationTimestamp;
          trackData.endTimestamp = lastSample.presentationTimestamp + lastSample.duration;
          this.currentFragment.implicitBaseDataOffset = currentOffset;
        }
        break;
      // Metadata section
      // https://exiftool.org/TagNames/QuickTime.html
      // https://mp4workshop.com/about
      case "udta":
        {
          const iterator = this.iterateContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
          for (const { boxInfo: boxInfo2, slice: slice2 } of iterator) {
            if (boxInfo2.name !== "meta" && !this.currentTrack) {
              const startPos2 = slice2.filePos;
              (_a = this.metadataTags).raw ?? (_a.raw = {});
              if (boxInfo2.name[0] === "©") {
                (_b = this.metadataTags.raw)[_c = boxInfo2.name] ?? (_b[_c] = readMetadataStringShort(slice2));
              } else {
                (_d = this.metadataTags.raw)[_e = boxInfo2.name] ?? (_d[_e] = readBytes(slice2, boxInfo2.contentSize));
              }
              slice2.filePos = startPos2;
            }
            switch (boxInfo2.name) {
              case "meta":
                {
                  slice2.skip(-boxInfo2.headerSize);
                  this.traverseBox(slice2);
                }
                break;
              case "©nam":
              case "name":
                {
                  if (this.currentTrack) {
                    this.currentTrack.name = textDecoder.decode(readBytes(slice2, boxInfo2.contentSize));
                  } else {
                    (_f = this.metadataTags).title ?? (_f.title = readMetadataStringShort(slice2));
                  }
                }
                break;
              case "©des":
                {
                  if (!this.currentTrack) {
                    (_g = this.metadataTags).description ?? (_g.description = readMetadataStringShort(slice2));
                  }
                }
                break;
              case "©ART":
                {
                  if (!this.currentTrack) {
                    (_h = this.metadataTags).artist ?? (_h.artist = readMetadataStringShort(slice2));
                  }
                }
                break;
              case "©alb":
                {
                  if (!this.currentTrack) {
                    (_i = this.metadataTags).album ?? (_i.album = readMetadataStringShort(slice2));
                  }
                }
                break;
              case "albr":
                {
                  if (!this.currentTrack) {
                    (_j = this.metadataTags).albumArtist ?? (_j.albumArtist = readMetadataStringShort(slice2));
                  }
                }
                break;
              case "©gen":
                {
                  if (!this.currentTrack) {
                    (_k = this.metadataTags).genre ?? (_k.genre = readMetadataStringShort(slice2));
                  }
                }
                break;
              case "©day":
                {
                  if (!this.currentTrack) {
                    const date = new Date(readMetadataStringShort(slice2));
                    if (!Number.isNaN(date.getTime())) {
                      (_l = this.metadataTags).date ?? (_l.date = date);
                    }
                  }
                }
                break;
              case "©cmt":
                {
                  if (!this.currentTrack) {
                    (_m = this.metadataTags).comment ?? (_m.comment = readMetadataStringShort(slice2));
                  }
                }
                break;
              case "©lyr":
                {
                  if (!this.currentTrack) {
                    (_n = this.metadataTags).lyrics ?? (_n.lyrics = readMetadataStringShort(slice2));
                  }
                }
                break;
            }
          }
        }
        break;
      case "meta":
        {
          if (this.currentTrack) {
            break;
          }
          const word = readU32Be(slice);
          const isQuickTime = word !== 0;
          this.currentMetadataKeys = /* @__PURE__ */ new Map();
          if (isQuickTime) {
            this.readContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
          } else {
            this.readContiguousBoxes(slice.slice(contentStartPos + 4, boxInfo.contentSize - 4));
          }
          this.currentMetadataKeys = null;
        }
        break;
      case "keys":
        {
          if (!this.currentMetadataKeys) {
            break;
          }
          slice.skip(4);
          const entryCount = readU32Be(slice);
          for (let i = 0; i < entryCount; i++) {
            const keySize = readU32Be(slice);
            slice.skip(4);
            const keyName = textDecoder.decode(readBytes(slice, keySize - 8));
            this.currentMetadataKeys.set(i + 1, keyName);
          }
        }
        break;
      case "ilst":
        {
          if (!this.currentMetadataKeys) {
            break;
          }
          const iterator = this.iterateContiguousBoxes(slice.slice(contentStartPos, boxInfo.contentSize));
          for (const { boxInfo: boxInfo2, slice: slice2 } of iterator) {
            let metadataKey = boxInfo2.name;
            const nameAsNumber = (metadataKey.charCodeAt(0) << 24) + (metadataKey.charCodeAt(1) << 16) + (metadataKey.charCodeAt(2) << 8) + metadataKey.charCodeAt(3);
            if (this.currentMetadataKeys.has(nameAsNumber)) {
              metadataKey = this.currentMetadataKeys.get(nameAsNumber);
            }
            const data = readDataBox(slice2);
            (_o = this.metadataTags).raw ?? (_o.raw = {});
            (_p = this.metadataTags.raw)[metadataKey] ?? (_p[metadataKey] = data);
            switch (metadataKey) {
              case "©nam":
              case "titl":
              case "com.apple.quicktime.title":
              case "title":
                {
                  if (typeof data === "string") {
                    (_q = this.metadataTags).title ?? (_q.title = data);
                  }
                }
                break;
              case "©des":
              case "desc":
              case "dscp":
              case "com.apple.quicktime.description":
              case "description":
                {
                  if (typeof data === "string") {
                    (_r = this.metadataTags).description ?? (_r.description = data);
                  }
                }
                break;
              case "©ART":
              case "com.apple.quicktime.artist":
              case "artist":
                {
                  if (typeof data === "string") {
                    (_s = this.metadataTags).artist ?? (_s.artist = data);
                  }
                }
                break;
              case "©alb":
              case "albm":
              case "com.apple.quicktime.album":
              case "album":
                {
                  if (typeof data === "string") {
                    (_t = this.metadataTags).album ?? (_t.album = data);
                  }
                }
                break;
              case "aART":
              case "album_artist":
                {
                  if (typeof data === "string") {
                    (_u = this.metadataTags).albumArtist ?? (_u.albumArtist = data);
                  }
                }
                break;
              case "©cmt":
              case "com.apple.quicktime.comment":
              case "comment":
                {
                  if (typeof data === "string") {
                    (_v = this.metadataTags).comment ?? (_v.comment = data);
                  }
                }
                break;
              case "©gen":
              case "gnre":
              case "com.apple.quicktime.genre":
              case "genre":
                {
                  if (typeof data === "string") {
                    (_w = this.metadataTags).genre ?? (_w.genre = data);
                  }
                }
                break;
              case "©lyr":
              case "lyrics":
                {
                  if (typeof data === "string") {
                    (_x = this.metadataTags).lyrics ?? (_x.lyrics = data);
                  }
                }
                break;
              case "©day":
              case "rldt":
              case "com.apple.quicktime.creationdate":
              case "date":
                {
                  if (typeof data === "string") {
                    const date = new Date(data);
                    if (!Number.isNaN(date.getTime())) {
                      (_y = this.metadataTags).date ?? (_y.date = date);
                    }
                  }
                }
                break;
              case "covr":
              case "com.apple.quicktime.artwork":
                {
                  if (data instanceof RichImageData) {
                    (_z = this.metadataTags).images ?? (_z.images = []);
                    this.metadataTags.images.push({
                      data: data.data,
                      kind: "coverFront",
                      mimeType: data.mimeType
                    });
                  } else if (data instanceof Uint8Array) {
                    (_A = this.metadataTags).images ?? (_A.images = []);
                    this.metadataTags.images.push({
                      data,
                      kind: "coverFront",
                      mimeType: "image/*"
                    });
                  }
                }
                break;
              case "track":
                {
                  if (typeof data === "string") {
                    const parts = data.split("/");
                    const trackNum = Number.parseInt(parts[0], 10);
                    const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                    if (Number.isInteger(trackNum) && trackNum > 0) {
                      (_B = this.metadataTags).trackNumber ?? (_B.trackNumber = trackNum);
                    }
                    if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) {
                      (_C = this.metadataTags).tracksTotal ?? (_C.tracksTotal = tracksTotal);
                    }
                  }
                }
                break;
              case "trkn":
                {
                  if (data instanceof Uint8Array && data.length >= 6) {
                    const view = toDataView(data);
                    const trackNumber = view.getUint16(2, false);
                    const tracksTotal = view.getUint16(4, false);
                    if (trackNumber > 0) {
                      (_D = this.metadataTags).trackNumber ?? (_D.trackNumber = trackNumber);
                    }
                    if (tracksTotal > 0) {
                      (_E = this.metadataTags).tracksTotal ?? (_E.tracksTotal = tracksTotal);
                    }
                  }
                }
                break;
              case "disc":
              case "disk":
                {
                  if (data instanceof Uint8Array && data.length >= 6) {
                    const view = toDataView(data);
                    const discNumber = view.getUint16(2, false);
                    const discNumberMax = view.getUint16(4, false);
                    if (discNumber > 0) {
                      (_F = this.metadataTags).discNumber ?? (_F.discNumber = discNumber);
                    }
                    if (discNumberMax > 0) {
                      (_G = this.metadataTags).discsTotal ?? (_G.discsTotal = discNumberMax);
                    }
                  }
                }
                break;
            }
          }
        }
        break;
    }
    slice.filePos = boxEndPos;
    return true;
  }
}
class IsobmffTrackBacking {
  constructor(internalTrack) {
    this.internalTrack = internalTrack;
    this.packetToSampleIndex = /* @__PURE__ */ new WeakMap();
    this.packetToFragmentLocation = /* @__PURE__ */ new WeakMap();
  }
  getId() {
    return this.internalTrack.id;
  }
  getCodec() {
    throw new Error("Not implemented on base class.");
  }
  getInternalCodecId() {
    return this.internalTrack.internalCodecId;
  }
  getName() {
    return this.internalTrack.name;
  }
  getLanguageCode() {
    return this.internalTrack.languageCode;
  }
  getTimeResolution() {
    return this.internalTrack.timescale;
  }
  getDisposition() {
    return this.internalTrack.disposition;
  }
  async computeDuration() {
    const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
    return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
  }
  async getFirstTimestamp() {
    const firstPacket = await this.getFirstPacket({ metadataOnly: true });
    return firstPacket?.timestamp ?? 0;
  }
  async getFirstPacket(options) {
    const regularPacket = await this.fetchPacketForSampleIndex(0, options);
    if (regularPacket || !this.internalTrack.demuxer.isFragmented) {
      return regularPacket;
    }
    return this.performFragmentedLookup(
      null,
      (fragment) => {
        const trackData = fragment.trackData.get(this.internalTrack.id);
        if (trackData) {
          return {
            sampleIndex: 0,
            correctSampleFound: true
          };
        }
        return {
          sampleIndex: -1,
          correctSampleFound: false
        };
      },
      -Infinity,
      // Use -Infinity as a search timestamp to avoid using the lookup entries
      Infinity,
      options
    );
  }
  mapTimestampIntoTimescale(timestamp) {
    return roundIfAlmostInteger(timestamp * this.internalTrack.timescale) + this.internalTrack.editListOffset;
  }
  async getPacket(timestamp, options) {
    const timestampInTimescale = this.mapTimestampIntoTimescale(timestamp);
    const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
    const sampleIndex = getSampleIndexForTimestamp(sampleTable, timestampInTimescale);
    const regularPacket = await this.fetchPacketForSampleIndex(sampleIndex, options);
    if (!sampleTableIsEmpty(sampleTable) || !this.internalTrack.demuxer.isFragmented) {
      return regularPacket;
    }
    return this.performFragmentedLookup(null, (fragment) => {
      const trackData = fragment.trackData.get(this.internalTrack.id);
      if (!trackData) {
        return { sampleIndex: -1, correctSampleFound: false };
      }
      const index = binarySearchLessOrEqual(trackData.presentationTimestamps, timestampInTimescale, (x) => x.presentationTimestamp);
      const sampleIndex2 = index !== -1 ? trackData.presentationTimestamps[index].sampleIndex : -1;
      const correctSampleFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
      return { sampleIndex: sampleIndex2, correctSampleFound };
    }, timestampInTimescale, timestampInTimescale, options);
  }
  async getNextPacket(packet, options) {
    const regularSampleIndex = this.packetToSampleIndex.get(packet);
    if (regularSampleIndex !== void 0) {
      return this.fetchPacketForSampleIndex(regularSampleIndex + 1, options);
    }
    const locationInFragment = this.packetToFragmentLocation.get(packet);
    if (locationInFragment === void 0) {
      throw new Error("Packet was not created from this track.");
    }
    return this.performFragmentedLookup(
      locationInFragment.fragment,
      (fragment) => {
        if (fragment === locationInFragment.fragment) {
          const trackData = fragment.trackData.get(this.internalTrack.id);
          if (locationInFragment.sampleIndex + 1 < trackData.samples.length) {
            return {
              sampleIndex: locationInFragment.sampleIndex + 1,
              correctSampleFound: true
            };
          }
        } else {
          const trackData = fragment.trackData.get(this.internalTrack.id);
          if (trackData) {
            return {
              sampleIndex: 0,
              correctSampleFound: true
            };
          }
        }
        return {
          sampleIndex: -1,
          correctSampleFound: false
        };
      },
      -Infinity,
      // Use -Infinity as a search timestamp to avoid using the lookup entries
      Infinity,
      options
    );
  }
  async getKeyPacket(timestamp, options) {
    const timestampInTimescale = this.mapTimestampIntoTimescale(timestamp);
    const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
    const sampleIndex = getKeyframeSampleIndexForTimestamp(sampleTable, timestampInTimescale);
    const regularPacket = await this.fetchPacketForSampleIndex(sampleIndex, options);
    if (!sampleTableIsEmpty(sampleTable) || !this.internalTrack.demuxer.isFragmented) {
      return regularPacket;
    }
    return this.performFragmentedLookup(null, (fragment) => {
      const trackData = fragment.trackData.get(this.internalTrack.id);
      if (!trackData) {
        return { sampleIndex: -1, correctSampleFound: false };
      }
      const index = findLastIndex(trackData.presentationTimestamps, (x) => {
        const sample = trackData.samples[x.sampleIndex];
        return sample.isKeyFrame && x.presentationTimestamp <= timestampInTimescale;
      });
      const sampleIndex2 = index !== -1 ? trackData.presentationTimestamps[index].sampleIndex : -1;
      const correctSampleFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
      return { sampleIndex: sampleIndex2, correctSampleFound };
    }, timestampInTimescale, timestampInTimescale, options);
  }
  async getNextKeyPacket(packet, options) {
    const regularSampleIndex = this.packetToSampleIndex.get(packet);
    if (regularSampleIndex !== void 0) {
      const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
      const nextKeyFrameSampleIndex = getNextKeyframeIndexForSample(sampleTable, regularSampleIndex);
      return this.fetchPacketForSampleIndex(nextKeyFrameSampleIndex, options);
    }
    const locationInFragment = this.packetToFragmentLocation.get(packet);
    if (locationInFragment === void 0) {
      throw new Error("Packet was not created from this track.");
    }
    return this.performFragmentedLookup(
      locationInFragment.fragment,
      (fragment) => {
        if (fragment === locationInFragment.fragment) {
          const trackData = fragment.trackData.get(this.internalTrack.id);
          const nextKeyFrameIndex = trackData.samples.findIndex((x, i) => x.isKeyFrame && i > locationInFragment.sampleIndex);
          if (nextKeyFrameIndex !== -1) {
            return {
              sampleIndex: nextKeyFrameIndex,
              correctSampleFound: true
            };
          }
        } else {
          const trackData = fragment.trackData.get(this.internalTrack.id);
          if (trackData && trackData.firstKeyFrameTimestamp !== null) {
            const keyFrameIndex = trackData.samples.findIndex((x) => x.isKeyFrame);
            assert(keyFrameIndex !== -1);
            return {
              sampleIndex: keyFrameIndex,
              correctSampleFound: true
            };
          }
        }
        return {
          sampleIndex: -1,
          correctSampleFound: false
        };
      },
      -Infinity,
      // Use -Infinity as a search timestamp to avoid using the lookup entries
      Infinity,
      options
    );
  }
  async fetchPacketForSampleIndex(sampleIndex, options) {
    if (sampleIndex === -1) {
      return null;
    }
    const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(this.internalTrack);
    const sampleInfo = getSampleInfo(sampleTable, sampleIndex);
    if (!sampleInfo) {
      return null;
    }
    let data;
    if (options.metadataOnly) {
      data = PLACEHOLDER_DATA;
    } else {
      let slice = this.internalTrack.demuxer.reader.requestSlice(sampleInfo.sampleOffset, sampleInfo.sampleSize);
      if (slice instanceof Promise)
        slice = await slice;
      assert(slice);
      data = readBytes(slice, sampleInfo.sampleSize);
    }
    const timestamp = (sampleInfo.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale;
    const duration = sampleInfo.duration / this.internalTrack.timescale;
    const packet = new EncodedPacket(data, sampleInfo.isKeyFrame ? "key" : "delta", timestamp, duration, sampleIndex, sampleInfo.sampleSize);
    this.packetToSampleIndex.set(packet, sampleIndex);
    return packet;
  }
  async fetchPacketInFragment(fragment, sampleIndex, options) {
    if (sampleIndex === -1) {
      return null;
    }
    const trackData = fragment.trackData.get(this.internalTrack.id);
    const fragmentSample = trackData.samples[sampleIndex];
    assert(fragmentSample);
    let data;
    if (options.metadataOnly) {
      data = PLACEHOLDER_DATA;
    } else {
      let slice = this.internalTrack.demuxer.reader.requestSlice(fragmentSample.byteOffset, fragmentSample.byteSize);
      if (slice instanceof Promise)
        slice = await slice;
      assert(slice);
      data = readBytes(slice, fragmentSample.byteSize);
    }
    const timestamp = (fragmentSample.presentationTimestamp - this.internalTrack.editListOffset) / this.internalTrack.timescale;
    const duration = fragmentSample.duration / this.internalTrack.timescale;
    const packet = new EncodedPacket(data, fragmentSample.isKeyFrame ? "key" : "delta", timestamp, duration, fragment.moofOffset + sampleIndex, fragmentSample.byteSize);
    this.packetToFragmentLocation.set(packet, { fragment, sampleIndex });
    return packet;
  }
  /** Looks for a packet in the fragments while trying to load as few fragments as possible to retrieve it. */
  async performFragmentedLookup(startFragment, getMatchInFragment, searchTimestamp, latestTimestamp, options) {
    const demuxer = this.internalTrack.demuxer;
    let currentFragment = null;
    let bestFragment = null;
    let bestSampleIndex = -1;
    if (startFragment) {
      const { sampleIndex, correctSampleFound } = getMatchInFragment(startFragment);
      if (correctSampleFound) {
        return this.fetchPacketInFragment(startFragment, sampleIndex, options);
      }
      if (sampleIndex !== -1) {
        bestFragment = startFragment;
        bestSampleIndex = sampleIndex;
      }
    }
    const lookupEntryIndex = binarySearchLessOrEqual(this.internalTrack.fragmentLookupTable, searchTimestamp, (x) => x.timestamp);
    const lookupEntry = lookupEntryIndex !== -1 ? this.internalTrack.fragmentLookupTable[lookupEntryIndex] : null;
    const positionCacheIndex = binarySearchLessOrEqual(this.internalTrack.fragmentPositionCache, searchTimestamp, (x) => x.startTimestamp);
    const positionCacheEntry = positionCacheIndex !== -1 ? this.internalTrack.fragmentPositionCache[positionCacheIndex] : null;
    const lookupEntryPosition = Math.max(lookupEntry?.moofOffset ?? 0, positionCacheEntry?.moofOffset ?? 0) || null;
    let currentPos;
    if (!startFragment) {
      currentPos = lookupEntryPosition ?? 0;
    } else {
      if (lookupEntryPosition === null || startFragment.moofOffset >= lookupEntryPosition) {
        currentPos = startFragment.moofOffset + startFragment.moofSize;
        currentFragment = startFragment;
      } else {
        currentPos = lookupEntryPosition;
      }
    }
    while (true) {
      if (currentFragment) {
        const trackData = currentFragment.trackData.get(this.internalTrack.id);
        if (trackData && trackData.startTimestamp > latestTimestamp) {
          break;
        }
      }
      let slice = demuxer.reader.requestSliceRange(currentPos, MIN_BOX_HEADER_SIZE, MAX_BOX_HEADER_SIZE);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice)
        break;
      const boxStartPos = currentPos;
      const boxInfo = readBoxHeader(slice);
      if (!boxInfo) {
        break;
      }
      if (boxInfo.name === "moof") {
        currentFragment = await demuxer.readFragment(boxStartPos);
        const { sampleIndex, correctSampleFound } = getMatchInFragment(currentFragment);
        if (correctSampleFound) {
          return this.fetchPacketInFragment(currentFragment, sampleIndex, options);
        }
        if (sampleIndex !== -1) {
          bestFragment = currentFragment;
          bestSampleIndex = sampleIndex;
        }
      }
      currentPos = boxStartPos + boxInfo.totalSize;
    }
    if (lookupEntry && (!bestFragment || bestFragment.moofOffset < lookupEntry.moofOffset)) {
      const previousLookupEntry = this.internalTrack.fragmentLookupTable[lookupEntryIndex - 1];
      assert(!previousLookupEntry || previousLookupEntry.timestamp < lookupEntry.timestamp);
      const newSearchTimestamp = previousLookupEntry?.timestamp ?? -Infinity;
      return this.performFragmentedLookup(null, getMatchInFragment, newSearchTimestamp, latestTimestamp, options);
    }
    if (bestFragment) {
      return this.fetchPacketInFragment(bestFragment, bestSampleIndex, options);
    }
    return null;
  }
}
class IsobmffVideoTrackBacking extends IsobmffTrackBacking {
  constructor(internalTrack) {
    super(internalTrack);
    this.decoderConfigPromise = null;
    this.internalTrack = internalTrack;
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getCodedWidth() {
    return this.internalTrack.info.width;
  }
  getCodedHeight() {
    return this.internalTrack.info.height;
  }
  getRotation() {
    return this.internalTrack.rotation;
  }
  async getColorSpace() {
    return {
      primaries: this.internalTrack.info.colorSpace?.primaries,
      transfer: this.internalTrack.info.colorSpace?.transfer,
      matrix: this.internalTrack.info.colorSpace?.matrix,
      fullRange: this.internalTrack.info.colorSpace?.fullRange
    };
  }
  async canBeTransparent() {
    return false;
  }
  async getDecoderConfig() {
    if (!this.internalTrack.info.codec) {
      return null;
    }
    return this.decoderConfigPromise ?? (this.decoderConfigPromise = (async () => {
      if (this.internalTrack.info.codec === "vp9" && !this.internalTrack.info.vp9CodecInfo) {
        const firstPacket = await this.getFirstPacket({});
        this.internalTrack.info.vp9CodecInfo = firstPacket && extractVp9CodecInfoFromPacket(firstPacket.data);
      } else if (this.internalTrack.info.codec === "av1" && !this.internalTrack.info.av1CodecInfo) {
        const firstPacket = await this.getFirstPacket({});
        this.internalTrack.info.av1CodecInfo = firstPacket && extractAv1CodecInfoFromPacket(firstPacket.data);
      }
      return {
        codec: extractVideoCodecString(this.internalTrack.info),
        codedWidth: this.internalTrack.info.width,
        codedHeight: this.internalTrack.info.height,
        description: this.internalTrack.info.codecDescription ?? void 0,
        colorSpace: this.internalTrack.info.colorSpace ?? void 0
      };
    })());
  }
}
class IsobmffAudioTrackBacking extends IsobmffTrackBacking {
  constructor(internalTrack) {
    super(internalTrack);
    this.decoderConfig = null;
    this.internalTrack = internalTrack;
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getNumberOfChannels() {
    return this.internalTrack.info.numberOfChannels;
  }
  getSampleRate() {
    return this.internalTrack.info.sampleRate;
  }
  async getDecoderConfig() {
    if (!this.internalTrack.info.codec) {
      return null;
    }
    return this.decoderConfig ?? (this.decoderConfig = {
      codec: extractAudioCodecString(this.internalTrack.info),
      numberOfChannels: this.internalTrack.info.numberOfChannels,
      sampleRate: this.internalTrack.info.sampleRate,
      description: this.internalTrack.info.codecDescription ?? void 0
    });
  }
}
const getSampleIndexForTimestamp = (sampleTable, timescaleUnits) => {
  if (sampleTable.presentationTimestamps) {
    const index = binarySearchLessOrEqual(sampleTable.presentationTimestamps, timescaleUnits, (x) => x.presentationTimestamp);
    if (index === -1) {
      return -1;
    }
    return sampleTable.presentationTimestamps[index].sampleIndex;
  } else {
    const index = binarySearchLessOrEqual(sampleTable.sampleTimingEntries, timescaleUnits, (x) => x.startDecodeTimestamp);
    if (index === -1) {
      return -1;
    }
    const entry = sampleTable.sampleTimingEntries[index];
    return entry.startIndex + Math.min(Math.floor((timescaleUnits - entry.startDecodeTimestamp) / entry.delta), entry.count - 1);
  }
};
const getKeyframeSampleIndexForTimestamp = (sampleTable, timescaleUnits) => {
  if (!sampleTable.keySampleIndices) {
    return getSampleIndexForTimestamp(sampleTable, timescaleUnits);
  }
  if (sampleTable.presentationTimestamps) {
    const index = binarySearchLessOrEqual(sampleTable.presentationTimestamps, timescaleUnits, (x) => x.presentationTimestamp);
    if (index === -1) {
      return -1;
    }
    for (let i = index; i >= 0; i--) {
      const sampleIndex = sampleTable.presentationTimestamps[i].sampleIndex;
      const isKeyFrame = binarySearchExact(sampleTable.keySampleIndices, sampleIndex, (x) => x) !== -1;
      if (isKeyFrame) {
        return sampleIndex;
      }
    }
    return -1;
  } else {
    const sampleIndex = getSampleIndexForTimestamp(sampleTable, timescaleUnits);
    const index = binarySearchLessOrEqual(sampleTable.keySampleIndices, sampleIndex, (x) => x);
    return sampleTable.keySampleIndices[index] ?? -1;
  }
};
const getSampleInfo = (sampleTable, sampleIndex) => {
  const timingEntryIndex = binarySearchLessOrEqual(sampleTable.sampleTimingEntries, sampleIndex, (x) => x.startIndex);
  const timingEntry = sampleTable.sampleTimingEntries[timingEntryIndex];
  if (!timingEntry || timingEntry.startIndex + timingEntry.count <= sampleIndex) {
    return null;
  }
  const decodeTimestamp = timingEntry.startDecodeTimestamp + (sampleIndex - timingEntry.startIndex) * timingEntry.delta;
  let presentationTimestamp = decodeTimestamp;
  const offsetEntryIndex = binarySearchLessOrEqual(sampleTable.sampleCompositionTimeOffsets, sampleIndex, (x) => x.startIndex);
  const offsetEntry = sampleTable.sampleCompositionTimeOffsets[offsetEntryIndex];
  if (offsetEntry && sampleIndex - offsetEntry.startIndex < offsetEntry.count) {
    presentationTimestamp += offsetEntry.offset;
  }
  const sampleSize = sampleTable.sampleSizes[Math.min(sampleIndex, sampleTable.sampleSizes.length - 1)];
  const chunkEntryIndex = binarySearchLessOrEqual(sampleTable.sampleToChunk, sampleIndex, (x) => x.startSampleIndex);
  const chunkEntry = sampleTable.sampleToChunk[chunkEntryIndex];
  assert(chunkEntry);
  const chunkIndex = chunkEntry.startChunkIndex + Math.floor((sampleIndex - chunkEntry.startSampleIndex) / chunkEntry.samplesPerChunk);
  const chunkOffset = sampleTable.chunkOffsets[chunkIndex];
  const startSampleIndexOfChunk = chunkEntry.startSampleIndex + (chunkIndex - chunkEntry.startChunkIndex) * chunkEntry.samplesPerChunk;
  let chunkSize = 0;
  let sampleOffset = chunkOffset;
  if (sampleTable.sampleSizes.length === 1) {
    sampleOffset += sampleSize * (sampleIndex - startSampleIndexOfChunk);
    chunkSize += sampleSize * chunkEntry.samplesPerChunk;
  } else {
    for (let i = startSampleIndexOfChunk; i < startSampleIndexOfChunk + chunkEntry.samplesPerChunk; i++) {
      const sampleSize2 = sampleTable.sampleSizes[i];
      if (i < sampleIndex) {
        sampleOffset += sampleSize2;
      }
      chunkSize += sampleSize2;
    }
  }
  let duration = timingEntry.delta;
  if (sampleTable.presentationTimestamps) {
    const presentationIndex = sampleTable.presentationTimestampIndexMap[sampleIndex];
    assert(presentationIndex !== void 0);
    if (presentationIndex < sampleTable.presentationTimestamps.length - 1) {
      const nextEntry = sampleTable.presentationTimestamps[presentationIndex + 1];
      const nextPresentationTimestamp = nextEntry.presentationTimestamp;
      duration = nextPresentationTimestamp - presentationTimestamp;
    }
  }
  return {
    presentationTimestamp,
    duration,
    sampleOffset,
    sampleSize,
    chunkOffset,
    chunkSize,
    isKeyFrame: sampleTable.keySampleIndices ? binarySearchExact(sampleTable.keySampleIndices, sampleIndex, (x) => x) !== -1 : true
  };
};
const getNextKeyframeIndexForSample = (sampleTable, sampleIndex) => {
  if (!sampleTable.keySampleIndices) {
    return sampleIndex + 1;
  }
  const index = binarySearchLessOrEqual(sampleTable.keySampleIndices, sampleIndex, (x) => x);
  return sampleTable.keySampleIndices[index + 1] ?? -1;
};
const offsetFragmentTrackDataByTimestamp = (trackData, timestamp) => {
  trackData.startTimestamp += timestamp;
  trackData.endTimestamp += timestamp;
  for (const sample of trackData.samples) {
    sample.presentationTimestamp += timestamp;
  }
  for (const entry of trackData.presentationTimestamps) {
    entry.presentationTimestamp += timestamp;
  }
};
const extractRotationFromMatrix = (matrix) => {
  const [m11, , , m21] = matrix;
  const scaleX = Math.hypot(m11, m21);
  const cosTheta = m11 / scaleX;
  const sinTheta = m21 / scaleX;
  const result = -Math.atan2(sinTheta, cosTheta) * (180 / Math.PI);
  if (!Number.isFinite(result)) {
    return 0;
  }
  return result;
};
const sampleTableIsEmpty = (sampleTable) => {
  return sampleTable.sampleSizes.length === 0;
};
var EBMLId;
(function(EBMLId2) {
  EBMLId2[EBMLId2["EBML"] = 440786851] = "EBML";
  EBMLId2[EBMLId2["EBMLVersion"] = 17030] = "EBMLVersion";
  EBMLId2[EBMLId2["EBMLReadVersion"] = 17143] = "EBMLReadVersion";
  EBMLId2[EBMLId2["EBMLMaxIDLength"] = 17138] = "EBMLMaxIDLength";
  EBMLId2[EBMLId2["EBMLMaxSizeLength"] = 17139] = "EBMLMaxSizeLength";
  EBMLId2[EBMLId2["DocType"] = 17026] = "DocType";
  EBMLId2[EBMLId2["DocTypeVersion"] = 17031] = "DocTypeVersion";
  EBMLId2[EBMLId2["DocTypeReadVersion"] = 17029] = "DocTypeReadVersion";
  EBMLId2[EBMLId2["Void"] = 236] = "Void";
  EBMLId2[EBMLId2["Segment"] = 408125543] = "Segment";
  EBMLId2[EBMLId2["SeekHead"] = 290298740] = "SeekHead";
  EBMLId2[EBMLId2["Seek"] = 19899] = "Seek";
  EBMLId2[EBMLId2["SeekID"] = 21419] = "SeekID";
  EBMLId2[EBMLId2["SeekPosition"] = 21420] = "SeekPosition";
  EBMLId2[EBMLId2["Duration"] = 17545] = "Duration";
  EBMLId2[EBMLId2["Info"] = 357149030] = "Info";
  EBMLId2[EBMLId2["TimestampScale"] = 2807729] = "TimestampScale";
  EBMLId2[EBMLId2["MuxingApp"] = 19840] = "MuxingApp";
  EBMLId2[EBMLId2["WritingApp"] = 22337] = "WritingApp";
  EBMLId2[EBMLId2["Tracks"] = 374648427] = "Tracks";
  EBMLId2[EBMLId2["TrackEntry"] = 174] = "TrackEntry";
  EBMLId2[EBMLId2["TrackNumber"] = 215] = "TrackNumber";
  EBMLId2[EBMLId2["TrackUID"] = 29637] = "TrackUID";
  EBMLId2[EBMLId2["TrackType"] = 131] = "TrackType";
  EBMLId2[EBMLId2["FlagEnabled"] = 185] = "FlagEnabled";
  EBMLId2[EBMLId2["FlagDefault"] = 136] = "FlagDefault";
  EBMLId2[EBMLId2["FlagForced"] = 21930] = "FlagForced";
  EBMLId2[EBMLId2["FlagOriginal"] = 21934] = "FlagOriginal";
  EBMLId2[EBMLId2["FlagHearingImpaired"] = 21931] = "FlagHearingImpaired";
  EBMLId2[EBMLId2["FlagVisualImpaired"] = 21932] = "FlagVisualImpaired";
  EBMLId2[EBMLId2["FlagCommentary"] = 21935] = "FlagCommentary";
  EBMLId2[EBMLId2["FlagLacing"] = 156] = "FlagLacing";
  EBMLId2[EBMLId2["Name"] = 21358] = "Name";
  EBMLId2[EBMLId2["Language"] = 2274716] = "Language";
  EBMLId2[EBMLId2["LanguageBCP47"] = 2274717] = "LanguageBCP47";
  EBMLId2[EBMLId2["CodecID"] = 134] = "CodecID";
  EBMLId2[EBMLId2["CodecPrivate"] = 25506] = "CodecPrivate";
  EBMLId2[EBMLId2["CodecDelay"] = 22186] = "CodecDelay";
  EBMLId2[EBMLId2["SeekPreRoll"] = 22203] = "SeekPreRoll";
  EBMLId2[EBMLId2["DefaultDuration"] = 2352003] = "DefaultDuration";
  EBMLId2[EBMLId2["Video"] = 224] = "Video";
  EBMLId2[EBMLId2["PixelWidth"] = 176] = "PixelWidth";
  EBMLId2[EBMLId2["PixelHeight"] = 186] = "PixelHeight";
  EBMLId2[EBMLId2["AlphaMode"] = 21440] = "AlphaMode";
  EBMLId2[EBMLId2["Audio"] = 225] = "Audio";
  EBMLId2[EBMLId2["SamplingFrequency"] = 181] = "SamplingFrequency";
  EBMLId2[EBMLId2["Channels"] = 159] = "Channels";
  EBMLId2[EBMLId2["BitDepth"] = 25188] = "BitDepth";
  EBMLId2[EBMLId2["SimpleBlock"] = 163] = "SimpleBlock";
  EBMLId2[EBMLId2["BlockGroup"] = 160] = "BlockGroup";
  EBMLId2[EBMLId2["Block"] = 161] = "Block";
  EBMLId2[EBMLId2["BlockAdditions"] = 30113] = "BlockAdditions";
  EBMLId2[EBMLId2["BlockMore"] = 166] = "BlockMore";
  EBMLId2[EBMLId2["BlockAdditional"] = 165] = "BlockAdditional";
  EBMLId2[EBMLId2["BlockAddID"] = 238] = "BlockAddID";
  EBMLId2[EBMLId2["BlockDuration"] = 155] = "BlockDuration";
  EBMLId2[EBMLId2["ReferenceBlock"] = 251] = "ReferenceBlock";
  EBMLId2[EBMLId2["Cluster"] = 524531317] = "Cluster";
  EBMLId2[EBMLId2["Timestamp"] = 231] = "Timestamp";
  EBMLId2[EBMLId2["Cues"] = 475249515] = "Cues";
  EBMLId2[EBMLId2["CuePoint"] = 187] = "CuePoint";
  EBMLId2[EBMLId2["CueTime"] = 179] = "CueTime";
  EBMLId2[EBMLId2["CueTrackPositions"] = 183] = "CueTrackPositions";
  EBMLId2[EBMLId2["CueTrack"] = 247] = "CueTrack";
  EBMLId2[EBMLId2["CueClusterPosition"] = 241] = "CueClusterPosition";
  EBMLId2[EBMLId2["Colour"] = 21936] = "Colour";
  EBMLId2[EBMLId2["MatrixCoefficients"] = 21937] = "MatrixCoefficients";
  EBMLId2[EBMLId2["TransferCharacteristics"] = 21946] = "TransferCharacteristics";
  EBMLId2[EBMLId2["Primaries"] = 21947] = "Primaries";
  EBMLId2[EBMLId2["Range"] = 21945] = "Range";
  EBMLId2[EBMLId2["Projection"] = 30320] = "Projection";
  EBMLId2[EBMLId2["ProjectionType"] = 30321] = "ProjectionType";
  EBMLId2[EBMLId2["ProjectionPoseRoll"] = 30325] = "ProjectionPoseRoll";
  EBMLId2[EBMLId2["Attachments"] = 423732329] = "Attachments";
  EBMLId2[EBMLId2["AttachedFile"] = 24999] = "AttachedFile";
  EBMLId2[EBMLId2["FileDescription"] = 18046] = "FileDescription";
  EBMLId2[EBMLId2["FileName"] = 18030] = "FileName";
  EBMLId2[EBMLId2["FileMediaType"] = 18016] = "FileMediaType";
  EBMLId2[EBMLId2["FileData"] = 18012] = "FileData";
  EBMLId2[EBMLId2["FileUID"] = 18094] = "FileUID";
  EBMLId2[EBMLId2["Chapters"] = 272869232] = "Chapters";
  EBMLId2[EBMLId2["Tags"] = 307544935] = "Tags";
  EBMLId2[EBMLId2["Tag"] = 29555] = "Tag";
  EBMLId2[EBMLId2["Targets"] = 25536] = "Targets";
  EBMLId2[EBMLId2["TargetTypeValue"] = 26826] = "TargetTypeValue";
  EBMLId2[EBMLId2["TargetType"] = 25546] = "TargetType";
  EBMLId2[EBMLId2["TagTrackUID"] = 25541] = "TagTrackUID";
  EBMLId2[EBMLId2["TagEditionUID"] = 25545] = "TagEditionUID";
  EBMLId2[EBMLId2["TagChapterUID"] = 25540] = "TagChapterUID";
  EBMLId2[EBMLId2["TagAttachmentUID"] = 25542] = "TagAttachmentUID";
  EBMLId2[EBMLId2["SimpleTag"] = 26568] = "SimpleTag";
  EBMLId2[EBMLId2["TagName"] = 17827] = "TagName";
  EBMLId2[EBMLId2["TagLanguage"] = 17530] = "TagLanguage";
  EBMLId2[EBMLId2["TagString"] = 17543] = "TagString";
  EBMLId2[EBMLId2["TagBinary"] = 17541] = "TagBinary";
  EBMLId2[EBMLId2["ContentEncodings"] = 28032] = "ContentEncodings";
  EBMLId2[EBMLId2["ContentEncoding"] = 25152] = "ContentEncoding";
  EBMLId2[EBMLId2["ContentEncodingOrder"] = 20529] = "ContentEncodingOrder";
  EBMLId2[EBMLId2["ContentEncodingScope"] = 20530] = "ContentEncodingScope";
  EBMLId2[EBMLId2["ContentCompression"] = 20532] = "ContentCompression";
  EBMLId2[EBMLId2["ContentCompAlgo"] = 16980] = "ContentCompAlgo";
  EBMLId2[EBMLId2["ContentCompSettings"] = 16981] = "ContentCompSettings";
  EBMLId2[EBMLId2["ContentEncryption"] = 20533] = "ContentEncryption";
})(EBMLId || (EBMLId = {}));
const LEVEL_0_EBML_IDS = [
  EBMLId.EBML,
  EBMLId.Segment
];
const LEVEL_1_EBML_IDS = [
  EBMLId.SeekHead,
  EBMLId.Info,
  EBMLId.Cluster,
  EBMLId.Tracks,
  EBMLId.Cues,
  EBMLId.Attachments,
  EBMLId.Chapters,
  EBMLId.Tags
];
const LEVEL_0_AND_1_EBML_IDS = [
  ...LEVEL_0_EBML_IDS,
  ...LEVEL_1_EBML_IDS
];
const MAX_VAR_INT_SIZE = 8;
const MIN_HEADER_SIZE = 2;
const MAX_HEADER_SIZE = 2 * MAX_VAR_INT_SIZE;
const readVarIntSize = (slice) => {
  if (slice.remainingLength < 1) {
    return null;
  }
  const firstByte = readU8(slice);
  slice.skip(-1);
  if (firstByte === 0) {
    return null;
  }
  let width = 1;
  let mask = 128;
  while ((firstByte & mask) === 0) {
    width++;
    mask >>= 1;
  }
  if (slice.remainingLength < width) {
    return null;
  }
  return width;
};
const readVarInt = (slice) => {
  if (slice.remainingLength < 1) {
    return null;
  }
  const firstByte = readU8(slice);
  if (firstByte === 0) {
    return null;
  }
  let width = 1;
  let mask = 1 << 7;
  while ((firstByte & mask) === 0) {
    width++;
    mask >>= 1;
  }
  if (slice.remainingLength < width - 1) {
    return null;
  }
  let value = firstByte & mask - 1;
  for (let i = 1; i < width; i++) {
    value *= 1 << 8;
    value += readU8(slice);
  }
  return value;
};
const readUnsignedInt = (slice, width) => {
  if (width < 1 || width > 8) {
    throw new Error("Bad unsigned int size " + width);
  }
  let value = 0;
  for (let i = 0; i < width; i++) {
    value *= 1 << 8;
    value += readU8(slice);
  }
  return value;
};
const readUnsignedBigInt = (slice, width) => {
  if (width < 1) {
    throw new Error("Bad unsigned int size " + width);
  }
  let value = 0n;
  for (let i = 0; i < width; i++) {
    value <<= 8n;
    value += BigInt(readU8(slice));
  }
  return value;
};
const readElementId = (slice) => {
  const size = readVarIntSize(slice);
  if (size === null) {
    return null;
  }
  if (slice.remainingLength < size) {
    return null;
  }
  const id = readUnsignedInt(slice, size);
  return id;
};
const readElementSize = (slice) => {
  if (slice.remainingLength < 1) {
    return null;
  }
  const firstByte = readU8(slice);
  if (firstByte === 255) {
    return void 0;
  }
  slice.skip(-1);
  const size = readVarInt(slice);
  if (size === null) {
    return null;
  }
  if (size === 72057594037927940) {
    return void 0;
  }
  return size;
};
const readElementHeader = (slice) => {
  assert(slice.remainingLength >= MIN_HEADER_SIZE);
  const id = readElementId(slice);
  if (id === null) {
    return null;
  }
  const size = readElementSize(slice);
  if (size === null) {
    return null;
  }
  return { id, size };
};
const readAsciiString = (slice, length) => {
  const bytes = readBytes(slice, length);
  let strLength = 0;
  while (strLength < length && bytes[strLength] !== 0) {
    strLength += 1;
  }
  return String.fromCharCode(...bytes.subarray(0, strLength));
};
const readUnicodeString = (slice, length) => {
  const bytes = readBytes(slice, length);
  let strLength = 0;
  while (strLength < length && bytes[strLength] !== 0) {
    strLength += 1;
  }
  return textDecoder.decode(bytes.subarray(0, strLength));
};
const readFloat = (slice, width) => {
  if (width === 0) {
    return 0;
  }
  if (width !== 4 && width !== 8) {
    throw new Error("Bad float size " + width);
  }
  return width === 4 ? readF32Be(slice) : readF64Be(slice);
};
const searchForNextElementId = async (reader, startPos, ids, until) => {
  const idsSet = new Set(ids);
  let currentPos = startPos;
  while (until === null || currentPos < until) {
    let slice = reader.requestSliceRange(currentPos, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      break;
    const elementHeader = readElementHeader(slice);
    if (!elementHeader) {
      break;
    }
    if (idsSet.has(elementHeader.id)) {
      return { pos: currentPos, found: true };
    }
    assertDefinedSize(elementHeader.size);
    currentPos = slice.filePos + elementHeader.size;
  }
  return { pos: until !== null && until > currentPos ? until : currentPos, found: false };
};
const resync = async (reader, startPos, ids, until) => {
  const CHUNK_SIZE = 2 ** 16;
  const idsSet = new Set(ids);
  let currentPos = startPos;
  while (currentPos < until) {
    let slice = reader.requestSliceRange(currentPos, 0, Math.min(CHUNK_SIZE, until - currentPos));
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      break;
    if (slice.length < MAX_VAR_INT_SIZE)
      break;
    for (let i = 0; i < slice.length - MAX_VAR_INT_SIZE; i++) {
      slice.filePos = currentPos;
      const elementId = readElementId(slice);
      if (elementId !== null && idsSet.has(elementId)) {
        return currentPos;
      }
      currentPos++;
    }
  }
  return null;
};
const CODEC_STRING_MAP = {
  "avc": "V_MPEG4/ISO/AVC",
  "hevc": "V_MPEGH/ISO/HEVC",
  "vp8": "V_VP8",
  "vp9": "V_VP9",
  "av1": "V_AV1",
  "aac": "A_AAC",
  "mp3": "A_MPEG/L3",
  "opus": "A_OPUS",
  "vorbis": "A_VORBIS",
  "flac": "A_FLAC"
};
function assertDefinedSize(size) {
  if (size === void 0) {
    throw new Error("Undefined element size is used in a place where it is not supported.");
  }
}
const buildMatroskaMimeType = (info) => {
  const base = info.hasVideo ? "video/" : info.hasAudio ? "audio/" : "application/";
  let string = base + (info.isWebM ? "webm" : "x-matroska");
  if (info.codecStrings.length > 0) {
    const uniqueCodecMimeTypes = [...new Set(info.codecStrings.filter(Boolean))];
    string += `; codecs="${uniqueCodecMimeTypes.join(", ")}"`;
  }
  return string;
};
var BlockLacing;
(function(BlockLacing2) {
  BlockLacing2[BlockLacing2["None"] = 0] = "None";
  BlockLacing2[BlockLacing2["Xiph"] = 1] = "Xiph";
  BlockLacing2[BlockLacing2["FixedSize"] = 2] = "FixedSize";
  BlockLacing2[BlockLacing2["Ebml"] = 3] = "Ebml";
})(BlockLacing || (BlockLacing = {}));
var ContentEncodingScope;
(function(ContentEncodingScope2) {
  ContentEncodingScope2[ContentEncodingScope2["Block"] = 1] = "Block";
  ContentEncodingScope2[ContentEncodingScope2["Private"] = 2] = "Private";
  ContentEncodingScope2[ContentEncodingScope2["Next"] = 4] = "Next";
})(ContentEncodingScope || (ContentEncodingScope = {}));
var ContentCompAlgo;
(function(ContentCompAlgo2) {
  ContentCompAlgo2[ContentCompAlgo2["Zlib"] = 0] = "Zlib";
  ContentCompAlgo2[ContentCompAlgo2["Bzlib"] = 1] = "Bzlib";
  ContentCompAlgo2[ContentCompAlgo2["lzo1x"] = 2] = "lzo1x";
  ContentCompAlgo2[ContentCompAlgo2["HeaderStripping"] = 3] = "HeaderStripping";
})(ContentCompAlgo || (ContentCompAlgo = {}));
const METADATA_ELEMENTS = [
  { id: EBMLId.SeekHead, flag: "seekHeadSeen" },
  { id: EBMLId.Info, flag: "infoSeen" },
  { id: EBMLId.Tracks, flag: "tracksSeen" },
  { id: EBMLId.Cues, flag: "cuesSeen" }
];
const MAX_RESYNC_LENGTH = 10 * 2 ** 20;
class MatroskaDemuxer extends Demuxer {
  constructor(input) {
    super(input);
    this.readMetadataPromise = null;
    this.segments = [];
    this.currentSegment = null;
    this.currentTrack = null;
    this.currentCluster = null;
    this.currentBlock = null;
    this.currentBlockAdditional = null;
    this.currentCueTime = null;
    this.currentDecodingInstruction = null;
    this.currentTagTargetIsMovie = true;
    this.currentSimpleTagName = null;
    this.currentAttachedFile = null;
    this.isWebM = false;
    this.reader = input._reader;
  }
  async computeDuration() {
    const tracks = await this.getTracks();
    const trackDurations = await Promise.all(tracks.map((x) => x.computeDuration()));
    return Math.max(0, ...trackDurations);
  }
  async getTracks() {
    await this.readMetadata();
    return this.segments.flatMap((segment) => segment.tracks.map((track) => track.inputTrack));
  }
  async getMimeType() {
    await this.readMetadata();
    const tracks = await this.getTracks();
    const codecStrings = await Promise.all(tracks.map((x) => x.getCodecParameterString()));
    return buildMatroskaMimeType({
      isWebM: this.isWebM,
      hasVideo: this.segments.some((segment) => segment.tracks.some((x) => x.info?.type === "video")),
      hasAudio: this.segments.some((segment) => segment.tracks.some((x) => x.info?.type === "audio")),
      codecStrings: codecStrings.filter(Boolean)
    });
  }
  async getMetadataTags() {
    await this.readMetadata();
    for (const segment of this.segments) {
      if (!segment.metadataTagsCollected) {
        if (this.reader.fileSize !== null) {
          await this.loadSegmentMetadata(segment);
        }
        segment.metadataTagsCollected = true;
      }
    }
    let metadataTags = {};
    for (const segment of this.segments) {
      metadataTags = { ...metadataTags, ...segment.metadataTags };
    }
    return metadataTags;
  }
  readMetadata() {
    return this.readMetadataPromise ?? (this.readMetadataPromise = (async () => {
      let currentPos = 0;
      while (true) {
        let slice = this.reader.requestSliceRange(currentPos, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
        if (slice instanceof Promise)
          slice = await slice;
        if (!slice)
          break;
        const header = readElementHeader(slice);
        if (!header) {
          break;
        }
        const id = header.id;
        let size = header.size;
        const dataStartPos = slice.filePos;
        if (id === EBMLId.EBML) {
          assertDefinedSize(size);
          let slice2 = this.reader.requestSlice(dataStartPos, size);
          if (slice2 instanceof Promise)
            slice2 = await slice2;
          if (!slice2)
            break;
          this.readContiguousElements(slice2);
        } else if (id === EBMLId.Segment) {
          await this.readSegment(dataStartPos, size);
          if (size === void 0) {
            break;
          }
          if (this.reader.fileSize === null) {
            break;
          }
        } else if (id === EBMLId.Cluster) {
          if (this.reader.fileSize === null) {
            break;
          }
          if (size === void 0) {
            const nextElementPos = await searchForNextElementId(this.reader, dataStartPos, LEVEL_0_AND_1_EBML_IDS, this.reader.fileSize);
            size = nextElementPos.pos - dataStartPos;
          }
          const lastSegment = last(this.segments);
          if (lastSegment) {
            lastSegment.elementEndPos = dataStartPos + size;
          }
        }
        assertDefinedSize(size);
        currentPos = dataStartPos + size;
      }
    })());
  }
  async readSegment(segmentDataStart, dataSize) {
    this.currentSegment = {
      seekHeadSeen: false,
      infoSeen: false,
      tracksSeen: false,
      cuesSeen: false,
      tagsSeen: false,
      attachmentsSeen: false,
      timestampScale: -1,
      timestampFactor: -1,
      duration: -1,
      seekEntries: [],
      tracks: [],
      cuePoints: [],
      dataStartPos: segmentDataStart,
      elementEndPos: dataSize === void 0 ? null : segmentDataStart + dataSize,
      clusterSeekStartPos: segmentDataStart,
      lastReadCluster: null,
      metadataTags: {},
      metadataTagsCollected: false
    };
    this.segments.push(this.currentSegment);
    let currentPos = segmentDataStart;
    while (this.currentSegment.elementEndPos === null || currentPos < this.currentSegment.elementEndPos) {
      let slice = this.reader.requestSliceRange(currentPos, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice)
        break;
      const elementStartPos = currentPos;
      const header = readElementHeader(slice);
      if (!header || !LEVEL_1_EBML_IDS.includes(header.id) && header.id !== EBMLId.Void) {
        const nextPos = await resync(this.reader, elementStartPos, LEVEL_1_EBML_IDS, Math.min(this.currentSegment.elementEndPos ?? Infinity, elementStartPos + MAX_RESYNC_LENGTH));
        if (nextPos) {
          currentPos = nextPos;
          continue;
        } else {
          break;
        }
      }
      const { id, size } = header;
      const dataStartPos = slice.filePos;
      const metadataElementIndex = METADATA_ELEMENTS.findIndex((x) => x.id === id);
      if (metadataElementIndex !== -1) {
        const field = METADATA_ELEMENTS[metadataElementIndex].flag;
        this.currentSegment[field] = true;
        assertDefinedSize(size);
        let slice2 = this.reader.requestSlice(dataStartPos, size);
        if (slice2 instanceof Promise)
          slice2 = await slice2;
        if (slice2) {
          this.readContiguousElements(slice2);
        }
      } else if (id === EBMLId.Tags || id === EBMLId.Attachments) {
        if (id === EBMLId.Tags) {
          this.currentSegment.tagsSeen = true;
        } else {
          this.currentSegment.attachmentsSeen = true;
        }
        assertDefinedSize(size);
        let slice2 = this.reader.requestSlice(dataStartPos, size);
        if (slice2 instanceof Promise)
          slice2 = await slice2;
        if (slice2) {
          this.readContiguousElements(slice2);
        }
      } else if (id === EBMLId.Cluster) {
        this.currentSegment.clusterSeekStartPos = elementStartPos;
        break;
      }
      if (size === void 0) {
        break;
      } else {
        currentPos = dataStartPos + size;
      }
    }
    this.currentSegment.seekEntries.sort((a, b) => a.segmentPosition - b.segmentPosition);
    if (this.reader.fileSize !== null) {
      for (const seekEntry of this.currentSegment.seekEntries) {
        const target = METADATA_ELEMENTS.find((x) => x.id === seekEntry.id);
        if (!target) {
          continue;
        }
        if (this.currentSegment[target.flag])
          continue;
        let slice = this.reader.requestSliceRange(segmentDataStart + seekEntry.segmentPosition, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
        if (slice instanceof Promise)
          slice = await slice;
        if (!slice)
          continue;
        const header = readElementHeader(slice);
        if (!header)
          continue;
        const { id, size } = header;
        if (id !== target.id)
          continue;
        assertDefinedSize(size);
        this.currentSegment[target.flag] = true;
        let dataSlice = this.reader.requestSlice(slice.filePos, size);
        if (dataSlice instanceof Promise)
          dataSlice = await dataSlice;
        if (!dataSlice)
          continue;
        this.readContiguousElements(dataSlice);
      }
    }
    if (this.currentSegment.timestampScale === -1) {
      this.currentSegment.timestampScale = 1e6;
      this.currentSegment.timestampFactor = 1e9 / 1e6;
    }
    for (const track of this.currentSegment.tracks) {
      if (track.defaultDurationNs !== null) {
        track.defaultDuration = this.currentSegment.timestampFactor * track.defaultDurationNs / 1e9;
      }
    }
    this.currentSegment.tracks.sort((a, b) => Number(b.disposition.default) - Number(a.disposition.default));
    const idToTrack = new Map(this.currentSegment.tracks.map((x) => [x.id, x]));
    for (const cuePoint of this.currentSegment.cuePoints) {
      const track = idToTrack.get(cuePoint.trackId);
      if (track) {
        track.cuePoints.push(cuePoint);
      }
    }
    for (const track of this.currentSegment.tracks) {
      track.cuePoints.sort((a, b) => a.time - b.time);
      for (let i = 0; i < track.cuePoints.length - 1; i++) {
        const cuePoint1 = track.cuePoints[i];
        const cuePoint2 = track.cuePoints[i + 1];
        if (cuePoint1.time === cuePoint2.time) {
          track.cuePoints.splice(i + 1, 1);
          i--;
        }
      }
    }
    let trackWithMostCuePoints = null;
    let maxCuePointCount = -Infinity;
    for (const track of this.currentSegment.tracks) {
      if (track.cuePoints.length > maxCuePointCount) {
        maxCuePointCount = track.cuePoints.length;
        trackWithMostCuePoints = track;
      }
    }
    for (const track of this.currentSegment.tracks) {
      if (track.cuePoints.length === 0) {
        track.cuePoints = trackWithMostCuePoints.cuePoints;
      }
    }
    this.currentSegment = null;
  }
  async readCluster(startPos, segment) {
    if (segment.lastReadCluster?.elementStartPos === startPos) {
      return segment.lastReadCluster;
    }
    let headerSlice = this.reader.requestSliceRange(startPos, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
    if (headerSlice instanceof Promise)
      headerSlice = await headerSlice;
    assert(headerSlice);
    const elementStartPos = startPos;
    const elementHeader = readElementHeader(headerSlice);
    assert(elementHeader);
    const id = elementHeader.id;
    assert(id === EBMLId.Cluster);
    let size = elementHeader.size;
    const dataStartPos = headerSlice.filePos;
    if (size === void 0) {
      const nextElementPos = await searchForNextElementId(this.reader, dataStartPos, LEVEL_0_AND_1_EBML_IDS, segment.elementEndPos);
      size = nextElementPos.pos - dataStartPos;
    }
    let dataSlice = this.reader.requestSlice(dataStartPos, size);
    if (dataSlice instanceof Promise)
      dataSlice = await dataSlice;
    const cluster = {
      segment,
      elementStartPos,
      elementEndPos: dataStartPos + size,
      dataStartPos,
      timestamp: -1,
      trackData: /* @__PURE__ */ new Map()
    };
    this.currentCluster = cluster;
    if (dataSlice) {
      const endPos = this.readContiguousElements(dataSlice, LEVEL_0_AND_1_EBML_IDS);
      cluster.elementEndPos = endPos;
    }
    for (const [, trackData] of cluster.trackData) {
      const track = trackData.track;
      assert(trackData.blocks.length > 0);
      let hasLacedBlocks = false;
      for (let i = 0; i < trackData.blocks.length; i++) {
        const block = trackData.blocks[i];
        block.timestamp += cluster.timestamp;
        hasLacedBlocks || (hasLacedBlocks = block.lacing !== BlockLacing.None);
      }
      trackData.presentationTimestamps = trackData.blocks.map((block, i) => ({ timestamp: block.timestamp, blockIndex: i })).sort((a, b) => a.timestamp - b.timestamp);
      for (let i = 0; i < trackData.presentationTimestamps.length; i++) {
        const currentEntry = trackData.presentationTimestamps[i];
        const currentBlock = trackData.blocks[currentEntry.blockIndex];
        if (trackData.firstKeyFrameTimestamp === null && currentBlock.isKeyFrame) {
          trackData.firstKeyFrameTimestamp = currentBlock.timestamp;
        }
        if (i < trackData.presentationTimestamps.length - 1) {
          const nextEntry = trackData.presentationTimestamps[i + 1];
          currentBlock.duration = nextEntry.timestamp - currentBlock.timestamp;
        } else if (currentBlock.duration === 0) {
          if (track.defaultDuration != null) {
            if (currentBlock.lacing === BlockLacing.None) {
              currentBlock.duration = track.defaultDuration;
            }
          }
        }
      }
      if (hasLacedBlocks) {
        this.expandLacedBlocks(trackData.blocks, track);
        trackData.presentationTimestamps = trackData.blocks.map((block, i) => ({ timestamp: block.timestamp, blockIndex: i })).sort((a, b) => a.timestamp - b.timestamp);
      }
      const firstBlock = trackData.blocks[trackData.presentationTimestamps[0].blockIndex];
      const lastBlock = trackData.blocks[last(trackData.presentationTimestamps).blockIndex];
      trackData.startTimestamp = firstBlock.timestamp;
      trackData.endTimestamp = lastBlock.timestamp + lastBlock.duration;
      const insertionIndex = binarySearchLessOrEqual(track.clusterPositionCache, trackData.startTimestamp, (x) => x.startTimestamp);
      if (insertionIndex === -1 || track.clusterPositionCache[insertionIndex].elementStartPos !== elementStartPos) {
        track.clusterPositionCache.splice(insertionIndex + 1, 0, {
          elementStartPos: cluster.elementStartPos,
          startTimestamp: trackData.startTimestamp
        });
      }
    }
    segment.lastReadCluster = cluster;
    return cluster;
  }
  getTrackDataInCluster(cluster, trackNumber) {
    let trackData = cluster.trackData.get(trackNumber);
    if (!trackData) {
      const track = cluster.segment.tracks.find((x) => x.id === trackNumber);
      if (!track) {
        return null;
      }
      trackData = {
        track,
        startTimestamp: 0,
        endTimestamp: 0,
        firstKeyFrameTimestamp: null,
        blocks: [],
        presentationTimestamps: []
      };
      cluster.trackData.set(trackNumber, trackData);
    }
    return trackData;
  }
  expandLacedBlocks(blocks, track) {
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
      const originalBlock = blocks[blockIndex];
      if (originalBlock.lacing === BlockLacing.None) {
        continue;
      }
      if (!originalBlock.decoded) {
        originalBlock.data = this.decodeBlockData(track, originalBlock.data);
        originalBlock.decoded = true;
      }
      const slice = FileSlice.tempFromBytes(originalBlock.data);
      const frameSizes = [];
      const frameCount = readU8(slice) + 1;
      switch (originalBlock.lacing) {
        case BlockLacing.Xiph:
          {
            let totalUsedSize = 0;
            for (let i = 0; i < frameCount - 1; i++) {
              let frameSize = 0;
              while (slice.bufferPos < slice.length) {
                const value = readU8(slice);
                frameSize += value;
                if (value < 255) {
                  frameSizes.push(frameSize);
                  totalUsedSize += frameSize;
                  break;
                }
              }
            }
            frameSizes.push(slice.length - (slice.bufferPos + totalUsedSize));
          }
          break;
        case BlockLacing.FixedSize:
          {
            const totalDataSize = slice.length - 1;
            const frameSize = Math.floor(totalDataSize / frameCount);
            for (let i = 0; i < frameCount; i++) {
              frameSizes.push(frameSize);
            }
          }
          break;
        case BlockLacing.Ebml:
          {
            const firstResult = readVarInt(slice);
            assert(firstResult !== null);
            let currentSize = firstResult;
            frameSizes.push(currentSize);
            let totalUsedSize = currentSize;
            for (let i = 1; i < frameCount - 1; i++) {
              const startPos = slice.bufferPos;
              const diffResult = readVarInt(slice);
              assert(diffResult !== null);
              const unsignedDiff = diffResult;
              const width = slice.bufferPos - startPos;
              const bias = (1 << width * 7 - 1) - 1;
              const diff = unsignedDiff - bias;
              currentSize += diff;
              frameSizes.push(currentSize);
              totalUsedSize += currentSize;
            }
            frameSizes.push(slice.length - (slice.bufferPos + totalUsedSize));
          }
          break;
        default:
          assert(false);
      }
      assert(frameSizes.length === frameCount);
      blocks.splice(blockIndex, 1);
      const blockDuration = originalBlock.duration || frameCount * (track.defaultDuration ?? 0);
      for (let i = 0; i < frameCount; i++) {
        const frameSize = frameSizes[i];
        const frameData = readBytes(slice, frameSize);
        const frameTimestamp = originalBlock.timestamp + blockDuration * i / frameCount;
        const frameDuration = blockDuration / frameCount;
        blocks.splice(blockIndex + i, 0, {
          timestamp: frameTimestamp,
          duration: frameDuration,
          isKeyFrame: originalBlock.isKeyFrame,
          data: frameData,
          lacing: BlockLacing.None,
          decoded: true,
          mainAdditional: originalBlock.mainAdditional
        });
      }
      blockIndex += frameCount;
      blockIndex--;
    }
  }
  async loadSegmentMetadata(segment) {
    for (const seekEntry of segment.seekEntries) {
      if (seekEntry.id === EBMLId.Tags && !segment.tagsSeen) ;
      else if (seekEntry.id === EBMLId.Attachments && !segment.attachmentsSeen) ;
      else {
        continue;
      }
      let slice = this.reader.requestSliceRange(segment.dataStartPos + seekEntry.segmentPosition, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice)
        continue;
      const header = readElementHeader(slice);
      if (!header || header.id !== seekEntry.id)
        continue;
      const { size } = header;
      assertDefinedSize(size);
      assert(!this.currentSegment);
      this.currentSegment = segment;
      let dataSlice = this.reader.requestSlice(slice.filePos, size);
      if (dataSlice instanceof Promise)
        dataSlice = await dataSlice;
      if (dataSlice) {
        this.readContiguousElements(dataSlice);
      }
      this.currentSegment = null;
      if (seekEntry.id === EBMLId.Tags) {
        segment.tagsSeen = true;
      } else if (seekEntry.id === EBMLId.Attachments) {
        segment.attachmentsSeen = true;
      }
    }
  }
  readContiguousElements(slice, stopIds) {
    while (slice.remainingLength >= MIN_HEADER_SIZE) {
      const startPos = slice.filePos;
      const foundElement = this.traverseElement(slice, stopIds);
      if (!foundElement) {
        return startPos;
      }
    }
    return slice.filePos;
  }
  traverseElement(slice, stopIds) {
    const header = readElementHeader(slice);
    if (!header) {
      return false;
    }
    if (stopIds && stopIds.includes(header.id)) {
      return false;
    }
    const { id, size } = header;
    const dataStartPos = slice.filePos;
    assertDefinedSize(size);
    switch (id) {
      case EBMLId.DocType:
        {
          this.isWebM = readAsciiString(slice, size) === "webm";
        }
        break;
      case EBMLId.Seek:
        {
          if (!this.currentSegment)
            break;
          const seekEntry = { id: -1, segmentPosition: -1 };
          this.currentSegment.seekEntries.push(seekEntry);
          this.readContiguousElements(slice.slice(dataStartPos, size));
          if (seekEntry.id === -1 || seekEntry.segmentPosition === -1) {
            this.currentSegment.seekEntries.pop();
          }
        }
        break;
      case EBMLId.SeekID:
        {
          const lastSeekEntry = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!lastSeekEntry)
            break;
          lastSeekEntry.id = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.SeekPosition:
        {
          const lastSeekEntry = this.currentSegment?.seekEntries[this.currentSegment.seekEntries.length - 1];
          if (!lastSeekEntry)
            break;
          lastSeekEntry.segmentPosition = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.TimestampScale:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.timestampScale = readUnsignedInt(slice, size);
          this.currentSegment.timestampFactor = 1e9 / this.currentSegment.timestampScale;
        }
        break;
      case EBMLId.Duration:
        {
          if (!this.currentSegment)
            break;
          this.currentSegment.duration = readFloat(slice, size);
        }
        break;
      case EBMLId.TrackEntry:
        {
          if (!this.currentSegment)
            break;
          this.currentTrack = {
            id: -1,
            segment: this.currentSegment,
            demuxer: this,
            clusterPositionCache: [],
            cuePoints: [],
            disposition: {
              ...DEFAULT_TRACK_DISPOSITION
            },
            inputTrack: null,
            codecId: null,
            codecPrivate: null,
            defaultDuration: null,
            defaultDurationNs: null,
            name: null,
            languageCode: UNDETERMINED_LANGUAGE,
            decodingInstructions: [],
            info: null
          };
          this.readContiguousElements(slice.slice(dataStartPos, size));
          if (!this.currentTrack) {
            break;
          }
          if (this.currentTrack.decodingInstructions.some((instruction) => {
            return instruction.data?.type !== "decompress" || instruction.scope !== ContentEncodingScope.Block || instruction.data.algorithm !== ContentCompAlgo.HeaderStripping;
          })) {
            console.warn(`Track #${this.currentTrack.id} has an unsupported content encoding; dropping.`);
            this.currentTrack = null;
          }
          if (this.currentTrack && this.currentTrack.id !== -1 && this.currentTrack.codecId && this.currentTrack.info) {
            const slashIndex = this.currentTrack.codecId.indexOf("/");
            const codecIdWithoutSuffix = slashIndex === -1 ? this.currentTrack.codecId : this.currentTrack.codecId.slice(0, slashIndex);
            if (this.currentTrack.info.type === "video" && this.currentTrack.info.width !== -1 && this.currentTrack.info.height !== -1) {
              if (this.currentTrack.codecId === CODEC_STRING_MAP.avc) {
                this.currentTrack.info.codec = "avc";
                this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
              } else if (this.currentTrack.codecId === CODEC_STRING_MAP.hevc) {
                this.currentTrack.info.codec = "hevc";
                this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
              } else if (codecIdWithoutSuffix === CODEC_STRING_MAP.vp8) {
                this.currentTrack.info.codec = "vp8";
              } else if (codecIdWithoutSuffix === CODEC_STRING_MAP.vp9) {
                this.currentTrack.info.codec = "vp9";
              } else if (codecIdWithoutSuffix === CODEC_STRING_MAP.av1) {
                this.currentTrack.info.codec = "av1";
              }
              const videoTrack = this.currentTrack;
              const inputTrack = new InputVideoTrack(this.input, new MatroskaVideoTrackBacking(videoTrack));
              this.currentTrack.inputTrack = inputTrack;
              this.currentSegment.tracks.push(this.currentTrack);
            } else if (this.currentTrack.info.type === "audio" && this.currentTrack.info.numberOfChannels !== -1 && this.currentTrack.info.sampleRate !== -1) {
              if (codecIdWithoutSuffix === CODEC_STRING_MAP.aac) {
                this.currentTrack.info.codec = "aac";
                this.currentTrack.info.aacCodecInfo = {
                  isMpeg2: this.currentTrack.codecId.includes("MPEG2")
                };
                this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
              } else if (this.currentTrack.codecId === CODEC_STRING_MAP.mp3) {
                this.currentTrack.info.codec = "mp3";
              } else if (codecIdWithoutSuffix === CODEC_STRING_MAP.opus) {
                this.currentTrack.info.codec = "opus";
                this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
                this.currentTrack.info.sampleRate = OPUS_SAMPLE_RATE;
              } else if (codecIdWithoutSuffix === CODEC_STRING_MAP.vorbis) {
                this.currentTrack.info.codec = "vorbis";
                this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
              } else if (codecIdWithoutSuffix === CODEC_STRING_MAP.flac) {
                this.currentTrack.info.codec = "flac";
                this.currentTrack.info.codecDescription = this.currentTrack.codecPrivate;
              } else if (this.currentTrack.codecId === "A_PCM/INT/LIT") {
                if (this.currentTrack.info.bitDepth === 8) {
                  this.currentTrack.info.codec = "pcm-u8";
                } else if (this.currentTrack.info.bitDepth === 16) {
                  this.currentTrack.info.codec = "pcm-s16";
                } else if (this.currentTrack.info.bitDepth === 24) {
                  this.currentTrack.info.codec = "pcm-s24";
                } else if (this.currentTrack.info.bitDepth === 32) {
                  this.currentTrack.info.codec = "pcm-s32";
                }
              } else if (this.currentTrack.codecId === "A_PCM/INT/BIG") {
                if (this.currentTrack.info.bitDepth === 8) {
                  this.currentTrack.info.codec = "pcm-u8";
                } else if (this.currentTrack.info.bitDepth === 16) {
                  this.currentTrack.info.codec = "pcm-s16be";
                } else if (this.currentTrack.info.bitDepth === 24) {
                  this.currentTrack.info.codec = "pcm-s24be";
                } else if (this.currentTrack.info.bitDepth === 32) {
                  this.currentTrack.info.codec = "pcm-s32be";
                }
              } else if (this.currentTrack.codecId === "A_PCM/FLOAT/IEEE") {
                if (this.currentTrack.info.bitDepth === 32) {
                  this.currentTrack.info.codec = "pcm-f32";
                } else if (this.currentTrack.info.bitDepth === 64) {
                  this.currentTrack.info.codec = "pcm-f64";
                }
              }
              const audioTrack = this.currentTrack;
              const inputTrack = new InputAudioTrack(this.input, new MatroskaAudioTrackBacking(audioTrack));
              this.currentTrack.inputTrack = inputTrack;
              this.currentSegment.tracks.push(this.currentTrack);
            }
          }
          this.currentTrack = null;
        }
        break;
      case EBMLId.TrackNumber:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.id = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.TrackType:
        {
          if (!this.currentTrack)
            break;
          const type = readUnsignedInt(slice, size);
          if (type === 1) {
            this.currentTrack.info = {
              type: "video",
              width: -1,
              height: -1,
              rotation: 0,
              codec: null,
              codecDescription: null,
              colorSpace: null,
              alphaMode: false
            };
          } else if (type === 2) {
            this.currentTrack.info = {
              type: "audio",
              numberOfChannels: -1,
              sampleRate: -1,
              bitDepth: -1,
              codec: null,
              codecDescription: null,
              aacCodecInfo: null
            };
          }
        }
        break;
      case EBMLId.FlagEnabled:
        {
          if (!this.currentTrack)
            break;
          const enabled = readUnsignedInt(slice, size);
          if (!enabled) {
            this.currentTrack = null;
          }
        }
        break;
      case EBMLId.FlagDefault:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.default = !!readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.FlagForced:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.forced = !!readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.FlagOriginal:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.original = !!readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.FlagHearingImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.hearingImpaired = !!readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.FlagVisualImpaired:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.visuallyImpaired = !!readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.FlagCommentary:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.disposition.commentary = !!readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.CodecID:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecId = readAsciiString(slice, size);
        }
        break;
      case EBMLId.CodecPrivate:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.codecPrivate = readBytes(slice, size);
        }
        break;
      case EBMLId.DefaultDuration:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.defaultDurationNs = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.Name:
        {
          if (!this.currentTrack)
            break;
          this.currentTrack.name = readUnicodeString(slice, size);
        }
        break;
      case EBMLId.Language:
        {
          if (!this.currentTrack)
            break;
          if (this.currentTrack.languageCode !== UNDETERMINED_LANGUAGE) {
            break;
          }
          this.currentTrack.languageCode = readAsciiString(slice, size);
          if (!isIso639Dash2LanguageCode(this.currentTrack.languageCode)) {
            this.currentTrack.languageCode = UNDETERMINED_LANGUAGE;
          }
        }
        break;
      case EBMLId.LanguageBCP47:
        {
          if (!this.currentTrack)
            break;
          const bcp47 = readAsciiString(slice, size);
          const languageSubtag = bcp47.split("-")[0];
          if (languageSubtag) {
            this.currentTrack.languageCode = languageSubtag;
          } else {
            this.currentTrack.languageCode = UNDETERMINED_LANGUAGE;
          }
        }
        break;
      case EBMLId.Video:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.PixelWidth:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.width = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.PixelHeight:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.height = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.AlphaMode:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.alphaMode = readUnsignedInt(slice, size) === 1;
        }
        break;
      case EBMLId.Colour:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.currentTrack.info.colorSpace = {};
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.MatrixCoefficients:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const matrixCoefficients = readUnsignedInt(slice, size);
          const mapped = MATRIX_COEFFICIENTS_MAP_INVERSE[matrixCoefficients] ?? null;
          this.currentTrack.info.colorSpace.matrix = mapped;
        }
        break;
      case EBMLId.Range:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          this.currentTrack.info.colorSpace.fullRange = readUnsignedInt(slice, size) === 2;
        }
        break;
      case EBMLId.TransferCharacteristics:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const transferCharacteristics = readUnsignedInt(slice, size);
          const mapped = TRANSFER_CHARACTERISTICS_MAP_INVERSE[transferCharacteristics] ?? null;
          this.currentTrack.info.colorSpace.transfer = mapped;
        }
        break;
      case EBMLId.Primaries:
        {
          if (this.currentTrack?.info?.type !== "video" || !this.currentTrack.info.colorSpace)
            break;
          const primaries = readUnsignedInt(slice, size);
          const mapped = COLOR_PRIMARIES_MAP_INVERSE[primaries] ?? null;
          this.currentTrack.info.colorSpace.primaries = mapped;
        }
        break;
      case EBMLId.Projection:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.ProjectionPoseRoll:
        {
          if (this.currentTrack?.info?.type !== "video")
            break;
          const rotation = readFloat(slice, size);
          const flippedRotation = -rotation;
          try {
            this.currentTrack.info.rotation = normalizeRotation(flippedRotation);
          } catch {
          }
        }
        break;
      case EBMLId.Audio:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.SamplingFrequency:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.sampleRate = readFloat(slice, size);
        }
        break;
      case EBMLId.Channels:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.numberOfChannels = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.BitDepth:
        {
          if (this.currentTrack?.info?.type !== "audio")
            break;
          this.currentTrack.info.bitDepth = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.CuePoint:
        {
          if (!this.currentSegment)
            break;
          this.readContiguousElements(slice.slice(dataStartPos, size));
          this.currentCueTime = null;
        }
        break;
      case EBMLId.CueTime:
        {
          this.currentCueTime = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.CueTrackPositions:
        {
          if (this.currentCueTime === null)
            break;
          assert(this.currentSegment);
          const cuePoint = { time: this.currentCueTime, trackId: -1, clusterPosition: -1 };
          this.currentSegment.cuePoints.push(cuePoint);
          this.readContiguousElements(slice.slice(dataStartPos, size));
          if (cuePoint.trackId === -1 || cuePoint.clusterPosition === -1) {
            this.currentSegment.cuePoints.pop();
          }
        }
        break;
      case EBMLId.CueTrack:
        {
          const lastCuePoint = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!lastCuePoint)
            break;
          lastCuePoint.trackId = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.CueClusterPosition:
        {
          const lastCuePoint = this.currentSegment?.cuePoints[this.currentSegment.cuePoints.length - 1];
          if (!lastCuePoint)
            break;
          assert(this.currentSegment);
          lastCuePoint.clusterPosition = this.currentSegment.dataStartPos + readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.Timestamp:
        {
          if (!this.currentCluster)
            break;
          this.currentCluster.timestamp = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.SimpleBlock:
        {
          if (!this.currentCluster)
            break;
          const trackNumber = readVarInt(slice);
          if (trackNumber === null)
            break;
          const trackData = this.getTrackDataInCluster(this.currentCluster, trackNumber);
          if (!trackData)
            break;
          const relativeTimestamp = readI16Be(slice);
          const flags = readU8(slice);
          const lacing = flags >> 1 & 3;
          let isKeyFrame = !!(flags & 128);
          if (trackData.track.info?.type === "audio" && trackData.track.info.codec) {
            isKeyFrame = true;
          }
          const blockData = readBytes(slice, size - (slice.filePos - dataStartPos));
          const hasDecodingInstructions = trackData.track.decodingInstructions.length > 0;
          trackData.blocks.push({
            timestamp: relativeTimestamp,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame,
            data: blockData,
            lacing,
            decoded: !hasDecodingInstructions,
            mainAdditional: null
          });
        }
        break;
      case EBMLId.BlockGroup:
        {
          if (!this.currentCluster)
            break;
          this.readContiguousElements(slice.slice(dataStartPos, size));
          this.currentBlock = null;
        }
        break;
      case EBMLId.Block:
        {
          if (!this.currentCluster)
            break;
          const trackNumber = readVarInt(slice);
          if (trackNumber === null)
            break;
          const trackData = this.getTrackDataInCluster(this.currentCluster, trackNumber);
          if (!trackData)
            break;
          const relativeTimestamp = readI16Be(slice);
          const flags = readU8(slice);
          const lacing = flags >> 1 & 3;
          const blockData = readBytes(slice, size - (slice.filePos - dataStartPos));
          const hasDecodingInstructions = trackData.track.decodingInstructions.length > 0;
          this.currentBlock = {
            timestamp: relativeTimestamp,
            // We'll add the cluster's timestamp to this later
            duration: 0,
            // Will set later
            isKeyFrame: true,
            data: blockData,
            lacing,
            decoded: !hasDecodingInstructions,
            mainAdditional: null
          };
          trackData.blocks.push(this.currentBlock);
        }
        break;
      case EBMLId.BlockAdditions:
        {
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.BlockMore:
        {
          if (!this.currentBlock)
            break;
          this.currentBlockAdditional = {
            addId: 1,
            data: null
          };
          this.readContiguousElements(slice.slice(dataStartPos, size));
          if (this.currentBlockAdditional.data && this.currentBlockAdditional.addId === 1) {
            this.currentBlock.mainAdditional = this.currentBlockAdditional.data;
          }
          this.currentBlockAdditional = null;
        }
        break;
      case EBMLId.BlockAdditional:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.data = readBytes(slice, size);
        }
        break;
      case EBMLId.BlockAddID:
        {
          if (!this.currentBlockAdditional)
            break;
          this.currentBlockAdditional.addId = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.BlockDuration:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.duration = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.ReferenceBlock:
        {
          if (!this.currentBlock)
            break;
          this.currentBlock.isKeyFrame = false;
        }
        break;
      case EBMLId.Tag:
        {
          this.currentTagTargetIsMovie = true;
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.Targets:
        {
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.TargetTypeValue:
        {
          const targetTypeValue = readUnsignedInt(slice, size);
          if (targetTypeValue !== 50) {
            this.currentTagTargetIsMovie = false;
          }
        }
        break;
      case EBMLId.TagTrackUID:
      case EBMLId.TagEditionUID:
      case EBMLId.TagChapterUID:
      case EBMLId.TagAttachmentUID:
        {
          this.currentTagTargetIsMovie = false;
        }
        break;
      case EBMLId.SimpleTag:
        {
          if (!this.currentTagTargetIsMovie)
            break;
          this.currentSimpleTagName = null;
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.TagName:
        {
          this.currentSimpleTagName = readUnicodeString(slice, size);
        }
        break;
      case EBMLId.TagString:
        {
          if (!this.currentSimpleTagName)
            break;
          const value = readUnicodeString(slice, size);
          this.processTagValue(this.currentSimpleTagName, value);
        }
        break;
      case EBMLId.TagBinary:
        {
          if (!this.currentSimpleTagName)
            break;
          const value = readBytes(slice, size);
          this.processTagValue(this.currentSimpleTagName, value);
        }
        break;
      case EBMLId.AttachedFile:
        {
          if (!this.currentSegment)
            break;
          this.currentAttachedFile = {
            fileUid: null,
            fileName: null,
            fileMediaType: null,
            fileData: null,
            fileDescription: null
          };
          this.readContiguousElements(slice.slice(dataStartPos, size));
          const tags = this.currentSegment.metadataTags;
          if (this.currentAttachedFile.fileUid && this.currentAttachedFile.fileData) {
            tags.raw ?? (tags.raw = {});
            tags.raw[this.currentAttachedFile.fileUid.toString()] = new AttachedFile(this.currentAttachedFile.fileData, this.currentAttachedFile.fileMediaType ?? void 0, this.currentAttachedFile.fileName ?? void 0, this.currentAttachedFile.fileDescription ?? void 0);
          }
          if (this.currentAttachedFile.fileMediaType?.startsWith("image/") && this.currentAttachedFile.fileData) {
            const fileName = this.currentAttachedFile.fileName;
            let kind = "unknown";
            if (fileName) {
              const lowerName = fileName.toLowerCase();
              if (lowerName.startsWith("cover.")) {
                kind = "coverFront";
              } else if (lowerName.startsWith("back.")) {
                kind = "coverBack";
              }
            }
            tags.images ?? (tags.images = []);
            tags.images.push({
              data: this.currentAttachedFile.fileData,
              mimeType: this.currentAttachedFile.fileMediaType,
              kind,
              name: this.currentAttachedFile.fileName ?? void 0,
              description: this.currentAttachedFile.fileDescription ?? void 0
            });
          }
          this.currentAttachedFile = null;
        }
        break;
      case EBMLId.FileUID:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileUid = readUnsignedBigInt(slice, size);
        }
        break;
      case EBMLId.FileName:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileName = readUnicodeString(slice, size);
        }
        break;
      case EBMLId.FileMediaType:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileMediaType = readAsciiString(slice, size);
        }
        break;
      case EBMLId.FileData:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileData = readBytes(slice, size);
        }
        break;
      case EBMLId.FileDescription:
        {
          if (!this.currentAttachedFile)
            break;
          this.currentAttachedFile.fileDescription = readUnicodeString(slice, size);
        }
        break;
      case EBMLId.ContentEncodings:
        {
          if (!this.currentTrack)
            break;
          this.readContiguousElements(slice.slice(dataStartPos, size));
          this.currentTrack.decodingInstructions.sort((a, b) => b.order - a.order);
        }
        break;
      case EBMLId.ContentEncoding:
        {
          this.currentDecodingInstruction = {
            order: 0,
            scope: ContentEncodingScope.Block,
            data: null
          };
          this.readContiguousElements(slice.slice(dataStartPos, size));
          if (this.currentDecodingInstruction.data) {
            this.currentTrack.decodingInstructions.push(this.currentDecodingInstruction);
          }
          this.currentDecodingInstruction = null;
        }
        break;
      case EBMLId.ContentEncodingOrder:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.order = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.ContentEncodingScope:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.scope = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.ContentCompression:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.data = {
            type: "decompress",
            algorithm: ContentCompAlgo.Zlib,
            settings: null
          };
          this.readContiguousElements(slice.slice(dataStartPos, size));
        }
        break;
      case EBMLId.ContentCompAlgo:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.algorithm = readUnsignedInt(slice, size);
        }
        break;
      case EBMLId.ContentCompSettings:
        {
          if (this.currentDecodingInstruction?.data?.type !== "decompress")
            break;
          this.currentDecodingInstruction.data.settings = readBytes(slice, size);
        }
        break;
      case EBMLId.ContentEncryption:
        {
          if (!this.currentDecodingInstruction)
            break;
          this.currentDecodingInstruction.data = {
            type: "decrypt"
          };
        }
        break;
    }
    slice.filePos = dataStartPos + size;
    return true;
  }
  decodeBlockData(track, rawData) {
    assert(track.decodingInstructions.length > 0);
    let currentData = rawData;
    for (const instruction of track.decodingInstructions) {
      assert(instruction.data);
      switch (instruction.data.type) {
        case "decompress":
          {
            switch (instruction.data.algorithm) {
              case ContentCompAlgo.HeaderStripping:
                {
                  if (instruction.data.settings && instruction.data.settings.length > 0) {
                    const prefix = instruction.data.settings;
                    const newData = new Uint8Array(prefix.length + currentData.length);
                    newData.set(prefix, 0);
                    newData.set(currentData, prefix.length);
                    currentData = newData;
                  }
                }
                break;
            }
          }
          break;
      }
    }
    return currentData;
  }
  processTagValue(name, value) {
    var _a;
    if (!this.currentSegment?.metadataTags)
      return;
    const metadataTags = this.currentSegment.metadataTags;
    metadataTags.raw ?? (metadataTags.raw = {});
    (_a = metadataTags.raw)[name] ?? (_a[name] = value);
    if (typeof value === "string") {
      switch (name.toLowerCase()) {
        case "title":
          {
            metadataTags.title ?? (metadataTags.title = value);
          }
          break;
        case "description":
          {
            metadataTags.description ?? (metadataTags.description = value);
          }
          break;
        case "artist":
          {
            metadataTags.artist ?? (metadataTags.artist = value);
          }
          break;
        case "album":
          {
            metadataTags.album ?? (metadataTags.album = value);
          }
          break;
        case "album_artist":
          {
            metadataTags.albumArtist ?? (metadataTags.albumArtist = value);
          }
          break;
        case "genre":
          {
            metadataTags.genre ?? (metadataTags.genre = value);
          }
          break;
        case "comment":
          {
            metadataTags.comment ?? (metadataTags.comment = value);
          }
          break;
        case "lyrics":
          {
            metadataTags.lyrics ?? (metadataTags.lyrics = value);
          }
          break;
        case "date":
          {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
              metadataTags.date ?? (metadataTags.date = date);
            }
          }
          break;
        case "track_number":
        case "part_number":
          {
            const parts = value.split("/");
            const trackNum = Number.parseInt(parts[0], 10);
            const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
            if (Number.isInteger(trackNum) && trackNum > 0) {
              metadataTags.trackNumber ?? (metadataTags.trackNumber = trackNum);
            }
            if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) {
              metadataTags.tracksTotal ?? (metadataTags.tracksTotal = tracksTotal);
            }
          }
          break;
        case "disc_number":
        case "disc":
          {
            const discParts = value.split("/");
            const discNum = Number.parseInt(discParts[0], 10);
            const discsTotal = discParts[1] && Number.parseInt(discParts[1], 10);
            if (Number.isInteger(discNum) && discNum > 0) {
              metadataTags.discNumber ?? (metadataTags.discNumber = discNum);
            }
            if (discsTotal && Number.isInteger(discsTotal) && discsTotal > 0) {
              metadataTags.discsTotal ?? (metadataTags.discsTotal = discsTotal);
            }
          }
          break;
      }
    }
  }
}
class MatroskaTrackBacking {
  constructor(internalTrack) {
    this.internalTrack = internalTrack;
    this.packetToClusterLocation = /* @__PURE__ */ new WeakMap();
  }
  getId() {
    return this.internalTrack.id;
  }
  getCodec() {
    throw new Error("Not implemented on base class.");
  }
  getInternalCodecId() {
    return this.internalTrack.codecId;
  }
  async computeDuration() {
    const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
    return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
  }
  getName() {
    return this.internalTrack.name;
  }
  getLanguageCode() {
    return this.internalTrack.languageCode;
  }
  async getFirstTimestamp() {
    const firstPacket = await this.getFirstPacket({ metadataOnly: true });
    return firstPacket?.timestamp ?? 0;
  }
  getTimeResolution() {
    return this.internalTrack.segment.timestampFactor;
  }
  getDisposition() {
    return this.internalTrack.disposition;
  }
  async getFirstPacket(options) {
    return this.performClusterLookup(
      null,
      (cluster) => {
        const trackData = cluster.trackData.get(this.internalTrack.id);
        if (trackData) {
          return {
            blockIndex: 0,
            correctBlockFound: true
          };
        }
        return {
          blockIndex: -1,
          correctBlockFound: false
        };
      },
      -Infinity,
      // Use -Infinity as a search timestamp to avoid using the cues
      Infinity,
      options
    );
  }
  intoTimescale(timestamp) {
    return roundIfAlmostInteger(timestamp * this.internalTrack.segment.timestampFactor);
  }
  async getPacket(timestamp, options) {
    const timestampInTimescale = this.intoTimescale(timestamp);
    return this.performClusterLookup(null, (cluster) => {
      const trackData = cluster.trackData.get(this.internalTrack.id);
      if (!trackData) {
        return { blockIndex: -1, correctBlockFound: false };
      }
      const index = binarySearchLessOrEqual(trackData.presentationTimestamps, timestampInTimescale, (x) => x.timestamp);
      const blockIndex = index !== -1 ? trackData.presentationTimestamps[index].blockIndex : -1;
      const correctBlockFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
      return { blockIndex, correctBlockFound };
    }, timestampInTimescale, timestampInTimescale, options);
  }
  async getNextPacket(packet, options) {
    const locationInCluster = this.packetToClusterLocation.get(packet);
    if (locationInCluster === void 0) {
      throw new Error("Packet was not created from this track.");
    }
    return this.performClusterLookup(
      locationInCluster.cluster,
      (cluster) => {
        if (cluster === locationInCluster.cluster) {
          const trackData = cluster.trackData.get(this.internalTrack.id);
          if (locationInCluster.blockIndex + 1 < trackData.blocks.length) {
            return {
              blockIndex: locationInCluster.blockIndex + 1,
              correctBlockFound: true
            };
          }
        } else {
          const trackData = cluster.trackData.get(this.internalTrack.id);
          if (trackData) {
            return {
              blockIndex: 0,
              correctBlockFound: true
            };
          }
        }
        return {
          blockIndex: -1,
          correctBlockFound: false
        };
      },
      -Infinity,
      // Use -Infinity as a search timestamp to avoid using the cues
      Infinity,
      options
    );
  }
  async getKeyPacket(timestamp, options) {
    const timestampInTimescale = this.intoTimescale(timestamp);
    return this.performClusterLookup(null, (cluster) => {
      const trackData = cluster.trackData.get(this.internalTrack.id);
      if (!trackData) {
        return { blockIndex: -1, correctBlockFound: false };
      }
      const index = findLastIndex(trackData.presentationTimestamps, (x) => {
        const block = trackData.blocks[x.blockIndex];
        return block.isKeyFrame && x.timestamp <= timestampInTimescale;
      });
      const blockIndex = index !== -1 ? trackData.presentationTimestamps[index].blockIndex : -1;
      const correctBlockFound = index !== -1 && timestampInTimescale < trackData.endTimestamp;
      return { blockIndex, correctBlockFound };
    }, timestampInTimescale, timestampInTimescale, options);
  }
  async getNextKeyPacket(packet, options) {
    const locationInCluster = this.packetToClusterLocation.get(packet);
    if (locationInCluster === void 0) {
      throw new Error("Packet was not created from this track.");
    }
    return this.performClusterLookup(
      locationInCluster.cluster,
      (cluster) => {
        if (cluster === locationInCluster.cluster) {
          const trackData = cluster.trackData.get(this.internalTrack.id);
          const nextKeyFrameIndex = trackData.blocks.findIndex((x, i) => x.isKeyFrame && i > locationInCluster.blockIndex);
          if (nextKeyFrameIndex !== -1) {
            return {
              blockIndex: nextKeyFrameIndex,
              correctBlockFound: true
            };
          }
        } else {
          const trackData = cluster.trackData.get(this.internalTrack.id);
          if (trackData && trackData.firstKeyFrameTimestamp !== null) {
            const keyFrameIndex = trackData.blocks.findIndex((x) => x.isKeyFrame);
            assert(keyFrameIndex !== -1);
            return {
              blockIndex: keyFrameIndex,
              correctBlockFound: true
            };
          }
        }
        return {
          blockIndex: -1,
          correctBlockFound: false
        };
      },
      -Infinity,
      // Use -Infinity as a search timestamp to avoid using the cues
      Infinity,
      options
    );
  }
  async fetchPacketInCluster(cluster, blockIndex, options) {
    if (blockIndex === -1) {
      return null;
    }
    const trackData = cluster.trackData.get(this.internalTrack.id);
    const block = trackData.blocks[blockIndex];
    assert(block);
    if (!block.decoded) {
      block.data = this.internalTrack.demuxer.decodeBlockData(this.internalTrack, block.data);
      block.decoded = true;
    }
    const data = options.metadataOnly ? PLACEHOLDER_DATA : block.data;
    const timestamp = block.timestamp / this.internalTrack.segment.timestampFactor;
    const duration = block.duration / this.internalTrack.segment.timestampFactor;
    const sideData = {};
    if (block.mainAdditional && this.internalTrack.info?.type === "video" && this.internalTrack.info.alphaMode) {
      sideData.alpha = options.metadataOnly ? PLACEHOLDER_DATA : block.mainAdditional;
      sideData.alphaByteLength = block.mainAdditional.byteLength;
    }
    const packet = new EncodedPacket(data, block.isKeyFrame ? "key" : "delta", timestamp, duration, cluster.dataStartPos + blockIndex, block.data.byteLength, sideData);
    this.packetToClusterLocation.set(packet, { cluster, blockIndex });
    return packet;
  }
  /** Looks for a packet in the clusters while trying to load as few clusters as possible to retrieve it. */
  async performClusterLookup(startCluster, getMatchInCluster, searchTimestamp, latestTimestamp, options) {
    const { demuxer, segment } = this.internalTrack;
    let currentCluster = null;
    let bestCluster = null;
    let bestBlockIndex = -1;
    if (startCluster) {
      const { blockIndex, correctBlockFound } = getMatchInCluster(startCluster);
      if (correctBlockFound) {
        return this.fetchPacketInCluster(startCluster, blockIndex, options);
      }
      if (blockIndex !== -1) {
        bestCluster = startCluster;
        bestBlockIndex = blockIndex;
      }
    }
    const cuePointIndex = binarySearchLessOrEqual(this.internalTrack.cuePoints, searchTimestamp, (x) => x.time);
    const cuePoint = cuePointIndex !== -1 ? this.internalTrack.cuePoints[cuePointIndex] : null;
    const positionCacheIndex = binarySearchLessOrEqual(this.internalTrack.clusterPositionCache, searchTimestamp, (x) => x.startTimestamp);
    const positionCacheEntry = positionCacheIndex !== -1 ? this.internalTrack.clusterPositionCache[positionCacheIndex] : null;
    const lookupEntryPosition = Math.max(cuePoint?.clusterPosition ?? 0, positionCacheEntry?.elementStartPos ?? 0) || null;
    let currentPos;
    if (!startCluster) {
      currentPos = lookupEntryPosition ?? segment.clusterSeekStartPos;
    } else {
      if (lookupEntryPosition === null || startCluster.elementStartPos >= lookupEntryPosition) {
        currentPos = startCluster.elementEndPos;
        currentCluster = startCluster;
      } else {
        currentPos = lookupEntryPosition;
      }
    }
    while (segment.elementEndPos === null || currentPos <= segment.elementEndPos - MIN_HEADER_SIZE) {
      if (currentCluster) {
        const trackData = currentCluster.trackData.get(this.internalTrack.id);
        if (trackData && trackData.startTimestamp > latestTimestamp) {
          break;
        }
      }
      let slice = demuxer.reader.requestSliceRange(currentPos, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice)
        break;
      const elementStartPos = currentPos;
      const elementHeader = readElementHeader(slice);
      if (!elementHeader || !LEVEL_1_EBML_IDS.includes(elementHeader.id) && elementHeader.id !== EBMLId.Void) {
        const nextPos = await resync(demuxer.reader, elementStartPos, LEVEL_1_EBML_IDS, Math.min(segment.elementEndPos ?? Infinity, elementStartPos + MAX_RESYNC_LENGTH));
        if (nextPos) {
          currentPos = nextPos;
          continue;
        } else {
          break;
        }
      }
      const id = elementHeader.id;
      let size = elementHeader.size;
      const dataStartPos = slice.filePos;
      if (id === EBMLId.Cluster) {
        currentCluster = await demuxer.readCluster(elementStartPos, segment);
        size = currentCluster.elementEndPos - dataStartPos;
        const { blockIndex, correctBlockFound } = getMatchInCluster(currentCluster);
        if (correctBlockFound) {
          return this.fetchPacketInCluster(currentCluster, blockIndex, options);
        }
        if (blockIndex !== -1) {
          bestCluster = currentCluster;
          bestBlockIndex = blockIndex;
        }
      }
      if (size === void 0) {
        assert(id !== EBMLId.Cluster);
        const nextElementPos = await searchForNextElementId(demuxer.reader, dataStartPos, LEVEL_0_AND_1_EBML_IDS, segment.elementEndPos);
        size = nextElementPos.pos - dataStartPos;
      }
      const endPos = dataStartPos + size;
      if (segment.elementEndPos === null) {
        let slice2 = demuxer.reader.requestSliceRange(endPos, MIN_HEADER_SIZE, MAX_HEADER_SIZE);
        if (slice2 instanceof Promise)
          slice2 = await slice2;
        if (!slice2)
          break;
        const elementId = readElementId(slice2);
        if (elementId === EBMLId.Segment) {
          segment.elementEndPos = endPos;
          break;
        }
      }
      currentPos = endPos;
    }
    if (cuePoint && (!bestCluster || bestCluster.elementStartPos < cuePoint.clusterPosition)) {
      const previousCuePoint = this.internalTrack.cuePoints[cuePointIndex - 1];
      assert(!previousCuePoint || previousCuePoint.time < cuePoint.time);
      const newSearchTimestamp = previousCuePoint?.time ?? -Infinity;
      return this.performClusterLookup(null, getMatchInCluster, newSearchTimestamp, latestTimestamp, options);
    }
    if (bestCluster) {
      return this.fetchPacketInCluster(bestCluster, bestBlockIndex, options);
    }
    return null;
  }
}
class MatroskaVideoTrackBacking extends MatroskaTrackBacking {
  constructor(internalTrack) {
    super(internalTrack);
    this.decoderConfigPromise = null;
    this.internalTrack = internalTrack;
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getCodedWidth() {
    return this.internalTrack.info.width;
  }
  getCodedHeight() {
    return this.internalTrack.info.height;
  }
  getRotation() {
    return this.internalTrack.info.rotation;
  }
  async getColorSpace() {
    return {
      primaries: this.internalTrack.info.colorSpace?.primaries,
      transfer: this.internalTrack.info.colorSpace?.transfer,
      matrix: this.internalTrack.info.colorSpace?.matrix,
      fullRange: this.internalTrack.info.colorSpace?.fullRange
    };
  }
  async canBeTransparent() {
    return this.internalTrack.info.alphaMode;
  }
  async getDecoderConfig() {
    if (!this.internalTrack.info.codec) {
      return null;
    }
    return this.decoderConfigPromise ?? (this.decoderConfigPromise = (async () => {
      let firstPacket = null;
      const needsPacketForAdditionalInfo = this.internalTrack.info.codec === "vp9" || this.internalTrack.info.codec === "av1" || this.internalTrack.info.codec === "avc" && !this.internalTrack.info.codecDescription || this.internalTrack.info.codec === "hevc" && !this.internalTrack.info.codecDescription;
      if (needsPacketForAdditionalInfo) {
        firstPacket = await this.getFirstPacket({});
      }
      return {
        codec: extractVideoCodecString({
          width: this.internalTrack.info.width,
          height: this.internalTrack.info.height,
          codec: this.internalTrack.info.codec,
          codecDescription: this.internalTrack.info.codecDescription,
          colorSpace: this.internalTrack.info.colorSpace,
          avcType: 1,
          // We don't know better (or do we?) so just assume 'avc1'
          avcCodecInfo: this.internalTrack.info.codec === "avc" && firstPacket ? extractAvcDecoderConfigurationRecord(firstPacket.data) : null,
          hevcCodecInfo: this.internalTrack.info.codec === "hevc" && firstPacket ? extractHevcDecoderConfigurationRecord(firstPacket.data) : null,
          vp9CodecInfo: this.internalTrack.info.codec === "vp9" && firstPacket ? extractVp9CodecInfoFromPacket(firstPacket.data) : null,
          av1CodecInfo: this.internalTrack.info.codec === "av1" && firstPacket ? extractAv1CodecInfoFromPacket(firstPacket.data) : null
        }),
        codedWidth: this.internalTrack.info.width,
        codedHeight: this.internalTrack.info.height,
        description: this.internalTrack.info.codecDescription ?? void 0,
        colorSpace: this.internalTrack.info.colorSpace ?? void 0
      };
    })());
  }
}
class MatroskaAudioTrackBacking extends MatroskaTrackBacking {
  constructor(internalTrack) {
    super(internalTrack);
    this.decoderConfig = null;
    this.internalTrack = internalTrack;
  }
  getCodec() {
    return this.internalTrack.info.codec;
  }
  getNumberOfChannels() {
    return this.internalTrack.info.numberOfChannels;
  }
  getSampleRate() {
    return this.internalTrack.info.sampleRate;
  }
  async getDecoderConfig() {
    if (!this.internalTrack.info.codec) {
      return null;
    }
    return this.decoderConfig ?? (this.decoderConfig = {
      codec: extractAudioCodecString({
        codec: this.internalTrack.info.codec,
        codecDescription: this.internalTrack.info.codecDescription,
        aacCodecInfo: this.internalTrack.info.aacCodecInfo
      }),
      numberOfChannels: this.internalTrack.info.numberOfChannels,
      sampleRate: this.internalTrack.info.sampleRate,
      description: this.internalTrack.info.codecDescription ?? void 0
    });
  }
}
const FRAME_HEADER_SIZE = 4;
const SAMPLING_RATES = [44100, 48e3, 32e3];
const KILOBIT_RATES = [
  // lowSamplingFrequency === 0
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // layer = 0
  -1,
  32,
  40,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  160,
  192,
  224,
  256,
  320,
  -1,
  // layer 1
  -1,
  32,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  160,
  192,
  224,
  256,
  320,
  384,
  -1,
  // layer = 2
  -1,
  32,
  64,
  96,
  128,
  160,
  192,
  224,
  256,
  288,
  320,
  352,
  384,
  416,
  448,
  -1,
  // layer = 3
  // lowSamplingFrequency === 1
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  // layer = 0
  -1,
  8,
  16,
  24,
  32,
  40,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  144,
  160,
  -1,
  // layer = 1
  -1,
  8,
  16,
  24,
  32,
  40,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  144,
  160,
  -1,
  // layer = 2
  -1,
  32,
  48,
  56,
  64,
  80,
  96,
  112,
  128,
  144,
  160,
  176,
  192,
  224,
  256,
  -1
  // layer = 3
];
const XING = 1483304551;
const INFO = 1231971951;
const computeMp3FrameSize = (lowSamplingFrequency, layer, bitrate, sampleRate, padding) => {
  if (layer === 0) {
    return 0;
  } else if (layer === 1) {
    return Math.floor(144 * bitrate / (sampleRate << lowSamplingFrequency)) + padding;
  } else if (layer === 2) {
    return Math.floor(144 * bitrate / sampleRate) + padding;
  } else {
    return (Math.floor(12 * bitrate / sampleRate) + padding) * 4;
  }
};
const getXingOffset = (mpegVersionId, channel) => {
  return mpegVersionId === 3 ? channel === 3 ? 21 : 36 : channel === 3 ? 13 : 21;
};
const readFrameHeader$1 = (word, remainingBytes) => {
  const firstByte = word >>> 24;
  const secondByte = word >>> 16 & 255;
  const thirdByte = word >>> 8 & 255;
  const fourthByte = word & 255;
  if (firstByte !== 255 && secondByte !== 255 && thirdByte !== 255 && fourthByte !== 255) {
    return {
      header: null,
      bytesAdvanced: 4
    };
  }
  if (firstByte !== 255) {
    return { header: null, bytesAdvanced: 1 };
  }
  if ((secondByte & 224) !== 224) {
    return { header: null, bytesAdvanced: 1 };
  }
  let lowSamplingFrequency = 0;
  let mpeg25 = 0;
  if (secondByte & 1 << 4) {
    lowSamplingFrequency = secondByte & 1 << 3 ? 0 : 1;
  } else {
    lowSamplingFrequency = 1;
    mpeg25 = 1;
  }
  const mpegVersionId = secondByte >> 3 & 3;
  const layer = secondByte >> 1 & 3;
  const bitrateIndex = thirdByte >> 4 & 15;
  const frequencyIndex = (thirdByte >> 2 & 3) % 3;
  const padding = thirdByte >> 1 & 1;
  const channel = fourthByte >> 6 & 3;
  const modeExtension = fourthByte >> 4 & 3;
  const copyright = fourthByte >> 3 & 1;
  const original = fourthByte >> 2 & 1;
  const emphasis = fourthByte & 3;
  const kilobitRate = KILOBIT_RATES[lowSamplingFrequency * 16 * 4 + layer * 16 + bitrateIndex];
  if (kilobitRate === -1) {
    return { header: null, bytesAdvanced: 1 };
  }
  const bitrate = kilobitRate * 1e3;
  const sampleRate = SAMPLING_RATES[frequencyIndex] >> lowSamplingFrequency + mpeg25;
  const frameLength = computeMp3FrameSize(lowSamplingFrequency, layer, bitrate, sampleRate, padding);
  if (remainingBytes !== null && remainingBytes < frameLength) {
    return { header: null, bytesAdvanced: 1 };
  }
  let audioSamplesInFrame;
  if (mpegVersionId === 3) {
    audioSamplesInFrame = layer === 3 ? 384 : 1152;
  } else {
    if (layer === 3) {
      audioSamplesInFrame = 384;
    } else if (layer === 2) {
      audioSamplesInFrame = 1152;
    } else {
      audioSamplesInFrame = 576;
    }
  }
  return {
    header: {
      totalSize: frameLength,
      mpegVersionId,
      layer,
      bitrate,
      frequencyIndex,
      sampleRate,
      channel,
      modeExtension,
      copyright,
      original,
      emphasis,
      audioSamplesInFrame
    },
    bytesAdvanced: 1
  };
};
const decodeSynchsafe = (synchsafed) => {
  let mask = 2130706432;
  let unsynchsafed = 0;
  while (mask !== 0) {
    unsynchsafed >>= 1;
    unsynchsafed |= synchsafed & mask;
    mask >>= 8;
  }
  return unsynchsafed;
};
var Id3V2HeaderFlags;
(function(Id3V2HeaderFlags2) {
  Id3V2HeaderFlags2[Id3V2HeaderFlags2["Unsynchronisation"] = 128] = "Unsynchronisation";
  Id3V2HeaderFlags2[Id3V2HeaderFlags2["ExtendedHeader"] = 64] = "ExtendedHeader";
  Id3V2HeaderFlags2[Id3V2HeaderFlags2["ExperimentalIndicator"] = 32] = "ExperimentalIndicator";
  Id3V2HeaderFlags2[Id3V2HeaderFlags2["Footer"] = 16] = "Footer";
})(Id3V2HeaderFlags || (Id3V2HeaderFlags = {}));
var Id3V2TextEncoding;
(function(Id3V2TextEncoding2) {
  Id3V2TextEncoding2[Id3V2TextEncoding2["ISO_8859_1"] = 0] = "ISO_8859_1";
  Id3V2TextEncoding2[Id3V2TextEncoding2["UTF_16_WITH_BOM"] = 1] = "UTF_16_WITH_BOM";
  Id3V2TextEncoding2[Id3V2TextEncoding2["UTF_16_BE_NO_BOM"] = 2] = "UTF_16_BE_NO_BOM";
  Id3V2TextEncoding2[Id3V2TextEncoding2["UTF_8"] = 3] = "UTF_8";
})(Id3V2TextEncoding || (Id3V2TextEncoding = {}));
const ID3_V1_TAG_SIZE = 128;
const ID3_V2_HEADER_SIZE = 10;
const ID3_V1_GENRES = [
  "Blues",
  "Classic rock",
  "Country",
  "Dance",
  "Disco",
  "Funk",
  "Grunge",
  "Hip-hop",
  "Jazz",
  "Metal",
  "New age",
  "Oldies",
  "Other",
  "Pop",
  "Rhythm and blues",
  "Rap",
  "Reggae",
  "Rock",
  "Techno",
  "Industrial",
  "Alternative",
  "Ska",
  "Death metal",
  "Pranks",
  "Soundtrack",
  "Euro-techno",
  "Ambient",
  "Trip-hop",
  "Vocal",
  "Jazz & funk",
  "Fusion",
  "Trance",
  "Classical",
  "Instrumental",
  "Acid",
  "House",
  "Game",
  "Sound clip",
  "Gospel",
  "Noise",
  "Alternative rock",
  "Bass",
  "Soul",
  "Punk",
  "Space",
  "Meditative",
  "Instrumental pop",
  "Instrumental rock",
  "Ethnic",
  "Gothic",
  "Darkwave",
  "Techno-industrial",
  "Electronic",
  "Pop-folk",
  "Eurodance",
  "Dream",
  "Southern rock",
  "Comedy",
  "Cult",
  "Gangsta",
  "Top 40",
  "Christian rap",
  "Pop/funk",
  "Jungle music",
  "Native US",
  "Cabaret",
  "New wave",
  "Psychedelic",
  "Rave",
  "Showtunes",
  "Trailer",
  "Lo-fi",
  "Tribal",
  "Acid punk",
  "Acid jazz",
  "Polka",
  "Retro",
  "Musical",
  "Rock 'n' roll",
  "Hard rock",
  "Folk",
  "Folk rock",
  "National folk",
  "Swing",
  "Fast fusion",
  "Bebop",
  "Latin",
  "Revival",
  "Celtic",
  "Bluegrass",
  "Avantgarde",
  "Gothic rock",
  "Progressive rock",
  "Psychedelic rock",
  "Symphonic rock",
  "Slow rock",
  "Big band",
  "Chorus",
  "Easy listening",
  "Acoustic",
  "Humour",
  "Speech",
  "Chanson",
  "Opera",
  "Chamber music",
  "Sonata",
  "Symphony",
  "Booty bass",
  "Primus",
  "Porn groove",
  "Satire",
  "Slow jam",
  "Club",
  "Tango",
  "Samba",
  "Folklore",
  "Ballad",
  "Power ballad",
  "Rhythmic Soul",
  "Freestyle",
  "Duet",
  "Punk rock",
  "Drum solo",
  "A cappella",
  "Euro-house",
  "Dance hall",
  "Goa music",
  "Drum & bass",
  "Club-house",
  "Hardcore techno",
  "Terror",
  "Indie",
  "Britpop",
  "Negerpunk",
  "Polsk punk",
  "Beat",
  "Christian gangsta rap",
  "Heavy metal",
  "Black metal",
  "Crossover",
  "Contemporary Christian",
  "Christian rock",
  "Merengue",
  "Salsa",
  "Thrash metal",
  "Anime",
  "Jpop",
  "Synthpop",
  "Christmas",
  "Art rock",
  "Baroque",
  "Bhangra",
  "Big beat",
  "Breakbeat",
  "Chillout",
  "Downtempo",
  "Dub",
  "EBM",
  "Eclectic",
  "Electro",
  "Electroclash",
  "Emo",
  "Experimental",
  "Garage",
  "Global",
  "IDM",
  "Illbient",
  "Industro-Goth",
  "Jam Band",
  "Krautrock",
  "Leftfield",
  "Lounge",
  "Math rock",
  "New romantic",
  "Nu-breakz",
  "Post-punk",
  "Post-rock",
  "Psytrance",
  "Shoegaze",
  "Space rock",
  "Trop rock",
  "World music",
  "Neoclassical",
  "Audiobook",
  "Audio theatre",
  "Neue Deutsche Welle",
  "Podcast",
  "Indie rock",
  "G-Funk",
  "Dubstep",
  "Garage rock",
  "Psybient"
];
const parseId3V1Tag = (slice, tags) => {
  var _a;
  const startPos = slice.filePos;
  tags.raw ?? (tags.raw = {});
  (_a = tags.raw)["TAG"] ?? (_a["TAG"] = readBytes(slice, ID3_V1_TAG_SIZE - 3));
  slice.filePos = startPos;
  const title = readId3V1String(slice, 30);
  if (title)
    tags.title ?? (tags.title = title);
  const artist = readId3V1String(slice, 30);
  if (artist)
    tags.artist ?? (tags.artist = artist);
  const album = readId3V1String(slice, 30);
  if (album)
    tags.album ?? (tags.album = album);
  const yearText = readId3V1String(slice, 4);
  const year = Number.parseInt(yearText, 10);
  if (Number.isInteger(year) && year > 0) {
    tags.date ?? (tags.date = new Date(year, 0, 1));
  }
  const commentBytes = readBytes(slice, 30);
  let comment;
  if (commentBytes[28] === 0 && commentBytes[29] !== 0) {
    const trackNum = commentBytes[29];
    if (trackNum > 0) {
      tags.trackNumber ?? (tags.trackNumber = trackNum);
    }
    slice.skip(-30);
    comment = readId3V1String(slice, 28);
    slice.skip(2);
  } else {
    slice.skip(-30);
    comment = readId3V1String(slice, 30);
  }
  if (comment)
    tags.comment ?? (tags.comment = comment);
  const genreIndex = readU8(slice);
  if (genreIndex < ID3_V1_GENRES.length) {
    tags.genre ?? (tags.genre = ID3_V1_GENRES[genreIndex]);
  }
};
const readId3V1String = (slice, length) => {
  const bytes = readBytes(slice, length);
  const endIndex = coalesceIndex(bytes.indexOf(0), bytes.length);
  const relevantBytes = bytes.subarray(0, endIndex);
  let str = "";
  for (let i = 0; i < relevantBytes.length; i++) {
    str += String.fromCharCode(relevantBytes[i]);
  }
  return str.trimEnd();
};
const readId3V2Header = (slice) => {
  const startPos = slice.filePos;
  const tag = readAscii(slice, 3);
  const majorVersion = readU8(slice);
  const revision = readU8(slice);
  const flags = readU8(slice);
  const sizeRaw = readU32Be(slice);
  if (tag !== "ID3" || majorVersion === 255 || revision === 255 || (sizeRaw & 2155905152) !== 0) {
    slice.filePos = startPos;
    return null;
  }
  const size = decodeSynchsafe(sizeRaw);
  return { majorVersion, revision, flags, size };
};
const parseId3V2Tag = (slice, header, tags) => {
  var _a, _b, _c, _d;
  if (![2, 3, 4].includes(header.majorVersion)) {
    console.warn(`Unsupported ID3v2 major version: ${header.majorVersion}`);
    return;
  }
  const bytes = readBytes(slice, header.size);
  const reader = new Id3V2Reader(header, bytes);
  if (header.flags & Id3V2HeaderFlags.Footer) {
    reader.removeFooter();
  }
  if (header.flags & Id3V2HeaderFlags.Unsynchronisation && header.majorVersion === 3) {
    reader.ununsynchronizeAll();
  }
  if (header.flags & Id3V2HeaderFlags.ExtendedHeader) {
    const extendedHeaderSize = reader.readU32();
    if (header.majorVersion === 3) {
      reader.pos += extendedHeaderSize;
    } else {
      reader.pos += extendedHeaderSize - 4;
    }
  }
  while (reader.pos <= reader.bytes.length - reader.frameHeaderSize()) {
    const frame = reader.readId3V2Frame();
    if (!frame) {
      break;
    }
    const frameStartPos = reader.pos;
    const frameEndPos = reader.pos + frame.size;
    let frameEncrypted = false;
    let frameCompressed = false;
    let frameUnsynchronized = false;
    if (header.majorVersion === 3) {
      frameEncrypted = !!(frame.flags & 1 << 6);
      frameCompressed = !!(frame.flags & 1 << 7);
    } else if (header.majorVersion === 4) {
      frameEncrypted = !!(frame.flags & 1 << 2);
      frameCompressed = !!(frame.flags & 1 << 3);
      frameUnsynchronized = !!(frame.flags & 1 << 1) || !!(header.flags & Id3V2HeaderFlags.Unsynchronisation);
    }
    if (frameEncrypted) {
      console.warn(`Skipping encrypted ID3v2 frame ${frame.id}`);
      reader.pos = frameEndPos;
      continue;
    }
    if (frameCompressed) {
      console.warn(`Skipping compressed ID3v2 frame ${frame.id}`);
      reader.pos = frameEndPos;
      continue;
    }
    if (frameUnsynchronized) {
      reader.ununsynchronizeRegion(reader.pos, frameEndPos);
    }
    tags.raw ?? (tags.raw = {});
    if (frame.id[0] === "T") {
      (_a = tags.raw)[_b = frame.id] ?? (_a[_b] = reader.readId3V2EncodingAndText(frameEndPos));
    } else {
      (_c = tags.raw)[_d = frame.id] ?? (_c[_d] = reader.readBytes(frame.size));
    }
    reader.pos = frameStartPos;
    switch (frame.id) {
      case "TIT2":
      case "TT2":
        {
          tags.title ?? (tags.title = reader.readId3V2EncodingAndText(frameEndPos));
        }
        break;
      case "TIT3":
      case "TT3":
        {
          tags.description ?? (tags.description = reader.readId3V2EncodingAndText(frameEndPos));
        }
        break;
      case "TPE1":
      case "TP1":
        {
          tags.artist ?? (tags.artist = reader.readId3V2EncodingAndText(frameEndPos));
        }
        break;
      case "TALB":
      case "TAL":
        {
          tags.album ?? (tags.album = reader.readId3V2EncodingAndText(frameEndPos));
        }
        break;
      case "TPE2":
      case "TP2":
        {
          tags.albumArtist ?? (tags.albumArtist = reader.readId3V2EncodingAndText(frameEndPos));
        }
        break;
      case "TRCK":
      case "TRK":
        {
          const trackText = reader.readId3V2EncodingAndText(frameEndPos);
          const parts = trackText.split("/");
          const trackNum = Number.parseInt(parts[0], 10);
          const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
          if (Number.isInteger(trackNum) && trackNum > 0) {
            tags.trackNumber ?? (tags.trackNumber = trackNum);
          }
          if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) {
            tags.tracksTotal ?? (tags.tracksTotal = tracksTotal);
          }
        }
        break;
      case "TPOS":
      case "TPA":
        {
          const discText = reader.readId3V2EncodingAndText(frameEndPos);
          const parts = discText.split("/");
          const discNum = Number.parseInt(parts[0], 10);
          const discsTotal = parts[1] && Number.parseInt(parts[1], 10);
          if (Number.isInteger(discNum) && discNum > 0) {
            tags.discNumber ?? (tags.discNumber = discNum);
          }
          if (discsTotal && Number.isInteger(discsTotal) && discsTotal > 0) {
            tags.discsTotal ?? (tags.discsTotal = discsTotal);
          }
        }
        break;
      case "TCON":
      case "TCO":
        {
          const genreText = reader.readId3V2EncodingAndText(frameEndPos);
          let match = /^\((\d+)\)/.exec(genreText);
          if (match) {
            const genreNumber = Number.parseInt(match[1]);
            if (ID3_V1_GENRES[genreNumber] !== void 0) {
              tags.genre ?? (tags.genre = ID3_V1_GENRES[genreNumber]);
              break;
            }
          }
          match = /^\d+$/.exec(genreText);
          if (match) {
            const genreNumber = Number.parseInt(match[0]);
            if (ID3_V1_GENRES[genreNumber] !== void 0) {
              tags.genre ?? (tags.genre = ID3_V1_GENRES[genreNumber]);
              break;
            }
          }
          tags.genre ?? (tags.genre = genreText);
        }
        break;
      case "TDRC":
      case "TDAT":
        {
          const dateText = reader.readId3V2EncodingAndText(frameEndPos);
          const date = new Date(dateText);
          if (!Number.isNaN(date.getTime())) {
            tags.date ?? (tags.date = date);
          }
        }
        break;
      case "TYER":
      case "TYE":
        {
          const yearText = reader.readId3V2EncodingAndText(frameEndPos);
          const year = Number.parseInt(yearText, 10);
          if (Number.isInteger(year)) {
            tags.date ?? (tags.date = new Date(year, 0, 1));
          }
        }
        break;
      case "USLT":
      case "ULT":
        {
          const encoding = reader.readU8();
          reader.pos += 3;
          reader.readId3V2Text(encoding, frameEndPos);
          tags.lyrics ?? (tags.lyrics = reader.readId3V2Text(encoding, frameEndPos));
        }
        break;
      case "COMM":
      case "COM":
        {
          const encoding = reader.readU8();
          reader.pos += 3;
          reader.readId3V2Text(encoding, frameEndPos);
          tags.comment ?? (tags.comment = reader.readId3V2Text(encoding, frameEndPos));
        }
        break;
      case "APIC":
      case "PIC":
        {
          const encoding = reader.readId3V2TextEncoding();
          let mimeType;
          if (header.majorVersion === 2) {
            const imageFormat = reader.readAscii(3);
            mimeType = imageFormat === "PNG" ? "image/png" : imageFormat === "JPG" ? "image/jpeg" : "image/*";
          } else {
            mimeType = reader.readId3V2Text(encoding, frameEndPos);
          }
          const pictureType = reader.readU8();
          const description = reader.readId3V2Text(encoding, frameEndPos).trimEnd();
          const imageDataSize = frameEndPos - reader.pos;
          if (imageDataSize >= 0) {
            const imageData = reader.readBytes(imageDataSize);
            if (!tags.images)
              tags.images = [];
            tags.images.push({
              data: imageData,
              mimeType,
              kind: pictureType === 3 ? "coverFront" : pictureType === 4 ? "coverBack" : "unknown",
              description
            });
          }
        }
        break;
      default:
        {
          reader.pos += frame.size;
        }
        break;
    }
    reader.pos = frameEndPos;
  }
};
class Id3V2Reader {
  constructor(header, bytes) {
    this.header = header;
    this.bytes = bytes;
    this.pos = 0;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }
  frameHeaderSize() {
    return this.header.majorVersion === 2 ? 6 : 10;
  }
  ununsynchronizeAll() {
    const newBytes = [];
    for (let i = 0; i < this.bytes.length; i++) {
      const value1 = this.bytes[i];
      newBytes.push(value1);
      if (value1 === 255 && i !== this.bytes.length - 1) {
        const value2 = this.bytes[i];
        if (value2 === 0) {
          i++;
        }
      }
    }
    this.bytes = new Uint8Array(newBytes);
    this.view = new DataView(this.bytes.buffer);
  }
  ununsynchronizeRegion(start, end) {
    const newBytes = [];
    for (let i = start; i < end; i++) {
      const value1 = this.bytes[i];
      newBytes.push(value1);
      if (value1 === 255 && i !== end - 1) {
        const value2 = this.bytes[i + 1];
        if (value2 === 0) {
          i++;
        }
      }
    }
    const before = this.bytes.subarray(0, start);
    const after = this.bytes.subarray(end);
    this.bytes = new Uint8Array(before.length + newBytes.length + after.length);
    this.bytes.set(before, 0);
    this.bytes.set(newBytes, before.length);
    this.bytes.set(after, before.length + newBytes.length);
    this.view = new DataView(this.bytes.buffer);
  }
  removeFooter() {
    this.bytes = this.bytes.subarray(0, this.bytes.length - ID3_V2_HEADER_SIZE);
    this.view = new DataView(this.bytes.buffer);
  }
  readBytes(length) {
    const slice = this.bytes.subarray(this.pos, this.pos + length);
    this.pos += length;
    return slice;
  }
  readU8() {
    const value = this.view.getUint8(this.pos);
    this.pos += 1;
    return value;
  }
  readU16() {
    const value = this.view.getUint16(this.pos, false);
    this.pos += 2;
    return value;
  }
  readU24() {
    const high = this.view.getUint16(this.pos, false);
    const low = this.view.getUint8(this.pos + 1);
    this.pos += 3;
    return high * 256 + low;
  }
  readU32() {
    const value = this.view.getUint32(this.pos, false);
    this.pos += 4;
    return value;
  }
  readAscii(length) {
    let str = "";
    for (let i = 0; i < length; i++) {
      str += String.fromCharCode(this.view.getUint8(this.pos + i));
    }
    this.pos += length;
    return str;
  }
  readId3V2Frame() {
    if (this.header.majorVersion === 2) {
      const id = this.readAscii(3);
      if (id === "\0\0\0") {
        return null;
      }
      const size = this.readU24();
      return { id, size, flags: 0 };
    } else {
      const id = this.readAscii(4);
      if (id === "\0\0\0\0") {
        return null;
      }
      const sizeRaw = this.readU32();
      let size = this.header.majorVersion === 4 ? decodeSynchsafe(sizeRaw) : sizeRaw;
      const flags = this.readU16();
      const headerEndPos = this.pos;
      const isSizeValid = (size2) => {
        const nextPos = this.pos + size2;
        if (nextPos > this.bytes.length) {
          return false;
        }
        if (nextPos <= this.bytes.length - this.frameHeaderSize()) {
          this.pos += size2;
          const nextId = this.readAscii(4);
          if (nextId !== "\0\0\0\0" && !/[0-9A-Z]{4}/.test(nextId)) {
            return false;
          }
        }
        return true;
      };
      if (!isSizeValid(size)) {
        const otherSize = this.header.majorVersion === 4 ? sizeRaw : decodeSynchsafe(sizeRaw);
        if (isSizeValid(otherSize)) {
          size = otherSize;
        }
      }
      this.pos = headerEndPos;
      return { id, size, flags };
    }
  }
  readId3V2TextEncoding() {
    const number = this.readU8();
    if (number > 3) {
      throw new Error(`Unsupported text encoding: ${number}`);
    }
    return number;
  }
  readId3V2Text(encoding, until) {
    const startPos = this.pos;
    const data = this.readBytes(until - this.pos);
    switch (encoding) {
      case Id3V2TextEncoding.ISO_8859_1: {
        let str = "";
        for (let i = 0; i < data.length; i++) {
          const value = data[i];
          if (value === 0) {
            this.pos = startPos + i + 1;
            break;
          }
          str += String.fromCharCode(value);
        }
        return str;
      }
      case Id3V2TextEncoding.UTF_16_WITH_BOM: {
        if (data[0] === 255 && data[1] === 254) {
          const decoder = new TextDecoder("utf-16le");
          const endIndex = coalesceIndex(data.findIndex((x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
          this.pos = startPos + Math.min(endIndex + 2, data.length);
          return decoder.decode(data.subarray(2, endIndex));
        } else if (data[0] === 254 && data[1] === 255) {
          const decoder = new TextDecoder("utf-16be");
          const endIndex = coalesceIndex(data.findIndex((x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
          this.pos = startPos + Math.min(endIndex + 2, data.length);
          return decoder.decode(data.subarray(2, endIndex));
        } else {
          const endIndex = coalesceIndex(data.findIndex((x) => x === 0), data.length);
          this.pos = startPos + Math.min(endIndex + 1, data.length);
          return textDecoder.decode(data.subarray(0, endIndex));
        }
      }
      case Id3V2TextEncoding.UTF_16_BE_NO_BOM: {
        const decoder = new TextDecoder("utf-16be");
        const endIndex = coalesceIndex(data.findIndex((x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0), data.length);
        this.pos = startPos + Math.min(endIndex + 2, data.length);
        return decoder.decode(data.subarray(0, endIndex));
      }
      case Id3V2TextEncoding.UTF_8: {
        const endIndex = coalesceIndex(data.findIndex((x) => x === 0), data.length);
        this.pos = startPos + Math.min(endIndex + 1, data.length);
        return textDecoder.decode(data.subarray(0, endIndex));
      }
    }
  }
  readId3V2EncodingAndText(until) {
    if (this.pos >= until) {
      return "";
    }
    const encoding = this.readId3V2TextEncoding();
    return this.readId3V2Text(encoding, until);
  }
}
const readNextFrameHeader = async (reader, startPos, until) => {
  let currentPos = startPos;
  while (until === null || currentPos < until) {
    let slice = reader.requestSlice(currentPos, FRAME_HEADER_SIZE);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      break;
    const word = readU32Be(slice);
    const result = readFrameHeader$1(word, reader.fileSize !== null ? reader.fileSize - currentPos : null);
    if (result.header) {
      return { header: result.header, startPos: currentPos };
    }
    currentPos += result.bytesAdvanced;
  }
  return null;
};
class Mp3Demuxer extends Demuxer {
  constructor(input) {
    super(input);
    this.metadataPromise = null;
    this.firstFrameHeader = null;
    this.loadedSamples = [];
    this.metadataTags = null;
    this.tracks = [];
    this.readingMutex = new AsyncMutex();
    this.lastSampleLoaded = false;
    this.lastLoadedPos = 0;
    this.nextTimestampInSamples = 0;
    this.reader = input._reader;
  }
  async readMetadata() {
    return this.metadataPromise ?? (this.metadataPromise = (async () => {
      while (!this.firstFrameHeader && !this.lastSampleLoaded) {
        await this.advanceReader();
      }
      if (!this.firstFrameHeader) {
        throw new Error("No valid MP3 frame found.");
      }
      this.tracks = [new InputAudioTrack(this.input, new Mp3AudioTrackBacking(this))];
    })());
  }
  async advanceReader() {
    if (this.lastLoadedPos === 0) {
      while (true) {
        let slice2 = this.reader.requestSlice(this.lastLoadedPos, ID3_V2_HEADER_SIZE);
        if (slice2 instanceof Promise)
          slice2 = await slice2;
        if (!slice2) {
          this.lastSampleLoaded = true;
          return;
        }
        const id3V2Header = readId3V2Header(slice2);
        if (!id3V2Header) {
          break;
        }
        this.lastLoadedPos = slice2.filePos + id3V2Header.size;
      }
    }
    const result = await readNextFrameHeader(this.reader, this.lastLoadedPos, this.reader.fileSize);
    if (!result) {
      this.lastSampleLoaded = true;
      return;
    }
    const header = result.header;
    this.lastLoadedPos = result.startPos + header.totalSize - 1;
    const xingOffset = getXingOffset(header.mpegVersionId, header.channel);
    let slice = this.reader.requestSlice(result.startPos + xingOffset, 4);
    if (slice instanceof Promise)
      slice = await slice;
    if (slice) {
      const word = readU32Be(slice);
      const isXing = word === XING || word === INFO;
      if (isXing) {
        return;
      }
    }
    if (!this.firstFrameHeader) {
      this.firstFrameHeader = header;
    }
    if (header.sampleRate !== this.firstFrameHeader.sampleRate) {
      console.warn(`MP3 changed sample rate mid-file: ${this.firstFrameHeader.sampleRate} Hz to ${header.sampleRate} Hz. Might be a bug, so please report this file.`);
    }
    const sampleDuration = header.audioSamplesInFrame / this.firstFrameHeader.sampleRate;
    const sample = {
      timestamp: this.nextTimestampInSamples / this.firstFrameHeader.sampleRate,
      duration: sampleDuration,
      dataStart: result.startPos,
      dataSize: header.totalSize
    };
    this.loadedSamples.push(sample);
    this.nextTimestampInSamples += header.audioSamplesInFrame;
    return;
  }
  async getMimeType() {
    return "audio/mpeg";
  }
  async getTracks() {
    await this.readMetadata();
    return this.tracks;
  }
  async computeDuration() {
    await this.readMetadata();
    const track = this.tracks[0];
    assert(track);
    return track.computeDuration();
  }
  async getMetadataTags() {
    const release = await this.readingMutex.acquire();
    try {
      await this.readMetadata();
      if (this.metadataTags) {
        return this.metadataTags;
      }
      this.metadataTags = {};
      let currentPos = 0;
      let id3V2HeaderFound = false;
      while (true) {
        let headerSlice = this.reader.requestSlice(currentPos, ID3_V2_HEADER_SIZE);
        if (headerSlice instanceof Promise)
          headerSlice = await headerSlice;
        if (!headerSlice)
          break;
        const id3V2Header = readId3V2Header(headerSlice);
        if (!id3V2Header) {
          break;
        }
        id3V2HeaderFound = true;
        let contentSlice = this.reader.requestSlice(headerSlice.filePos, id3V2Header.size);
        if (contentSlice instanceof Promise)
          contentSlice = await contentSlice;
        if (!contentSlice)
          break;
        parseId3V2Tag(contentSlice, id3V2Header, this.metadataTags);
        currentPos = headerSlice.filePos + id3V2Header.size;
      }
      if (!id3V2HeaderFound && this.reader.fileSize !== null && this.reader.fileSize >= ID3_V1_TAG_SIZE) {
        let slice = this.reader.requestSlice(this.reader.fileSize - ID3_V1_TAG_SIZE, ID3_V1_TAG_SIZE);
        if (slice instanceof Promise)
          slice = await slice;
        assert(slice);
        const tag = readAscii(slice, 3);
        if (tag === "TAG") {
          parseId3V1Tag(slice, this.metadataTags);
        }
      }
      return this.metadataTags;
    } finally {
      release();
    }
  }
}
class Mp3AudioTrackBacking {
  constructor(demuxer) {
    this.demuxer = demuxer;
  }
  getId() {
    return 1;
  }
  async getFirstTimestamp() {
    return 0;
  }
  getTimeResolution() {
    assert(this.demuxer.firstFrameHeader);
    return this.demuxer.firstFrameHeader.sampleRate / this.demuxer.firstFrameHeader.audioSamplesInFrame;
  }
  async computeDuration() {
    const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
    return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return UNDETERMINED_LANGUAGE;
  }
  getCodec() {
    return "mp3";
  }
  getInternalCodecId() {
    return null;
  }
  getNumberOfChannels() {
    assert(this.demuxer.firstFrameHeader);
    return this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2;
  }
  getSampleRate() {
    assert(this.demuxer.firstFrameHeader);
    return this.demuxer.firstFrameHeader.sampleRate;
  }
  getDisposition() {
    return {
      ...DEFAULT_TRACK_DISPOSITION
    };
  }
  async getDecoderConfig() {
    assert(this.demuxer.firstFrameHeader);
    return {
      codec: "mp3",
      numberOfChannels: this.demuxer.firstFrameHeader.channel === 3 ? 1 : 2,
      sampleRate: this.demuxer.firstFrameHeader.sampleRate
    };
  }
  async getPacketAtIndex(sampleIndex, options) {
    if (sampleIndex === -1) {
      return null;
    }
    const rawSample = this.demuxer.loadedSamples[sampleIndex];
    if (!rawSample) {
      return null;
    }
    let data;
    if (options.metadataOnly) {
      data = PLACEHOLDER_DATA;
    } else {
      let slice = this.demuxer.reader.requestSlice(rawSample.dataStart, rawSample.dataSize);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice) {
        return null;
      }
      data = readBytes(slice, rawSample.dataSize);
    }
    return new EncodedPacket(data, "key", rawSample.timestamp, rawSample.duration, sampleIndex, rawSample.dataSize);
  }
  getFirstPacket(options) {
    return this.getPacketAtIndex(0, options);
  }
  async getNextPacket(packet, options) {
    const release = await this.demuxer.readingMutex.acquire();
    try {
      const sampleIndex = binarySearchExact(this.demuxer.loadedSamples, packet.timestamp, (x) => x.timestamp);
      if (sampleIndex === -1) {
        throw new Error("Packet was not created from this track.");
      }
      const nextIndex = sampleIndex + 1;
      while (nextIndex >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded) {
        await this.demuxer.advanceReader();
      }
      return this.getPacketAtIndex(nextIndex, options);
    } finally {
      release();
    }
  }
  async getPacket(timestamp, options) {
    const release = await this.demuxer.readingMutex.acquire();
    try {
      while (true) {
        const index = binarySearchLessOrEqual(this.demuxer.loadedSamples, timestamp, (x) => x.timestamp);
        if (index === -1 && this.demuxer.loadedSamples.length > 0) {
          return null;
        }
        if (this.demuxer.lastSampleLoaded) {
          return this.getPacketAtIndex(index, options);
        }
        if (index >= 0 && index + 1 < this.demuxer.loadedSamples.length) {
          return this.getPacketAtIndex(index, options);
        }
        await this.demuxer.advanceReader();
      }
    } finally {
      release();
    }
  }
  getKeyPacket(timestamp, options) {
    return this.getPacket(timestamp, options);
  }
  getNextKeyPacket(packet, options) {
    return this.getNextPacket(packet, options);
  }
}
const OGGS = 1399285583;
const OGG_CRC_POLYNOMIAL = 79764919;
const OGG_CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let crc = n << 24;
  for (let k = 0; k < 8; k++) {
    crc = crc & 2147483648 ? crc << 1 ^ OGG_CRC_POLYNOMIAL : crc << 1;
  }
  OGG_CRC_TABLE[n] = crc >>> 0 & 4294967295;
}
const computeOggPageCrc = (bytes) => {
  const view = toDataView(bytes);
  const originalChecksum = view.getUint32(22, true);
  view.setUint32(22, 0, true);
  let crc = 0;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    crc = (crc << 8 ^ OGG_CRC_TABLE[crc >>> 24 ^ byte]) >>> 0;
  }
  view.setUint32(22, originalChecksum, true);
  return crc;
};
const extractSampleMetadata = (data, codecInfo, vorbisLastBlocksize) => {
  let durationInSamples = 0;
  let currentBlocksize = null;
  if (data.length > 0) {
    if (codecInfo.codec === "vorbis") {
      assert(codecInfo.vorbisInfo);
      const vorbisModeCount = codecInfo.vorbisInfo.modeBlockflags.length;
      const bitCount = ilog(vorbisModeCount - 1);
      const modeMask = (1 << bitCount) - 1 << 1;
      const modeNumber = (data[0] & modeMask) >> 1;
      if (modeNumber >= codecInfo.vorbisInfo.modeBlockflags.length) {
        throw new Error("Invalid mode number.");
      }
      let prevBlocksize = vorbisLastBlocksize;
      const blockflag = codecInfo.vorbisInfo.modeBlockflags[modeNumber];
      currentBlocksize = codecInfo.vorbisInfo.blocksizes[blockflag];
      if (blockflag === 1) {
        const prevMask = (modeMask | 1) + 1;
        const flag = data[0] & prevMask ? 1 : 0;
        prevBlocksize = codecInfo.vorbisInfo.blocksizes[flag];
      }
      durationInSamples = prevBlocksize !== null ? prevBlocksize + currentBlocksize >> 2 : 0;
    } else if (codecInfo.codec === "opus") {
      const toc = parseOpusTocByte(data);
      durationInSamples = toc.durationInSamples;
    }
  }
  return {
    durationInSamples,
    vorbisBlockSize: currentBlocksize
  };
};
const buildOggMimeType = (info) => {
  let string = "audio/ogg";
  if (info.codecStrings) {
    const uniqueCodecMimeTypes = [...new Set(info.codecStrings)];
    string += `; codecs="${uniqueCodecMimeTypes.join(", ")}"`;
  }
  return string;
};
const MIN_PAGE_HEADER_SIZE = 27;
const MAX_PAGE_HEADER_SIZE = 27 + 255;
const MAX_PAGE_SIZE = MAX_PAGE_HEADER_SIZE + 255 * 255;
const readPageHeader = (slice) => {
  const startPos = slice.filePos;
  const capturePattern = readU32Le(slice);
  if (capturePattern !== OGGS) {
    return null;
  }
  slice.skip(1);
  const headerType = readU8(slice);
  const granulePosition = readI64Le(slice);
  const serialNumber = readU32Le(slice);
  const sequenceNumber = readU32Le(slice);
  const checksum = readU32Le(slice);
  const numberPageSegments = readU8(slice);
  const lacingValues = new Uint8Array(numberPageSegments);
  for (let i = 0; i < numberPageSegments; i++) {
    lacingValues[i] = readU8(slice);
  }
  const headerSize = 27 + numberPageSegments;
  const dataSize = lacingValues.reduce((a, b) => a + b, 0);
  const totalSize = headerSize + dataSize;
  return {
    headerStartPos: startPos,
    totalSize,
    dataStartPos: startPos + headerSize,
    dataSize,
    headerType,
    granulePosition,
    serialNumber,
    sequenceNumber,
    checksum,
    lacingValues
  };
};
const findNextPageHeader = (slice, until) => {
  while (slice.filePos < until - (4 - 1)) {
    const word = readU32Le(slice);
    const firstByte = word & 255;
    const secondByte = word >>> 8 & 255;
    const thirdByte = word >>> 16 & 255;
    const fourthByte = word >>> 24 & 255;
    const O = 79;
    if (firstByte !== O && secondByte !== O && thirdByte !== O && fourthByte !== O) {
      continue;
    }
    slice.skip(-4);
    if (word === OGGS) {
      return true;
    }
    slice.skip(1);
  }
  return false;
};
class OggDemuxer extends Demuxer {
  constructor(input) {
    super(input);
    this.metadataPromise = null;
    this.bitstreams = [];
    this.tracks = [];
    this.metadataTags = {};
    this.reader = input._reader;
  }
  async readMetadata() {
    return this.metadataPromise ?? (this.metadataPromise = (async () => {
      let currentPos = 0;
      while (true) {
        let slice = this.reader.requestSliceRange(currentPos, MIN_PAGE_HEADER_SIZE, MAX_PAGE_HEADER_SIZE);
        if (slice instanceof Promise)
          slice = await slice;
        if (!slice)
          break;
        const page = readPageHeader(slice);
        if (!page) {
          break;
        }
        const isBos = !!(page.headerType & 2);
        if (!isBos) {
          break;
        }
        this.bitstreams.push({
          serialNumber: page.serialNumber,
          bosPage: page,
          description: null,
          numberOfChannels: -1,
          sampleRate: -1,
          codecInfo: {
            codec: null,
            vorbisInfo: null,
            opusInfo: null
          },
          lastMetadataPacket: null
        });
        currentPos = page.headerStartPos + page.totalSize;
      }
      for (const bitstream of this.bitstreams) {
        const firstPacket = await this.readPacket(bitstream.bosPage, 0);
        if (!firstPacket) {
          continue;
        }
        if (
          // Check for Vorbis
          firstPacket.data.byteLength >= 7 && firstPacket.data[0] === 1 && firstPacket.data[1] === 118 && firstPacket.data[2] === 111 && firstPacket.data[3] === 114 && firstPacket.data[4] === 98 && firstPacket.data[5] === 105 && firstPacket.data[6] === 115
        ) {
          await this.readVorbisMetadata(firstPacket, bitstream);
        } else if (
          // Check for Opus
          firstPacket.data.byteLength >= 8 && firstPacket.data[0] === 79 && firstPacket.data[1] === 112 && firstPacket.data[2] === 117 && firstPacket.data[3] === 115 && firstPacket.data[4] === 72 && firstPacket.data[5] === 101 && firstPacket.data[6] === 97 && firstPacket.data[7] === 100
        ) {
          await this.readOpusMetadata(firstPacket, bitstream);
        }
        if (bitstream.codecInfo.codec !== null) {
          this.tracks.push(new InputAudioTrack(this.input, new OggAudioTrackBacking(bitstream, this)));
        }
      }
    })());
  }
  async readVorbisMetadata(firstPacket, bitstream) {
    let nextPacketPosition = await this.findNextPacketStart(firstPacket);
    if (!nextPacketPosition) {
      return;
    }
    const secondPacket = await this.readPacket(nextPacketPosition.startPage, nextPacketPosition.startSegmentIndex);
    if (!secondPacket) {
      return;
    }
    nextPacketPosition = await this.findNextPacketStart(secondPacket);
    if (!nextPacketPosition) {
      return;
    }
    const thirdPacket = await this.readPacket(nextPacketPosition.startPage, nextPacketPosition.startSegmentIndex);
    if (!thirdPacket) {
      return;
    }
    if (secondPacket.data[0] !== 3 || thirdPacket.data[0] !== 5) {
      return;
    }
    const lacingValues = [];
    const addBytesToSegmentTable = (bytes) => {
      while (true) {
        lacingValues.push(Math.min(255, bytes));
        if (bytes < 255) {
          break;
        }
        bytes -= 255;
      }
    };
    addBytesToSegmentTable(firstPacket.data.length);
    addBytesToSegmentTable(secondPacket.data.length);
    const description = new Uint8Array(1 + lacingValues.length + firstPacket.data.length + secondPacket.data.length + thirdPacket.data.length);
    description[0] = 2;
    description.set(lacingValues, 1);
    description.set(firstPacket.data, 1 + lacingValues.length);
    description.set(secondPacket.data, 1 + lacingValues.length + firstPacket.data.length);
    description.set(thirdPacket.data, 1 + lacingValues.length + firstPacket.data.length + secondPacket.data.length);
    bitstream.codecInfo.codec = "vorbis";
    bitstream.description = description;
    bitstream.lastMetadataPacket = thirdPacket;
    const view = toDataView(firstPacket.data);
    bitstream.numberOfChannels = view.getUint8(11);
    bitstream.sampleRate = view.getUint32(12, true);
    const blockSizeByte = view.getUint8(28);
    bitstream.codecInfo.vorbisInfo = {
      blocksizes: [
        1 << (blockSizeByte & 15),
        1 << (blockSizeByte >> 4)
      ],
      modeBlockflags: parseModesFromVorbisSetupPacket(thirdPacket.data).modeBlockflags
    };
    readVorbisComments(secondPacket.data.subarray(7), this.metadataTags);
  }
  async readOpusMetadata(firstPacket, bitstream) {
    const nextPacketPosition = await this.findNextPacketStart(firstPacket);
    if (!nextPacketPosition) {
      return;
    }
    const secondPacket = await this.readPacket(nextPacketPosition.startPage, nextPacketPosition.startSegmentIndex);
    if (!secondPacket) {
      return;
    }
    bitstream.codecInfo.codec = "opus";
    bitstream.description = firstPacket.data;
    bitstream.lastMetadataPacket = secondPacket;
    const header = parseOpusIdentificationHeader(firstPacket.data);
    bitstream.numberOfChannels = header.outputChannelCount;
    bitstream.sampleRate = OPUS_SAMPLE_RATE;
    bitstream.codecInfo.opusInfo = {
      preSkip: header.preSkip
    };
    readVorbisComments(secondPacket.data.subarray(8), this.metadataTags);
  }
  async readPacket(startPage, startSegmentIndex) {
    assert(startSegmentIndex < startPage.lacingValues.length);
    let startDataOffset = 0;
    for (let i = 0; i < startSegmentIndex; i++) {
      startDataOffset += startPage.lacingValues[i];
    }
    let currentPage = startPage;
    let currentDataOffset = startDataOffset;
    let currentSegmentIndex = startSegmentIndex;
    const chunks = [];
    outer: while (true) {
      let pageSlice = this.reader.requestSlice(currentPage.dataStartPos, currentPage.dataSize);
      if (pageSlice instanceof Promise)
        pageSlice = await pageSlice;
      assert(pageSlice);
      const pageData = readBytes(pageSlice, currentPage.dataSize);
      while (true) {
        if (currentSegmentIndex === currentPage.lacingValues.length) {
          chunks.push(pageData.subarray(startDataOffset, currentDataOffset));
          break;
        }
        const lacingValue = currentPage.lacingValues[currentSegmentIndex];
        currentDataOffset += lacingValue;
        if (lacingValue < 255) {
          chunks.push(pageData.subarray(startDataOffset, currentDataOffset));
          break outer;
        }
        currentSegmentIndex++;
      }
      let currentPos = currentPage.headerStartPos + currentPage.totalSize;
      while (true) {
        let headerSlice = this.reader.requestSliceRange(currentPos, MIN_PAGE_HEADER_SIZE, MAX_PAGE_HEADER_SIZE);
        if (headerSlice instanceof Promise)
          headerSlice = await headerSlice;
        if (!headerSlice) {
          return null;
        }
        const nextPage = readPageHeader(headerSlice);
        if (!nextPage) {
          return null;
        }
        currentPage = nextPage;
        if (currentPage.serialNumber === startPage.serialNumber) {
          break;
        }
        currentPos = currentPage.headerStartPos + currentPage.totalSize;
      }
      startDataOffset = 0;
      currentDataOffset = 0;
      currentSegmentIndex = 0;
    }
    const totalPacketSize = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    if (totalPacketSize === 0) {
      return null;
    }
    const packetData = new Uint8Array(totalPacketSize);
    let offset = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      packetData.set(chunk, offset);
      offset += chunk.length;
    }
    return {
      data: packetData,
      endPage: currentPage,
      endSegmentIndex: currentSegmentIndex
    };
  }
  async findNextPacketStart(lastPacket) {
    if (lastPacket.endSegmentIndex < lastPacket.endPage.lacingValues.length - 1) {
      return { startPage: lastPacket.endPage, startSegmentIndex: lastPacket.endSegmentIndex + 1 };
    }
    const isEos = !!(lastPacket.endPage.headerType & 4);
    if (isEos) {
      return null;
    }
    let currentPos = lastPacket.endPage.headerStartPos + lastPacket.endPage.totalSize;
    while (true) {
      let slice = this.reader.requestSliceRange(currentPos, MIN_PAGE_HEADER_SIZE, MAX_PAGE_HEADER_SIZE);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice) {
        return null;
      }
      const nextPage = readPageHeader(slice);
      if (!nextPage) {
        return null;
      }
      if (nextPage.serialNumber === lastPacket.endPage.serialNumber) {
        return { startPage: nextPage, startSegmentIndex: 0 };
      }
      currentPos = nextPage.headerStartPos + nextPage.totalSize;
    }
  }
  async getMimeType() {
    await this.readMetadata();
    const codecStrings = await Promise.all(this.tracks.map((x) => x.getCodecParameterString()));
    return buildOggMimeType({
      codecStrings: codecStrings.filter(Boolean)
    });
  }
  async getTracks() {
    await this.readMetadata();
    return this.tracks;
  }
  async computeDuration() {
    const tracks = await this.getTracks();
    const trackDurations = await Promise.all(tracks.map((x) => x.computeDuration()));
    return Math.max(0, ...trackDurations);
  }
  async getMetadataTags() {
    await this.readMetadata();
    return this.metadataTags;
  }
}
class OggAudioTrackBacking {
  constructor(bitstream, demuxer) {
    this.bitstream = bitstream;
    this.demuxer = demuxer;
    this.encodedPacketToMetadata = /* @__PURE__ */ new WeakMap();
    this.sequentialScanCache = [];
    this.sequentialScanMutex = new AsyncMutex();
    this.internalSampleRate = bitstream.codecInfo.codec === "opus" ? OPUS_SAMPLE_RATE : bitstream.sampleRate;
  }
  getId() {
    return this.bitstream.serialNumber;
  }
  getNumberOfChannels() {
    return this.bitstream.numberOfChannels;
  }
  getSampleRate() {
    return this.bitstream.sampleRate;
  }
  getTimeResolution() {
    return this.bitstream.sampleRate;
  }
  getCodec() {
    return this.bitstream.codecInfo.codec;
  }
  getInternalCodecId() {
    return null;
  }
  async getDecoderConfig() {
    assert(this.bitstream.codecInfo.codec);
    return {
      codec: this.bitstream.codecInfo.codec,
      numberOfChannels: this.bitstream.numberOfChannels,
      sampleRate: this.bitstream.sampleRate,
      description: this.bitstream.description ?? void 0
    };
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return UNDETERMINED_LANGUAGE;
  }
  getDisposition() {
    return {
      ...DEFAULT_TRACK_DISPOSITION
    };
  }
  async getFirstTimestamp() {
    return 0;
  }
  async computeDuration() {
    const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
    return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
  }
  granulePositionToTimestampInSamples(granulePosition) {
    if (this.bitstream.codecInfo.codec === "opus") {
      assert(this.bitstream.codecInfo.opusInfo);
      return granulePosition - this.bitstream.codecInfo.opusInfo.preSkip;
    }
    return granulePosition;
  }
  createEncodedPacketFromOggPacket(packet, additional, options) {
    if (!packet) {
      return null;
    }
    const { durationInSamples, vorbisBlockSize } = extractSampleMetadata(packet.data, this.bitstream.codecInfo, additional.vorbisLastBlocksize);
    const encodedPacket = new EncodedPacket(options.metadataOnly ? PLACEHOLDER_DATA : packet.data, "key", Math.max(0, additional.timestampInSamples) / this.internalSampleRate, durationInSamples / this.internalSampleRate, packet.endPage.headerStartPos + packet.endSegmentIndex, packet.data.byteLength);
    this.encodedPacketToMetadata.set(encodedPacket, {
      packet,
      timestampInSamples: additional.timestampInSamples,
      durationInSamples,
      vorbisLastBlockSize: additional.vorbisLastBlocksize,
      vorbisBlockSize
    });
    return encodedPacket;
  }
  async getFirstPacket(options) {
    assert(this.bitstream.lastMetadataPacket);
    const packetPosition = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
    if (!packetPosition) {
      return null;
    }
    let timestampInSamples = 0;
    if (this.bitstream.codecInfo.codec === "opus") {
      assert(this.bitstream.codecInfo.opusInfo);
      timestampInSamples -= this.bitstream.codecInfo.opusInfo.preSkip;
    }
    const packet = await this.demuxer.readPacket(packetPosition.startPage, packetPosition.startSegmentIndex);
    return this.createEncodedPacketFromOggPacket(packet, {
      timestampInSamples,
      vorbisLastBlocksize: null
    }, options);
  }
  async getNextPacket(prevPacket, options) {
    const prevMetadata = this.encodedPacketToMetadata.get(prevPacket);
    if (!prevMetadata) {
      throw new Error("Packet was not created from this track.");
    }
    const packetPosition = await this.demuxer.findNextPacketStart(prevMetadata.packet);
    if (!packetPosition) {
      return null;
    }
    const timestampInSamples = prevMetadata.timestampInSamples + prevMetadata.durationInSamples;
    const packet = await this.demuxer.readPacket(packetPosition.startPage, packetPosition.startSegmentIndex);
    return this.createEncodedPacketFromOggPacket(packet, {
      timestampInSamples,
      vorbisLastBlocksize: prevMetadata.vorbisBlockSize
    }, options);
  }
  async getPacket(timestamp, options) {
    if (this.demuxer.reader.fileSize === null) {
      return this.getPacketSequential(timestamp, options);
    }
    const timestampInSamples = roundIfAlmostInteger(timestamp * this.internalSampleRate);
    if (timestampInSamples === 0) {
      return this.getFirstPacket(options);
    }
    if (timestampInSamples < 0) {
      return null;
    }
    assert(this.bitstream.lastMetadataPacket);
    const startPosition = await this.demuxer.findNextPacketStart(this.bitstream.lastMetadataPacket);
    if (!startPosition) {
      return null;
    }
    let lowPage = startPosition.startPage;
    let high = this.demuxer.reader.fileSize;
    const lowPages = [lowPage];
    outer: while (lowPage.headerStartPos + lowPage.totalSize < high) {
      const low = lowPage.headerStartPos;
      const mid = Math.floor((low + high) / 2);
      let searchStartPos = mid;
      while (true) {
        const until = Math.min(searchStartPos + MAX_PAGE_SIZE, high - MIN_PAGE_HEADER_SIZE);
        let searchSlice = this.demuxer.reader.requestSlice(searchStartPos, until - searchStartPos);
        if (searchSlice instanceof Promise)
          searchSlice = await searchSlice;
        assert(searchSlice);
        const found = findNextPageHeader(searchSlice, until);
        if (!found) {
          high = mid + MIN_PAGE_HEADER_SIZE;
          continue outer;
        }
        let headerSlice = this.demuxer.reader.requestSliceRange(searchSlice.filePos, MIN_PAGE_HEADER_SIZE, MAX_PAGE_HEADER_SIZE);
        if (headerSlice instanceof Promise)
          headerSlice = await headerSlice;
        assert(headerSlice);
        const page = readPageHeader(headerSlice);
        assert(page);
        let pageValid = false;
        if (page.serialNumber === this.bitstream.serialNumber) {
          pageValid = true;
        } else {
          let pageSlice = this.demuxer.reader.requestSlice(page.headerStartPos, page.totalSize);
          if (pageSlice instanceof Promise)
            pageSlice = await pageSlice;
          assert(pageSlice);
          const bytes = readBytes(pageSlice, page.totalSize);
          const crc = computeOggPageCrc(bytes);
          pageValid = crc === page.checksum;
        }
        if (!pageValid) {
          searchStartPos = page.headerStartPos + 4;
          continue;
        }
        if (pageValid && page.serialNumber !== this.bitstream.serialNumber) {
          searchStartPos = page.headerStartPos + page.totalSize;
          continue;
        }
        const isContinuationPage = page.granulePosition === -1;
        if (isContinuationPage) {
          searchStartPos = page.headerStartPos + page.totalSize;
          continue;
        }
        if (this.granulePositionToTimestampInSamples(page.granulePosition) > timestampInSamples) {
          high = page.headerStartPos;
        } else {
          lowPage = page;
          lowPages.push(page);
        }
        continue outer;
      }
    }
    let lowerPage = startPosition.startPage;
    for (const otherLowPage of lowPages) {
      if (otherLowPage.granulePosition === lowPage.granulePosition) {
        break;
      }
      if (!lowerPage || otherLowPage.headerStartPos > lowerPage.headerStartPos) {
        lowerPage = otherLowPage;
      }
    }
    let currentPage = lowerPage;
    const previousPages = [currentPage];
    while (true) {
      if (currentPage.serialNumber === this.bitstream.serialNumber && currentPage.granulePosition === lowPage.granulePosition) {
        break;
      }
      const nextPos = currentPage.headerStartPos + currentPage.totalSize;
      let slice = this.demuxer.reader.requestSliceRange(nextPos, MIN_PAGE_HEADER_SIZE, MAX_PAGE_HEADER_SIZE);
      if (slice instanceof Promise)
        slice = await slice;
      assert(slice);
      const nextPage = readPageHeader(slice);
      assert(nextPage);
      currentPage = nextPage;
      if (currentPage.serialNumber === this.bitstream.serialNumber) {
        previousPages.push(currentPage);
      }
    }
    assert(currentPage.granulePosition !== -1);
    let currentSegmentIndex = null;
    let currentTimestampInSamples;
    let currentTimestampIsCorrect;
    let endPage = currentPage;
    let endSegmentIndex = 0;
    if (currentPage.headerStartPos === startPosition.startPage.headerStartPos) {
      currentTimestampInSamples = this.granulePositionToTimestampInSamples(0);
      currentTimestampIsCorrect = true;
      currentSegmentIndex = 0;
    } else {
      currentTimestampInSamples = 0;
      currentTimestampIsCorrect = false;
      for (let i = currentPage.lacingValues.length - 1; i >= 0; i--) {
        const value = currentPage.lacingValues[i];
        if (value < 255) {
          currentSegmentIndex = i + 1;
          break;
        }
      }
      if (currentSegmentIndex === null) {
        throw new Error("Invalid page with granule position: no packets end on this page.");
      }
      endSegmentIndex = currentSegmentIndex - 1;
      const pseudopacket = {
        data: PLACEHOLDER_DATA,
        endPage,
        endSegmentIndex
      };
      const nextPosition = await this.demuxer.findNextPacketStart(pseudopacket);
      if (nextPosition) {
        const endPosition = findPreviousPacketEndPosition(previousPages, currentPage, currentSegmentIndex);
        assert(endPosition);
        const startPosition2 = findPacketStartPosition(previousPages, endPosition.page, endPosition.segmentIndex);
        if (startPosition2) {
          currentPage = startPosition2.page;
          currentSegmentIndex = startPosition2.segmentIndex;
        }
      } else {
        while (true) {
          const endPosition = findPreviousPacketEndPosition(previousPages, currentPage, currentSegmentIndex);
          if (!endPosition) {
            break;
          }
          const startPosition2 = findPacketStartPosition(previousPages, endPosition.page, endPosition.segmentIndex);
          if (!startPosition2) {
            break;
          }
          currentPage = startPosition2.page;
          currentSegmentIndex = startPosition2.segmentIndex;
          if (endPosition.page.headerStartPos !== endPage.headerStartPos) {
            endPage = endPosition.page;
            endSegmentIndex = endPosition.segmentIndex;
            break;
          }
        }
      }
    }
    let lastEncodedPacket = null;
    let lastEncodedPacketMetadata = null;
    while (currentPage !== null) {
      assert(currentSegmentIndex !== null);
      const packet = await this.demuxer.readPacket(currentPage, currentSegmentIndex);
      if (!packet) {
        break;
      }
      const skipPacket = currentPage.headerStartPos === startPosition.startPage.headerStartPos && currentSegmentIndex < startPosition.startSegmentIndex;
      if (!skipPacket) {
        let encodedPacket = this.createEncodedPacketFromOggPacket(packet, {
          timestampInSamples: currentTimestampInSamples,
          vorbisLastBlocksize: lastEncodedPacketMetadata?.vorbisBlockSize ?? null
        }, options);
        assert(encodedPacket);
        let encodedPacketMetadata = this.encodedPacketToMetadata.get(encodedPacket);
        assert(encodedPacketMetadata);
        if (!currentTimestampIsCorrect && packet.endPage.headerStartPos === endPage.headerStartPos && packet.endSegmentIndex === endSegmentIndex) {
          currentTimestampInSamples = this.granulePositionToTimestampInSamples(currentPage.granulePosition);
          currentTimestampIsCorrect = true;
          encodedPacket = this.createEncodedPacketFromOggPacket(packet, {
            timestampInSamples: currentTimestampInSamples - encodedPacketMetadata.durationInSamples,
            vorbisLastBlocksize: lastEncodedPacketMetadata?.vorbisBlockSize ?? null
          }, options);
          assert(encodedPacket);
          encodedPacketMetadata = this.encodedPacketToMetadata.get(encodedPacket);
          assert(encodedPacketMetadata);
        } else {
          currentTimestampInSamples += encodedPacketMetadata.durationInSamples;
        }
        lastEncodedPacket = encodedPacket;
        lastEncodedPacketMetadata = encodedPacketMetadata;
        if (currentTimestampIsCorrect && // Next timestamp will be too late
        (Math.max(currentTimestampInSamples, 0) > timestampInSamples || Math.max(encodedPacketMetadata.timestampInSamples, 0) === timestampInSamples)) {
          break;
        }
      }
      const nextPosition = await this.demuxer.findNextPacketStart(packet);
      if (!nextPosition) {
        break;
      }
      currentPage = nextPosition.startPage;
      currentSegmentIndex = nextPosition.startSegmentIndex;
    }
    return lastEncodedPacket;
  }
  // A slower but simpler and sequential algorithm for finding a packet in a file
  async getPacketSequential(timestamp, options) {
    const release = await this.sequentialScanMutex.acquire();
    try {
      const timestampInSamples = roundIfAlmostInteger(timestamp * this.internalSampleRate);
      timestamp = timestampInSamples / this.internalSampleRate;
      const index = binarySearchLessOrEqual(this.sequentialScanCache, timestampInSamples, (x) => x.timestampInSamples);
      let currentPacket;
      if (index !== -1) {
        const cacheEntry = this.sequentialScanCache[index];
        currentPacket = this.createEncodedPacketFromOggPacket(cacheEntry.packet, {
          timestampInSamples: cacheEntry.timestampInSamples,
          vorbisLastBlocksize: cacheEntry.vorbisLastBlockSize
        }, options);
      } else {
        currentPacket = await this.getFirstPacket(options);
      }
      let i = 0;
      while (currentPacket && currentPacket.timestamp < timestamp) {
        const nextPacket = await this.getNextPacket(currentPacket, options);
        if (!nextPacket || nextPacket.timestamp > timestamp) {
          break;
        }
        currentPacket = nextPacket;
        i++;
        if (i === 100) {
          i = 0;
          const metadata = this.encodedPacketToMetadata.get(currentPacket);
          assert(metadata);
          if (this.sequentialScanCache.length > 0) {
            assert(last(this.sequentialScanCache).timestampInSamples <= metadata.timestampInSamples);
          }
          this.sequentialScanCache.push(metadata);
        }
      }
      return currentPacket;
    } finally {
      release();
    }
  }
  getKeyPacket(timestamp, options) {
    return this.getPacket(timestamp, options);
  }
  getNextKeyPacket(packet, options) {
    return this.getNextPacket(packet, options);
  }
}
const findPacketStartPosition = (pageList, endPage, endSegmentIndex) => {
  let page = endPage;
  let segmentIndex = endSegmentIndex;
  outer: while (true) {
    segmentIndex--;
    for (segmentIndex; segmentIndex >= 0; segmentIndex--) {
      const lacingValue = page.lacingValues[segmentIndex];
      if (lacingValue < 255) {
        segmentIndex++;
        break outer;
      }
    }
    assert(segmentIndex === -1);
    const pageStartsWithFreshPacket = !(page.headerType & 1);
    if (pageStartsWithFreshPacket) {
      segmentIndex = 0;
      break;
    }
    const previousPage = findLast(pageList, (x) => x.headerStartPos < page.headerStartPos);
    if (!previousPage) {
      return null;
    }
    page = previousPage;
    segmentIndex = page.lacingValues.length;
  }
  assert(segmentIndex !== -1);
  if (segmentIndex === page.lacingValues.length) {
    const nextPage = pageList[pageList.indexOf(page) + 1];
    assert(nextPage);
    page = nextPage;
    segmentIndex = 0;
  }
  return { page, segmentIndex };
};
const findPreviousPacketEndPosition = (pageList, startPage, startSegmentIndex) => {
  if (startSegmentIndex > 0) {
    return { page: startPage, segmentIndex: startSegmentIndex - 1 };
  }
  const previousPage = findLast(pageList, (x) => x.headerStartPos < startPage.headerStartPos);
  if (!previousPage) {
    return null;
  }
  return { page: previousPage, segmentIndex: previousPage.lacingValues.length - 1 };
};
var WaveFormat;
(function(WaveFormat2) {
  WaveFormat2[WaveFormat2["PCM"] = 1] = "PCM";
  WaveFormat2[WaveFormat2["IEEE_FLOAT"] = 3] = "IEEE_FLOAT";
  WaveFormat2[WaveFormat2["ALAW"] = 6] = "ALAW";
  WaveFormat2[WaveFormat2["MULAW"] = 7] = "MULAW";
  WaveFormat2[WaveFormat2["EXTENSIBLE"] = 65534] = "EXTENSIBLE";
})(WaveFormat || (WaveFormat = {}));
class WaveDemuxer extends Demuxer {
  constructor(input) {
    super(input);
    this.metadataPromise = null;
    this.dataStart = -1;
    this.dataSize = -1;
    this.audioInfo = null;
    this.tracks = [];
    this.lastKnownPacketIndex = 0;
    this.metadataTags = {};
    this.reader = input._reader;
  }
  async readMetadata() {
    return this.metadataPromise ?? (this.metadataPromise = (async () => {
      let slice = this.reader.requestSlice(0, 12);
      if (slice instanceof Promise)
        slice = await slice;
      assert(slice);
      const riffType = readAscii(slice, 4);
      const littleEndian = riffType !== "RIFX";
      const isRf64 = riffType === "RF64";
      const outerChunkSize = readU32(slice, littleEndian);
      let totalFileSize = isRf64 ? this.reader.fileSize : Math.min(outerChunkSize + 8, this.reader.fileSize ?? Infinity);
      const format = readAscii(slice, 4);
      if (format !== "WAVE") {
        throw new Error("Invalid WAVE file - wrong format");
      }
      let chunksRead = 0;
      let dataChunkSize = null;
      let currentPos = slice.filePos;
      while (totalFileSize === null || currentPos < totalFileSize) {
        let slice2 = this.reader.requestSlice(currentPos, 8);
        if (slice2 instanceof Promise)
          slice2 = await slice2;
        if (!slice2)
          break;
        const chunkId = readAscii(slice2, 4);
        const chunkSize = readU32(slice2, littleEndian);
        const startPos = slice2.filePos;
        if (isRf64 && chunksRead === 0 && chunkId !== "ds64") {
          throw new Error('Invalid RF64 file: First chunk must be "ds64".');
        }
        if (chunkId === "fmt ") {
          await this.parseFmtChunk(startPos, chunkSize, littleEndian);
        } else if (chunkId === "data") {
          dataChunkSize ?? (dataChunkSize = chunkSize);
          this.dataStart = slice2.filePos;
          this.dataSize = Math.min(dataChunkSize, (totalFileSize ?? Infinity) - this.dataStart);
          if (this.reader.fileSize === null) {
            break;
          }
        } else if (chunkId === "ds64") {
          let ds64Slice = this.reader.requestSlice(startPos, chunkSize);
          if (ds64Slice instanceof Promise)
            ds64Slice = await ds64Slice;
          if (!ds64Slice)
            break;
          const riffChunkSize = readU64(ds64Slice, littleEndian);
          dataChunkSize = readU64(ds64Slice, littleEndian);
          totalFileSize = Math.min(riffChunkSize + 8, this.reader.fileSize ?? Infinity);
        } else if (chunkId === "LIST") {
          await this.parseListChunk(startPos, chunkSize, littleEndian);
        } else if (chunkId === "ID3 " || chunkId === "id3 ") {
          await this.parseId3Chunk(startPos, chunkSize);
        }
        currentPos = startPos + chunkSize + (chunkSize & 1);
        chunksRead++;
      }
      if (!this.audioInfo) {
        throw new Error('Invalid WAVE file - missing "fmt " chunk');
      }
      if (this.dataStart === -1) {
        throw new Error('Invalid WAVE file - missing "data" chunk');
      }
      const blockSize = this.audioInfo.blockSizeInBytes;
      this.dataSize = Math.floor(this.dataSize / blockSize) * blockSize;
      this.tracks.push(new InputAudioTrack(this.input, new WaveAudioTrackBacking(this)));
    })());
  }
  async parseFmtChunk(startPos, size, littleEndian) {
    let slice = this.reader.requestSlice(startPos, size);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return;
    let formatTag = readU16(slice, littleEndian);
    const numChannels = readU16(slice, littleEndian);
    const sampleRate = readU32(slice, littleEndian);
    slice.skip(4);
    const blockAlign = readU16(slice, littleEndian);
    let bitsPerSample;
    if (size === 14) {
      bitsPerSample = 8;
    } else {
      bitsPerSample = readU16(slice, littleEndian);
    }
    if (size >= 18 && formatTag !== 357) {
      const cbSize = readU16(slice, littleEndian);
      const remainingSize = size - 18;
      const extensionSize = Math.min(remainingSize, cbSize);
      if (extensionSize >= 22 && formatTag === WaveFormat.EXTENSIBLE) {
        slice.skip(2 + 4);
        const subFormat = readBytes(slice, 16);
        formatTag = subFormat[0] | subFormat[1] << 8;
      }
    }
    if (formatTag === WaveFormat.MULAW || formatTag === WaveFormat.ALAW) {
      bitsPerSample = 8;
    }
    this.audioInfo = {
      format: formatTag,
      numberOfChannels: numChannels,
      sampleRate,
      sampleSizeInBytes: Math.ceil(bitsPerSample / 8),
      blockSizeInBytes: blockAlign
    };
  }
  async parseListChunk(startPos, size, littleEndian) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    let slice = this.reader.requestSlice(startPos, size);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return;
    const infoType = readAscii(slice, 4);
    if (infoType !== "INFO" && infoType !== "INF0") {
      return;
    }
    let currentPos = slice.filePos;
    while (currentPos <= startPos + size - 8) {
      slice.filePos = currentPos;
      const chunkName = readAscii(slice, 4);
      const chunkSize = readU32(slice, littleEndian);
      const bytes = readBytes(slice, chunkSize);
      let stringLength = 0;
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] === 0) {
          break;
        }
        stringLength++;
      }
      const value = String.fromCharCode(...bytes.subarray(0, stringLength));
      (_a = this.metadataTags).raw ?? (_a.raw = {});
      this.metadataTags.raw[chunkName] = value;
      switch (chunkName) {
        case "INAM":
        case "TITL":
          {
            (_b = this.metadataTags).title ?? (_b.title = value);
          }
          break;
        case "TIT3":
          {
            (_c = this.metadataTags).description ?? (_c.description = value);
          }
          break;
        case "IART":
          {
            (_d = this.metadataTags).artist ?? (_d.artist = value);
          }
          break;
        case "IPRD":
          {
            (_e = this.metadataTags).album ?? (_e.album = value);
          }
          break;
        case "IPRT":
        case "ITRK":
        case "TRCK":
          {
            const parts = value.split("/");
            const trackNum = Number.parseInt(parts[0], 10);
            const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
            if (Number.isInteger(trackNum) && trackNum > 0) {
              (_f = this.metadataTags).trackNumber ?? (_f.trackNumber = trackNum);
            }
            if (tracksTotal && Number.isInteger(tracksTotal) && tracksTotal > 0) {
              (_g = this.metadataTags).tracksTotal ?? (_g.tracksTotal = tracksTotal);
            }
          }
          break;
        case "ICRD":
        case "IDIT":
          {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) {
              (_h = this.metadataTags).date ?? (_h.date = date);
            }
          }
          break;
        case "YEAR":
          {
            const year = Number.parseInt(value, 10);
            if (Number.isInteger(year) && year > 0) {
              (_i = this.metadataTags).date ?? (_i.date = new Date(year, 0, 1));
            }
          }
          break;
        case "IGNR":
        case "GENR":
          {
            (_j = this.metadataTags).genre ?? (_j.genre = value);
          }
          break;
        case "ICMT":
        case "CMNT":
        case "COMM":
          {
            (_k = this.metadataTags).comment ?? (_k.comment = value);
          }
          break;
      }
      currentPos += 8 + chunkSize + (chunkSize & 1);
    }
  }
  async parseId3Chunk(startPos, size) {
    let slice = this.reader.requestSlice(startPos, size);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return;
    const id3V2Header = readId3V2Header(slice);
    if (id3V2Header) {
      const contentSlice = slice.slice(startPos + 10, id3V2Header.size);
      parseId3V2Tag(contentSlice, id3V2Header, this.metadataTags);
    }
  }
  getCodec() {
    assert(this.audioInfo);
    if (this.audioInfo.format === WaveFormat.MULAW) {
      return "ulaw";
    }
    if (this.audioInfo.format === WaveFormat.ALAW) {
      return "alaw";
    }
    if (this.audioInfo.format === WaveFormat.PCM) {
      if (this.audioInfo.sampleSizeInBytes === 1) {
        return "pcm-u8";
      } else if (this.audioInfo.sampleSizeInBytes === 2) {
        return "pcm-s16";
      } else if (this.audioInfo.sampleSizeInBytes === 3) {
        return "pcm-s24";
      } else if (this.audioInfo.sampleSizeInBytes === 4) {
        return "pcm-s32";
      }
    }
    if (this.audioInfo.format === WaveFormat.IEEE_FLOAT) {
      if (this.audioInfo.sampleSizeInBytes === 4) {
        return "pcm-f32";
      }
    }
    return null;
  }
  async getMimeType() {
    return "audio/wav";
  }
  async computeDuration() {
    await this.readMetadata();
    const track = this.tracks[0];
    assert(track);
    return track.computeDuration();
  }
  async getTracks() {
    await this.readMetadata();
    return this.tracks;
  }
  async getMetadataTags() {
    await this.readMetadata();
    return this.metadataTags;
  }
}
const PACKET_SIZE_IN_FRAMES = 2048;
class WaveAudioTrackBacking {
  constructor(demuxer) {
    this.demuxer = demuxer;
  }
  getId() {
    return 1;
  }
  getCodec() {
    return this.demuxer.getCodec();
  }
  getInternalCodecId() {
    assert(this.demuxer.audioInfo);
    return this.demuxer.audioInfo.format;
  }
  async getDecoderConfig() {
    const codec = this.demuxer.getCodec();
    if (!codec) {
      return null;
    }
    assert(this.demuxer.audioInfo);
    return {
      codec,
      numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
      sampleRate: this.demuxer.audioInfo.sampleRate
    };
  }
  async computeDuration() {
    const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
    return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
  }
  getNumberOfChannels() {
    assert(this.demuxer.audioInfo);
    return this.demuxer.audioInfo.numberOfChannels;
  }
  getSampleRate() {
    assert(this.demuxer.audioInfo);
    return this.demuxer.audioInfo.sampleRate;
  }
  getTimeResolution() {
    assert(this.demuxer.audioInfo);
    return this.demuxer.audioInfo.sampleRate;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return UNDETERMINED_LANGUAGE;
  }
  getDisposition() {
    return {
      ...DEFAULT_TRACK_DISPOSITION
    };
  }
  async getFirstTimestamp() {
    return 0;
  }
  async getPacketAtIndex(packetIndex, options) {
    assert(this.demuxer.audioInfo);
    const startOffset = packetIndex * PACKET_SIZE_IN_FRAMES * this.demuxer.audioInfo.blockSizeInBytes;
    if (startOffset >= this.demuxer.dataSize) {
      return null;
    }
    const sizeInBytes = Math.min(PACKET_SIZE_IN_FRAMES * this.demuxer.audioInfo.blockSizeInBytes, this.demuxer.dataSize - startOffset);
    if (this.demuxer.reader.fileSize === null) {
      let slice = this.demuxer.reader.requestSlice(this.demuxer.dataStart + startOffset, sizeInBytes);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice) {
        return null;
      }
    }
    let data;
    if (options.metadataOnly) {
      data = PLACEHOLDER_DATA;
    } else {
      let slice = this.demuxer.reader.requestSlice(this.demuxer.dataStart + startOffset, sizeInBytes);
      if (slice instanceof Promise)
        slice = await slice;
      assert(slice);
      data = readBytes(slice, sizeInBytes);
    }
    const timestamp = packetIndex * PACKET_SIZE_IN_FRAMES / this.demuxer.audioInfo.sampleRate;
    const duration = sizeInBytes / this.demuxer.audioInfo.blockSizeInBytes / this.demuxer.audioInfo.sampleRate;
    this.demuxer.lastKnownPacketIndex = Math.max(packetIndex, timestamp);
    return new EncodedPacket(data, "key", timestamp, duration, packetIndex, sizeInBytes);
  }
  getFirstPacket(options) {
    return this.getPacketAtIndex(0, options);
  }
  async getPacket(timestamp, options) {
    assert(this.demuxer.audioInfo);
    const packetIndex = Math.floor(Math.min(timestamp * this.demuxer.audioInfo.sampleRate / PACKET_SIZE_IN_FRAMES, (this.demuxer.dataSize - 1) / (PACKET_SIZE_IN_FRAMES * this.demuxer.audioInfo.blockSizeInBytes)));
    const packet = await this.getPacketAtIndex(packetIndex, options);
    if (packet) {
      return packet;
    }
    if (packetIndex === 0) {
      return null;
    }
    assert(this.demuxer.reader.fileSize === null);
    let currentPacket = await this.getPacketAtIndex(this.demuxer.lastKnownPacketIndex, options);
    while (currentPacket) {
      const nextPacket = await this.getNextPacket(currentPacket, options);
      if (!nextPacket) {
        break;
      }
      currentPacket = nextPacket;
    }
    return currentPacket;
  }
  getNextPacket(packet, options) {
    assert(this.demuxer.audioInfo);
    const packetIndex = Math.round(packet.timestamp * this.demuxer.audioInfo.sampleRate / PACKET_SIZE_IN_FRAMES);
    return this.getPacketAtIndex(packetIndex + 1, options);
  }
  getKeyPacket(timestamp, options) {
    return this.getPacket(timestamp, options);
  }
  getNextKeyPacket(packet, options) {
    return this.getNextPacket(packet, options);
  }
}
const MIN_FRAME_HEADER_SIZE = 7;
const MAX_FRAME_HEADER_SIZE = 9;
const readFrameHeader = (slice) => {
  const startPos = slice.filePos;
  const bytes = readBytes(slice, 9);
  const bitstream = new Bitstream(bytes);
  const syncword = bitstream.readBits(12);
  if (syncword !== 4095) {
    return null;
  }
  bitstream.skipBits(1);
  const layer = bitstream.readBits(2);
  if (layer !== 0) {
    return null;
  }
  const protectionAbsence = bitstream.readBits(1);
  const objectType = bitstream.readBits(2) + 1;
  const samplingFrequencyIndex = bitstream.readBits(4);
  if (samplingFrequencyIndex === 15) {
    return null;
  }
  bitstream.skipBits(1);
  const channelConfiguration = bitstream.readBits(3);
  if (channelConfiguration === 0) {
    throw new Error("ADTS frames with channel configuration 0 are not supported.");
  }
  bitstream.skipBits(1);
  bitstream.skipBits(1);
  bitstream.skipBits(1);
  bitstream.skipBits(1);
  const frameLength = bitstream.readBits(13);
  bitstream.skipBits(11);
  const numberOfAacFrames = bitstream.readBits(2) + 1;
  if (numberOfAacFrames !== 1) {
    throw new Error("ADTS frames with more than one AAC frame are not supported.");
  }
  let crcCheck = null;
  if (protectionAbsence === 1) {
    slice.filePos -= 2;
  } else {
    crcCheck = bitstream.readBits(16);
  }
  return {
    objectType,
    samplingFrequencyIndex,
    channelConfiguration,
    frameLength,
    numberOfAacFrames,
    crcCheck,
    startPos
  };
};
const SAMPLES_PER_AAC_FRAME = 1024;
class AdtsDemuxer extends Demuxer {
  constructor(input) {
    super(input);
    this.metadataPromise = null;
    this.firstFrameHeader = null;
    this.loadedSamples = [];
    this.tracks = [];
    this.readingMutex = new AsyncMutex();
    this.lastSampleLoaded = false;
    this.lastLoadedPos = 0;
    this.nextTimestampInSamples = 0;
    this.reader = input._reader;
  }
  async readMetadata() {
    return this.metadataPromise ?? (this.metadataPromise = (async () => {
      while (!this.firstFrameHeader && !this.lastSampleLoaded) {
        await this.advanceReader();
      }
      assert(this.firstFrameHeader);
      this.tracks = [new InputAudioTrack(this.input, new AdtsAudioTrackBacking(this))];
    })());
  }
  async advanceReader() {
    let slice = this.reader.requestSliceRange(this.lastLoadedPos, MIN_FRAME_HEADER_SIZE, MAX_FRAME_HEADER_SIZE);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice) {
      this.lastSampleLoaded = true;
      return;
    }
    const header = readFrameHeader(slice);
    if (!header) {
      this.lastSampleLoaded = true;
      return;
    }
    if (this.reader.fileSize !== null && header.startPos + header.frameLength > this.reader.fileSize) {
      this.lastSampleLoaded = true;
      return;
    }
    if (!this.firstFrameHeader) {
      this.firstFrameHeader = header;
    }
    const sampleRate = aacFrequencyTable[header.samplingFrequencyIndex];
    assert(sampleRate !== void 0);
    const sampleDuration = SAMPLES_PER_AAC_FRAME / sampleRate;
    const headerSize = header.crcCheck ? MAX_FRAME_HEADER_SIZE : MIN_FRAME_HEADER_SIZE;
    const sample = {
      timestamp: this.nextTimestampInSamples / sampleRate,
      duration: sampleDuration,
      dataStart: header.startPos + headerSize,
      dataSize: header.frameLength - headerSize
    };
    this.loadedSamples.push(sample);
    this.nextTimestampInSamples += SAMPLES_PER_AAC_FRAME;
    this.lastLoadedPos = header.startPos + header.frameLength;
  }
  async getMimeType() {
    return "audio/aac";
  }
  async getTracks() {
    await this.readMetadata();
    return this.tracks;
  }
  async computeDuration() {
    await this.readMetadata();
    const track = this.tracks[0];
    assert(track);
    return track.computeDuration();
  }
  async getMetadataTags() {
    return {};
  }
}
class AdtsAudioTrackBacking {
  constructor(demuxer) {
    this.demuxer = demuxer;
  }
  getId() {
    return 1;
  }
  async getFirstTimestamp() {
    return 0;
  }
  getTimeResolution() {
    const sampleRate = this.getSampleRate();
    return sampleRate / SAMPLES_PER_AAC_FRAME;
  }
  async computeDuration() {
    const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
    return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return UNDETERMINED_LANGUAGE;
  }
  getCodec() {
    return "aac";
  }
  getInternalCodecId() {
    assert(this.demuxer.firstFrameHeader);
    return this.demuxer.firstFrameHeader.objectType;
  }
  getNumberOfChannels() {
    assert(this.demuxer.firstFrameHeader);
    const numberOfChannels = aacChannelMap[this.demuxer.firstFrameHeader.channelConfiguration];
    assert(numberOfChannels !== void 0);
    return numberOfChannels;
  }
  getSampleRate() {
    assert(this.demuxer.firstFrameHeader);
    const sampleRate = aacFrequencyTable[this.demuxer.firstFrameHeader.samplingFrequencyIndex];
    assert(sampleRate !== void 0);
    return sampleRate;
  }
  getDisposition() {
    return {
      ...DEFAULT_TRACK_DISPOSITION
    };
  }
  async getDecoderConfig() {
    assert(this.demuxer.firstFrameHeader);
    const bytes = new Uint8Array(3);
    const bitstream = new Bitstream(bytes);
    const { objectType, samplingFrequencyIndex, channelConfiguration } = this.demuxer.firstFrameHeader;
    if (objectType > 31) {
      bitstream.writeBits(5, 31);
      bitstream.writeBits(6, objectType - 32);
    } else {
      bitstream.writeBits(5, objectType);
    }
    bitstream.writeBits(4, samplingFrequencyIndex);
    bitstream.writeBits(4, channelConfiguration);
    return {
      codec: `mp4a.40.${this.demuxer.firstFrameHeader.objectType}`,
      numberOfChannels: this.getNumberOfChannels(),
      sampleRate: this.getSampleRate(),
      description: bytes.subarray(0, Math.ceil((bitstream.pos - 1) / 8))
    };
  }
  async getPacketAtIndex(sampleIndex, options) {
    if (sampleIndex === -1) {
      return null;
    }
    const rawSample = this.demuxer.loadedSamples[sampleIndex];
    if (!rawSample) {
      return null;
    }
    let data;
    if (options.metadataOnly) {
      data = PLACEHOLDER_DATA;
    } else {
      let slice = this.demuxer.reader.requestSlice(rawSample.dataStart, rawSample.dataSize);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice) {
        return null;
      }
      data = readBytes(slice, rawSample.dataSize);
    }
    return new EncodedPacket(data, "key", rawSample.timestamp, rawSample.duration, sampleIndex, rawSample.dataSize);
  }
  getFirstPacket(options) {
    return this.getPacketAtIndex(0, options);
  }
  async getNextPacket(packet, options) {
    const release = await this.demuxer.readingMutex.acquire();
    try {
      const sampleIndex = binarySearchExact(this.demuxer.loadedSamples, packet.timestamp, (x) => x.timestamp);
      if (sampleIndex === -1) {
        throw new Error("Packet was not created from this track.");
      }
      const nextIndex = sampleIndex + 1;
      while (nextIndex >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded) {
        await this.demuxer.advanceReader();
      }
      return this.getPacketAtIndex(nextIndex, options);
    } finally {
      release();
    }
  }
  async getPacket(timestamp, options) {
    const release = await this.demuxer.readingMutex.acquire();
    try {
      while (true) {
        const index = binarySearchLessOrEqual(this.demuxer.loadedSamples, timestamp, (x) => x.timestamp);
        if (index === -1 && this.demuxer.loadedSamples.length > 0) {
          return null;
        }
        if (this.demuxer.lastSampleLoaded) {
          return this.getPacketAtIndex(index, options);
        }
        if (index >= 0 && index + 1 < this.demuxer.loadedSamples.length) {
          return this.getPacketAtIndex(index, options);
        }
        await this.demuxer.advanceReader();
      }
    } finally {
      release();
    }
  }
  getKeyPacket(timestamp, options) {
    return this.getPacket(timestamp, options);
  }
  getNextKeyPacket(packet, options) {
    return this.getNextPacket(packet, options);
  }
}
const getBlockSizeOrUncommon = (bits) => {
  if (bits === 0) {
    return null;
  } else if (bits === 1) {
    return 192;
  } else if (bits >= 2 && bits <= 5) {
    return 144 * 2 ** bits;
  } else if (bits === 6) {
    return "uncommon-u8";
  } else if (bits === 7) {
    return "uncommon-u16";
  } else if (bits >= 8 && bits <= 15) {
    return 2 ** bits;
  } else {
    return null;
  }
};
const getSampleRateOrUncommon = (sampleRateBits, streamInfoSampleRate) => {
  switch (sampleRateBits) {
    case 0:
      return streamInfoSampleRate;
    case 1:
      return 88200;
    case 2:
      return 176400;
    case 3:
      return 192e3;
    case 4:
      return 8e3;
    case 5:
      return 16e3;
    case 6:
      return 22050;
    case 7:
      return 24e3;
    case 8:
      return 32e3;
    case 9:
      return 44100;
    case 10:
      return 48e3;
    case 11:
      return 96e3;
    case 12:
      return "uncommon-u8";
    case 13:
      return "uncommon-u16";
    case 14:
      return "uncommon-u16-10";
    default:
      return null;
  }
};
const readCodedNumber = (fileSlice) => {
  let ones = 0;
  const bitstream1 = new Bitstream(readBytes(fileSlice, 1));
  while (bitstream1.readBits(1) === 1) {
    ones++;
  }
  if (ones === 0) {
    return bitstream1.readBits(7);
  }
  const bitArray = [];
  const extraBytes = ones - 1;
  const bitstream2 = new Bitstream(readBytes(fileSlice, extraBytes));
  const firstByteBits = 8 - ones - 1;
  for (let i = 0; i < firstByteBits; i++) {
    bitArray.unshift(bitstream1.readBits(1));
  }
  for (let i = 0; i < extraBytes; i++) {
    for (let j = 0; j < 8; j++) {
      const val = bitstream2.readBits(1);
      if (j < 2) {
        continue;
      }
      bitArray.unshift(val);
    }
  }
  const encoded = bitArray.reduce((acc, bit, index) => {
    return acc | bit << index;
  }, 0);
  return encoded;
};
const readBlockSize = (slice, blockSizeBits) => {
  if (blockSizeBits === "uncommon-u16") {
    return readU16Be(slice) + 1;
  } else if (blockSizeBits === "uncommon-u8") {
    return readU8(slice) + 1;
  } else if (typeof blockSizeBits === "number") {
    return blockSizeBits;
  } else {
    assertNever(blockSizeBits);
    assert(false);
  }
};
const readSampleRate = (slice, sampleRateOrUncommon) => {
  if (sampleRateOrUncommon === "uncommon-u16") {
    return readU16Be(slice);
  }
  if (sampleRateOrUncommon === "uncommon-u16-10") {
    return readU16Be(slice) * 10;
  }
  if (sampleRateOrUncommon === "uncommon-u8") {
    return readU8(slice);
  }
  if (typeof sampleRateOrUncommon === "number") {
    return sampleRateOrUncommon;
  }
  return null;
};
const calculateCrc8 = (data) => {
  const polynomial = 7;
  let crc = 0;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) {
      if ((crc & 128) !== 0) {
        crc = crc << 1 ^ polynomial;
      } else {
        crc <<= 1;
      }
      crc &= 255;
    }
  }
  return crc;
};
class FlacDemuxer extends Demuxer {
  constructor(input) {
    super(input);
    this.loadedSamples = [];
    this.metadataPromise = null;
    this.track = null;
    this.metadataTags = {};
    this.audioInfo = null;
    this.lastLoadedPos = null;
    this.blockingBit = null;
    this.readingMutex = new AsyncMutex();
    this.lastSampleLoaded = false;
    this.reader = input._reader;
  }
  async computeDuration() {
    await this.readMetadata();
    assert(this.track);
    return this.track.computeDuration();
  }
  async getMetadataTags() {
    await this.readMetadata();
    return this.metadataTags;
  }
  async getTracks() {
    await this.readMetadata();
    assert(this.track);
    return [this.track];
  }
  async getMimeType() {
    return "audio/flac";
  }
  async readMetadata() {
    let currentPos = 4;
    return this.metadataPromise ?? (this.metadataPromise = (async () => {
      var _a;
      while (this.reader.fileSize === null || currentPos < this.reader.fileSize) {
        let sizeSlice = this.reader.requestSlice(currentPos, 4);
        if (sizeSlice instanceof Promise)
          sizeSlice = await sizeSlice;
        currentPos += 4;
        if (sizeSlice === null) {
          throw new Error(`Metadata block at position ${currentPos} is too small! Corrupted file.`);
        }
        assert(sizeSlice);
        const byte = readU8(sizeSlice);
        const size = readU24Be(sizeSlice);
        const isLastMetadata = (byte & 128) !== 0;
        const metaBlockType = byte & 127;
        switch (metaBlockType) {
          case FlacBlockType.STREAMINFO: {
            let streamInfoBlock = this.reader.requestSlice(currentPos, size);
            if (streamInfoBlock instanceof Promise)
              streamInfoBlock = await streamInfoBlock;
            assert(streamInfoBlock);
            if (streamInfoBlock === null) {
              throw new Error(`StreamInfo block at position ${currentPos} is too small! Corrupted file.`);
            }
            const streamInfoBytes = readBytes(streamInfoBlock, 34);
            const bitstream = new Bitstream(streamInfoBytes);
            const minimumBlockSize = bitstream.readBits(16);
            const maximumBlockSize = bitstream.readBits(16);
            const minimumFrameSize = bitstream.readBits(24);
            const maximumFrameSize = bitstream.readBits(24);
            const sampleRate = bitstream.readBits(20);
            const numberOfChannels = bitstream.readBits(3) + 1;
            bitstream.readBits(5);
            const totalSamples = bitstream.readBits(36);
            bitstream.skipBits(16 * 8);
            const description = new Uint8Array(42);
            description.set(new Uint8Array([102, 76, 97, 67]), 0);
            description.set(new Uint8Array([128, 0, 0, 34]), 4);
            description.set(streamInfoBytes, 8);
            this.audioInfo = {
              numberOfChannels,
              sampleRate,
              totalSamples,
              minimumBlockSize,
              maximumBlockSize,
              minimumFrameSize,
              maximumFrameSize,
              description
            };
            this.track = new InputAudioTrack(this.input, new FlacAudioTrackBacking(this));
            break;
          }
          case FlacBlockType.VORBIS_COMMENT: {
            let vorbisCommentBlock = this.reader.requestSlice(currentPos, size);
            if (vorbisCommentBlock instanceof Promise)
              vorbisCommentBlock = await vorbisCommentBlock;
            assert(vorbisCommentBlock);
            readVorbisComments(readBytes(vorbisCommentBlock, size), this.metadataTags);
            break;
          }
          case FlacBlockType.PICTURE: {
            let pictureBlock = this.reader.requestSlice(currentPos, size);
            if (pictureBlock instanceof Promise)
              pictureBlock = await pictureBlock;
            assert(pictureBlock);
            const pictureType = readU32Be(pictureBlock);
            const mediaTypeLength = readU32Be(pictureBlock);
            const mediaType = textDecoder.decode(readBytes(pictureBlock, mediaTypeLength));
            const descriptionLength = readU32Be(pictureBlock);
            const description = textDecoder.decode(readBytes(pictureBlock, descriptionLength));
            pictureBlock.skip(4 + 4 + 4 + 4);
            const dataLength = readU32Be(pictureBlock);
            const data = readBytes(pictureBlock, dataLength);
            (_a = this.metadataTags).images ?? (_a.images = []);
            this.metadataTags.images.push({
              data,
              mimeType: mediaType,
              // https://www.rfc-editor.org/rfc/rfc9639.html#table13
              kind: pictureType === 3 ? "coverFront" : pictureType === 4 ? "coverBack" : "unknown",
              description
            });
            break;
          }
        }
        currentPos += size;
        if (isLastMetadata) {
          this.lastLoadedPos = currentPos;
          break;
        }
      }
    })());
  }
  async readNextFlacFrame({ startPos, isFirstPacket }) {
    assert(this.audioInfo);
    const minimumHeaderLength = 6;
    const maximumHeaderSize = 16;
    const maximumSliceLength = this.audioInfo.maximumFrameSize + maximumHeaderSize;
    const slice = await this.reader.requestSliceRange(startPos, this.audioInfo.minimumFrameSize, maximumSliceLength);
    if (!slice) {
      return null;
    }
    const frameHeader = this.readFlacFrameHeader({
      slice,
      isFirstPacket
    });
    if (!frameHeader) {
      return null;
    }
    slice.filePos = startPos + this.audioInfo.minimumFrameSize;
    while (true) {
      if (slice.filePos > slice.end - minimumHeaderLength) {
        return {
          num: frameHeader.num,
          blockSize: frameHeader.blockSize,
          sampleRate: frameHeader.sampleRate,
          size: slice.end - startPos,
          isLastFrame: true
        };
      }
      const nextByte = readU8(slice);
      if (nextByte === 255) {
        const positionBeforeReading = slice.filePos;
        const byteAfterNextByte = readU8(slice);
        const expected = this.blockingBit === 1 ? 249 : 248;
        if (byteAfterNextByte !== expected) {
          slice.filePos = positionBeforeReading;
          continue;
        }
        slice.skip(-2);
        const lengthIfNextFlacFrameHeaderIsLegit = slice.filePos - startPos;
        const nextFrameHeader = this.readFlacFrameHeader({
          slice,
          isFirstPacket: false
        });
        if (!nextFrameHeader) {
          slice.filePos = positionBeforeReading;
          continue;
        }
        if (this.blockingBit === 0) {
          if (nextFrameHeader.num - frameHeader.num !== 1) {
            slice.filePos = positionBeforeReading;
            continue;
          }
        } else {
          if (nextFrameHeader.num - frameHeader.num !== frameHeader.blockSize) {
            slice.filePos = positionBeforeReading;
            continue;
          }
        }
        return {
          num: frameHeader.num,
          blockSize: frameHeader.blockSize,
          sampleRate: frameHeader.sampleRate,
          size: lengthIfNextFlacFrameHeaderIsLegit,
          isLastFrame: false
        };
      }
    }
  }
  readFlacFrameHeader({ slice, isFirstPacket }) {
    const startOffset = slice.filePos;
    const bytes = readBytes(slice, 4);
    const bitstream = new Bitstream(bytes);
    const bits = bitstream.readBits(15);
    if (bits !== 32764) {
      return null;
    }
    if (this.blockingBit === null) {
      assert(isFirstPacket);
      const newBlockingBit = bitstream.readBits(1);
      this.blockingBit = newBlockingBit;
    } else if (this.blockingBit === 1) {
      assert(!isFirstPacket);
      const newBlockingBit = bitstream.readBits(1);
      if (newBlockingBit !== 1) {
        return null;
      }
    } else if (this.blockingBit === 0) {
      assert(!isFirstPacket);
      const newBlockingBit = bitstream.readBits(1);
      if (newBlockingBit !== 0) {
        return null;
      }
    } else {
      throw new Error("Invalid blocking bit");
    }
    const blockSizeOrUncommon = getBlockSizeOrUncommon(bitstream.readBits(4));
    if (!blockSizeOrUncommon) {
      return null;
    }
    assert(this.audioInfo);
    const sampleRateOrUncommon = getSampleRateOrUncommon(bitstream.readBits(4), this.audioInfo.sampleRate);
    if (!sampleRateOrUncommon) {
      return null;
    }
    bitstream.readBits(4);
    bitstream.readBits(3);
    const reservedZero = bitstream.readBits(1);
    if (reservedZero !== 0) {
      return null;
    }
    const num = readCodedNumber(slice);
    const blockSize = readBlockSize(slice, blockSizeOrUncommon);
    const sampleRate = readSampleRate(slice, sampleRateOrUncommon);
    if (sampleRate === null) {
      return null;
    }
    if (sampleRate !== this.audioInfo.sampleRate) {
      return null;
    }
    const size = slice.filePos - startOffset;
    const crc = readU8(slice);
    slice.skip(-size);
    slice.skip(-1);
    const crcCalculated = calculateCrc8(readBytes(slice, size));
    if (crc !== crcCalculated) {
      return null;
    }
    return { num, blockSize, sampleRate };
  }
  async advanceReader() {
    await this.readMetadata();
    assert(this.lastLoadedPos !== null);
    assert(this.audioInfo);
    const startPos = this.lastLoadedPos;
    const frame = await this.readNextFlacFrame({
      startPos,
      isFirstPacket: this.loadedSamples.length === 0
    });
    if (!frame) {
      this.lastSampleLoaded = true;
      return;
    }
    const lastSample = this.loadedSamples[this.loadedSamples.length - 1];
    const blockOffset = lastSample ? lastSample.blockOffset + lastSample.blockSize : 0;
    const sample = {
      blockOffset,
      blockSize: frame.blockSize,
      byteOffset: startPos,
      byteSize: frame.size
    };
    this.lastLoadedPos = this.lastLoadedPos + frame.size;
    this.loadedSamples.push(sample);
    if (frame.isLastFrame) {
      this.lastSampleLoaded = true;
      return;
    }
  }
}
class FlacAudioTrackBacking {
  constructor(demuxer) {
    this.demuxer = demuxer;
  }
  getId() {
    return 1;
  }
  getCodec() {
    return "flac";
  }
  getInternalCodecId() {
    return null;
  }
  getNumberOfChannels() {
    assert(this.demuxer.audioInfo);
    return this.demuxer.audioInfo.numberOfChannels;
  }
  async computeDuration() {
    const lastPacket = await this.getPacket(Infinity, { metadataOnly: true });
    return (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
  }
  getSampleRate() {
    assert(this.demuxer.audioInfo);
    return this.demuxer.audioInfo.sampleRate;
  }
  getName() {
    return null;
  }
  getLanguageCode() {
    return UNDETERMINED_LANGUAGE;
  }
  getTimeResolution() {
    assert(this.demuxer.audioInfo);
    return this.demuxer.audioInfo.sampleRate;
  }
  getDisposition() {
    return {
      ...DEFAULT_TRACK_DISPOSITION
    };
  }
  async getFirstTimestamp() {
    return 0;
  }
  async getDecoderConfig() {
    assert(this.demuxer.audioInfo);
    return {
      codec: "flac",
      numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
      sampleRate: this.demuxer.audioInfo.sampleRate,
      description: this.demuxer.audioInfo.description
    };
  }
  async getPacket(timestamp, options) {
    assert(this.demuxer.audioInfo);
    if (timestamp < 0) {
      throw new Error("Timestamp cannot be negative");
    }
    const release = await this.demuxer.readingMutex.acquire();
    try {
      while (true) {
        const packetIndex = binarySearchLessOrEqual(this.demuxer.loadedSamples, timestamp, (x) => x.blockOffset / this.demuxer.audioInfo.sampleRate);
        if (packetIndex === -1) {
          await this.demuxer.advanceReader();
          continue;
        }
        const packet = this.demuxer.loadedSamples[packetIndex];
        const sampleTimestamp = packet.blockOffset / this.demuxer.audioInfo.sampleRate;
        const sampleDuration = packet.blockSize / this.demuxer.audioInfo.sampleRate;
        if (sampleTimestamp + sampleDuration <= timestamp) {
          if (this.demuxer.lastSampleLoaded) {
            return this.getPacketAtIndex(this.demuxer.loadedSamples.length - 1, options);
          }
          await this.demuxer.advanceReader();
          continue;
        }
        return this.getPacketAtIndex(packetIndex, options);
      }
    } finally {
      release();
    }
  }
  async getNextPacket(packet, options) {
    const release = await this.demuxer.readingMutex.acquire();
    try {
      const nextIndex = packet.sequenceNumber + 1;
      if (this.demuxer.lastSampleLoaded && nextIndex >= this.demuxer.loadedSamples.length) {
        return null;
      }
      while (nextIndex >= this.demuxer.loadedSamples.length && !this.demuxer.lastSampleLoaded) {
        await this.demuxer.advanceReader();
      }
      return this.getPacketAtIndex(nextIndex, options);
    } finally {
      release();
    }
  }
  getKeyPacket(timestamp, options) {
    return this.getPacket(timestamp, options);
  }
  getNextKeyPacket(packet, options) {
    return this.getNextPacket(packet, options);
  }
  async getPacketAtIndex(sampleIndex, options) {
    const rawSample = this.demuxer.loadedSamples[sampleIndex];
    if (!rawSample) {
      return null;
    }
    let data;
    if (options.metadataOnly) {
      data = PLACEHOLDER_DATA;
    } else {
      let slice = this.demuxer.reader.requestSlice(rawSample.byteOffset, rawSample.byteSize);
      if (slice instanceof Promise)
        slice = await slice;
      if (!slice) {
        return null;
      }
      data = readBytes(slice, rawSample.byteSize);
    }
    assert(this.demuxer.audioInfo);
    const timestamp = rawSample.blockOffset / this.demuxer.audioInfo.sampleRate;
    const duration = rawSample.blockSize / this.demuxer.audioInfo.sampleRate;
    return new EncodedPacket(data, "key", timestamp, duration, sampleIndex, rawSample.byteSize);
  }
  async getFirstPacket(options) {
    while (this.demuxer.loadedSamples.length === 0 && !this.demuxer.lastSampleLoaded) {
      await this.demuxer.advanceReader();
    }
    return this.getPacketAtIndex(0, options);
  }
}
class InputFormat {
}
class IsobmffInputFormat extends InputFormat {
  /** @internal */
  async _getMajorBrand(input) {
    let slice = input._reader.requestSlice(0, 12);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return null;
    slice.skip(4);
    const fourCc = readAscii(slice, 4);
    if (fourCc !== "ftyp") {
      return null;
    }
    return readAscii(slice, 4);
  }
  /** @internal */
  _createDemuxer(input) {
    return new IsobmffDemuxer(input);
  }
}
class Mp4InputFormat extends IsobmffInputFormat {
  /** @internal */
  async _canReadInput(input) {
    const majorBrand = await this._getMajorBrand(input);
    return !!majorBrand && majorBrand !== "qt  ";
  }
  get name() {
    return "MP4";
  }
  get mimeType() {
    return "video/mp4";
  }
}
class QuickTimeInputFormat extends IsobmffInputFormat {
  /** @internal */
  async _canReadInput(input) {
    const majorBrand = await this._getMajorBrand(input);
    return majorBrand === "qt  ";
  }
  get name() {
    return "QuickTime File Format";
  }
  get mimeType() {
    return "video/quicktime";
  }
}
class MatroskaInputFormat extends InputFormat {
  /** @internal */
  async isSupportedEBMLOfDocType(input, desiredDocType) {
    let headerSlice = input._reader.requestSlice(0, MAX_HEADER_SIZE);
    if (headerSlice instanceof Promise)
      headerSlice = await headerSlice;
    if (!headerSlice)
      return false;
    const varIntSize = readVarIntSize(headerSlice);
    if (varIntSize === null) {
      return false;
    }
    if (varIntSize < 1 || varIntSize > 8) {
      return false;
    }
    const id = readUnsignedInt(headerSlice, varIntSize);
    if (id !== EBMLId.EBML) {
      return false;
    }
    const dataSize = readElementSize(headerSlice);
    if (typeof dataSize !== "number") {
      return false;
    }
    let dataSlice = input._reader.requestSlice(headerSlice.filePos, dataSize);
    if (dataSlice instanceof Promise)
      dataSlice = await dataSlice;
    if (!dataSlice)
      return false;
    const startPos = headerSlice.filePos;
    while (dataSlice.filePos <= startPos + dataSize - MIN_HEADER_SIZE) {
      const header = readElementHeader(dataSlice);
      if (!header)
        break;
      const { id: id2, size } = header;
      const dataStartPos = dataSlice.filePos;
      if (size === void 0)
        return false;
      switch (id2) {
        case EBMLId.EBMLVersion:
          {
            const ebmlVersion = readUnsignedInt(dataSlice, size);
            if (ebmlVersion !== 1) {
              return false;
            }
          }
          break;
        case EBMLId.EBMLReadVersion:
          {
            const ebmlReadVersion = readUnsignedInt(dataSlice, size);
            if (ebmlReadVersion !== 1) {
              return false;
            }
          }
          break;
        case EBMLId.DocType:
          {
            const docType = readAsciiString(dataSlice, size);
            if (docType !== desiredDocType) {
              return false;
            }
          }
          break;
        case EBMLId.DocTypeVersion:
          {
            const docTypeVersion = readUnsignedInt(dataSlice, size);
            if (docTypeVersion > 4) {
              return false;
            }
          }
          break;
      }
      dataSlice.filePos = dataStartPos + size;
    }
    return true;
  }
  /** @internal */
  _canReadInput(input) {
    return this.isSupportedEBMLOfDocType(input, "matroska");
  }
  /** @internal */
  _createDemuxer(input) {
    return new MatroskaDemuxer(input);
  }
  get name() {
    return "Matroska";
  }
  get mimeType() {
    return "video/x-matroska";
  }
}
class WebMInputFormat extends MatroskaInputFormat {
  /** @internal */
  _canReadInput(input) {
    return this.isSupportedEBMLOfDocType(input, "webm");
  }
  get name() {
    return "WebM";
  }
  get mimeType() {
    return "video/webm";
  }
}
class Mp3InputFormat extends InputFormat {
  /** @internal */
  async _canReadInput(input) {
    let slice = input._reader.requestSlice(0, 10);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return false;
    let currentPos = 0;
    let id3V2HeaderFound = false;
    while (true) {
      let slice2 = input._reader.requestSlice(currentPos, ID3_V2_HEADER_SIZE);
      if (slice2 instanceof Promise)
        slice2 = await slice2;
      if (!slice2)
        break;
      const id3V2Header = readId3V2Header(slice2);
      if (!id3V2Header) {
        break;
      }
      id3V2HeaderFound = true;
      currentPos = slice2.filePos + id3V2Header.size;
    }
    const firstResult = await readNextFrameHeader(input._reader, currentPos, currentPos + 4096);
    if (!firstResult) {
      return false;
    }
    if (id3V2HeaderFound) {
      return true;
    }
    currentPos = firstResult.startPos + firstResult.header.totalSize;
    const secondResult = await readNextFrameHeader(input._reader, currentPos, currentPos + FRAME_HEADER_SIZE);
    if (!secondResult) {
      return false;
    }
    const firstHeader = firstResult.header;
    const secondHeader = secondResult.header;
    if (firstHeader.channel !== secondHeader.channel || firstHeader.sampleRate !== secondHeader.sampleRate) {
      return false;
    }
    return true;
  }
  /** @internal */
  _createDemuxer(input) {
    return new Mp3Demuxer(input);
  }
  get name() {
    return "MP3";
  }
  get mimeType() {
    return "audio/mpeg";
  }
}
class WaveInputFormat extends InputFormat {
  /** @internal */
  async _canReadInput(input) {
    let slice = input._reader.requestSlice(0, 12);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return false;
    const riffType = readAscii(slice, 4);
    if (riffType !== "RIFF" && riffType !== "RIFX" && riffType !== "RF64") {
      return false;
    }
    slice.skip(4);
    const format = readAscii(slice, 4);
    return format === "WAVE";
  }
  /** @internal */
  _createDemuxer(input) {
    return new WaveDemuxer(input);
  }
  get name() {
    return "WAVE";
  }
  get mimeType() {
    return "audio/wav";
  }
}
class OggInputFormat extends InputFormat {
  /** @internal */
  async _canReadInput(input) {
    let slice = input._reader.requestSlice(0, 4);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return false;
    return readAscii(slice, 4) === "OggS";
  }
  /** @internal */
  _createDemuxer(input) {
    return new OggDemuxer(input);
  }
  get name() {
    return "Ogg";
  }
  get mimeType() {
    return "application/ogg";
  }
}
class FlacInputFormat extends InputFormat {
  /** @internal */
  async _canReadInput(input) {
    let slice = input._reader.requestSlice(0, 4);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return false;
    return readAscii(slice, 4) === "fLaC";
  }
  get name() {
    return "FLAC";
  }
  get mimeType() {
    return "audio/flac";
  }
  /** @internal */
  _createDemuxer(input) {
    return new FlacDemuxer(input);
  }
}
class AdtsInputFormat extends InputFormat {
  /** @internal */
  async _canReadInput(input) {
    let slice = input._reader.requestSliceRange(0, MIN_FRAME_HEADER_SIZE, MAX_FRAME_HEADER_SIZE);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return false;
    const firstHeader = readFrameHeader(slice);
    if (!firstHeader) {
      return false;
    }
    slice = input._reader.requestSliceRange(firstHeader.frameLength, MIN_FRAME_HEADER_SIZE, MAX_FRAME_HEADER_SIZE);
    if (slice instanceof Promise)
      slice = await slice;
    if (!slice)
      return false;
    const secondHeader = readFrameHeader(slice);
    if (!secondHeader) {
      return false;
    }
    return firstHeader.objectType === secondHeader.objectType && firstHeader.samplingFrequencyIndex === secondHeader.samplingFrequencyIndex && firstHeader.channelConfiguration === secondHeader.channelConfiguration;
  }
  /** @internal */
  _createDemuxer(input) {
    return new AdtsDemuxer(input);
  }
  get name() {
    return "ADTS";
  }
  get mimeType() {
    return "audio/aac";
  }
}
const MP4 = /* @__PURE__ */ new Mp4InputFormat();
const QTFF = /* @__PURE__ */ new QuickTimeInputFormat();
const MATROSKA = /* @__PURE__ */ new MatroskaInputFormat();
const WEBM = /* @__PURE__ */ new WebMInputFormat();
const MP3 = /* @__PURE__ */ new Mp3InputFormat();
const WAVE = /* @__PURE__ */ new WaveInputFormat();
const OGG = /* @__PURE__ */ new OggInputFormat();
const ADTS = /* @__PURE__ */ new AdtsInputFormat();
const FLAC = /* @__PURE__ */ new FlacInputFormat();
const ALL_FORMATS = [MP4, QTFF, MATROSKA, WEBM, WAVE, OGG, FLAC, MP3, ADTS];
class Source {
  constructor() {
    this._disposed = false;
    this._sizePromise = null;
    this.onread = null;
  }
  /**
   * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
   * will retrieve the size.
   *
   * Returns null if the source is unsized.
   */
  async getSizeOrNull() {
    if (this._disposed) {
      throw new InputDisposedError();
    }
    return this._sizePromise ?? (this._sizePromise = Promise.resolve(this._retrieveSize()));
  }
  /**
   * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
   * will retrieve the size.
   *
   * Throws an error if the source is unsized.
   */
  async getSize() {
    if (this._disposed) {
      throw new InputDisposedError();
    }
    const result = await this.getSizeOrNull();
    if (result === null) {
      throw new Error("Cannot determine the size of an unsized source.");
    }
    return result;
  }
}
class BlobSource extends Source {
  /**
   * Creates a new {@link BlobSource} backed by the specified
   * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
   */
  constructor(blob, options = {}) {
    if (!(blob instanceof Blob)) {
      throw new TypeError("blob must be a Blob.");
    }
    if (!options || typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (options.maxCacheSize !== void 0 && (!isNumber(options.maxCacheSize) || options.maxCacheSize < 0)) {
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    }
    super();
    this._readers = /* @__PURE__ */ new WeakMap();
    this._blob = blob;
    this._orchestrator = new ReadOrchestrator({
      maxCacheSize: options.maxCacheSize ?? 8 * 2 ** 20,
      maxWorkerCount: 4,
      runWorker: this._runWorker.bind(this),
      prefetchProfile: PREFETCH_PROFILES.fileSystem
    });
  }
  /** @internal */
  _retrieveSize() {
    const size = this._blob.size;
    this._orchestrator.fileSize = size;
    return size;
  }
  /** @internal */
  _read(start, end) {
    return this._orchestrator.read(start, end);
  }
  /** @internal */
  async _runWorker(worker) {
    let reader = this._readers.get(worker);
    if (reader === void 0) {
      if ("stream" in this._blob && !isWebKit()) {
        const slice = this._blob.slice(worker.currentPos);
        reader = slice.stream().getReader();
      } else {
        reader = null;
      }
      this._readers.set(worker, reader);
    }
    while (worker.currentPos < worker.targetPos && !worker.aborted) {
      if (reader) {
        const { done, value } = await reader.read();
        if (done) {
          this._orchestrator.forgetWorker(worker);
          throw new Error("Blob reader stopped unexpectedly before all requested data was read.");
        }
        if (worker.aborted) {
          break;
        }
        this.onread?.(worker.currentPos, worker.currentPos + value.length);
        this._orchestrator.supplyWorkerData(worker, value);
      } else {
        const data = await this._blob.slice(worker.currentPos, worker.targetPos).arrayBuffer();
        if (worker.aborted) {
          break;
        }
        this.onread?.(worker.currentPos, worker.currentPos + data.byteLength);
        this._orchestrator.supplyWorkerData(worker, new Uint8Array(data));
      }
    }
    worker.running = false;
    if (worker.aborted) {
      await reader?.cancel();
    }
  }
  /** @internal */
  _dispose() {
    this._orchestrator.dispose();
  }
}
const URL_SOURCE_MIN_LOAD_AMOUNT = 0.5 * 2 ** 20;
const DEFAULT_RETRY_DELAY = ((previousAttempts, error, src) => {
  const couldBeCorsError = error instanceof Error && (error.message.includes("Failed to fetch") || error.message.includes("Load failed") || error.message.includes("NetworkError when attempting to fetch resource"));
  if (couldBeCorsError) {
    let originOfSrc = null;
    try {
      if (typeof window !== "undefined" && typeof window.location !== "undefined") {
        originOfSrc = new URL(src instanceof Request ? src.url : src, window.location.href).origin;
      }
    } catch {
    }
    const isOnline = typeof navigator !== "undefined" && typeof navigator.onLine === "boolean" ? navigator.onLine : true;
    if (isOnline && originOfSrc !== null && originOfSrc !== window.location.origin) {
      console.warn(`Request will not be retried because a CORS error was suspected due to different origins. You can modify this behavior by providing your own function for the 'getRetryDelay' option.`);
      return null;
    }
  }
  return Math.min(2 ** (previousAttempts - 2), 16);
});
class UrlSource extends Source {
  /** Creates a new {@link UrlSource} backed by the resource at the specified URL. */
  constructor(url, options = {}) {
    if (typeof url !== "string" && !(url instanceof URL) && !(typeof Request !== "undefined" && url instanceof Request)) {
      throw new TypeError("url must be a string, URL or Request.");
    }
    if (!options || typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (options.requestInit !== void 0 && (!options.requestInit || typeof options.requestInit !== "object")) {
      throw new TypeError("options.requestInit, when provided, must be an object.");
    }
    if (options.getRetryDelay !== void 0 && typeof options.getRetryDelay !== "function") {
      throw new TypeError("options.getRetryDelay, when provided, must be a function.");
    }
    if (options.maxCacheSize !== void 0 && (!isNumber(options.maxCacheSize) || options.maxCacheSize < 0)) {
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    }
    if (options.fetchFn !== void 0 && typeof options.fetchFn !== "function") {
      throw new TypeError("options.fetchFn, when provided, must be a function.");
    }
    super();
    this._existingResponses = /* @__PURE__ */ new WeakMap();
    this._url = url;
    this._options = options;
    this._getRetryDelay = options.getRetryDelay ?? DEFAULT_RETRY_DELAY;
    this._orchestrator = new ReadOrchestrator({
      maxCacheSize: options.maxCacheSize ?? 64 * 2 ** 20,
      // Most files in the real-world have a single sequential access pattern, but having two in parallel can
      // also happen
      maxWorkerCount: 2,
      runWorker: this._runWorker.bind(this),
      prefetchProfile: PREFETCH_PROFILES.network
    });
  }
  /** @internal */
  async _retrieveSize() {
    const abortController = new AbortController();
    const response = await retriedFetch(this._options.fetchFn ?? fetch, this._url, mergeRequestInit(this._options.requestInit ?? {}, {
      headers: {
        // We could also send a non-range request to request the same bytes (all of them), but doing it like
        // this is an easy way to check if the server supports range requests in the first place
        Range: "bytes=0-"
      },
      signal: abortController.signal
    }), this._getRetryDelay, () => this._disposed);
    if (!response.ok) {
      throw new Error(`Error fetching ${String(this._url)}: ${response.status} ${response.statusText}`);
    }
    let worker;
    let fileSize;
    if (response.status === 206) {
      fileSize = this._getTotalLengthFromRangeResponse(response);
      worker = this._orchestrator.createWorker(0, Math.min(fileSize, URL_SOURCE_MIN_LOAD_AMOUNT));
    } else {
      const contentLength = response.headers.get("Content-Length");
      if (contentLength) {
        fileSize = Number(contentLength);
        worker = this._orchestrator.createWorker(0, fileSize);
        this._orchestrator.options.maxCacheSize = Infinity;
        console.warn("HTTP server did not respond with 206 Partial Content, meaning the entire remote resource now has to be downloaded. For efficient media file streaming across a network, please make sure your server supports range requests.");
      } else {
        throw new Error(`HTTP response (status ${response.status}) must surface Content-Length header.`);
      }
    }
    this._orchestrator.fileSize = fileSize;
    this._existingResponses.set(worker, { response, abortController });
    this._orchestrator.runWorker(worker);
    return fileSize;
  }
  /** @internal */
  _read(start, end) {
    return this._orchestrator.read(start, end);
  }
  /** @internal */
  async _runWorker(worker) {
    while (true) {
      const existing = this._existingResponses.get(worker);
      this._existingResponses.delete(worker);
      let abortController = existing?.abortController;
      let response = existing?.response;
      if (!abortController) {
        abortController = new AbortController();
        response = await retriedFetch(this._options.fetchFn ?? fetch, this._url, mergeRequestInit(this._options.requestInit ?? {}, {
          headers: {
            Range: `bytes=${worker.currentPos}-`
          },
          signal: abortController.signal
        }), this._getRetryDelay, () => this._disposed);
      }
      assert(response);
      if (!response.ok) {
        throw new Error(`Error fetching ${String(this._url)}: ${response.status} ${response.statusText}`);
      }
      if (worker.currentPos > 0 && response.status !== 206) {
        throw new Error("HTTP server did not respond with 206 Partial Content to a range request. To enable efficient media file streaming across a network, please make sure your server supports range requests.");
      }
      if (!response.body) {
        throw new Error("Missing HTTP response body stream. The used fetch function must provide the response body as a ReadableStream.");
      }
      const reader = response.body.getReader();
      while (true) {
        if (worker.currentPos >= worker.targetPos || worker.aborted) {
          abortController.abort();
          worker.running = false;
          return;
        }
        let readResult;
        try {
          readResult = await reader.read();
        } catch (error) {
          if (this._disposed) {
            throw error;
          }
          const retryDelayInSeconds = this._getRetryDelay(1, error, this._url);
          if (retryDelayInSeconds !== null) {
            console.error("Error while reading response stream. Attempting to resume.", error);
            await new Promise((resolve) => setTimeout(resolve, 1e3 * retryDelayInSeconds));
            break;
          } else {
            throw error;
          }
        }
        if (worker.aborted) {
          continue;
        }
        const { done, value } = readResult;
        if (done) {
          if (worker.currentPos >= worker.targetPos) {
            this._orchestrator.forgetWorker(worker);
            worker.running = false;
            return;
          }
          break;
        }
        this.onread?.(worker.currentPos, worker.currentPos + value.length);
        this._orchestrator.supplyWorkerData(worker, value);
      }
    }
  }
  /** @internal */
  _getTotalLengthFromRangeResponse(response) {
    const contentRange = response.headers.get("Content-Range");
    if (contentRange) {
      const match = /\/(\d+)/.exec(contentRange);
      if (match) {
        return Number(match[1]);
      }
    }
    const contentLength = response.headers.get("Content-Length");
    if (contentLength) {
      return Number(contentLength);
    } else {
      throw new Error("Partial HTTP response (status 206) must surface either Content-Range or Content-Length header.");
    }
  }
  /** @internal */
  _dispose() {
    this._orchestrator.dispose();
  }
}
class ReadableStreamSource extends Source {
  /** Creates a new {@link ReadableStreamSource} backed by the specified `ReadableStream<Uint8Array>`. */
  constructor(stream, options = {}) {
    if (!(stream instanceof ReadableStream)) {
      throw new TypeError("stream must be a ReadableStream.");
    }
    if (!options || typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (options.maxCacheSize !== void 0 && (!isNumber(options.maxCacheSize) || options.maxCacheSize < 0)) {
      throw new TypeError("options.maxCacheSize, when provided, must be a non-negative number.");
    }
    super();
    this._reader = null;
    this._cache = [];
    this._pendingSlices = [];
    this._currentIndex = 0;
    this._targetIndex = 0;
    this._maxRequestedIndex = 0;
    this._endIndex = null;
    this._pulling = false;
    this._stream = stream;
    this._maxCacheSize = options.maxCacheSize ?? 16 * 2 ** 20;
  }
  /** @internal */
  _retrieveSize() {
    return this._endIndex;
  }
  /** @internal */
  _read(start, end) {
    if (this._endIndex !== null && end > this._endIndex) {
      return null;
    }
    this._maxRequestedIndex = Math.max(this._maxRequestedIndex, end);
    const cacheStartIndex = binarySearchLessOrEqual(this._cache, start, (x) => x.start);
    const cacheStartEntry = cacheStartIndex !== -1 ? this._cache[cacheStartIndex] : null;
    if (cacheStartEntry && cacheStartEntry.start <= start && end <= cacheStartEntry.end) {
      return {
        bytes: cacheStartEntry.bytes,
        view: cacheStartEntry.view,
        offset: cacheStartEntry.start
      };
    }
    let lastEnd = start;
    const bytes = new Uint8Array(end - start);
    if (cacheStartIndex !== -1) {
      for (let i = cacheStartIndex; i < this._cache.length; i++) {
        const cacheEntry = this._cache[i];
        if (cacheEntry.start >= end) {
          break;
        }
        const cappedStart = Math.max(start, cacheEntry.start);
        if (cappedStart > lastEnd) {
          this._throwDueToCacheMiss();
        }
        const cappedEnd = Math.min(end, cacheEntry.end);
        if (cappedStart < cappedEnd) {
          bytes.set(cacheEntry.bytes.subarray(cappedStart - cacheEntry.start, cappedEnd - cacheEntry.start), cappedStart - start);
          lastEnd = cappedEnd;
        }
      }
    }
    if (lastEnd === end) {
      return {
        bytes,
        view: toDataView(bytes),
        offset: start
      };
    }
    if (this._currentIndex > lastEnd) {
      this._throwDueToCacheMiss();
    }
    const { promise, resolve, reject } = promiseWithResolvers();
    this._pendingSlices.push({
      start,
      end,
      bytes,
      resolve,
      reject
    });
    this._targetIndex = Math.max(this._targetIndex, end);
    if (!this._pulling) {
      this._pulling = true;
      void this._pull().catch((error) => {
        this._pulling = false;
        if (this._pendingSlices.length > 0) {
          this._pendingSlices.forEach((x) => x.reject(error));
          this._pendingSlices.length = 0;
        } else {
          throw error;
        }
      });
    }
    return promise;
  }
  /** @internal */
  _throwDueToCacheMiss() {
    throw new Error("Read is before the cached region. With ReadableStreamSource, you must access the data more sequentially or increase the size of its cache.");
  }
  /** @internal */
  async _pull() {
    this._reader ?? (this._reader = this._stream.getReader());
    while (this._currentIndex < this._targetIndex && !this._disposed) {
      const { done, value } = await this._reader.read();
      if (done) {
        for (const pendingSlice of this._pendingSlices) {
          pendingSlice.resolve(null);
        }
        this._pendingSlices.length = 0;
        this._endIndex = this._currentIndex;
        break;
      }
      const startIndex = this._currentIndex;
      const endIndex = this._currentIndex + value.byteLength;
      for (let i = 0; i < this._pendingSlices.length; i++) {
        const pendingSlice = this._pendingSlices[i];
        const cappedStart = Math.max(startIndex, pendingSlice.start);
        const cappedEnd = Math.min(endIndex, pendingSlice.end);
        if (cappedStart < cappedEnd) {
          pendingSlice.bytes.set(value.subarray(cappedStart - startIndex, cappedEnd - startIndex), cappedStart - pendingSlice.start);
          if (cappedEnd === pendingSlice.end) {
            pendingSlice.resolve({
              bytes: pendingSlice.bytes,
              view: toDataView(pendingSlice.bytes),
              offset: pendingSlice.start
            });
            this._pendingSlices.splice(i, 1);
            i--;
          }
        }
      }
      this._cache.push({
        start: startIndex,
        end: endIndex,
        bytes: value,
        view: toDataView(value),
        age: 0
        // Unused
      });
      while (this._cache.length > 0) {
        const firstEntry = this._cache[0];
        const distance = this._maxRequestedIndex - firstEntry.end;
        if (distance <= this._maxCacheSize) {
          break;
        }
        this._cache.shift();
      }
      this._currentIndex += value.byteLength;
    }
    this._pulling = false;
  }
  /** @internal */
  _dispose() {
    this._pendingSlices.length = 0;
    this._cache.length = 0;
  }
}
const PREFETCH_PROFILES = {
  fileSystem: (start, end) => {
    const padding = 2 ** 16;
    start = Math.floor((start - padding) / padding) * padding;
    end = Math.ceil((end + padding) / padding) * padding;
    return { start, end };
  },
  network: (start, end, workers) => {
    const paddingStart = 2 ** 16;
    start = Math.max(0, Math.floor((start - paddingStart) / paddingStart) * paddingStart);
    for (const worker of workers) {
      const maxExtensionAmount = 8 * 2 ** 20;
      const thresholdPoint = Math.max((worker.startPos + worker.targetPos) / 2, worker.targetPos - maxExtensionAmount);
      if (closedIntervalsOverlap(start, end, thresholdPoint, worker.targetPos)) {
        const size = worker.targetPos - worker.startPos;
        const a = Math.ceil((size + 1) / maxExtensionAmount) * maxExtensionAmount;
        const b = 2 ** Math.ceil(Math.log2(size + 1));
        const extent = Math.min(b, a);
        end = Math.max(end, worker.startPos + extent);
      }
    }
    end = Math.max(end, start + URL_SOURCE_MIN_LOAD_AMOUNT);
    return {
      start,
      end
    };
  }
};
class ReadOrchestrator {
  constructor(options) {
    this.options = options;
    this.fileSize = null;
    this.nextAge = 0;
    this.workers = [];
    this.cache = [];
    this.currentCacheSize = 0;
    this.disposed = false;
  }
  read(innerStart, innerEnd) {
    assert(this.fileSize !== null);
    const prefetchRange = this.options.prefetchProfile(innerStart, innerEnd, this.workers);
    const outerStart = Math.max(prefetchRange.start, 0);
    const outerEnd = Math.min(prefetchRange.end, this.fileSize);
    assert(outerStart <= innerStart && innerEnd <= outerEnd);
    let result = null;
    const innerCacheStartIndex = binarySearchLessOrEqual(this.cache, innerStart, (x) => x.start);
    const innerStartEntry = innerCacheStartIndex !== -1 ? this.cache[innerCacheStartIndex] : null;
    if (innerStartEntry && innerStartEntry.start <= innerStart && innerEnd <= innerStartEntry.end) {
      innerStartEntry.age = this.nextAge++;
      result = {
        bytes: innerStartEntry.bytes,
        view: innerStartEntry.view,
        offset: innerStartEntry.start
      };
    }
    const outerCacheStartIndex = binarySearchLessOrEqual(this.cache, outerStart, (x) => x.start);
    const bytes = result ? null : new Uint8Array(innerEnd - innerStart);
    let contiguousBytesWriteEnd = 0;
    let lastEnd = outerStart;
    const outerHoles = [];
    if (outerCacheStartIndex !== -1) {
      for (let i = outerCacheStartIndex; i < this.cache.length; i++) {
        const entry = this.cache[i];
        if (entry.start >= outerEnd) {
          break;
        }
        if (entry.end <= outerStart) {
          continue;
        }
        const cappedOuterStart = Math.max(outerStart, entry.start);
        const cappedOuterEnd = Math.min(outerEnd, entry.end);
        assert(cappedOuterStart <= cappedOuterEnd);
        if (lastEnd < cappedOuterStart) {
          outerHoles.push({ start: lastEnd, end: cappedOuterStart });
        }
        lastEnd = cappedOuterEnd;
        if (bytes) {
          const cappedInnerStart = Math.max(innerStart, entry.start);
          const cappedInnerEnd = Math.min(innerEnd, entry.end);
          if (cappedInnerStart < cappedInnerEnd) {
            const relativeOffset = cappedInnerStart - innerStart;
            bytes.set(entry.bytes.subarray(cappedInnerStart - entry.start, cappedInnerEnd - entry.start), relativeOffset);
            if (relativeOffset === contiguousBytesWriteEnd) {
              contiguousBytesWriteEnd = cappedInnerEnd - innerStart;
            }
          }
        }
        entry.age = this.nextAge++;
      }
      if (lastEnd < outerEnd) {
        outerHoles.push({ start: lastEnd, end: outerEnd });
      }
    } else {
      outerHoles.push({ start: outerStart, end: outerEnd });
    }
    if (bytes && contiguousBytesWriteEnd >= bytes.length) {
      result = {
        bytes,
        view: toDataView(bytes),
        offset: innerStart
      };
    }
    if (outerHoles.length === 0) {
      assert(result);
      return result;
    }
    const { promise, resolve, reject } = promiseWithResolvers();
    const innerHoles = [];
    for (const outerHole of outerHoles) {
      const cappedStart = Math.max(innerStart, outerHole.start);
      const cappedEnd = Math.min(innerEnd, outerHole.end);
      if (cappedStart === outerHole.start && cappedEnd === outerHole.end) {
        innerHoles.push(outerHole);
      } else if (cappedStart < cappedEnd) {
        innerHoles.push({ start: cappedStart, end: cappedEnd });
      }
    }
    for (const outerHole of outerHoles) {
      const pendingSlice = bytes && {
        start: innerStart,
        bytes,
        holes: innerHoles,
        resolve,
        reject
      };
      let workerFound = false;
      for (const worker of this.workers) {
        const gapTolerance = 2 ** 17;
        if (closedIntervalsOverlap(outerHole.start - gapTolerance, outerHole.start, worker.currentPos, worker.targetPos)) {
          worker.targetPos = Math.max(worker.targetPos, outerHole.end);
          workerFound = true;
          if (pendingSlice && !worker.pendingSlices.includes(pendingSlice)) {
            worker.pendingSlices.push(pendingSlice);
          }
          if (!worker.running) {
            this.runWorker(worker);
          }
          break;
        }
      }
      if (!workerFound) {
        const newWorker = this.createWorker(outerHole.start, outerHole.end);
        if (pendingSlice) {
          newWorker.pendingSlices = [pendingSlice];
        }
        this.runWorker(newWorker);
      }
    }
    if (!result) {
      assert(bytes);
      result = promise.then((bytes2) => ({
        bytes: bytes2,
        view: toDataView(bytes2),
        offset: innerStart
      }));
    }
    return result;
  }
  createWorker(startPos, targetPos) {
    const worker = {
      startPos,
      currentPos: startPos,
      targetPos,
      running: false,
      // Due to async shenanigans, it can happen that workers are started after disposal. In this case, instead of
      // simply not creating the worker, we allow it to run but immediately label it as aborted, so it can then
      // shut itself down.
      aborted: this.disposed,
      pendingSlices: [],
      age: this.nextAge++
    };
    this.workers.push(worker);
    while (this.workers.length > this.options.maxWorkerCount) {
      let oldestIndex = 0;
      let oldestWorker = this.workers[0];
      for (let i = 1; i < this.workers.length; i++) {
        const worker2 = this.workers[i];
        if (worker2.age < oldestWorker.age) {
          oldestIndex = i;
          oldestWorker = worker2;
        }
      }
      if (oldestWorker.running && oldestWorker.pendingSlices.length > 0) {
        break;
      }
      oldestWorker.aborted = true;
      this.workers.splice(oldestIndex, 1);
    }
    return worker;
  }
  runWorker(worker) {
    assert(!worker.running);
    assert(worker.currentPos < worker.targetPos);
    worker.running = true;
    worker.age = this.nextAge++;
    void this.options.runWorker(worker).catch((error) => {
      worker.running = false;
      if (worker.pendingSlices.length > 0) {
        worker.pendingSlices.forEach((x) => x.reject(error));
        worker.pendingSlices.length = 0;
      } else {
        throw error;
      }
    });
  }
  /** Called by a worker when it has read some data. */
  supplyWorkerData(worker, bytes) {
    assert(!worker.aborted);
    const start = worker.currentPos;
    const end = start + bytes.length;
    this.insertIntoCache({
      start,
      end,
      bytes,
      view: toDataView(bytes),
      age: this.nextAge++
    });
    worker.currentPos += bytes.length;
    worker.targetPos = Math.max(worker.targetPos, worker.currentPos);
    for (let i = 0; i < worker.pendingSlices.length; i++) {
      const pendingSlice = worker.pendingSlices[i];
      const clampedStart = Math.max(start, pendingSlice.start);
      const clampedEnd = Math.min(end, pendingSlice.start + pendingSlice.bytes.length);
      if (clampedStart < clampedEnd) {
        pendingSlice.bytes.set(bytes.subarray(clampedStart - start, clampedEnd - start), clampedStart - pendingSlice.start);
      }
      for (let j = 0; j < pendingSlice.holes.length; j++) {
        const hole = pendingSlice.holes[j];
        if (start <= hole.start && end > hole.start) {
          hole.start = end;
        }
        if (hole.end <= hole.start) {
          pendingSlice.holes.splice(j, 1);
          j--;
        }
      }
      if (pendingSlice.holes.length === 0) {
        pendingSlice.resolve(pendingSlice.bytes);
        worker.pendingSlices.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < this.workers.length; i++) {
      const otherWorker = this.workers[i];
      if (worker === otherWorker || otherWorker.running) {
        continue;
      }
      if (closedIntervalsOverlap(start, end, otherWorker.currentPos, otherWorker.targetPos)) {
        this.workers.splice(i, 1);
        i--;
      }
    }
  }
  forgetWorker(worker) {
    const index = this.workers.indexOf(worker);
    assert(index !== -1);
    this.workers.splice(index, 1);
  }
  insertIntoCache(entry) {
    if (this.options.maxCacheSize === 0) {
      return;
    }
    let insertionIndex = binarySearchLessOrEqual(this.cache, entry.start, (x) => x.start) + 1;
    if (insertionIndex > 0) {
      const previous = this.cache[insertionIndex - 1];
      if (previous.end >= entry.end) {
        return;
      }
      if (previous.end > entry.start) {
        const joined = new Uint8Array(entry.end - previous.start);
        joined.set(previous.bytes, 0);
        joined.set(entry.bytes, entry.start - previous.start);
        this.currentCacheSize += entry.end - previous.end;
        previous.bytes = joined;
        previous.view = toDataView(joined);
        previous.end = entry.end;
        insertionIndex--;
        entry = previous;
      } else {
        this.cache.splice(insertionIndex, 0, entry);
        this.currentCacheSize += entry.bytes.length;
      }
    } else {
      this.cache.splice(insertionIndex, 0, entry);
      this.currentCacheSize += entry.bytes.length;
    }
    for (let i = insertionIndex + 1; i < this.cache.length; i++) {
      const next = this.cache[i];
      if (entry.end <= next.start) {
        break;
      }
      if (entry.end >= next.end) {
        this.cache.splice(i, 1);
        this.currentCacheSize -= next.bytes.length;
        i--;
        continue;
      }
      const joined = new Uint8Array(next.end - entry.start);
      joined.set(entry.bytes, 0);
      joined.set(next.bytes, next.start - entry.start);
      this.currentCacheSize -= entry.end - next.start;
      entry.bytes = joined;
      entry.view = toDataView(joined);
      entry.end = next.end;
      this.cache.splice(i, 1);
      break;
    }
    while (this.currentCacheSize > this.options.maxCacheSize) {
      let oldestIndex = 0;
      let oldestEntry = this.cache[0];
      for (let i = 1; i < this.cache.length; i++) {
        const entry2 = this.cache[i];
        if (entry2.age < oldestEntry.age) {
          oldestIndex = i;
          oldestEntry = entry2;
        }
      }
      if (this.currentCacheSize - oldestEntry.bytes.length <= this.options.maxCacheSize) {
        break;
      }
      this.cache.splice(oldestIndex, 1);
      this.currentCacheSize -= oldestEntry.bytes.length;
    }
  }
  dispose() {
    for (const worker of this.workers) {
      worker.aborted = true;
    }
    this.workers.length = 0;
    this.cache.length = 0;
    this.disposed = true;
  }
}
polyfillSymbolDispose();
class Input {
  /** True if the input has been disposed. */
  get disposed() {
    return this._disposed;
  }
  /**
   * Creates a new input file from the specified options. No reading operations will be performed until methods are
   * called on this instance.
   */
  constructor(options) {
    this._demuxerPromise = null;
    this._format = null;
    this._disposed = false;
    if (!options || typeof options !== "object") {
      throw new TypeError("options must be an object.");
    }
    if (!Array.isArray(options.formats) || options.formats.some((x) => !(x instanceof InputFormat))) {
      throw new TypeError("options.formats must be an array of InputFormat.");
    }
    if (!(options.source instanceof Source)) {
      throw new TypeError("options.source must be a Source.");
    }
    if (options.source._disposed) {
      throw new Error("options.source must not be disposed.");
    }
    this._formats = options.formats;
    this._source = options.source;
    this._reader = new Reader(options.source);
  }
  /** @internal */
  _getDemuxer() {
    return this._demuxerPromise ?? (this._demuxerPromise = (async () => {
      this._reader.fileSize = await this._source.getSizeOrNull();
      for (const format of this._formats) {
        const canRead = await format._canReadInput(this);
        if (canRead) {
          this._format = format;
          return format._createDemuxer(this);
        }
      }
      throw new Error("Input has an unsupported or unrecognizable format.");
    })());
  }
  /**
   * Returns the source from which this input file reads its data. This is the same source that was passed to the
   * constructor.
   */
  get source() {
    return this._source;
  }
  /**
   * Returns the format of the input file. You can compare this result directly to the {@link InputFormat} singletons
   * or use `instanceof` checks for subset-aware logic (for example, `format instanceof MatroskaInputFormat` is true
   * for both MKV and WebM).
   */
  async getFormat() {
    await this._getDemuxer();
    assert(this._format);
    return this._format;
  }
  /**
   * Computes the duration of the input file, in seconds. More precisely, returns the largest end timestamp among
   * all tracks.
   */
  async computeDuration() {
    const demuxer = await this._getDemuxer();
    return demuxer.computeDuration();
  }
  /** Returns the list of all tracks of this input file. */
  async getTracks() {
    const demuxer = await this._getDemuxer();
    return demuxer.getTracks();
  }
  /** Returns the list of all video tracks of this input file. */
  async getVideoTracks() {
    const tracks = await this.getTracks();
    return tracks.filter((x) => x.isVideoTrack());
  }
  /** Returns the list of all audio tracks of this input file. */
  async getAudioTracks() {
    const tracks = await this.getTracks();
    return tracks.filter((x) => x.isAudioTrack());
  }
  /** Returns the primary video track of this input file, or null if there are no video tracks. */
  async getPrimaryVideoTrack() {
    const tracks = await this.getTracks();
    return tracks.find((x) => x.isVideoTrack()) ?? null;
  }
  /** Returns the primary audio track of this input file, or null if there are no audio tracks. */
  async getPrimaryAudioTrack() {
    const tracks = await this.getTracks();
    return tracks.find((x) => x.isAudioTrack()) ?? null;
  }
  /** Returns the full MIME type of this input file, including track codecs. */
  async getMimeType() {
    const demuxer = await this._getDemuxer();
    return demuxer.getMimeType();
  }
  /**
   * Returns descriptive metadata tags about the media file, such as title, author, date, cover art, or other
   * attached files.
   */
  async getMetadataTags() {
    const demuxer = await this._getDemuxer();
    return demuxer.getMetadataTags();
  }
  /**
   * Disposes this input and frees connected resources. When an input is disposed, ongoing read operations will be
   * canceled, all future read operations will fail, any open decoders will be closed, and all ongoing media sink
   * operations will be canceled. Disallowed and canceled operations will throw an {@link InputDisposedError}.
   *
   * You are expected not to use an input after disposing it. While some operations may still work, it is not
   * specified and may change in any future update.
   */
  dispose() {
    if (this._disposed) {
      return;
    }
    this._disposed = true;
    this._source._disposed = true;
    this._source._dispose();
  }
  /**
   * Calls `.dispose()` on the input, implementing the `Disposable` interface for use with
   * JavaScript Explicit Resource Management features.
   */
  [Symbol.dispose]() {
    this.dispose();
  }
}
class InputDisposedError extends Error {
  /** Creates a new {@link InputDisposedError}. */
  constructor(message = "Input has been disposed.") {
    super(message);
    this.name = "InputDisposedError";
  }
}
class Reader {
  constructor(source) {
    this.source = source;
  }
  requestSlice(start, length) {
    if (this.source._disposed) {
      throw new InputDisposedError();
    }
    if (this.fileSize !== null && start + length > this.fileSize) {
      return null;
    }
    const end = start + length;
    const result = this.source._read(start, end);
    if (result instanceof Promise) {
      return result.then((x) => {
        if (!x) {
          return null;
        }
        return new FileSlice(x.bytes, x.view, x.offset, start, end);
      });
    } else {
      if (!result) {
        return null;
      }
      return new FileSlice(result.bytes, result.view, result.offset, start, end);
    }
  }
  requestSliceRange(start, minLength, maxLength) {
    if (this.source._disposed) {
      throw new InputDisposedError();
    }
    if (this.fileSize !== null) {
      return this.requestSlice(start, clamp$1(this.fileSize - start, minLength, maxLength));
    } else {
      const promisedAttempt = this.requestSlice(start, maxLength);
      const handleAttempt = (attempt) => {
        if (attempt) {
          return attempt;
        }
        const handleFileSize = (fileSize) => {
          assert(fileSize !== null);
          return this.requestSlice(start, clamp$1(fileSize - start, minLength, maxLength));
        };
        const promisedFileSize = this.source._retrieveSize();
        if (promisedFileSize instanceof Promise) {
          return promisedFileSize.then(handleFileSize);
        } else {
          return handleFileSize(promisedFileSize);
        }
      };
      if (promisedAttempt instanceof Promise) {
        return promisedAttempt.then(handleAttempt);
      } else {
        return handleAttempt(promisedAttempt);
      }
    }
  }
}
class FileSlice {
  constructor(bytes, view, offset, start, end) {
    this.bytes = bytes;
    this.view = view;
    this.offset = offset;
    this.start = start;
    this.end = end;
    this.bufferPos = start - offset;
  }
  static tempFromBytes(bytes) {
    return new FileSlice(bytes, toDataView(bytes), 0, 0, bytes.length);
  }
  get length() {
    return this.end - this.start;
  }
  get filePos() {
    return this.offset + this.bufferPos;
  }
  set filePos(value) {
    this.bufferPos = value - this.offset;
  }
  /** The number of bytes left from the current pos to the end of the slice. */
  get remainingLength() {
    return Math.max(this.end - this.filePos, 0);
  }
  skip(byteCount) {
    this.bufferPos += byteCount;
  }
  /** Creates a new subslice of this slice whose byte range must be contained within this slice. */
  slice(filePos, length = this.end - filePos) {
    if (filePos < this.start || filePos + length > this.end) {
      throw new RangeError("Slicing outside of original slice.");
    }
    return new FileSlice(this.bytes, this.view, this.offset, filePos, filePos + length);
  }
}
const checkIsInRange = (slice, bytesToRead) => {
  if (slice.filePos < slice.start || slice.filePos + bytesToRead > slice.end) {
    throw new RangeError(`Tried reading [${slice.filePos}, ${slice.filePos + bytesToRead}), but slice is [${slice.start}, ${slice.end}). This is likely an internal error, please report it alongside the file that caused it.`);
  }
};
const readBytes = (slice, length) => {
  checkIsInRange(slice, length);
  const bytes = slice.bytes.subarray(slice.bufferPos, slice.bufferPos + length);
  slice.bufferPos += length;
  return bytes;
};
const readU8 = (slice) => {
  checkIsInRange(slice, 1);
  return slice.view.getUint8(slice.bufferPos++);
};
const readU16 = (slice, littleEndian) => {
  checkIsInRange(slice, 2);
  const value = slice.view.getUint16(slice.bufferPos, littleEndian);
  slice.bufferPos += 2;
  return value;
};
const readU16Be = (slice) => {
  checkIsInRange(slice, 2);
  const value = slice.view.getUint16(slice.bufferPos, false);
  slice.bufferPos += 2;
  return value;
};
const readU24Be = (slice) => {
  checkIsInRange(slice, 3);
  const value = getUint24(slice.view, slice.bufferPos, false);
  slice.bufferPos += 3;
  return value;
};
const readI16Be = (slice) => {
  checkIsInRange(slice, 2);
  const value = slice.view.getInt16(slice.bufferPos, false);
  slice.bufferPos += 2;
  return value;
};
const readU32 = (slice, littleEndian) => {
  checkIsInRange(slice, 4);
  const value = slice.view.getUint32(slice.bufferPos, littleEndian);
  slice.bufferPos += 4;
  return value;
};
const readU32Be = (slice) => {
  checkIsInRange(slice, 4);
  const value = slice.view.getUint32(slice.bufferPos, false);
  slice.bufferPos += 4;
  return value;
};
const readU32Le = (slice) => {
  checkIsInRange(slice, 4);
  const value = slice.view.getUint32(slice.bufferPos, true);
  slice.bufferPos += 4;
  return value;
};
const readI32Be = (slice) => {
  checkIsInRange(slice, 4);
  const value = slice.view.getInt32(slice.bufferPos, false);
  slice.bufferPos += 4;
  return value;
};
const readI32Le = (slice) => {
  checkIsInRange(slice, 4);
  const value = slice.view.getInt32(slice.bufferPos, true);
  slice.bufferPos += 4;
  return value;
};
const readU64 = (slice, littleEndian) => {
  let low;
  let high;
  if (littleEndian) {
    low = readU32(slice, true);
    high = readU32(slice, true);
  } else {
    high = readU32(slice, false);
    low = readU32(slice, false);
  }
  return high * 4294967296 + low;
};
const readU64Be = (slice) => {
  const high = readU32Be(slice);
  const low = readU32Be(slice);
  return high * 4294967296 + low;
};
const readI64Be = (slice) => {
  const high = readI32Be(slice);
  const low = readU32Be(slice);
  return high * 4294967296 + low;
};
const readI64Le = (slice) => {
  const low = readU32Le(slice);
  const high = readI32Le(slice);
  return high * 4294967296 + low;
};
const readF32Be = (slice) => {
  checkIsInRange(slice, 4);
  const value = slice.view.getFloat32(slice.bufferPos, false);
  slice.bufferPos += 4;
  return value;
};
const readF64Be = (slice) => {
  checkIsInRange(slice, 8);
  const value = slice.view.getFloat64(slice.bufferPos, false);
  slice.bufferPos += 8;
  return value;
};
const readAscii = (slice, length) => {
  checkIsInRange(slice, length);
  let str = "";
  for (let i = 0; i < length; i++) {
    str += String.fromCharCode(slice.bytes[slice.bufferPos++]);
  }
  return str;
};
class AudioEngine {
  constructor(events) {
    this.events = events;
    this.input = null;
    this.audioSink = null;
    this.audioIterator = null;
    this.audioContext = null;
    this.gainNode = null;
    this.audioContextStartTime = 0;
    this.playbackTimeAtStart = 0;
    this.latestScheduledEndTime = 0;
    this.duration = Number.NaN;
    this.paused = true;
    this.volume = 0.7;
    this.muted = false;
    this.playbackRate = 1;
    this.asyncId = 0;
    this.queuedNodes = /* @__PURE__ */ new Set();
  }
  get currentTime() {
    if (this.paused)
      return this.playbackTimeAtStart;
    return (this.audioContext.currentTime - this.audioContextStartTime) * this.playbackRate + this.playbackTimeAtStart;
  }
  normalizeSource(src) {
    if (typeof src === "string")
      return new UrlSource(src);
    if (src instanceof Blob)
      return new BlobSource(src);
    if (typeof ReadableStream !== "undefined" && src instanceof ReadableStream) {
      return new ReadableStreamSource(src);
    }
    return src;
  }
  ensureAudioContext(sampleRate) {
    if (this.audioContext)
      return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    try {
      this.audioContext = new AudioContext({ sampleRate });
    } catch {
      this.audioContext = new AudioContext();
    }
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.updateGain();
  }
  updateGain() {
    if (!this.gainNode)
      return;
    const v = this.muted ? 0 : this.volume;
    this.gainNode.gain.value = v * v;
  }
  stopQueuedNodes() {
    this.queuedNodes.forEach((node) => node.stop());
    this.queuedNodes.clear();
  }
  async stopIterator() {
    await this.audioIterator?.return();
    this.audioIterator = null;
  }
  async load(src, onMetadata) {
    const id = ++this.asyncId;
    await this.stopIterator();
    this.stopQueuedNodes();
    this.paused = true;
    this.playbackTimeAtStart = 0;
    this.audioContextStartTime = 0;
    const source = this.normalizeSource(src);
    if (!source)
      return;
    this.input = new Input({
      source,
      formats: ALL_FORMATS
    });
    this.duration = await this.input.computeDuration();
    if (id !== this.asyncId)
      return;
    const audioTrack = await this.input.getPrimaryAudioTrack();
    if (!audioTrack) {
      this.audioSink = null;
      this.ensureAudioContext();
      onMetadata?.();
      return;
    }
    if (audioTrack.codec === null || !await audioTrack.canDecode()) {
      this.audioSink = null;
      this.ensureAudioContext();
      onMetadata?.();
      return;
    }
    this.ensureAudioContext(audioTrack.sampleRate);
    this.audioSink = new AudioBufferSink(audioTrack);
    onMetadata?.();
  }
  async runIterator(localId) {
    if (!this.audioSink)
      return;
    await this.stopIterator();
    this.audioIterator = this.audioSink.buffers(this.currentTime);
    while (true) {
      if (localId !== this.asyncId || this.paused)
        return;
      const nextPromise = this.audioIterator.next();
      const checkStarvation = setInterval(() => {
        if (localId !== this.asyncId || this.paused) {
          clearInterval(checkStarvation);
          return;
        }
        if (this.audioContext.state === "running" && this.audioContext.currentTime >= this.latestScheduledEndTime - 0.2) {
          this.audioContext.suspend();
          this.events.emit("waiting");
        }
      }, 50);
      let result;
      try {
        result = await nextPromise;
      } catch (e) {
        console.error("Audio iterator error:", e);
        break;
      } finally {
        clearInterval(checkStarvation);
      }
      if (localId !== this.asyncId || this.paused)
        return;
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
        this.events.emit("canplay");
        this.events.emit("playing");
      }
      if (result.done)
        break;
      const { buffer, timestamp } = result.value;
      const node = this.audioContext.createBufferSource();
      node.buffer = buffer;
      node.connect(this.gainNode);
      node.playbackRate.value = this.playbackRate;
      const startAt = this.audioContextStartTime + (timestamp - this.playbackTimeAtStart) / this.playbackRate;
      const duration = buffer.duration;
      const endAt = startAt + duration / this.playbackRate;
      if (endAt > this.latestScheduledEndTime) {
        this.latestScheduledEndTime = endAt;
      }
      if (startAt >= this.audioContext.currentTime) {
        node.start(startAt);
      } else {
        node.start(
          this.audioContext.currentTime,
          (this.audioContext.currentTime - startAt) * this.playbackRate
        );
      }
      this.queuedNodes.add(node);
      node.onended = () => this.queuedNodes.delete(node);
    }
  }
  async play() {
    if (!this.paused)
      return;
    if (!this.audioContext) {
      this.ensureAudioContext();
    }
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    this.audioContextStartTime = this.audioContext.currentTime;
    this.latestScheduledEndTime = this.audioContextStartTime;
    this.paused = false;
    const id = ++this.asyncId;
    this.runIterator(id);
  }
  pause() {
    if (this.paused)
      return;
    this.playbackTimeAtStart = this.currentTime;
    this.paused = true;
    this.stopIterator();
    this.stopQueuedNodes();
  }
  async seek(time) {
    this.playbackTimeAtStart = Math.max(0, time);
    this.audioContextStartTime = this.audioContext.currentTime;
    this.latestScheduledEndTime = this.audioContextStartTime;
    const id = ++this.asyncId;
    if (!this.paused) {
      this.runIterator(id);
    }
  }
  setVolume(volume, muted) {
    this.volume = volume;
    this.muted = muted;
    this.updateGain();
  }
  setPlaybackRate(rate) {
    if (rate === this.playbackRate)
      return;
    if (!this.paused) {
      this.playbackTimeAtStart = this.currentTime;
      this.audioContextStartTime = this.audioContext.currentTime;
    }
    this.playbackRate = rate;
    if (!this.paused) {
      const id = ++this.asyncId;
      this.runIterator(id);
    }
  }
  destroy() {
    this.asyncId++;
    this.pause();
    this.audioContext?.close();
    this.audioContext = null;
    this.input = null;
    this.audioSink = null;
  }
}
class VideoEngine {
  constructor({
    canvas,
    ctx,
    events,
    timeupdateInterval = 250,
    avSyncTolerance = 0.12,
    dropLateFrames = false,
    poster = "",
    preflightRange = false
  }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.events = events;
    this.timeupdateInterval = timeupdateInterval;
    this.avSyncTolerance = avSyncTolerance;
    this.dropLateFrames = dropLateFrames;
    this.poster = poster;
    this.preflightRange = preflightRange;
    this.input = null;
    this.videoSink = null;
    this.videoIterator = null;
    this.nextFrame = null;
    this.rafId = 0;
    this.asyncId = 0;
    this.width = 0;
    this.height = 0;
    this.duration = Number.NaN;
    this.audioClock = null;
    this.lastTimeUpdate = 0;
    this.stalled = false;
    this.playbackRate = 1;
    this.posterDrawn = false;
    this.isFetching = false;
  }
  normalizeSource(src) {
    if (typeof src === "string")
      return new UrlSource(src);
    if (src instanceof Blob)
      return new BlobSource(src);
    if (typeof ReadableStream !== "undefined" && src instanceof ReadableStream) {
      return new ReadableStreamSource(src);
    }
    return src;
  }
  async preflight(url) {
    if (!this.preflightRange || typeof url !== "string")
      return true;
    try {
      const res = await fetch(url, { method: "HEAD" });
      const acceptRanges = res.headers.get("accept-ranges");
      if (!acceptRanges || acceptRanges === "none") {
        this.events.emit("error", new Event("RangeNotSupported"));
        return false;
      }
      return true;
    } catch (e) {
      console.warn("Preflight check failed:", e);
      return true;
    }
  }
  drawPoster() {
    if (!this.poster || this.posterDrawn)
      return;
    const img = new Image();
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.width = img.naturalWidth || this.canvas.width;
      this.canvas.height = img.naturalHeight || this.canvas.height;
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.posterDrawn = true;
    };
    img.src = this.poster;
  }
  async stopIterator() {
    await this.videoIterator?.return();
    this.videoIterator = null;
  }
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  async load(src, onMetadata) {
    const id = ++this.asyncId;
    await this.stopIterator();
    this.clear();
    this.posterDrawn = false;
    if (!await this.preflight(src))
      return;
    const source = this.normalizeSource(src);
    if (!source) {
      this.drawPoster();
      return;
    }
    this.input = new Input({
      source,
      formats: ALL_FORMATS
    });
    this.duration = await this.input.computeDuration();
    if (id !== this.asyncId)
      return;
    const videoTrack = await this.input.getPrimaryVideoTrack();
    if (!videoTrack) {
      this.handleNoVideoTrack();
      onMetadata?.();
      return;
    }
    if (videoTrack.codec === null || !await videoTrack.canDecode()) {
      this.handleNoVideoTrack();
      onMetadata?.();
      return;
    }
    const transparent = await videoTrack.canBeTransparent();
    this.videoSink = new CanvasSink(videoTrack, {
      poolSize: 2,
      fit: "contain",
      alpha: transparent
    });
    this.width = videoTrack.displayWidth;
    this.height = videoTrack.displayHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    onMetadata?.();
    await this.resetIterator(0);
  }
  handleNoVideoTrack() {
    this.videoSink = null;
    this.width = 0;
    this.height = 0;
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.clear();
    this.drawPoster();
  }
  async resetIterator(time) {
    await this.stopIterator();
    if (!this.videoSink)
      return;
    this.videoIterator = this.videoSink.canvases(time);
    const first = (await this.videoIterator.next()).value ?? null;
    const second = (await this.videoIterator.next()).value ?? null;
    this.nextFrame = second;
    if (first) {
      this.ctx.drawImage(first.canvas, 0, 0);
      this.events.emit("loadeddata");
    } else {
      this.drawPoster();
    }
  }
  async updateNextFrame(localId) {
    if (!this.videoIterator || this.isFetching)
      return;
    this.isFetching = true;
    try {
      while (true) {
        const frame = (await this.videoIterator.next()).value ?? null;
        if (!frame || localId !== this.asyncId)
          return;
        const t = this.audioClock.currentTime;
        const tolerance = this.dropLateFrames ? Math.max(0.06, this.avSyncTolerance / Math.max(1, this.playbackRate)) : 0;
        if (this.dropLateFrames && frame.timestamp < t - tolerance) {
          continue;
        }
        if (frame.timestamp <= t + tolerance) {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(frame.canvas, 0, 0);
          if (!this.dropLateFrames && frame.timestamp > t) {
            this.nextFrame = null;
            return;
          }
        } else {
          this.nextFrame = frame;
          return;
        }
      }
    } finally {
      this.isFetching = false;
    }
  }
  render() {
    if (!this.audioClock)
      return;
    const t = this.audioClock.currentTime;
    const now = Date.now();
    if (now - this.lastTimeUpdate >= this.timeupdateInterval) {
      this.events.emit("timeupdate");
      this.lastTimeUpdate = now;
    }
    if (Number.isFinite(this.duration) && t >= this.duration) {
      this.stop();
      this.stalled = false;
      this.events.emit("ended");
      this.events.emit("pause");
      this.events.emit("canplay");
      return;
    }
    if (this.nextFrame && this.nextFrame.timestamp <= t) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.nextFrame.canvas, 0, 0);
      this.nextFrame = null;
      this.updateNextFrame(this.asyncId);
      if (this.stalled) {
        this.events.emit("canplay");
        this.events.emit("playing");
        this.stalled = false;
      }
    } else if (!this.nextFrame) {
      this.updateNextFrame(this.asyncId);
      if (!this.nextFrame && Number.isFinite(this.duration) && t < this.duration && !this.stalled) {
        this.stalled = true;
        this.events.emit("waiting");
      }
    }
    this.rafId = requestAnimationFrame(() => this.render());
  }
  start(audioEngine) {
    this.audioClock = audioEngine;
    this.asyncId++;
    this.stalled = false;
    this.updateNextFrame(this.asyncId);
    this.rafId = requestAnimationFrame(() => this.render());
  }
  stop() {
    cancelAnimationFrame(this.rafId);
  }
  async seek(time) {
    this.asyncId++;
    await this.resetIterator(time);
  }
  setPlaybackRate(rate) {
    this.playbackRate = Math.max(0.1, Number(rate) || 1);
  }
  destroy() {
    this.asyncId++;
    this.stop();
    this.stopIterator();
    this.posterDrawn = false;
    this.input = null;
    this.videoSink = null;
  }
}
class MediaBunnyEngine {
  constructor({ canvas, ctx, events, option = {} }) {
    this.events = events;
    this.option = option;
    this.audio = new AudioEngine(events);
    this.video = new VideoEngine({
      canvas,
      ctx,
      events,
      timeupdateInterval: option.timeupdateInterval ?? 250,
      avSyncTolerance: option.avSyncTolerance ?? 0.12,
      dropLateFrames: option.dropLateFrames ?? false,
      poster: option.poster ?? "",
      preflightRange: option.preflightRange ?? false
    });
    this.paused = true;
    this.ended = false;
    this.readyState = 0;
    this.networkState = 0;
    this.error = null;
    this.seeking = false;
    this.loadSeq = 0;
    events.addEventListener?.("ended", () => {
      this.ended = true;
      this.paused = true;
    });
  }
  async load(src) {
    const id = ++this.loadSeq;
    this.pause();
    this.ended = false;
    this.error = null;
    this.networkState = 2;
    this.readyState = 0;
    setTimeout(() => this.events.emit("waiting"), 0);
    setTimeout(() => this.events.emit("loadstart"), 0);
    const loadTimeout = Number.isFinite(this.option.loadTimeout) ? this.option.loadTimeout : 0;
    try {
      await Promise.race([
        this.performLoad(src, id),
        loadTimeout > 0 ? this.createTimeout(loadTimeout) : new Promise(() => {
        })
      ]);
    } catch (err) {
      if (id !== this.loadSeq)
        return;
      this.loadSeq++;
      this.error = { code: 4, message: err.message };
      this.networkState = 3;
      this.events.emit("error");
    }
  }
  async performLoad(src, id) {
    let videoMetadataLoaded = false;
    let audioMetadataLoaded = false;
    const checkMetadata = () => {
      if (videoMetadataLoaded && audioMetadataLoaded) {
        this.readyState = 1;
        this.events.emit("loadedmetadata");
        this.events.emit("durationchange");
        this.events.emit("progress");
      }
    };
    try {
      await Promise.all([
        this.video.load(src, () => {
          if (id !== this.loadSeq)
            return;
          videoMetadataLoaded = true;
          checkMetadata();
        }),
        this.audio.load(src, () => {
          if (id !== this.loadSeq)
            return;
          audioMetadataLoaded = true;
          checkMetadata();
        })
      ]);
      if (id !== this.loadSeq)
        return;
      this.readyState = 4;
      this.networkState = 1;
      this.events.emit("loadeddata");
      this.events.emit("canplay");
      this.events.emit("canplaythrough");
      this.events.emit("progress");
    } catch (err) {
      if (id !== this.loadSeq)
        return;
      this.error = { code: 4, message: err.message };
      this.networkState = 3;
      this.events.emit("error");
      console.error("MediaBunny load error:", err);
    }
  }
  createTimeout(ms) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Load timeout")), ms);
    });
  }
  async play() {
    if (!this.paused)
      return;
    if (this.ended) {
      this.ended = false;
      await this.seek(0);
    }
    this.paused = false;
    await this.audio.play();
    this.video.start(this.audio);
    this.events.emit("play");
    this.events.emit("playing");
  }
  pause() {
    if (this.paused)
      return;
    this.paused = true;
    this.audio.pause();
    this.video.stop();
    this.events.emit("pause");
  }
  async seek(time) {
    const shouldResume = !this.paused;
    this.ended = false;
    this.seeking = true;
    this.events.emit("seeking");
    this.events.emit("waiting");
    this.pause();
    await Promise.all([
      this.audio.seek(time),
      this.video.seek(time)
    ]);
    this.seeking = false;
    this.events.emit("seeked");
    if (shouldResume && !this.ended) {
      await this.play();
    }
  }
  setVolume(volume, muted) {
    this.audio.setVolume(volume, muted);
  }
  setPlaybackRate(rate) {
    this.audio.setPlaybackRate(rate);
    this.video.setPlaybackRate(rate);
  }
  destroy() {
    this.pause();
    this.audio.destroy();
    this.video.destroy();
  }
  // Getters
  get currentTime() {
    return this.audio.currentTime;
  }
  get duration() {
    return this.audio.duration || this.video.duration;
  }
  get videoWidth() {
    return this.video.width;
  }
  get videoHeight() {
    return this.video.height;
  }
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, Number(v) || 0));
}
class VideoShim {
  constructor({ art, canvas, ctx, option }) {
    this.art = art;
    this.canvas = canvas;
    this.option = option;
    this.events = new EventTarget();
    this.engine = new MediaBunnyEngine({ canvas, ctx, events: this.events, option });
    this._src = null;
    this._volume = option.volume ?? 0.7;
    this._muted = !!option.muted;
    this._playbackRate = 1;
    this.engine.setVolume(this._volume, this._muted);
    this.setupEventForwarding();
    if (option.source) {
      this.src = option.source;
    } else if (art.option?.url) {
      this.src = art.option.url;
    }
  }
  setupEventForwarding() {
    const { events: artEvents } = this.art.constructor.config;
    artEvents.forEach((name) => {
      this.events.addEventListener(name, (e) => {
        this.art.emit(`video:${e.type}`, e);
      });
    });
  }
  // Event methods
  addEventListener(type, fn) {
    this.events.addEventListener(type, fn);
  }
  removeEventListener(type, fn) {
    this.events.removeEventListener(type, fn);
  }
  // Source
  get src() {
    return this._src;
  }
  set src(v) {
    this._src = v;
    if (v)
      this.engine.load(v);
  }
  get currentSrc() {
    return this._src;
  }
  // Time
  get currentTime() {
    return this.engine.currentTime;
  }
  set currentTime(t) {
    this.engine.seek(Number(t) || 0);
  }
  get duration() {
    return this.engine.duration;
  }
  // Buffered/Played/Seekable
  get buffered() {
    return this.createTimeRanges(0, this.engine.duration);
  }
  get played() {
    return this.createTimeRanges(0, this.engine.currentTime);
  }
  get seekable() {
    return this.createTimeRanges(0, this.engine.duration);
  }
  createTimeRanges(start, end) {
    const duration = this.engine.duration;
    if (!duration || Number.isNaN(duration) || end <= 0) {
      return { length: 0, start: () => 0, end: () => 0 };
    }
    return {
      length: 1,
      start: () => start,
      end: () => end
    };
  }
  // Playback state
  get paused() {
    return this.engine.paused;
  }
  get playing() {
    return !this.engine.paused && !this.engine.ended;
  }
  get ended() {
    return this.engine.ended;
  }
  get seeking() {
    return this.engine.seeking;
  }
  // Ready state
  get readyState() {
    return this.engine.readyState;
  }
  get networkState() {
    return this.engine.networkState;
  }
  get error() {
    return this.engine.error;
  }
  // Playback rate
  get playbackRate() {
    return this._playbackRate;
  }
  set playbackRate(v) {
    const rate = Number(v);
    if (Number.isNaN(rate) || rate <= 0)
      return;
    this._playbackRate = rate;
    this.engine.setPlaybackRate(rate);
    this.events.emit("ratechange");
  }
  // Volume
  get volume() {
    return this._volume;
  }
  set volume(v) {
    this._volume = clamp(v, 0, 1);
    this._muted = false;
    this.engine.setVolume(this._volume, this._muted);
    this.events.emit("volumechange");
  }
  get muted() {
    return this._muted;
  }
  set muted(v) {
    this._muted = !!v;
    this.engine.setVolume(this._volume, this._muted);
    this.events.emit("volumechange");
  }
  // Playback methods
  play() {
    return this.engine.play();
  }
  pause() {
    this.engine.pause();
  }
  load() {
    if (this._src)
      this.engine.load(this._src);
  }
  // Video dimensions
  get videoWidth() {
    return this.engine.videoWidth;
  }
  get videoHeight() {
    return this.engine.videoHeight;
  }
  // Other properties
  get poster() {
    return this.option.poster || "";
  }
  set poster(v) {
    this.option.poster = v;
  }
  get autoplay() {
    return this.option.autoplay || false;
  }
  set autoplay(v) {
  }
  get loop() {
    return this.option.loop || false;
  }
  set loop(v) {
  }
  get controls() {
    return false;
  }
  set controls(v) {
  }
  get playsInline() {
    return true;
  }
  set playsInline(v) {
  }
  get crossOrigin() {
    return this.option.crossOrigin || "";
  }
  set crossOrigin(v) {
  }
  get preload() {
    return "auto";
  }
  set preload(v) {
  }
  get defaultMuted() {
    return false;
  }
  set defaultMuted(v) {
  }
  get defaultPlaybackRate() {
    return 1;
  }
  set defaultPlaybackRate(v) {
  }
  // Methods
  canPlayType(_type) {
    return "maybe";
  }
  getBoundingClientRect() {
    return this.canvas.getBoundingClientRect();
  }
  requestVideoFrameCallback(callback) {
    const id = requestAnimationFrame((time) => {
      callback(time, {
        presentationTime: this.engine.currentTime,
        expectedDisplayTime: time + 16.6,
        width: this.engine.videoWidth,
        height: this.engine.videoHeight,
        mediaTime: this.engine.currentTime,
        presentedFrames: 0,
        processingDuration: 0,
        captureTime: time,
        receiveTime: time,
        rtpTimestamp: 0
      });
    });
    return id;
  }
  cancelVideoFrameCallback(id) {
    cancelAnimationFrame(id);
  }
  setAttribute(name, value) {
    if (name === "src") {
      this.src = value;
    } else if (name === "autoplay") {
      this.autoplay = value;
    } else if (name === "loop") {
      this.loop = value;
    } else if (name === "muted") {
      this.muted = true;
    } else {
      this.canvas.setAttribute(name, value);
    }
  }
  destroy() {
    this.engine.destroy();
  }
}
function artplayerProxyMediabunny(option = {}) {
  return (art) => {
    const { constructor } = art;
    const { createElement } = constructor.utils;
    const canvas = createElement("canvas");
    const ctx = canvas.getContext("2d");
    const shim = new VideoShim({
      art,
      canvas,
      ctx,
      option
    });
    const originalCanvasMethods = {};
    for (const prop in canvas) {
      if (typeof canvas[prop] === "function") {
        originalCanvasMethods[prop] = canvas[prop].bind(canvas);
      }
    }
    const propertyNames = /* @__PURE__ */ new Set([
      ...Object.getOwnPropertyNames(shim),
      ...Object.getOwnPropertyNames(Object.getPrototypeOf(shim))
    ]);
    for (const prop of propertyNames) {
      if (prop === "constructor")
        continue;
      if (!(prop in canvas)) {
        Object.defineProperty(canvas, prop, {
          get() {
            const value = shim[prop];
            return typeof value === "function" ? value.bind(shim) : value;
          },
          set(v) {
            shim[prop] = v;
          },
          configurable: true,
          enumerable: true
        });
      }
    }
    for (const prop in originalCanvasMethods) {
      canvas[prop] = (...args) => originalCanvasMethods[prop](...args);
    }
    function resize() {
      const player = art.template?.$player;
      if (!player || art.option.autoSize)
        return;
      Object.assign(canvas.style, {
        width: "100%",
        height: "100%",
        objectFit: "contain"
      });
    }
    art.on("resize", resize);
    art.on("video:loadedmetadata", resize);
    art.on("destroy", () => {
      shim.destroy();
    });
    return canvas;
  };
}
export {
  artplayerProxyMediabunny as default
};
