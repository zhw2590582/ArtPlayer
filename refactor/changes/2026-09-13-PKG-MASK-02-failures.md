# PKG-MASK-02 历史错误与生命周期观察

本任务新增历史测试、专属 helper 和证据，并接入根测试脚本；未修改生产或生成产物，未执行模型，
没有浏览器服务器、推送或发布。PKG-MASK-03 仍依赖 PKG-DANMUKU-07；该依赖尚未
满足，生产重构按任务依赖继续推进。本任务不代表 SDK-08 完成。

## 输入和可重放接缝

源码来自 `b0cfbfe3a09a84a295a257e45e4577847588d1cb`；真实 npm 1.0.0/1.1.0
tarball 来自 MASK-01 的 SHA512/SHA256 冻结。源文件与六个 main/legacy/module
成员共七个输入，标识见 [机器报告](../baselines/danmuku-mask-failures-validation.json)。

两种探针必须区分：

- MASK-01 已用**未改写的归档字节**验证 CommonJS/script 导出、注册和 stop，未启动模型。
- MASK-02 的历史生命周期探针对归档导出工厂内部 **五个 SDK 调用表达式的 callee**
  做受控替换：setBackend(webgl/cpu) 两处、createSegmenter/toBinaryMask/drawMask
  各一处。inline SDK 函数表达式作为整体替换，原插件异步流程、生命周期、错误处理、
  canvas 操作与旧版 async helper 保留。module 先以 esbuild 转为 CJS，因此不算
  原生 ESM 验收。冻结源码仅转换模块形式，通过 require seam 注入 SDK 替身。

helper 首先校验真实归档，再从实际导出函数定位唯一原文字段，用 TypeScript AST
寻找接缝。固定替换数量不是模糊匹配后继续运行：任何数量不符直接失败。报告保存
原成员哈希、转 CJS 后哈希、探针哈希、每个 callee 的范围/旧表达式哈希。首项测试
逐项比较报告，变化必须显式审查。实际 SDK 顶层注册可执行，但没有模型初始化、
模型网络、GPU 或媒体推理。探针 fetch 被拒绝；错误探针不得以网络错误替代目标错误。

## 实际观察

七个输入都复现以下三个历史缺陷，共 21 项：

| 触发 | 历史结果 |
| --- | --- |
| 初始化 pending → stop → 完成初始化 | stop 的 maskImage=none 被后续 mask 写入覆盖，重新安排 RAF |
| 推理 pending → destroy → 推理完成 | 销毁后仍画 mask/排 RAF；segmenter 未 dispose，ready/destroy listener 留存 |
| 初始化完成后再次 start → stop | 两条 RAF 链，stop 只取消最后记录的一条；剩余链下一轮重新写 mask |

详细错误矩阵集中在冻结源码与 npm 1.1.0 main，各 16 项，避免为所有格式机械重复：

| 触发 | 历史结果 / 关联风险 |
| --- | --- |
| 初始化 pending 时 stop 或 destroy | 后续模型仍存活，不 dispose；MASK-LIFETIME-01 |
| 推理 pending 时 stop | 晚到结果覆盖 none 并排新 RAF；MASK-LIFETIME-01 |
| 同时两次 start | 创建两个模型、两条 RAF，destroy 后仍剩一条，两个模型均未 dispose；MASK-START-01 |
| segmentPeople rejection | 每帧记一次错误并重试；改为成功后能再画 mask；MASK-BACKEND-01 |
| setBackend(webgl) fulfilled false | 不尝试 CPU，继续初始化；MASK-BACKEND-01 |
| WebGL rejection、CPU fulfilled true/false | 均尝试 CPU、记录一次 warning、继续初始化，忽略返回 boolean；不是 MediaPipe CPU 推理证据 |
| CPU rejection，经显式 start 调用 | Promise 以同一错误拒绝，尚未创建模型或排 RAF |
| createSegmenter rejection | 记录错误，但 start resolve；以后 RAF 只轮询，既不推理也不自动重新初始化 |
| 缺少 $danmuku | start 在模型创建后以 TypeError 拒绝；stop 也抛错，模型未 dispose；MASK-DOM-01 |
| getContext 返回 null | start resolve；读图像时报 TypeError 并排下一帧，旧 mask 不被清除 |
| createElement(canvas) 抛错 | start 以同一错误拒绝；已初始化模型在 destroy 后仍未 dispose |
| getImageData 抛受控 SecurityError | 错误被记录并重试，既有 mask 留存；这不是原生 CORS 复现 |
| RAF 返回 0；destroy 后再次 ready | truthiness 判断漏取消 0，保留 ready listener 可再启动一条链 |
| ready 内 CPU rejection | 被事件调度丢弃的 start Promise 产生未处理拒绝 |
| 缺少 $video | segmentBody 在 try 之外读 paused，产生未处理拒绝 |

加上接缝身份验证，共 **54 项历史测试**。未处理拒绝的四项各启独立 Node 子进程，
使用 `--unhandled-rejections=strict`，验证子进程 exit=1 和指定错误；父进程没有安装
unhandledRejection handler，子进程也没有吞错 handler。子进程只能以指定错误失败，
AssertionError 或禁止网络错误均不作为通过。测试进程本身没有实际 RAF 定时器；
故意留存的历史帧只在该测试的 Map 内，不会泄漏到真实 UI。

## 验证及后续约束

固定 Node 24.21.0：

```sh
node --test test/danmuku-mask-failures.test.js
node node_modules/eslint/bin/eslint.js test/helpers/danmuku-mask.js test/danmuku-mask-failures.test.js
yarn test:danmuku-mask
```

54 项通过、0 fail、0 skip；专属 lint 通过。日志
`refactor/.cache/danmuku-mask-failures-final.log`，机器报告记录其哈希和输入身份。
这里只证明旧缺陷可重跑，**这些结果不能变成候选验收期望**。后续候选测试应独立
验证异步失效、模型单一归属、RAF 单链、适当错误传播/事件处理和销毁清理；不要靠
将本套测试切换到候选 source 来保留已知问题。SDK-08、真实模型/设备/视频/浏览器
与新旧核心组合仍由 05 验收，通知/资源最终分发由 06 核实。

父代理独立复跑54项通过，加入现有test:unit使CI自动执行；专属
test:danmuku-mask同时覆盖01的六项契约。未安装依赖或更改Yarn锁文件。
