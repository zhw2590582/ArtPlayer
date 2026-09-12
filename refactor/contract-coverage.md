# 契约、版本与测试证据维护

ENG-COVERAGE-01建立可校验的归属和证据索引，不把索引建成当作全项目兼容通过。
[生成的索引](contract-index.md)覆盖compatibility.md的12类契约及实际22包，共264行。
每行有责任任务；未整理的测试、精确支持范围、设备和发布包验证保持缺口。站点契约
适用性由SITE审查，不给文档站编造播放器构造器。逐成员复盘仍属各包契约及REVIEW-02；
宽泛API编号不是每个方法、参数、事件都已测过的证明。

## 数据与版本

`contract-policy.json`维护逐包逐类责任、版本依据及稳定测试ID。版本用JSON pointer
指向冻结清单，核对包名、版本和发布archive integrity；工作区单独标识。当前22个
工作区、11个发布对照点（Canvas代理新增两个），不由单个版本推断连续支持区间。

`contract-runs.json`引用归档报告及LF规范化SHA-256。报告保存当时定义、实际事件、
输入指纹、命令、HEAD和Node/OS。其他tasks.json历史JSON证据列为recorded-not-normalized，
保留原文及任务，不能按通过总数猜具体断言已执行。

本批逐条核对10个已有断言，涉及核心配置、注册、事件、存储及chapter归一化。五个
文件执行44项，仅精确匹配的10项作索引观察，其余34项不自动分配契约。255行尚未
录入测试ID，表示索引缺口，不表示这些功能都没有测试；历史事实仍查包记录及changes。

## 命令与CI

```sh
yarn test:contracts
yarn check:contracts --write
yarn check:contracts --report
```

执行器使用独立Node进程，固定文件列表且不接受过滤器；清除ARTPLAYER产物覆盖及
NODE_OPTIONS，避免把临时指定产物误记为当前源码。执行前后核对包源码/声明/manifest、
测试/脚本/夹具、工具锁及版本依据；输入变化拒绝结果。指纹是实际字节快照，换行或
相关脚本变化也会保守判旧。

Reporter记录Node实际pass/fail/summary的文件、名称、skip/todo及整体结果，不按数量
猜通过。接口依据[Node24官方文档](https://nodejs.org/docs/latest-v24.x/api/test.html#custom-reporters)。
测试ID须唯一对应源码中的Node test字面量调用；参数化、浏览器和类型报告仍保留
历史原始记录，后续增加各自解析器及反例，不能用当前适配器假装已经覆盖。

CI先执行观察，再检查索引。`refactor/.cache/ci/contracts-run.json`保存本轮结果，
`contracts.json`保存动态索引，随已有checks artifact收集。原始事件和stderr另存
`refactor/.cache/contracts/run-*/`。原有测试不减少；44项重复执行是链路验证，不算
新增44种功能覆盖。

## 状态

| 状态 | 含义 |
| --- | --- |
| tests-not-indexed | 尚无精确映射，仍有责任任务 |
| planned-not-observed | 映射存在，没有结构化执行报告 |
| partial-observations | 有具体结果，不代表整个契约类或包通过 |
| current-inputs | 定义及输入指纹与当前一致 |
| historical-inputs | 定义一致，源码/测试/工具等输入已变化 |
| historical-definition | 定义已变化，保留旧定义实际范围 |
| skipped / failed | 原始结果原样保留，不折算成通过 |

无效路径、重复ID、错误任务、错包/版本/integrity、无实际测试、报告被修改或结果
矛盾会失败。旧输入、未索引或缺环境明确列为缺口，不阻止无关迁移；对应发布由REL/
REVIEW把关。哈希和结构只能证明对应关系，不能证明断言充分，也不是证据数字签名。

## 后续AI维护

1. 修改前检查包的12行及历史报告，定位具体公开成员/参数/事件并核对适用性。
2. 登记稳定ID、精确文件/标题、命令、版本依据、断言范围和限制。ID不能改归其他包；
   旧报告保留旧定义，不能重写历史消除差异。
3. 修改后执行test:contracts。归档时复制实际report.json到baselines/contract-observations，
   将LF哈希加入runs；核对输入、skip/todo、整体失败及语义，不手写passed。
4. --write更新静态表，--report检查动态结果，再跑ci:check。done及独立commit遵循
   commit-audit；不能拿旧CI总数批准新实现。

支持窗口仍需包契约、旧核心组合和环境证明。VAST的VPN例外不改变类型、生命周期或
其他包结论；当前没有据此新增skip。
