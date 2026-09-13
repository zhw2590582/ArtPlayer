# PKG-AUTO-THUMB-08 兼容公开类型与异步入口

从尚未开始的 04 中拆出独立声明交付，依赖已完成的契约、测试与类型基础设施。
04 仍依赖 03 和本任务；03 的 WebKit 首两格像素等门槛没有移走或降低。
本项不等于整个 Auto Thumbnail 包完成。

## 实现与兼容边界

实际 npm 1.1.0 的根声明保持原字节（仅允许 checkout 换行格式不同），包括必填
options、同步 Result、Parameters/ReturnType、普通替代函数和模块 default 形状。
没有为修正 Promise 返回值给旧工厂追加重载、属性或改变类型提取。

新增可选 `/runtime`，通过 package exports 复用根入口的 main/ESM 文件，没有
另一套运行实现。runtime-api.d.ts 定义 Option/Result/Factory，三个薄声明入口
分别处理 NodeNext ESM、CommonJS 和旧 Node10 解析。Promise 只代表注册完成，
不代表抽帧完成。工厂实际没有 `.default` 自引用，因此声明也不提供；历史忽略
的 height 在准确选项类型中保留并注明，number/scale/width 仍有明确数字类型。
内部 option 与这份声明共用，入口显式返回 Promise<Result>，实施 fixture 校验
真实源码函数可赋给公开 Factory，避免声明与自有源码分离漂移。

新增 typesVersions 也补齐 Node10 对旧 `/legacy` 子路径的声明解析。真实 npm
1.1.0 在该路径存在 TS2307，TS4.3.5 另有依赖此 unresolved type 的 TS2344；
保留精确历史诊断，并另用根入口验证旧消费者。未把历史失败吞掉或称为旧包通过。

编辑器声明现在走已有语义生成器，避免同时出现 export default 与 export =。
旧生成方式的 TS2309 有回归；新全局 callable 保留旧同步形状。没有往原根模块
添加 Option/Result 命名导出；旧类型仍通过 Parameters/ReturnType 提取。

README、ARCHITECTURE 与 tests README 同步维护实现地图、使用方式和验证范围。
没有新依赖、锁文件变更、包版本提升、推送或发布。

## 验证与中间失败

结果及实际包/文件指纹见 [验证记录](../baselines/auto-thumbnail-types-validation.json)。
最新 npm 1.1.0 和候选实际 tarball 在仓库外安装，以固定 Yarn 离线强制 frozen
重装并核对每个归档文件字节。TS5.9.3 的 Node10/CJS/ESM/bundler 与 TS4.3.5
Node10 共十组；候选另验证三组关闭 interop 的 CommonJS 消费。
正例检查完整工厂、参数元组、结果和普通模块替换；负例逐行匹配，避免 any 或
未解析模块导致假绿。实际安装 JS 测试 root/legacy/runtime 的 require/import
形状、共享函数身份、Promise 注册、结果及候选订阅清理，不触发视频提取。

初次编辑器测试误用未从根模块导出的命名类型，已改为原有类型提取；没有扩大
根 API 来迁就测试。初次历史诊断断言未区分 TS4.3.5 与 TS5.9.3 的二级错误，
已按实际版本精确记录。真实 no-interop 安装测试发现 runtime-api 的 default
core import 在 NodeNext CJS 下失败，改用核心模块的实际 constructor prototype
类型提取后通过。原失败报告在缓存中保留。最初 Yarn exec 未找到 eslint binary，
改用固定 Node 执行已安装的 ESLint；工具链 frozen 安装和严格检查另行通过。

本项类型工作不是首帧修复，也不代表三浏览器重跑。历史 1.0.x 的 export= 与
1.1.0 的 default、height/number 声明差异已是发布历史的一部分；根保持 1.1.0，
本次没有新增旧类型破坏授权。1.0.x 的完整隔离消费/导出门面仍留在 04/06 与
AUTO-THUMB-TYPE-01、AUTO-THUMB-EXPORT-01，不能仅凭本项关闭整个历史范围。

## 回退与接续

本提交可独立 revert：移除新增类型入口、选项共享和语义编辑器生成接入，恢复
原 manifest、生成文件与测试脚本；原运行算法不变。保留 07 的画布清理修复。
接续优先处理 03 的抽帧真实像素与资源边界；04 汇总自有源码、全部旧消费范围，
05/06 再执行组合、设备、分发及文档完整验收。
