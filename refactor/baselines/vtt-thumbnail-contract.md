# VTT-thumbnail 历史契约

`PKG-VTT-THUMB-01` 冻结五份实际 npm 归档、34 个成员和起点
`8c57d56f1732e745a4f18f51d735d5c44a203878` 的十份工作区输入。
详见 [归档](vtt-thumbnail-release.json)。本步不修改生产代码、类型或构建产物；
目标版本仍为 2.0.0。归档逐一验证 registry SHA-512、SHA-256 和成员哈希。

| 发布版本 | 实际运行入口 | 控件与集成 | Git 关联核心 |
| --- | --- | --- | --- |
| 1.0.0 | main/legacy 正则非法，加载即 SyntaxError | 随包源码使用 thumbnails、原生 mousemove/mouseleave；只能作为 source-only 夹具 | 5.1.2 |
| 1.0.1 | main/legacy 为 CJS default 对象 | thumbnails，setBar 和移动拖动定时隐藏 | 5.1.6 |
| 1.0.2 | 同上 | vtt-thumbnail，无新增 class | 5.1.7 |
| 1.0.3 | 同上 | vtt-thumbnail，art-control-thumbnails class | 5.1.7 |
| 1.1.0 | CJS 直接函数、ESM default、脚本全局 | 同 1.0.3 | 5.3.1 |

这些 manifest 没有依赖、peerDependencies 或明确核心支持区间。Git 关联不是组合验收。
最新归档六个成员与冻结工作区对应文件按 LF 一致。所有声明均误写同步返回结果；
option 对象必填，vtt 和 style 可选，旧声明使用 export= 和 namespace，新版 default。

## 实际可用行为

- 工厂/global 名 artplayerPluginVttThumbnail；调用工厂不发请求，注册后 fetch(vtt)，
  等待 text/解析完成才添加控件，实际 Promise resolve 为仅含 name 的对象。
- URL 在请求前读取，style 在 await 后读取，因此 style 替换在请求期间仍有效。
  style 使用原对象，position=top、index=20；省略 option 异步拒绝，省略 vtt 请求空字符串。
- 时间向下取整，区间两端包含，重叠时第一个 cue 获胜；这可能使 0.9 秒的 cue 提前命中。
  sprite 坐标保留字符串，背景位置为负 x/y，按进度宽度夹住预览位置。
- 相对图片地址按 VTT URL 最后一段之前的字符串拼接，保留 ../；绝对和根路径不重写。
- setBar 的 hover 或带 event 的移动端 played 更新预览；桌面端边界隐藏。
  移动拖动替换 500ms 隐藏计时器。1.0.0 随包源码则用原生鼠标事件和 hover 隐藏。

## 已复现差异与缺陷

1. 1.0.0 两个实际入口都有 `(?:?-->?)`，无法解析。不得以有效源码冒充已发布运行产物。
2. 1.0.1–1.0.3 编译正则不接受箭头之后的空格，普通 `00:00.000 --> 00:05.000`
   会拒绝；其随包源码支持普通格式。测试的有效行为部分显式使用 compact 箭头，
   另有十二项测试分别锁定普通格式的成功或失败。不会悄悄替换 fetch 输入来掩盖问题。
   初次测试 79 项中 36 项失败正是该差异；修正历史夹具归属并增加差异断言后 91 项通过。
3. 当前解析器假设非空行从第二行起按 time/text 成对，没有检查 match、HTTP 状态，
   没有取消请求。NOTE、cue ID、坏坐标和失败响应需要 02 专门复现，不能称为已覆盖。
4. 源码没有 destroy 监听或 abort；等待 fetch 后仍会安装控件，移动计时器和 setBar 无独立清理。
   02 复现，03 划分请求、解析、视图和生命周期所有权并修复，05 验证真实核心行为。
5. 旧 CJS `.default`、异步声明矛盾和旧控件名需要 04–06 逐项验证消费者；
   不因最新形状不同而直接删除旧兼容目标，也不在契约任务中臆造类型解决方案。

历史编译缺陷、泄漏不要求候选保留；正常调用的时序、几何、参数语义应保持兼容。
涉及确实无法兼容的公开推导必须以实际旧消费者证据说明并取得决策。

## 验证边界与下一步

`node --test refactor/scripts/vtt-thumbnail-contract.test.mjs`：91 项，十二个行为夹具
（八个实际 main/legacy，三个冻结工作区 source/main/legacy，一个 1.0.0 source-only），
另测实际最新 ESM、全局、归档、声明、源码一致性和 README/demo 文件。
这些是可控 host/VM 证据，不证明浏览器渲染、实际安装或受支持核心版本范围。

真实样例为 docs/assets/example/vtt.thumbnail.js，使用本地 bbb-video.mp4、
bbb-thumbnails.vtt、bbb-sprite.jpg。样例 VTT 使用普通带空格格式；文件核对不等于
8082 示例或编辑器已通过。05/06 用 Chrome 或可用内置浏览器、真实旧/新核心、
三引擎与适用实机、仓库外安装包和在线编辑器继续验证。Windows WebKit 不等于 Safari 实机。
任务完成证据见 [验证记录](vtt-thumbnail-contract-validation.json)。
