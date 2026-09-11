# 核心目标设计

这里是迁移方向，不是已经实现的目录或接口。实际路径调整需随实现更新。核心仍是 `packages/artplayer`，对外仍是 Artplayer 类和既有实例/静态接口。

## 现状证据

- [入口](../packages/artplayer/src/index.ts)顺序构造所有子系统；[player](../packages/artplayer/src/player/index.ts)按保留的安装顺序通过 mixin 将属性安装到 art，并在销毁后停止后续步骤。
- [Component](../packages/artplayer/src/utils/component.ts)负责控件缓存、DOM 和监听器；[Setting](../packages/artplayer/src/setting/index.ts)还有独立的树、渲染和更新语义。
- [Events](../packages/artplayer/src/events/index.ts)已迁移为 TS，管理 DOM 监听器和全局重绑；输入调度、内部订阅与异步请求分别通过所属模块接入实例或操作作用域。
- [声明](../packages/artplayer/types/artplayer.d.ts)与源码独立维护；[build-ts](../scripts/build-ts.js)进行文本拼接。

## 目标职责

| 领域     | 现有文件范围                                 | 目标与迁移方式                                                               |
| -------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| 公共门面 | src/index.ts、player/index.ts、player/*Mix.ts | 保留原签名和属性描述符；委托内部服务，不一次性换继承结构                     |
| 配置     | option、scheme、config、默认值               | 区分用户输入与归一化配置；保持默认值、合并语义和错误时机                     |
| 生命周期 | constructor、destroy、Events、各模块清理     | 实例资源作用域与操作资源作用域，清理恰好一次、可重入、失败后继续释放         |
| 内部事件 | utils/emitter.js                             | typed event map、未知事件兼容扩展、原调用顺序和 ctx                          |
| 媒体能力 | template、proxy、player                      | 内部精确的能力接口与原生视频类型分离；公共 video 兼容层保留                  |
| 播放流程 | play/pause/toggle/seek/url/switch/eventInit  | 媒体状态、操作身份、加载恢复与 UI 响应分离                                   |
| UI 注册  | utils/component、control、layer、contextmenu | 保留 name/cache/update/remove；明确 DOM 和绑定的归属                         |
| 设置面板 | setting/index.ts                             | 分开树整理、选择状态、渲染、布局、绑定；共享能共享的逻辑，不强行统一返回类型 |
| 字幕     | subtitle/index.ts、utils/subtitle.ts         | 获取、解析、track/DOM 渲染、取消和对象 URL 回收分开                          |
| 显示模式 | fullscreen/fullscreenWeb/pip/mini/auto*      | 显式恢复位置和样式，保持互斥顺序、用户手势与移动端语义                       |
| 输入     | events、hotkey                               | 鼠标/触控/键盘/焦点归属清晰，跨 document 重新绑定和清理                      |
| 无障碍   | template、control、setting、显示模式         | 明确键盘导航、可访问名称、焦点进入退出和字幕能力，保留旧 DOM/CSS 与热键契约  |
| 内置功能 | plugins/*、info/notice/loading/mask          | 逐项登记定时器和订阅，不能因内部插件迁移改变默认启用条件                     |
| 资源     | i18n、icons、style、libs                     | 保持子路径、图标键、CSS 类和样式注入；记录 vendored 依赖来源                 |

## 生命周期设计约束

1. 分离实例作用域和单次切源/请求作用域；结束一次请求不能销毁整个实例。
2. 资源登记函数返回内部清理句柄，不要求旧插件接入新接口。
3. 销毁中的重入、重复销毁和单项清理异常要有专门测试。
4. ready、destroy 的原触发时机和监听器可见状态先捕获基线。不能为统一清理把所有 Emitter 订阅先清空。
5. 等待中的请求通过取消或 generation token 隔离过期结果；其 Promise 结算方式需要行为决策。
6. 初始化失败只释放已创建资源，避免 DOM 和 instances 半初始化残留。
7. ES2015 产物的语法目标和实际 AbortController 等能力支持分别验证；必要时使用内部 fallback，不默认增加全局 polyfill。

## TypeScript 迁移原则

- 使用 allowJs 建立过渡，迁移完成的生产模块启用 strict；禁止靠整文件 ts-nocheck 或无边界 any 达标。
- 内部优先使用所需能力的精确接口，不把所有参数都简单标为 Artplayer。
- 公共自定义配置、事件、插件结果允许明确的泛型/模块扩展，保留旧 JS 用法。
- DOM、Node、worker、AudioWorklet 和媒体 shim 类型分域；不要让 monorepo 的全部 @types 自动污染核心。
- 内部字段采用不发出多余运行时代码的声明方式。重新安排 class field 初始化会影响构造顺序和属性行为，需测试。
- 公开声明生成时隐藏内部模块，不改变既有类型入口；ESM/CJS 两种类型消费者分别检查。
- 第三方复制文件允许暂保留 JS，但必须有来源、许可证和包内类型适配，不计为自有源码 TS 迁移遗漏。

## 性能范围

先测初始化耗时、控件交互、播放帧期间的工作、重复挂载/销毁后的资源、弹幕和 proxy 的帧调度。记录同设备同媒体的多次采样。只有结果支持时才减少 DOM 读写、合并帧更新、限频持久化、改进算法或延迟加载；不以改成 TS 或 Bun 本身作为浏览器性能优化证据。
