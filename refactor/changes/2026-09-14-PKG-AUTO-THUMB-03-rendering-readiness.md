# PKG-AUTO-THUMB-03 渲染与首帧等待对照

状态仍为 doing。这是排除候选原因的检查点，没有修改生产抽帧算法，没有将
AUTO-THUMB-PIXEL-01 或包迁移标为完成。起点为
`f30c701d88b3c5210b7fa6ddb024b55eeeaf8206`。

已有 opacity 探针同时把 video 缩成 1px，不能单独回答完整尺寸隐藏方式的影响。
本次保持实际 320×180 媒体尺寸，分别使用 visibility:hidden、opacity:0、
clip-path:inset(50%)、完全可见元素，保留原始首帧时间 0 和渐进编码流程。
运行输入是正式 ESM 的内存副本，改变 CSS 与等待条件只发生在诊断页面中。

第一轮只把无帧回调分支也改为检查 readyState>=2。事件证据显示 metadata
交付时往往已经是 readyState=4，因此这并不等于真正等到了 loadeddata 事件。
第二轮明确让第一帧等待 loadeddata，并记录每次 seek 前累计交付的事件数；
后续帧沿用正常流程。最终脚本同时保留 current、ready-state、loaded-event
三种策略，避免后续 AI 把不同的等待语义混为一谈。

## 观察与下一步影响

- Windows WebKit 26.6 的 12 种组合均完成五次更新，但没有一组取得时间 0
  应有的唯一紫色帧。初次 draw 可能是透明像素，也可能已是后续红色；全可见
  元素也失败。因此不能靠“非黑/不透明”判断已经抽到正确首帧。
- 四个 loaded-event 变体第一次 seek 前均已交付一次 loadeddata，仍不准确；
  它们实际执行了事件等待，不是仅根据 readyState 推测已等待。
- Chromium 153.0.8010.12 与 Firefox 155.0 的当前代码对照均取得唯一紫色首帧；
  后续颜色与正常黑色内容也被保留。它们具有原生帧呈现回调，WebKit 此环境没有。
- Firefox 对照画面正确时 totalVideoFrames 仍为 0；Windows WebKit 也为 0。
  不能将该计数 >0 作为跨浏览器 fallback 的完成条件，否则会卡住正常提取。
- 三个 WebKit 组合在请求 1.6 秒后又交付了约 0.002 秒的旧 seeked，触发已有
  同目标重试，最终仍只产生五次 draw。记录保留这六次 seek，不能把采样数五
  误当作原生事件和重试数也必须为五；这也不解决首帧内容错误。
- 本次没有实现这些未经验证的 CSS/事件/计数修复；也没有删除或放宽现有像素
  检查。后续需要从当前 WebKit 媒体路径或实际支持设备取得更直接证据，不能
  继续把上述样式/readyState/loadeddata 的简单变体当作尚未尝试的新方案。

具体结果、事件次序、代码与媒体指纹见
[验证记录](../baselines/auto-thumbnail-rendering-readiness.json)。首轮/事件补充
缓存报告也保留指纹，最终十四组来自提交脚本，而不是用文字推测先前探针结果。
这些是一次版本固定的观测，不能外推为所有 WebKit/Safari 版本或物理设备缺陷。

## 重跑与维护

```sh
yarn build artplayer-plugin-auto-thumbnail
yarn probe:auto-thumbnail-rendering
```

第二条只读取产物和固定媒体，启动 loopback 临时端口，依次启动三个测试浏览器，
输出到新的 `.cache/auto-thumbnail-rendering-*`。脚本检查精确可替换代码位置，
记录各变体 hash，结束时检查源产物没有变化。它是诊断采集命令，不加入默认
通过测试列表，也不把成功退出解释为像素已通过。八秒是探针采集上限，不是
新生产超时。使用现有 Playwright 依赖，没有增加或升级依赖、版本或发布产物。

本项只有诊断脚本、入口、说明和证据变更；不声称修复所有旧类型/首帧问题。
回退该检查点会移除诊断入口和记录，不影响 07/08/09 的生产修复。
