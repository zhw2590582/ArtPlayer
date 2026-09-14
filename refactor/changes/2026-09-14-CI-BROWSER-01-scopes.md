# CI-BROWSER-01: 源码与已安装浏览器范围

## 已复现问题

nodejs.yml 为全部 browser spec 设置 ARTPLAYER_BROWSER_ARTIFACTS。HLS、DASH、
ASR/Audio 等明确只验证源码或指定 SDK 产物，主动拒绝把它们称为已安装包检查。
用实际四包 map 运行 HLS capability 的 Chromium 用例，beforeAll 在 guard 失败，
尚未测试功能；旧报告和 trace 保留。相同环境经新 source 入口清除继承 map 后，
实际 SDK 初始化/销毁用例通过。

## 改造与保持的范围

新增严格 TS 的 browser-validation/scope.ts，负责包/测试清单、输入与输出规则。
两个薄 Playwright config 复用原三引擎/重试/超时/server配置；browser-check.mjs
校验输入、分配子进程环境，保留真实退出码/终止信号和调用元数据。新增两条 Yarn
命令，原 test:browser 不变。没有改播放器/插件生产行为、公开 API、依赖或锁文件。

source 默认保留全部 149 文件/4413 个用例；这是实际 collection 的数量，不是
4413 项测试通过。installed 包含当前 core/chapter/Ambilight/Canvas 已支持的8个
文件/225个用例，启动前核对四包安装摘要及源码/构建输入，保留未覆盖生态门槛。
两个报告目录分开，并记录局部 --grep/--project 等参数，禁止重定向报告/config
或允许零测试成功。CI 的默认命令没有局部筛选。

CI 使用两个 !cancelled() 步骤，不设置 continue-on-error；源码失败后仍运行已安装
检查保留证据，失败步骤仍导致 job 失败。报告始终上传。静态反例保护两个步骤的
存在、顺序、失败传播和各自目录。没有改变远端设置或触发 Actions。

## 验证与限制

可重跑命令、输入及结果见 [机器记录](../baselines/browser-scope-validation.json)。
原混用红例、source新绿例、全量collection和installed实际执行分别保存，不能混为
一个通过率。runner控制面测试使用真实Node子进程fixture，验证0/17退出码与环境
隔离；它们不替代真实浏览器。严格TS、lint、工作流反例、汇总测试与actionlint
分别记录。本机Playwright不代表真实移动设备、macOS Safari或远端托管runner。

全量source的4413项耗时未测，browser-smoke目前60分钟预算是否足够仍未知；需要
CI-01根据完整实测确定分片/并发，CI-04核对实际Actions取消与上传。这次不声称
整个CI或全生态发布门槛已通过。回退本任务会恢复混用配置，应保留此缺陷记录。

installed完整225项本机执行为224通过/1失败，真实失败码1由launcher保留；失败是
Chromium旧核心+新Chapter原生全屏后的hover opacity。初期进度曾误报前两引擎全绿，
最终以完整报告纠正。标题先出现后清空、opacity下降到0，鼠标坐标与全屏截图已
留存；几何/指针时序只是待证假设，不称为生产bug已修复。新增
CHAPTER-FULLSCREEN-GEOMETRY-01与PKG-CHAPTER-HOVER-01处理，不放宽断言。
该产品/测试同步问题仍阻止相关章节/完整CI验收，但不是这次输入隔离修复失败。
最终source三引擎capability检查和installed三引擎Range/产物路由检查分别3通过；
它们验证当前入口，不覆盖或替代225项中的失败。控制面/工作流/汇总50项通过。
