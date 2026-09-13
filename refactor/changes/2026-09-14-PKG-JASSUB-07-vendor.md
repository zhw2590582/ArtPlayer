# PKG-JASSUB-07 生命周期与字幕时钟修复

## 变更与兼容边界

本任务修改已登记的第三方 wrapper `src/jassub.es.js`，保留 vendor JS 例外，
不把第三方生成代码机械迁为 TS。自有入口和 registration 继续由两个严格 TS
模块负责。原 jassub 1.8.8 来源记录保留，新增可反向校验的
[补丁](../baselines/jassub-vendor.patch)及[来源指纹](../baselines/jassub-vendor-patch.json)，
third-party.json 同时注明原始与本地修改后的身份，防止后续更新覆盖修复。
Worker JS、WASM、字体、资源 URL 和旧根声明均未修改。没有新增依赖或锁文件变更。

公开工厂仍同步返回原生 JASSUB 实例；resize/setVideo/setTrack/destroy 的同步
返回值、字幕协议和实例方法保留。本次修复 API-05/08/10/12 的已复现缺陷：

- 构造任一阶段抛错时，回收此前已创建的 DOM、监听器、帧回调和 Worker，重新
  抛出原始异常；异步能力检测不再向已销毁实例发送初始化消息。
- destroy 首先进入终态，随后尽力完成所有清理，重复调用安全；删除实际归属的
  字幕容器，保留调用者 canvas/video。排队但尚未发送的消息取消，其 Promise
  正常结束，不再向已经 terminate 的 Worker 发消息。
- setVideo 转移自建容器并释放旧视频订阅。render/color-space 回调分别记录归属
  和代次，即使旧回调已经排队，也不能重新启动旧循环或传入旧字幕时间。
- 事件时钟的 ratechange 读取当前视频的数值 playbackRate，直接 setRate(number)
  保持原样，不再把 Event 对象发送给 Worker。
- getEvents/getStyles 的 timeout/Worker error 缺少数据时不再先解构 undefined。
  每请求监听器与定时器在回调前释放，过期事件不重复通知。销毁先清理全部请求，
  再各通知一次取消错误；某个用户回调抛出异常仍完成其他清理和 Worker 终止，
  最后重新抛出第一个异常。正常查询仍返回真实 WASM 数据。

原生 CSP 错误在三个浏览器中均观察到 trusted plain Event，并不保证是 ErrorEvent。
因此新增可选 `/runtime` 的准确回调类型使用 `Error | Event | null`；旧根声明完全
保持，不要求旧入口消费者修改。此入口的迁移说明和 sendMessage 取消语义在
包内 types/README.md 更新。Worker 加载错误沿已有 error 通道送达，调用者仍可
显式销毁；本任务不承诺自动重试、全量错误恢复或新的查询请求 ID 协议。

## Windows WebKit 默认字幕停滞

冻结 npm 1.1.0 的真实播放中，currentTime 已到 6.49 秒且 readyState=4，
totalVideoFrames/droppedVideoFrames 始终为零。浏览器没有原生 RVFC，旧 polyfill
注册一次但不交付，Worker 仅产生空绘制，没有任何字幕 demand。

修复只针对 polyfill 中初始和当前质量计数均为零的情况：媒体时间必须有限且
确实变化、readyState >= 2、没有正在 seek；按当前媒体时间交付近似回调，并限制
每条连续注册链不超过 30 Hz。暂停后完成 seek 可交付，静止暂停不持续交付。
presentedFrames 仍如实为零，不虚构解码帧。原生 RVFC 和正常增长的质量计数路径
保留，后者不受该近似限速影响。独立视频的 map 和单调 ID 同时修复相同时间戳
覆盖回调、跨视频取消和回调异常后未清理的问题。

这是有运行证据的局部兼容修复，不是全局强制 onDemandRender=false。实际默认
onDemandRender=true 的播放、拖动、网页全屏、自定义 canvas 都已验证；所有这些
绘制验证显式 offscreenRender=false，不能替代默认 offscreen、设备和 GPU 验收。

## 验证与中间失败

[验证记录](../baselines/jassub-vendor-validation.json)保留输入 hash、原始日志位置、
安装报告和浏览器 JSON 摘要；本地 cache 不作为唯一永久证据。

| 层次 | 本次结果及范围 |
| --- | --- |
| 生命周期回归 | 同一 21 项在冻结旧产物全部失败，候选全部通过 |
| Polyfill 回归 | 旧产物 13 通过/11 失败，候选 24 全通过；涵盖 144 Hz 模拟时钟、原生与正常计数不变、多视频和暂停 seek |
| 联合测试 | 185 项通过，含旧行为基线、候选修复、真实 WASM 查询、类型、来源和可逆补丁校验 |
| 源码与分发 | 源码、main、legacy 各 68 项通过；正常三格式构建及 docs 副本一致 |
| 严格类型 | 全仓 406 个生产 TS 文件及既有消费者流程通过 |
| 实际安装 | 15 个编译器/包矩阵通过，准确入口每模式 14 个负例、两种无 interop 消费通过；核心 68/JASSUB 15 个安装成员与最终工作区复核一致 |
| 真实浏览器 | Windows Playwright Chromium 153.0.8010.12、Firefox 155、WebKit 26.6，main 默认 9、main 生命周期 12、legacy 21、main 自定义 canvas 9，共 51 项通过，无跳过或重试通过 |

浏览器播放组合包含候选核心、实际 5.4.0 和 5.3.1-beta.1；生命周期错误测试使用
候选核心。原生 Worker/WASM/font/video 真实运行，验证字幕像素、切视频、数值倍率、
重复销毁、非法 Worker URL 的同步 SyntaxError 回滚，以及 CSP 异步错误原对象
向待处理查询交付一次。没有冒充 Chrome 扩展交互或物理 Safari/iOS/Android 验收。

保留三个测试编写过程中发现的问题及修正依据：

1. WebKit 首次播放前 seek 会回到零。fixture 先真实播放，再暂停/seek，随后仍检查
   播放进度和非透明字幕像素，未删除 WebKit 或放松成功条件。
2. CSP 不是同步 SecurityError，回调对象也不保证 ErrorEvent。拆出实际非法 URL
   构造异常测试，并保留 CSP 异步错误及严格对象身份检查。
3. 旧“同步返回值与 resize”测试在立即 destroy 后才检查排队消息。现在销毁前确认
   resize 尺寸、原同步返回值；额外旧红/新绿测试确认 ready 后排队消息在销毁时取消。
   初次候选 66/67 的失败日志保留，最终源码及两格式各 68 通过。

受控 DOM helper 的 appendChild 同步修正为先从旧父节点移除，与真实 DOM 移动
语义一致；跨容器结论同时有真实浏览器验证。没有以 mock 取代真实播放。

main gzip 从 5,434 增至 6,045 字节（+611），legacy 从 5,716 增至 6,385（+669）。
新增成本用于资源归属、清理和时钟回退；完整原始/gzip/Brotli 数值存于验证记录，
不因此调整其他全项目性能门槛。安装验证复用 04 runner，报告保留原任务标识，
07 包装记录明确其最终候选来源。

## 复跑、维护与后续

使用 .node-version 的 Node 和 Yarn Classic 1.22.22：

```sh
yarn test:jassub
yarn typecheck
yarn test:jassub-types-package
yarn build artplayer-plugin-jassub
node --test refactor/scripts/jassub-vendor-patch.test.mjs
```

test:unit 纳入生命周期/polyfill；test:jassub 还纳入补丁身份校验，baseline glob
自动覆盖该来源测试。候选源码与 main/legacy 的环境变量用法见包内 ARCHITECTURE.md。
浏览器设置 ARTPLAYER_JASSUB_ARTIFACT 为正常构建，再运行
`yarn test:browser test/browser/jassub-native.spec.js test/browser/jassub-lifecycle.spec.js --workers=1`；
自定义 canvas 另设 ARTPLAYER_JASSUB_CUSTOM_CANVAS=true。浏览器共享报告每次运行后先归档。

六项本任务风险已用对应证据关闭。05 继续完整组合、真实设备、默认 offscreen 和
错误恢复；06 与 SITE-01 保留 VENDOR-04/05 的通知和字体分发门槛。公开类型/导出
的更广泛准入风险不在本补丁任务一并关闭。仍需全部独立 major、CI/CD 与三轮发布
复盘，不推送或发布。

回退本任务 commit 并正常构建即可恢复原 wrapper 与声明；先停止/销毁现有实例，
不对运行中的 Worker 热替换。上游升级应重新核对原始来源、逐项移植或确认上游
已修复，再运行红绿、类型、安装和原生验证，不能只替换文件并更新指纹。
