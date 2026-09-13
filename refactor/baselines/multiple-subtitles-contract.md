# Multiple-subtitles 历史兼容契约

任务 PKG-MULTI-SUB-01。输入固定在 Git `0c5bb2bd7ac6d76b0b5f42dcdfb71ccdb31fb8d5`，
包括源码、声明、README、三个产物和 multiple.subtitles demo，共 9 份输入。
真实 npm 1.0.0、1.1.0、1.2.0 共 20 个成员逐项保存 SHA-256，归档验证 registry SHA-512。
下载来源、版本和完整成员见 [发布记录](multiple-subtitles-release.json)。三个历史 gitHead
关联的核心分别为 5.1.2、5.1.7、5.3.1；这是历史关联，不是全部已支持核心范围的证明。

| 维度 | 冻结事实 |
| --- | --- |
| 工厂 | artplayerPluginMultipleSubtitles({ subtitles = [] })；整个参数不能省略，JS 可传 {} |
| 加载 | 异步注册；并行 fetch 全部 URL，arrayBuffer 后按 encoding 或 utf-8 解码 |
| 转换 | type 优先于 getExt(url)；vtt 原文，srt/ass 使用核心转换器，其他扩展名产生空字幕文本 |
| 解析 | WebVTTParser metadata 模式；parser 各轨排序，不代表合并后按全局时间排序 |
| 1.0.0 合并 | 按 cue 数组下标把后续轨文字拼入首轨对应 cue，保留首轨时间 |
| 1.1.0 起合并 | 依次连接各轨 cue 数组，保留每轨自己的 cue 时间 |
| 样式 | 每轨顶层文本写入 art-subtitle-{name} div，reset 不重复套 div |
| 返回值 | Promise 最终结果有 name: multipleSubtitles、tracks(names = [])、reset() |
| 切换 | 按 name 查找并按调用者顺序输出；tracks() 或 [] 清空；reset 恢复初始轨顺序；不重新 fetch |
| 更新 | setTracks 返回 undefined；每次先 revoke 旧 URL，再创建 text/vtt Blob URL，调用 subtitle.init |
| 配置 | 永久把 art.option.subtitle.escape 改为 false；init 继承调用时 subtitle 配置，覆盖 url/type/onVttLoad |
| onParser | 三个版本都在声明中出现，但已执行的真实工厂没有调用它 |
| 类型 | subtitles 数组在声明中必需、其条目的 url/name/encoding 可选；声明没有 Promise、tracks/reset |
| 旧导出 | 1.0.0/1.1.0 实际 CommonJS 为含 default 的对象，声明却使用 export=；都有脚本全局 |
| 新导出 | 1.2.0 实际 CJS 直接函数，ESM default-only，声明使用默认导出；新增 exports/legacy 路径 |

## Parser 来源与保留范围

固定比较源为 [w3c/webvtt.js 的 380cfcce 修订](https://github.com/w3c/webvtt.js/tree/380cfcce34ba8b472d3a31474874eb72a0e5f460)，
该修订 package.json 的 version 为 2.1.2，不能把它误称为已验证的 npm 2.1.2 归档。
原始文件和指纹在 [来源目录](multiple-subtitles-vendor/sources.json)。当前本地 parser 只
改变 IIFE/global 导出为 ESM 导出、增加 eslint 说明并格式化；剥离这组明确适配后，
esbuild 规范化的完整执行代码相同。两个旧 npm 包保留 IIFE/exportify，经过同样边界比较
后也一致。历史真正下载时使用的 commit 没有直接证据，此修订是固定比较源。

原始 CC0 头保留，完整 dedication 放入包内 THIRD_PARTY_NOTICES，由现有构建脚本放入
main/legacy/mjs 独立文件头。parser/serializer 的 metadata、实体、样式、cue 0、排序和
无效 timing 输入与固定上游对照。此项不声称所有 WebVTT 浏览器渲染或设备已经验收。

## 复现与后续任务

`yarn test:multiple-subtitles` 验证 53 项：9 份实现的 45 个正常行为、6 个发布契约、
2 个 vendor/分发测试。源实现与实际 main/legacy 候选还分别执行 5 项正常调用回归。
converter stub 只证明调用/类型选择，不等于验证实际 SRT/ASS 解析正确性。
实际 ESM 验证入口及空轨注册，不能当作真实视频字幕显示验证。

02 继续复现错误、编码、重叠/空轨、失败和切换；03 负责拆分及请求/URL生命周期；
04 负责公开类型差异，05 负责原生核心/字幕/设备组合，06 负责安装消费者和实际 demo。
源码目前缺少 fetch 取消及 destroy 的最后 URL 释放，仅从源码观察，未计作已修复。
未知名字、轨道长度不等、HTML 样式节点、宿主失败等还需 02 系统复现。
