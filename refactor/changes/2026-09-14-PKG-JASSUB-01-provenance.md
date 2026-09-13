# PKG-JASSUB-01 来源补充与契约核对完成

本次完成来源与契约的核对步骤，未替换 vendor、WASM、字体或公开声明。原始
release/vendor/font 基线保持不变；新增独立 provenance 补充，后续源码迁移可以
基于准确的第三方边界继续。完整许可通知和未明确的字体再分发条件仍为发布门槛。

## 从本地字节到上游源代码

两份 WASM 与 11 份字体均逐字节匹配 JASSUB 历史 Pages 中的 Git blob。包括包内
WASM 两份副本、docs 默认字体副本在内，本地 16 路径均与原基线 SHA 保持一致。
检验同时计算文件长度、SHA-256 和带 blob header 的 Git SHA-1，不使用文件名猜版本。

WASM 发布提交 `747e392d7f6fe7c38bbcdfe05c9ada46b0b62daf` 明确引用源码
`6b19a04ddfbad8f9bfd3237395788dd76218841b`。该源码使用 emsdk 4.0.22、递归子模块、
普通与 MODERN 构建，工作流将 dist artifact 放入 Pages 的 jassub/assets。七个
子模块 revision 及三个构建文件的 Git blob/内容已固定。其 checked-in dist
与 nightly 产物不同，必须保留 Pages 的精确 blob，不能只给源码目录链接。

本地引入前的 Pages 快照 `25d1ea7ca1f827dbed2c8ea539c9bc917ccbfab1` 后来只更新
worker JS，保留前述 WASM。因此“wrapper/worker 对应 npm 1.8.8、本地 WASM
却不等于 npm 1.8.8”的旧观察仍成立，新的来源链解释了差异而未覆盖旧事实。
本次没有独立重建 WASM；Docker tag、apt 和 npm install 也未全部锁定。

## 通知及未决项

固定源码 LICENSE 与 WASM 所在 Pages 的 COPYRIGHT 都有精确 blob 与 SHA。
它们与原 npm 成员仅换行归一化后相同，原始字节/长度不同，分别保存指纹。
COPYRIGHT 涉及 libass、fribidi、FreeType 等组件；fribidi 的 LGPL-2.1+ 和
FreeType 完整 FTL 等通知/源码分发要求仍需在 06 落实，不能用插件 MIT 总括。

11 份字体的上游文件身份已确认。default Liberation、两份 Averia、Lato、CHAWP
仍须配齐对应完整通知；Allison、Architext、Arial、Franklin Gothic、Garamond、
Slate Pro 六份仍缺适用的再分发凭证或经过审查的替换方案。上游公开托管与字体
嵌入标志不是这些凭证，Arial 的内嵌 MIT 文本也仅指 Hebrew layout 部分。
这些结论不是法律许可确认或部署授权。

VENDOR-04/05 保持 open，保留原关闭标准，追加 PKG-JASSUB-06 / SITE-01 的明确
责任。01 的验收是核对并登记来源/通知，06/SITE 负责交付完整通知和处理发布
资产；此次不删除工作、不豁免发布条件，也不要求把第三方文件改写为自有 TS。
02/03/04 继续自有 adapter 的风险测试、结构和类型迁移。

## 验证与维护

新增 `jassub-provenance.test.mjs`，默认仅检查本地固定资产与来源/许可分类，
不需要 cache 或网络；加入 `yarn test:jassub`，现有 baseline glob 也会执行。
两个显式补充模式：

```sh
node refactor/scripts/jassub-provenance.test.mjs --cached-evidence
node refactor/scripts/jassub-provenance.test.mjs --network
```

前者要求保存的来源/下载证据存在并逐项复验，不表示重新联网。后者查询固定
commits/trees/blobs，任何请求或字节比较失败都失败，不能自动回退缓存。普通 CI
不运行这两个补充模式。无需新依赖或锁文件修改，Node/Yarn 版本保持不变。

具体运行结果及报告指纹见
[本次验证](../baselines/jassub-provenance-validation.json)。子代理另用禁用 fetch
的 preload 验证离线模式，篡改 blob/source-link 均被拒绝；这些负测日志与最终
正式文件验证分开记录。历史 48 项基线继续验证实际 vendor JavaScript、七份
实现及发布入口；它们不是原生 Worker/WASM/字幕绘制的证据。

架构、契约、第三方台账和风险 owner 同步更新。回退本次补充元数据、验证器和
脚本入口不会改变播放器行为。独立本地提交，不推送或发布。
