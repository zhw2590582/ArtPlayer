# 视频章节

[English](../en/plugin/chapter.md)

将进度条划分为章节，悬停时显示标题，并保留播放器原有的进度拖动和缩略图。插件不解析媒体文件中的章节元数据；章节时间由应用提供。

本页描述当前重构分支。候选版本和修复尚未发布，在线示例与未固定版本的 npm/CDN 包不一定包含本页所述修复。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-chapter
```

```js
import Artplayer from 'artplayer';
import artplayerPluginChapter from 'artplayer-plugin-chapter';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-chapter.js`；插件全局名为 `artplayerPluginChapter`。下面保留[在线章节示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-chapter/index.js&example=chapter)的原始代码。站点提供示例容器、视频和缩略图，接入应用时替换为自己的资源。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-chapter/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-chapter
// import artplayerPluginChapter from 'artplayer-plugin-chapter';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  autoSize: true,
  fullscreen: true,
  fullscreenWeb: true,
  miniProgressBar: true,
  autoOrientation: true,
  thumbnails: {
    url: '/assets/sample/thumbnails.png',
    number: 60,
    column: 10,
  },
  plugins: [
    artplayerPluginChapter({
      chapters: [
        { start: 0, end: 18, title: 'One more chance' },
        { start: 18, end: 36, title: '谁でもいいはずなのに' },
        { start: 36, end: 54, title: '夏の想い出がまわる' },
        { start: 54, end: 72, title: 'こんなとこにあるはずもないのに' },
        { start: 72, end: Infinity, title: '终わり' },
      ],
    }),
  ],
})
```

## chapters

工厂参数可以省略，也可以传入 `{ chapters }`。每个章节包含：

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `start` | `number` | 开始时间，单位秒，必须是非负有限数 |
| `end` | `number` | 结束时间，单位秒；允许 `Infinity` 表示当前视频结束 |
| `title` | `string` | 悬停标题；空字符串保留没有标题的区间 |

区间必须满足 `start < end <= 视频时长`，相邻章节不能重叠。插件会按开始时间排序，补齐头尾及章节之间的空白区间。它会**直接修改传入的数组**，包括排序、插入空标题章节和把 `Infinity` 替换为当前时长；需要保留原始配置时，每次传入新的数组及章节对象。

只有媒体时长为正的有限数时才生成章节。缺省、空或非数组的章节输入会清空视图；TypeScript 参数仍只接受声明的数组类型。字段类型错误会抛出 `TypeError`，非法时间或重叠区间会抛出 `Error`。标题按文本显示，不解析 HTML；显示时去除首尾空白，原对象的 `title` 不变。

## update

插件返回结果的 `name` 固定为 `artplayerPluginChapter`。`update(option)` 同步替换章节并返回 `undefined`，参数对象必填；`update({})` 清空章节：

```js
art.plugins.artplayerPluginChapter.update({
    chapters: [{ start: 0, end: Infinity, title: 'Introduction' }],
});

// Clear all chapter segments and the hover title.
art.plugins.artplayerPluginChapter.update({});
```

更新先清除旧视图再校验新数据；无效更新抛错后不会保留旧章节。成功更新会同步触发原有 `setBar('loaded', ...)`，进度交互继续使用核心控制器。

初始配置只在首次 `video:loadedmetadata` 时应用。切换媒体不会自动计算新章节；在新媒体加载后，调用 `update` 并传入适合新时长的全新数据。不要复用已经把 `Infinity` 改成旧时长的对象。

## 生命周期与样式

销毁播放器会移除插件自己的监听器、章节节点、标题及 `artplayer-plugin-chapter` 类，包括 `art.destroy(false)` 保留播放器 HTML 的情况。销毁后保留的结果对象调用 `update` 不会重建视图；没有单独的插件 `destroy()` 方法。

原有 `.art-chapter`、`.art-chapter-title` 和章节 `data-start/end/duration/title` 钩子保留。长标题在进度条宽度内截断，完整文字仍保存在文本和数据属性中。样式表由页面共享，销毁一个实例不会移除它。

## TypeScript

根入口及 `/legacy` 使用同一公开 API，可以导入 `Chapters`、`Option` 和 `Result` 类型；本包不需要另外切换到 `/runtime`：

```ts
import artplayerPluginChapter from 'artplayer-plugin-chapter';
import type { Chapters } from 'artplayer-plugin-chapter';

const chapters: Chapters = [{ start: 0, end: Infinity, title: 'Introduction' }];
const installChapters = artplayerPluginChapter({ chapters });
```

章节、清晰度、缩略图和全屏的桌面组合有独立测试；这不代表全部移动设备已通过。当前 Windows WebKit 的清晰度切换测试仍存在浏览器读取停顿，不能据此承诺所有平台均无时序问题。
