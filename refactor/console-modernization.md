# 文档站 console.js 的兼容迁移边界

SITE-07 先冻结原始 bundle 和浏览器契约，后续实现由 SITE-CONSOLE-01 负责。
不能将 consoleLog 替换成一个只打印字符串的新面板，就声称旧接口已兼容。

## 已核实的现状

- 原文件最后修改于提交 5d6b2f22bc75213ac97cff0bcffa4a1ce2bc786c，2021-11-30。
- 340,306 字节，102 个 Parcel 模块；所有静态依赖表条目都指向该 bundle 内的模块。
- Focm 是自有安装入口，W5CS 是自有 React 控制台视图，其余模块须继续溯源。
- 实际全局包括 React、ReactDOM、consoleLog 和 parcelRequire。React/ReactDOM
  均为 17.0.2，styled-components bundle 声明版本 5.3.3。
- console-feed 的包版本不能只凭年代推定；npm 当时最新版本 3.2.2 是待比对候选，
  本批没有确认它就是当前捆绑版本，也没有确认全部传递依赖的版本与许可。
- 原末尾指向不存在的 /index.js.map。原始 bundle 和模块指纹见
  [冻结来源](baselines/site-console-inventory.json)。

## 必须保留或明确验证的契约

| 边界 | 已有行为与迁移要求 |
| --- | --- |
| URL / 全局 | 保留 /assets/js/console.js、React、ReactDOM、consoleLog 及现有 Parcel 加载器的调用兼容；不得混入根工程 React 19 导致两份 React 冲突 |
| 返回值 | consoleLog(element) 返回 React 组件实例；重复挂载同一元素复用实例和 hook，不能改成 void 或全新句柄 |
| 实例接口 | add、onClear、onMouseEnter、onMouseLeave、render 等已有方法及 logs/hover 状态必须评估和测试 |
| DOM/CSS | console-header、console-header-number、console-header-right、console-component；保留 Clear、计数、滚动、悬停暂停及对象检查能力 |
| 数据 | 日志顺序、等级、普通对象/循环引用、错误、console 原方法转发与返回行为；不要把对象提前 stringify |
| 生命周期 | 多个容器、同容器重复挂载、卸载顺序、待处理日志和滚动、外部 console 包装者、页面切换/恢复 |
| 依赖 | 自有 TS 模块与第三方运行时代码分开；冻结来源/许可和可复现构建，不把 minified vendor 改名为 TS |

冻结文件 [console-original.js](baselines/site-vendor/console-original.js) 仅作为旧行为
对照，不进入站点分发。测试校验其 SHA-256；后续不得覆盖旧文件来制造差分通过。

## 已复现、尚未修复的问题

1. **CONSOLE-SCROLL-01**：add 安排 200ms 滚动回调；卸载后未取消，回调仍访问已移除
   视图。使用真实定时器、原 ReactDOM 卸载和 DOM 验证，三个引擎均可复现。
2. **CONSOLE-OWNERSHIP-01**：两个容器挂载会相互包装同一个全局 console；卸载第一个
   时 Unhook 读取的是第二个写入的 pointers，导致仍存在的视图停止收到日志。
3. **CONSOLE-ERROR-01**：console-feed 的 error 解析分支取参数的 stack；Firefox 和
   WebKit 的原生 Error.stack 不含 message，界面丢失消息。Chromium 为有消息的对照。
   普通对象保留引用，但 Error 已被旧 parser 转成字符串，不能误称仍保留 Error 身份。

## 实施顺序

1. 从已冻结自有入口/视图恢复可维护 TS，拆开安装、日志订阅/状态、视图与资源清理。
   结合固定第三方边界建立构建/check，保留旧入口和已观测全局，不引入 React 版本混用。
2. 单一 owner 管理 console hook 的订阅者与原方法恢复，处理多容器和外部包装者；
   取消滚动及过期更新，避免卸载后继续触碰 DOM。不得用永久吞掉异常绕过释放问题。
3. 修复原生 Error 消息丢失，同时保留堆栈、普通对象和非错误日志语义；先建立候选
   失败回归，再实现。不要把普通 Error 统一转换成无堆栈的字符串。
4. 对照旧版执行接口/DOM/滚动/多容器/卸载矩阵，验证实际编辑器、Run/切换/页面恢复。
   检查构建字节和依赖隔离，并完成包内架构、问题、生成说明。
5. SITE-07 继续完成全部第三方来源/版本与完整许可。来源未确认时不得关闭 VENDOR-08；
   旧 vendor 的冻结不等于许可审查通过，也不等于完成其可复现来源恢复。

当前 [site-console.spec.js](../test/browser/site-console.spec.js) 含两种输入的共同
行为，以及三个仅指向冻结旧版的问题复现。历史问题用例通过意味着问题仍可复现，
**不意味着候选已修复**。SITE-CONSOLE-01 必须新增候选“无泄漏/不丢日志/错误消息可见”
断言并通过；不得将历史缺陷断言移用为候选验收标准。
