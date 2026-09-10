# CORE-09 URL 与切源操作

状态：完成；源码、生成产物、安装消费与本地三浏览器检查通过。全项目发布验收仍待后续任务。

## 行为决策

涉及 API-02/03/04/05/07/12。旧 switchUrl/switchQuality 返回 Promise<void>，无取消结果类型。保持方法名、描述符、绑定行为、switch setter 与 switchUrl 的函数身份；保持严格字符串同 URL 快速返回。

每次真实 URL 赋值创建内部操作作用域。新的 switch 或直接 art.url 赋值使旧操作失效，销毁清理所有操作。被替代/销毁的 Promise 以 undefined 正常兑现，不新增 AbortError 拒绝；兑现仅表示该调用已结束，不能证明资源曾成功激活。需要确认当前源的应用仍通过 art.url、媒体事件及当前状态判断。实际媒体错误与 customType 抛出/拒绝保留原错误值；内部恢复播放失败仍正常结束切换，公开 play() 的拒绝不改变。

连续切源时只允许最新操作恢复位置、速率、比例、清理通知和发出 restart。普通原生事件注册顺序保持；源 setter 或 customType 同步发出媒体事件时，暂存到赋值完成后处理，防止先前遗漏。仅清除本操作监听器，不清空用户 Emitter 订阅。空 URL 保持旧 loading 行为且不替换媒体源；对应 switch 调用结束，不无限等待一个没有启动的加载。

## 模块

- player/urlMix.ts：公开 URL 描述符、customType 调用及 restart。
- player/switchMix.ts：公开切源方法门面。
- source/types.ts：最小媒体、宿主、事件和方法类型。
- source/operation.ts：当前操作、URL 赋值令牌、失效与失败。
- source/listen.ts：操作拥有的事件订阅与单次调用。
- source/switch.ts：切源、事件暂存、状态恢复和 Promise 结算。

## 兼容边界与责任

customType 保留真实 video、art、this 和三个参数，不用代理对象替换。其内部已启动的 SDK、请求或用户 Promise 可以继续访问真实对象；核心只能取消尚未调用的回调、忽略过期返回/拒绝并清理自身订阅，不能声称取消任意外部代码。直接 URL 赋值没有可消费的 Promise，当前回调错误通过带原错误值的 console.warn 报告；switch 调用通过自身 Promise 拒绝报告。

媒体事件本身没有操作 ID；customType/proxy 仍负责让自己的事件与当前资源一致。核心的操作身份检查不能鉴别第三方继续向真实 video 或 art 发送的伪装成当前事件的过期回调。

补测真实 playMix 曾复现旧恢复把新通知覆盖成 Play；因此 playMix 也捕获当前源身份，晚到结果仍按原值兑现或拒绝，但不再写通知、发 play 或触发互斥暂停。同步正常路径及公开返回值保持。测试既使用受控覆盖函数，也使用实际 playMix，不能用前者代替后者。

旧 URL 的 revokeObjectURL 行为暂保留；对象 URL 的完整归属审计归 CORE-19。播放模块其余迁移归 CORE-10；过期重连归 CORE-11。不要把本任务的操作监听隔离当作这些模块也已全部处理。

## 验证与交付

证据见 [source-operations-validation.json](../baselines/source-operations-validation.json)，记录完整源码/测试/包文件 SHA、安装检查、浏览器版本与逐项结果。

| 验证 | 结果 |
| --- | --- |
| yarn ci:check | 137 项：108 单元、4 工程、25 基线；严格编译 38 个生产 TS 文件 |
| 切源专项 Node | 新增 17 项，覆盖过期、销毁、同 URL、重入、同步事件、错误身份、真实 playMix 和回调身份 |
| 安装包类型 | TS 5.9.3 四组消费模式、TS 4.3.5 一组，均零诊断 |
| 安装包运行时 | 实际 tarball 仓库外安装，27 项通过；范围为核心及 chapter |
| 安装 UMD | Chromium/Firefox/WebKit 共 183 项，通过，无跳过/重试 |
| 安装 legacy | 同一套三浏览器共 183 项，通过，无跳过/重试 |

测试入口：test/source.test.js、test/playback.test.js、test/types/source.ts、test/browser/source.spec.js。BASE-LIFE-01/02/06 已关闭，旧发布基线原样保留。原生 play 的受控拒绝/延迟用于验证 Promise 处理，不作为真实自动播放授权或 codec 支持证明。playMix 补充身份检查前的 180 项 UMD 通过只是阶段证据；最终以包含该修复的 183 项报告及匹配包指纹为准。

未执行远端 GitHub Actions、实体设备或全部生态包发布验收；这些不计为本任务已完成。

不升级版本、不改变依赖和锁文件。本任务完成后单独本地提交。回退按该任务完整提交回退源码、生成产物和文档，不能只恢复 JS 文件而保留调用方的 TS 逻辑。
