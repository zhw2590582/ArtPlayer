# CORE-12 模板及公开资源入口

状态：完成；源码、严格类型、构建、安装包与本地三浏览器验收通过。

## 实际模块与兼容边界

模板拆为入口、html、节点绑定和泛型宿主/节点类型；保持 DOM 字符串、绑定顺序、query 绑定、节点身份、SSR 复用、proxy 调用上下文及销毁策略。SSR 缺节点不擅自补齐；canvas 不断言成原生 video。容器类型断言仅覆盖已有 non-null/div 校验边界，选择器泛型不声称验证任意用户 HTML。

图标拆分默认 SVG 与注册器，保持每次读取的新 i 包装、自定义节点移动、描述符和默认覆盖。12 个语言源码迁移 TS，共享发布别名边界；构建仍输出 11 对独立语言文件。style 入口与注入实现迁移 TS，主入口维持全局赋值/调用顺序，utils 继续导出原帮助函数。

BASE-I18N-01：旧 get('constructor') 在缺少翻译时返回函数；候选只查自身属性，返回原 key 字符串。自有 constructor/toString/__proto__ 翻译、空字符串 fallback、大小写和 update 深合并保持。此为明确缺陷修正，发布基线不改。

BASE-TYPE-09：旧 icons 声明为 HTMLDivElement，实际为 i 元素；template 实例声明 html，但实际是构造器静态字段，video 又可能为 canvas。源码保留真实类型，公开声明旧合法赋值暂不收紧，交 CORE-21 统一提供精确兼容视图。

## 复制资源与许可

screenfull 固定以 v6.0.2 为比较基准；AST 输出去注释后仅四项适配：取消可选下标、let 改 const、element 保留 null、移除不支持时替换整个对象的分支。本地首次引入 fab5afed2（2022-07-18）未记录精确上游 tag；6.0.0/6.0.1 的规范化实现相同且也有差异，因此不把比较基准伪装成已证实的历史复制版本。现有实现未替换。

Hint.css 头部明确 v2.7.0；剥离 ArtPlayer 外层作用域、经 Less 规范化并统一引号后，全部样式仅相差首条 font-style:normal 和默认颜色 #383838 改 #000000。所有规则保持。

固定上游原文、许可证、URL/SHA 见 baselines/core-vendor。core-vendor.mjs 对全部规范化内容进行差异限定，并确认通知含完整 MIT 许可。THIRD_PARTY_NOTICES 包含 screenfull、Hint.css 及已打包 option-validator 2.0.6 的许可，构建脚本将全文加入每个核心输出头部。已核对实际 tarball 中的通知文件和三个独立 JS 头部完整许可，并验证当前源码/产物/语言文件与安装消费者的 SHA 一致；VENDOR-01/02 关闭。历史 screenfull 引入 tag 的不确定性保持明示，固定比较版本与全部适配可重复验证。

## 最终验证

- 源码专项：4 项语言/SSR、7 项复制内容/全屏适配测试通过；核心及源码类型用例编译通过。
- 三浏览器专项包括新旧 SSR 复用、proxy、图标、语言缺陷对照、fullscreenWeb 和实际点击进入/退出原生全屏。三个本地引擎均报告 native fullscreen 可用，六个新旧组合全部实际执行原生路径。
- yarn ci:check：169 项通过（140 单元、4 工程、25 基线）；76 个生产 TS 文件严格检查。
- 实际核心/chapter tarball：27 项运行时通过、五组类型零诊断；全部 11 对语言子路径、UMD 和 ESM 浏览器别名及目录完整性通过。
- 最终安装 UMD：258 项三浏览器通过；最终安装 legacy：同套 258 项通过。没有跳过、重试、flaky 或未处理 JS 异常。
- [证据](../baselines/template-resources-validation.json) 记录完整源文件/测试/产物指纹、语言与许可文件、引擎版本、每项结果和原生全屏能力。
- 初次新增原生全屏用例误用了 /media/pattern.mp4，六项在 ready 前失败；保留报告，改为实际 /test/pattern.mp4 路由后通过，没有修改播放器或扩大超时。许可头部格式修正后重新构建、打包并复跑最终两套矩阵；一次 Windows copyfile UNKNOWN 失败保留，原命令重跑成功。

没有升级依赖、版本或锁文件；公开 d.ts 保持旧消费接受范围。尚未验证远端 CI、实体设备和所有插件发布。重复 loading 阶段样式注入不在此轮重新设计；native fullscreen 的五种方法映射有受控单元验证，三个本地引擎另有真实点击证据；不能扩大为实体移动设备或 WebKit video-only fullscreen 验收。回退需一起回退源码、语言构建、通知、生成产物、测试和相关文档。

BASE-I18N-01 已关闭；BASE-TYPE-09 保持开放并交 CORE-21。迁移与维护地图见 packages/artplayer/ARCHITECTURE.md。当前核心 71 个 TS 源文件，chapter 5 个；主入口仍是待 CORE-20 整合的兼容 JS 门面。本任务独立本地提交，无推送或发布。
