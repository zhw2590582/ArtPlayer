import Upscaler from "./Upscaler";

export default function artplayerPluginWebsr(
    option = {
        networkSize: "medium",
        compare: false,
    },
) {
    return async (art) => {
        const { $video, $player } = art.template;

        const $canvas = document.createElement("canvas");
        $player.appendChild($canvas);

        $canvas.style.position = "absolute";
        $canvas.style.zIndex = "11";
        $canvas.style.pointerEvents = "none";
        $canvas.style.top = "50%";
        $canvas.style.left = "50%";
        $canvas.style.transform = "translate(-50%, -50%)";

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

        const upscaler = new Upscaler(option);
        upscaler.init();
        await upscaler.startRealtimeUpscale(
            $video,
            $canvas,
            option.networkSize,
        );

        // 初始化 canvas 显示尺寸
        const { displayWidth, displayHeight } = calcCanvasSize();
        $canvas.style.width = displayWidth + "px";
        $canvas.style.height = displayHeight + "px";

        // 对比模式
        let comparePosition = 50;
        let isDragging = false;

        // 创建对比手柄
        const $handler = document.createElement("div");
        $handler.style.position = "absolute";
        $handler.style.width = "3px";
        $handler.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
        $handler.style.cursor = "ew-resize";
        $handler.style.zIndex = "12";
        $handler.style.pointerEvents = "auto";
        $handler.style.display = option.compare ? "block" : "none";
        $handler.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.1)";

        if (option.compare) {
            $player.appendChild($handler);
            $handler.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            updateCompareMask();
        }

        function updateCompareMask() {
            if (option.compare) {
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
            if (option.compare) {
                isDragging = true;
            }
        }

        function handleMouseMove(e) {
            if (option.compare && isDragging) {
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
            upscaler.dispose();
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

        return {
            name: "artplayerPluginWebsr",
        };
    };
}

if (typeof window !== "undefined") {
    window.artplayerPluginWebsr = artplayerPluginWebsr;
}
