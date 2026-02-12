import Upscaler from "./Upscaler.js";

function artplayerPluginWebsr(
    option = {
        networkSize: "medium",
        compare: false,
        weightsBaseUrl: "/weights",
        workerUrl: "/worker/main.js",
        videoScale: 2,
    },
) {
    return (art) => {
        const { $video, $player } = art.template;

        const $canvas = document.createElement("canvas");
        $player.appendChild($canvas);

        $canvas.style.position = "absolute";
        $canvas.style.zIndex = "11";
        $canvas.style.pointerEvents = "none";
        $canvas.style.top = "50%";
        $canvas.style.left = "50%";
        $canvas.style.transform = "translate(-50%, -50%)";
        $canvas.style.opacity = "0";
        $canvas.style.transition = "opacity 0.2s ease";

        function calcCanvasSize() {
            const videoElement = art.video;
            const containerWidth = $player.offsetWidth || 640;
            const containerHeight = $player.offsetHeight || 360;
            const videoWidth = videoElement.videoWidth || 640;
            const videoHeight = videoElement.videoHeight || 360;
            const aspectRatio = videoWidth / videoHeight;
            let displayWidth = containerWidth;
            let displayHeight = containerHeight;
            if (containerWidth / containerHeight > aspectRatio) {
                displayWidth = containerHeight * aspectRatio;
            } else {
                displayHeight = containerWidth / aspectRatio;
            }
            return { displayWidth, displayHeight };
        }

        if (!Upscaler || !Upscaler.isSupported || !Upscaler.isSupported()) {
            console.warn("Upscaler is not supported in this environment");
            return;
        }

        const upscaler = new Upscaler({
            networkSize: option.networkSize || "medium",
            weightsBaseUrl: option.weightsBaseUrl || "/weights",
            workerUrl: option.workerUrl || "/worker/main.js",
            videoScale: option.videoScale || 2,
        });

        let realtimeStarted = false;

        async function startRealtime() {
            if (realtimeStarted) return;
            realtimeStarted = true;

            try {
                await new Promise((resolve, reject) => {
                    if ($video.readyState >= 1) {
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
                        $video.removeEventListener("loadedmetadata", onLoaded);
                        $video.removeEventListener("error", onError);
                    };
                    $video.addEventListener("loadedmetadata", onLoaded);
                    $video.addEventListener("error", onError);
                });

                await upscaler.startRealtimeUpscale(
                    $video,
                    $canvas,
                    option.networkSize || upscaler.networkSize,
                );

                requestAnimationFrame(() => {
                    $canvas.style.opacity = "1";
                });
            } catch (e) {
                console.error(
                    "artplayer-plugin-upscaler: failed to start realtime",
                    e,
                );
            }
        }

        const { displayWidth, displayHeight } = calcCanvasSize();
        $canvas.style.width = displayWidth + "px";
        $canvas.style.height = displayHeight + "px";

        let comparePosition = 50;
        let isDragging = false;
        let compareEnabled = !!option.compare;

        const $handler = document.createElement("div");
        $handler.style.position = "absolute";
        $handler.style.width = "3px";
        $handler.style.backgroundColor = "rgba(255, 255, 255, 0.75)";
        $handler.style.cursor = "ew-resize";
        $handler.style.zIndex = "12";
        $handler.style.pointerEvents = "auto";
        $handler.style.display = compareEnabled ? "block" : "none";
        $handler.style.boxShadow = "0 0 2px rgba(0, 0, 0, 0.1)";

        if (compareEnabled) {
            $player.appendChild($handler);
            $handler.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            updateCompareMask();
        }

        function updateCompareMask() {
            if (compareEnabled) {
                const { displayWidth, displayHeight } = calcCanvasSize();
                const gradient = `linear-gradient(to right, transparent 0%, transparent ${comparePosition}%, black ${comparePosition}%, black 100%)`;
                $canvas.style.maskImage = gradient;

                const containerWidth = $player.offsetWidth || 640;
                const containerHeight = $player.offsetHeight || 360;
                const canvasLeft = (containerWidth - displayWidth) / 2;
                const canvasTop = (containerHeight - displayHeight) / 2;
                const handlerX =
                    canvasLeft + (displayWidth * comparePosition) / 100;

                $handler.style.top = canvasTop + "px";
                $handler.style.left = handlerX + "px";
                $handler.style.height = displayHeight + "px";
                $handler.style.transform = "translateX(-50%)";
            } else {
                $canvas.style.maskImage = "none";
            }
        }

        function handleMouseDown(e) {
            if (compareEnabled) {
                isDragging = true;
            }
        }

        function handleMouseMove(e) {
            if (compareEnabled && isDragging) {
                const rect = $player.getBoundingClientRect();
                const { displayWidth } = calcCanvasSize();
                const containerWidth = $player.offsetWidth || 640;
                const canvasLeft = (containerWidth - displayWidth) / 2;
                const x = e.clientX - rect.left;
                const relativeX = x - canvasLeft;
                comparePosition = (relativeX / displayWidth) * 100;
                comparePosition = Math.max(0, Math.min(100, comparePosition));
                updateCompareMask();
            }
        }

        function handleMouseUp(e) {
            isDragging = false;
        }

        art.on("destroy", () => {
            if (upscaler && typeof upscaler.dispose === "function") {
                upscaler.dispose();
            }
            $handler.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        });

        art.on("resize", () => {
            const { displayWidth, displayHeight } = calcCanvasSize();
            $canvas.style.width = displayWidth + "px";
            $canvas.style.height = displayHeight + "px";
            updateCompareMask();
        });

        art.on("play", () => {
            startRealtime();
        });

        function update(newOption = {}) {
            if (!newOption || typeof newOption !== "object") return;

            if (Object.prototype.hasOwnProperty.call(newOption, "compare")) {
                const nextCompare = !!newOption.compare;
                option.compare = nextCompare;
                compareEnabled = nextCompare;

                if (compareEnabled) {
                    if (!$handler.parentNode) {
                        $player.appendChild($handler);
                    }
                    $handler.style.display = "block";
                    $handler.addEventListener("mousedown", handleMouseDown);
                    document.addEventListener("mousemove", handleMouseMove);
                    document.addEventListener("mouseup", handleMouseUp);
                    updateCompareMask();
                } else {
                    $canvas.style.maskImage = "none";
                    $handler.style.display = "none";
                    $handler.removeEventListener("mousedown", handleMouseDown);
                    document.removeEventListener("mousemove", handleMouseMove);
                    document.removeEventListener("mouseup", handleMouseUp);
                }
            }

            if (newOption.networkSize) {
                const nextSize = newOption.networkSize;
                option.networkSize = nextSize;
                if (
                    upscaler &&
                    typeof upscaler.stopRealtimeUpscale === "function"
                ) {
                    upscaler.stopRealtimeUpscale();
                }
                realtimeStarted = false;
                if (!art.paused) {
                    startRealtime();
                }
            }
        }

        return {
            name: "artplayerPluginWebsr",
            upscaler,
            update,
        };
    };
}

window.artplayerPluginWebsr = artplayerPluginWebsr;
