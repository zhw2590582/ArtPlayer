# Ambilight 测试维护

先读 [发布契约](baselines/ambilight-contract.md)。ambilight-release.json冻结两个真实
发布及工作区Git来源，verifyAmbilightContract逐成员核对，不随候选更新历史哈希。

`node --test refactor/scripts/ambilight-contract.test.mjs`执行7组：归档、CJS/script/legacy、
原生ESM、声明形状及三实现的配置/样式/坐标/同步返回。test/helpers/ambilight.js提供
受控DOM/Canvas/RAF；模拟RGB只检查取样及写入顺序，不证明浏览器解码或跨域取色。

02复现频率/暂停/零尺寸/重复start-stop/销毁/异常；03拆分视图、取色和调度，修复已
复现问题；04兼容类型及旧CJS.default；05/06做真实媒体、代理、浏览器和安装包验证。
stop保留最后画面，核心destroy终止资源。zIndex仍忽略，参数省略及两版声明差异分别
处理；Git关联不构成连续核心支持范围。

## 02历史回归

`node --test test/ambilight.test.js`运行30项Node回归并接入test:unit；正常参数/频率/暂停与已确认的
历史问题分别断言。`yarn test:browser test/browser/ambilight.spec.js`运行三实现/三核心/
三引擎真实媒体；核心标签published是实际npm5.4.0，published-5.1.7是实际npm5.1.7，
candidate是当前源码；以browser-evidence的manifest和实际version为准。
跨origin使用同一服务的localhost与127.0.0.1，读像素抛原生SecurityError；换回同源
后持续错误是待03修复的历史污染。Node零尺寸记录只证明未保护，未模拟为浏览器结论。

02最终30项Node、54项三引擎/三核心浏览器通过，未skip；新建Canvas能读取已恢复的
同源视频，而旧插件Canvas仍抛SecurityError。主CI955项通过（另44项重复观察）。
完整报告与输入来源见baselines/ambilight-behavior-validation.json。03开始修复这些问题。

## 03候选生命周期

`yarn test:ambilight`现在执行30项历史及16项候选测试。候选直接构建当前src入口，
不读取旧dist作回退。设置ARTPLAYER_AMBILIGHT_BASELINE=1可把同一16项要求交给冻结
工作区：14项失败、2项正常语义对照通过；候选16项通过。环境变量只应用于独立负向
命令，正常CI不得设置。另7项发布契约继续通过，专项共53项。

`yarn test:browser test/browser/ambilight-lifecycle.spec.js`在实际npm核心5.1.7/5.4.0和
候选核心、Chromium/Firefox/WebKit中执行18项，无skip。原生视频/Canvas不模拟；
词法RAF观察器只跟踪插件自己的帧，调用仍交给原生RAF，核心和测试等待帧不计入。
验证ready自动取色、stop保色、destroy(false)移除DOM/清空帧、逃逸方法不复活，及真实
跨origin失败后切回同源在同一插件/视图内恢复，不调用stop/start来协助恢复。

首次宽度重置方案15/18通过，Firefox全部3项恢复失败。独立诊断证明新Canvas能读取
已恢复视频，原Canvas重设宽度仍抛SecurityError，随后改为下次有效取色创建新Canvas。
保留失败与通过报告；最终18/18通过。持续跨域素材仍不可取色，失败期间的分配成本
需在性能复盘评估。正式构建更新三种分发及docs/compiled，未手改生成内容。

03证据见 [生命周期验证](baselines/ambilight-lifecycle-validation.json) 和
[实施记录](changes/2026-09-12-PKG-AMBILIGHT-03-lifecycle.md)。04公开声明及CJS.default、
05代理/实际设备、06安装包和8082 demo仍未完成；三浏览器通过不能代替这些验收。

## 04公开类型与安装消费者

`node --test refactor/scripts/ambilight-types.test.mjs`覆盖五种TS模式、10项非法用法、
实际1.0.0/1.1.0声明对照、编辑器语义生成及正式main/legacy/global/ESM导出。已接入
test:baseline和根typecheck。CommonJS自default别名兼容两代调用；可选参数重载放在前，
必填Option签名必须放最后以保护Parameters提取。新的d.mts/d.cts为相同公共声明提供
正确模块身份，typesVersions补齐旧解析器的legacy子路径。

`yarn test:ambilight-types-package`打包当前核心和插件，在仓库外分别安装两个真实
发布插件和候选，离线/frozen安装及逐文件哈希检查防止误用workspace链接。共17个
编译场景：候选7个（含TS5.9.3/4.3.5关闭interop）全部零诊断且各拒绝10项非法用法；
旧包10个场景中1.1.0 NodeNext ESM精确保留4个既有错误，其余零诊断。已发表的类型
不一致与候选失败严格分开，不把旧错误写成候选白名单。

1.0.0字段必填变为1.1.0可选是历史差异，本候选没有继续扩大推导。新测试在03提交上
3失败/1通过，实装额外复现旧TS legacy缺映射、tsconfig打包泄漏和旧NodeNext问题。
05代理/设备、06完整分发和8082 demo继续；当前统一test:package默认scope仍仅core/
chapter，专项安装命令的存在不代表全部包已加入该门槛。

04最终四组专项、975项完整CI及18项三引擎媒体回归通过；安装消费者证据、包哈希、
初始失败及明确限制见 [类型验证证据](baselines/ambilight-types-validation.json) 和
[实施记录](changes/2026-09-12-PKG-AMBILIGHT-04-types.md)。类型与两代导出具体风险已
关闭；当前待做范围为05/06，旧阶段记录保留其当时状态。
