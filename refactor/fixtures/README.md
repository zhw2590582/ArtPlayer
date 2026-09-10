# 发布基线浏览器夹具

`node refactor/scripts/browser-server.mjs` 在 127.0.0.1:8083 启动独立测试服务；ARTPLAYER_TEST_PORT 可更换端口。它不启动或修改用户的 Chrome，也不占用 docs 的 8082 开发服务。

- `/fixtures/api.html` 加载固定核心/chapter tarball 的真实 JS，准备捕获描述符、默认配置、utils/子系统/插件形状及基础调用。
- `/releases/<name>/<member>` 只读取 releases.json 明确登记的成员；启动时核对 archive 完整性，不使用未编译源码或 CDN latest。
- `/assets/sample/` 读取本仓库样本，支持普通 bytes 范围请求。当前服务用于最小基线；不是完整 ENG-05 故障注入或 HTTP Range 兼容实现，不支持后缀/多段 Range。
- 页面将 `public-api` 报告发送给同源 `/reports/api`，服务器保存 refactor/.cache/reports/api.json。最多 1 MiB；其他 Origin 和未知写入路径失败。临时报告不能自动覆盖冻结快照。

运行 `node --test refactor/scripts/browser-server.test.mjs` 验证真实 HTTP 服务返回原始 JS 字节、样本范围和路由隔离；`node --check refactor/fixtures/api.js` 只检查脚本语法。两者不能证明页面能在浏览器运行。

2026-09-10：Chrome 连接服务连续失败，用户要求先继续其他任务；api.html 尚未实际执行，没有 API 快照或浏览器通过记录。BASE-02 保持 blocked；恢复连接后打开完整 URL，确认页面 PASS、没有错误，再核对报告和来源、生成持久基线。

夹具与报告路径由基线任务维护；ENG-05 可复用并扩充受控等待、媒体错误和正式自动化。api.js 依据已核对源码设计断言，真实发布行为如有不同应调查并记录，不能修改断言来盲目通过。
