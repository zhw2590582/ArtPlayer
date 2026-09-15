# SITE-07 Monaco CSS/HTML/JSON worker 来源复现

修改前 HEAD：11296975f100e027f7dcbf7e5be6663bc9978cd3。

本批把临时比对变成可联网准备、离线重复执行的源码验证，覆盖三个完整 worker。
保留现有 Monaco 0.30.1 运行资产、路径和 API；没有升级编辑器或修改其压缩文件。

## 实现与证据边界

- 固定 11 份 npm 归档，检查 SHA-256 和 SHA-512；编译输入取自已有固定上游锁。
  source-map 0.7.3 是 Terser 的嵌套依赖，不能误取根层的 0.6.1。
- 固定 13 份 Git 源码：既有根锁，加三个包各自的 bundle 配方、编译配置、
  本地化 shim 和 worker 适配器；同时检查 Git blob SHA 与内容 SHA-256。
- 七个 npm 包的 91 个完整 UMD 源文件、八个根别名、一个共享 shim 和三个
  worker 适配器，组成 CSS/HTML/JSON 的 48/38/33 个模块实例。完整片段逐字匹配，
  模块之间仅允许空白，不能遗漏 define 外的辅助代码、额外模块或依赖路径变化。
- 三个完整开发版 worker 经原 Terser 5.9.0 配方和头部处理，与当前压缩产物
  逐字节相等。`vscode-nls` 来自 Monaco 自有 filler，三个文件相同，不是锁里的
  同名 npm 实现。适配器用 TypeScript 4.4.4 与其原始标准库发射；只证明产物，
  未恢复整个上游工程的语义类型检查和安装流程。

新增 archives.ts 管理隔离归档与编译器输入；languages.ts 管理 AMD 命名及全文件
源码覆盖；reproduce-languages.ts 组织固定输入、适配器发射、全部来源及压缩验证。
脚本 `yarn verify:monaco-language-sources [--fetch]` 不执行服务运行时或安装脚本。
Node 24.21.0 / Yarn 1.22.22、根依赖及 yarn.lock 保持不变。

核验实际发现并处理了几个差异，未放宽检查绕过：

1. 无结尾换行的 types/main 与 uri/index 源映射注释被旧优化器保留并追加分号。
   按实际字节恢复，而不是忽略所有未覆盖文本。
2. 单文件 transpileModule 的 Promise 类型解析与真实程序发射不同；改用固定
   编译器和标准库的程序发射。未解析的服务 import 不被声称为类型检查通过。
3. 新浏览器测试最初使用了该历史版本不存在的 CSS/HTML/JSON getter；对照原
   mode manager 后改用公共 createWebWorker 和相同 createData，并检查实际 Worker。
4. HTML 格式器保留行内 span 是正常行为；格式化样本改用应分行的块元素 p，
   仍要求实际多行编辑，未删除格式断言。

## 验证与下一步

单元 4/4，通过真实源码复现验证 119 个模块实例；严格 docs-tools 类型检查、
相关 ESLint、工具链检查通过。联网复现及 Yarn 离线入口通过。新增浏览器用例
三引擎 3/3、无重试/跳过，验证 CSS/JSON 正反诊断、HTML 补全/符号、HTML/JSON
格式化、实际 Worker 创建及模型/worker 清理。浏览器版本、原始输出指纹和范围
见 [验证记录](../baselines/monaco-languages-validation.json)。

本批不是播放、真机、外部 SDK、远端 CI 或完整站点验收。服务包的完整原始
LICENSE/第三方说明及内嵌 beautifier、数据来源继续审查；本批没有宣称许可闭环。
Monaco mode bundles、核心内嵌库与语言定义也继续核对。
SITE-07 doing / VENDOR-06 open，总计仍 199/265 done。

回退仅撤销本批来源验证、冻结源码、测试及文档；站点运行资产未变。本地独立
checkpoint 提交，没有推送、部署或发布。
