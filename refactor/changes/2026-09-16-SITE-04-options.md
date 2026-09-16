# SITE-04 构造配置与初始化边界

起点：`8d2ec199d7873491c88da155dbbb4e86c151bbe1`。本批继续实施期文档核对，
SITE-04 保持 doing；不进入用户保留的三轮正式复盘。

补齐双语基础配置指南：容器与 useSSR、构造与 ready 的区别、默认值和合并归属、
schema/validator/kindOf、媒体属性与存储音量的覆盖顺序、平台功能开关、quality
标签与初始 URL、缩略图/字幕真实默认值、customType 与 proxy 的责任、分阶段
TypeScript 回调视图。原 thumbnails/subtitle 默认值从空对象纠正为实际结构。

历史行为继续保留：volume:0 跳过初始化写入；保存音量随后覆盖输入；false 配置
不撤销 moreVideoAttr 的真值；非空 theme 优先于初始 cssVar；quality.default
不更换初始 URL；proxy 虽有旧 undefined 类型但运行时拒绝；构造 schema 的
quality.html 要求字符串。文档描述实际边界，没有修改运行时或静默收紧旧类型。
所有 106 个原有 Run Code 片段逐字不变，新增两份严格类型样例。

新增 93 条声明映射，累计 720/963，243 条仍待核对。覆盖根与 runtime 的
构造、Option/OptionInput、Thumbnails、静态配置校验入口和实例 option。
此前各组源码与指南哈希全部保持不变。另记录现有 option-validator 2.0.6
源码哈希以支持校验器语义；没有新增或升级依赖。

Node 24.21.0 / Yarn 1.22.22 下，135 项相关测试通过，0 失败/跳过，2647.1053ms。
VitePress 构建 12.77 秒，Yarn 整体 15.46 秒；LLM 生成/检查、inventory 与 demo
检查通过。两份 strict/NodeNext 样例和全部 106 个片段的语法/内容比对通过。

Chromium 153.0.8010.12、Firefox 155.0、WebKit 26.6 各 34 项断言通过，包括
默认对象独立性、合并引用、缺失/非法容器、显式 undefined、回调执行阶段、
同步失败回滚、SSR 保留原生 video、音量/主题优先级、直播控件、quality 延后
安装及本地 MP4 customType/ready。双语页面共 6 组页面检查、24 次示例转发，
每页仅转发前四个；中文截图目视检查通过。

浏览器使用当前 startDevServer 的隔离 8083 服务，未依赖旧 8082 进程。
本批不代替全部示例、手机手势、AirPlay/Cast、外部 SDK、codec 或发布验收。
输入指纹、日志和实际断言见[报告](../baselines/site04-options.json)。21 库候选
build 证据仍有效，其他发布门槛不变。没有推送或发布；回退本提交仅恢复文档、
映射和相应生成内容。下一步继续播放属性、CSS 变量及剩余实例接口。
