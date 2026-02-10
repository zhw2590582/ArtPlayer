import WebSR from '@websr/websr';

export default function artplayerPluginWebsr(option = {}) {
    return (art) => {
        const {
            template: { $player },
            constructor: {
                validator,
                utils: { append, setStyles },
            },
        } = art;

        // Default options
        option = validator(
            {
                scale: 2,
                networkName: '',
                weights: null,
                compare: false,
                ...option,
            },
            {
                scale: 'number',
                networkName: 'string',
                weights: '?string|object',
                compare: 'boolean',
            }
        );

        // Validate required parameters
        if (!option.networkName) {
            console.error('WebSR: networkName is required');
        }
        if (!option.weights) {
            console.error('WebSR: weights is required');
        }

        let websr = null;
        let gpu = null;
        let isInitialized = false;
        let isEnabled = true;  // Always enabled
        let renderFrameId = null;
        let comparePosition = 0.5;  // Comparison split position (0-1)
        let isCompareDragging = false;

        // Create canvas for upscaled output
        const $canvas = document.createElement('canvas');
        $canvas.id = 'artplayer-websr-canvas';
        setStyles($canvas, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'block',
            pointerEvents: 'none',
            zIndex: '11',
            imageRendering: 'crisp-edges',
        });
        append($player, $canvas);

        // Create comparison divider
        const $compareDivider = document.createElement('div');
        $compareDivider.id = 'artplayer-websr-divider';
        setStyles($compareDivider, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '2px',
            height: '100%',
            backgroundColor: '#fff',
            display: option.compare ? 'block' : 'none',
            pointerEvents: 'auto',
            cursor: 'col-resize',
            zIndex: '12',
        });
        append($player, $compareDivider);

        // Function to update divider position and canvas clip-path
        function updateDividerPosition(pos) {
            comparePosition = Math.max(0, Math.min(1, pos));
            const offsetX = comparePosition * 100;
            setStyles($compareDivider, {
                left: offsetX + '%',
            });
            
            // Update canvas clip-path to show only right side (upscaled)
            if (option.compare) {
                const clipPercent = comparePosition * 100;
                setStyles($canvas, {
                    clipPath: `inset(0 0 0 ${clipPercent}%)`,
                });
            }
        }

        // Mouse events for comparison dragging
        document.addEventListener('mousemove', (e) => {
            if (!isCompareDragging) return;
            const rect = $player.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            updateDividerPosition(pos);
        });

        document.addEventListener('mouseup', () => {
            isCompareDragging = false;
        });

        $compareDivider.addEventListener('mousedown', () => {
            isCompareDragging = true;
        });

        // Touch events for mobile
        document.addEventListener('touchmove', (e) => {
            if (!isCompareDragging) return;
            const rect = $player.getBoundingClientRect();
            const pos = (e.touches[0].clientX - rect.left) / rect.width;
            updateDividerPosition(pos);
        }, { passive: true });

        document.addEventListener('touchend', () => {
            isCompareDragging = false;
        });

        $compareDivider.addEventListener('touchstart', () => {
            isCompareDragging = true;
        });

        // Function to calculate canvas size based on video aspect ratio
        function calcCanvasSize() {
            const videoElement = art.video;
            if (!videoElement) {
                return { displayWidth: 640, displayHeight: 360 };
            }

            const containerWidth = $player.offsetWidth || 640;
            const containerHeight = $player.offsetHeight || 360;
            const videoWidth = videoElement.videoWidth || 640;
            const videoHeight = videoElement.videoHeight || 360;
            const aspectRatio = videoWidth / videoHeight;

            let displayWidth = containerWidth;
            let displayHeight = containerHeight;

            if (containerWidth / containerHeight > aspectRatio) {
                // Container is wider than video
                displayWidth = containerHeight * aspectRatio;
            } else {
                // Container is taller than video
                displayHeight = containerWidth / aspectRatio;
            }

            return { displayWidth, displayHeight };
        }

        // Initialize WebGPU and WebSR
        async function initWebSR() {
            try {
                if (isInitialized) return true;

                // Check WebGPU support
                if (!navigator.gpu) {
                    console.warn('WebGPU is not supported');
                    return false;
                }

                // Initialize WebGPU
                gpu = await WebSR.initWebGPU();
                if (!gpu) {
                    console.warn('Failed to initialize WebGPU');
                    return false;
                }

                // Load weights
                let weights;
                if (typeof option.weights === 'string') {
                    // If weights is a URL, fetch it
                    const weightResponse = await fetch(option.weights);
                    if (!weightResponse.ok) {
                        console.warn(`Failed to load weights from ${option.weights}`);
                        return false;
                    }
                    weights = await weightResponse.json();
                } else if (typeof option.weights === 'object') {
                    // If weights is an object, use it directly
                    weights = option.weights;
                } else {
                    console.warn('Invalid weights format');
                    return false;
                }

                // Create WebSR instance
                const videoElement = art.video;
                if (!videoElement) {
                    console.warn('Video element not found');
                    return false;
                }

                // Set canvas dimensions based on video aspect ratio
                const { displayWidth, displayHeight } = calcCanvasSize();
                $canvas.width = displayWidth * option.scale;
                $canvas.height = displayHeight * option.scale;
                setStyles($canvas, {
                    width: displayWidth + 'px',
                    height: displayHeight + 'px',
                });

                websr = new WebSR({
                    source: videoElement,
                    network_name: option.networkName,
                    weights: weights,
                    gpu: gpu,
                    canvas: $canvas,
                });

                isInitialized = true;
                return true;
            } catch (error) {
                console.error('WebSR initialization error:', error);
                return false;
            }
        }

        // Render single frame
        async function renderSingleFrame() {
            if (!websr || !isEnabled || !art.video) {
                return;
            }

            try {
                await websr.render(art.video);
            } catch (error) {
                console.error('WebSR render error:', error);
            }
        }

        // Render frame function
        async function renderFrame() {
            if (!websr || !isEnabled || !art.video || art.video.paused) {
                renderFrameId = null;
                return;
            }

            try {
                await websr.render(art.video);
            } catch (error) {
                console.error('WebSR render error:', error);
            }

            // Continue rendering
            if (isEnabled && !art.video.paused) {
                renderFrameId = requestAnimationFrame(renderFrame);
            }
        }

        // Enable WebSR
        async function enable() {
            if (isEnabled) return;

            if (!isInitialized) {
                const initialized = await initWebSR();
                if (!initialized) {
                    console.error('Failed to initialize WebSR');
                    return;
                }
            }

            isEnabled = true;
            setStyle($canvas, 'display', 'block');

            // Start rendering if video is playing
            if (art.video && !art.video.paused) {
                renderFrameId = requestAnimationFrame(renderFrame);
            }

            art.emit('artplayerPluginWebsr:enable');
        }

        // Disable WebSR
        function disable() {
            if (!isEnabled) return;

            isEnabled = false;
            setStyles($canvas, {
                display: 'none',
            });

            // Cancel ongoing render
            if (renderFrameId) {
                cancelAnimationFrame(renderFrameId);
                renderFrameId = null;
            }

            art.emit('artplayerPluginWebsr:disable');
        }

        // Toggle WebSR
        async function toggle() {
            if (isEnabled) {
                disable();
            } else {
                await enable();
            }
        }

        // Listen to video events
        art.on('play', () => {
            renderSingleFrame();  // Render current frame immediately
            if (isEnabled && isInitialized && !renderFrameId) {
                renderFrameId = requestAnimationFrame(renderFrame);
            }
        });

        art.on('pause', () => {
            if (renderFrameId) {
                cancelAnimationFrame(renderFrameId);
                renderFrameId = null;
            }
        });

        art.on('seek', () => {
            if (isEnabled && isInitialized && !art.video.paused && !renderFrameId) {
                renderFrameId = requestAnimationFrame(renderFrame);
            }
        });

        art.on('resize', () => {
            if (websr && $canvas.offsetParent) {
                const { displayWidth, displayHeight } = calcCanvasSize();
                $canvas.width = displayWidth * option.scale;
                $canvas.height = displayHeight * option.scale;
                setStyles($canvas, {
                    width: displayWidth + 'px',
                    height: displayHeight + 'px',
                });
            }
        });

        art.on('destroy', () => {
            disable();
            if (renderFrameId) {
                cancelAnimationFrame(renderFrameId);
                renderFrameId = null;
            }
            if ($canvas.parentNode) {
                $canvas.parentNode.removeChild($canvas);
            }
        });

        // Initialize if enabled by default
        initWebSR().then(() => {
            // Render first frame after initialization
            if (isEnabled && isInitialized && art.video) {
                renderSingleFrame();
            }
        }).catch(err => console.error('Failed to init WebSR:', err));

        // Return plugin API
        return {
            name: 'artplayerPluginWebsr',
            websr: () => websr,
            gpu: () => gpu,
            canvas: () => $canvas,
            enable,
            disable,
            toggle,
            isEnabled: () => isEnabled,
            isInitialized: () => isInitialized,
            // Comparison mode methods
            enableCompare: () => {
                option.compare = true;
                setStyles($compareDivider, { display: 'block' });
                updateDividerPosition(comparePosition);
            },
            disableCompare: () => {
                option.compare = false;
                setStyles($compareDivider, { display: 'none' });
                setStyles($canvas, { clipPath: 'none' });
            },
            toggleCompare: () => {
                if (option.compare) {
                    setStyles($compareDivider, { display: 'none' });
                    setStyles($canvas, { clipPath: 'none' });
                    option.compare = false;
                } else {
                    option.compare = true;
                    setStyles($compareDivider, { display: 'block' });
                    updateDividerPosition(comparePosition);
                }
            },
            setComparePosition: (pos) => {
                updateDividerPosition(pos);
            },
            getComparePosition: () => comparePosition,
            isComparing: () => option.compare,
            update: async (newOption) => {
                // Update weights and networkName (requires re-initialization)
                if ((newOption.weights !== undefined && newOption.weights !== option.weights) ||
                    (newOption.networkName !== undefined && newOption.networkName !== option.networkName)) {
                    // Update option values
                    if (newOption.weights !== undefined) {
                        option.weights = newOption.weights;
                    }
                    if (newOption.networkName !== undefined) {
                        option.networkName = newOption.networkName;
                    }
                    // Mark as uninitialized to reload with new config
                    isInitialized = false;
                    // Reinitialize if enabled
                    if (isEnabled) {
                        await initWebSR();
                    }
                }

                // Update scale factor
                if (newOption.scale !== undefined && newOption.scale !== option.scale) {
                    option.scale = newOption.scale;
                    if ($canvas) {
                        const { displayWidth, displayHeight } = calcCanvasSize();
                        $canvas.width = displayWidth * option.scale;
                        $canvas.height = displayHeight * option.scale;
                        setStyles($canvas, {
                            width: displayWidth + 'px',
                            height: displayHeight + 'px',
                        });
                    }
                }
            },
        };
    };
}

if (typeof window !== 'undefined') {
    window.artplayerPluginWebsr = artplayerPluginWebsr;
}
