# 逐包发布准入台账

REL-08 建立台账及机械校验，不代表任何包已经可以发布。唯一登记源是
[release-ledger.json](release-ledger.json)，覆盖全部22个workspace包。任务状态仍由
[tasks.json](tasks.json)维护，问题和来源继续使用[风险](risks.json)及
[第三方清单](third-party.json)。不要再创建一份手工维护的“已通过”状态表。

## 命令与退出语义

使用固定Node/Yarn，所有命令只读生产文件，不安装、构建、部署或发布：

| 命令 | 行为 |
| --- | --- |
| `yarn check:release-ledger` | 验证登记结构并计算当前缺口；合法台账即退出0，包仍可显示blocked；已加入ci:check |
| `yarn report:release-ledger` | 同样计算，并在新的`.cache/release-ledger-*/report.json`保存报告，不覆盖旧报告 |
| `yarn release:preflight --packages artplayer,artplayer-plugin-chapter` | 严格工具链后检查明确批次；任一包缺证据或不匹配即退出1；遗漏参数检查全部包 |
| `yarn test:release-ledger` | 反向回归，包括过期/错误候选、设备替身、缺失许可和站点输出漂移；同时由test:baseline发现 |

空选择、未知包、重复包会拒绝执行，不能意外通过空批次。普通结构检查通过和严格
准入通过含义不同，CI-03必须使用strict入口，不能使用check的退出0代替发布判断。
即使全部机械条件满足，状态也只叫`evidence-complete`，`publicationAuthorized`
恒为false。三轮复盘仍需实读底层证据；本工具不能判断一份人为编造的报告是否真实，
也不能自动取得设备、执行测试或授权npm发布。

## 分发和版本边界

每行明确记录独立下一major目标，初始依据是package-inventory.json。REL-01已冻结
[版本方案](version-plan.md)及registry快照：本地候选使用目标正式数字版本，
实际上传仍需授权、最新占用和名称权限检查。REL-09落实manifest与变更日志。

- 普通npm包使用各自冻结发布记录的name/version/integrity/SHA-256/URL作为历史依据。
  core和chapter引用releases.json各自成员；不把工作区版本当作npm版本。
- iframe明确关联旧发布名`artplayer-plugin-iframe`和改名记录。新候选仍核验现有
  workspace名`artplayer-tool-iframe`；改名范围、目标可用性和回退演练不能省略。
- Thumbnail工具只有恢复的CDN/Git内容，旧tarball和完整归档缺失。历史分发门槛保持
  blocked，不能将缺失CSS/归档解释为从未发布；REL-02 的正式逐包候选验收需要完整、已验证的回退方案。
- artplayer-vitepress按站点构建、URL、编辑器、资源和设备验收。列入版本策略不授权
  新增npm发布。站点候选是构建文件清单，不能绑定一个npm tarball冒充站点验收。

历史依据映射不联网刷新，也不代替现有冻结归档验证器、registry检查或回退演练。
每包都有rollback.basis和strategy；严格准入另要求候选绑定的rollback执行报告。
REL-04 完成的是提前演练。REL-02 直接依赖它，并负责正式每批实际候选的逐包回退；
REVIEW-03 复核相同候选内容。早期任务完成不会补齐缺失历史归档或报告，候选版本、
integrity、输入指纹不一致的 rollback 报告仍被拒绝，远端恢复仍受 CI-04 约束。

## 候选绑定

所有初始candidate均为null，evidence为空。先完成目标版本准备和对应实际构建/pack，
在构建快照中计算输入指纹，再登记真实文件；不能只复制当前指纹到旧产物冒充重建。
build报告和REVIEW-03负责审查构建来源及实际内容对应关系。

候选登记字段：

```text
candidate.kind = npm-tarball | site-manifest
candidate.path = 仓库内真实候选文件路径
candidate.version = 已准备的目标版本
candidate.sourceCommit = 实际构建来源的40位Git提交
candidate.inputFingerprint = 构建/验证输入指纹
candidate.integrity = 候选文件实际sha512-base64 SRI
```

npm候选会读取真实tarball并检查路径、重复成员、package.json名称和版本。站点
site-manifest文件包含package、version、outputRoot和files，每个file为path/sha256。
outputRoot必须在仓库内；目录完整文件集须等于files，新增、缺失、替换或符号链接输出
均拒绝。清单SRI和每个实际部署文件字节分别验证；URL正确性仍必须有site-urls报告。

候选tar成员检查与隔离安装共用scripts/package-archive.mjs，按实际条目类型识别
目录，接受Yarn pack生成的无尾斜杠package和子目录；拒绝链接、特殊文件、重复
成员和越界路径。冻结历史archive的原校验器仍用于历史内容核对，不用于新候选。

`inputFingerprint`包含本包、其实际依赖闭包，以及共享构建/工具链/测试/CI输入。
依赖来自impact-model的显式关系和源码/声明/manifest扫描；未解释动态导入按全部包
保守处理。站点还包含docs及example。第三方清单、本校验器、兼容/环境/版本/复盘
契约以及固定release/SDK/历史core配置也参与输入指纹；不断新增的普通validation
报告不作为构建输入，避免报告包含自己而无法完成绑定。

共享验证输入也包括整个refactor/scripts/和refactor/fixtures/：实际打包/类型检查、
历史归档校验器、辅助模块及冻结消费者均会影响结论。修改、新增或删除这些输入
必须使旧候选/报告失效，不能只给release-ledger自身计算指纹。普通baselines验证
结果、progress.md和被Git忽略的.cache输出继续不参与，避免报告自依赖。

文本按明确扩展名和已知文本文件归一CRLF为LF，使Windows/Linux文本签出可以比较；
报告同时保留原始字节SHA-256。字体/WASM/媒体等其他输入不作文本转换，候选SRI、
站点实际输出、报告及其底层附件始终按原始字节校验。指纹不是单独的HEAD比较：
未提交修改也进入计算，无关包源码的变化不使其他依赖闭包失效。共享测试或工程输入
变化则保守地使所有相关候选失效，这是有意避免漏验；不用于省略现有CI检查。

报告包含完整sourceCommit、锁文件哈希、实际Node、配置packageManager、实际Yarn
user-agent、声明工具版本和输入文件表。声明工具版本不是自动证明所有已安装依赖
正确；strict命令先运行现有check:toolchain，并要求真正通过Yarn1.22.22和固定Node执行。

## 必需报告

库的必需门槛：build/runtime/types/combinations/browser/devices/licenses/rollback/
remote-ci/review-01/review-02/review-03。站点用site-urls/site-assets/editor替换库接口
门槛；三轮复盘、真实设备、许可和回退仍然必需。

每个`evidence.<gate>`只登记`{ path, sha256 }`，指向审阅后的标准JSON封套。不能
直接把任意历史validation.json挂入。封套必须包含：

| 字段 | 约束 |
| --- | --- |
| schemaVersion | 1 |
| package/version/gate | 与被验收包、当前版本和门槛精确匹配 |
| candidateIntegrity/inputFingerprint | 与实际候选及当前输入一致 |
| result | pass；未知、失败和skip不能转为通过 |
| checks | 非空`{ id, result, mode }`列表，全部必要项pass；不能通过删除原失败项缩小范围 |
| environment | 实际OS/浏览器/执行环境；设备项须有device、os、browser、emulated:false |
| command/reviewedBy | 实际执行命令及审阅归属，不填计划命令或假身份 |
| artifacts | 非空底层结果`{ path, sha256 }`列表，读取文件验证实际字节 |

devices还必须逐项覆盖该包extraRequirements，所有模式为native；viewport或mock不
能冒充设备/能力通过。remote-ci须有`remote:true`和实际GitHub Actions run URL，
且仍需审阅远端结果附件。URL本身不证明远端成功，本工具不会联网读取它。

licenses须覆盖所有适用vendor、SDK/外部集成及直接运行依赖ID，例如
`dependency:artplayer:option-validator`。哈希只能说明来源字节，不能证明授权；
来源/完整通知和实际bundle、worker、WASM、字体、模型分发的结论必须在附件中审查。

三轮报告不能复用同一封套充数，因为gate字段必须精确匹配。旧任务done或旧报告存在
不自动提供候选证据：历史任务索引会显示，但historicalEvidenceAcceptedForCandidate
恒为false。候选内容、源码、锁文件、共享测试或工程输入变化后，相关封套会失效。

## 任务、风险和批次范围

每包需关闭其依赖闭包的实施/组合/分发任务和共享准备、远端CI、回退及三轮复盘。
风险先按具体包责任定位，只有没有具体包责任的全局风险才扩展全包；例如HLS问题
同时由REVIEW-02负责，不会仅因此直接阻止无关Cast包的局部准备。核心问题通过依赖
闭包影响其消费者。第三方资产使用同样范围映射，未决风险阻止相应批次。

当前共享三轮完整复盘尚未完成，所以任何包都没有发布就绪结论。逐包可独立准备
候选和收集材料，不能借分批删除项目整体要求。未来如正式拆分独立批次复盘，须按
release-reviews.md新建任务和明确范围，并更新本台账模型及反向测试，不能删共享门槛。

## 维护地图

- `scripts/release-ledger-model.mjs`：纯门槛、范围、依赖闭包和阻断计算。
- `scripts/release-ledger.mjs`：只读文件/归档/输入指纹，装配当前报告和CLI。
- `scripts/release-ledger.test.mjs`：合成合格控制与逐项失败反例，真实临时tar/site文件
  验证；这些测试不算任何产品包的设备或发布验收。
- `release-ledger.json`：历史分发、目标、能力、回退及候选/证据绑定，初始无候选。

更改门槛先核对兼容、环境、版本和复盘契约；不要把当前红灯改成绿色来证明工具有效。
ci:check只做结构校验，strict红灯是当前产品验收尚未完成的正确结果。
