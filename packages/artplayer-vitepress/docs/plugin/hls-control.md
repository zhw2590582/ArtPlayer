# HLS 控制

[English](../en/plugin/hls-control.md)

为 Hls.js 播放器添加画质与音轨菜单。插件控制你放在 `art.hls` 上的 Hls.js 实例，不负责下载、创建或销毁 SDK。

本页描述当前重构分支。这里说明的自动刷新与生命周期修复尚未发布；未固定版本的 npm/CDN 安装仍使用已发布版本。

## 安装

```sh
yarn add artplayer hls.js artplayer-plugin-hls-control
```

```js
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';
```

通过 script 标签使用时，先加载 ArtPlayer、Hls.js 和插件的 `dist/artplayer-plugin-hls-control.js`。插件全局名称为 `artplayerPluginHlsControl`。应用中应固定依赖版本，并使用允许浏览器访问的视频地址。

## 完整示例

下面与[在线 HLS 示例](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js%0A./uncompiled/artplayer-plugin-hls-control/index.js&example=hls.control)使用同一份代码和站点容器。接入自己的应用时替换容器与视频地址。

<div className="run-code" data-libs="https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.17/hls.min.js
./uncompiled/artplayer-plugin-hls-control/index.js">▶ Run Code</div>

```js
// npm i hls.js
// npm i artplayer-plugin-hls-control

// import Hls from 'hls.js';
// import artplayerPluginHlsControl from 'artplayer-plugin-hls-control';

const useHls = Hls.isSupported()
let hls

function destroyHls() {
  const previous = hls
  hls = undefined
  if (previous)
    previous.destroy()
}

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://playertest.longtailvideo.com/adaptive/elephants_dream_v4/index.m3u8',
  setting: true,
  plugins: useHls
    ? [
        artplayerPluginHlsControl({
          quality: {
            // Show quality choices in the controls
            control: true,
            // Show quality choices in settings
            setting: true,
            // Get the quality name from level
            getName: level => `${level.height}P`,
            // I18n
            title: 'Quality',
            auto: 'Auto',
          },
          audio: {
            // Show audios in control
            control: true,
            // Show audios in setting
            setting: true,
            // Get the audio name from track
            getName: track => track.name || track.lang || 'Audio',
            // I18n
            title: 'Audio',
            auto: 'Auto',
          },
        }),
      ]
    : [],
  customType: {
    m3u8: function playM3u8(video, url, art) {
      destroyHls()
      if (useHls) {
        hls = new Hls()
        art.hls = hls
        hls.loadSource(url)
        hls.attachMedia(video)
      }
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
      }
      else {
        art.notice.show = 'Unsupported playback format: m3u8'
      }
    },
  },
})

art.on('destroy', destroyHls)
```

仅在支持 Hls.js 时安装控制插件。若改用浏览器原生 HLS，示例直接设置 `video.src`，不安装必须依赖 `art.hls` 的插件；该插件不会为原生播放提供画质或音轨选择。单个播放器实例保持固定的 `useHls`，更换播放集成方式时重新创建播放器。

## 配置

`artplayerPluginHlsControl(option?)` 同步返回插件工厂。`quality` 与 `audio` 都可以使用以下字段：

| 字段 | 含义与默认行为 |
| --- | --- |
| `control` | 显示底部控制器；省略时不显示。 |
| `setting` | 显示设置项；省略时不显示，同时需要播放器的 `setting: true`。 |
| `title` | 菜单标题，画质默认 `Quality`，音轨默认 `Audio`。 |
| `auto` | 当前项未知时的文字，默认 `Auto`；画质还用于自动选项。音轨不会因此新增一个虚拟 Auto 轨道。 |
| `getName(item, index?)` | 根据原始 SDK 档位或轨道对象返回字符串。当前标签调用没有 `index`，列表调用带有索引。 |

省略画质回调时，标签取 `level.name` 或 `level.height + 'P'`；音轨依次取 `track.name`、`track.lang`、`track.language`。空标题和空 Auto 文字会使用默认值。媒体没有相关字段时，自定义回调应提供字符串回退。

回调按普通函数调用，`this` 不会绑定到播放器，不能把可选索引视为必传字段。相同标签会合并成一个选项；如果想区分同高度的多个档位，可在标签中加入码率。轨道列表变空时会移除对应菜单。

选择画质会写入 `hls.currentLevel`，Auto 对应 `-1`；当 `autoLevelEnabled` 为 true 时，当前标签反映自动模式。选择音轨会把 SDK 轨道 ID 写入 `hls.audioTrack`。菜单选择是同步操作，不代表新流已经完成缓冲或解码。

## 外部修改后的刷新

播放器 `ready`、`restart` 会刷新菜单；SDK 提供事件接口时，清单、档位、音轨与销毁事件也会刷新或清除菜单。选中项来自当前 SDK 状态。

把替换后的实例绑定到同一个 video 并赋给 `art.hls` 后，如需立即刷新，可以调用已有同步方法：

```js
art.plugins.artplayerPluginHlsControl.update();
```

`update()` 返回 `undefined`，不是 Promise；在没有已绑定 Hls.js 实例时调用可能抛错。没有对应事件接口的自定义适配器需要在状态变化后手动刷新。菜单名 `hls-quality` 和 `hls-audio` 由插件使用，其他菜单请使用不同名称。

## SDK 所有权与换源

换源继续使用播放器已有的 `switchUrl()` 或 `switchQuality()`，并处理返回的 Promise。示例在创建新 SDK 前销毁旧实例，再更新 `art.hls`，每个播放器只保留一个最终清理监听器，每个 SDK 实例只销毁一次。不要在每次加载时累积新的播放器 `destroy` 监听器，同时又自行销毁被替换的实例。

控制插件只释放自己的 SDK 订阅；替换或销毁播放器后，旧菜单回调不再修改 SDK。插件不会销毁 SDK、移除其他使用者的监听器或实现 Hls.js 错误恢复；应用仍负责处理 SDK 致命错误和播放策略。

## TypeScript

默认回调类型包含画质高度/名称和音轨 ID/名称/语言字段。可以通过泛型使用应用所需的 SDK 元数据类型；下面的示例只声明实际使用的字段，无需导入 Hls.js 声明：

```ts
import hlsControl from 'artplayer-plugin-hls-control';

interface Level { height: number; bitrate: number }
interface Track { id: number; name: string; lang?: string }

const plugin = hlsControl<Level, Track>({
    quality: {
        control: true,
        getName: level => level.height + 'p / ' + level.bitrate,
    },
    audio: {
        setting: true,
        getName: track => track.name || track.lang || 'Audio',
    },
});
```

根入口导出 `Option`、`Config`、`QualityLevel`、`AudioTrack` 和 `Result` 类型，原根入口及 legacy 路径继续保留。声明不会假定每个 ArtPlayer 实例都有 Hls.js；请在应用的集成类型中描述 `art.hls`。

注册结果只有固定的 `name: 'artplayerPluginHlsControl'` 和 `update()`。工厂普通调用允许省略配置；最后一个声明重载保留必填参数，因此 `Parameters<typeof hlsControl>[0]` 仍为 `Option`，不包含 `undefined`。本包没有 `/runtime` 子路径，也没有工厂 `.default` 自引用。

## 验证范围

重构使用本地媒体和真实 worker 验证 Hls.js 1.5.17 / 1.7.2；这两个版本是验证点，不是新定义的支持范围。Firefox 的分组播放崩溃和另一项切组停滞仍在排查。Windows Playwright WebKit 缺少测试所需的 MSE 路径，不能代表 Safari/iOS 原生 HLS 已验收。采用尚未发布的重构前，应验证实际媒体与目标设备。
