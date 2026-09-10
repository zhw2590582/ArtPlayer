# DOM、CSS、输入与官方 demo 基线

BASE-04 使用固定 npm artplayer 5.4.0 / chapter 1.1.0，在 Codex 内置浏览器最终两次独立 reload 后真实点击和按键。16 项断言通过，DOM 语义快照相同，errors/unhandled 和浏览器 error/warn 日志为空。来源和时间见 [dom.json](dom.json)，不是当前工作区候选或外部 Chrome 扩展验收。

## 已记录的扩展契约

| 契约 | 固定测试 ID / 数据 | 后续责任 |
| --- | --- | --- |
| API-08 模板/样式 | DOM.version-template、user-style；snapshot.template/tree/cssClasses/cssVariables | CORE-12：模板、88 个核心 CSS 类名匹配、43 个 CSS 变量；保留用户选择器和覆盖入口 |
| API-06/08 chapter | DOM.chapter-markup；chapters、chapterStylePresent | PKG-CHAPTER-01/02：两个章节、start/end/title 数据及样式注入，其他参数/悬停/销毁行为继续补测 |
| API-07 控件/图层 | DOM.control-click/update/remove、layer-remove、destroy | CORE-13：真实 click 的 this/参数、按 name 替换和清理；controls.update 返回 undefined，元素通过 controls[name] 获取 |
| API-07 设置 | DOM.setting-select/update/remove；selected | CORE-14：选择 High，当前节点 art-current，默认值 false/true，回调 this/参数和移除 |
| API-08/10 网页全屏 | DOM.fullscreen-web-enter/exit；Escape interaction | CORE-16：点击后挂到 body，Escape 恢复原容器/class；未测原生全屏或 PiP 权限 |
| API-10 输入/焦点 | DOM.keyboard-seek、input-ignores-hotkey；interactions | CORE-17/23：ArrowRight 从 0 到 5 秒，输入框相同键不 seek；Tab/焦点、可信事件来源有记录 |
| API-08 布局 | DOM.narrow-container；wide/narrow | CORE-13：640x360 和 320x180 容器边界及控件测量；不是移动 viewport/触摸/真机验证 |
| API-08/10 可访问属性 | controlAttributes、tree 的 role/aria/tabindex；实际 Tab 两次 | CORE-23：DOM 属性不是完整 accessibility tree 审计；浏览器 snapshot 中按钮为 generic，用户输入层 textbox 可用 |

上述短 ID 均使用 DOM. 前缀，完整列表由 dom.mjs 的 domChecks 固定。模板是发布版 Artplayer.html 原文；运行时树保留节点嵌套、class、role、aria、tabindex、type，省略 SVG 内部路径和变动文本。CSS 清单从发布 STYLE 提取，不是全部伪类/组合选择器/所有主题的视觉回归。用户规则 `.player .user-hook` 和 `art.cssVar('--art-theme', ...)` 通过计算样式验证。章节样式依赖固定发布成员哈希，未另做全部插件 CSS 清单。

## 历史问题与界限

| ID | 已观察事实 | 责任与候选要求 |
| --- | --- | --- |
| BASE-DOM-01 | 实际 Tab 从外部按钮到用户 input，再到播放器后的按钮；8 个 .art-control 根节点均为 DIV / tabIndex -1 / 无 role。部分控件及子节点已有 aria-label，不能概括为完全没有名称 | CORE-23，关联 CORE-17：补主要控件/设置可达性与名称，保持旧快捷键/DOM 钩子；不要求候选重复不可达状态 |
| BASE-DOM-02 | 默认桌面控件加 Probe control，在 320x180 容器中设置和网页全屏控件越过右边界；截图目视确认裁切，player.scrollWidth 仍为 320 | CORE-13：补窄容器布局回归；CORE-14 同时检查设置面板定位；不把截图当移动端通过 |
| BASE-DEMO-01 | docs/assets/example/thumbnail.js 引用 artplayer-plugin-thumbnail，当前 22 包不存在它，首页也无该示例菜单链接 | SITE-01 / EX-03：核实历史外部包与迁移路径，不自动改成 auto-thumbnail 或删除旧示例 |

问题只登记与分配，不在基线任务修改生产代码。dom.mjs --compare 比较同一发布基线；候选修复产生差异时应新增正向测试和解释，不能要求修复后仍保留错误，也不能覆盖历史报告消除差异。

## 重跑

1. 按 toolchain-setup.md 使用固定 Node/Yarn。运行 `node refactor/scripts/browser-server.mjs`，打开 `http://127.0.0.1:8083/fixtures/dom.html`。独立 origin 使用固定发布脚本和本地 MP4，未运行 Monaco 或读取编辑器四个开关。
2. 等待 DOM.version-template / user-style / chapter-markup 出现。点击 Tab start，按 Tab 到 Typing probe，再按 Tab 到 Inspect narrow container，观察原始可达性。
3. 点击 Probe control，再按 ArrowRight；点击 Typing probe，再按 ArrowRight。依次点击设置、Baseline selector、High；点击网页全屏，再按 Escape。
4. 点击 Inspect narrow container，检查右侧裁切和章节条；点击 Save DOM baseline。报告写到 refactor/.cache/reports/dom.json，必须显示 16 checks / errors 0。
5. 运行 `node refactor/scripts/dom.mjs --compare refactor/.cache/reports/dom.json`。重载重复实际操作，不用 dispatchEvent 代替 trusted 输入。

`node refactor/scripts/dom.mjs --check` 只校验冻结报告，`node --test refactor/scripts/dom.test.mjs` 验证缺输入、trusted=false、错误媒体/热键、类名/变量/布局差异等拒绝机制。报告不是抗恶意篡改证明；操作与来源记录须一起审查。小数像素宽度不作跨环境精确比较，容器边界、类名与可访问属性变化会报告差异。

## 全量路径台账

[demo-inventory.json](demo-inventory.json) 覆盖 29 个 example JS、36 个 HTML 路径与 22 包。包含 25 条首页菜单链接及 libs、4 个无菜单示例、6 个 demo/编辑器入口、28 个生成文档页面、独立 upscaler 工具页和站点验证页。核心通过所有示例使用，vitepress 通过 document 页面覆盖；两者没有插件式 libs 菜单不是缺包。

所有官方 docs 页面仍标 not-run，只有独立轻量夹具已实测。没有把 core/chapter 夹具通过改写成官方 chapter 示例或 Monaco 已通过。外部 SDK、媒体 URL、动态 import/脚本和无菜单示例依赖仍由 SITE-01 / EX-03 核实；scriptSources 仅列非注释的静态 script src，动态来源见 docs-browser-testing.md。

`node refactor/scripts/demos.mjs --check` 检查文件/HTML/菜单/包覆盖，不代表网络或浏览器通过。源码 LF 哈希描述历史采集，内容演进不自动覆盖旧值；路径增删需要显式补充和记录。负例进入 test:baseline。生成 document 页面依旧不手改。
