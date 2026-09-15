# 本地视频缩略图工具

[English](../en/tool/thumbnail.md)

从用户选择的本地视频生成 PNG 缩略图拼图，可下载或交给播放器的 thumbnails 配置使用。这是独立构造器，不是 Auto Thumbnail 插件。本页描述未发布分支及已经批准的两种兼容模式。

## 安装和示例

```sh
yarn add artplayer-tool-thumbnail
```

ESM 使用 `import ArtplayerToolThumbnail from 'artplayer-tool-thumbnail'`。script 使用 `dist/artplayer-tool-thumbnail.js`，全局为 `ArtplayerToolThumbnail`。工具自身不依赖播放器；下面的[原始示例](https://artplayer.org/?libs=./uncompiled/artplayer-tool-thumbnail/index.js&example=tool.thumbnail)使用本站 DOM 和 ArtPlayer 展示结果：

<div className="run-code" data-libs="./uncompiled/artplayer-tool-thumbnail/index.js">▶ Run Code</div>

```js
if (window.lastThumbnail) {
    window.lastThumbnail.destroy();
}

var $popups = document.querySelector('.popups');
var $popinner = document.querySelector('.popinner');
var $artplayer = document.querySelector('.artplayer-app');

$artplayer.innerHTML = 'Drop video file here or click to upload.';
var thumbnail = new ArtplayerToolThumbnail({
    fileInput: $artplayer,
    number: 60, // 数量
    width: 160, // 宽度
    column: 10, // 列数
    begin: 0, // 开始
    end: NaN, // 结束
});

window.lastThumbnail = thumbnail;

thumbnail.on('file', function (file) {
    console.log('Read video successfully: ' + file.name);
});

thumbnail.on('video', function (video) {
    console.log('Video size: ' + video.videoWidth + ' x ' + video.videoHeight);
    console.log('Video duration: ' + video.duration + 's');
    thumbnail.start();
});

thumbnail.on('canvas', function (canvas) {
    console.log('Build canvas successfully');
    console.log('Canvas size: ' + canvas.width + ' x ' + canvas.height);
    console.log('Preview density: ' + thumbnail.density + ' p/s');
});

thumbnail.on('update', function (url, percentage) {
    console.log('Processing: ' + Math.floor(percentage.toFixed(2) * 100) + '%');
    $popups.style.display = 'flex';
    $popinner.style.backgroundImage = 'url(' + url + ')';
});

thumbnail.on('download', function (name) {
    console.log('Start download preview: ' + name);
});

thumbnail.on('done', function () {
    $popups.style.display = 'none';
    thumbnail.download();
    console.log('Build preview image complete');

    [...Artplayer.instances].forEach(function (art) {
        art.destroy(true);
    });

    new Artplayer({
        container: $artplayer,
        url: thumbnail.videoUrl,
        autoSize: true,
        poster: thumbnail.thumbnailUrl,
        thumbnails: {
            url: thumbnail.thumbnailUrl,
            number: thumbnail.option.number,
            column: thumbnail.option.column,
        },
    });

    console.log('Build player complete');
});
```

选择文件只加载视频，不自动开始提取；示例在 video 事件里调用 start。应用代码应处理 start 的同步异常和 Promise 拒绝。video 通知不是 metadata 已就绪的保证，start 自己等待媒体信息。可在加载文件前注册监听，尤其是同步通知的工作区模式。

## 配置与默认行为

成功构造需要 `fileInput`：现有 `<input type="file">` 或用作上传区域的 Element。没有有效元素会同步抛错，即使类型中的构造参数可省略。包装元素会获得一个透明文件输入，原生 input 由调用方拥有。拖放和选择只读取第一个文件。

| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `fileInput` | 必须提供 | 文件输入或上传区域 |
| `compatibility` | `published-3.5` 行为 | 也可显式选 `workspace-4.4` |
| `number` | `60` | 截图数量，数值钳制到10–1000 |
| `width` | `160` | 单张宽度，钳制到10–1000 |
| `height` | `90` | 默认模式固定高度，钳制到10–1000 |
| `column` | `10` | 列数，钳制到1–1000 |
| `begin` | `0` | 片段起点，秒 |
| `end` | `NaN` | 片段终点，秒；NaN/0使用媒体时长 |
| `delay` | `300` | 默认模式的等待毫秒，钳制到10–1000 |

使用有限、有效的尺寸和整数数量/列数；历史数值检查不是整数校验器。start 会依据视频时长归一化区间，要求终点大于起点、时长有限且 `number / 区间秒数 <= 1`。例如默认60张需要至少60秒区间，不适合不修改参数就处理数秒视频。

| 行为 | 默认 / published-3.5 | workspace-4.4 |
| --- | --- | --- |
| 高度 | 保留配置 height | start 时按视频宽高比计算并写回 option.height |
| video 事件 | 设置 src 后等待 delay | 设置 src 后同步通知 |
| 截图等待 | 每次 seek 后至少经过 delay，并等待可用帧 | 等待可用帧，无固定额外延迟 |
| done | 最后 update 后再等待 delay × 2 | 没有该固定等待 |
| 文件 input 值 | 保留 | 读取文件后清空 |

依赖未发布4.4工作区行为的代码增加 `compatibility: 'workspace-4.4'`；delay 在该模式中被忽略。静态 `DEFAULTS` 每次返回一份默认配置对象，始终包含 published 模式的 delay，不随实例改变。实际定时器受浏览器调度影响，不保证精确毫秒。

## 方法、状态与输出

| 方法 | 行为 |
| --- | --- |
| `setup(options?)` | 合并部分配置、保留额外字段，返回 this；更换输入时迁移监听器 |
| `loadVideo(file?)` | 接受 File；空值无操作；检查 canPlayType 后创建 Blob URL |
| `start()` | 一次提取任务，返回 `Promise<void>`；重复任务或已就绪预检可能同步抛错 |
| `creatScreenshotDate()` | 历史拼写；返回 `{ time, x, y }[]`，time 为秒 |
| `creatCanvas()` | 历史拼写；创建带黑色背景及底部文字的拼图画布 |
| `download()` | 完成且存在文件/图片后触发 PNG 下载，返回 this；未就绪抛错 |
| `inputChange(event)` / `ondrop(event)` | 已绑定的输入处理器；通常由工具自己监听 |
| `errorHandle(condition, message)` | 条件失败时发 error 并抛错 |
| `destroy()` | 同步、幂等；取消任务并释放自有资源 |

静态 `creatVideo()` 创建并插入页面外的 muted/controls video；直接调用时由调用方管理该额外节点。静态 `ondragover(event)` 调用 preventDefault。这些历史名称没有改成 create*。

状态包括 processing、option、video、duration、density、file、videoUrl、thumbnailUrl，以及可选的事件注册表 e。duration 是选取区间长度，不一定是完整视频长度；density 为截图数/区间秒数。file/URL/density 在相应操作前可能不存在。processing 在 canvas 事件时仍为 false，在 update 时为 true，在 done 前恢复 false。

截图取各等分区间的中点：`begin + (i + 0.5) * duration / number`。拼图宽度为 width × column，高度为 ceil(number / column) × height + 30；底部30像素保留来源及布局文字。小数坐标沿用历史行为。逐张编码 PNG 并发 update，旧图片 Blob URL 被撤销；只保留最新 thumbnailUrl。下载名去掉原文件最后一段扩展名后加 `.png`，无扩展名文件沿用历史的 `.png` 名称。

## 事件和清理

on/once/emit/off 都返回 this；on/once 的第三个参数设置回调 this。off(name) 移除该事件全部监听，off(name, callback) 移除匹配监听。支持自定义字符串、数值和 symbol 事件；监听器异常会停止本次剩余回调，不会自动吞掉。

| 事件 | 参数与时机 |
| --- | --- |
| `file` | File；同步且早于 video.src 赋值 |
| `video` | HTMLVideoElement；时序由模式决定 |
| `canvas` | HTMLCanvasElement；开始提取前 |
| `update` | 最新 URL、0–1进度 |
| `done` | 无参数；先发事件，再结算 start Promise |
| `download` | 下载文件名；触发链接点击后，不保证磁盘写入完成 |
| `error` | 通常为消息字符串；用户回调异常可能带来其他值 |
| `destroy` | 无参数；资源清理后发出一次 |

可以先 start 等待第一次文件选择；没有额外 metadata 超时。替换已有来源或 destroy 会取消旧任务，以 AbortError 拒绝且不为取消发 error。源加载、seek、绘制、编码或回调失败会结算任务；忽略过期回调，避免旧帧更新新结果。

destroy 移除自有 video、生成 input、监听器及 Blob URL，恢复仍由工具控制的包装元素 position；保留调用方 input 和事件注册表。清理会尽量全部执行，再抛出首个清理错误。已销毁实例不会重新创建输入或来源；start 返回取消拒绝。不要在依赖 videoUrl/thumbnailUrl 的播放器仍需要它们时销毁工具；URL 生命周期仍归工具所有。

文件 MIME 的 canPlayType、实际解码、Canvas 编码和 Blob URL 能力是不同条件。Windows WebKit 已有原生 Blob 加载缺口，不能把页面导航或 HTTP 视频加载成功当作本地截图成功。

## TypeScript

根和 `/legacy` 共享同一类类型，没有 `/runtime` 或运行时 `.default` 自引用。CommonJS TS 支持 `import Thumbnail = require('artplayer-tool-thumbnail')`，ESM 默认导入及类型导入如下：

```ts
import Thumbnail, { type Option } from 'artplayer-tool-thumbnail';

function createTool(input: HTMLInputElement) {
  const options: Option = { fileInput: input, number: 10, height: 90 };
  const tool = new Thumbnail(options);
  tool.on('update', (url, progress) => console.log(url, progress));
  tool.on('video', () => {
    void (async () => {
      try { await tool.start(); }
      catch (error) { console.error(error); }
    })();
  });
  return tool;
}
```

类型包括 SheetOptions、Compatibility、DefaultOptions、Option、ResolvedOption、ScreenshotPoint、Events、EventArgs、Listener、EventRegistry。已知事件有精确参数；自定义协议仍需应用约定。旧工作区曾指向不存在的声明，当前类型不冒充已恢复的历史 TS 基线；完整旧 npm 归档缺口与回退验收仍独立记录。
