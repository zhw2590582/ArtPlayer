# PKG-AUDIO-04：严格 TS 与兼容公开类型

状态：done；起点 9c07ea83；完成后独立本地提交，不推送或发布。
迁移 index/track 两个职责模块，不改变上一任务已验证的运行时逻辑。
公开 Option/Result/UpdateOption，保留必传工厂参数、同一 HTMLAudioElement 和同步 update。
默认入口保留旧 Result 类型；新增 /runtime 类型入口描述部分 update，检验 Parameters
提取、旧结构赋值和无注解回调推断。两入口复用相同 JS/mjs 文件。
保持 root/legacy 运行时路径，补 CJS/ESM 类型桥及由公开声明生成的编辑器全局类型。

严格源码、TS 4.3/5.9 消费模式、负例、Monaco 语义/运行、实际产物浏览器回归已通过。
冻结证据见 [audio-types-validation.json](../baselines/audio-types-validation.json)。

## 兼容方案依据

实际编译用例证明直接 Partial 或“Partial 在前、Option 在后”重载会使旧上下文实现
`update(options) { audio.src = options.url }` 推断 url 为 string | undefined。
虽然显式注解和 Parameters 通过，它仍是公开类型回归。泛型替代还产生 implicit any
或放过未知字段，因此未采用；保留了这些失败日志，不通过删用例宣称兼容。
最终沿用核心的默认兼容类型 + /runtime 精确类型方式，运行入口完全相同，源码可严格
赋值为两种工厂契约，无 any 或方法双变协变豁免。编辑器通过 RuntimeFactory 显式选择
精确语义，原全局类型仍保留旧推断。

## 实施与验收

- index.ts 管理宿主事件及订阅；track.ts 管理音频元素与状态。事件使用明确的字面量
  联合，异常使用 unknown。独立 tsconfig 启用严格检查且不接受 JS 源码。
- 保留原 root/legacy 运行文件与 main/module/types/legacy 字段；新增 CJS/ESM 声明桥、
  TS 4.3 的 typesVersions 和复用原 JS 的 /runtime 入口。未新增依赖。
- `yarn build:ts` 生成编辑器声明，独立 TS 5.9.3/4.3.5 检查通过。五组消费方式各
  12 个错误用法被拒绝；旧显式/上下文实现、Parameters 提取、README 真实 TS 示例、
  部分 update 和同步 void 通过。三个专用类型测试通过。
- 实际 require/import 证明 root 与 /runtime 是同一个函数；legacy 可调用。
  Monaco worker 三引擎验证 core/HLS/audio，共 9 项通过，包含语义正反例与脚本运行。
- 完整 `yarn ci:check` 586 项通过（540 单元、11 工程、35 基线），256 个生产 TS 文件
  纳入严格检查。随后增加的 README 编译断言通过专用测试，最终浏览器辅助函数另经
  定向 lint 和两个完整产物矩阵验证。既有核心声明有一条未使用禁用指令警告。
- `yarn build artplayer-plugin-audio-track` 和三格式 Node 89 项通过；正式 main/legacy
  三引擎最终各 42 项通过，无重试或跳过。每组包含 9 项旧缺陷观察、3 项 WAV 能力诊断，
  不将它们全部计为候选无缺陷验收。三种 JS 与 Audio-03 SHA256 完全相同，docs/compiled
  与包产物逐字节一致，类型迁移没有引入运行时代码。
- 实际 Yarn pack 曾检出 tsconfig.json 泄漏，已加入该包 .npmignore。修正后 12 个文件
  通过既有 checkFiles/packedFiles 校验：6 份声明全量包含且与源码相同、所有 exports
  有目标、历史分发文件保留、无 src/tsconfig。完整隔离安装消费仍由 Audio-06 验收。

## 浏览器失败的处理

首次 legacy 为 41 通过、1 失败：WebKit 上“候选核心 + 已发布 audio”的音频在视频
结束断言前已暂停。这一组合未加载迁移后的 audio；首次 trace 未记录宿主事件，不能
断言已证明具体原因。原始报告与 trace 保留在 .cache/audio04-browser-legacy-first*。

原辅助流程将暂停后 seek 与重新播放挨在一起，缺少 seek 完成和音频实际恢复前提，
既可能误报旧版，也可能让候选因早已暂停而假通过。现在两种用例统一等待双方 seek
完成、readyState >= 3，并确认音频已恢复且时间推进，再观测视频结束；新增宿主事件
记录，未放宽超时、增加重试或修改生产代码。WebKit 相关 4 项各重复 3 次通过，随后
main/legacy 两套完整矩阵通过。增强后的用例通过不等于原生暂停的确切原因已定位。

## 兼容范围、后续与回退

API-09/11 采用 ADR-023：默认旧类型刻意保持 url 必填推断，准确的部分更新类型通过
/runtime 或编辑器 RuntimeFactory 显式选择；AUDIO-TYPE-01 按此兼容范围接受。
README demo 名称改为现存 audio.track，尚无本次 8082 页面验收，AUDIO-DEMO-01 保持开放。
负偏移/时长边界、真实缓冲与连续切源继续 Audio-05，隔离安装/实际 demo 继续 Audio-06。
未修改版本；各包下一 major 由 REL-09 落地，物理设备及发布复盘门槛不变。

回退本任务独立提交可恢复 Audio-03 的 JS 与旧声明；正式 JS 产物未变，不需回退
音频生命周期修复。共享生成器对 core/HLS 的回归已验证。
