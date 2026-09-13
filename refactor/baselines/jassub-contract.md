# JASSUB 历史契约与来源检查点

PKG-JASSUB-01 仍为 doing。本记录冻结实现事实，不将尚未确认的 WASM/字体来源或设备
验证标成完成。输入见 [发布清单](jassub-release.json)、[上游比较源](jassub-vendor.json)
和 [字体内嵌元数据](jassub-font-metadata.json)。

## 来源与分发

实际 npm 仅有 1.0.0 / 1.1.0 两个已发布版本（本次 registry 查询）；分别为
2026-01-03 / 2026-03-12 发布。两个 tarball 都固定 SHA-512、SHA-256 和全部六成员，
共有 README、manifest、main/legacy/ESM、类型声明，没有 worker/WASM/font 负载。
对应 registry gitHead 的核心版本为 5.3.1-beta.1 / 5.3.1，只是源码关联，不是支持矩阵证据。
工作区文本固定在 d44e81ce220d0d4475bf4f0f0c2e02ea5b09402a 的九份 Git 输入；本地
worker、WASM、font、ASS、MP4 清点为实际字节哈希，不做文本换行归一化。

1.0.0 CommonJS main/legacy 是带 default 的对象；1.1.0 是直接函数，未带 default。
两版声明均为 default export。两版真实 ESM 都只有 default，导入和创建工厂不启动 worker。
冻结源码的 CJS/IIFE 编译结果是测试用源码入口，不冒充旧发布 UMD；六份真实 UMD 另测。

## 工厂和实例

- `artplayerPluginJassub(option)` 只返回 registrar；注册同步构建 JASSUB 并返回
  `{ name: 'artplayerPluginJassub', instance }`，不等待 worker ready，不返回 Promise。
- wrapper 调用 `new JASSUB({ video: art.video, ...option })`，option.video 可以覆盖宿主视频。
  工厂保留原 option 引用，注册前改 option 可观察；fonts/availableFonts 等传递引用不复制。
- 注册设置 `_canvasParent.style.zIndex = 20`，在 art 的 destroy 事件调用 instance.destroy()。
  没有额外封装、重试、切源跟随或私有实例副本。result.instance 暴露真实 vendor 实例。
- 工厂省略参数在当前/历史 JS 中有效，因为 object spread 忽略 undefined；声明却必填
  JassubOption，且 workerUrl/wasmUrl/modernWasmUrl 必填。vendor 提供 worker/wasm/font 默认值。
- 实际 resize(width, height, top, left, force)、setVideo(video)、destroy() 为同步方法；
  声明误把 resize 第一参数写成 force、其余次序向后移动，并把三方法都写成 Promise<void>。
  不得通过迁移源码直接把错误类型转成实现，也不得静默删除已有字段或开放扩展索引。
- Option/instance 各保留 `[key: string]: any`；它们可能被消费者用于未列出的 vendor 能力。
  `setTrack`、`setTrackByUrl`、`freeTrack` 等实际方法由 vendor 提供，类型范围在 04 审查。

## 资源与渲染边界

插件不改写资源 URL。workerUrl 进入 Worker 构造；wasmUrl/modernWasmUrl 由 vendor 的 SIMD
能力检测选择后发给 worker。默认 worker 为 jassub-worker.js，默认 WASM 为
jassub-worker.wasm，默认 availableFonts 指向 ./default.woff2。默认值最终如何相对宿主/
worker URL 解析、请求失败和字体回退仍须真实 worker/browser 验证，不能由本基线推断。
demo 显式使用 `/assets/jassub/` 的 MP4、ASS、worker/WASM 和字体，并设置 timeOffset=-0.041。

wrapper 创建字幕容器，vendor 管理 canvas、视频事件与 worker 消息。`sendMessage` 等待
私有 loaded Promise；本基线使用受控 ready 消息验证同步方法与消息内容，未执行 WASM。
销毁会终止 worker 并移除容器，但重复销毁、ready 前销毁、直接 instance.destroy 与
art.destroy 叠加、构造失败清理、custom canvas 等边界仍归 02/03；不要宣称生命周期已修复。

## 第三方来源结论

上游 [JASSUB](https://github.com/ThaUnknown/jassub) 是来源线索，当前 main 已变化，不能用
最新文档替代历史 API。固定比较源为实际 npm jassub@1.8.8 tarball：

- 本地 jassub.es.js 与其 dist/jassub.es.js 的差异仅为 eslint-disable 和格式；已用规范化
  编译结果相同及逐行 diff 核对。此结论不表示知道原始取得该文件的操作或 revision。
- package/docs 两份 worker JS 与 1.8.8 dist/jassub-worker.js 字节一致。
- docs 默认 Liberation Sans WOFF2 与 1.8.8 默认字体字节一致。
- package/docs 两套 WASM 彼此字节一致，且基线和上游文件均通过 WebAssembly.validate；
  但不匹配 1.8.8。差异涉及 global/code/data 等 section，不只是自定义元数据。额外
  1.8.6、1.8.5 和 2.0.10 比较未找到匹配，不把近似版本写成精确来源。
- 1.8.8 LICENSE 和 dist/COPYRIGHT 的完整原始成员哈希已冻结，可从校验后的 archive 读取。
  它们不能自动代表尚未匹配的本地 WASM 的完整子组件图与对应来源；VENDOR-04 保持 open。
- 12 个字体的 name 表和 OS/2 fsType 已提取。含 Liberation Sans、Averia、Lato、CHAWP 的
  开放许可线索，也含 Arial、Garamond、Franklin Gothic、Slate Pro 等不同授权文字，以及
  缺少完整许可字段的字体。内嵌文字不等于取得或再分发凭证，VENDOR-05 保持 open。

字体检查只在缓存安装 fonttools 4.60.1、brotli 1.1.0，以 bundled Python 3.12 执行
`refactor/scripts/jassub-font-metadata.py`；没有修改生产依赖和 yarn.lock。重跑时将这两个
固定版本安装到 refactor/.cache/font-inspector，并通过 PYTHONPATH 指向该目录。

## 已覆盖与下一步

48 项包含七份实现的 42 个受控行为和六项发布/vendor/资源/字体/真实 ESM 检查。
所有输入均校验实际 tarball 或 Git 哈希。Worker/DOM/SIMD 为受控对象，不能计为真实
ASS 绘制、WASM 初始化、字体外观、视频时钟/seek/倍率同步或完整浏览器验收。
下一步继续 WASM 构建及字体授权/通知来源核对；02 再补异常/资源与实际渲染失败基线。
