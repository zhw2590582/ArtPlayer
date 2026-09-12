# VAST 实际发布契约

PKG-VAST-01；固定内容见 [发布及SDK归档](vast-release.json)。2026-09-12查阅npm注册表，
VAST仅发布1.0.0（2024-10-12），工作区1.2.0未发布；目标依既定政策为2.0.0，正式
发布前重新核对版本占用。此处不是未来latest承诺。

## 发布版与工作区差异

| 契约 | 实际npm 1.0.0 | 冻结工作区1.2.0 | 后续处理 |
| --- | --- | --- | --- |
| 工厂 | `factory(callback)(art)`，第二层async；先await SDK，再await callback | 同样async，可省略callback | 保持Promise与回调完成顺序，补错误/销毁竞态测试 |
| 公开声明 | export=、全局namespace；第二层错误声明为同步Result；callback参数必需 | default export；仍错误声明同步Result；新增Instance/Option类型 | 协调实际Promise与旧类型消费者，不把Ads专属批准自动扩大到VAST |
| callback字段 | art/id/ima/imaPlayer/$container/playUrl/playRes | art/playUrl/playRes/init/ima/adsRenderingSettings/playerOptions；imaPlayer/container为getter | 恢复真实发布别名并评估两套消费形状，不能漏掉旧id/$container |
| 初始化 | 回调前创建Player和container，imaPlayer非空 | init/playUrl/playRes触发懒初始化，回调初始imaPlayer/container为null | 立即初始化与惰性行为存在真实冲突，明确处置而非假称两者一致 |
| 请求 | playUrl写adTagUrl；playRes写adsResponse；都返回void | 增加config枚举覆盖，可覆盖主字段；广告播放中请求直接返回 | 保留合法请求及config用法，测试继承字段/重复/失败路径 |
| 返回值 | await后仅{name} | await后{name,destroy}，destroy同步 | 核心destroy与显式SDK destroy区分，核实重建语义 |
| 容器 | `art-${Date.now()}`，display:none；交由SDK显示 | `art-vast-${Date.now()}`，黑底/pointerEvents；监听四种广告事件显隐 | DOM/ID/事件时序及同毫秒多实例待测 |
| 默认SDK设置 | new AdsRenderingSettings/PlayerOptions默认值 | 额外打开restoreCustomPlaybackStateOnAdBreakComplete和enablePreloading | 先固定真实SDK行为，禁止把默认值变化当作无影响整理 |
| CommonJS/script | Parcel namespace `{default:factory}`，window全局；main/legacy | callable、ESM/legacy和exports | 兼容旧`.default`、原dist路径和类型入口 |
| 生命周期 | 无核心destroy订阅，无自动清理 | 仍无核心destroy订阅，只有回调完成后的公开destroy | 资源所有权、SDK加载中销毁、callback拒绝、晚到事件需复现及修复 |

## SDK与历史核心

发布版依赖范围@glomex/vast-ima-player ^1.21.0，工作区^1.21.2、锁定安装1.21.2。
冻结SDK1.21.0/1.21.2的全部27+27成员及插件6成员，SHA512和SHA256校验，不把
工作区node_modules当作实际发布来源。SDK打包代码包含loadImaSdk，远程地址为
`https://imasdk.googleapis.com/js/sdkloader/ima3.js`；该远程服务不是已冻结的本地SDK
tarball，真实网络/广告行为仍需05取证。

两版SDK的公开dist/index.d.ts和vast-ima-player.d.ts都引用@alugha/ima，但仅把它
列入devDependencies。当前工作区未安装该包，TS5.9.3和4.3.5的最小VAST消费者各有
两个TS2307；记录在本步验证证据中。04应使实际安装后的声明自洽，不能依靠skipLibCheck。

发布gitHead对应核心5.1.7，源manifest哈希已固定；这是历史关联，不是该核心tarball
或媒体组合已通过。02/05应核验真实5.1.7以及5.4.1/候选核心。

## 验证边界

`vast-contract.mjs`校验三份归档、60成员、冻结Git源码与核心关联。
`vast-contract.test.mjs`执行实际发布main/legacy的导出形状，并在准确SDK注入边界
运行哈希校验过的两套源码，观察callback字段、提前/惰性初始化、Promise等待、
请求配置和Result。这里的Player是受控记录器，不是Google IMA或真实广告播放。
VM导出检查提供当前平台CustomEvent；初次未提供时触发SDK事件polyfill的document
访问，属于测试夹具缺项，不能泛称当前Node的SSR必然失败。

用户明确更正：只有VAST脚本确因VPN规则始终无法加载时，可以记录并跳过，留给用户
后续处理。仍记录实际失败与未验证范围；本轮注册表/归档下载正常，未使用此例外。
