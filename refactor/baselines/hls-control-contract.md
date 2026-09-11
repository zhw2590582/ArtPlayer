# HLS control 1.1.0 迁移契约

PKG-HLS-01，2026-09-11。发布依据是 [冻结归档记录](hls-control-release.json)，源码依据为
adec20213f00375b16231e616d1e249a12ffd345，示例为 docs/assets/example/hls.control.js。
运行 `node refactor/scripts/hls-contract.mjs` 重验，不随迁移覆盖历史指纹。

## 发布与来源

固定 npm artplayer-plugin-hls-control 1.1.0：SHA-512 SRI、SHA-256、六个成员及各成员摘要均已验证。
README、package.json、声明经 LF 归一化与该提交相同。TypeScript 5.9.3 提取 uniqBy 和
artplayerPluginHlsControl 后用 esbuild 0.27.7 归一化，两边 SHA-256 同为
`b22a09f4de5b56005c5122014624d76a91410e9517889d3e7b1c70b8efb2b554`。
比较不含 SVG 字符串或 bundler 包装，不等于用现有工具链逐字重建所有发布文件。

查询时 registry 列出 1.0.0、1.0.1、1.1.0，latest 为 1.1.0；时间与 URL 保存在 JSON。
登记的 gitHead daf133b22630b4a0eecfa3336bbddab0e9119d96 对应包版本 1.0.2，不能当作
发布源码证明。计划版本 2.0.0，发布前另查版本占用。旧版行为以 tarball 为准。

## 公开边界及测试入口

| ID | 当前行为与兼容要求 | 后续覆盖 |
| --- | --- | --- |
| HLS.factory | default/global 为 artplayerPluginHlsControl；工厂默认参数 `{}`，返回同步注册函数 | HLS-02 各格式消费、无参调用 |
| HLS.result | 注册返回 `{ name: 'artplayerPluginHlsControl', update }`；update 无参、同步返回 undefined | HLS-02 返回与键集合 |
| HLS.binding | 注册捕获 template.$video；每次 update 检查 art.hls.media 与它同一引用，失败通过 errorHandle 抛出 Cannot find instance of HLS from "art.hls" | HLS-02 缺失/外部媒体/替换实例 |
| HLS.schedule | 注册时不执行 update；订阅 ready 和 restart，外加公开手动 update；未订阅 Hls SDK 事件 | HLS-02 调用顺序；HLS-03 补同步与解绑 |
| HLS.option | quality/audio 均可选，子项 control/setting/title/auto/getName；两个显示开关默认关闭，update 仍验证 Hls | HLS-02 默认、单独和同时启用 |
| HLS.quality | 标签取 name 或 height 加 P；按标签保留第一个，按原索引倒序；最后追加 Auto value=-1；选中项依据 currentLevel | HLS-02 重复/排序/Auto/manual |
| HLS.audio | 标签取 name/lang/language；按标签保留第一个并维持原顺序；value 为 track.id，不附加 Auto 选项 | HLS-02 标签/排序；HLS-05 实际分组轨道 |
| HLS.label | title/auto 使用逻辑或默认值；当前标签 getName(item) 在列表 getName(item,index) 之前执行；普通函数调用，无 art 上下文绑定 | HLS-02 参数数目、对象身份、回调异常 |
| HLS.select | 先写 currentLevel/audioTrack，再 notice，再按开关 controls.check/setting.check，返回 item.html；不返回 Promise | HLS-02 顺序、值和引用 |
| HLS.ui | 名称 hls-quality/hls-audio；control 在 right，padding 0 10px；setting 宽 200、原 SVG 图标、title 与 tooltip；两处共享 selector/onSelect | HLS-02 对象形状；HLS-05 真 DOM |
| HLS.owner | Hls 由消费者创建/销毁；插件没有公开 destroy，不拥有媒体实例；旧实现没有自身销毁/SDK 解绑逻辑 | HLS-02 销毁观察；HLS-03 整理资源归属 |

uniqBy 对 undefined 标签不去重；重复标签留下首条，可能移除实际选中的重复条目。
getName 错误同步传播；质量 UI 可在音轨更新失败前已经提交。不在重构时未经说明改成
异步回调、绑定 this、克隆 SDK 输入项或全局吞掉异常。

保留根入口和 /legacy 的 exports 条件、main/module/types/legacy 路径与全局名。
包没有 Hls 或核心 dependency/peerDependencies 最低版本声明，不新造最低版本，也不宣称
任意旧版本都兼容。旧核心 5.4.0 与当前核心的四组合须由 HLS-05 实测；这里只冻结待验证范围。
示例绑定 Hls.js 1.5.17，此版本是首个 SDK 实测基线，不是已证明的最低/最高支持版本。

## 声明、示例与设计差异

| 观察 | 依据与边界 | 处理任务 |
| --- | --- | --- |
| 工厂 option 声明必填，运行时可省略 | 局部 Config 未按名称导出；只导出 default | HLS-02 类型复现，HLS-04 兼容修正 |
| getName 声明只接受 object，漏了列表索引 | 当前标签只传一个参数，所以未来索引应可缺省；不能声明总是 number | HLS-02 消费样例，HLS-04 类型 |
| /legacy 缺少旧解析器 typesVersions fallback | exports types 存在不代表 TS 4.3 node 解析可用 | HLS-04/06 解析矩阵 |
| 空 levels/audioTracks 直接返回，关闭显示开关也不删除旧菜单 | 静态可见缺少 controls.remove/setting.remove | HLS-02 复现，HLS-03 修复 |
| 保留旧 selector 回调仍写旧 Hls | 回调捕获上次 update 的实例；公开 update 则读取新 art.hls | HLS-02 复现，HLS-03 限制过期回调 |
| Auto 依据 currentLevel，未使用 autoLevelEnabled | 不能仅用 currentLevel=-1 的 stub 代表实际 ABR；真实播放档位与手动策略分别取证 | HLS-02/05 SDK 实测，HLS-03 改进 |
| 音轨当前标签以数组索引取值，选择值用 id | 不仅凭两种写法不同就认定真实 SDK 错误，须验证 Hls 分组后的 id/index 关系 | HLS-02/05 |
| 示例原生 HLS fallback 未提供 art.hls | customType 中只赋 video.src，插件仍安装；ready 校验可能抛错 | HLS-05 浏览器取证与示例修复 |
| 示例每次切源注册新的 destroy 回调 | 重建时已销毁旧 Hls，旧闭包仍被保留 | HLS-05/06 生命周期及示例修复 |

README 目前仅简介、demo、许可，不能从中推断未声明的行为。示例同时启用两个菜单，使用
level.height 和 track.name 回调以及远程 HLS；后续用本地多档位/多音轨样本补确定性验证。

本步只核对来源和契约，没有生产代码变更、SDK 播放或浏览器验收。后续结构规划是把选择项
映射、核心 UI 提交/删除、SDK 状态与订阅、公开兼容入口分开；实际实现地图随 HLS-03/04
写入包内 ARCHITECTURE.md，不把未实现的设计写成当前架构。
