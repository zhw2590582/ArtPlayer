# SITE-EDITOR-VAST-01：编辑器消费者跟随已批准的 VAST 根类型

基线 `4545c436795b3c9ec1600ea2fab8adafe9bcf41b`。完整 Firefox 源码回归
发现在线 Monaco 用例仍引用工作区版 `artplayerPluginVast.ArtplayerPluginVastOption`、
`context.init()` 和 `context.playerOptions`，而 PKG-VAST-04 已按用户批准的
[类型决策](../vast-type-decision.md)恢复 npm 1.0.0 根声明。实际报错为找不到命名空间
（2503），随后回调参数成为隐式 any（7006）。这不是新发现的公开声明回归。

## 修改与兼容边界

只更新当前浏览器消费者：使用 `Parameters<typeof artplayerPluginVast>[0]`
提取历史根入口的回调类型，检查 id、容器、核心实例及 playUrl/playRes。
非法 id、URL 参数、工作区专有 init/playerOptions 和非法 Chapter 时间分别要求
2322、2345、2339、2339、2322。继续要求语法、消费者语义及全部22份声明零错误。
Chapter 仍执行 Monaco 真正生成的代码，等待原生 ready 后销毁，并断言实例清零。
VAST 回调只编译，不调用广告 SDK，也不把这个测试说成 IMA 验收。

没有改生产源码、根声明、/runtime、生成器或生成资源。没有用 any、skipLibCheck、
忽略诊断或删除负例绕过冲突。Node 中针对冻结工作区 VAST 的命名类型和 SDK 检查
继续保留，它验证历史生成路径，不应反过来定义当前编辑器接口。维护入口同步到
scripts/editor-declarations/README.md。无需新增依赖、重建分发或迁移消费者。

## 实际验证

固定 Node 24.21.0 / Yarn 1.22.22，Windows。

- 修改前完整 `yarn test:browser:source --project=firefox --workers=2`：174文件、
  1664项，1662通过、2失败、0跳过、0重试，1460.175秒。运行期间跟踪文件未改。
  原完整 JSON、trace、截图、日志归档保留，见
  [完整源码证据](../baselines/ci-source-firefox-validation.json)。
- 修改后三引擎 `yarn test:browser test/browser/editor-declarations.spec.js --workers=1 --reporter=json`：
  3/3通过，0跳过/重试；全部声明和正例零诊断，五项负例逐项拒绝，Chapter运行及销毁通过。
- `node --test test/editor-types.test.js`：4/4通过，继续验证当前输出和冻结历史消费者。
- 修改的浏览器文件定向 ESLint、严格工具链、计划/风险生成与检查通过；
  风险登记校验器的2项负对照测试通过。

详细结果和输入/原始报告哈希见
[修复证据](../baselines/editor-vast-consumer-validation.json)。

## 完整回归的剩余失败

另一项是裸 dash.js 4.5.2 在暂停后 seek=6 未恢复到大于6.2；没有创建 ArtPlayer，
也没有加载候选插件。候选插件的新旧核心、SDK4.5.2/5.2.1四项严格边界 seek 均通过。
DASH-SEEK-01 保持开放。未修改、跳过或重分类该失败，也未为它增加重试或延长超时。

修复后只重跑相关三引擎用例，不宣称完整 Firefox 回归已全绿。source范围包含
明确冻结的历史包、SDK和分发对照，不等于全部依赖都由源码即时生成；受控窗口、
能力及历史缺陷断言也不等于所有原生功能通过。尚缺完整安装矩阵、WebKit全量、
远端Actions和物理设备，以及三轮发布复盘。CI-01继续doing。

回退本独立提交可恢复原测试和维护记录；公开API和运行时代码始终未变。
本地提交，不推送、部署或发布。
