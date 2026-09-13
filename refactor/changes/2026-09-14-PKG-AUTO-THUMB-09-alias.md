# PKG-AUTO-THUMB-09 历史 default 工厂别名

从 04/06 的历史导出兼容工作拆出独立修复；04 仍等待 03、08 与本任务。
基线为 `c4f5dcf17f9efb5f96fa752aef43bc8b00d0615b`。不变更默认抽帧算法、参数
读取、Promise 注册时点、错误通道或任何已完成的资源清理。

## 修复与类型

实际 npm 1.0.1 main/legacy 的 CommonJS 值为 `{ default: factory }`，调用方式
是 `require(name).default(option)(art)`；1.1.0 改为直接函数，之前候选同样没有
default，因此该旧调用失败。新增两项受控回归先在旧候选失败、修复后通过。

入口给原函数直接赋值 `factory.default = factory`。直接/default/default.default
都是同一函数；属性为可写、可枚举、可配置，不额外包装 registrar，不复制状态，
不会因提供两种入口而订阅两次。main/legacy/ESM/global 共用该实现。外部消费者
的稳定插件标识仍为注册结果中的 `name: 'artplayerPluginAutoThumbnail'`。

根声明保持 npm 1.1.0 原字节与旧提取/替代关系；不向旧根 callable 强加必填
default。08 新增的 `/runtime` 现用 `RuntimeFactory` 描述真实递归别名，同时
保留 08 的纯调用 `Factory` 类型，普通 async 替代函数仍能赋给 Factory。
实际函数赋值即可推导递归属性，并由 implementation fixture 同时验证两种公开
类型，不需要类型断言。README/ARCHITECTURE 已更新；08 的原验证记录保留为
当时没有别名的历史快照，不作为当前产物的验证报告。

## 验证与边界

结果及实际构建、安装、浏览器指纹见
[验证记录](../baselines/auto-thumbnail-alias-validation.json)。

- 受控 direct/global 别名身份、属性描述符、Promise 注册、渐进输出和清理，
  加上原帧/画布/生命周期回归，覆盖源码与正式 main/legacy。
- 实际安装 1.0.1 的 main/legacy，核对 default 调用、ESM 导入 CJS 的 namespace
  形状和 Promise。1.0.0 安装后仍明确复现 main/legacy 缺文件，未以源码冒充
  可用分发。候选安装验证 root/legacy/runtime 的别名与共享函数身份。
- 旧 1.1.0 与候选的十组编译配置、候选三组 no-interop；根声明精确类型保留，
  runtime 正反例包含 alias 递归与缺失别名的替代函数。此处不是对所有历史
  1.0.x `export=` 类型消费者的完整认可，TYPE-01 和后续 04 仍保留。
- 提交的原生浏览器生命周期套件新增 `alias-complete`：实际通过脚本全局别名
  注册、HTTP 视频抽帧、JPEG 更新与 decode、最后清理。使用受控 ArtPlayer
  宿主；完整核心组合、物理设备与首帧像素准确性仍由后续任务验证。

中间受控测试误用 Set.length，修正为 Set.size。初版 Object.assign 递归断言在
严格源码检查失败，改为可直接推导的属性赋值，而不是添加 unknown 双重断言。
源构建测试一度错误地把未压缩函数名当作正式产物的 Function.name；核对基线
main/legacy 后确认原来也是压缩产物（其 Function.name 为空）。该断言改由真实
公开注册结果的 name 及导出入口身份覆盖；这不表示函数的压缩内部名字相同。
测试不要求 minifier 内部标识符稳定，也未因此改动 minifier 或扩大构建目标。

本项关闭的是实际 JavaScript 调用形式的缺口；历史完整类型形状、分发路径、
AUTO-THUMB-PIXEL-01 与设备验证未被豁免。没有新依赖、版本变化、推送或发布。

## 回退

独立 revert 本提交即可移除别名及相应准确类型/测试/文档，保留 08 的 runtime
入口和 07 的画布清理；旧 1.0.1 default 调用会重新失效。之后继续 03 的真实
抽帧像素和资源边界，再由 04/05/06 完成整体迁移与验收。
