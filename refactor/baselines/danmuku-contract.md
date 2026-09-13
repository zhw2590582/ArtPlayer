# Danmuku 公共契约基线

PKG-DANMUKU-01；冻结提交 `b0cfbfe3a09a84a295a257e45e4577847588d1cb`。
实际输入及逐文件 SHA 见 [danmuku-release.json](danmuku-release.json)，执行结果见
[danmuku-contract-validation.json](danmuku-contract-validation.json)。本次不改生产代码。

## 发布依据与覆盖范围

2026-09-13 直接读取 [npm registry](https://registry.npmjs.org/artplayer-plugin-danmuku)，
HTTP 200，目录有 81 个稳定版，latest 为 5.3.0。冻结全部版本的发布时间、tarball、
integrity、gitHead；实际下载并校验全部 13 个 5.x 版，另加前两代末版 4.4.11、3.5.31，
共 15 个归档。其余 66 个版本只有目录证据，不能说其运行时已验证或全部兼容。
这是代表性历史覆盖，不是新最低支持版本，也不把旧 major 的产品行为自动带入候选。

当前包全部跟踪文件、12 个 SVG、三个 dist、声明、README、可运行 demo 和 VitePress
弹幕文档共 28 个输入冻结。最新归档中的 README、manifest、声明及三个 dist 与冻结
Git 文件逐字节相同；源码行为另通过冻结 Git 模块受控执行对照，不把可读源码等同于
历史打包过程已可重复构建。

| 归档版本 | registry gitHead 的插件版本 | 同提交核心版本 | 说明 |
| --- | --- | --- | --- |
| 3.5.31 | 3.5.31 | 3.5.31 | 历史 major 对照 |
| 4.4.11 | 4.4.10 | 4.5.8 | manifest 版本不一致 |
| 5.0.0 / 5.0.1 | 5.0.0 / 5.0.1 | 5.0.0 / 5.0.5 | 分别冻结 |
| 5.1.0 / 5.1.1 | 5.1.0 / 5.1.0 | 5.1.2 / 5.1.5 | 5.1.1 版本不一致 |
| 5.1.2 / 5.1.3 / 5.1.4 | 同归档版本 | 5.1.6 | 分别冻结 |
| 5.1.5 / 5.1.6 | 5.1.4 / 5.1.6 | 5.2.2 | 5.1.5 版本不一致 |
| 5.1.7 | 缺 gitHead | 未知 | 不推测来源提交 |
| 5.1.8 | 5.1.7 | 5.2.4 | manifest 版本不一致 |
| 5.2.0 | 5.1.9 | 5.3.0-beta.3 | 核心是提交关联预发布号 |
| 5.3.0 | 5.2.1 | 5.3.1 | 不宣称核心 5.3.1 是 npm 稳定版 |

真实 manifest 是归档身份依据；提交关联不是最低核心支持声明。归档与关联 Git 路径
各成员的匹配/不匹配均在 JSON 中保存。registry 缺失的提交信息保持缺失。
未独立验证 npm 签名及发布者授权。5.1.7 归档的目录头没有尾随斜线；专属 verifier
用 tar 条目类型区分目录与普通文件，拒绝重复、越界和非普通文件，不改共享解包函数。

## 分发与静态属性

| 版本 | 实际 CommonJS | manifest 分发入口 | 静态 icons |
| --- | --- | --- | --- |
| 3.5.31 | 直接函数 | main；未声明 types/module/legacy | 无 |
| 4.4.11 | 对象.default | main/types | 无 |
| 5.0.0–5.0.1 | 对象.default | main/types/legacy | 无 |
| 5.1.0–5.1.6、5.1.8 | 对象.default | main/types/legacy；无 module/exports | 12 项 |
| 5.1.7 | 对象.default | module 是 `.esm.js`；平铺 import/require/default exports | 12 项 |
| 5.2.0 | 对象.default | `.mjs`、root/legacy 条件 exports；types 条件在后 | 12 项 |
| 5.3.0 | 直接函数 | `.mjs`、root/legacy 条件 exports；types 条件在前 | 12 项 |

main/legacy 共 28 个实际模块已在 Node VM 执行；三个 manifest ESM 的实际字节通过
data URL 动态 import 执行。此项只证明模块代码能求值，不等于在消费者目录通过
Node 包解析；真实安装、NodeNext/Node10、AMD/global/script、编辑器仍由 06/09 验证。

`artplayerPluginDanmuku.icons` 是可写、可配置、可枚举的对象值，顺序为：
`$on/$off/$config/$style/$mode_0_off/$mode_0_on/$mode_1_off/$mode_1_on/`
`$mode_2_off/$mode_2_on/$check_on/$check_off`。静态 icons 不是 getter；设置模板使用
模块内 SVG 字符串，没有读取工厂 icons 的后续改写。这一读码事实尚未验证热替换用法。

## 最新版工厂与方法

`factory(option)(art)` 同步返回门面；字段按 `name/emit/load/config/hide/show/reset/`
`mount/option/isHide/isStop` 顺序枚举，name 为 `artplayerPluginDanmuku`。
后三项是可枚举、可配置、没有 setter 的 getter，读取内部当前值。方法已 bind，可抽取调用。
工厂 option 没有默认对象；`{ danmuku: [] }` 是基准合法调用。初始化不等待异步载入完成。

| API | 最新真实行为 | 声明/兼容注意 |
| --- | --- | --- |
| `emit(danmu)` | async；验证并修改传入对象，filter 通过后同步入队；Promise 最终返回内部 Danmuku | 旧声明错误写同步 Result；不自动改旧根类型 |
| `load()` | 读当前 option.danmuku，reset 后清空队列再逐条 emit | Promise 返回内部对象；不是门面 |
| `load(target)` | 追加到现有队列，不自动改 option.danmuku | 包括数组、函数、同 realm Promise、XML URL |
| `config(partial)` | 合并默认值、当前值与 partial，验证、钳位；变化比较用 JSON.stringify，单独更换函数会被忽略 | 旧类型要求完整 Option，实际 partial 有效 |
| `hide/show` | 更新 isHide、层 opacity、option.visible，并发事件 | 返回内部对象；重复调用也发事件 |
| `reset()` | 全队列回到 wait，回收已分配 DOM，再发 reset | 返回内部对象，不清空队列 |
| `mount(target)` | selector 或元素；移动设置输入框并 reset 设置 UI | 返回 undefined；声明允许省略，但运行时无目标会抛错 |
| `option` | 当前合并后的对象；config 可能更换其引用 | 声明可写，实际仅 getter |
| `isHide/isStop` | 初始 false；show/hide 与 video start/stop 更新 | 不应解释为 video.paused 或 layer DOM 是否存在 |

内部 Danmuku 没有公开门面的 `name/mount`，但历史链式返回会将其暴露给调用方。
后续整理必须先评估返回身份，不能为了匹配旧错误声明静默返回门面。
`load(undefined)` 清空；其他显式 falsy 值通过 `target = argument || option.danmuku`
回退但不走清空分支；这只是读码事实，不把未声明参数纳入必须支持的接口。

## 全部配置与弹幕项

| 配置 | 默认值/范围 |
| --- | --- |
| danmuku | `[]`；声明含数组、URL、返回 Promise 的函数、Promise；初始 Promise 被实际 validator 拒绝，load(Promise) 可用 |
| speed / margin / opacity | `5`，钳位 1–10；`[10,'25%']`；`1`，钳位 0–1 |
| color / mode / modes | `#FFFFFF`；`0`，钳位 0–2；`[0,1,2]`，显示模式由 dataset/CSS 控制 |
| fontSize | `25`；数值或百分比，使用时钳位 12 到播放器高度 |
| antiOverlap / synchronousPlayback | `true` / `false` |
| mount / heatmap / width / points | controlsCenter / false / 512 / [] |
| filter / beforeEmit / beforeVisible | 默认均返回 true；filter 同步，另外两个支持异步 |
| visible / emitter | true / true |
| maxLength / lockTime / theme | 200（1–1000）/ 5（1–60）/ dark |
| OPACITY / FONT_SIZE / MARGIN / SPEED / COLOR | `{}` / `{}` / `{}` / `{}` / `[]`，设置组件再补默认滑块与颜色 |

Danmu 声明成员为 `text/mode/color/time/border/style`；runtime 还验证可选 string `id`，
并传播额外字段。mode 只入队 0/1/2，空白 text 与 filter 拒绝项忽略。time 不存在或为 0
时写为 currentTime + 0.5；负数钳到 0。入队时额外生成 `$state/$index/$ref/$restTime/`
`$lastStartTime`，loaded/visible 事件会暴露这些字段和对象引用。

直接 emit/load 调用 filter，以当前 option 为 this，不经过 beforeEmit。设置 UI 的
发送按钮/Enter 先 trim 输入，防锁定/重复提交，await beforeEmit；只有严格 true 继续，
加 border、删除 time、再调用 emit，清输入并锁定。beforeVisible 在准备显示前调用，
也以 option 为 this。三者不能合并成一个全局异步过滤器。

最新声明有六个命名类型 `Mode/Danmuku/Slider/Danmu/Option/Result`。
4.4.11/5.0.x 旧声明中 Danmuku 表示结果，而 5.1.x 起表示输入，旧配置还出现
useWorker/minWidth/maxWidth；不能将较早声明与最新声明拼成未经评估的根类型。
06 按已批准的 [统一类型规则](../type-compatibility-policy.md) 处理：最新 npm 根声明的
合法完整工厂赋值、Parameters/ReturnType、NodeNext 历史模块形态都需安装消费者证据；
准确异步类型可用独立 runtime 入口，较早冲突写迁移说明。本次没有改类型或声称编译矩阵通过。

## 事件、DOM、设置与热力图

| 事件 | 参数/时机 |
| --- | --- |
| artplayerPluginDanmuku:config | 当前 option 引用；show/hide 在它之前发生 |
| artplayerPluginDanmuku:loaded | 完成当前 load 后的实际 queue 引用；空数组初始化可在工厂返回前同步发生 |
| artplayerPluginDanmuku:error | load 捕获的原错误，然后再次抛出；直接 emit 不自动发这个事件 |
| artplayerPluginDanmuku:visible | worker 返回位置且允许显示后，实际内部 danmu |
| artplayerPluginDanmuku:start / stop | 无参数，video:play/playing / pause/waiting 对应触发 |
| artplayerPluginDanmuku:show / hide / reset | 无参数，对应方法更新状态之后 |
| artplayerPluginDanmuku:destroy | stop、worker terminate 和解除部分监听之后 |
| artplayerPluginDanmuku:points | 消费方发入的热力图数据事件，插件不主动 emit |

这些是十个输出事件和一个输入事件；不新增虚构的 `:emit` 事件。
[] 初始化的已复现顺序为 show → config → reset → loaded；非空/异步输入顺序和错误
重入仍需 02 扩展。Setting 还订阅 resize/fullscreen/fullscreenWeb/document:pointermove/
document:pointerup/show/hide。热力图订阅 ready/resize/loaded/timeupdate/setBar/points。

设置入口是 `new Setting` 创建的独立 `.artplayer-plugin-danmuku` 输入框和弹出面板，
不是核心 setting registry 的单个项目。内部使用 `.apd-*` 类、mode/color/state/id 数据，
外部挂载可在 fullscreen/fullscreenWeb 时移回控制栏；默认挂载在宽度低于 width 时移到
播放器底部。默认不透明度 0–100、字号 12–120；MARGIN 四档 `[10,'75%']/[10,'50%']/`
`[10,'25%']/[10,10]`；SPEED 五档 10/7.5/5/2.5/1。滑块读取 step.hide，而声明写 show；
MARGIN step.value 是数组，声明只有 number|string。

设置 style 在模块求值时插入 id=`artplayer-plugin-danmuku` 的全局 style；完整类名、
选择器、SVG 和样式源码已整体哈希冻结。视觉、CSS 覆盖、重复 style 与外部节点回收
未在本次 mock 中模拟，交 02/05/08 的真实页面验证。

heatmap=true/object 创建 name=`heatmap`、position=`top` 的控件。源码按 `[x,y]` 二元组
使用 points 事件数据；`option.points` 当前只存储，未被 heatmap update 消费，声明却为
`{time,value}[]`。初始化开启 heatmap 后 config 开关不会自动新增/移除控件。上面两项为
读码事实，尚未浏览器复现。窄尺寸下默认 sampling=floor(width/100) 可为 0；需 02 用
独立超时保护测试确认循环风险，不在 UI 主线程盲跑。

## Bilibili XML 与 worker

string 输入调用 fetch(url) → response.text()，没有显式 HTTP 状态判断。XML 用正则读
`<d p="...">...</d>`，要求至少八个逗号分隔字段；模式 1/2/3→0、4→2、5→1，其他→0；
trim 后按 quot/apos/lt/gt/amp 顺序解实体。输出 text/time/mode/fontSize/color/timestamp/
pool/userID/rowID；color 用十六进制字符串，不补齐六位，数字异常也不额外过滤。

优先生成 Blob worker，message 含 `{xml,id}`，结果 `{danmus,id}`，成功后 terminate；
Worker 构建同步失败时 console.error 并退回相同 parser。正则和 fallback 已执行；真实
网络、Worker 消息和 CSP/Blob 能力未验证。源码用 async Promise executor，fetch/text
拒绝发生在 try 之外，且未 revokeObjectURL；空 XML/worker error/销毁竞态是待 02 复现项。
调度 worker 接口 `{type:'getDanmuTop',id,target,visibles,antiOverlap,clientWidth,clientHeight,marginBottom,marginTop}`
→ `{result,id}`，当前 Date.now 作为 id 并覆盖 onmessage；并发/旧回复仍待测试。

## 已复现差异与后续责任

| 编号 | 证据级别 | 内容 | 后续任务 |
| --- | --- | --- | --- |
| DANMUKU-TYPE-01 | 运行时复现 + 逐字声明 | emit Promise、内部返回身份、getter、mount 省略、初始 Promise 和声明不一致 | 03/06 |
| DANMUKU-INPUT-01 | 冻结源码和真实 5.3 main/legacy 复现 | time:0 被改为 current+0.5；输入对象被修改 | 02/03，分别评估修正和保留 |
| DANMUKU-CONFIG-01 | 同上 | 单独 config({filter:新函数}) 被 JSON.stringify 比较判为未变化 | 02/03 |
| DANMUKU-CLEANUP-01 | 同上 | resize 注册 this.resize，销毁 off(this.reset)；设置锁定 timer 未清 | 02/05 |
| DANMUKU-TYPE-02 | 读码/声明观察 | id/icons 缺失、Slider value/hide、points 类型与使用漂移、config partial | 05/06 |
| DANMUKU-ASYNC-01 | 待复现 | Bilibili fetch/text/worker 错误、load 乱序、beforeVisible/worker 晚回调、重复 start | 02/03/04/05 |
| DANMUKU-HEATMAP-01 | 待复现 | 小于 100px 时 sampling=0、事件 tuple/option.points、重复实例 SVG id | 02/05 |
| DANMUKU-SOURCE-01 | 归档与 Git 核验 | gitHead 版本错位、5.1.7 无 gitHead、12 SVG 无单独来源授权证据 | 09 |

历史缺陷断言仅冻结观察，不要求候选保留。修复必须有独立候选正常断言与明确迁移影响。
包 README 只有简介/demo/license，主要公开说明来自冻结 VitePress 文档和 demo。
demo 使用本地 video.mp4/danmuku.xml，适合作为后续 8082/Monaco/Run 的本地输入。
本次不证明实际播放、密集弹幕碰撞/时钟、mask/全屏/PiP、真实 WebKit/设备或 npm 发布可行。

## 重放

在固定 Node 24.21.0 / Yarn 1.22.22 与已安装根依赖下运行：

```text
node refactor/scripts/danmuku-contract.mjs
node --test refactor/scripts/danmuku-contract.test.mjs
node node_modules/eslint/bin/eslint.js refactor/scripts/danmuku-contract.mjs refactor/scripts/danmuku-contract.test.mjs
```

缺缓存时 verifier 仅从冻结 npm URL 下载并验证 SHA512/SHA256；不执行 registry 包脚本。
完整目录可再次读取 `https://registry.npmjs.org/artplayer-plugin-danmuku`，但返回的新目录
不应覆盖本次不可变基线。原始 registry body 的 SHA 保存在 JSON，原始响应在专属 cache。
测试使用真实发布核心 5.4.0 的 validator、受控 DOM/计时器/Worker，仅源码编译在内存中
完成，不生成或修改 dist/docs。仅访问 npm 元数据及归档，未请求媒体或 Bilibili 资源。
