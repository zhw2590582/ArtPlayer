# SITE-07 vConsole 可复现来源与完整通知

## 结果与依据

vConsole 3.15.0 的历史 LICENSE 声称附带 MIT 全文，实际没有正文。发布 bundle
及固定构建配置明确引用 MIT 原文。保留旧 LICENSE，另补 MIT-LICENSE 和署名说明，
明确它们是 ArtPlayer 补充整理的文件，不伪称从 Tencent 归档逐字复制。
依据为[发布脚本](../../scripts/site-vendor/vconsole/upstream.js)头部以及其引用的
[MIT 原文](https://opensource.org/license/mit)。

从固定提交 05d80398bae35e793774f74e3c052b4e530e293a 取得 81 份源文件/配置，
逐个验证 Git blob ID 和 SHA-256。在 ignored cache 用原始 package-lock.json
执行 npm ci --ignore-scripts --no-audit --no-fund，安装 520 包、退出 0。
这是上游历史重建，不改变 ArtPlayer 的 Yarn 1.22.22、根 yarn.lock 或依赖。
源码 archive 主机 DNS 失败后改用固定 raw 路径，没有用其他版本代替。

构建结果 282,381 字节，与原始 npm bundle **逐字节一致**，SHA-256 为
671f47427e1e3048919147c765e9fb71e4ea40d79a8c2829089f499d3e9b9bf4。
首次 stats 隐藏 orphan/runtime 分组，不能据此声称完整。改为不分组且不截断，
取得 326 条模块记录：八个依赖及 webpack 的四个 bootstrap 模块；从实际 resource
识别，排除了只出现在 loader 链的 less-loader。原始锁文件版本、重建字节和
模块路径共同建立来源依据，不仅凭 dependency 字段猜测。

九个组件的 npm 归档均按固定 SRI 校验，保存完整原文。mutation-observer 的
Automattic/Polymer Authors 两份 BSD 通知均保留；其余组件 MIT 各自署名保留。
固定证据和重跑输入见[来源记录](../baselines/vconsole-notices-provenance.json)。

## 实现与验证

- 原 notice 生成流程增加 vConsole 九个组件及补充文件；CLI 拒绝漏掉已核实组件、
  原始 LICENSE、补充 MIT 或署名。全部站点通知现在是 19 个输出（18 份文本加索引）。
- 新增 TS 重建校验入口：固定输入及依赖版本检查、精确 bundle 比较、不截断模块
  清单核对，脚本名 verify:vconsole-source。只在 cache 重建，不触碰站点 patched bundle。维护方法见
  [vConsole 模块说明](../../scripts/site-vendor/vconsole/README.md)。
- 正向重建验证通过；改动冻结源码和使用 cache 外目录的两个实际负例均在构建前
  拒绝，产物未被重写，注入的源码改动已恢复。没有运行上游安装脚本。
- notice、vConsole 生命周期和 Pages 资产测试最终 17/17，559.57ms；新增 CLI 负例
  要求删除任一核心通知或 webpack 组件在写出前失败。strict docs-tools、
  scoped lint、check:vconsole、build/check:site-notices 通过。
  首次 lint 的数组换行和 require 后空行问题已修正并重新检查。
- 扩大到全仓 lint 后发现未改动的 VAST package.json 键顺序错误，以及已有生成
  声明的 unused-disable 警告；本批 scoped lint 通过，全仓 lint 本轮退出 1。
  键顺序错误单独作为后续工程修复提交，不把全仓检查写成通过。
- 三种真实浏览器移动页面 3/3，包含日志、真实本地媒体播放、销毁、全部 18 份通知
  HTTP 原文、原字体指纹和索引。具体版本、报告及退出状态见
  [验证记录](../baselines/vconsole-notices-validation.json)。未重跑全站、全包安装矩阵。
- 原构建保留 size/entry/performance 和旧 Browserslist 警告，不为消除历史警告更新
  锁文件或改变发布内容。站点 vConsole 的本地生命周期补丁及 JS 字节保持原样。

## 状态与后续

VENDOR-07 的本版本来源/完整通知缺口据上述证据关闭；SITE-07 仍 doing。
Monaco 全组件通知、console.js 来源、其他字体与样本仍需处理，不扩大为全站许可
放行。物理设备、远端 CI/Pages/npm 和多轮发布审查保持独立门槛。

本批为 SITE-07 本地检查点提交，未推送或发布。回退仅还原补充通知、manifest、
生成输出、校验和文档，生产 JS 无需回退。后续继续 console.js 可复现来源/替代。
