# PKG-JASSUB-08 默认 offscreen 初始化修复

## 问题与实现

从 `0f3c068aae1415c2d40ede8708f02f4c5864fe7a` 开始补全 05 默认模式验收时，
Chromium/Firefox 三个核心组合都出现真实页面异常：
`this._ctx.clearRect is not a function`。WebKit 本机没有转移能力，默认回退路径
三项通过。这是 3 通过/6 失败的实际结果，不是浏览器连接或媒体网络问题。

Worker 消息证明初始化顺序为 init → canvas → offscreenCanvas。构造时 setVideo
已排队 resize，等待 `_loaded`；初始画布转移后来才排队。ready 解锁时，Worker
先执行 resize，在尚未接收画布时向主线程发回 render。主线程已选 offscreen，
`_ctx=false`，因此空图像消息也会触发 clearRect 异常。字幕随后能够出现不能
抵消这个未处理错误。

本修复只调整初始归属交接：Worker ready 到达后先同步 postMessage 转移画布，
再 resolve `_loaded` 并派发公开 ready。标志阻止重复 ready 转移同一画布两次。
于是所有排队的 resize、track 和 ready 监听器消息在画布交接之后到达 Worker。
已销毁实例仍由现有终态检查拦截。没有全局禁用 offscreen，也不静默吞掉 render
异常；后续 hybrid detach/reattach 保持原样，其完整组合仍属 05。

API-04/05/10/12：公开注册和实例方法同步返回值、选项默认、资源 URL、Worker
载荷和文件均保留，仅修复内部消息顺序。自有 TS 与公共声明不变。无新依赖、
锁文件、版本或运行时目标变化。JASSUB 的原始及 07 来源指纹保留，08 新增
[独立补丁](../baselines/jassub-offscreen.patch)和[补丁记录](../baselines/jassub-offscreen-patch.json)。
校验器沿两个已记录基线验证补丁链，核对旧补丁的实际 Git diff、新补丁可逆性和
最终 source 指纹，不覆盖历史证据。包内 ARCHITECTURE.md 同步初始化顺序及复跑方式。

## 测试和真实证据

[验证记录](../baselines/jassub-offscreen-validation.json)记录本次源码/产物/测试
指纹、失败与通过报告、原生消息顺序、像素快照和最终安装矩阵。

| 验证 | 结果 |
| --- | --- |
| 新增六项顺序与选择测试 | 修复前 5 通过/1 失败，候选 6 通过；另五项保护重复 ready、提前销毁、显式 false、无能力和自定义 canvas |
| 联合 JASSUB | 191 项通过，含历史缺陷基线与新的候选测试，不把全部数量当成新增修复 |
| 源码/main/legacy | 各 74 项通过；类型未变，严格分包 TS 及 lint 通过 |
| 默认模式 main | 9 项通过：三个浏览器 × 候选核心/实际 5.4.0/实际 5.3.1-beta.1 |
| 默认模式 legacy + 生命周期 | 21 项通过，其中默认模式 9 项，显式主线程生命周期 12 项 |
| main 显式主线程 + 生命周期 | 21 项通过，其中播放 9 项、生命周期 12 项 |
| 实际安装 | 15 个当前/旧编译器矩阵通过，准确入口逐条 14 负例及无 interop 消费；核心 68 和插件 15 个打包成员与最终工作区一致 |

共 51 项候选真实浏览器验证，零跳过、零重试通过。实际版本为 Windows Playwright
Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6。前两者记录 available/selected
均 true，WebKit 两者均 false；不能称为三个引擎都验证了 offscreen。

测试读取显示画布的真实 bitmap 到独立 canvas，避免对已经转移的画布调用
getContext；未替换 Worker、WASM、字体或视频解码。仍逐项断言字幕透明像素数量、
seek 前后像素签名变化、播放位置、网页全屏尺寸和销毁次数，且默认能力选择必须
与平台吻合。原六项失败保留为红色证据，新实现不以放宽页面异常检查获得通过。

正常构建三格式及 docs 副本相同。main gzip 从 6,045 到 6,069 字节（+24），
legacy 从 6,385 到 6,411（+26）。安装证据复用 04 的 runner，记录保留原 task
字段，本次验证明确归属 08。包文档更新后才运行最终 pack，没有混用旧候选。

## 复跑与后续

```sh
yarn test:jassub
yarn test:jassub-types-package
yarn build artplayer-plugin-jassub
node --test test/jassub-offscreen.test.js
node --test refactor/scripts/jassub-vendor-patch.test.mjs
```

使用固定 Node/Yarn；设置 ARTPLAYER_JASSUB_ARTIFACT 为正常 main/legacy 文件，
ARTPLAYER_JASSUB_OFFSCREEN=default 后执行
`yarn test:browser test/browser/jassub-native.spec.js --workers=1`。
不设置该 offscreen 变量时仍验证显式主线程路径。每次浏览器运行后先归档共享报告。

关闭 JASSUB-OFFSCREEN-01，新增独立 08 任务与提交，作为 05 的前置。05 仍未完成：
全量切源/hybrid、错误恢复、真实设备与持续 GPU/内存释放不能由上述窗口测试证明。
06 的分发/通知和 VENDOR-04/05 保留，所有包 major、CI/CD、三轮复盘不受影响。
没有 push、tag 或 npm 发布。

回退本 commit 并正常构建恢复 07，保留其生命周期/字幕时钟修复；补丁链校验器
随同回退。不要对运行中的 Worker 热替换画布协议。
