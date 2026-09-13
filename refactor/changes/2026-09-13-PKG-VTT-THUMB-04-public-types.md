# PKG-VTT-THUMB-04 公开类型与安装消费者检查点

本次覆盖 API-06/09/11：保留 root/legacy 的旧工厂参数、同步结果类型与工厂替换赋值，
增加 `/runtime` 入口，给新代码准确的 Promise<Result>。两种入口映射到同一产物和函数；
不会给 Promise 添加 name 字段来伪造同步返回。Option/Result 由公开定义统一维护，
内部实现引用这些数据类型，保持必传 options 对象、可选 vtt/style 和原有 CSS 字段类型。

## 消费方式与兼容边界

旧代码 `import vtt from 'artplayer-plugin-vtt-thumbnail'` 不需要改动。
旧声明误把实际异步注册写成同步 Result；直接修正会影响 ReturnType 和替换工厂赋值。
本次保留该兼容声明，新代码可使用
`import vtt from 'artplayer-plugin-vtt-thumbnail/runtime'`，然后
`const result = await vtt({ vtt: '/cues.vtt' })(art)`，无需消费者类型断言。
没有改变运行时异步行为或默认产品配置。

导出函数增加可写的自引用 `.default`，兼容旧 1.0.x 有效的 CommonJS default 调用，
并保持最新直接调用。新回归在上个提交的真实 bundle 中仅此项失败，另外 21 项通过；
候选注册仍返回无同步 name 的 Promise。根入口/legacy 用 .d.mts/.d.cts 保留默认导入类型，
runtime 的 CommonJS 声明使用 export=，支持直接及 default 调用。typesVersions 支持
classic 解析。编辑器全局仍为旧调用类型，命名空间 RuntimeFactory 只是类型，并非新增全局函数。

## 验证和工程改动

- 本包测试 251 项；源码/main/legacy 解析与生命周期各 48 项通过。纯 parser 断言仍取源码，
  非法输入、扩展 VTT 注册和生命周期会执行选定产物，不将纯函数检查计作安装包行为。
- TS 5.9.3/5.1.6 严格源码检查通过，移除 expect-error 各复现 8 项预期错误。
  公开声明五种模式各验证 10 项反例，编辑器 TS 5.9/4.3 各验证 2 项反例。
- `yarn test:vtt-thumbnail-types-package` 是新增的实际打包验证脚本；固定 Yarn 1.22.22，
  在仓库外安装 packed core 和五份历史 npm 包/候选包，核对成员字节并执行 offline/frozen 重装。
  五份旧声明 × 两个 classic 编译器，加候选七种模式，共 17 格通过。候选还验证原生 Node
  root/runtime ESM 与 CJS 入口身份相同、legacy 默认导入与 require 身份相同。
- 第一次实际 pack 发现 tsconfig.json 泄漏，已通过 .npmignore 排除，未关闭包内容检查。
  新脚本及旧消费者夹具完成显式 lint；没有增加依赖或修改锁文件。
- 原生 Chromium/Firefox/Windows WebKit，发布/候选核心，三场景和三种插件入口共 54 项通过，
  覆盖真实 hover、sprite 解码、非法输入恢复、原生 fetch 取消和 destroy 清理。不是实体 Safari 验收。
- 正常 build 更新三个 dist 与 docs 副本；build:ts 用语义生成器更新编辑器声明。
  完整 CI 的最终结果及内容指纹见 [验证记录](../baselines/vtt-thumbnail-public-types.json)。

## 剩余工作与回退

04 仍为 doing。已通过的历史类型消费者是 classic default-import 和工厂替换；历史 NodeNext、
原始 import=require 的类型替换形式仍需逐项核对，不能扩称所有历史 TS 用法都通过。
早期控件名、完整核心/设备组合、源码深路径分发与在线编辑器交互继续归 05/06。
相关 TYPE/EXPORT 风险保持 open，尚未升级版本或达到 npm 发布条件。

本次作为独立本地检查点提交。回退本提交可恢复前次公开声明/入口并移除新增 runtime 入口
及 default 别名；此前请求、解析与生命周期修复不受影响。不推送、不发布。
