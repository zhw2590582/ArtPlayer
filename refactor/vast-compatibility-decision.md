# VAST 初始化兼容决策：已确认并完成运行时实施

2026-09-14用户明确接受：“保留 npm 默认行为，显式选择工作区惰性模式”。
以下推荐方案现在是实施依据，不再等待此项授权。生命周期、类型、实际IMA与
分发仍须分别验证；本确认不豁免这些门槛，也不授权发布。

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

## 已接受并实施的具体处置

优先保持实际npm1.0.0默认行为：回调前初始化、提供id/$container，SDK默认设置保持
发布语义；保留workspace新增的init/container/settings等字段作为扩展。

确实依赖未发布1.2.0惰性行为的代码，通过新的可选第二参数明确选择该兼容模式：

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
原调用；这不是声称两种相反语义完全兼容。第二参数已获用户明确授权，生产代码
由PKG-VAST-03落实；公开类型由04协调，CJS.default和完整分发各自单独验证。

默认模式同时保持发布版的可写数据字段、SDK默认设置、透明容器和每次显式请求
转发；包装层不订阅工作区新增的四个广告事件，不代替SDK管理广告显隐。
显式工作区模式保留黑色容器、四事件显隐、活动广告期间请求抑制及实时getter。
两者共享已修复的资源所有权、初始化回滚和终止规则。

默认模式销毁后保留三个发布数据字段的快照，容器已移除、SDK已释放；扩展的
container getter返回null。显式重建会更新三个数据字段；核心销毁则禁止重建。
工作区模式所有资源getter随当前session归零。默认ID保留art-前缀，工作区保留
art-vast-；两者增加单模块递增后缀修复同毫秒ID碰撞，不恢复已复现的重复ID缺陷。

兼容选项在工厂调用时读取一次，后续修改原options不改变已创建的注册函数。
未知compatibility值抛TypeError，发生在加载SDK之前。公开声明尚由04负责，
本步骤的JS示例不是宣称新的第二参数已完成TypeScript消费验收。

## 当前验收边界

PKG-VAST-03已落实默认模式、显式工作区模式与发布字段，82项Node、162项三浏览器
受控SDK检查通过；初始化风险按本次用户决定限定接受。详见
[完成记录](changes/2026-09-14-PKG-VAST-03-compatibility.md)。公开声明随后按
[独立类型确认](vast-type-decision.md)恢复npm根类型并提供准确/runtime入口；实际IMA
播放仍未验收。此前Ads的类型批准、本次运行时决定和随后VAST类型决定分别记录。
