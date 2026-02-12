import { CNNx2UL, GANUUL, ModeA, render } from 'anime4k-webgpu'

export default function artplayerPluginAnime4k(option = {}) {
    return (art) => {
        const {
            template: { $video, $player },
            constructor: {
                utils: { isMobile },
            },
        } = art

        const config = {
            // 使用 Anime4K-WebGPU 的预设模式：'modeA' | null
            preset: option.preset || null,
            // 是否在播放器 ready 后自动启动 Anime4K 渲染
            autoStart: option.autoStart !== false,
            // 是否在启动渲染后自动播放视频
            autoPlay: option.autoPlay !== false,
            // 自定义 pipelineBuilder，优先级最高
            pipelineBuilder: typeof option.pipelineBuilder === 'function' ? option.pipelineBuilder : null,
            // 对比模式：开启后可以拖动中线，对比 Anime4K 与原始画面
            compare: !!option.compare,
        }

        // 创建覆盖在视频上的 canvas，由 anime4k-webgpu 负责用 WebGPU 渲染
        const $canvas = document.createElement('canvas')
        $player.appendChild($canvas)

        $canvas.style.position = 'absolute'
        $canvas.style.zIndex = '11'
        $canvas.style.pointerEvents = 'none'
        $canvas.style.top = '50%'
        $canvas.style.left = '50%'
        $canvas.style.transform = 'translate(-50%, -50%)'
        $canvas.style.opacity = '0'
        $canvas.style.transition = 'opacity 0.2s ease'

        let inited = false
        let destroyed = false
        let starting = false

        let comparePosition = 50
        let isDragging = false
        let compareEnabled = !!config.compare

        const $handler = document.createElement('div')
        $handler.style.position = 'absolute'
        $handler.style.width = '3px'
        $handler.style.backgroundColor = 'rgba(255, 255, 255, 0.75)'
        $handler.style.cursor = 'ew-resize'
        $handler.style.zIndex = '12'
        $handler.style.pointerEvents = 'auto'
        $handler.style.display = compareEnabled ? 'block' : 'none'
        $handler.style.boxShadow = '0 0 2px rgba(0, 0, 0, 0.1)'

        if (compareEnabled) {
            $player.appendChild($handler)
            $handler.addEventListener('mousedown', handleMouseDown)
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        function calcCanvasSize() {
            const videoElement = art.video
            const containerWidth = $player.offsetWidth || 640
            const containerHeight = $player.offsetHeight || 360
            const videoWidth = videoElement.videoWidth || 640
            const videoHeight = videoElement.videoHeight || 360
            const aspectRatio = videoWidth / videoHeight
            let displayWidth = containerWidth
            let displayHeight = containerHeight
            if (containerWidth / containerHeight > aspectRatio) {
                displayWidth = containerHeight * aspectRatio
            }
            else {
                displayHeight = containerWidth / aspectRatio
            }
            return { displayWidth, displayHeight }
        }

        function resizeCanvas() {
            const { displayWidth, displayHeight } = calcCanvasSize()
            $canvas.width = displayWidth
            $canvas.height = displayHeight
            $canvas.style.width = `${displayWidth}px`
            $canvas.style.height = `${displayHeight}px`
            updateCompareMask()
        }

        function updateCompareMask() {
            if (compareEnabled) {
                const { displayWidth, displayHeight } = calcCanvasSize()
                const gradient = `linear-gradient(to right, transparent 0%, transparent ${comparePosition}%, black ${comparePosition}%, black 100%)`
                $canvas.style.maskImage = gradient

                const containerWidth = $player.offsetWidth || 640
                const containerHeight = $player.offsetHeight || 360
                const canvasLeft = (containerWidth - displayWidth) / 2
                const canvasTop = (containerHeight - displayHeight) / 2
                const handlerX = canvasLeft + (displayWidth * comparePosition) / 100

                $handler.style.top = `${canvasTop}px`
                $handler.style.left = `${handlerX}px`
                $handler.style.height = `${displayHeight}px`
                $handler.style.transform = 'translateX(-50%)'
            }
            else {
                $canvas.style.maskImage = 'none'
            }
        }

        function handleMouseDown() {
            if (compareEnabled) {
                isDragging = true
            }
        }

        function handleMouseMove(event) {
            if (compareEnabled && isDragging) {
                const rect = $player.getBoundingClientRect()
                const { displayWidth } = calcCanvasSize()
                const containerWidth = $player.offsetWidth || 640
                const canvasLeft = (containerWidth - displayWidth) / 2
                const x = event.clientX - rect.left
                const relativeX = x - canvasLeft
                comparePosition = (relativeX / displayWidth) * 100
                comparePosition = Math.max(0, Math.min(100, comparePosition))
                updateCompareMask()
            }
        }

        function handleMouseUp() {
            isDragging = false
        }

        async function start() {
            if (destroyed || starting || inited)
                return
            if (typeof navigator === 'undefined' || !navigator.gpu) {
                console.warn('[artplayer-plugin-anime4k] WebGPU is not supported in this environment')
                return
            }

            starting = true
            resizeCanvas()

            try {
                await render({
                    video: $video,
                    canvas: $canvas,
                    pipelineBuilder: (device, inputTexture) => {
                        if (config.pipelineBuilder) {
                            return config.pipelineBuilder(device, inputTexture)
                        }

                        if (config.preset === 'modeA') {
                            const preset = new ModeA({
                                device,
                                inputTexture,
                                nativeDimensions: {
                                    width: $video.videoWidth,
                                    height: $video.videoHeight,
                                },
                                targetDimensions: {
                                    width: $canvas.width,
                                    height: $canvas.height,
                                },
                            })
                            return [preset]
                        }

                        // 默认：先放大再修复
                        const upscale = new CNNx2UL({
                            device,
                            inputTexture,
                        })
                        const restore = new GANUUL({
                            device,
                            inputTexture: upscale.getOutputTexture(),
                        })
                        return [upscale, restore]
                    },
                })

                inited = true
                starting = false

                requestAnimationFrame(() => {
                    $canvas.style.opacity = '1'
                })

                if (config.autoPlay && art.paused && !isMobile) {
                    $video.play().catch(() => null)
                }
            }
            catch (error) {
                starting = false
                console.error('[artplayer-plugin-anime4k] Failed to initialize Anime4K-WebGPU', error)
            }
        }

        function update(newOption = {}) {
            if (!newOption || typeof newOption !== 'object')
                return
            if (Object.prototype.hasOwnProperty.call(newOption, 'preset')) {
                config.preset = newOption.preset
            }
            if (Object.prototype.hasOwnProperty.call(newOption, 'autoStart')) {
                config.autoStart = !!newOption.autoStart
            }
            if (Object.prototype.hasOwnProperty.call(newOption, 'autoPlay')) {
                config.autoPlay = !!newOption.autoPlay
            }
            if (typeof newOption.pipelineBuilder === 'function') {
                config.pipelineBuilder = newOption.pipelineBuilder
            }
            if (Object.prototype.hasOwnProperty.call(newOption, 'compare')) {
                const nextCompare = !!newOption.compare
                config.compare = nextCompare
                compareEnabled = nextCompare

                if (compareEnabled) {
                    if (!$handler.parentNode) {
                        $player.appendChild($handler)
                    }
                    $handler.style.display = 'block'
                    $handler.addEventListener('mousedown', handleMouseDown)
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                    updateCompareMask()
                }
                else {
                    $canvas.style.maskImage = 'none'
                    $handler.style.display = 'none'
                    $handler.removeEventListener('mousedown', handleMouseDown)
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                }
            }
        }

        art.on('resize', resizeCanvas)
        art.once('ready', () => {
            resizeCanvas()
            if (config.autoStart)
                start()
        })

        art.on('destroy', () => {
            destroyed = true
            $canvas.remove()
            $handler.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
            if ($handler.parentNode) {
                $handler.parentNode.removeChild($handler)
            }
        })

        return {
            name: 'artplayerPluginAnime4k',
            start,
            update,
        }
    }
}

if (typeof window !== 'undefined') {
    window.artplayerPluginAnime4k = artplayerPluginAnime4k
}