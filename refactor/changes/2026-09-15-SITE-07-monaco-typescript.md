# SITE-07 Monaco 内嵌 TypeScript 来源与许可

修改前 HEAD：fb1faffbe9a7a8acfd5aa8dcc19177daf5806406。

Monaco 0.30.1 的上游 ThirdPartyNotices 仍写 TypeScript 2.7.2，实际 tsWorker.js
及对应提交锁文件是 4.4.4。本批保留原上游文本，新增准确版本的补充说明和
LICENSE.txt、CopyrightNotice.txt、ThirdPartyNoticeText.txt 三份原文。
最后一份包含 Unicode/W3C/WHATWG/Khronos 等声明，不能用只有 Apache 名称的
短说明代替；原始文件编码和换行按 Buffer 保留。

## 来源与实现

固定 Monaco 提交 5a7ba61be909ae9e4889768a3453ebb0dec392e2 的 package-lock.json、
TypeScript 导入脚本与 bundle 脚本，核对 Git blob 和 SHA-256。官方 TypeScript
4.4.4 服务源码经过上游六处浏览器适配、source-map 删除和顶层 strict 指令处理，
与 Monaco 开发版 worker 的 9,698,327 字符片段完全相等。完整开发版 worker 再经
锁定 Terser 5.9.0 和 source-map 0.7.3 压缩，加固定头后逐字节等于当前 worker。

新增 monaco/typescript.ts 负责有限转换边界，reproduce-typescript.ts 负责归档、
Git、成员、许可和最终产物校验。前者使用已核实配方的等价正则，不执行上游
导入脚本的文件写入或 npm 命令。后者只执行已校验的历史 minifier 及其依赖，
隔离在忽略缓存中；不修改根依赖/锁，也不执行 TypeScript 服务运行库。

新脚本 yarn verify:monaco-typescript-source 支持联网取证和离线重验；普通 CI
继续只生成并检查 notice。新增单元加入 test:node，源转换缺失/重复、错误 worker
和缺失许可会失败。本批没有改动任何 Monaco JS/CSS/font 字节、旧路径或 API。

落地时修复两类检查问题：ES2021 类型环境使用 pop() 替代 Array.at()；严格指令
校验只匹配顶层整行，保留 TypeScript 内部生成代码中的字符串，不把出现次数
误认为重复指令。没有提高目标版本、放宽 TS 检查或通过删测试解决。

## 验证与后续

- 单元 10/10；docs-tools 严格类型和相关 lint 通过。
- 完整联网复现和 Yarn 离线入口均通过：4 归档、3 Git 文件、完整 worker 精确匹配。
  Node/Yarn 严格工具链检查通过，根依赖及锁文件未变。
- 三引擎编辑器/实际交付共 6 项通过：核心及 VAST 声明的正确/错误诊断、
  TS 编译示例 ready、有视频尺寸，以及 69 份 notice 的 HTTP 原文字节、移动
  控制台播放与销毁。不是 Google IMA 外部 SDK 或真机验收。
- [验证记录](../baselines/monaco-typescript-validation.json)保存版本、指纹及范围。

VENDOR-06/SITE-07 继续开放。字面 AMD 名称还识别出 CSS/HTML/JSON language
services、URI/textdocument/types、jsonc-parser 和 nls；这些只是后续审查入口，
锁文件依赖名不自动证明每个模块已完整重现。尤其 nls 可能是构建 shim，不能
仅凭安装版本认作该 npm 包原运行代码。核心动态模块和语言定义也继续审查。

回退移除本批补充 notice、校验和脚本接入，保留原 Monaco 资产。独立本地提交，
没有推送、部署或发布授权变化。
