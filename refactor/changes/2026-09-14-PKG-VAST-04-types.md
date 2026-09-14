# PKG-VAST-04：恢复发布类型并提供准确的双模式声明

基线c162d2b3b3f4fe64c3d178bdf0dc3b8eea32cac5。用户本次独立确认根入口保留
npm类型、未发布工作区类型迁移到/runtime，见[vast-type-decision.md](../vast-type-decision.md)。
这不是沿用Ads或其他四包的专属授权，也没有再次修改上一步初始化行为。

## 类型和模块

根/legacy恢复实际npm1.0.0声明原文：export=、必需callback、旧字段、SDK any与
同步结果误声明。完整typeof、Parameters、ReturnType、普通函数双向赋值与两个
编译器基线均保持；默认根类型没有新增必填default属性或不同重载。

/runtime复用已有三格式JS产物。runtime-api.d.ts统一描述ImaSdk/Player/Settings/
Options、配置、Context和Promise<RuntimeResult>；CJS的d.ts/d.cts与ESM的d.mts分别
提供正确模块形状。实现types.ts引用同一份字段/配置/Result，避免手工维护重复声明。
默认回调Player/id/容器非空且可写；workspace getter可空且只读；动态选项保留联合
上下文，不能推断默认非空。init在终止后可返回null，destroy在await结果中必需。
callback可省略，default自别名在准确入口声明，SDK字段不降级为any。

用户需将未发布工作区类型导入移到/runtime，并选择workspace-1.2；原根类型仍有
已明确披露的同步误声明，实际注册仍须await。README和模块地图包含迁移说明。
本步无新依赖，继续使用已固定的Glomex1.21.2和@alugha/ima2.1.0。新增两个Yarn
类型测试脚本，集成主typecheck和baseline发现；不改变Yarn版本、lockfile或包版本。

## 编辑器与打包修复

CommonJS编辑器生成器此前只允许Factory命名空间类型，不接受旧VAST的内联函数
类型和模块私有别名，首轮构建/测试精确失败。现支持该声明形状；未知导入/导出
仍拒绝。生成文件恢复npm旧global语义；原工作区SDK/Window/命名类型测试改用
校验过的冻结源码，保留旧路径验证，新增候选声明正反例及实际Monaco检查。

根文件的五项样式/声明顺序规则仅对这一个冻结文件局部关闭，以保留npm字节；
新runtime、实现和测试继续正常lint。生成声明只保留必要的历史顺序/别名规则说明，
不以any或skipLibCheck掩盖准确入口。生成器与旧SDK依赖工具文档同步。

首次真实pack检测到内部tsconfig.json泄漏，补充该包.npmignore后通过。源文件、
tsconfig与依赖不进入包。14组消费者从仓库外离线安装实际旧包/最终候选与核心，
再强制frozen重装并验证lock无变化、每个安装成员哈希、非workspace链接及所有
类型解析路径。准确入口实际解析到安装的两层SDK声明依赖。

## 验证及边界

日志、最终文件、安装矩阵与浏览器输入见[验证记录](../baselines/vast-types-validation.json)。

- 旧根原文与候选一致；完整历史工作区消费者冲突可重跑，3项类型提取、1项反向
  赋值、2项缺失字段、1项可空访问失败分别记录。首次正式断言漏计反向赋值诊断，
  补齐实际错误列表；没有删去消费者或改成宽泛失败断言。
- 类型/编辑器/工程20项通过；准确runtime14条反例逐行失败，根3类非法调用保持
  原错误。完整VAST受控SDK运行时82项通过。
- 真正安装14组全部通过，包含TS5.9.3/4.3.5、Node10 CJS、NodeNext CJS/ESM、
  Bundler ESM、不启用interop的import=require。root/legacy/runtime CJS、root/runtime
  原生ESM身份和default别名验证通过；注册用已销毁宿主，不加载真实IMA。
- 三桌面引擎的本地Monaco编译旧VAST回调/工厂、拒绝缺失callback与错误ID类型，
  并实际执行主播放器样例、获得非零解码尺寸。广告工厂只做类型验证。
- 正常VAST构建三格式及docs副本与上一步运行时字节一致；生成编辑器资产通过
  两编译器检查。源与测试lint、严格源TS通过；全项目typecheck通过，检查415个
  生产TS文件，已有核心runtime兼容编译器5.1.6矩阵也通过。
- 初始生成器失败、旧声明样式冲突、打包tsconfig泄漏、历史反例漏计与一次无文件
  修改的PowerShell转义错误分别记录，不混作产品运行时回归。

## 交接和回退

本步只完成04类型/源码声明协调，不替代05真实IMA/设备验收或06完整历史深路径/
浏览器分发。VAST-TYPE-01按用户批准限定接受，VAST-DIST/LIFE和SDK验收继续开放。
本任务独立本地提交并执行提交审计，无push/publish。回退该提交恢复此前工作区根
声明并移除/runtime类型导出及本步打包/生成器修复；上一步两种运行时模式不受影响。
