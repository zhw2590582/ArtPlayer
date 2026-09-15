# 文档画中画

[English](../en/plugin/document-pip.md)

将整个播放器移到浏览器的 Document Picture-in-Picture 窗口，保留播放器控件。关闭窗口时将同一个播放器节点移回原位置。本页描述当前未发布的重构分支；在线示例和未固定版本的 npm/CDN 包不等于当前候选。

## 安装和示例

```sh
yarn add artplayer artplayer-plugin-document-pip
```

```js
import Artplayer from 'artplayer';
import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip';
```

使用 script 时先加载 ArtPlayer，再加载 `dist/artplayer-plugin-document-pip.js`，全局名为 `artplayerPluginDocumentPip`。下面保留[在线示例](https://artplayer.org/?libs=./uncompiled/artplayer-plugin-document-pip/index.js&example=document.pip)的原始代码。

<div className="run-code" data-libs="./uncompiled/artplayer-plugin-document-pip/index.js">▶ Run Code</div>

```js
// npm i artplayer-plugin-document-pip
// import artplayerPluginDocumentPip from 'artplayer-plugin-document-pip';

const art = new Artplayer({
  container: '.artplayer-app',
  url: '/assets/sample/video.mp4',
  plugins: [
    artplayerPluginDocumentPip({
      width: 480,
      height: 270,
      fallbackToVideoPiP: true,
      placeholder: `Playing in Document Picture-in-Picture`,
    }),
  ],
})

art.on('document-pip', (state) => {
  console.log('Document Picture-in-Picture', state)
})
```

## 配置

| 字段 | 类型 | 默认值 | 含义 |
| --- | --- | --- | --- |
| `width` | `number` | `480` | 请求的窗口宽度，由浏览器决定实际尺寸 |
| `height` | `number` | `270` | 请求的窗口高度 |
| `placeholder` | `string` | `'Playing in Document Picture-in-Picture'` | 原播放器位置的占位文字 |
| `fallbackToVideoPiP` | `boolean` | `true` | 未检测到 Document PiP API 时尝试设置 `art.pip = true` |

插件安装名为 `artplayerPluginDocumentPip`，并添加画中画控制按钮。Document PiP 需要浏览器提供 `documentPictureInPicture.requestWindow`；能力检测为真仍可能因权限、调用环境或用户操作条件而打开失败。请在用户点击处理函数内直接调用 `open()` 或 `toggle()`，避免先等待网络等异步工作而丢失用户激活。

视频 PiP 降级也受浏览器及当前媒体能力限制。它不会移走整个播放器，不会将插件的 `isActive` 设为真，也不会发出 Document PiP 的激活事件。`close()` 管理 Document PiP 窗口；需要退出视频 PiP 时使用 `art.pip = false`。关闭降级选项不代表浏览器自动获得 Document PiP 能力。

## 状态、方法和事件

从 `art.plugins.artplayerPluginDocumentPip` 取得结果：

| 成员 | 实际行为 |
| --- | --- |
| `name` | 固定为 `artplayerPluginDocumentPip` |
| `isSupported` | 只读 getter，插件创建时的 Document PiP API 能力快照 |
| `isActive` | 只读 getter，当前是否持有 Document PiP 会话；不是视频 PiP 状态 |
| `open()` | 实际返回 `Promise<void>`；请求并移入播放器，已打开时不重复创建，请求中重复调用共享该次请求 |
| `close()` | 实际返回 `Promise<void>`；取消待处理请求或恢复节点并关闭窗口 |
| `toggle()` | 同步返回 `undefined`；打开，或关闭当前/正在申请的窗口 |

成功激活及正常关闭时，播放器发出 `document-pip` 事件，参数分别为 `true` 和 `false`。插件同步更新原有 `artplayer-document-pip` 类并重新绑定跨文档事件，随后安排 resize；不要把此事件理解为一次媒体加载或播放成功。

正常窗口请求/还原失败会显示 notice 并写入控制台警告，`open()` 不是“返回即保证窗口打开”的成功标记。视频降级设置器抛出的错误仍可使 Promise 拒绝。关闭待处理请求后，迟到的窗口会被关闭，不再接管播放器。销毁播放器会释放窗口、控件、订阅和定时器，不再发出新的插件状态事件。插件没有单独的公开 `destroy()`。

插件尽力复制播放器所在文档的样式；无法读取的跨域样式及应用自行管理的外部 DOM 仍需在目标环境验证。Canvas、其他代理、键盘焦点和持续播放的支持也应逐一验证，不能仅凭能力字段推断。

## TypeScript 兼容类型

根入口和 `/legacy` 保留旧声明：工厂参数对象必填、`Result` 的状态字段可写、方法返回 `void`。JavaScript 实际允许省略配置，状态 getter 不可赋值，`open/close` 返回 Promise。旧类型保留是为了兼容已有消费者和替换函数，不表示运行时字段变成可写。

本包没有 `/runtime` 子路径。需要精确类型时，将真实工厂显式看作 `RuntimeFactory`：

```ts
import documentPip from 'artplayer-plugin-document-pip';
import type { AsyncResult, RuntimeFactory } from 'artplayer-plugin-document-pip';

const runtimeFactory = documentPip as RuntimeFactory;
const installPip = runtimeFactory();
const installDefaultPip = runtimeFactory.default({ width: 480 });

async function closePip(pip: AsyncResult): Promise<void> {
  await pip.close();
}
```

命名类型为 `Option`、`Result`、`AsyncResult`、`Factory`、`RuntimeFactory`。精确视图仅用于未经替换的真实实现，不能将返回 void 的 mock 或被替换方法强转为异步实现。CommonJS 运行时支持 `require(package)(options)` 和 `.default(options)`；旧 `import = require` 类型视图使用 `.default`，需要直接调用时选择精确工厂视图。
