# PKG-DASH-05：真实 SDK 声明与 nullable 音轨修正

起点 `c4b5f5f4`。本步推进实际 dash.js 类型消费者；媒体 seek 风险、SDK 自动刷新与设备
验收保持独立，DASH-05 仍 doing。没有修改运行行为、增加生产依赖或改变版本。

## 发现与修正

真实 npm dash.js 4.5.2/5.2.1 的 MediaInfo 均声明 id、index、lang 可为 null。04 新增的
AudioTrack 只表达 undefined，实际 SDK 的轨道无法赋给该类型。已先保存十组消费者的
TS2322 失败，再补齐公开字段的 null。内部 AudioFields 直接复用 AudioTrack，Label
表达现有默认格式化器可能返回 null 的行为，避免公开与内部类型再次漂移。

新增 nullable 轨道运行回归：保留 null label、原轨道对象身份与同步选择，不把缺失标签
改成新显示策略。既有 npm 发布类型使用 object 回调，没有这些新字段；旧 object 用法、
Parameters 配置提取、同步 update、模块入口仍通过原有兼容测试。新自定义 formatter
依然必须返回 string，实际 SDK 的 nullable lang 应通过 fallback 转为字符串。

首次集成夹具直接返回 track.lang，正确触发了 string|null 到 string 的错误；先修正这条
消费者写法，再单独加入 MediaInfo 到默认 AudioTrack 的赋值复现真正类型缺陷。
两批失败诊断分别保留，未把消费者错误当成生产缺陷或放宽 formatter 返回类型。

## 实际类型依赖与解析

dash.js 5.2.1 声明引用 @svta/cml-request 1.0.12。按实际 manifest 中固定的 peer 版本，
补齐 cml-utils 1.5.0、cml-cmcd 2.3.2、cml-xml 1.1.4、cml-structured-field-values 1.1.3。
五个归档全部校验 npm SHA512 integrity/SHA256、完整文件成员与许可证来源；保留原始
package.json/exports，没有添加类型 shim、paths 映射、环境类型或 skipLibCheck。

归档工具现在支持合法 scoped npm 包，缓存文件名将 scope 分隔符转换为加号，仍限制
名称/版本，保持原无 scope 缓存路径。补充路径穿越、反斜杠、伪 scope 与缓存别名负例。

`dash-sdk-types.mjs` 将实际 SDK 声明与 manifest、上述完整小型依赖包放进临时 node_modules，
用工作区候选公开声明编译 SDK-only、正例、非法用法三种消费者。它是声明投影测试，
不是完整安装 SDK 的运行时验收；独立 Yarn tarball 类型测试仍负责插件的隔离分发。

| SDK / 编译器与模式 | SDK-only | 加入候选插件 |
| --- | --- | --- |
| 4.5.2 / TS 5.9.3 四种模式、TS 4.3.5 Node10 | 0 诊断 | 0 诊断 |
| 5.2.1 / TS 5.9.3 NodeNext CJS、NodeNext ESM、Bundler | 0 诊断 | 0 诊断 |
| 5.2.1 / TS 5.9.3 Node10 | 1：无法解析仅通过 exports 暴露的 cml-request 类型 | 完全相同 |
| 5.2.1 / TS 4.3.5 Node10 | 2：上述模块解析问题、旧 DOM 库无 FontFace | 完全相同 |

每组移除 expect-error 后恰好新增错误返回类型和不存在的 SDK 属性两个诊断。预期值
冻结的是经审查的 SDK-only 诊断和实际加载文件；插件必须增加零诊断。不能把两组上游
不兼容配置表述为零错误编译，也不以冻结上游诊断免除后续 SDK 升级复核。

## 验证和后续

来源见 [类型依赖](../baselines/dash-type-dependencies.json)，上游边界见
[诊断矩阵](../baselines/dash-sdk-type-diagnostics.json)，执行与产物证据见
[本步记录](../baselines/dash-sdk-types-validation.json)。

标准 build:ts 生成编辑器声明，标准 package build 运行后 JS 三格式字节保持原样。
源码 Node 118 项、三格式 Node 274 项通过；真实 Monaco 三引擎 3 项通过，无重试/跳过。
工作区外 Yarn tarball 安装/冻结重装后的五种类型模式通过，每种八条非法用法仍拒绝。
隔离类型脚本的报告改为标识可复用 suite 和 introducedBy，避免后续执行被误读成 04 当时的
结果。初次证据整理误把 docs/compiled 的平铺结构写成子目录，导致证据未生成并触发计划
链接检查失败；已按实际构建器 cpy(flat:true) 修正记录脚本，保留失败日志。
完整工程检查 720 项通过（663 单元、14 工程、43 基线），261 个生产 TS 文件严格检查通过。
随后仅整理夹具 import 顺序、SDK-only 抽取与身份校验，局部 lint 和全部十组类型矩阵再次
通过；详见机器证据。不将类型测试替代仍有开放失败的真实 DASH 播放验收。

当前仍为 217 项：74 done、4 doing、139 todo。接续 DASH-SEEK-01、SDK 驱动刷新/错误、
legacy 实际 SDK 媒体、有效设备和 06 的示例/完整分发。此次为独立本地检查点，不推送发布。
回退本步应一起恢复公开/内部/生成声明及消费者测试，但保留前一检查点媒体失败证据。
