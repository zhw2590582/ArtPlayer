interface Option {
    /**
     * Upscale factor
     * @default 2
     */
    scale?: number;
    /**
     * Network name for upscaling (required)
     * e.g., 'anime4k/cnn-2x-m-an'
     */
    networkName: string;
    /**
     * Weights for the neural network (required)
     * Can be a URL string or a pre-loaded weights object
     * e.g., '/path/to/weights.json' or { layers: [...] }
     */
    weights: string | object;
    /**
     * Enable comparison mode
     * @default false
     */
    compare?: boolean;
}

interface Result {
    name: 'artplayerPluginWebsr';
    /**
     * Get WebSR instance
     */
    websr: () => any;
    /**
     * Get GPU context
     */
    gpu: () => any;
    /**
     * Get canvas element
     */
    canvas: () => HTMLCanvasElement;
    /**
     * Enable WebSR upscaling
     */
    enable: () => Promise<void>;
    /**
     * Disable WebSR upscaling
     */
    disable: () => void;
    /**
     * Toggle WebSR upscaling
     */
    toggle: () => Promise<void>;
    /**
     * Check if WebSR is enabled
     */
    isEnabled: () => boolean;
    /**
     * Check if WebSR is initialized
     */
    isInitialized: () => boolean;
    /**
     * Update options at runtime
     * Supported options: enabled, weights, networkName, scale
     */
    update: (option: Partial<Option>) => Promise<void>;
    /**
     * Enable comparison mode
     */
    enableCompare: () => void;
    /**
     * Disable comparison mode
     */
    disableCompare: () => void;
    /**
     * Toggle comparison mode
     */
    toggleCompare: () => void;
    /**
     * Set comparison split position (0-1)
     */
    setComparePosition: (pos: number) => void;
    /**
     * Get current comparison split position (0-1)
     */
    getComparePosition: () => number;
    /**
     * Check if comparison mode is enabled
     */
    isComparing: () => boolean;
}

declare const artplayerPluginWebsr: (option?: Option) => (art: Artplayer) => Result;

export default artplayerPluginWebsr

export = packages\artplayerPluginWebsr\types\artplayerPluginWebsr;
export as namespace packages\artplayerPluginWebsr\types\artplayerPluginWebsr;