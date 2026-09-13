# PKG-AUTO-THUMB-03 内部严格TS检查点

本检查点推进内部代码维护，03仍doing；公开声明和类型分发仍属04。没有降低
首帧像素要求，也没有将WebKit的早期帧诊断计入完整像素验收。

## 改动

原有六个职责模块index/options/session/extraction/video/frames迁为TS，新增types.ts
集中描述任务所有权、guard参数/返回、完整图集配置和最小宿主。新增分包严格配置，
不启用allowJs/skipLibCheck，不引入any兜底；沿用现有构建的JS/TS共存能力。
公开types/、入口/版本/依赖不变，注册仍为异步Promise，抽帧在后续metadata进行。
分包tsconfig仅用于仓库实施检查，加入.npmignore，避免发布引用仓库外fixture的配置。

数字字段只作名义类型标注，没有加入运行时归一化、转换或额外getter读取；旧JS
可转换字符串/小数输入、原始width/number/scale向宿主转交及读取时序继续由既有
用例保护。URL集合不接受undefined，timer清理排除尚未取得的null句柄；有效0
句柄和取消中重入保持原有行为。

新增真正使用核心公开Artplayer类型的源码接入fixture。最初最小宿主错误要求
已存在的thumbnails配置所有字段必填，编译报TS2345（height可为undefined）。
修正为宿主允许既有部分配置，而job.publish产出的ThumbnailSheet仍完整必填；
最终分包严格检查包含该fixture并通过。没有修改核心或插件公开声明来迁就内部类型。

## 验证与限制

源码联合154项通过，其中52项当前生命周期/帧读取、102项历史契约与缺陷记录；
main/legacy各52项候选单测通过。源码/main/legacy各21共63项浏览器通过，0重试/
跳过；有原生帧回调时五格像素严格断言，无回调路径的前两格仍是诊断，不关闭
AUTO-THUMB-PIXEL-01。三格式正常构建和docs副本一致。新源码lint及分包严格TS通过。
Yarn实际pack的七个文件通过分发入口检查，无src或tsconfig泄漏；此检查不替代安装消费验收。
全仓类型流程通过398个生产TS及旧/新编译器消费者；其后新增的最终宿主接入fixture
又由分包严格检查单独验证。完整插件公开声明/安装包兼容仍待04及后续分发任务。

重跑：`yarn test:auto-thumbnail`、
`yarn exec tsc -p packages/artplayer-plugin-auto-thumbnail/tsconfig.json --noEmit`、
`yarn build artplayer-plugin-auto-thumbnail`；浏览器运行
`yarn test:browser test/browser/auto-thumbnail-lifecycle.spec.js test/browser/auto-thumbnail-pixels.spec.js --workers=2`。
以ARTPLAYER_AUTO_THUMBNAIL_ARTIFACT逐个选择main/legacy，必须等待终态并归档报告。
机器结果见[内部TS证据](../baselines/auto-thumbnail-internal-types.json)。

03继续处理缺少原生帧回调时的首帧和其余资源边界；Mask03同时进行但文件和提交
独立。本检查点可回退六个模块和新增类型/config/fixture，再正常构建；不推送或发布。
