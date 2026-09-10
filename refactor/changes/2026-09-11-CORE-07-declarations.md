# CORE-07：公开声明逐项协调

本任务完成兼容扩展与逐项处置，不宣称所有历史返回类型已准确。BASE-TYPE-06 关闭；
BASE-TYPE-04/05/07 保持开放，并已接入后续模块任务及 CORE-21 声明出口。任务原验收允许
每项形成兼容扩展或待决结论；这些待决项没有作为发布豁免，不能在最终重构验收中算已解决。

## 已实施的兼容扩展

新增 OptionInput 和 ComponentInput。保留 Option.url 的必填字符串与 ComponentOption.html
的历史读取类型，构造函数和组件 add/update 用额外重载接受省略 URL、数字 HTML。
直接把 Option.url 改为可选会破坏旧的 `const url: string = option.url`，所以将新的输入形式
与旧命名类型分开。内部 ResolvedOption 基于 OptionInput 补齐默认值，不改变运行时配置。
原两项配置缺口负例已转为正例；旧 Option 读取另有正例保留。

Utils 新增已有运行时导出 unescape、ArtPlayerError，sleep 的 delay 改为可选；def 保留
历史 string-key/void 签名，再补充 PropertyKey/对象 identity 重载。string-key 调用的旧
void 类型仍优先，不将它描述为已全面精确化。没有返回类型交叉伪装或修改运行时来迎合声明。

declaration-inputs.ts 与 declaration-legacy.ts 已接入工作区及仓库外安装消费者。后者只编译，
记录历史合法但运行时不准确的用法，不作为推荐示例，也不实际执行错误的返回值假设。

## 逐项结论与接续条件

| 边界 | 源码事实 | 当前处理/剩余工作 |
| --- | --- | --- |
| plugins.add | 同步注册返回 registry，Promise 插件返回 Promise registry | 旧一律 Promise 与精确 union 无法同时满足旧赋值；保留旧签名，CORE-08/21 接续 BASE-TYPE-04 |
| toggle | pause 分支同步，play 分支返回原 Promise | 旧 void 赋值与 union 冲突；保留旧签名，CORE-10/21 接续 BASE-TYPE-04，拒绝不吞掉 |
| debounce/throttle | 回调结果被丢弃，debounce 第三参数不使用 | 旧 callback 返回赋值与 void 冲突；内部已精确，公开保留并注明实际行为，CORE-21 接续 BASE-TYPE-05 |
| def | Object.defineProperty 原函数，返回输入对象 | symbol/PropertyKey 入口补齐；string-key/void 优先级保留，CORE-21 接续 BASE-TYPE-05 |
| setting | find miss 为 null；add/update 返回 item；remove 为 undefined | 真实浏览器复现，旧返回赋值保留；CORE-14/21 接续 BASE-TYPE-07 |
| subtitle events | Before/AfterUpdate 发送 activeCues 数组 | 新增 SubtitleUpdateEvents 及显式数组监听重载；旧隐式 scalar 推断保持，CORE-15/21 接续 BASE-TYPE-07 |
| notice.show | getter 返回 boolean 显示状态 | 旧读取联合类型缺少 true；浏览器复现，CORE-18/21 接续 BASE-TYPE-07 |
| static Emitter | 可构造事件总线 | 新增类型 Emitter，支持 event map、payload/ctx、symbols、链式调用；保留构造参数接受范围 |

不能使用 `Registry & Promise<Registry>` 或 `Item & SettingRegistry` 来假装两个返回声明都
正确，也不能把同步调用改为 async 以满足旧声明。保留的声明处已经标注真实运行时含义；
新的内部模块使用精确 source 类型。旧名字、重载顺序、方法运行时和错误传播保持。
新的 Emitter 公开结构与真实 source 实例之间有直接可赋值检查，避免复制出漂移的空接口。

包内 [类型兼容说明](../../packages/artplayer/types/COMPATIBILITY.md) 是后续维护入口，记录
旧/实际类型、可执行用法、责任任务与验证命令。没有增加新的运行时导出或依赖。

## 当前验证证据

五组工作区与仓库外安装类型模式通过，安装包 27 项运行时检查通过；完整安装 UMD 三浏览器
144 项与 legacy 声明/配置 30 项通过，无重试/跳过。新增 12 项运行时对照验证原生字幕 cue、
插件同步/异步注册、拒绝 identity、真实 toggle 播放/暂停、设置返回 identity/null/void、
notice 可见值与静态事件 ctx。字幕 fixture 的 Blob URL 由测试额外回收，不证明生产资源清理。

yarn ci:check 共 112 项通过（83 单元、4 工程、25 冻结基线），28 个生产 TS 文件严格检查；
编辑器声明由 build:ts 生成，完整编辑器交互仍属 SITE/EX。本任务运行时 JS 产物与 CORE-06
相同，所有最终类型及包内文档已核对 tarball 指纹，文档格式变化后重新打包。
详见 [最终验证报告](../baselines/declarations-validation.json)；
[前一批部分验证](../baselines/declaration-inputs-validation.json) 保留为实施过程，已由最终证据接续。

新增构造重载使错误 URL 的诊断由 TS2322 变为 TS2769；已核对两个编译器均拒绝两个重载，
测试检查准确的新错误代码和 number/string 原因，没有放宽有效性断言。

隔离的已发布 artplayer 5.4.0 在 TS 4.3.5 下于 types/artplayer.d.ts:155 报 TS2380：
notice.show 的 boolean getter 无法赋给旧 setter 类型。该错误发生在包声明，不在新增的
历史消费样例。测试冻结此文件/行/代码/消息；TS 5.9.3 旧消费零诊断，候选声明在两版 TS
均必须零诊断。未更改冻结 tarball 或基线文件，也没有用 skipLibCheck 绕过错误。

本任务独立提交；回退该提交可恢复声明、消费者、生成编辑器类型、文档及任务状态。
没有推送、发布、真机或远端 CI 通过结论。下一任务 CORE-08 插件管理器 TS 与扩展类型；
CORE-21 必须处理上表仍开放的声明方案，不能把本次协调完成当成它的验收证据。
