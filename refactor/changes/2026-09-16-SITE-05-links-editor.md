# SITE-05 全站本地链接与编辑器验证

起点：`6b580d166747d2a1d460666d4259238beb851f4c`。本批加入持续可运行的链接门槛，
并验证原在线编辑器和声明；SITE-05 保持 doing，未进入正式复盘。

## 实现和依赖

新增 `scripts/site-build/links.ts` 与薄 CLI `scripts/check-site-links.mjs`。
`yarn check:site-links` 检查 docs/document 全部生成 HTML 的 href/src、本地文件、
目录 index、中文/转义锚点和历史 name 锚点，并导入实际构建的 search-data 模块
检查所有结果 URL；不是重新生成一份索引再声称发布索引正确。索引缺失/重复/结构
错误或空白会直接失败。HTML 脚本文本与 inert template 内容不作为可点击链接，
不执行页面代码；HTML base 暂不支持时明确拒绝，不静默选错相对地址。外部 URL
只列出，CI 不将整个第三方网络可用性作为确定性构建的条件。

初始 Linkedom TS 版本与 DOM lib 冲突，未加 skipLibCheck 或类型忽略。改用已有
传递依赖 htmlparser2 10.1.0 的有类型解析器，并显式声明为根 devDependency。
Yarn 只增加精确选择器，原版本/integrity 不变；没有新增传递包或播放器运行依赖。
根冻结安装锁不变，严格检查为41个工具/1473个选择器。实现地图和命令写入
scripts/site-build/README.md、站点 README、工具链、CI 与浏览器维护文档。

`ci:check` 增加提交产物检查，`ci:build` 在文档构建之后检查，失败退出非零。
三组回归覆盖实体编码、相对/目录路径、缺失资源/锚点、无效URL及异常索引。
已接入 test:site-build/test:node；未触发远端 Actions。

## 本地验证

Node24.21.0 / Yarn1.22.22：

- 67个生成页面、5766次本地引用、942条真实构建搜索结果，缺失文件/锚点均为0。
  报告列出82个外部URL；不是82个已验证外部锚点。
- test:site-build 11/11，1334.8651ms；test:ci 80/80，5761.8837ms；均0失败/跳过。
- typecheck:docs-tools、修改文件只读ESLint、严格工具链、site inventory和CI配置通过。
- check:editor-types校验24份输出及当前/兼容编译器；check:site-assets校验5份产物/66路由。
- source浏览器命令包含site-editor、site-loading、editor-declarations、editor-types、
  document-search及document-site。Playwright按正则匹配，实际还选中Ads/Audio/DASH/
  HLS/Thumbnail的编辑器类型文件；报告记录全部72项，三引擎各24项，0失败/跳过/重试。
  覆盖真实Monaco编译/运行、Ctrl-S、重复Run、语法错误保留旧播放器、CSS/脚本顺序、
  拒绝storage的降级、持久设置、声明加载失败清理、迟到示例不覆盖新Run、语言路由、
  嵌入代码URL/依赖转发及搜索交互。部分SDK用例有受控替代，不代表真实SDK或设备验收。

浏览器和静态结果见 [site05-links-editor.json](../baselines/site05-links-editor.json)。
媒体库源码未变，不将本批浏览器检查替代安装包、真机或EX-03全部示例矩阵。

## 外部链接缺口

首次Node直连81个去掉fragment后的外部地址：2个200、79个连接/超时错误。
检测系统代理后，用curl HEAD跟随重定向复测81个，每个一次、4并发、每请求15秒上限：
42个200、39个404，无传输失败。HTTP成功只证明本次可达，不验证远端fragment或SDK功能。
39个404全部是新增指南的GitHub master编辑源文件链接，本地源码存在，默认分支尚未
包含它们。保留准确目标，不跳转到其他页面冒充编辑当前文件，也不擅自推送/合并。
SITE-05继续doing，远端源码可用后重验；SITE-06最终交付仍依赖SITE-05和字体来源SITE-07。

共享输入变化后的21库候选刷新仍由REL-02处理；旧候选证据不代表当前共享指纹。
回退本提交移除新检查、devDependency/脚本和记录；播放器API、生成文档URL不变。
没有推送、部署、发布或启动用户保留的正式复盘。
