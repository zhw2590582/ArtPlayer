# BASE-HARNESS-01 最小发布包浏览器采集服务

- 日期：2026-09-10；分支：codex/compatible-modernization；起点：1d705b30。
- 提交主题：`test(refactor): [BASE-HARNESS-01] add isolated published API fixture`。
- BASE-02 的独立前置子任务；验收范围是夹具与 HTTP 服务，不包括实际浏览器 API 基线。

新增本地服务，从已校验 tarball 提供指定 JS 成员、从 docs 提供本地媒体；固定路由、限定报告写入和大小，缓存不进入仓库。api.html/api.js 准备公开描述符、配置、同步插件及事件调用采集；没有修改生产包或公开接口，没有新增依赖。

`node --test refactor/scripts/browser-server.test.mjs` 1 项通过：精确 tarball 字节、页面路由、媒体 Range、无效 Range、路径越界、未知产物和异源报告拒绝。`node --check refactor/fixtures/api.js` 与计划检查通过。Node 25.2.1，Windows。

Chrome 工具打开页、读取清单、重置后重试均失败，不能取得真实页面报告。用户明确答复先继续其他实施任务；BASE-02 标 blocked 并保留完整范围，后续恢复浏览器连接再捕获。HTTP 测试不能替代浏览器。服务和夹具维护说明见 fixtures/README.md。

本子任务完成后独立提交，下一项 ENG-01。可回退本提交，不影响生产功能；临时测试进程和缓存不代表测试完成。
