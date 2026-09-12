# 全包变更影响映射

ENG-IMPACT-01是ENG-09的影响分析子项。`yarn check:impact --report`已接入`ci:check`，
报告写入`refactor/.cache/ci/impact.json`，由现有CI日志artifact收集。它解释哪些包和
检查受影响，不通过路径过滤减少当前CI任务。

## 模型与校验

`impact-policy.json`显式登记22个包、核心的全部生态验证消费者、站点消费者、跨插件
关系、示例及共享文件。包新增/删除/改名必须同步维护映射，不能默默忽略。
`impact-model.mjs`读取当前manifest并用固定semver解析内部依赖和npm别名的版本
范围；不匹配当前workspace版本时失败。再用当前TypeScript解析src/types/public的
静态import/export/require/import-type及相对跨包引用。未知workspace导入或解析
失败明确报错；计算型动态import使变更保守扩大到全包，并列出需审查的源文件。

关系分开记录：

- manifest及静态导入是实际可观察依赖，沿消费者方向传播。
- 核心到全部21个生态包是**验证契约**，不是声称所有包都有运行时import。
  核心API/DOM/类型/媒体行为改变需要全生态检查。
- 库包到站点是文档、示例及编辑器声明消费关系。
- danmuku到danmuku-mask来自共享`$danmuku` DOM，源码和组合示例作为证据；
  不能只靠package.json发现它。

普通插件源码改动影响自身和站点；修改danmuku还影响mask；核心、共享脚本/类型、
锁文件和根工具配置影响全包。compiled/uncompiled路径映射回源码所属包。
示例的初始所有权来自冻结包清单，SITE-01仍负责遗留示例/历史thumbnail来源的完整
复盘；未分类路径始终扩大到全包，报告`reviewRequired`，不把未知路径当作无影响。

## Git范围

本地默认包含HEAD之后的暂存、未暂存、删除和未跟踪文件；忽略目录遵循Git规则。
`yarn check:impact --base <commit/ref> --report`另外包含该基准与HEAD的merge-base
之后变化。禁用rename折叠，两端路径都会出现，因此跨包移动不会漏掉原包。

GitHub PR读取事件里的base SHA，push读取before SHA；初次push的全零SHA、手动/
复用入口缺少基准、事件基准对象不可用时检查整个跟踪文件集合，并明确记录fallback。
显式传错`--base`报错，不自行猜测。事件内容只用作结构化数据，不拼接shell命令。
报告保存HEAD、实际base/merge-base、是否有工作区变化、文件/策略/manifest/锁指纹。

## CI门槛与能力边界

六项必需命令不能从策略中漏掉：`ci:check`、`ci:build`、`test:package`、
`test:browser`、`test:coverage`、`test:performance`。固定yaml2.8.2解析实际workflow，
检查对应job/步骤无条件执行、没有continue-on-error、没有路径过滤，且checkout有
完整历史。命令被移走、改成echo或增加条件会失败。命令名还必须存在于根scripts。
必需命令必须是步骤首个非空、非注释行，只接受独立命令或当前显式bash的固定tee日志
格式；其他shell包装语法需审查后扩展。条件包装、`|| true`、非bash的tee和YAML布尔
`if: false`均有拒绝反例；checkout本身也不能带条件或允许失败。这是受限结构校验，
不是通用shell解释器，也不证明脚本内部的测试语义。

现有CI继续运行全部这些检查；影响报告没有输出允许跳过任务的开关。报告同时区分：

- `test:package`当前实际只有core/chapter；脚本读取其names数组核对策略，变更范围
  后必须更新声明。其余19个库包完整安装消费仍缺证据，不能因识别为affected而过关。
- 覆盖率范围从实际coverage-policy读取；浏览器/性能命令运行已有用例，不代表所有
  包、真实设备、远程SDK已验收。
- ENG-COVERAGE-01继续把契约、支持版本、测试ID、候选/报告及任务逐项连接；
  本映射不是发布准入或对测试语义有效性的证明。

## 文件与验证

- `impact-model.mjs`：包模型、关系传播、策略和workflow约束。
- `impact.mjs`：Git范围/事件数据、报告及CLI。
- `impact.test.mjs`：实际22包关系、隔离包配置的反例、真实Git改名/删除/暂存/未跟踪、
  PR/push及范围fallback、workflow漏检反例。

新增直接开发依赖yaml2.8.2和semver7.7.4，分别用于解析真实YAML和可靠的版本范围
校验，均固定为当前工具树已有版本。依赖和锁由Yarn维护；没有新增运行时包依赖。
运行`yarn test:baseline`或定向Node测试，再执行`yarn ci:check`。远端GitHub实际运行
仍由CI-04验收，本次本地检查不等于远端成功。
