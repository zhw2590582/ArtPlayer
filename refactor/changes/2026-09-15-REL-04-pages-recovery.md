# REL-04 完整旧站点恢复与归档换行修正

完整旧站点的本地恢复已验证，REL-04 继续 doing：Thumbnail 原 npm 包/完整替代
方案仍缺，远端部署恢复由 CI-04 承担，正式批次仍须绑定其实际产物。

## 已复现问题与处理

CI-02 保存的固定 gh-pages ZIP 哈希没有变化，但它受本机 `core.autocrlf=true`
影响，403 个文本文件被转换为 CRLF，无法通过原始 Git blob 逐字节核验。
例如 CNAME 的 Git 内容为 21 字节，旧 ZIP 为 22 字节。全部 403 处差异经诊断
均为 CRLF 转换，没有把该诊断的归一化结果当作精确恢复通过。

用同一个文件和提交，显式 `core.autocrlf=false`、`core.eol=lf` 生成 ZIP，CNAME
恢复为原始 21 字节。最终对完整站点重新归档，538 个文件全部与 Git blob 一致。
原 ZIP 和首次失败均保留；没有改本机/仓库 Git 配置。Git 换行配置行为参考
[官方属性说明](https://git-scm.com/docs/gitattributes)，具体归档差异以本地对照证据为准。

## 结构与实际演练

- `scripts/pages-recovery.mjs` 校验旧归档身份，读取固定 Git tree，在命令级固定换行设置生成完整 ZIP；提取前检查成员路径/清单，不执行归档中的代码。
- `scripts/pages/recovery.ts` 核对所有文件、字节数和 Git blob；恢复前验证准备目录，再保留失败目录并替换演练站点。第二次 rename 失败会尝试恢复原目录，不声称远端或多请求原子切换。
- 先在隔离站点损坏核心脚本、修改 CNAME、删除 iframe.html、新增遗留文件，再证明损坏检查失败并完整恢复。没有编辑工作区 docs/dist。
- `test/pages-recovery.test.js` 复现同长度内容损坏和多余文件，验证预检失败不触碰当前站点，成功后保留原失败副本。已接入普通 Node/Pages 测试。
- `test/pages-recovery-browser.mjs` 从恢复后的目录提供真实 HTTP/Range 和原始 HTML 字节，12 个历史路径响应哈希一致，三引擎 UMD/ESM 的 6 个真实播放/暂停/seek/章节DOM/销毁检查通过。

首轮浏览器六项播放均通过，但 HTTP 媒体传输的 premature close 导致总结果失败。
最终只把准确媒体路径、`request.aborted=true`、`ERR_STREAM_PREMATURE_CLOSE` 三者
同时成立的传输中止单独记录，其他服务错误仍失败；没有放宽播放器断言或增加超时。

新增 `test:rollback:pages` 和 `test:rollback:pages:browser`，不增加依赖。维护说明
见 [Pages 工具](../../scripts/pages/README.md) 和 [恢复流程](../pages-deployment.md)。
完整指纹与结果见 [机器证据](../baselines/pages-recovery-validation.json)。

本次只验证固定旧站点在本地的完整恢复。Thumbnail 网站运行文件存在，不等于找回
它的原始 npm 包；本轮没有重跑其图片提取。未切换 Pages source/域名、未运行
远端 workflow、未推送或发布。回退工程实现可撤销本提交，远端状态不会变化。
