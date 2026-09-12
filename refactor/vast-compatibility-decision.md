# VAST 初始化兼容决策：待用户选择

来源：[真实发布契约](baselines/vast-contract.md)；已可重跑的
`vast-contract.test.mjs`及`test/vast.test.js`固定以下矛盾：

| 同一次 callback 开始时 | npm1.0.0 | 未发布工作区1.2.0 |
| --- | --- | --- |
| imaPlayer | 已构造、非null | null，直到init/playUrl/playRes |
| DOM | 已挂载$container，并提供id | 不存在容器，container getter为null |
| 设置 | IMA默认值 | 默认启用preloading及restoreCustomPlaybackStateOnAdBreakComplete |

实际发布用户可以直接写 `({ imaPlayer }) => imaPlayer.addEventListener(...)`。
工作区用户可以先判断`context.imaPlayer === null`并修改`playerOptions`，然后等待
用户操作调用`init()`。在同一默认调用中无法同时保留非null和null，以及相反初始化时机。
添加别名或getter也无法同时满足两种值；按callback源码猜测用户版本不可取。

## 推荐的具体处置（尚未实现）

优先保持实际npm1.0.0默认行为：回调前初始化、提供id/$container，SDK默认设置保持
发布语义；保留workspace新增的init/container/settings等字段作为扩展。

确实依赖未发布1.2.0惰性行为的代码，拟通过新的可选第二参数明确选择该兼容模式：

```js
// npm旧用法保持原样
artplayerPluginVast(({ imaPlayer, $container, id }) => {
  imaPlayer.addEventListener('AdStarted', onAdStarted)
})

// 未发布工作区1.2.0的初始化时机与默认设置保留在显式模式
artplayerPluginVast((context) => {
  context.playerOptions.autoResize = false
  button.onclick = () => context.playUrl(adTag)
}, { compatibility: 'workspace-1.2' })
```

这意味着依赖未发布1.2.0默认惰性的代码需要增加一个参数。普通npm1.0.0用户保持
原调用；这不是声称两种相反语义完全兼容。第二参数仅为待确认方案，当前生产代码
尚未新增它；类型误声明、CJS.default和分发路径仍各自单独验证。

## 当前检查点

生命周期与资源修复不依赖该选择，已经推进；默认初始化暂保持工作区行为，不把
PKG-VAST-03或VAST-CONTEXT-01标完成。用户针对Ads的类型推导批准不适用于本决策。
需要用户确认是否按推荐方案优先实际发布默认行为；也可指定其他取舍。
