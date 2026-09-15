# SITE-07 Monaco 四种语言模式来源与编辑器集成

修改前 HEAD：99c208aeee331eec2d9ffa9bb15a608fdc17a840。
Thumbnail 默认策略仍待用户选择，本批不改变该包的配置。

## 本批实现

新增四个 mode bundle 的固定来源记录及可重复执行脚本。六份 npm 归档、23 份
固定 Git 文件包含构建配方、配置、14 个 Monaco TS 模块与六个依赖源码；另有
两个包别名。CSS/HTML/JSON/TypeScript 分别有 5/5/12/4 个模块实例。复用全片段
检查覆盖辅助代码和模块之间所有非空白字节，不只比较 AMD 模块名。
四个完整压缩产物均与当前站点逐字节相等。

抽出 compiler.ts 统一固定 TypeScript 4.4.4 发射，保持原标准库与各包 strict
配置。JSON tokenization 使用 jsonc-parser 3.0.0 原始声明解析 const enum；孤立
编译保留属性访问不能复现旧产物，因此不能手工替换数字。解析器仅允许显式
传入的声明，不意外读当前工作区依赖。仍不声称已恢复上游完整语义类型检查。

AMD 模块名增加合法 lib.index 支持，继续拒绝路径遍历段。新反例验证错误枚举
声明会导致复现失败；此前 TypeScript 源转换和缺失模块/额外辅助代码测试保留。
共享编译器改动后重跑全部三个语言 worker 源码及压缩复现，保持精确相等。

jsonc-parser 与 vscode-languageserver-types 的 notice 资产绑定扩大到模式文件。
这两包原有完整许可已随站点交付，没有新增或改写 notice 正文。站点依然有
81 份 notice 加一个索引。Monaco 运行代码、旧 URL、根依赖和 yarn.lock 未变。

## 实际编辑器验证

新增 editor-modes.spec.js 使用真实 Monaco editor，通过自动模式加载和 provider
注册检测 CSS/JSON/TypeScript 错误，再改成合法代码等待诊断清空。调用编辑器的
文档格式化 action 验证 JSON/HTML 输出分行且内容保留；四个 mode 请求必须成功。
同一个编辑器依次切换模型，最后销毁并检查旧模型诊断被清理。

早期测试读取了不属于 0.30.1 的 getModeId；对照该包原始声明后使用 getLanguageId。
这是测试元数据接口修正，没有改生产逻辑或放宽诊断/格式化断言。

三引擎 3/3 通过，无重试/跳过；15/15 单元、严格 docs-tools 类型与相关 lint
通过。来源复现、网络尝试和浏览器环境见
[验证记录](../baselines/monaco-modes-validation.json)。网络首次请求出现 npm DNS
ENOTFOUND，保留失败记录；缓存离线验证不被冒充为首次联网成功。

SITE-07 doing / VENDOR-06 open，整体仍 199/265。Monaco editor-core、基础语言
定义及其余上游来源细节继续审查，物理设备/外部 SDK/远端 CI/三轮复盘门槛
未完成。回退本批脚本、绑定和测试即可，运行资产未改。独立本地提交，不推送、
不部署、不发布，也不替用户决定 Thumbnail 默认行为。
