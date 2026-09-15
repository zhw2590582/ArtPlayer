# PKG-AUTO-THUMB-13：已销毁宿主的迟到注册

基线 `9ba3c82f99e6bad0e858f6c2e1d8624dfb725c8c`。

## 问题与实现

应用保留插件 registrar（例如异步加载模块后的回调），在播放器已经 destroy 后
直接调用它，旧实现仍订阅 destroy、restart、video:loadedmetadata。旧 destroy
事件不会再次自然发生，因此新订阅没有可到达的正常销毁通知；之后若投递迟到的
元数据事件，还会创建隐藏 video。修复前两个实际核心的 Chromium 用例都记录
三个新增订阅和一个隐藏原生 video；Node 两个对应回归也失败。

入口在访问订阅或创建 session 之前读取公开 isDestroy，已经销毁时直接返回原有
名称对象。函数仍为 async，返回 Promise，没有新增拒绝、公开方法或结果字段。
内部 ThumbnailHost 的标志为可选，保留没有此字段的结构化旧宿主；false/缺省
宿主仍可完成 JPEG 抽帧、发布和清理。没有修改核心 plugins.add 的已有拒绝策略，
也不把本修复描述成允许该方法在销毁后继续工作。

仅修改入口与内部宿主类型，资源生命周期仍由既有 session/extraction 模块负责，
无需引入新抽象或依赖。API-05/06 的失效实例资源边界得到保护，API-09/11 的
公开声明、default 别名和分发入口保持不变。包 README 与架构说明同步更新。

## 测试、产物与工程入口

Node 24.21.0、Yarn Classic 1.22.22、TypeScript 5.9.3，Windows。

| 范围 | 结果 |
| --- | --- |
| 修复前四项 Node 回归 | 2 pass / 2 fail：残留三个订阅、访问不可用的销毁宿主成员 |
| 修复前真实核心 Chromium | 0 pass / 2 fail：新旧核心均新增订阅和隐藏 video |
| 完整 test:auto-thumbnail 源码/历史/类型集合 | 193 pass |
| 重建 main / legacy 的 auto-thumbnail-* 单元文件 | 各 88 pass |
| main 三引擎浏览器 | 42 pass / 0 skip / 0 retry |
| legacy 三引擎浏览器 | 42 pass / 0 skip / 0 retry |
| 包严格 TS、docs-tools TS、scoped lint | 通过 |
| 浏览器运行入口测试 | 18 pass |
| Yarn 严格工具链 | 通过 |

每个产物的 42 项包括六项实际新旧核心迟到注册，另 36 项已有原生资源/像素测试
使用受控插件宿主，验证元数据等待、抽帧/编码取消、成功 JPEG、别名和清理。
没有把所有 42 项称为完整真实核心组合。浏览器版本为 Chromium153.0.8010.12、
Firefox155.0、Windows WebKit26.6。新用例只观察订阅，不替换原生视频/抽帧方法。
故意投递元数据后记录资源，最后补发 destroy 清理修复前复现，不依赖重复
art.destroy() 自动清掉迟到资源。正常解码/编码仍由原生事件完成。

WebKit 无帧回调的既有两项像素用例继续只验后面三格，首两格仍是诊断；
AUTO-THUMB-PIXEL-01 不关闭，没有放宽原断言或新增跳过。

`yarn build artplayer-plugin-auto-thumbnail` 重建 main、legacy、ESM 及 docs/compiled
对应副本，未手改产物。test:unit 与 test:auto-thumbnail 加入新 Node 用例；
source 自动收集新 browser 文件，installedTests 显式加入它，入口测试和类型通过。
本轮实际浏览器使用重建 main/legacy，不声称执行了新的 tarball 安装测试。
既有安装 map 因生产源码改变需要重新打包生成，不能继续当作当前候选证据。

计划初次把未完成子任务追加到 doing 的03时被依赖校验拒绝，改为让 todo 的05
同时依赖03及本任务，保留全部旧依赖。没有绕开校验或提前将子任务标完成。
最终计划、风险、风险负例与提交审计必须通过。

精确输入、失败/最终报告及文件哈希见
[auto-thumbnail-registration-validation.json](../baselines/auto-thumbnail-registration-validation.json)。

## 状态和回退

关闭 AUTO-THUMB-REGISTRATION-01；PKG-AUTO-THUMB-03 的原生首帧问题、05 的设备/
组合、06 的安装与发布仍未完成。新增本任务后完成数 212，进行中21，待办43，
共276。没有修改包版本、Yarn 锁或依赖，没有推送、部署或发布。

回退本独立提交可同时恢复入口、内部类型、测试、构建文件及维护记录。
