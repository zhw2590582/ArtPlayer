# CORE-01：核心工具模块 TypeScript 迁移

## 实际源码与边界

time/property/format/file/error/subtitle 与导出 barrel 共七个生产文件迁移到严格 TS。
沿用现有合理职责划分，无机械增加空转发文件。纯计算不接收播放器实例；DOM 下载和 Blob URL
创建的资源责任有明确说明，见 [核心架构](../../packages/artplayer/ARCHITECTURE.md)。

核心入口及 DOM/capability/Emitter/Component 仍为 JS，由后续任务迁移。没有宣称核心整体完成。
Artplayer.utils 的运行时导出与之前工作区完全一致；对发布基线的两个已有扩展
silencePromise/getSafeAreaInsets 也保留。函数参数个数、native def、属性描述符、调用方数组引用、
合并时一层 concat 展开、字幕字符串、定时器 this/参数/前沿后沿/重入/抛错行为均有对照测试。

格式化的私有实体映射复用，getExt 改为一次截取 query/hash；保留原字符串结果和 ES2015 能力边界，
没有据此宣称浏览器性能提升。ArtPlayerError 的栈捕获按实际引擎能力判断；内部 Promise 抑制
保持与外部 play/toggle Promise 分离。

## 有意修复与类型债务

- UTIL-MERGE-01：Object.keys 遍历到 JSON `__proto__` 时，旧实现改变返回对象的原型。
  现在用 own data descriptor 写键，保留普通合并语义；嵌套情况、输入未变和原型未替换通过。
  这是结果对象原型的修正，不声称旧实现已被证明能修改全局 Object.prototype。
- UTIL-DOWNLOAD-01：下载临时 anchor 在 click 抛错时也由 finally 删除；异常继续传播。
  三浏览器验证真实下载成功及受控失败清理，调用者提供的 URL 不被擅自 revoke。
- BASE-TYPE-05：公开 Utils 声明原有缺项、定时器返回值/context、def/sleep 签名差异继续交给
  CORE-07。本任务内部类型已准确描述返回值/receiver，公开旧消费未静默收紧。该条保持 open。

动态 merge accumulator 和 catch 鸭子类型各有局部边界，未增加全文件忽略、运行依赖或泛化 any。

## 验证

- `yarn ci:check`：75 项 Node/基线测试通过，严格源类型/31 个消费场景通过。
- 新增 13 项工具测试含发布/当前对照；实际 core UMD、legacy、ESM 各运行 18 项通过。
- `yarn build artplayer` 和 `yarn build:i18n` 重新生成 core dist 与 docs/compiled。
  当前核心产物同时包含 ENG-06 已验证的 AMD 修正，之前 tracked dist 尚未重建；没有手改产物。
- `yarn test:package:release` 实际安装后 23 项运行时、五组类型零诊断。
- 安装候选 Chromium/Firefox/WebKit 总计 69 项通过，无重试/跳过；包括旧核心/新 chapter、
  新核心/旧 chapter（工具页面加载）、播放/seek/切源/销毁、真实下载和 VTT Blob 数据。
  新核心与旧 chapter 的完整插件功能仍由后续组合任务覆盖，不把加载脚本当作完整集成。
- [执行指纹](../baselines/core-utils-validation.json) 核对最终 runtime 文件与浏览器加载内容、
  仓库生成产物一致。包内文档增加后重跑打包，运行时 SHA 未变，无需重复播放同一字节。

更新测试入口和包内维护文档；新增风险进入统一台账。下一项按依赖迁移 Emitter 等核心模块。
没有升级包版本、推送或发布。回退本任务独立提交会同时恢复源码、测试、记录和生成产物。
