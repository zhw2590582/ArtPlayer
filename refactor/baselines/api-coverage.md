# 公共 API 基线与契约覆盖

BASE-02 使用固定 npm artplayer 5.4.0 + artplayer-plugin-chapter 1.1.0 的 UMD 文件，在 Codex 内置浏览器执行。UA 报告 Windows / Chrome 152.0.0.0，语言 zh-CN；这不是外部 Chrome 扩展或其他浏览器已验证的声明。

## 已保存的事实

[public-api.json](public-api.json) 包含原始报告、已加载脚本路径、发布包版本/integrity/成员哈希、夹具源码指纹、真实采集时间和重复采集校验结果。最终两次独立 reload 的 14 项检查全部通过，快照相同，浏览器 error/warn 日志为空。

| 快照 | 已观察范围 |
| --- | --- |
| static/constants | 47 个静态属性描述符，33 个公开大写配置默认值 |
| defaults/config | 50 个默认选项、config 配置形状；函数用标记保存，不比较函数源码 |
| prototype/emitterPrototype | 核心原型 6 项、Emitter 原型 5 项 |
| instance/instanceResolved | 实例自身 74 项、沿原型查找可访问的 84 项属性描述符 |
| utilityDescriptors | 48 个工具属性的类型和描述符，不代表已测试全部工具行为 |
| integrations | template/events/controls/setting/contextmenu/layers/plugins/storage/subtitle/i18n 共 10 个子系统的 own、直接 prototype 和完整属性查找结果 |
| chapterFactory/chapterResult | 工厂和插件返回对象形状，保持同步注册及结果访问 |

沿原型查找排除 Object.prototype，保留最近定义；这样能发现 controls.show/toggle 等继承 API 的缺失。快照也会包含实现细节，发现差异时需要区分公开契约和可调整内部状态，记录依据及消费者测试；不能自动覆盖旧快照消除失败，也不能把每个内部反射差异一律当作禁止重构。

语言默认值先实测等于 navigator.language.toLowerCase()，再用环境引用标记比较，实际语言保留在报告中。其他环境差异不自动忽略，例如 Safari preload 默认值需在其独立基线中核对。STYLE 大字符串不作默认值精确比较；CSS/DOM 契约由 BASE-04 负责。夹具指纹使用 SHA-256 和 LF 规范化，避免 Git 换行转换影响跨系统复跑；发布 JS 使用原始字节哈希。

## 固定测试 ID 和后续责任

所有已执行条目都绑定上述两个发布版本及 public-api.json；入口为 ../fixtures/api.html，原断言在 ../fixtures/api.js，比较命令见下节。

| 契约 | 已执行的固定 ID / 快照路径 | 未覆盖部分与责任 |
| --- | --- | --- |
| API-01 | API-01.version、defaults-independent、default-language、instance-registration、container-selector；snapshot.defaults/constants/config | ready 回调、useSSR、失败构造、合并边界由 BASE-03/CORE-01/CORE-07 接续 |
| API-02 | API-02.video、bound-query；snapshot.instanceResolved | 播放/切源 Promise、参数边界及其他可抽取方法由 BASE-03 和对应 CORE 任务接续 |
| API-03 | api.test.mjs 的 API comparison 用例；static/prototype/emitterPrototype/instance/integrations 描述符 | 比较器负例验证 writable/接口删除/默认值/继承访问变化；其他构造模式由相关场景补充 |
| API-04 | API-04.on-return、off | once/ctx、重入、异常、事件顺序由 BASE-03 接续 |
| API-05 | API-05.destroy-return、instance-cleanup | 本轮是单实例首次 destroy(true)；重复销毁、多实例、removeHtml=false 和资源/媒体顺序由 BASE-03 接续 |
| API-06 | API-06.sync-chapter、add-return、result-call；chapterFactory/chapterResult | 异步注册、重名及 chapter 参数和 UI 由 BASE-03、PKG-CHAPTER-01/02 接续 |
| API-07 | snapshot.integrations 及 utilityDescriptors | 描述符覆盖不等于 UI/轨道/资源行为通过；BASE-04、插件试点和对应 CORE 任务接续 |
| API-08/09/10/11/12 | 此任务不声明完整覆盖 | BASE-04/05/06/08 与对应包任务负责 DOM/CSS、分发、浏览器、类型、持久协议 |

表中的同前缀短名均指相同契约前缀的完整 ID，例如 defaults-independent 即 API-01.defaults-independent。执行断言列表以 api.mjs 的 checkIds 和报告为准。ENG-09 后续将覆盖索引纳入机器检查；这里没有将整条 API-01 等宽泛契约标成全部通过。

## 重跑和比较

1. 运行 `node refactor/scripts/browser-server.mjs`，按需要设置 ARTPLAYER_TEST_PORT，默认 8083。
2. 使用 @Chrome；不可用时直接使用内置浏览器，打开 http://127.0.0.1:8083/fixtures/api.html。每次明确 reload，看到 PASS 且 errors 为空；此次页面只验证同步 API，不等待或验证视频播放。
3. 运行 `node refactor/scripts/api.mjs --compare refactor/.cache/reports/api.json`。检查全部固定 ID、发布来源、实际脚本、夹具指纹，再比较快照。命令不改冻结文件。
4. `node refactor/scripts/api.mjs --check` 只核对持久报告和来源/快照摘要；`node --test refactor/scripts/api.test.mjs` 运行报告/比较器负例。两者不启动浏览器，CI 不能把它们当作新一轮真实浏览器执行。

yarn test:baseline / ci:check 已通过通配入口包含新增 api.test.mjs。负例涵盖缺检查、错误来源、采集失败、描述符变化、删除方法、选项/静态默认值变化和继承 API 删除。正式候选对照和浏览器自动回归由 ENG-05/07 逐步接入，当前夹具仍固定旧发布文件，不自动加载工作区候选。
