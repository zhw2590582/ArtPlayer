# PKG-DPIP-01 实际发布和窗口契约

完整捕获四个发布版本/21成员及7个Git工作区输入。首次捕获遇到1.0.0缺少main文件，
核对tarball后确认同时缺main/module/legacy；保留首次日志并让捕获/验证明确记录缺失，
没有用仓库源码填充。现有checkFiles对这份真实清单失败，行为测试只执行其余三份
归档和冻结工作区，1.0.0仍保留类型与分发对照。

新增16项正常契约：同步Result、状态getter和能力快照、默认/fallback、控件、窗口
节点迁移、样式属性、tooltip/事件/Promise顺序、close还原、options浅拷贝与延迟style。
源码LESS在冻结输入上编译后注入受控loader，归档直接执行实际代码；没有修改生产源码。
open/close的Promise与旧void声明、options可省略与必填声明、getter与可写声明、
两代CommonJS形状等差异已登记。窗口竞争和错误回滚仅source-observed，交给02复现。

契约索引增加四个实际发布点，合计22工作区+15发布；家族仍264、精确索引case仍10，
255行尚未精确索引，不能把本步通过直接填成所有契约通过。1.0.0发布点明确无runtime。

联合验收依赖也同步修正：Canvas05需DPIP04，DPIP05需Canvas04和MB04。三方04
内部迁移没有循环依赖，05需使用最终包组合；原有设备/SDK要求全部保留。

详见[契约](../baselines/dpip-contract.md)、[维护入口](../dpip-validation.md)与
[验证证据](../baselines/dpip-contract-validation.json)。本任务完成后独立本地提交，
不推送/发布；下一步02建立失败回归并推进03源码修复。

最终23项定向检查、lint及完整CI1068项通过（938单元+14工程+116基线），另44项重复契约观察，284个生产TS文件严格检查。本步done并独立提交；正常受控窗口测试不代表原生Document PiP验收。
