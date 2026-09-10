# 差异、第三方来源与关闭证据

BASE-07 将先前基线发现和第三方来源缺口纳入同一份责任台账。入口为 [风险索引](risk-table.md)、[完整处理与关闭条件](risks.json) 和 [第三方清单](third-party.json)。任务完成代表清点和接续规则建立，不代表其中的问题已经修复。

## 如何读取状态

BASE-07 初始登记 39 项，目前仍为 open；ENG-06 新增并修复 BUILD-AMD-01，共 40 项。reproduced 表示已保存复现结果；source-observed 表示在源码、声明或产物中看到事实；unverified 表示来源、环境或行为仍需取证。证据等级与处理状态互相独立，不能把全部事项称为缺陷，也不能因建立了测试基线而自动接受旧缺陷。

其中 15 项来自生命周期、DOM/示例、消费者类型/分发和性能基线；其余包含发布来源、站点分发、素材来源、8 组内嵌资源和 12 个集成边界。每项都列出负责的任务 ID、证据路径、兼容处理路线与关闭条件。具体复现仍以原基线报告为准。

特别注意 BASE-LIFE-06：已发布包的恢复播放拒绝问题不等于当前源码仍然相同。当前 switchMix 使用 silencePromise，已有 playback 测试；迁移必须保留该修复，再对候选进行验证。BASE-TYPE-04 同时涉及 plugins.add 和 toggle，浏览器直接复现、当前源码及类型测试的覆盖不同，不声称每个子差异都独立做过浏览器复现。

resolved 或 accepted-with-scope 必须提供 resolutionEvidence 和 resolutionRationale。校验器检查文件与字段存在；负责人仍须审查证据是否满足对应 closureCriteria。范围接受需要说明受影响能力、有效环境和发布限制，不能用于全局忽略测试、默认放宽兼容契约或掩盖缺少真机证据。ENG-10 接续历史失败分类，REL-08 将未关闭事项映射到受影响的发布批次。

## 清单范围与来源

第三方清单覆盖 22 包的 manifest 依赖，记录 9 个直接运行依赖在当前 yarn.lock 与本地安装中的版本、许可证元数据。文档包的开发依赖另列；根目录私有工具链由工程任务维护。这不是完整传递依赖 SBOM，也不是完整许可证或安全审计。

当前 Mediabunny 解析为 1.56.1，其已安装 manifest 声明 MPL-2.0。TensorFlow 四个直接依赖解析为 4.22.0，不能把声明范围 ^4.21.0 写成实际安装版本。依赖元数据仅是来源证据，实际 bundle 所含代码、NOTICE、源码提供方式等仍由相应包任务核实。

8 组内嵌资源保存 123 个文件指纹：screenfull、hint.less、WebVTT parser、JASSUB wrapper/worker/WASM、JASSUB 字体、Monaco 静态文件、vConsole 和 console bundle。文本按 LF 计算 SHA-256，二进制直接计算；这些指纹用于识别变化，不证明来源或重新分发许可。并未穷举仓库所有视频、图片、模型和字体，剩余样本来源由 BASE-MEDIA-01、SITE-01 和具体集成任务接续。

已核对的上游入口如下，但当前上游分支不能证明本地复制文件的精确版本、修改历史或全部组成：

| 内容 | 当前证据与后续核实 |
| --- | --- |
| screenfull | 上游 [MIT license](https://github.com/sindresorhus/screenfull/blob/main/license)；本地缺少版本/许可证头，需定位版本与本地差异 |
| Hint.css | 本地头标 2.7.0，已改为 Less；上游 [MIT license](https://github.com/chinchang/hint.css/blob/master/LICENSE)，仍需核对修改与分发通知 |
| WebVTT parser | 本地保留公共领域/CC0 头；[上游项目](https://github.com/w3c/webvtt.js) 标明 CC0，精确 revision 待定 |
| JASSUB | [上游 wrapper 许可证](https://github.com/ThaUnknown/jassub/blob/main/LICENSE) 为 MIT；worker/WASM 的库组成、构建来源和字体必须分别核实 |
| Monaco/vConsole | 本地头标 Monaco 0.30.1、vConsole 3.15.0 及 MIT；Monaco bundle 还包含 DOMPurify 通知，完整组成和 notices 待核对 |
| console bundle | 可见 Parcel/console-feed 特征，原始构建、版本与组成待定位；不从根 MIT 推导结论 |

12 个集成边界分别为 HLS、DASH、FLV、MPEG-TS、WebTorrent、Cast、IMA、MediaPipe/TensorFlow、JASSUB、Mediabunny、调用方 ASR 服务和 option-validator。清单区分运行依赖、调用方对象、CDN 动态脚本及 worker/model/font URL。Yarn 锁定不能锁住没有固定版本的远端 solutionPath。

ASR 插件向调用方回调输出 PCM，插件本身没有内置 ASR SDK；示例才调用远端服务取得 WebSocket 地址。本次只检查代码，没有访问该服务或其他 SDK/广告/模型运行服务。源码中出现 URL 不等于 SDK、设备、网络或媒体能力已通过测试；BASE-08 接续能力与环境矩阵。

## 迁移与维护方式

1. 先读取对应风险的关闭条件与负责任务，再修改生产实现。历史缺陷可修复，但要明确候选行为、老用法兼容性和回归证据。
2. 第三方复制代码保持独立边界；优先为调用层建立 TS 类型与适配器。不要把上游压缩代码机械拆分或转写成 TS。替换 vendor 时记录原/新版本、源地址、差异、通知文件和受影响测试。
3. worker/WASM/font 路径、构造参数、返回实例、DOM/CSS 和媒体事件仍受兼容契约保护。文档静态资源更新也需验证现有编辑器、移动入口和示例。
4. 有意修改包依赖、vendor 内容或集成范围时，同任务更新 third-party.json 及风险证据；重新计算指纹前先审查差异，不以重写指纹绕过检查。保留 Git 历史中的初始快照。
5. 修改 risks.json 后运行以下命令生成索引并检查，完成任务时同时提交实现、测试、记录和任务表。

```sh
node refactor/scripts/risk-register.mjs --write
node refactor/scripts/risk-register.mjs --check
node refactor/scripts/plan.mjs --write
yarn ci:check
```

校验已包含在 test:baseline 中：保护既有基线发现、任务引用、证据路径、生成索引、包覆盖、依赖解析和内嵌文件指纹。负例覆盖漏项、错误任务、无证据关闭、越界路径、错误哈希和锁文件版本偏移。它不能自动发现所有新的第三方文件或判定许可证合规，新增资源仍须进入人工/AI 审查与包任务验收。
