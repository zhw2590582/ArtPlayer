# PKG-ADS-04 类型与导入兼容

本步完成公开类型迁移；整个 Ads 发布验收未完成。起点 `39e2d4cd`。

## 实际改动

- 公开声明补齐真实 html/video/url/i18n、同步 Result 与四种输入形状。
  根入口以 export= 和类型命名空间保存旧 CommonJS/全局模式，增加 ESM/CJS 声明桥。
- `/runtime` 指向同一 JS 文件，只提供准确参数；根入口保留两套历史输入接受面。
  src/types 复用公开形状，options 中现有 validator 后才断言归一化结果，无字符串转换。
- 入口增加 `.default === factory`，兼容实际 npm 的 require(pkg).default 调用和
  工作区 callable 调用；未模仿旧模块对象不可调用、Object.keys 等 namespace 反射形状。
- 编辑器生成器显式支持纯类型 namespace，拒绝未知导入和不支持的节点；实际 Monaco
  从 docs/assets/js/vs 加载、编译并运行当前生成声明及真实 bundle。
- 新增 `yarn test:ads-types-package`：临时打包、工作区外离线安装、冻结重装、所有成员
  哈希验证、五种编译模式与 Node require/import 同一运行时验证。未增加依赖或锁文件变化。

## API-09 / API-11 已确认差异

实际 npm 1.0.6 的 totalDuration 声明为 string；未发布工作区 2.1.0 为 number，
并要求 source/type。两者与实际运行时字段不同。普通调用和配置对象赋值已同时验证，
但无法把同一属性既准确推导为 string 又推导为 number。

当前兼容输入使 `Parameters<typeof ads>[0].totalDuration` 读取为
`number | string | undefined`。原发布消费者把它赋给 `string | undefined` 会产生
TS2322；原工作区把 source 赋给 string、duration 赋给 number | undefined 也会产生
TS2322。这是真实兼容差异，不能因为旧输入调用通过而称所有旧 TS 程序无改动兼容。
`LegacyOption` / `WorkspaceOption` 和准确 `/runtime` 可表达各自形状，但要求用户
修改类型写法本身不算无改动兼容。

2026-09-12，向用户提供上述具体影响和验证结果后，用户明确答复：
“接受这项类型推导修正，写清迁移说明并继续”。ADS-TYPE-01 据此标为
accepted-with-scope，仅接受两套历史声明矛盾导致的 scalar 推导修正；不扩大到其他
API、运行时行为或发布豁免。README 提供准确 Option、/runtime、数字字段及泛型
输入收窄迁移说明，类型测试也编译同样的安全读取模式。

`refactor/scripts/ads-types.test.mjs` 从校验过的发布 tarball 和冻结 Git 声明读取旧类型，
同一普通消费者在旧/新声明通过；额外 scalar 消费者先在旧声明通过，再精确断言候选
1/2 个 TS2322。此诊断测试持续保留；差异的接受依据为上述用户明确决策，测试本身
只证明实际影响范围。

## 验证与接续

执行结果与输入哈希见 [执行证据](../baselines/ads-types-validation.json)。
源码/三格式 Node、五模式类型、安装及编辑器测试均单独列出；全屏/真隐藏页/设备、
完整历史 dist 路径和最终发布门槛继续由05/06承接。已有 DASH 风险保持开放。

实际模块地图与维护命令见 [包内架构](../../packages/artplayer-plugin-ads/ARCHITECTURE.md)。
撤销本步时同时撤销入口 .default、公开声明/桥、manifest、生成产物和消费者测试；
保留03生命周期修复。按任务独立本地提交，无推送、tag、合并或发布。
