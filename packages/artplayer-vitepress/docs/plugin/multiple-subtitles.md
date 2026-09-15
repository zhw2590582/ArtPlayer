# 多重字幕

[English](../en/plugin/multiple-subtitles.md)

下载多个字幕文件，保留各自 cue 的时刻，将选中轨道合并到播放器字幕中。可以同时显示不同语言，并按名称选择或调整轨道顺序。本页描述当前未发布的重构分支；线上示例和未固定版本的包不等于当前候选。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-multiple-subtitles
```

```js
import Artplayer from 'artplayer';
import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-multiple-subtitles.js`，全局名为 `artplayerPluginMultipleSubtitles`。下面保留[在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-multiple-subtitles/index.js&example=multiple.subtitles)的原始选择菜单和样式代码；菜单由应用配置，插件不自动创建菜单。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-multiple-subtitles/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-multiple-subtitles
// import artplayerPluginMultipleSubtitles from 'artplayer-plugin-multiple-subtitles';

var art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  setting: true,
  plugins: [
    artplayerPluginMultipleSubtitles({
      subtitles: [
        {
          name: 'chinese',
          url: '/assets/sample/subtitle.cn.srt',
        },
        {
          name: 'japanese',
          url: '/assets/sample/subtitle.jp.srt',
        },
      ],
    }),
  ],
  settings: [
    {
      width: 200,
      html: 'Subtitle',
      tooltip: 'Double',
      icon: '<img width="22" height="22" src="/assets/img/subtitle.svg">',
      selector: [
        {
          html: 'Display',
          tooltip: 'Show',
          switch: true,
          onSwitch(item) {
            item.tooltip = item.switch ? 'Hide' : 'Show'
            // 显示/隐藏字幕
            // Show/hide subtitles
            art.subtitle.show = !item.switch
            return !item.switch
          },
        },
        {
          html: 'Reverse',
          tooltip: 'Off',
          switch: false,
          onSwitch(item) {
            item.tooltip = item.switch ? 'Off' : 'On'
            // 修改字幕顺序
            // Change the order of subtitles
            if (item.switch) {
              art.plugins.multipleSubtitles.tracks(['chinese', 'japanese'])
            }
            else {
              art.plugins.multipleSubtitles.tracks(['japanese', 'chinese'])
            }
            return !item.switch
          },
        },
        {
          default: true,
          html: 'Double',
          name: 'double',
        },
        {
          html: 'Chinese',
          name: 'chinese',
        },
        {
          html: 'Japanese',
          name: 'japanese',
        },
      ],
      onSelect(item) {
        if (item.name === 'double') {
          // 重置字幕
          // Reset subtitles
          art.plugins.multipleSubtitles.reset()
        }
        else {
          // 显示单个字幕
          // Show single subtitle
          art.plugins.multipleSubtitles.tracks([item.name])
        }
        return item.html
      },
    },
  ],
})

// 自定义你自己的样式，请勿复制以下代码
// Customize your own style, please do not copy the following code

const style = `
.art-subtitle-chinese {
	color: red;
	font-size: 18px;
}

.art-subtitle-japanese {
	color: yellow;
	font-size: 12px;
}
`

const $style = document.getElementById('artplayer-subtitle-style')
if ($style) {
  $style.textContent = style
}
else {
  const $style = document.createElement('style')
  $style.id = 'artplayer-subtitle-style'
  $style.textContent = style
  document.head.appendChild($style)
}
```

## 字幕配置

工厂需要配置对象，`subtitles` 是轨道数组。运行时 `{}` 等同空数组；旧根类型仍要求显式提供 `subtitles`。每个 `TrackOption` 的字段如下：

| 字段 | 类型 | 默认或行为 |
| --- | --- | --- |
| `url` | `string` | 字幕地址，使用浏览器 fetch；历史类型虽可选，实际用例应提供有效地址 |
| `name` | `string` | 轨道选择和 CSS 名称；建议提供唯一、简单的名称，例如 `chinese` |
| `type` | `'vtt' \| 'srt' \| 'ass'` | 未指定时读取 URL 扩展名；显式值优先 |
| `encoding` | `string` | 默认 `'utf-8'`，传给 TextDecoder |
| `onParser` | `(...args: object[]) => object` | 历史声明保留，实际不会调用 |

所有文件并行下载，再解码并合并。跨域文件需要服务端允许 fetch。SRT、ASS 使用核心转换工具生成 VTT；ASS 不保留完整 ASS 排版和动画，需要完整 ASS 渲染时使用 JASSUB。未知类型转为空内容，解析器尽力处理文本，格式诊断不一定拒绝全部可用 cue。

HTTP 非成功响应、解码或转换抛出的错误会使注册拒绝，并释放同批请求。元数据按下载完成后的原配置读取，不是深拷贝；避免在安装过程中修改轨道对象或数组。

## 注册与选择

实际注册异步完成，返回 `{ name: 'multipleSubtitles', tracks, reset }`，结果存放在 `art.plugins.multipleSubtitles`，不是全局工厂名。需要直接使用返回结果时先 await 注册；结果就绪不代表播放器已经完成字幕加载。

| 调用 | 结果 |
| --- | --- |
| `tracks(['chinese', 'japanese'])` | 按调用方名称顺序选择轨道 |
| `tracks(['japanese'])` | 仅显示选中的轨道 |
| `tracks()` 或 `tracks([])` | 清空选择 |
| `reset()` | 恢复所有最初下载的轨道及其原顺序 |

tracks 和 reset 都同步返回 `undefined`。未知名称保留历史同步 TypeError；重复名称按每次查找的第一条轨道处理，不会自动去重。请使用已经配置的唯一名称。轨道按选择顺序合并，但并不改写不同语言 cue 的时间，不能用轨道顺序对齐本来错位的字幕。

每次选择都会创建新的 VTT Blob URL 并初始化播放器字幕，释放上一份插件拥有的 URL。异步字幕安装失败会警告并清理失败资源，void 方法不能用于 await 字幕就绪。切换视频不会重新下载轨道，reset 也不是重新请求服务器；插件没有公开的 update、reload 或独立 destroy。

## 样式与资源归属

字幕内容使用 `.art-subtitle-<name>` 包装，例如示例的 `.art-subtitle-chinese` 和 `.art-subtitle-japanese`。名称会进入 HTML 类名，请使用应用定义的简单标识。选择时插件设置 `art.option.subtitle.escape = false` 并接管该次字幕 URL、type 和 onVttLoad；与其它同时管理字幕的插件组合时，需要明确由谁最后写入。

普通 cue 文本、实体和合法标记分别处理；内联时间戳保留 cue 数据，但显示仍为整段字幕，不新增卡拉 OK 逐字高亮。较旧核心的多 active cue 显示有兼容处理；依赖自定义字幕 DOM 的监听器应在插件注册后安装，以免被后续字幕视图更新覆盖。

播放器销毁会取消请求、移除插件监听器、释放生成的 URL。下载中的注册会结算为不再工作的结果，保留的 tracks/reset 方法变成空操作。销毁不会恢复共享的 escape 配置，以免覆盖其他消费者之后的设置。实际语言字体、旧核心组合和 Safari/手机显示仍需相应环境验收。

## TypeScript 兼容入口

根入口和 `/legacy` 保留最新已发布 1.2.0 的工厂类型：必填 `{ subtitles: TrackOption[] }`，同步 `LegacyResult` 仅含 name，以兼容历史参数提取与替换函数。实际 Promise 和选择方法使用同一实现的 `/runtime`：

```ts
import type Artplayer from 'artplayer';
import multipleSubtitles from 'artplayer-plugin-multiple-subtitles/runtime';
import type { Result, RuntimeOption } from 'artplayer-plugin-multiple-subtitles/runtime';

const options: RuntimeOption = {
  subtitles: [{ url: '/subtitles/en.vtt', name: 'en' }],
};

async function selectSubtitles(art: Artplayer): Promise<Result> {
  const result = await multipleSubtitles(options)(art);
  result.tracks(['en']);
  result.reset();
  return result;
}
```

根命名类型为 `TrackOption`、`Option`、`RuntimeOption`、`LegacyResult`、`Result`、`Factory`、`RuntimeFactory`；runtime 导出 TrackOption、RuntimeOption、Result、RuntimeFactory。RuntimeFactory 还描述可写 `.default` 自引用；旧 Factory 不要求该属性。

1.0/1.1 的 export-assignment 声明与 1.2 默认模块形状冲突，根按已批准规则保留 1.2。NodeNext ESM 根类型的工厂在 `root.default`，准确的默认调用使用 runtime。经典 CommonJS 无 interop 时可使用 runtime 的 `import = require`；经典默认导入需 `esModuleInterop`。历史 JavaScript `.default(...)` 调用继续支持，不将旧声明错误宣传为原来不存在的运行时调用方式。
