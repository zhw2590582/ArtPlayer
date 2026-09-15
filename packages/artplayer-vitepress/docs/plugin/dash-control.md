# DASH 控制

[English](../en/plugin/dash-control.md)

为 dash.js 播放器添加画质和音轨菜单。你负责创建 SDK、绑定 video 并赋给 `art.dash`；插件控制这个实例，只清理自己创建的菜单和监听器。

本页描述当前重构分支。这里的 SDK 适配、自动刷新和生命周期修复尚未发布；未固定版本的 npm/CDN 安装仍使用已发布版本。

## 安装

```sh
yarn add artplayer dashjs artplayer-plugin-dash-control
```

```js
import Artplayer from 'artplayer';
import dashjs from 'dashjs';
import artplayerPluginDashControl from 'artplayer-plugin-dash-control';
```

使用 script 标签时，在初始化前加载 ArtPlayer、dash.js 和 `dist/artplayer-plugin-dash-control.js`。插件全局名称为 `artplayerPluginDashControl`。应用应固定依赖版本，并使用浏览器可访问的 MPD 和媒体片段。

## 完整示例

下面与[在线 DASH 示例](https://artplayer.org/?libs=https://cdnjs.cloudflare.com/ajax/libs/dashjs/5.2.1/modern/umd/dash.all.min.js%0A./uncompiled/artplayer-plugin-dash-control/index.js&example=dash.control)使用相同代码。接入应用时替换站点容器和视频地址。

<div className="run-code" data-libs="https://cdnjs.cloudflare.com/ajax/libs/dashjs/5.2.1/modern/umd/dash.all.min.js
./uncompiled/artplayer-plugin-dash-control/index.js"></div>

```js
// npm i dashjs
// npm i artplayer-plugin-dash-control

// import dashjs from 'dashjs';
// import artplayerPluginDashControl from 'artplayer-plugin-dash-control';

const useDash = dashjs.supportsMediaSource()
let dash

function destroyDash() {
  const previous = dash
  dash = undefined
  if (previous)
    previous.destroy()
}

const art = new Artplayer({
  container: '.artplayer-app',
  url: 'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd',
  setting: true,
  plugins: useDash
    ? [
        artplayerPluginDashControl({
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
            getName: track => track.lang?.toUpperCase() || String(track.id ?? 'Audio'),
            // I18n
            title: 'Audio',
            auto: 'Auto',
          },
        }),
      ]
    : [],
  customType: {
    mpd: function playMpd(video, url, art) {
      destroyDash()
      if (useDash) {
        dash = dashjs.MediaPlayer().create()
        art.dash = dash
        dash.initialize(video, url, art.option.autoplay)
      }
      else {
        art.notice.show = 'Unsupported playback format: mpd'
      }
    },
  },
})

art.on('destroy', destroyDash)
```

示例在创建播放器时固定 SDK 能力分支。若 dash.js 无法使用 MediaSource，则保留原来的格式不支持提示，不创建 SDK 或安装依赖它的控制插件。这个示例没有提供原生 DASH 回退。

## 配置

`artplayerPluginDashControl(option?)` 同步返回插件工厂。`quality` 和 `audio` 都支持：

| 字段 | 含义与默认行为 |
| --- | --- |
| `control` | 显示底部控制器；省略时不显示。 |
| `setting` | 显示设置项；省略时不显示，还需播放器配置 `setting: true`。 |
| `title` | 菜单标题，默认 `Quality` 或 `Audio`。 |
| `auto` | 回退文字，默认 `Auto`；画质还用于自动选项，不会新增一个虚拟音轨。 |
| `getName(item)` | 根据原始 SDK 档位或轨道对象返回字符串。只有一个参数，不提供索引或播放器 this。 |

默认画质标签为 `level.height + 'p'`，音轨标签取 `track.lang` 或 `track.id`。这些元数据可能缺失或为 null，自定义回调应像完整示例一样返回字符串回退。空标题或空 Auto 文字会使用默认值。

相同文字标签会合并成一个选项。若同高度的多个档位需要分别显示，可以在标签中加入码率或其他元数据。选中重复项时，会保留实际选中的 SDK 标识或轨道对象。轨道列表变空时移除对应菜单。

## 画质和音轨选择

手动选画质先关闭视频的自动码率选择，再调用 SDK 选择档位；Auto 只启用视频自动选择，不覆盖其他 ABR 设置。同步选择菜单不代表缓冲或解码已经完成。

插件根据 SDK 实际提供的方法选择适配方式：

| SDK 接口 | 画质列表与选择 |
| --- | --- |
| dash.js 4 风格 | `getBitrateInfoListFor('video')`、`getQualityFor('video')`、`setQualityFor('video', qualityIndex)` |
| dash.js 5 风格 | `getRepresentationsByType('video')`、`getCurrentRepresentationForType('video')`、`setRepresentationForTypeById('video', id)` |

representation 接口使用 ID 选择，数字零也是合法 ID；不能用过滤后数组的索引代替。无需给插件额外设置 SDK 版本开关。

选择音轨时，把原始 SDK 轨道对象交给 `setCurrentTrack()`。当前项优先通过对象身份匹配，再通过可用 id/index/lang 字段的唯一组合匹配，不会任意选中有歧义的项。音轨列表没有额外 Auto 行。

## 外部修改后的刷新

播放器 ready/restart 和 SDK 的画质、音轨、流事件会刷新菜单。SDK 事件刷新在当前同步选择结束后合并执行；未变化的播放时间事件不重绘菜单，但可以发现外部 Auto 设置变化。

暂停时直接修改 SDK 配置、且没有后续 SDK 事件，可以手动刷新：

```js
art.plugins.artplayerPluginDashControl.update();
```

`update()` 同步返回 `undefined`，要求 `art.dash` 已绑定到播放器的 video，否则可能抛错。仅赋值一个新的 `art.dash` 不会立即订阅它；绑定后调用 `update()`，或走正常 ready/restart 流程。

自动刷新会保留已打开、由插件管理的画质或音轨设置子菜单；显式 `update()` 保留原有重建行为。插件使用 `dash-quality` 和 `dash-audio` 菜单名，其他菜单请避开这些名称。

异步 SDK getter 或格式回调失败时，插件会输出警告、停止该观察并清除菜单；修正回调或 SDK 状态后调用 `update()` 恢复。显式更新和同步选择的错误仍按原语义抛出。

## SDK 所有权与换源

换源使用播放器已有的 `switchUrl()` 或 `switchQuality()`，并处理返回的 Promise。完整示例先销毁被替换的 SDK，在初始化前赋值新实例，每个播放器只注册一个最终清理监听器，不在每次加载时累积新的 destroy 回调，也不在最后重复销毁旧实例。

控制插件不会调用 `dash.destroy()`、更换清单地址或移除其他使用者的监听器；替换实例或销毁播放器后，旧菜单回调失效。应用仍负责 DRM、SDK 错误、自动播放策略，以及自身集成所需的异步 SDK 关闭策略。

## TypeScript

默认回调类型包含画质高度/宽度/ID/码率，以及允许为空的音轨 id/index/lang。可以通过泛型声明更具体的元数据；下面只声明实际使用的字段，无需导入 SDK 声明：

```ts
import dashControl from 'artplayer-plugin-dash-control';

interface Level { height: number; bitrateInKbit?: number }
interface Track { id?: string | number | null; lang?: string | null }

const plugin = dashControl<Level, Track>({
    quality: {
        control: true,
        getName: level => level.height + 'p',
    },
    audio: {
        setting: true,
        getName: track => track.lang?.toUpperCase() || String(track.id ?? 'Audio'),
    },
});
```

根入口导出 `Option`、`Config`、`QualityLevel`、`AudioTrack` 和 `Result`，原根入口与 legacy 路径继续保留。使用实际 SDK 声明时，dash.js 4.5.2 的画质类型为 `BitrateInfo`，5.2.1 使用 `Representation`；其编译器与模块解析要求不同，应验证实际 SDK/TypeScript 组合。在应用的集成类型中描述外部附加的 `art.dash`。

## 验证范围

重构使用固定 dash.js 4.5.2 / 5.2.1、本地自适应媒体和新旧核心组合验证；这两个版本是验证点，不是新定义的完整支持范围。插件对4.5.2暂停拖动后空缓冲指标陈旧的问题有定向恢复，保留调用方 SDK 设置和媒体时间。Windows Playwright WebKit 缺少相关 MSE 路径，不能代表 Safari 或真机播放已验收。采用未发布重构前，应验证自己的 MPD、DRM 和目标设备。
