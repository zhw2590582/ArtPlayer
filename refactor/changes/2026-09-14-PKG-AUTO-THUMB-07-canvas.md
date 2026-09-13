# PKG-AUTO-THUMB-07 私有抽帧画布清理

状态：该独立任务完成；PKG-AUTO-THUMB-03 的剩余工作继续。

从 PKG-AUTO-THUMB-03 的资源审查拆出独立修复；基线为
`e93d3cbb67a937a94e3979f36efe16ee39cadb33`。03 增加对 07 的完成依赖，原来的
WebKit 首两格像素、公共类型和后续完整包验收范围保持不变。

## 已复现问题与实现

抽帧任务只清理隐藏 video、监听和定时器，没有主动清空已分配的私有 canvas。
编码回调或宿主观测保留该 canvas 时，任务完成/取消后其整张表的尺寸仍然存在。
六项受控回归在基线全部失败；冻结正常 main 产物的原生完成用例也保持 800×45，
未达到清理预期。这里确认的是可观察的画布尺寸/像素存储生命周期，不是测量泄漏
了多少系统 RAM/VRAM，也不声称浏览器永远不会回收不可达对象。

`src/extraction.ts` 在创建 canvas 后立即将宽、高复位加入 job 的既有资源清理。
两个动作独立执行，任意一个抛错仍继续另一个以及 decoder 清理；正常完成、
destroy、restart、提取失败复用同一条清理路径。尺寸赋值后重新核对 job 身份，
避免用户覆写的 DOM setter 同步销毁任务后又分配下一维度。没有引入新抽象、
共享全局状态、依赖或公开配置。

编码后的 JPEG 是独立 Blob，保留既有最终预览 URL，不因清空 canvas 撤销它。
后续任务拥有自己的新 canvas，旧回调不能发布或重新分配旧任务的画布。
宽高归零不保证异步编码器或 GPU 驱动已经归还全部底层内存；它不代替整体预算
或浏览器耐久测试。

## 兼容边界与测试

工厂/异步注册结果、原始配置及可强制转换数字、number 的分数行为、目标时间公式、
更新次数、JPEG MIME、URL 所有权、错误通道和公开声明均不变。仅更改不可通过
插件 API 取得的内部画布终态。ARCHITECTURE.md 随源码同步资源归属。

新增 `test/auto-thumbnail-canvas.test.js` 覆盖保留编码回调时 destroy/restart、
正常完成后仍持有预览、context 失败、单个 reset 抛错，以及分配中的销毁重入。
已加入 test:unit/test:auto-thumbnail。首次联合 160 项为 159 通过/1 失败：旧
数字兼容测试在完成后检查 canvas 宽度。现在在抽帧开始时检查原尺寸计算，并
额外要求完成后归零；未删除原配置透传和次数断言。修正后联合 160 项通过。
初次定向 lint 的单行语句格式错误也已修正。

真实浏览器生命周期用例保留 canvas 引用和原生 Blob/帧回调，验证三引擎中各
终止路径尺寸为零；完成时通过最终 URL 解码 JPEG，确认其仍为 800×45。使用
受控播放器宿主和保留的原生回调，不能称为全部核心组合/未经拦截的生产时序。
现有像素用例同时回归：有原生帧回调时仍要求五格准确，Windows WebKit 的前两格
仍为诊断、只验收后面三格，AUTO-THUMB-PIXEL-01 不因本修复关闭。

正常 main/legacy/ESM 经仓库 build 再生，docs 副本来自构建；公共声明与包版本
未变。具体命令、基线/候选 hash、源码和产物回归、原生报告及范围见
[验证记录](../baselines/auto-thumbnail-canvas-validation.json)。原失败及第一次
159/1 中间结果保留在缓存日志；机器摘要保存关键结论与指纹。

最终联合 160 项、main/legacy 各 58 项受控检查通过；main/legacy 各 21 项三
浏览器检查通过（每组 15 生命周期、6 像素，后者保留既有 WebKit 局部范围）。
严格包 TS、定向 lint、固定 Yarn 工具链和 ESM 原生导入通过；三种正式构建与
docs 副本逐字节一致。只关闭 AUTO-THUMB-CANVAS-01 的可观察画布终态缺陷。

```sh
yarn test:auto-thumbnail
node node_modules/typescript/bin/tsc -p packages/artplayer-plugin-auto-thumbnail/tsconfig.json --noEmit
yarn build artplayer-plugin-auto-thumbnail
yarn test:browser test/browser/auto-thumbnail-lifecycle.spec.js test/browser/auto-thumbnail-pixels.spec.js --workers=1
```

通过 ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT 分别选择 main/legacy，归档共享报告后再
运行下一组；未设置该变量则测试源码编译结果。没有重复执行全部无关包测试或
全仓安装类型矩阵。07 只负责该独立资源缺陷，不等于 03-06、包大版本升级、
远程 CI 或发布验收完成。回退本提交并正常重建即可恢复原画布终态；不 push/publish。
