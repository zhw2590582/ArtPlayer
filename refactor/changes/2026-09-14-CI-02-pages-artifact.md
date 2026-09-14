# CI-02 Pages产物预检与独立部署

生产构建只更新compiled，而现有移动页、iframe和编辑器示例继续使用uncompiled。
直接上传docs可能保留旧开发产物。本次在独立暂存目录按现有开发配置构建21个旧入口，
保持旧URL/全局名称/开发模式，工作区docs和包产物不被改写。没有更换播放器API、版本或依赖。

新增pages/artifact.ts负责文件、路径、域名和compiled一致性，prepare.ts负责暂存和
调用现有library构建模块，入口CLI只处理命令/输出。包源码、构建输入和完整站点输出
都有指纹。CNAME/.nojekyll、旧HTML、语言/编辑器/i18n入口必须存在；规则不声称覆盖
所有动态外部链接。test:pages及test:pages:browser加入package scripts，普通Node测试
运行文件/工作流回归，浏览器验证仅在显式命令或受信任Pages准备分支中执行。

工作流先build，再prepare，再安装浏览器和执行暂存入口检查，最后上传准确site路径。
部署继续等待全部CI作业成功，保留master/启用变量/manual/environment限制；仅deploy
有Pages/OIDC写权限。不增加远端操作，失败不上传用于部署的站点，但保留诊断报告。

## 实际验证

- 21个入口构建成功，63项compiled/dist比较一致，暂存546个文件；正常目录与包源码未改。
- 55项CI/文件/权限回归通过；严格library TS、定向lint与actionlint1.7.12通过。
- 同一暂存目录的demo/ESM两种入口，Windows Chromium153.0.8010.12、Firefox155.0、
  WebKit26.6共6项实际播放、章节更新、网页全屏和销毁检查通过。
- 首轮拦截MP4完整响应使WebKit两项超时；第二轮跨端口原生HTTP使Chromium两项媒体
  ERR_FAILED，其余通过。最终使用同源HTTP/Range。没有确定跨端口错误的浏览器内部根因。
- 同源首轮全部走完播放，但Chromium两项把媒体ERR_ABORTED并入脚本错误断言而失败。
  修正为记录网络事件、检查脚本加载错误/JS异常以及播放时的video.error。保留原失败报告，
  没有为掩盖产品错误增加等待或关闭浏览器；首轮默认30秒，最终显式10秒。
- Pages API、分支/环境只读查询和7个线上HEAD200留档；部署变量返回404、启用状态未知。
  旧gh-pages提交的本地ZIP已保存；没有修改Pages source或发布站点。

证据见[机器记录](../baselines/pages-artifact-validation.json)，维护地图和恢复流程见
[部署说明](../pages-deployment.md)。CI-02只完成本地实现；CI-04仍负责真实远端run、
环境迁移、部署后探测及故障演练。站点/插件/设备/许可和发布复盘未自动完成。

回退本提交恢复原工作流上传docs的配置，移除新脚本/测试/状态；远端设置不会随Git回退，
必须按部署说明单独处理。不push、不publish，也不执行远端恢复写入。
