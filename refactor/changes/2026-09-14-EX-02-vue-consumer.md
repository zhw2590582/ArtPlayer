# EX-02 Vue 消费者与原有更新/卸载契约

起点 `4df96893649ee0d3ffe1504af0609c3c6e023409`。本任务完成 Vue 示例的自有
TS 入口、配置职责拆分、严格 SFC 检查、实际 tarball 消费和维护说明；不将
插件专项/设备/发布任务一起完成。

## 实现与兼容边界

- `Player.vue` 保留 `option: Partial<Option>`、`getInstance` 事件和
  `onMounted` 初始化。将示例配置抽到 `player-options.ts`，维持法语、词典、
  Danmuku/Document PiP 的覆盖顺序及每实例创建插件工厂。
- DOM 容器和播放器均由 shallowRef 持有；去掉容器类型断言。卸载先取出并
  清空内部引用，再 `destroy(false)`，保留 Vue 对外层 div 的所有权。
- 保留数组式 `defineEmits(['getInstance'])`，没有收窄旧 `$emit`/监听器的
  类型形状。内部交付的实例有准确 Artplayer 类型，App 也显式标注回调参数。
- 保留仅挂载时读取 options：字段变化或替换对象不自动切源或重建；用户通过
  收到的实例 `switchUrl` 更新，通过组件 key 重建。没有增加深度 watch。
- 保留 script-setup 的私有状态边界：组件 ref 有 Vue `$el/$props`，不公开 art。
  class/style 保持透传；旧 JS 中的 id/data 属性透传单独实际验证。
- Vue 捕获事件监听器错误后，仍挂载的组件保留播放器，到卸载时释放。此处
  没有照搬 React 的异常处理。KeepAlive 停用也不销毁/暂停，所有者卸载才清理。
  依据 [Vue 生命周期](https://vuejs.org/api/composition-api-lifecycle.html) 和
  [script-setup 公开边界](https://vuejs.org/api/sfc-script-setup.html#defineexpose)，
  再用旧/新包装的实际浏览器结果验证。

`main.js` 迁移到 `main.ts` 并同步 HTML；`tsconfig.json` 替代 jsconfig，保留 @
别名，启用 strict、strictTemplates、checkJs、skipLibCheck:false。App 对选项
使用窄字段推导和 satisfies 校验，避免直接给 reactive 传入全部 Partial<Option>
造成 DOM 字段类型展开。包内核心/插件公开声明、运行源码和产物均未修改。

## 类型问题与测试修正

原 App/Player 的固定 Git 内容在当前工作区、新 vue-tsc 下，App 第 23 行复现
一个 TS2322。当前树可见 @vue/reactivity 3.5.13 与 Vue/runtime-dom 3.5.28 共存，
诊断涉及 DOM 深层类型展开；不据此断言所有 Vue 环境均有该问题。新示例严格
检查通过，隔离安装中的旧包装也通过，工作区类型问题与运行兼容分开记录。

初版测试的两个假设已纠正：具体 Vue 组件实例不能随意赋给无 props/emits
泛型的 ComponentPublicInstance；strictTemplates 不会自动把任意原生属性
识别为组件声明的 props。保留真实 `$props`/私有 ref 正反例，任意属性透传在
未改成 TS 的 JS SFC 中验证，没有扩大组件 props 或关闭严格模板检查。

初版隔离校验拒绝了工作区 vue-tsc 引用的 language-core 模板 helper。最终连
vue-tsc/TypeScript 也安装在隔离消费者中，全部 90 个编译输入都须位于该目录，
没有给工作区类型增加例外。三个 @ts-expect-error 分别拒绝错误 URL、缺失
option 和读取私有 art；原数组式 event 监听器形状仍可赋值。

## 工具与所有权

根 devDependencies 新增固定 Vue 3.5.28、@vitejs/plugin-vue 6.0.1、
vue-tsc 3.3.11。Vue 版本与已固定 compiler-sfc 一致；vue-tsc 的实际 registry
元数据要求 TS >=5.0，复用 TS 5.9.3、Vite 7.3.6。只更新根 yarn.lock，示例
manifest 同步版本/用途，移除未使用的可选 devtools overlay 依赖。
这些是示例/测试工具，不改变 Artplayer 包的生产依赖。

新增 `dev:vue`、`typecheck:vue`、`lint:vue`、`build:vue`、`test:vue-consumer`。
`test/vue/` 分离实际 SFC 场景、纯 JS 调用和只编译类型反例；编排脚本复用
已有 package-consumer 的隔离目录/命令/安全清理，避免引入另一套包安装逻辑。

消费者测试顺序：pack 三包并记录哈希；仓库外 offline 安装和 frozen force
重装；逐文件对照 tarball；隔离 vue-tsc 严格编译；Vite 构建实际 App、生命周期
页和 JS 页；三引擎逐个测试。浏览器、预览服务和临时安装均在 finally 释放。
观察 Worker 的包装实际调用原生构造/terminate，没有替换 worker 执行逻辑。

## 实际结果

见 [机器证据](../baselines/vue-consumer-validation.json)。Windows、Node
24.21.0、Yarn 1.22.22，Chromium 153.0.8010.12 / Firefox 155.0 / WebKit 26.6。

- 新包装和固定旧 Player.vue：分别 development/production × 3 引擎，共
  12 组通过，每组 15 类检查，无 retry/skip。覆盖原事件/组件 ref、选项修改与
  替换、播放/暂停/seek/像素、实例切源、key 重建、兄弟实例、可选监听器、
  mount 前取消、连续三次挂卸载、捕获错误、监听器触发卸载、KeepAlive、旧 JS
  用法、原 App 入口。候选每组创建 19 个 Worker，旧包装生产 WebKit 为 18 个、
  其余为 19 个；创建总数不是兼容断言，全部最终存活 0，实例/DOM 清理。
- 新依赖下 React 实际消费六组回归通过；全仓 406 个生产 TS 文件及兼容类型
  矩阵通过；50 项 CI 回归通过；根/示例 lint、frozen 安装、严格工具链、核心
  声明无漂移检查和示例生产构建通过。根 lint 保留 1 条既有生成声明注释警告。
- GitHub 三系统 browser-smoke 加入 Vue 消费及 always 证据上传；验证器会拒绝
  删除、跳过该步骤或遗漏其证据。这里只证明本地配置/测试，没有远端运行证据。

## 内置浏览器补充验证

真实启动 `yarn dev:vue --host 127.0.0.1 --port 5188 --strictPort`，Vite 7.3.6
在 322ms 就绪。通过已授权 Codex 内置浏览器打开实际开发页，不拦截样例请求：
公网 video.mp4、XML 弹幕正常加载；点击 Lire 后播放推进至 74.60414s，原生
duration 90.045011s、640×360、readyState 4、error null。Pause 后操作进度条
Home，UI 和原生 currentTime 回到 0，paused=true，查询到的 error/warn 为空。

User-Agent 报告 Chrome/152.0.0.0（Windows）；接口不支持 Browser.getVersion，
不虚构完整补丁版本。该次开发页与 headless 自动化分开记账，没有据此声称 Chrome
扩展已恢复或 Safari/真机通过。UI 截图已在工具会话查看，未作为仓库图片保存。
临时页已关闭，开发服务器已主动终止。暂停 seek 后旧弹幕仍显示符合已记录的
Danmuku 历史池语义，未将其误报为新缺陷，见该包 ARCHITECTURE.md 和原基线测试。

## 边界与回退

自动化媒体/XML 是受控夹具；内置浏览器只补充一次公网样例/开发页实播，不证明
普遍 CDN 可用性。Worker 终止计数不等于进程内存测量。未验证真实 PiP 窗口、
完整弹幕调度、SSR/HMR、macOS/iOS Safari、旧核心/旧插件全部组合；对应已有
包/工程/发布门槛继续保留。`--before` 是历史包装源码对照，不是旧 npm 包矩阵。

回退 EX-02 提交恢复旧示例、配置和工具锁；不涉及数据迁移。将来生产包内容或
工具链变化后重新打包验证，不复用本次 tarball 哈希作 npm 发布证明。无版本
升级、推送或发布；Vue 示例的私有 0.0.0 不属于 22 workspace 包的大版本发布。
