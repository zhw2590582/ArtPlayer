import ads from 'artplayer-plugin-ads'

const option: Parameters<typeof ads>[0] = { source: 'ad.mp4', type: 'video', totalDuration: 10, playDuration: 2, muted: true }
const plugin = ads(option)
const resultName: ReturnType<typeof plugin>['name'] = 'artplayerPluginAds'
const result: ReturnType<typeof plugin> = { name: resultName, skip() {}, pause() {}, play() {} }
const returns: void[] = [result.skip(), result.pause(), result.play()]
void [returns, plugin]
