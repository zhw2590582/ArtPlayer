import type Artplayer from 'artplayer'

interface Option {
    preset?: string | null
    autoStart?: boolean
    autoPlay?: boolean
    pipelineBuilder?: (device: GPUDevice, inputTexture: GPUTexture) => any[]
    compare?: boolean
}

interface Result {
    name: 'artplayerPluginAnime4k'
    start: () => Promise<void>
    update: (option: Option) => void
}

declare const artplayerPluginAnime4k: (option?: Option) => (art: Artplayer) => Result

export default artplayerPluginAnime4k