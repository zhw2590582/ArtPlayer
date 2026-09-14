# PKG-DANMUKU-08 旧插件组合与真实组合负载

状态：仍 doing，存在未关闭失败。起点30363a5346e8d6b227651f224dd4d411289a9971。
本批仅扩展测试和证据，不修改生产实现、声明、默认配置或依赖。下一修复由独立
PKG-DANMUKU-MASK-LOAD-01负责。风险继续阻止弹幕08与Mask05终验；尚未启动的
弹幕09与Mask06显式依赖该修复，确保它不能被分发阶段绕过。

## 真实输入与新增覆盖

画中画及Mask用例现在都加载冻结npm弹幕5.3.0或当前源码，校验tarball成员SHA。
显式ARTPLAYER_DANMUKU_ARTIFACT仍只替换候选输入，不能覆盖冻结发布输入。
画中画使用当前Document PiP，核心为5.4.0/当前源码；Mask使用当前插件及固定
本地MediaPipe模型，另覆盖实际5.3.1-beta.1核心。没有修改模型或SDK字节。

`test/helpers/danmuku-combination-load.js`通过旧config/load调用设置speed=1、
antiOverlap=false，6秒内每秒20条，观察到媒体推进8秒后核验120条。真实RAF来自
播放器所属window，原生媒体时钟和Worker不被替换。临时可见/错误监听器及RAF在
finally释放；失败后仍保存load快照。候选要求每行恰好可见一次、最终wait、无引用、
节点池身份唯一；冻结旧插件仅观察其实际漏显，不能混称为完整交付通过。

Mask负载发生在真实模型就绪、pause/seek/网页全屏/hide-show验证之后，并检查
负载期间模型确实继续产生输出。新画中画load用例在两个真实PiP窗口各运行一轮，
单项45秒只为新增16秒媒体推进留预算；原有close/native-close/destroy超时不变。
这不是三小时耐久、后台节流保证、物理设备验收或私有GPU/WASM泄漏证明。

## 画中画结果与旧清理缺陷

Windows Chromium153.0.8010.12、Firefox155.0、WebKit26.6；Node24.21.0/Yarn1.22.22。
新增旧插件首轮18项为6个API不可用记录、12个原生退出后零DOM断言失败。
12个支持用例均已完成两次真实开窗、弹幕显示、热力图/设置迁移、关闭和Worker终止；
冻结5.3.0在destroy(false)后保留3个renderer节点及1个Setting，两个核心完全一致。
旧destroy实现不移除这些节点，候选在05已修复其所有权清理；参考
[资源修复](2026-09-13-PKG-DANMUKU-05-resources.md)。

因此旧分支单独断言该确定的历史残留，outcome明确为
native-playback-with-published-retained-dom；候选仍要求零DOM与空scheduler。
两行固定fixture精确断言3/1，load fixture按销毁前实际节点数验证旧保留行为。
保留原12个失败报告；这不要求永久保留旧插件缺陷，也不豁免候选清理。

最终普通PiP矩阵36项退出0：12候选原生通过、12旧插件原生播放及残留观察、
12 WebKit API不可用记录。新增load矩阵12项退出0：4候选原生、4旧插件原生、
4 API不可用；每个候选原生用例两个窗口分别120行完整显示/回收，最终Worker终止。
普通矩阵54.25秒、load矩阵94.81秒，均无重试。源码PiP测试不冒充最终安装分发。

## Mask负载失败：不能计入验收完成

18项组合为12 passed / 6 failed，运行退出1。12个通过中9项为旧插件观察、
3项为Firefox候选完整交付；不能称12项候选负载通过。

| 引擎 | 候选负载显示 | 旧插件负载显示 | 结论 |
| --- | --- | --- | --- |
| Chromium | 49/120（当前核心）、48/120（5.4.0） | 34–49/120 | 候选仍有活动/待放置工作，串行放置积压需分析 |
| Chromium / beta核心 | 未进入负载 | 45/120 | 模型就绪后Ready mask combination一行未显示，原7秒断言失败 |
| Firefox | 三核心各120/120 | 三核心各120/120 | 本负载完整显示/回收 |
| WebKit | 三核心109/109/116条，共需各120 | 104/111/113条 | 有未显示行，最终已无行节点引用；检查未采样时间窗口 |

本轮候选RAF帧间隔P95：Chromium约214–219ms，Firefox78–85ms，WebKit227–238ms。
这些数据表明与普通播放器相比主线程推进明显变慢，但尚不能将模型、PNG编码、
Worker往返或某个模块单独定为根因。旧插件也漏显；目前没有证据证明候选比旧插件
回归。候选目标仍不达标，不能降低20条/秒、移除完整性断言或只跑Firefox。
原始模型、源码/核心哈希、行与RAF/媒体时间快照均保留在报告中；机器摘要见
[组合负载证据](../baselines/danmuku-combined-load-validation.json)。

## 修复接续与重跑

PKG-DANMUKU-MASK-LOAD-01首先区分未采样行与已采样待放置行，分析实际模型各阶段
及Worker请求/回复成本，建立可控回归后修复。保持公开readys/回调串行顺序、
seek/pause/hide/reset取消和显示寿命契约；涉及真实兼容冲突时明确决策。
不得通过在调试夹具中停止模型、降低视频尺寸或改变媒体时钟作为正式通过结果。
若某条诊断改变负载输入，必须保持原始失败并明确其反事实用途。

重跑：`yarn test:browser:source test/browser/danmuku-dpip.spec.js --workers=2`，
只选新增负载加`--grep 'PiP load'`；Mask用
`yarn test:browser:source test/browser/danmuku-mask-native.spec.js
--grep 'actual model and Danmuku' --workers=2`。每次前归档前一份报告。
三个修改文件的只读ESLint通过。任务、风险和生成文档同步校验后独立本地提交，
再运行提交审计。没有push、部署或发布；回退本检查点只撤销覆盖，不修复生产问题。
