# PKG-MULTI-SUB-04 公开类型与实际安装检查点

本次处理 API-06/09/11。根入口和 legacy 保留旧的必填 subtitles 数组、可选轨道字段、
同步 LegacyResult 推导以及可被普通函数替换的工厂类型；新增 `/runtime` 入口提供实际的
Promise<Result>、tracks(names?) 和 reset()。Result/RuntimeOption 由公开定义统一维护，
内部实现复用，parser 与资源宿主边界仍为私有。没有把 Promise 伪装成同步结果。

## 最终入口与旧用法

- `import subtitles from 'artplayer-plugin-multiple-subtitles'` 和 `/legacy` 的旧默认导入、
  Parameters、ReturnType 和替换函数仍通过；旧返回声明只保留 name，运行时始终异步。
- 新代码可 `import subtitles from 'artplayer-plugin-multiple-subtitles/runtime'`，通过
  `await subtitles({ subtitles: [...] })(art)` 无断言取得 tracks/reset；options 必传，{} 合法。
- root/runtime 复用同一产物及函数。现代和 legacy 函数增加可写、可枚举、可配置的
  `.default` 自引用，兼容旧 CommonJS 对象的有效 default 调用；现代直接调用继续有效。
- root/legacy 使用独立 .d.mts/.d.cts 转发默认声明；runtime 的 .d.cts 用 export= 提供
  直接及 default 调用；typesVersions 支持 classic 解析。包内新增五个声明文件。
- 编辑器通过正常 build:ts 语义生成旧全局工厂及命名类型空间。RuntimeFactory 是类型，
  没有新增同名全局函数。onParser 保留原字段类型及不调用的运行时行为。

## 实际兼容冲突仍待决

真实 1.0.0/1.1.0 包的 CommonJS 是对象.default，但声明 export= 将模块描述成直接函数；
1.2.0 运行时是直接函数，声明却是默认导出模块。安装消费者已分别复现：

| 类型写法 | 1.0.0 / 1.1.0 | 1.2.0 | 本次候选 |
| --- | --- | --- | --- |
| default import，Parameters/ReturnType，普通函数替换 | 通过 classic | 通过 classic | 五种模式通过 |
| import=require 的原始模块直接提取/替换 | 类型通过；实际直接调用失败 | 类型失败 | 类型失败 |
| import=require 后取 .default 再提取/替换 | 类型失败；实际调用有效 | 类型通过 | 类型通过；实际也可调用 |
| NodeNext ESM 默认导入 | 通过 | 原声明 8 项诊断 | 候选通过 |

不能将原始模块同时改成“可调用且必须有 default”的类型来静默结束任务：这样普通替换
函数会缺少 default；若 default 可选，则已有无断言 default 调用失败。两个失败分别有
2322 和 2722 的编译复现，TS 5.9.3/4.3.5 覆盖。当前候选保留 1.2 的模块声明，旧 JS 两种
有效入口均可运行，但未声称兼容所有旧类型提取。需要明确接受这项类型迁移差异才能关闭
对应边界；此前 Ads 的参数推导修正授权不自动覆盖此项。04 和 TYPE/EXPORT 风险保持 open。

## 已执行验证

- 本包 274 项通过；源码/main/legacy 正常、生命周期、合并各 39 项通过。新增两项验证
  script global/CJS 自别名、属性描述符、真实 async 注册、void 方法及销毁清理。
- 公开类型五模式正例通过，移除 expect-error 各准确拒绝 12 个非法用法；实际旧三个
  tarball 声明与默认导入/替换消费者分别通过 TS 5.9.3/4.3.5 classic 检查。
- strict 生产源码 TS 5.9.3/5.1.6 及每编译器 9 个负例通过；编辑器每编译器 2 个负例。
- 新增 `yarn test:multiple-subtitles-types-package`：三个已发布 tarball × 五模式，
  候选实际 pack × 七模式，共 22 格；旧 1.2 NodeNext ESM 的失败单独登记，不计为兼容成功。
  使用仓库外消费者、packed core、offline install/frozen reinstall、锁字节一致和全部
  已安装成员字节核对，断言无 workspace 符号链接或类型逃逸。实际 Node 验证 root/runtime
  CJS/ESM 的身份以及 legacy default/require 的身份，不只检查 manifest 路径存在。
- 初次矩阵复现旧 1.2 NodeNext 无上下文 callback 的 7019 诊断；另一次核对发现旧 TS
  诊断顺序不同。核实具体旧包错误后固定各编译器预期，没有把候选失败列为允许项。
- Chromium 153.0.8010.12 / Firefox 155.0 / Windows WebKit 26.6，发布/候选核心，
  三入口每个 36 项、共 108 项通过。覆盖 SRT 显示/选择、取消、Blob、HTTP、视频切源、
  内嵌时间戳。无 skip/flaky；不是物理 Safari、移动设备或全部旧核心验收。
- 完整 CI 2344 项通过（1989 单元、14 工程、341 基线），严格生产 TS 353 文件；显式
  lint 通过。正常 build 生成三个 dist 及 docs 副本，逐字一致；正常 build:ts 更新编辑器。

完整检查及内容指纹见[证据](../baselines/multiple-subtitles-public-types.json)。新增脚本已接入
本包测试和主 baseline glob；实际安装脚本是独立较慢命令，最终分发集成仍归 06。
没有新依赖、锁或版本变更。包内 README/ARCHITECTURE 同步入口和模块维护说明。

## 后续与回退

04 保持 doing，等待上述历史类型取舍结论；实体解码、完整核心/设备/编辑器验证仍归 05/06。
本次独立本地检查点提交，不推送、不发布。回退恢复旧声明及 manifest，移除 runtime 入口和
default 别名；此前请求、时间戳与资源修复保持。不能将本检查点视为整个包或项目已可发布。
