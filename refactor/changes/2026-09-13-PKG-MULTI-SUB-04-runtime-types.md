# PKG-MULTI-SUB-04 严格运行时 TS 检查点

五个自有 JS 模块迁为 TS，新增 types.ts 描述真实 Promise<Result>、轨道、生命周期、
converter 和宿主安装边界。parser.js 原始 vendor 执行体保持；parser.d.ts 区分文本、
标签和数字时间戳节点，描述 cue settings、错误/样式结果及序列化输入。
分包 tsconfig 使用 strict/noUncheckedIndexedAccess/allowJs=false，既有浏览器目标不变。

## 兼容与断言

- 内部 TrackOption 复用旧公开配置字段，内部 Option 允许运行时已有的 `{}`；工厂参数
  本身仍必需。真实返回 Promise，tracks/reset 明确 void。
- 公开 types、导出路径和版本尚未改动。旧同步声明与真实异步结果的冲突保留为编译负例；
  04 未完成，后续必须验证旧提取/替换、模块形式及安装消费者再处理公开入口。
- `(art.constructor as typeof Artplayer)` 只恢复构造器静态类型；可选 URL 的 `!` 保留
  原生 fetch 的旧值转换，不偷偷加默认 URL；关闭状态检查后的 `!`/string[] 对应取消边界。
- Promise.all 索引与选项索引配对。未知名称仍在 cue 属性读取时抛 TypeError，不能因
  类型严格化过滤掉无效项。宿主默认 subtitle 的断言也不新增运行时默认。
- parseTracks 返回拥有 url/name 的明确新对象，其 cues/errors/styles 保持相同引用；
  没有改变 cue 输出、选择顺序和生命周期策略。

## 类型检查发现的独立缺陷

旧包装逻辑把所有顶层节点的 value 都改成 div 字符串，包括应该保留数字的时间戳。
实际已发布 1.2.0 和本次候选对 `Before <00:02.000> after` 都输出 `<NaN:NaN.NaN>`。
九份历史输入新增复现，全部确认同一缺陷；原有 02 验证是当时 162 项，本次历史失败
文件扩为 171 项，不改写旧报告数字。实际探针输入/输出写入本次验证记录。

新增 PKG-MULTI-SUB-07 专门修复并验证内嵌时间戳的序列化，作为 05 的前置；风险保持
open。本次 WrappedNode 明确表达这个历史错误，不把类型通过解释为字幕内容已正确。
下一步先处理 07，再继续 04 的公开声明；修复需同时更新旧/新差异和原生显示证据。

## 验证与发布边界

TS 5.9.3/5.1.6 严格正例通过，移除 expect-error 后各 8 个错误；注册返回、选择名称、
格式、只读关闭状态、数字时间戳、序列化返回和旧同步替换均有明确约束。
源码/main/legacy 的既有 31 项正常/资源/转换测试分别重跑；三入口原生五场景各 30 项。
vendor 没有机械 TS 改写，不计为已迁移生产 TS。实际结果与限制见
[验证记录](../baselines/multiple-subtitles-runtime-types.json)。

正常构建更新三份 dist 及 docs/compiled。新增 tsconfig 加入 .npmignore，并用实际
yarn pack 验证自有源码、私有 parser 声明和 tsconfig 未泄漏；公开声明/入口原样保留。
最终本包 252 项、完整 CI 2322 项通过（1972 单元、14 工程、336 基线），严格生产
TS 增至 352 文件。三入口各 31 项及原生共 90 项通过，状态更新后另有 9 项元数据
检查通过。新增源文件/声明/fixture/runner 显式 lint 通过；全量 lint 保留既有生成声明警告。
无新依赖，未推送或发布。本次为 04 的独立本地检查点提交，任务继续 doing。
