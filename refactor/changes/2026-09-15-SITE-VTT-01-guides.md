# SITE-VTT-01：VTT 缩略图双语指南与实际裁剪验证

基线 `d3349e83f24fdea3fa55fdfa6254cb1587fc5a26`。从 SITE-04 拆出独立任务，
依赖 SITE-03、PKG-VTT-THUMB-04；保留父任务全部旧依赖并追加本任务。

## 修改及契约

新增中英文完整指南，侧栏指向本地页面，旧在线编辑器 URL 留在指南中。
两份 Run Code 与 docs/assets/example/vtt.thumbnail.js 原样一致，浏览器测试
在运行前强制比较。没有修改插件源码、类型、dist、版本、依赖或原 demo。

逐项核对 index/request/lifetime/parseVtt/preview 与公开声明，解释：

- VTT/图片相对目录、xywh 数值约束、格式扩展与解析限制；并非普通字幕排版器。
- 时间向下取整、两端包含、文件顺序优先；空档隐藏、显示样式覆盖与移动拖动边界。
- 真实异步注册、请求/格式拒绝与图片加载的不同阶段；取消可返回名称但不挂 UI。
- 没有 update/reload/destroy API；切主视频不会换索引，不把重复安装当更新接口。
- 根/legacy 保留最新已发布 1.1.0 类型，runtime 提供准确 Promise 和 default 别名；
  较早 export= 与 NodeNext 历史形状的迁移说明遵循已批准的兼容规则。

同步更新包 README/ARCHITECTURE、站点维护地图和浏览器用例说明。没有新增生产抽象。

## 验证及首轮失败

Node 24.21.0、Yarn Classic 1.22.22、TypeScript 5.9.3，Windows。

| 检查 | 结果 |
| --- | --- |
| 两份公开入口 TS 示例 | strict NodeNext、types:[]、skipLibCheck:false，各零诊断 |
| 两份生成 HTML | 每页 23 个本地链接目标存在、1 个 Run Code，库参数正确 |
| 文档工具测试 | 17 pass |
| Yarn test:site-build | 7 pass |
| scoped lint、build:llm、build:docs | 通过 |
| 首轮浏览器 | 6 pass / 6 fail，失败记录与 trace 保留 |
| 最终浏览器 | 12 pass / 0 skip / 0 retry，56.1 秒 |

首轮 Cr/Firefox 的四例在完成红蓝截图后因测试发送 hover setBar 时没有 MouseEvent
而失败。核心其他订阅会访问事件路径；最终补齐事件参数，没有修改核心来适应错误测试。
WebKit 两例实际得到原视频 596.458 秒，未得到拦截替换的 8 秒夹具：原生媒体后端
会绕过请求拦截。最终移除视频替换，三个浏览器全部使用原 demo 的 BBB 视频，按其
实际时长与内容哈希验明输入；受控 VTT 的边界改为 300/500 秒，末尾留空档。
这些是测试夹具修正，不是生产缺陷修复，没有放宽断言、增加超时或跳过浏览器。

最终六项交互使用本地插件 dist、新旧核心、原示例代码和视频，受控 VTT/SVG 经
真实 fetch/CSS 图片加载。真实鼠标选择两个区域，pngjs 读取实际控件截图中心像素，
分别严格等于红/蓝 RGBA；精确 300 秒边界通过带 MouseEvent 的公开 setBar 输入，
验证第一条优先，避免鼠标坐标取整。继续验证空档隐藏、destroy(false) 移除控件及
迟到事件不复活。另六项验证三引擎双语侧栏、生成页面和 Run Code 编码目标。
没有替换媒体属性、解析器或绘图函数；截图并非仅解码原图后自画的替代结果。

使用既有 pngjs 依赖，没有安装依赖或新增项目脚本。检查工具链时直接 node 调用
严格校验按预期拒绝缺少 Yarn 上下文，改用固定 Yarn 的 check:toolchain --strict
通过；没有伪造环境变量绕开检查。

8082 内置浏览器 tab13 加载原始示例，观察 09:56 时长和 loadedmetadata、loadeddata、
canplay、canplaythrough。仍暂停 00:00；未操作悬停或播放，工具没有返回浏览器版本，
因此仅计真实 demo 加载，不能替代自动化交互或物理设备证据。

最终自动化使用 Chromium 153.0.8010.12、Firefox 155.0、Windows WebKit 26.6。
哈希、逐例截图/输入证据和日志路径见 [vtt-docs-validation.json](../baselines/vtt-docs-validation.json)。

## 状态与回退

SITE-VTT-01 完成后为 211 done / 21 doing / 43 todo，共 275；站点 36 Markdown、
45 HTML，中英各 18 页。SITE-04 和 VTT 05/06 保持原门槛；没有证明物理触摸、完整
播放、全部插件组合或安装发布验收。没有推送、部署或发布。

生成站点和 LLM 输出由项目构建命令写入；全量 diff --check 的新 HTML 模板尾随
空白按生成器既有输出保留，排除两份生成页面后的检查应通过，不手改生成 HTML。
回退本任务独立提交即可恢复指南、导航、测试与生成输出；原插件实现和 API 不受影响。
