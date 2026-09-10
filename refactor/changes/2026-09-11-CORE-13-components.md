# CORE-13 组件注册与控件

状态：完成；源码、严格类型、构建、安装包与本地三浏览器验收通过。

## 职责与兼容

Component、control、layer、contextmenu 和 qualityMix 迁移 TS。注册器、DOM、条目资源、选择生命周期、内置装配、布局观察、进度计算/视图/交互按实际职责拆分；简单控件保留独立工厂。共享 typed UIEvents 和最小宿主不引入第二套事件总线；主构造门面的整合仍交 CORE-20。包内 ARCHITECTURE.md 给出实际地图、修改入口与边界。

保持裸工厂调用、回调 this、原始 Event 和参数、索引排序、HTML 数字转换、更新时原配置对象合并、同步 mounted/beforeUnmount、属性别名及缓存条目形状。Component add/update 可返回 div；controls.add/update 继续返回 undefined。公开 d.ts 不在此轮收紧，BASE-TYPE-04 与只写 quality 属性的 BASE-TYPE-08 仍交 CORE-21。

条目资源在渲染前登记，remove/update 释放内置 DOM 与 Emitter 订阅、拖动和提示定时器；整实例销毁释放作用域，但不新增逐条 beforeUnmount 调用或清空历史 cache/alias。自定义 mounted 返回值仍忽略，用户自行创建的监听器/SDK 工作需自行 beforeUnmount 清理，没有凭空引入 disposer 协议。

## 缺陷与修正

- BASE-LIFE-09：旧控件移除后时间/音量/菜单仍响应事件，拖动仍可 seek。候选按条目释放并在 Emitter 快照内检查关闭状态，用户自己的订阅保留。
- BASE-LIFE-10：旧 mounted 抛错残留 DOM/cache/监听器，beforeUnmount 重入重复执行并抛错，已脱离 DOM 的条目移除也抛错。候选回滚失败条目且保留成功的重入替换，递归移除同条目幂等；beforeUnmount 自身抛错仍保留条目可重试并传播原异常。
- BASE-LIFE-11：旧 selector 背景点击及异步拒绝产生未处理异常，乱序和移除后结果仍覆盖标题。候选忽略无项点击，报告原始失败，只接受当前选择的完成；内置清晰度通知也绑定选择生命周期，包括通知文本准备期间重入。第三方 onSelect 自有异步副作用不会被自动取消。
- BASE-DOM-03：旧 selector 数组用于更新后因不可配置属性重复定义而抛错。候选保持 getter 标志，通过 WeakMap 重绑已关闭条目；同时共享到两个活动控件仍非法。
- BASE-DOM-04：旧 `__proto__` 名称别名会改变 registry 原型。候选为它定义普通 own 属性，仍可按名称读 DOM，不再改原型。
- BASE-DOM-05：旧 highlight.text 可通过引号注入 DOM 属性；候选使用 dataset 按文本写入。没有声称移除用户明确支持的 HTML 控件内容。
- BASE-DOM-02 部分：窄容器控件换行，所有按钮保持可见；新增 --art-controls-height 记录总高度，字幕/面板跟随，旧 --art-control-height 保持单行单位高度。CORE-14 仍需处理窄设置树/面板，因此此风险保持 open。

## 验证与过程

源码组件资源 8 项 Node 测试、根与核心 TS 检查通过；源码专项三浏览器 84 项通过，最终安装包 UMD 与 legacy 同套完整矩阵各 342 项通过。新增用例覆盖真实右键/点击、视频进度、旧新错误对照、回调/别名/返回值、乱序、清理和尺寸变化。ResizeObserver 不可用分支单独测试；没有将 UA 覆盖当实体设备证据。

首次窄容器用例增加实际 16:9 高度后暴露候选控件组仍 height:100% 的裁切：57 通过、3 失败。修正遗漏的子组 CSS，再验证 640/320/240px，保留原失败报告。之后观察器用例 81 通过、3 失败，原因是字幕仍在既有 CSS transition 中；改为有界轮询最终计算样式，未扩大超时或移除动画，随后 84 项通过。

本任务未新增依赖或修改锁文件；package.json 将组件资源测试加入既有 test:unit，确保 CI 执行。没有版本变更、推送或发布。原型名/生命周期/选择器修复为有旧新复现的缺陷修正，不静默改正常 API。回退需一起回退 TS 模块、样式、生成产物、测试和对应记录；不能仅回退组件基类而保留依赖其条目作用域的控件。

完整安装 UMD 首轮 341 通过、1 项 WebKit 切源位置失败。补充原生 seeking/seeked/loadedmetadata/canplay 轨迹后复现：初始 seek 已结束但实际落在接近 0 秒，切源保留的正是这个实际位置；旧测试仅等 seeking=false，没有证明初始 3 秒前提。诊断中精确等于 3 的临时断言也错误拒绝毫秒偏差，已改用原有 0.05 秒精度。曾尝试等待 buffered/seekable 均覆盖 3 秒，但本地 WebKit 实际播放后仍报告 buffered=[]、seekable=[[0,8]]、readyState=4，这个附加假设不成立，保留失败报告并撤回。最终用例通过真实播放/暂停手势启动媒体，再确认 seekable 目标并设置初始位置，在切换前后断言位置，保留范围与媒体轨迹；没有修改播放器逻辑、重复 seek、扩大超时或放宽原切换断言。专项每引擎重复 10 次用于确认该前提修正，再重跑完整矩阵。

## 最终交付证据

- yarn ci:check：177 项通过（148 单元、4 工程、25 基线），110 个生产 TS 文件严格检查；其中核心 105、chapter 5。
- yarn build artplayer 与 yarn build:i18n 成功；实际核心/chapter tarball 仓库外安装消费：27 项运行时通过、五组类型零诊断。
- 最终安装 UMD 和 legacy 各 342 项三浏览器通过，包含本任务 84 项；无跳过、重试、flaky 或未处理页面异常。旧缺陷测试显式收集并断言预期拒绝，没有把它们冒充候选成功行为。
- [验证记录](../baselines/components-validation.json) 校验全部核心源码与打包构建快照一致，三个格式产物与 tarball 及 docs/compiled 指纹一致，公开声明、包内架构文档、22 个语言文件和完整许可一致；记录实际引擎版本、逐项结果与早期失败原因。
- 关闭 BASE-LIFE-09/10/11 和 BASE-DOM-03/04/05；BASE-DOM-02 保持 open，窄设置面板交 CORE-14。没有远端 CI、实体设备或全生态发布验收声明。

本任务独立本地提交；当前总任务 214 项，49 完成、165 待办。下一项 CORE-14 设置树、渲染、选择与布局。
