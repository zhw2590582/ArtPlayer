# PKG-MASK-03 生命周期与模块拆分

## 结构与契约

入口保留同步注册及 name/start/stop，start 为 Promise<void>，stop 同步返回 undefined。
拆为 config（原样快照默认值）、sdk（后端/模型接口）、output（私有画布与遮罩提交）、
controller（运行归属与调度）和 index（公开门面）。JS 与 TS 渐进共存；完整类型迁移
属于04，未声称本步完成TS。包内 ARCHITECTURE.md 记录状态、资源、维护入口及限制。

保留模板先捕获、OR/undefined 默认值、general/mediapipe、WebGL fulfilled false
不触发CPU fallback、二值颜色及严格RGB>250透明规则、data URL和原有样式。没有改
公开声明、依赖、版本、事件或默认模型CDN。新增 test:danmuku-mask 脚本并将候选
用例加入 test:unit，复用现有 Node/Yarn/测试依赖，不需更新锁文件。

## 缺陷修复及可观察差异

历史54项缺陷探针保留原始来源。候选对 backend/model/segment/mask/draw 每个等待点
验证 stop/destroy 后不晚写、不复活RAF、不提前dispose；并发start共享初始化，
每个注册只拥有一条推理链，stop可及时完成等待中的公共start。销毁撤销精确监听器。
stop现在释放模型和独立画布，重启重新初始化，存在真实的重启开销；重启先等待旧的
不可取消SDK工作及可观察dispose结果，不能把新旧推理并发作为加速。

初始化失败不再维持空转RAF；模型创建失败仍记录原错误并resolve，后端/画布失败
仍拒绝显式start，ready自动调用会观察拒绝。缺节点/2D上下文和0尺寸的失败边界更清楚。
审查中复现了dispose挂起时私有画布仍为300×150，已先释放独立bitmap再等待模型；
保留红测日志及最终断言。多个播放器共享受控SDK/RAF时，停止一个不改变另一个的
模型、图层或帧；这不代表真实TF全局状态已验收。

## 实际验证

Node24.21.0下 yarn test:danmuku-mask：96通过、0失败/跳过，其中36候选、54历史缺陷、
6历史契约；不能把历史探针计为候选修复验证。定向lint通过。正常构建main、legacy、
ESM成功且docs副本逐字节一致。源码helper替换SDK，只验证受控生命周期；没有声称
这些用例验证了内嵌SDK的发布产物运行。独立只读审查未发现具体阻断，指出的阶段
dispose断言已补充。机器证据见 [生命周期验证](../baselines/danmuku-mask-lifecycle-validation.json)。

## 剩余门槛与回退

SDK1.0.2公开dispose不返回底层MediaPipe close完成，因此只能证明调用和自有资源
释放，不能证明WASM/GPU结束；没有使用私有SDK字段规避边界。永不完成的SDK工作仍可
阻塞下一次start，stop仍可完成其公共Promise。MASK-LIFETIME保留真实资源证据待办并
由05接续；模型解释、实际fallback、CORS/切源/真实画面/组合及发布许可仍未关闭。
03按内部结构与受控归属完成，04/05/06依次推进；没有降低最终发布要求。

回退本任务源码、脚本和测试后正常重建三种产物；不修改历史夹具，不推送或发布。
