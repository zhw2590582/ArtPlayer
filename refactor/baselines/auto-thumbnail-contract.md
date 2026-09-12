# Auto-thumbnail 历史契约

`PKG-AUTO-THUMB-01` 的基线是实际 npm 归档和固定 Git 输入。
见 [归档清单](auto-thumbnail-release.json) 与 [验证结果](auto-thumbnail-contract-validation.json)。
本步没有修改生产源码、公开声明、包版本或 dist；目标版本仍按原计划为 `2.0.0`。

## 发布范围与来源

2026-09-13（北京时间）读取 npm registry，latest 为 `1.1.0`，全部版本是
`1.0.0`、`1.0.1`、`1.1.0`。三份原始 tarball 共 16 个文件逐一校验
registry SHA-512、归档 SHA-256、成员 SHA-256；离线缓存缺失时按固定 URL 重新下载并校验。
归档保存在忽略的 `.cache/releases`，可重跑脚本不依赖可变 latest。

| 版本 | 实际文件与入口 | 声明 | Git 关联核心 |
| --- | --- | --- | --- |
| 1.0.0 | 4 文件，只有源码/README/manifest/types；声明的 main、legacy 不存在 | export= / UMD namespace；错写 height、漏写 number | 5.2.2 |
| 1.0.1 | 6 文件，main/legacy 实际存在；CJS 为 `{ default: function }`；源码随包发布 | 同 1.0.0 | 5.2.2 |
| 1.1.0 | 6 文件，main/legacy 为直接函数；真实 mjs 仅 default；root/legacy exports | default；number 替换 height；仍误写同步 Result | 5.3.1 |
| 固定工作区 1.1.0 | 8 个输入，另含源码/demo；六个对应发布文件按 LF 完全一致 | 同 1.1.0 | 另测最终核心 |

registry gitHead 只证明关联仓库状态，不证明构建可重现或该核心组合通过。
三个 manifest 都没有 peerDependencies、运行依赖或声明支持范围。
后续05至少验证实际核心 5.2.2、5.3.1、已发布稳定核心 5.4.0 与最终候选核心；
这些是验证目标，不能称为已支持的整个版本区间。

八份行为夹具包含两份可运行发布包的 main/legacy、三个工作区 source/main/legacy，
以及 **1.0.0 随包源码经 esbuild 转换的 source-only 夹具**。
绝不将 source-only 写成可从 npm root 正常导入的 1.0.0。
1.0.0/1.0.1 随包源码格式化/minify 后相同；1.1.0 去掉无用途的 loadedCount
以及手写 window 注入，正常运行契约相同；新构建仍有脚本全局入口。

## 必须保留的可用行为

- 函数/global 名 `artplayerPluginAutoThumbnail`；工厂返回注册函数。
  注册同步安装 `video:loadedmetadata` 监听器，实际返回 Promise，resolve 后仅有
  `{ name: 'artplayerPluginAutoThumbnail' }`。不会在导入/注册时创建 video。
- options 是活引用，每次核心 metadata 事件重新读取；url 优先显式 option.url，
  否则读取 `art.option.url`，不是任意假定的 `art.url`。width/number/scale 使用 `||`
  默认 160/100/1，旧调用中的 0 和空字符串走默认。声明上 options 必填。
- 独立 video，`crossOrigin='anonymous'`；高度按视频比例向下取整。
  永远十列；canvas 宽 width*10，高 height*ceil(number/10)。scale 只传给核心缩略图配置。
- 帧时间为 duration*index/number（从 0 开始），不是 Thumbnail 工具的中点策略。
  输出 JPEG，每次更新赋值核心 thumbnails，包含 url/height/column/number/width/scale。
  保留渐进可用的拼图更新，不偷偷改成整段生成完才更新。
- 旧声明中的 height 实际从未参与布局。迁移应兼容该参数的旧类型用法并明确它无效；
  不能突然赋予它改变既有运行结果的新含义。

## 观察到的缺陷与迁移边界

以下是历史对照，**不是要求候选永久保留的缺陷**。

1. 类型把 async 注册写成同步 Result；1.0.x/1.1.0 的 Option 和导出声明不同。
   04须用实际安装的旧消费者验证，不用 `any` 或仅类型断言伪造 Promise 行为。
   若完整推导兼容确实冲突，要列出具体旧调用再按用户的兼容决策流程处理。
2. 1.0.1 CJS 使用者可能调用 `require(name).default`，1.1.0 直接调用 require 结果。
   04/06须同时验证；不能因最新包不再有 .default 就忽略旧使用者。
3. 1.0.0 缺运行入口；无需复制坏发布，但新 tarball 必须验证真实 root/legacy/ESM/types
   和历史源路径的处置。使用 `yarn pack`/仓库外安装，禁止以工作区软链接冒充安装证据。
4. 没有 destroy/restart 清理，重复 metadata 创建多个解码任务；最终 Blob URL 无人释放。
   02需复现切源、迟到 metadata/seek/blob、destroy 和跨实例；03明确任务与资源所有权。
5. 每轮在 seek/draw **之前**排入 toBlob，包含第一个全空快照；第一轮先设 currentTime
   再装 onseeked。编码回调不串行，可能乱序覆盖；没有处理 null Blob、媒体/画布/核心
   setter 失败、非有限尺寸。02补可控故障回归和真实浏览器对照，再由03修复。
   保留有效帧顺序/坐标/渐进更新；空白预览、失效更新、竞态不作为有效 API。
6. options 省略时注册 Promise 正常 resolve，直到 metadata 回调才抛 TypeError。
   当前声明不允许省略；修复输入行为需单独说明，不将既有失效调用宣传为可用功能。

## 验证与后续职责

`node --test refactor/scripts/auto-thumbnail-contract.test.mjs` 的38项核对上述版本、
分发/声明/global/ESM、注册时序、活参数、默认值、帧时间、坐标、JPEG及旧URL替换顺序。
VM 的 DOM/video/toBlob 可控替身 **不证明真实解码、CORS、画布像素或浏览器兼容性**。

02补失败复现；03在自有入口/任务/抽帧/清理模块落实修复；04迁严格 TS 和消费声明；
05使用真实核心与原生 video/canvas/Blob 跑三浏览器、切源、销毁、并发实例和故障；
06再验实际安装、入口、README/demo/编辑器和资源。优先 Chrome，不可用使用内置浏览器；
Windows WebKit 不能代替受支持 Safari 实机。相关缺证据保持显式待办。

真实示例是 `docs/assets/example/auto.thumbnail.js`，README 链接参数 `example=auto.thumbnail`
正确；样例视频文件存在。本步只核对文件，8082 demo、Monaco 和像素验证尚未执行。
不要误改外部 thumbnail 插件示例，也不要混同独立 `artplayer-tool-thumbnail`。
