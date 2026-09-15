# 独立音轨

[English](../en/plugin/audio-track.md)

为视频同步播放一个单独的音频文件。插件创建一个 `HTMLAudioElement`，跟随主视频的播放、暂停、进度、音量和播放速率，不需要额外 SDK，也不提供音轨选择菜单。

本页描述当前重构分支。生命周期修复和 `/runtime` 精确类型尚未发布；未固定版本的 npm/CDN 安装不能当作本分支代码。

## 安装

```sh
yarn add artplayer artplayer-plugin-audio-track
```

```js
import Artplayer from 'artplayer';
import artplayerPluginAudioTrack from 'artplayer-plugin-audio-track';
```

通过 script 使用时，先加载 ArtPlayer，再加载插件的 `dist/artplayer-plugin-audio-track.js`，全局名称为 `artplayerPluginAudioTrack`。应用应固定依赖版本，并提供浏览器可解码和访问的音频地址。

## 完整示例

下面与[在线音轨示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-audio-track/index.js&example=audio.track)使用同一份代码。站点提供示例媒体和 `.artplayer-app` 容器；接入自己的应用时替换这些地址和容器。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-audio-track/index.js"></div>

```js
// npm i artplayer-plugin-audio-track
// import artplayerPluginAudioTrack from 'artplayer-plugin-audio-track';

var art = new Artplayer({
    container: '.artplayer-app',
    url: '/assets/sample/sprite-fight.mp4',
    plugins: [
        artplayerPluginAudioTrack({
            url: '/assets/sample/sprite-fight.aac',
            offset: 0, 
            sync: 0.3, 
        }),
    ],
});
```

## 配置与同步

`artplayerPluginAudioTrack(option)` 返回插件工厂，`option` 必须提供。

| 字段 | 类型与默认值 | 行为 |
| --- | --- | --- |
| `url` | `string`，必填 | 独立音频文件地址。构造时的空字符串不加载音源。 |
| `offset` | `number`，默认 `0` | 音频目标时间为视频时间加上此值，单位秒。正数读取音频中更靠后的内容。 |
| `sync` | `number`，默认 `0.3` | 音频与目标时间的差值绝对值严格大于此值时，才调整音频时间。单位秒。 |

例如视频在10秒、offset为0.25时，目标音频时间是10.25秒。这是纠正媒体时间的阈值同步，不是逐采样的专业音频时钟。使用有限、合理的偏移和非负阈值；负目标时间或超过音频时长的目标依赖浏览器的媒体边界行为，插件没有另加延迟启动、循环或补静音功能。

播放、seek完成和恢复播放时会同步；正常播放期间也根据 timeupdate 校正漂移。等待缓冲、切源清空、原生暂停、seek开始和结束播放会暂停独立音频；主视频继续播放并达到可恢复状态后再恢复。视频暂停时不会仅因canplay事件自行播放音频。

## 返回值和更新

安装后通过 `art.plugins.artplayerPluginAudioTrack` 取得结果：

| 字段 | 行为 |
| --- | --- |
| `name` | 固定为 `artplayerPluginAudioTrack`。 |
| `audio` | 实际的 `HTMLAudioElement`；更新音源时保持同一个元素。 |
| `update(option)` | 同步更新部分字段，返回 `undefined`，不是加载完成的Promise。 |

```js
const track = art.plugins.artplayerPluginAudioTrack;
track.update({ offset: 0.25, sync: 0.1 });
track.update({ url: '/audio/another-language.m4a' });
```

offset/sync更新不会立即强制seek，下一次同步事件才使用新值。只有非空且不同的url会替换音源；相同url不会重新加载，空url也不是停止或清空命令。若主视频正在播放，替换音源会尝试播放；音频的实际加载、解码和错误可从暴露的元素监听。

调用 `art.switchUrl()` 只更换主视频，不会自动选择另一份音频；应用需要同时管理视频与音轨的对应关系，并用 `track.update()` 指定新音源。需要等待媒体可用时监听原生媒体事件，不要把 `await track.update(...)` 当作等待加载。

## 音量、播放失败与销毁

插件不会自动去掉主视频的原声。如果希望独立音轨是唯一声音，使用没有原声音轨的视频源。播放器的音量、静音和倍速会同步到独立音频；设置 `art.muted = true` 会一起静音，不能用它只关闭主视频声音。

独立音频的播放仍受浏览器策略约束。活动实例的 `audio.play()` 拒绝会通过 `console.warn` 报告，不会变成 `update()` 的Promise拒绝。主视频播放成功也不等于独立音频已经成功发声；应用可监听 `audio` 的 playing/error 等原生事件。

销毁ArtPlayer会移除插件订阅、暂停音频、移除src并释放媒体加载。保留的结果对象仍指向同一个audio，销毁后的update不再重新加载或播放。应用自己添加到audio上的监听器仍由应用负责移除；无需另外调用一个不存在的插件destroy方法。

## TypeScript

根入口与 `/legacy` 保留旧 `Result.update(Option)` 声明，包含必填url，避免改变旧代码的参数提取与函数赋值。运行时一直支持部分字段更新；需要准确的部分更新类型时，选择同一实现的 `/runtime`：

```ts
import Artplayer from 'artplayer';
import audioTrack from 'artplayer-plugin-audio-track/runtime';

const installTrack = audioTrack({ url: '/audio/dialogue.m4a' });
const art = new Artplayer({
    container: '.artplayer-app',
    url: '/video/silent.mp4',
    plugins: [(player) => {
        const track = installTrack(player);
        track.update({ offset: 0.25 });
        return track;
    }],
});
```

命名类型包括 `Option`、`UpdateOption`、旧 `Result`、`RuntimeResult` 与 `RuntimeFactory`。在线编辑器的全局默认类型也保留旧推导；选择精确更新类型时，可显式使用 `artplayerPluginAudioTrack as artplayerPluginAudioTrack.RuntimeFactory`。这不会创建第二份插件实现。

真实桌面测试覆盖音频/视频播放、暂停、seek、更新和销毁；它们不证明所有移动设备、代理播放器、音频格式或长时间同步组合都通过。完整支持范围仍需结合对应浏览器的解码能力与项目验收记录。
