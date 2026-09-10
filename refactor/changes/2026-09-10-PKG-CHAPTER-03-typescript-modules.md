# PKG-CHAPTER-03：以 TypeScript 拆分章节实现

## 实现

删除生产 JS 入口，直接迁移为严格 TS，避免先拆 JS 再重复迁移。实际维护地图见
[包内架构](../../packages/artplayer-plugin-chapter/ARCHITECTURE.md)：入口拥有 player 集成和
事件生命周期，chapters 处理纯区间运算，progress 拥有 DOM/标题/进度，stylesheet 拥有全局样式。
内部类型从现有公开声明推导，无 any、全局忽略或运行时核心依赖；CSS 保持原样。

保留默认导出/工厂/注册 name、同步 update、参数默认值、调用方数组原地排序/补齐和对象引用、
Infinity end 替换、metadata 一次初始化和成功更新的 loaded setBar 事件。DOM/CSS 类名、
data 属性、标题纯文本和进度边界保持正常旧调用兼容，不引入新核心方法。

## 明确修复与兼容差异

| 原问题 | 当前行为及覆盖 |
| --- | --- |
| hover 进入空白 gap 或更新后显示上一章节标题 | 空白/零位置/替换/清空重置并隐藏标题；真实鼠标验证 |
| NaN 时间被渲染进 data/CSS | 非有限非法时间点沿用时间错误信息拒绝；Infinity end 仍合法 |
| 非有限媒体 duration 生成无效区间 | 等待正的有限 duration，输入保持不变；有限时间轴恢复后可显式更新 |
| destroy 后保留插件监听器和可更新的 DOM | 移除本插件三个回调及两个 DOM 根，保留其他订阅和实例；旧 result.update 成为无操作 |
| destroy(false) 保留插件活动 UI | 只删除本插件 UI/类名，保留核心播放器树，避免恢复过期章节 |
| 页面解析期间两次载入插件可重复注入 style | DOMContentLoaded 时重新核对 ID，once 监听；样式仍为全局并在销毁后保留 |

非法输入的部分变更时序不作为合法调用契约；已有合法数组变更经过新旧浏览器对照。
切源后的章节所有权保持显式 update，没有顺带新增自动重算策略。

## 验证

- 严格分包 TypeScript 检查通过；公开声明没有在本任务改形状，旧编译器消费继续通过原测试。
- 新增四项区间单元测试；完整 ci:check 共 61 项 Node/基线测试通过。
- 三浏览器源码 54 项通过；新增五个场景在 Chromium/Firefox/WebKit 各执行一次。
- `yarn build artplayer-plugin-chapter` 重建三格式 dist 与 docs/compiled；全部由脚本生成。
- `yarn test:package` 的真实 TS 构建、tarball 安装和 23 项运行时/公开属性形状对照通过。
  精确历史类型诊断仍为 11 条，留给 PKG-CHAPTER-04/核心类型任务，不作为本任务已修复。
- 安装后候选文件再次运行三浏览器共 54 项通过，无重试/跳过；结果和指纹见
  [执行记录](../baselines/chapter-migration-validation.json)。

试点发现 ENG-07 的构建快照缺根 tsconfig；本任务补复制根配置与资源声明，消费者隔离规则不变。
不添加新依赖，test:unit 新增章节用例入口。源码入口、类型及生成格式由已有仓库脚本管理。

## 接续与回退

本任务完成第一包自有运行时 TS 化和职责拆分，不代表 chapter 全部任务或核心已完成。
PKG-CHAPTER-04 继续公开类型/旧声明子路径/NodeNext 消费闭环，然后进入试点汇总。
任务 03/04 分工更新为实际执行顺序；全项目范围和兼容门槛保留。
未推送、未发布、未升级版本。回退用本任务的独立提交 revert，同时恢复源码和生成产物。
