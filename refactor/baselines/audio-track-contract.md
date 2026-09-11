# Audio Track 1.1.0 兼容基线

PKG-AUDIO-01；源码起点 26b2983daf9edf9c798ce6a1638deeb3c36ba778。
固定来源、逐文件 SHA-256、npm SRI、历史源码及比较结果见
[audio-track-release.json](audio-track-release.json)。不覆盖 BASE-01 的历史快照。

## 来源与范围

npm 观察到 1.0.0、1.1.0，采集时 latest 为 1.1.0。本次实际归档范围为 **1.1.0**，
不是所有历史版本。六文件归档完整性通过，manifest、README、公开声明与起点源码
在 LF 规范化后相同，发布 ESM 与源码工厂经 AST 提取/esbuild 规范化后相同。
这证明比较范围内的逻辑一致，不能代替真实媒体行为测试。

registry gitHead daf133b22630b4a0eecfa3336bbddab0e9119d96 对应本地包版本 1.0.2，
不是该 npm 1.1.0 源码的充分证明；因此保留归档完整性和独立工厂比较。
manifest 无 runtime/peer 依赖、无核心/浏览器/TS 最低版本承诺。
旧核心对照使用现有冻结的 5.4.0；这只是具体检查点，不宣称最低支持版本为 5.4.0。

## 公开形状及调用

```js
const attach = artplayerPluginAudioTrack({ url: '/audio.aac', offset: 0, sync: 0.3 })
// ArtPlayer 注册时调用 attach(art)
const result = art.plugins.artplayerPluginAudioTrack
result.update({ url: '/next.aac', offset: 0.2 })
const audio = result.audio // 同一 HTMLAudioElement，可直接操作
```

工厂配置为必传对象；工厂同步返回安装函数，安装同步返回 `{ name, audio, update }`。
name 固定为 `artplayerPluginAudioTrack`，update 同步返回 undefined。没有额外公开 destroy、
事件、UI、CSS、静态版本或 SDK。插件创建独立 Audio 元素，不替换主视频，也不自动静音主视频；
因此含原音轨的主视频可能与外部音频同时播放，这是现有行为，不静默改变音量策略。
每次安装创建独立状态；配置在安装时解构，调用工厂后、安装前的对象修改会生效。

| 输入或行为 | 1.1.0 源码/发布实现事实 | 兼容与后续验证 |
| --- | --- | --- |
| url | 初始仅 truthy 时赋给 audio.src，preload 为 auto | URL 字符串交给浏览器解析，无 SDK |
| offset | 默认 0，目标 audio 时间是 art.currentTime + offset | 正数音频领先、负数滞后；负目标/超时长在 02 实测 |
| sync | 默认 0.3，仅绝对偏差严格大于阈值才 seek | 等于阈值不写；未校验负数、NaN、Infinity，不能凭猜测新增拒绝规则 |
| update | truthy 且不同 URL 才赋 src；playing 时调用 play；之后才更新 offset/sync | 同 URL 不重载，空 URL 不清源；JS 允许只传 offset/sync，且不立即同步 |
| audio | 公开真实元素，同一引用贯穿安装/更新/销毁 | 不换为不可访问封装，不用新元素实现每次切源 |
| 音量/倍率 | 初始 volume/muted 来自 art；倍率 video?.playbackRate 或 1 | 后续 video:volumechange/ratechange 同步，无自有主视频 mute |
| play 拒绝 | 三个调用点各自 catch 并 console.warn 原错误 | 没有返回给调用者的 play Promise、没有自定义错误事件 |

| ArtPlayer 事件 | 外部音频行为 |
| --- | --- |
| play | 有 URL 才同步目标时间，随后 audio.play |
| pause | audio.pause |
| seek | 有 video/URL 才同步时间 |
| video:timeupdate | art.playing 时同步时间 |
| video:ratechange | 读 art.video.playbackRate |
| video:volumechange | 同步 art.volume 和 art.muted |
| video:waiting | audio.pause |
| video:playing | 有 URL 且 art.playing 才 audio.play，不主动 sync |
| destroy | pause、src = ''、load，按此顺序 |

没有定时器或自建请求；浏览器拥有媒体加载。当前九个 emitter 回调没有插件自身解绑，
依赖核心销毁清空事件。没有 closed 状态，外部保留的 update 可在销毁后写入新 src。
这些是源码观察，02 用受控复现及真实媒体验证；不能只凭观察称内存泄漏已复现。

## 类型和分发

公开默认导出为 `(option: Option) => (art: Artplayer) => Result`，Option.url 必需、
offset/sync 可选；Result.audio 为 HTMLAudioElement，update(option: Option): void。
Option/Result 未具名导出，消费者可用 Parameters/ReturnType 提取；04 保留这些旧合法调用。
JS 的 update({ offset: 1 }) 与声明不一致，允许拓宽 update 为部分配置，但不弱化字段类型。
docs 编辑器声明还同时包含 export default/export =，由 04 做语义验证及生成修正，
本步不声称编辑器或 TS 消费已经通过。

root exports 使用 types + import(mjs)/require(js)，legacy import/require 都指向 legacy.js；
main/module/types/legacy 的完整值冻结在 manifest。UMD 全局名与默认导出一致。
保留 `/legacy`、旧文件路径、同步注册和未加载 DOM 时的导入边界；实际各格式消费由 02/04/06 验证。
当前版本保持 1.1.0，REL-09 按用户要求准备 2.0.0，未获 npm 发布授权。

## 文档、样本与差异归属

README 仅说明插件名、Demo 和 MIT；其 `example=audio-track` 与真实
`docs/assets/example/audio.track.js` 不一致。common.js 直接拼接名称，无连字符转换。
实际示例使用本地 sprite-fight.mp4 + sprite-fight.aac，二者存在；没有演示 update、
偏移边界或销毁。06 应修链接并以正式 8082 demo 验证，不能拿静态文件存在作为播放通过。

| 风险 | 当前证据等级 | 负责任务 |
| --- | --- | --- |
| AUDIO-LIFE-01：销毁后 update 可写 src，监听/异步播放归属缺少终止守卫 | 源码事实，未作浏览器泄漏结论 | 02/03/05 |
| AUDIO-SYNC-01：偏移边界及切源/缓冲恢复缺少媒体时序证据 | 待取证，不预设所有当前行为是缺陷 | 02/03/05 |
| AUDIO-TYPE-01：update 部分配置和编辑器声明不一致 | 源码/声明事实 | 04 |
| AUDIO-DEMO-01：README 示例名不匹配、维护说明缺失 | 源码/文件事实 | 06 |

## 重跑

`node refactor/scripts/audio-contract.mjs`：重验固定归档、六文件、manifest、历史 Git 内容与工厂。
首次仅从固定 npm URL 下载至忽略缓存；不安装、不执行归档脚本、不覆盖基线。
`node --test refactor/scripts/audio-contract.test.mjs`：包含该验证及规范化工具的有意行为变化检查。
本步不改生产代码/声明/构建产物；所有媒体、类型和设备验收仍是后续任务。
